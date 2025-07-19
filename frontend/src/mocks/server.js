import { setupServer } from 'msw/node';
import { rest } from 'msw';

const handlers = [
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        token: 'mock-jwt-token',
        user: {
          _id: '1',
          username: 'testuser',
          email: 'test@example.com'
        }
      })
    );
  }),

  rest.get('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          _id: '1',
          title: 'Test Task',
          status: 'todo',
          team: '1'
        }
      ])
    );
  })
];

export const server = setupServer(...handlers);