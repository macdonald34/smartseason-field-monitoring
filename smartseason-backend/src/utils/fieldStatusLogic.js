/**
 * Field Status Logic
 * Determines the status of a field based on crop stage and days since planting
 * 
 * Field Status Rules:
 * 1. Completed: When crop stage is "Harvested"
 * 2. At Risk: When days since planting > 90 and stage is not "Ready" or "Harvested"
 * 3. Active: All other cases (normal operation)
 */

function calculateFieldStatus(stage, plantingDate) {
  // Rule 1: Check if harvested
  if (stage === "Harvested") {
    return "Completed";
  }

  // Rule 2: Check if at risk (overdue)
  const plantingDateObj = new Date(plantingDate);
  const currentDate = new Date();
  const daysSincePlanting = Math.floor(
    (currentDate - plantingDateObj) / (1000 * 60 * 60 * 24)
  );

  if (daysSincePlanting > 90 && stage !== "Ready" && stage !== "Harvested") {
    return "At Risk";
  }

  // Rule 3: Active
  return "Active";
}

module.exports = { calculateFieldStatus };
