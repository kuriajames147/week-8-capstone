const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTeams,
  createTeam,
  addMember
} = require('../controllers/teamController');

// Routes for /api/teams
router.route('/')
  .get(protect, getTeams)
  .post(protect, createTeam);

router.route('/:id/members')
  .post(protect, addMember);

module.exports = router;