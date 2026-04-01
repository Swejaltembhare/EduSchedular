// const express = require('express');
// const router = express.Router();

// router.get('/', async (req, res) => {
//   try {
//     res.json([]);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   POST /api/reports/faculty-workload
// @desc    Generate faculty workload report
// @access  Private
router.post('/faculty-workload', reportController.generateFacultyWorkloadReport);

// @route   POST /api/reports/classroom-utilization
// @desc    Generate classroom utilization report
// @access  Private
router.post('/classroom-utilization', reportController.generateClassroomUtilizationReport);

// @route   POST /api/reports/timetable-conflicts
// @desc    Generate timetable conflicts report
// @access  Private
router.post('/timetable-conflicts', reportController.generateTimetableConflictsReport);

// @route   POST /api/reports/institutional
// @desc    Generate comprehensive institutional report
// @access  Private (Admin only)
router.post('/institutional', authorize('admin'), reportController.generateInstitutionalReport);

module.exports = router;