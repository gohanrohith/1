const mongoose = require('mongoose');

const questionunderstandingSchema = new mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',  // Reference to Chapter model
        required: true
    },
    question: {
        type: String,
        required: function() {
            return this.questionType === 'Comprehension'; // Only required for Comprehension questions
        }
    },
    paragraph: {
        type: String,
        required: function() {
            return this.questionType === 'Comprehension'; // Only required for Comprehension questions
        }
    },
    questionType: {
        type: String,
        enum: ['MCQ', 'Comprehension'],
        required: true
    },
    options: {
        A: { 
            text: { type: String },
            image: { type: String } // Base64 encoded image
        },
        B: { 
            text: { type: String },
            image: { type: String } // Base64 encoded image
        },
        C: { 
            text: { type: String },
            image: { type: String } // Base64 encoded image
        },
        D: { 
            text: { type: String },
            image: { type: String } // Base64 encoded image
        }
    },
    correctAnswer: {
        type: [String],  // Change from single string to array of strings
        enum: ['A', 'B', 'C', 'D'],
        required: function() {
            return this.questionType === 'MCQ'; // Only required for MCQ questions
        }
    },
    subQuestions: [{
        subQuestion: { 
            type: String, 
            required: function() { 
                return this.parent().questionType === 'Comprehension'; 
            }
        },
        options: {
            A: { 
                text: { type: String, required: true },
                image: { type: String } // Base64 encoded image
            },
            B: { 
                text: { type: String, required: true },
                image: { type: String } // Base64 encoded image
            },
            C: { 
                text: { type: String, required: true },
                image: { type: String } // Base64 encoded image
            },
            D: { 
                text: { type: String, required: true },
                image: { type: String } // Base64 encoded image
            }
        },
        correctAnswer: { 
            type: [String],  // Change from single string to array of strings
            enum: ['A', 'B', 'C', 'D'], 
            required: true 
        }
    }],
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',  // Reference to Admin model
        required: false // Make this optional (not necessary to send)
    }
}, { timestamps: true });

module.exports = mongoose.model('Question_Understanding', questionunderstandingSchema);