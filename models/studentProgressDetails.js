const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  questionCount: { type: Number, default: 0, min: 0 },
  correctCount: { type: Number, default: 0, min: 0 }
});
const studentProgressDetailsSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  progress: {
    remember: {
      questionCount: Number,
      correctCount: Number
    },
    understand: {
      questionCount: Number,
      correctCount: Number
    },
    apply: {
      questionCount: Number,
      correctCount: Number
    },
    analyse: {
      questionCount: Number,
      correctCount: Number
    },
    evaluate: {
      questionCount: Number,
      correctCount: Number
    }
  },
  totalTimeInSeconds: Number,
  score: Number
});

studentProgressDetailsSchema.index({ studentId: 1, chapterId: 1, level: 1 }, { unique: true });

// Optional: add score pre-save logic
studentProgressDetailsSchema.pre('save', function (next) {
  const { remember, understand, apply, analyse, evaluate } = this.progress;
  let total = 0;
  let correct = 0;

  [remember, understand, apply, analyse, evaluate].forEach(section => {
    total += section.questionCount || 0;
    correct += section.correctCount || 0;
  });

  this.score = total > 0 ? Math.round((correct / total) * 100) : 0;
  next();
});

module.exports = mongoose.model('StudentProgressDetails', studentProgressDetailsSchema);
