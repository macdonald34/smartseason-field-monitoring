const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema(
  {
    fieldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      enum: ["Planted", "Growing", "Ready", "Harvested"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Update", updateSchema);
