const mongoose = require('mongoose');
require('dotenv').config();
const Job = require('../models/Job');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sjp2_employment';
  console.log('Connecting to', uri);
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const res = await Job.updateMany({ currency: { $ne: 'GBP' } }, { $set: { currency: 'GBP' } });
  console.log(`Matched ${res.matchedCount}, modified ${res.modifiedCount} job documents.`);

  await mongoose.disconnect();
  console.log('Disconnected.');
}

run().catch(err => { console.error(err); process.exit(1); });