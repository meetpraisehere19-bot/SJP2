const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: { type: String },
  resume: { type: String }, // file path
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'interview', 'accepted', 'rejected'],
    default: 'pending'
  },
  employerNotes: { type: String }
}, { timestamps: true });

// Ensure a student can only apply once per job
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
