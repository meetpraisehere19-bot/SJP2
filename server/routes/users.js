const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Update profile  
router.put('/profile', auth, upload.single('file'), async (req, res) => {
  try {
    const allowed = ['firstName', 'lastName', 'phone', 'bio', 'university', 'major', 'graduationYear', 'skills', 'companyName', 'companyWebsite', 'companyDescription', 'industry'];
    const updates = {};

    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'skills' && typeof req.body[field] === 'string') {
          updates[field] = req.body[field].split(',').map(s => s.trim());
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    if (req.file) {
      if (req.user.role === 'student') updates.resume = req.file.filename;
      if (req.user.role === 'employer') updates.companyLogo = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    req.user.password = newPassword;
    await req.user.save();
    res.json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
