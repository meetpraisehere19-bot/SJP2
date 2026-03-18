const express = require('express');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(auth, authorize('admin'));

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalStudents, totalEmployers, totalJobs, totalApplications, pendingEmployers] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'employer' }),
      Job.countDocuments(),
      Application.countDocuments(),
      User.countDocuments({ role: 'employer', isApproved: false })
    ]);

    res.json({ totalStudents, totalEmployers, totalJobs, totalApplications, pendingEmployers });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);
    res.json({ users, total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject employer
router.put('/users/:id/approve', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isApproved = req.body.isApproved;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle user active status
router.put('/users/:id/toggle-active', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot deactivate admin' });

    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all jobs (admin view)
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('employer', 'companyName email')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete any job
router.delete('/jobs/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all applications (admin view)
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('student', 'firstName lastName email')
      .populate({ path: 'job', select: 'title', populate: { path: 'employer', select: 'companyName' } })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
