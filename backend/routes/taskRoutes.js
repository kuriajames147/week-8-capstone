const express = require('express');
const {
  getTasks,
  getTeamTasks,
  createTask,
  updateTaskStatus
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/team/:teamId')
  .get(getTeamTasks);

router.route('/:id/status')
  .put(updateTaskStatus);

module.exports = router;