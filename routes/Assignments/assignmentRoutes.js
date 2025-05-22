const express = require("express");
const router = express.Router();
const assignmentController = require("../../controllers/Assigments/assignmentController");

// Routes for assignments
router.post("/", assignmentController.createAssignment);
router.get("/", assignmentController.getAssignments);
router.get("/assignments/createdBy/:createdBy", assignmentController.getAssignmentsByCreatedBy);
router.get("/:id", assignmentController.getAssignmentById);
router.put("/:id", assignmentController.updateAssignment);
router.delete("/:id", assignmentController.deleteAssignment);

module.exports = router;
