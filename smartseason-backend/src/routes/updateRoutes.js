const express = require('express');
const {
  createUpdate,
  getFieldUpdates,
  getAgentUpdates,
} = require('../controllers/updateController');
const { protect, agentOnly } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create update (Agent only)
router.post('/', agentOnly, createUpdate);

// Get updates for a field
router.get('/field/:fieldId', getFieldUpdates);

// Get all updates by agent
router.get('/agent/my-updates', getAgentUpdates);

module.exports = router;
