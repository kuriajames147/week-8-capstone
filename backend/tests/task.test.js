// tests/task.test.js
const request = require('supertest');
const app = require('../app');
const Task = require('../models/Task');
const User = require('../models/User');
const Team = require('../models/Team');

describe('Task API', () => {
  let user, team, task, token;
  
  beforeAll(async () => {
    // Create test user
    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Create test team
    team = await Team.create({
      name: 'Test Team',
      createdBy: user._id,
      members: [user._id]
    });
    
    // Login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    token = res.body.token;
  });
  
  test('Create task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        team: team._id,
        assignedTo: [user._id]
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe('Test Task');
    task = res.body.data;
  });
  
  test('Get tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});