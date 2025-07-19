import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers we may add during tests
afterEach(() => server.resetHandlers());

// Clean up after tests are done
afterAll(() => server.close());