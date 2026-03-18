const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Student: Apply to a job
router.post('/', auth, authorize('student'), upload.single('resume'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or no longer active' });
    }

    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    const existing = await Application.findOne({ job: jobId, student: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = new Application({
      job: jobId,
      student: req.user._id,
      coverLetter,
      resume: req.file ? req.file.filename : req.user.resume
    });

    await application.save();
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Student: Get my applications
router.get('/mine', auth, authorize('student'), async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'employer', select: 'companyName companyLogo' }
      })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Employer: Get applications for a specific job
router.get('/job/:jobId', auth, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, employer: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const applications = await Application.find({ job: req.params.jobId })
      .populate('student', 'firstName lastName email phone university major graduationYear skills bio resume')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Employer: Update application status
router.put('/:id/status', auth, authorize('employer'), async (req, res) => {
  try {
    const { status, employerNotes } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    application.status = status;
    if (employerNotes) application.employerNotes = employerNotes;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
