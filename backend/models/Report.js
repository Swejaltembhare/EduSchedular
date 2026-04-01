const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Report title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: [
      'Faculty Workload',
      'Classroom Utilization',
      'Schedule Conflicts',
      'Attendance Analysis',
      'Resource Allocation',
      'Academic Performance',
      'Custom'
    ],
    required: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  parameters: {
    dateRange: {
      start: Date,
      end: Date
    },
    departments: [String],
    filters: mongoose.Schema.Types.Mixed
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: mongoose.Schema.Types.Mixed, // Store report data
  format: {
    type: String,
    enum: ['PDF', 'Excel', 'CSV', 'HTML'],
    default: 'PDF'
  },
  status: {
    type: String,
    enum: ['Generating', 'Completed', 'Failed'],
    default: 'Generating'
  },
  fileUrl: String,
  fileSize: Number,
  downloadCount: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  schedule: {
    type: {
      type: String,
      enum: ['Once', 'Daily', 'Weekly', 'Monthly']
    },
    nextRun: Date
  }
}, {
  timestamps: true
});

// Index for efficient searching
reportSchema.index({ type: 1, 'parameters.dateRange.start': 1, generatedBy: 1 });

module.exports = mongoose.model('Report', reportSchema);