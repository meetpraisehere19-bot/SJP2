const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Job = require('../models/Job');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all active jobs (public)
router.get('/', async (req, res) => {
  try {
    const { search, type, location, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };

    // Basic page/limit pagination for job list pages.
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const jobs = await Job.find(filter)
      .populate('employer', 'companyName companyLogo industry')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employer's own jobs (must be before /:id)
router.get('/employer/mine', auth, authorize('employer'), async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single job (public)
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'companyName companyLogo companyDescription companyWebsite industry');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create job (employer only)
router.post('/', auth, authorize('employer'), [
  body('title').trim().notEmpty(),
  body('description').notEmpty(),
  body('requirements').notEmpty(),
  body('location').trim().notEmpty(),
  body('type').isIn(['full-time', 'part-time', 'internship', 'contract', 'remote'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user.isApproved) {
      // Employer accounts must be approved by admin before posting.
      return res.status(403).json({ message: 'Your employer account is pending approval' });
    }

    const job = new Job({ ...req.body, employer: req.user._id });
    await job.save();
    await job.populate('employer', 'companyName companyLogo industry');
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job (employer - own jobs only)
router.put('/:id', auth, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, employer: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const allowed = ['title', 'description', 'requirements', 'responsibilities', 'location', 'type', 'salary', 'skills', 'experience', 'deadline', 'isActive'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job (employer - own jobs only)
router.delete('/:id', auth, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
