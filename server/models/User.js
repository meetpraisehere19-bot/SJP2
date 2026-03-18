const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'employer', 'admin'],
    required: true
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  // Student-specific fields
  university: { type: String, trim: true },
  major: { type: String, trim: true },
  graduationYear: { type: Number },
  resume: { type: String }, // file path
  skills: [{ type: String }],
  bio: { type: String },
  // Employer-specific fields
  companyName: { type: String, trim: true },
  companyWebsite: { type: String, trim: true },
  companyDescription: { type: String },
  companyLogo: { type: String },
  industry: { type: String, trim: true },
  // Status
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: function() { return this.role !== 'employer'; } }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
