const Field = require('../models/Field');
const User = require('../models/User');

// Get all fields (Admin sees all, Agent sees assigned)
const getFields = async (req, res) => {
  try {
    let fields;

    if (req.user.role === 'admin') {
      fields = await Field.find().populate('assignedAgentId', 'name email');
    } else {
      fields = await Field.find({
        $or: [{ assignedAgentId: req.user.id }, { createdBy: req.user.id }],
      }).populate('assignedAgentId', 'name email');
    }

    // Calculate status for each field
    const fieldsWithStatus = fields.map((field) => ({
      ...field.toObject(),
      status: field.calculateStatus(),
    }));

    res.status(200).json(fieldsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create field (Admin only)
const createField = async (req, res) => {
  try {
    const { name, cropType, plantingDate } = req.body;

    if (!name || !cropType || !plantingDate) {
      return res
        .status(400)
        .json({ message: 'Please provide all required fields' });
    }

    const field = new Field({
      name,
      cropType,
      plantingDate,
      createdBy: req.user.id,
    });

    await field.save();

    res.status(201).json({
      message: 'Field created successfully',
      field: { ...field.toObject(), status: field.calculateStatus() },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update field
const updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    const field = await Field.findById(id);
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    if (stage) {
      field.stage = stage;
    }

    await field.save();

    res.status(200).json({
      message: 'Field updated successfully',
      field: { ...field.toObject(), status: field.calculateStatus() },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign field to agent (Admin only)
const assignField = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ message: 'Please provide agent ID' });
    }

    const field = await Field.findById(id);
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(400).json({ message: 'Invalid agent' });
    }

    field.assignedAgentId = agentId;
    await field.save();

    res.status(200).json({
      message: 'Field assigned successfully',
      field: await field.populate('assignedAgentId', 'name email'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete field (Admin only)
const deleteField = async (req, res) => {
  try {
    const { id } = req.params;

    const field = await Field.findByIdAndDelete(id);
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    res.status(200).json({ message: 'Field deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFields,
  createField,
  updateField,
  assignField,
  deleteField,
};
