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
        <h1>Welcome back, {{ store.user.firstName }}!</h1>
        <p>Here's a summary of your job search activity</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-label">Total Applications</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.pending }}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.shortlisted }}</div>
          <div class="stat-label">Shortlisted</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.accepted }}</div>
          <div class="stat-label">Accepted</div>
        </div>
      </div>

      <h2 style="margin-bottom:1rem">Recent Applications</h2>
      <div class="loading" v-if="loading"><div class="spinner"></div></div>
      <div v-else-if="applications.length">
        <div class="card" v-for="app in applications.slice(0, 5)" :key="app._id" style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center">
          <div>
            <strong>{{ app.job?.title }}</strong>
            <div style="font-size:0.8125rem;color:var(--gray-500)">{{ app.job?.employer?.companyName }} &middot; {{ new Date(app.createdAt).toLocaleDateString() }}</div>
          </div>
          <span class="badge" :class="statusBadge(app.status)">{{ app.status }}</span>
        </div>
      </div>
      <div class="empty-state" v-else>
        <p>You haven't applied to any jobs yet.</p>
        <router-link to="/jobs" class="btn btn-primary" style="margin-top:1rem">Browse Jobs</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api'
import { store } from '../../store'

export default {
  data() {
    return { store, applications: [], loading: true, stats: { total: 0, pending: 0, shortlisted: 0, accepted: 0 } }
  },
  async mounted() {
    try {
      const { data } = await api.get('/applications/mine')
      this.applications = data
      this.stats.total = data.length
      this.stats.pending = data.filter(a => a.status === 'pending').length
      this.stats.shortlisted = data.filter(a => ['shortlisted', 'interview'].includes(a.status)).length
      this.stats.accepted = data.filter(a => a.status === 'accepted').length
    } catch (err) {
      console.error(err)
    }
    this.loading = false
  },
  methods: {
    statusBadge(status) {
      const map = { pending: 'badge-warning', reviewed: 'badge-info', shortlisted: 'badge-primary', interview: 'badge-primary', accepted: 'badge-success', rejected: 'badge-danger' }
      return map[status] || 'badge-primary'
    }
  }
}
</script>
