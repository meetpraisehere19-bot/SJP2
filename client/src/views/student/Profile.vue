<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div style="padding:0 1.5rem 1rem;border-bottom:1px solid var(--gray-200);margin-bottom:1rem">
        <div style="font-weight:600;color:var(--gray-800)">{{ store.user.firstName }} {{ store.user.lastName }}</div>
        <div style="font-size:0.8125rem;color:var(--gray-400)">Student</div>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/student/dashboard">&#128200; Dashboard</router-link>
        <router-link to="/jobs">&#128270; Browse Jobs</router-link>
        <router-link to="/student/applications">&#128196; My Applications</router-link>
        <router-link to="/student/profile">&#128100; Profile</router-link>
      </nav>
    </aside>
    <div class="dashboard-content">
      <div class="page-header">
        <h1>My Profile</h1>
        <p>Manage your student profile</p>
      </div>

      <div class="alert alert-success" v-if="success">Profile updated successfully!</div>
      <div class="alert alert-error" v-if="error">{{ error }}</div>

      <form @submit.prevent="saveProfile" class="card" style="max-width:640px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>First Name</label>
            <input class="form-control" v-model="form.firstName" required>
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input class="form-control" v-model="form.lastName" required>
          </div>
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input class="form-control" v-model="form.phone" placeholder="(555) 123-4567">
        </div>
        <div class="form-group">
          <label>University</label>
          <input class="form-control" v-model="form.university">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Major</label>
            <input class="form-control" v-model="form.major">
          </div>
          <div class="form-group">
            <label>Graduation Year</label>
            <input type="number" class="form-control" v-model="form.graduationYear">
          </div>
        </div>
        <div class="form-group">
          <label>Skills (comma-separated)</label>
          <input class="form-control" v-model="skillsStr" placeholder="JavaScript, Python, React">
        </div>
        <div class="form-group">
          <label>Bio</label>
          <textarea class="form-control" v-model="form.bio" rows="4" placeholder="Tell employers about yourself..."></textarea>
        </div>
        <div class="form-group">
          <label>Resume (PDF/DOC)</label>
          <input type="file" @change="onFile" accept=".pdf,.doc,.docx">
          <small v-if="store.user.resume" style="color:var(--gray-400)">Current resume on file</small>
        </div>
        <button class="btn btn-primary" :disabled="saving">{{ saving ? 'Saving...' : 'Save Profile' }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../../api'
import { store } from '../../store'

export default {
  data() {
    const u = store.user
    return {
      store,
      form: { firstName: u.firstName, lastName: u.lastName, phone: u.phone || '', university: u.university || '', major: u.major || '', graduationYear: u.graduationYear || '', bio: u.bio || '' },
      skillsStr: (u.skills || []).join(', '),
      file: null, saving: false, success: false, error: ''
    }
  },
  methods: {
    onFile(e) { this.file = e.target.files[0] },
    async saveProfile() {
      this.saving = true
      this.success = false
      this.error = ''
      try {
        const fd = new FormData()
        Object.keys(this.form).forEach(k => fd.append(k, this.form[k]))
        fd.append('skills', this.skillsStr)
        if (this.file) fd.append('file', this.file)
        const { data } = await api.put('/users/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        store.updateUser(data)
        this.success = true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update profile'
      }
      this.saving = false
    }
  }
}
</script>
