const Report = require("../models/Report");
const Timetable = require("../models/Timetable");
const Faculty = require("../models/Faculty");
const Classroom = require("../models/Classroom");

// @desc    Generate faculty workload report
// @route   POST /api/reports/faculty-workload
// @access  Private
exports.generateFacultyWorkloadReport = async (req, res, next) => {
  try {
    const { startDate, endDate, department } = req.body;

    let matchStage = {};

    if (department && department !== "All Departments") {
      matchStage.department = department;
    }

    const workloadReport = await Faculty.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          name: "$userInfo.name",
          employeeId: 1,
          department: 1,
          designation: 1,
          currentWorkload: 1,
          maxWorkload: 1,
          workloadPercentage: {
            $multiply: [{ $divide: ["$currentWorkload", "$maxWorkload"] }, 100],
          },
          status: {
            $cond: {
              if: { $gte: ["$currentWorkload", "$maxWorkload"] },
              then: "Overloaded",
              else: {
                $cond: {
                  if: {
                    $gte: [
                      "$currentWorkload",
                      { $multiply: ["$maxWorkload", 0.8] },
                    ],
                  },
                  then: "High",
                  else: "Normal",
                },
              },
            },
          },
        },
      },
      { $sort: { workloadPercentage: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: workloadReport,
      generatedAt: new Date(),
      filters: { startDate, endDate, department },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate classroom utilization report
// @route   POST /api/reports/classroom-utilization
// @access  Private
exports.generateClassroomUtilizationReport = async (req, res, next) => {
  try {
    const { timeframe = "week" } = req.body;

    const utilizationReport = await Classroom.aggregate([
      {
        $project: {
          code: 1,
          name: 1,
          capacity: 1,
          building: 1,
          type: 1,
          status: 1,
          currentUtilization: 1,
          utilizationStatus: {
            $cond: {
              if: { $gte: ["$utilization.current", 80] },
              then: "High",
              else: {
                $cond: {
                  if: { $gte: ["$utilization.current", 50] },
                  then: "Medium",
                  else: "Low",
                },
              },
            },
          },
        },
      },
      { $sort: { currentUtilization: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: utilizationReport,
      generatedAt: new Date(),
      timeframe,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate timetable conflicts report
// @route   POST /api/reports/timetable-conflicts
// @access  Private
exports.generateTimetableConflictsReport = async (req, res, next) => {
  try {
    const { department, academicYear } = req.body;

    let matchStage = { status: "Approved" };

    if (department && department !== "All Departments") {
      matchStage.department = department;
    }

    if (academicYear) {
      matchStage.academicYear = academicYear;
    }

    const conflictsReport = await Timetable.aggregate([
      { $match: matchStage },
      {
        $project: {
          title: 1,
          department: 1,
          academicYear: 1,
          semester: 1,
          conflictCount: { $size: { $ifNull: ["$conflicts", []] } },
          conflicts: 1,
          generatedAt: "$createdAt",
        },
      },
      { $match: { conflictCount: { $gt: 0 } } },
      { $sort: { conflictCount: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: conflictsReport,
      generatedAt: new Date(),
      filters: { department, academicYear },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate comprehensive institutional report
// @route   POST /api/reports/institutional
// @access  Private
exports.generateInstitutionalReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;

    // Get counts for different entities
    const facultyCount = await Faculty.countDocuments({ isActive: true });
    const classroomCount = await Classroom.countDocuments({
      status: "Available",
    });
    const subjectCount = await Subject.countDocuments({ isActive: true });
    const batchCount = await Batch.countDocuments({ isActive: true });
    const timetableCount = await Timetable.countDocuments();

    // Get department-wise statistics
    const departmentStats = await Faculty.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$department",
          facultyCount: { $sum: 1 },
          avgWorkload: { $avg: "$workload.current" },
        },
      },
    ]);

    // Get timetable status distribution
    const timetableStats = await Timetable.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const institutionalReport = {
      summary: {
        facultyCount,
        classroomCount,
        subjectCount,
        batchCount,
        timetableCount,
        reportPeriod: { startDate, endDate },
      },
      departmentStats,
      timetableStats,
      generatedAt: new Date(),
    };

    res.status(200).json({
      success: true,
      data: institutionalReport,
    });
  } catch (error) {
    next(error);
  }
};
