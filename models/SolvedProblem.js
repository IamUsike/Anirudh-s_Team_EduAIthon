import { Schema, model, models } from "mongoose";

const SubmissionSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  complexity: {
    type: [String], // ["O(n)", "O(1)"]
    required: true,
  },
  submissionTime: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  passedTestCases: {
    type: Number,
    required: true,
  },
});

const SolvedProblemSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "UserInfo",
    required: true,
  },
  problem: {
    type: Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  contest: {
    type: Schema.Types.ObjectId,
    ref: "Contest",
  },
  source: {
    type: String,
    enum: ["practice", "lesson", "module", "finalQuiz"],
    required: true,
  },
  star: {
    type: Boolean,
    default: false,
  },
  solution: [SubmissionSchema],
});

export const SolvedProblem =
  models?.SolvedProblem || model("SolvedProblem", SolvedProblemSchema);

