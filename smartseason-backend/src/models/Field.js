const mongoose = require("mongoose");
const { calculateFieldStatus } = require("../utils/fieldStatusLogic");

const fieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cropType: {
      type: String,
      required: true,
    },
    plantingDate: {
      type: Date,
      required: true,
    },
    stage: {
      type: String,
      enum: ["Planted", "Growing", "Ready", "Harvested"],
      default: "Planted",
    },
    assignedAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual for status calculation
fieldSchema.virtual("status").get(function () {
  return calculateFieldStatus(this.stage, this.plantingDate);
});

// Ensure virtuals are included in JSON
fieldSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Field", fieldSchema);
