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
        <h1>Company Profile</h1>
        <p>Manage your company information</p>
      </div>

      <div class="alert alert-success" v-if="success">Profile updated!</div>
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
          <label>Company Name</label>
          <input class="form-control" v-model="form.companyName" required>
        </div>
        <div class="form-group">
          <label>Industry</label>
          <input class="form-control" v-model="form.industry" placeholder="Technology">
        </div>
        <div class="form-group">
          <label>Company Website</label>
          <input class="form-control" v-model="form.companyWebsite" placeholder="https://company.com">
        </div>
        <div class="form-group">
          <label>Company Description</label>
          <textarea class="form-control" v-model="form.companyDescription" rows="4" placeholder="Tell students about your company..."></textarea>
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input class="form-control" v-model="form.phone" placeholder="(555) 123-4567">
        </div>
        <div class="form-group">
          <label>Company Logo</label>
          <input type="file" @change="onFile" accept=".png,.jpg,.jpeg">
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
      form: { firstName: u.firstName, lastName: u.lastName, companyName: u.companyName || '', industry: u.industry || '', companyWebsite: u.companyWebsite || '', companyDescription: u.companyDescription || '', phone: u.phone || '' },
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
