import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    leaveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
    },
    leaveFacultyId: {
      type: String,
    },
    leaveFacultyName: {
      type: String,
    },
    assignedTo: {
      type: String,
      required: true,
    },
    assignedToName: {
      type: String,
    },
    lectureDate: {
      type: String,
      required: true,
    },
    lectureTime: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: "General",
    },
    notes: {
      type: String,
    },
    duration: {
      type: String,
      default: "1 hour",
    },
    status: {
      type: String,
      enum: ["Assigned", "Completed", "Cancelled"],
      default: "Assigned",
    },
    department: {
      type: String,
    },
    assignedBy: {
      type: String,
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
    completedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);