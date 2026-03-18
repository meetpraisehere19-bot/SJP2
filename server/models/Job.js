const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  responsibilities: { type: String },
  location: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract', 'remote'],
    required: true
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'GBP' }
  },
  skills: [{ type: String }],
  experience: { type: String, trim: true },
  deadline: { type: Date },
  isActive: { type: Boolean, default: true },
  applicantCount: { type: Number, default: 0 }
}, { timestamps: true });

jobSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
