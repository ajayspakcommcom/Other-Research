const express = require('express');
const { body, validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const logger = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validateUser = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .trim(),
  body('lastName')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .trim(),
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Cache helper
const getCacheKey = (key) => `users:${key}`;

// GET /api/users - Get all users with pagination
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    // Build search query
    const searchQuery = search ? {
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    } : {};

    // Check cache first
    const cacheKey = getCacheKey(`all:${page}:${limit}:${search}`);
    if (req.app.locals.redis) {
      try {
        const cached = await req.app.locals.redis.get(cacheKey);
        if (cached) {
          logger.info('Users retrieved from cache', { cacheKey });
          return res.json(JSON.parse(cached));
        }
      } catch (error) {
        logger.warn('Cache read error', { error: error.message });
      }
    }

    const [users, total] = await Promise.all([
      User.find({ ...searchQuery, isActive: true })
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({ ...searchQuery, isActive: true }),
    ]);

    const result = {
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };

    // Cache the result
    if (req.app.locals.redis) {
      try {
        await req.app.locals.redis.setEx(cacheKey, 300, JSON.stringify(result)); // 5 minutes
      } catch (error) {
        logger.warn('Cache write error', { error: error.message });
      }
    }

    logger.info('Users retrieved', { count: users.length, total, page });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check cache first
    const cacheKey = getCacheKey(id);
    if (req.app.locals.redis) {
      try {
        const cached = await req.app.locals.redis.get(cacheKey);
        if (cached) {
          logger.info('User retrieved from cache', { userId: id });
          return res.json(JSON.parse(cached));
        }
      } catch (error) {
        logger.warn('Cache read error', { error: error.message });
      }
    }

    const user = await User.findById(id).select('-password');

    if (!user || !user.isActive) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }

    const result = {
      success: true,
      data: user,
    };

    // Cache the result
    if (req.app.locals.redis) {
      try {
        await req.app.locals.redis.setEx(cacheKey, 300, JSON.stringify(result)); // 5 minutes
      } catch (error) {
        logger.warn('Cache write error', { error: error.message });
      }
    }

    logger.info('User retrieved', { userId: id });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/users - Create new user
router.post('/', validateUser, handleValidationErrors, async (req, res, next) => {
  try {
    const {
      username, email, password, firstName, lastName, role,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmailOrUsername(email);
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'User with this email or username already exists',
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || 'user',
    });

    await user.save();

    // Clear cache
    if (req.app.locals.redis) {
      try {
        const pattern = getCacheKey('*');
        const keys = await req.app.locals.redis.keys(pattern);
        if (keys.length > 0) {
          await req.app.locals.redis.del(keys);
        }
      } catch (error) {
        logger.warn('Cache clear error', { error: error.message });
      }
    }

    logger.info('User created', { userId: user._id, username: user.username });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove sensitive fields from updates
    delete updates.password;
    delete updates._id;
    delete updates.__v;

    const user = await User.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).select('-password');

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }

    // Clear cache
    if (req.app.locals.redis) {
      try {
        const pattern = getCacheKey('*');
        const keys = await req.app.locals.redis.keys(pattern);
        if (keys.length > 0) {
          await req.app.locals.redis.del(keys);
        }
      } catch (error) {
        logger.warn('Cache clear error', { error: error.message });
      }
    }

    logger.info('User updated', { userId: id });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id - Soft delete user
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true },
    ).select('-password');

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }

    // Clear cache
    if (req.app.locals.redis) {
      try {
        const pattern = getCacheKey('*');
        const keys = await req.app.locals.redis.keys(pattern);
        if (keys.length > 0) {
          await req.app.locals.redis.del(keys);
        }
      } catch (error) {
        logger.warn('Cache clear error', { error: error.message });
      }
    }

    logger.info('User deleted', { userId: id });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
