const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Route files
const authRouter = require('./routes/authRoutes');
const taskRouter = require('./routes/taskRoutes');
const teamRouter = require('./routes/teamRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/teams', teamRouter);

// Error handler (will be created in utils/error.js)
app.use(require('./utils/error').errorHandler);

module.exports = app;