<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div style="padding:0 1.5rem 1rem;border-bottom:1px solid var(--gray-200);margin-bottom:1rem">
        <div style="font-weight:600;color:var(--gray-800)">{{ store.user.companyName || store.user.firstName }}</div>
        <div style="font-size:0.8125rem;color:var(--gray-400)">Employer</div>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/employer/dashboard">&#128200; Dashboard</router-link>
        <router-link to="/employer/post-job">&#10133; Post Job</router-link>
        <router-link to="/employer/jobs">&#128188; My Jobs</router-link>
        <router-link to="/employer/profile">&#127970; Company Profile</router-link>
      </nav>
    </aside>
    <div class="dashboard-content">
      <div class="page-header">
        <h1>Post a New Job</h1>
        <p>Fill in the details to create a job listing</p>
      </div>

      <div class="alert alert-success" v-if="success">Job posted successfully! <router-link to="/employer/jobs">View my jobs</router-link></div>
      <div class="alert alert-error" v-if="error">{{ error }}</div>

      <form @submit.prevent="postJob" class="card" style="max-width:700px">
        <div class="form-group">
          <label>Job Title *</label>
          <input class="form-control" v-model="form.title" required placeholder="e.g. Frontend Developer">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Job Type *</label>
            <select class="form-control" v-model="form.type" required>
              <option value="">Select type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div class="form-group">
            <label>Location *</label>
            <input class="form-control" v-model="form.location" required placeholder="e.g. New York, NY">
          </div>
        </div>
        <div class="form-group">
          <label>Description *</label>
          <textarea class="form-control" v-model="form.description" rows="5" required placeholder="Describe the role..."></textarea>
        </div>
        <div class="form-group">
          <label>Requirements *</label>
          <textarea class="form-control" v-model="form.requirements" rows="4" required placeholder="What qualifications are needed..."></textarea>
        </div>
        <div class="form-group">
          <label>Responsibilities</label>
          <textarea class="form-control" v-model="form.responsibilities" rows="4" placeholder="Key responsibilities..."></textarea>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Min Salary (£)</label>
            <input type="number" class="form-control" v-model="form.salaryMin" placeholder="40000">
          </div>
          <div class="form-group">
            <label>Max Salary (£)</label>
            <input type="number" class="form-control" v-model="form.salaryMax" placeholder="80000">
          </div>
        </div>
        <div class="form-group">
          <label>Required Skills (comma-separated)</label>
          <input class="form-control" v-model="skillsStr" placeholder="JavaScript, React, Node.js">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Experience Level</label>
            <input class="form-control" v-model="form.experience" placeholder="e.g. 1-3 years">
          </div>
          <div class="form-group">
            <label>Application Deadline</label>
            <input type="date" class="form-control" v-model="form.deadline">
          </div>
        </div>
        <button class="btn btn-primary btn-lg" :disabled="posting">{{ posting ? 'Posting...' : 'Post Job' }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../../api'
import { store } from '../../store'

export default {
  data() {
    return {
      store,
      form: { title: '', type: '', location: '', description: '', requirements: '', responsibilities: '', salaryMin: '', salaryMax: '', experience: '', deadline: '' },
      skillsStr: '',
      posting: false, success: false, error: ''
    }
  },
  methods: {
    async postJob() {
      this.posting = true
      this.success = false
      this.error = ''
      try {
        const payload = { ...this.form }
        if (this.skillsStr) payload.skills = this.skillsStr.split(',').map(s => s.trim())
        if (payload.salaryMin || payload.salaryMax) {
          payload.salary = { min: Number(payload.salaryMin) || 0, max: Number(payload.salaryMax) || 0 }
        }
        delete payload.salaryMin
        delete payload.salaryMax
        await api.post('/jobs', payload)
        this.success = true
        this.form = { title: '', type: '', location: '', description: '', requirements: '', responsibilities: '', salaryMin: '', salaryMax: '', experience: '', deadline: '' }
        this.skillsStr = ''
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to post job'
      }
      this.posting = false
    }
  }
}
</script>
