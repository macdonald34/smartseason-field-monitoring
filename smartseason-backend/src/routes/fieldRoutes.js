const express = require('express');
const {
  getFields,
  createField,
  updateField,
  assignField,
  deleteField,
} = require('../controllers/fieldController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all fields
router.get('/', getFields);

// Create field (Admin only)
router.post('/', adminOnly, createField);

// Update field
router.put('/:id', updateField);

// Assign field to agent (Admin only)
router.put('/:id/assign', adminOnly, assignField);

// Delete field (Admin only)
router.delete('/:id', adminOnly, deleteField);

module.exports = router;
