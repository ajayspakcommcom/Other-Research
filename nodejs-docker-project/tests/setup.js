// Jest setup file
require('dotenv').config({ path: '.env.test' });

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test_app';

// Global test timeout
jest.setTimeout(30000);

// Suppress console logs during tests unless needed
if (process.env.VERBOSE_TESTS !== 'true') {
  console.log = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
}

// Global teardown
afterAll(async () => {
  // Add any global cleanup here if needed
  await new Promise(resolve => setTimeout(resolve, 500));
});