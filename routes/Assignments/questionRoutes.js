const express = require("express");
const router = express.Router();
const questionController = require("../../controllers/Assigments/questionController");

// Routes for questions
router.post("/", questionController.createQuestion);
router.get("/:assignmentId", questionController.getQuestionsByAssignment);
router.get("/question/:id", questionController.getQuestionById);
router.put("/question/:id", questionController.updateQuestion);
router.delete("/question/:id", questionController.deleteQuestion);
router.post("/multipleupload",questionController.createMultipleQuestions);
module.exports = router;
