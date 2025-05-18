import { model, models, Schema } from "mongoose";

const CourseQuestionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["multiple-choice", "true-false", "coding", "short-answer"],
    default: "multiple-choice",
    required: true,
  },
  options: [
    {
      text: String,
      isCorrect: Boolean,
    },
  ],
  correctAnswer: {
    type: String, // For non-multiple choice questions
  },
  points: {
    type: Number,
    default: 10,
  },
  explanation: {
    type: String,
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
});

const LessonSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  questions: [CourseQuestionSchema],
  completionCriteria: {
    type: String,
    enum: ["view", "quiz-pass", "both"],
    default: "both",
  },
  passingScore: {
    type: Number,
    default: 70, // Percentage required to pass
  },
});

const ModuleSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lessons: [LessonSchema],
  finalQuiz: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    questions: [CourseQuestionSchema],
    passingScore: {
      type: Number,
      default: 70,
    },
  },
});

const CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  thumbnail: {
    type: String,
    default: "",
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  modules: [ModuleSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Course = models?.Course || model("Course", CourseSchema);
