const mongoose = require('mongoose')

const ScheduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courses: [String],
  faculty: [String],
  classrooms: [String],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Schedule', ScheduleSchema)