import express from "express";
import Assignment from "../models/Assignment.js";

const router = express.Router();

// GET /api/assignments - get all assignments
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching assignments",
      error: error.message,
    });
  }
});

// POST /api/assignments - create a new assignment
router.post("/", async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/assignments/leave/:leaveId - get assignments by leave id
// NOTE: defined before "/:id" so "leave" isn't treated as an :id
router.get("/leave/:leaveId", async (req, res) => {
  try {
    const assignments = await Assignment.find({
      leaveId: req.params.leaveId,
    }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error("Error fetching assignments by leave:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching assignments by leave",
      error: error.message,
    });
  }
});

// GET /api/assignments/faculty/:facultyId - get assignments assigned to a faculty
router.get("/faculty/:facultyId", async (req, res) => {
  try {
    const assignments = await Assignment.find({
      assignedTo: req.params.facultyId,
    }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error("Error fetching assignments by faculty:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching assignments by faculty",
      error: error.message,
    });
  }
});

// GET /api/assignments/:id - get a single assignment
router.get("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }
    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching assignment",
      error: error.message,
    });
  }
});

// PUT /api/assignments/:id - update an assignment
router.put("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({
      success: false,
      message: "Error updating assignment",
      error: error.message,
    });
  }
});

// DELETE /api/assignments/:id - delete an assignment
router.delete("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting assignment",
      error: error.message,
    });
  }
});

export default router;