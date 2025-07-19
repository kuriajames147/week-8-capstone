const Task = require('../models/Task');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  const tasks = await Task.find({
    $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }]
  }).populate('createdBy assignedTo team');

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get tasks by team
// @route   GET /api/tasks/team/:teamId
// @access  Private
exports.getTeamTasks = asyncHandler(async (req, res, next) => {
  const tasks = await Task.find({ team: req.params.teamId })
    .populate('createdBy assignedTo team');

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;
  
  const task = await Task.create(req.body);
  
  // Emit real-time update
  req.io.to(task.team.toString()).emit('taskCreated', task);
  
  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
exports.updateTaskStatus = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);
  
  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }
  
  // Make sure user is task creator or assigned to task
  if (task.createdBy.toString() !== req.user.id && 
      !task.assignedTo.includes(req.user.id)) {
    return next(new ErrorResponse(`Not authorized to update this task`, 401));
  }
  
  task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
    new: true,
    runValidators: true
  }).populate('createdBy assignedTo team');
  
  // Emit real-time update
  req.io.to(task.team.toString()).emit('taskUpdated', task);
  
  res.status(200).json({
    success: true,
    data: task
  });
});