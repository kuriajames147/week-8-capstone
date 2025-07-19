const Team = require('../models/Team');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all teams for user
// @route   GET /api/teams
// @access  Private
exports.getTeams = asyncHandler(async (req, res, next) => {
  const teams = await Team.find({
    $or: [{ createdBy: req.user.id }, { members: req.user.id }]
  }).populate('createdBy members');

  res.status(200).json({
    success: true,
    count: teams.length,
    data: teams
  });
});

// @desc    Create team
// @route   POST /api/teams
// @access  Private
exports.createTeam = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;
  
  const team = await Team.create(req.body);
  
  // Add creator as member
  team.members.push(req.user.id);
  await team.save();
  
  // Emit real-time update
  req.io.to(team._id.toString()).emit('teamUpdated', team);
  
  res.status(201).json({
    success: true,
    data: team
  });
});

// @desc    Add member to team
// @route   POST /api/teams/:id/members
// @access  Private
exports.addMember = asyncHandler(async (req, res, next) => {
  let team = await Team.findById(req.params.id);
  
  if (!team) {
    return next(new ErrorResponse(`Team not found with id of ${req.params.id}`, 404));
  }
  
  // Make sure user is team creator
  if (team.createdBy.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to add members to this team`, 401));
  }
  
  // Check if user is already a member
  if (team.members.includes(req.body.userId)) {
    return next(new ErrorResponse(`User is already a member of this team`, 400));
  }
  
  team.members.push(req.body.userId);
  team = await team.save();
  
  // Emit real-time update
  req.io.to(team._id.toString()).emit('teamUpdated', team);
  
  res.status(200).json({
    success: true,
    data: team
  });
});