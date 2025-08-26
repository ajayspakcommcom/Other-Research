// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the application database
db = db.getSiblingDB('production_app');

// Create application user with read/write permissions
db.createUser({
  user: 'app_user',
  pwd: 'app_password_123',
  roles: [
    {
      role: 'readWrite',
      db: 'production_app'
    }
  ]
});

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'email', 'password', 'firstName', 'lastName'],
      properties: {
        username: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 50,
          description: 'must be a string between 3-50 characters and is required'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
          description: 'must be a valid email address and is required'
        },
        password: {
          bsonType: 'string',
          minLength: 6,
          description: 'must be a string of at least 6 characters and is required'
        },
        firstName: {
          bsonType: 'string',
          maxLength: 50,
          description: 'must be a string and is required'
        },
        lastName: {
          bsonType: 'string',
          maxLength: 50,
          description: 'must be a string and is required'
        },
        role: {
          enum: ['user', 'admin'],
          description: 'can only be one of the enum values'
        },
        isActive: {
          bsonType: 'bool',
          description: 'must be a boolean'
        }
      }
    }
  }
});

// Create indexes for performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ isActive: 1 });
db.users.createIndex({ createdAt: -1 });

// Create sessions collection for potential session management
db.createCollection('sessions');
db.sessions.createIndex({ sessionId: 1 }, { unique: true });
db.sessions.createIndex({ userId: 1 });
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create audit logs collection
db.createCollection('audit_logs');
db.audit_logs.createIndex({ userId: 1 });
db.audit_logs.createIndex({ action: 1 });
db.audit_logs.createIndex({ timestamp: -1 });

// Insert a default admin user
db.users.insertOne({
  username: 'admin',
  email: 'admin@example.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/ZogZWiQd4ApO2WZ4q', // bcrypt hash of 'admin123'
  firstName: 'System',
  lastName: 'Administrator',
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Print initialization status
print('MongoDB initialization completed successfully!');
print('Created database: production_app');
print('Created user: app_user');
print('Created collections: users, sessions, audit_logs');
print('Created indexes for performance');
print('Inserted default admin user (username: admin, password: admin123)');