const mongoose = require('mongoose');
const User = require('../src/models/User');

describe('User Model', () => {
  beforeAll(async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test_app';
    await mongoose.connect(MONGODB_URI);
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('User creation', () => {
    it('should create a valid user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.firstName).toBe(userData.firstName);
      expect(savedUser.lastName).toBe(userData.lastName);
      expect(savedUser.role).toBe('user'); // default value
      expect(savedUser.isActive).toBe(true); // default value
    });

    it('should hash password before saving', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.password).not.toBe(userData.password);
      expect(savedUser.password).toMatch(/^\$2[aby]\$/); // bcrypt pattern
    });

    it('should not save user without required fields', async () => {
      const user = new User({
        username: 'testuser'
        // missing required fields
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should not save user with invalid email', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    it('should not save duplicate email', async () => {
      const userData = {
        username: 'testuser1',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      // Create first user
      const user1 = new User(userData);
      await user1.save();

      // Try to create second user with same email
      const user2 = new User({
        ...userData,
        username: 'testuser2'
      });

      await expect(user2.save()).rejects.toThrow();
    });
  });

  describe('User methods', () => {
    let user;

    beforeEach(async () => {
      user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });
      await user.save();
    });

    describe('comparePassword', () => {
      it('should return true for correct password', async () => {
        const isMatch = await user.comparePassword('password123');
        expect(isMatch).toBe(true);
      });

      it('should return false for incorrect password', async () => {
        const isMatch = await user.comparePassword('wrongpassword');
        expect(isMatch).toBe(false);
      });
    });

    describe('fullName virtual', () => {
      it('should return full name', () => {
        expect(user.fullName).toBe('Test User');
      });
    });

    describe('Login attempts', () => {
      it('should increment login attempts', async () => {
        await user.incLoginAttempts();
        const updatedUser = await User.findById(user._id);
        expect(updatedUser.loginAttempts).toBe(1);
      });

      it('should lock account after max attempts', async () => {
        // Simulate failed login attempts
        for (let i = 0; i < 5; i++) {
          await user.incLoginAttempts();
          user = await User.findById(user._id);
        }

        expect(user.isLocked()).toBe(true);
        expect(user.lockUntil).toBeDefined();
      });

      it('should reset login attempts', async () => {
        await user.incLoginAttempts();
        await user.resetLoginAttempts();
        
        const updatedUser = await User.findById(user._id);
        expect(updatedUser.loginAttempts).toBeUndefined();
        expect(updatedUser.lockUntil).toBeUndefined();
      });
    });
  });

  describe('Static methods', () => {
    beforeEach(async () => {
      const users = [
        {
          username: 'user1',
          email: 'user1@example.com',
          password: 'password123',
          firstName: 'User',
          lastName: 'One'
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          password: 'password123',
          firstName: 'User',
          lastName: 'Two'
        }
      ];

      for (const userData of users) {
        const user = new User(userData);
        await user.save();
      }
    });

    describe('findByEmailOrUsername', () => {
      it('should find user by email', async () => {
        const user = await User.findByEmailOrUsername('user1@example.com');
        expect(user).toBeTruthy();
        expect(user.username).toBe('user1');
      });

      it('should find user by username', async () => {
        const user = await User.findByEmailOrUsername('user2');
        expect(user).toBeTruthy();
        expect(user.email).toBe('user2@example.com');
      });

      it('should return null for non-existent user', async () => {
        const user = await User.findByEmailOrUsername('nonexistent');
        expect(user).toBeNull();
      });
    });
  });

  describe('JSON transformation', () => {
    it('should not include password in JSON output', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const user = new User(userData);
      const savedUser = await user.save();
      const userJson = savedUser.toJSON();

      expect(userJson.password).toBeUndefined();
      expect(userJson.__v).toBeUndefined();
      expect(userJson.username).toBe(userData.username);
    });
  });
});