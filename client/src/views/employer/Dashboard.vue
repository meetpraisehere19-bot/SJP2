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
        <h1>Employer Dashboard</h1>
        <p>Manage your job postings and applicants</p>
      </div>

      <div v-if="!store.user.isApproved" class="alert alert-error" style="margin-bottom:2rem">
        Your employer account is pending admin approval. You won't be able to post jobs until approved.
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ jobs.length }}</div>
          <div class="stat-label">Posted Jobs</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ activeJobs }}</div>
          <div class="stat-label">Active Jobs</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ totalApplicants }}</div>
          <div class="stat-label">Total Applicants</div>
        </div>
      </div>

      <h2 style="margin-bottom:1rem">Recent Job Postings</h2>
      <div class="loading" v-if="loading"><div class="spinner"></div></div>
      <div v-else-if="jobs.length">
        <div class="card" v-for="job in jobs.slice(0, 5)" :key="job._id" style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center">
          <div>
            <strong>{{ job.title }}</strong>
            <div style="font-size:0.8125rem;color:var(--gray-500)">{{ job.location }} &middot; {{ job.type }} &middot; {{ job.applicantCount }} applicants</div>
          </div>
          <div style="display:flex;gap:0.5rem;align-items:center">
            <span class="badge" :class="job.isActive ? 'badge-success' : 'badge-danger'">{{ job.isActive ? 'Active' : 'Closed' }}</span>
            <router-link :to="`/employer/applications/${job._id}`" class="btn btn-secondary btn-sm">View Applicants</router-link>
          </div>
        </div>
      </div>
      <div class="empty-state" v-else>
        <p>You haven't posted any jobs yet.</p>
        <router-link to="/employer/post-job" class="btn btn-primary" style="margin-top:1rem">Post a Job</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api'
import { store } from '../../store'

export default {
  data() {
    return { store, jobs: [], loading: true }
  },
  computed: {
    activeJobs() { return this.jobs.filter(j => j.isActive).length },
    totalApplicants() { return this.jobs.reduce((s, j) => s + (j.applicantCount || 0), 0) }
  },
  async mounted() {
    try {
      const { data } = await api.get('/jobs/employer/mine')
      this.jobs = data
    } catch (err) {
      console.error(err)
    }
    this.loading = false
  }
}
</script>
