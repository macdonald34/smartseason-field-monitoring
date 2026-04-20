const Update = require('../models/Update');
const Field = require('../models/Field');

// Create update (Agent only)
const createUpdate = async (req, res) => {
  try {
    const { fieldId, notes, stage } = req.body;

    if (!fieldId || !notes) {
      return res
        .status(400)
        .json({ message: 'Please provide field ID and notes' });
    }

    const field = await Field.findById(fieldId);
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    const update = new Update({
      fieldId,
      agentId: req.user.id,
      notes,
      stage: stage || field.stage,
    });

    await update.save();

    // Update field stage if provided
    if (stage) {
      field.stage = stage;
      await field.save();
    }

    res.status(201).json({
      message: 'Update created successfully',
      update: await update.populate('agentId', 'name email'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get updates for a field
const getFieldUpdates = async (req, res) => {
  try {
    const { fieldId } = req.params;

    const updates = await Update.find({ fieldId })
      .populate('agentId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all updates for agent
const getAgentUpdates = async (req, res) => {
  try {
    const updates = await Update.find({ agentId: req.user.id })
      .populate('fieldId', 'name cropType')
      .sort({ createdAt: -1 });

    res.status(200).json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUpdate,
  getFieldUpdates,
  getAgentUpdates,
};
