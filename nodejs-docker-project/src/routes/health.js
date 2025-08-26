const express = require('express');
const mongoose = require('mongoose');
const os = require('os');
const { StatusCodes } = require('http-status-codes');

const logger = require('../utils/logger');

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: 'OK',
    memory: process.memoryUsage(),
    cpu: os.loadavg(),
    hostname: os.hostname(),
    platform: os.platform(),
    nodeVersion: process.version,
    pid: process.pid,
    environment: process.env.NODE_ENV || 'development',
  };

  try {
    // Check MongoDB connection
    const mongoStatus = mongoose.connection.readyState;
    healthCheck.database = {
      mongodb: {
        status: mongoStatus === 1 ? 'connected' : 'disconnected',
        readyState: mongoStatus,
      },
    };

    // Check Redis connection if available
    if (req.app.locals.redis) {
      try {
        await req.app.locals.redis.ping();
        healthCheck.database.redis = {
          status: 'connected',
        };
      } catch (error) {
        healthCheck.database.redis = {
          status: 'disconnected',
          error: error.message,
        };
      }
    }

    // Determine overall health status
    const isHealthy = mongoStatus === 1
                     && (!req.app.locals.redis || healthCheck.database.redis.status === 'connected');

    if (isHealthy) {
      logger.info('Health check passed', { healthCheck });
      res.status(StatusCodes.OK).json(healthCheck);
    } else {
      logger.warn('Health check failed', { healthCheck });
      res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        ...healthCheck,
        status: 'UNHEALTHY',
      });
    }
  } catch (error) {
    logger.error('Health check error', { error: error.message, stack: error.stack });
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      ...healthCheck,
      status: 'ERROR',
      error: error.message,
    });
  }
});

// Readiness probe - more strict health check
router.get('/ready', async (req, res) => {
  try {
    // Check if MongoDB is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB not ready');
    }

    // Check if Redis is ready (if configured)
    if (req.app.locals.redis) {
      await req.app.locals.redis.ping();
    }

    res.status(StatusCodes.OK).json({
      status: 'READY',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Readiness check failed', { error: error.message });
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      status: 'NOT_READY',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Liveness probe - basic health check
router.get('/live', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: 'ALIVE',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
