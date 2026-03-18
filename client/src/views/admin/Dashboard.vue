<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div style="padding:0 1.5rem 1rem;border-bottom:1px solid var(--gray-200);margin-bottom:1rem">
        <div style="font-weight:600;color:var(--gray-800)">Admin Panel</div>
        <div style="font-size:0.8125rem;color:var(--gray-400)">{{ store.user.email }}</div>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard">&#128200; Dashboard</router-link>
        <router-link to="/admin/users">&#128101; Manage Users</router-link>
        <router-link to="/admin/jobs">&#128188; All Jobs</router-link>
        <router-link to="/admin/applications">&#128196; All Applications</router-link>
      </nav>
    </aside>
    <div class="dashboard-content">
      <div class="page-header">
        <h1>Admin Dashboard</h1>
        <p>Platform overview and management</p>
      </div>

      <div class="loading" v-if="loading"><div class="spinner"></div></div>

      <template v-else>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalStudents }}</div>
            <div class="stat-label">Students</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalEmployers }}</div>
            <div class="stat-label">Employers</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalJobs }}</div>
            <div class="stat-label">Jobs</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalApplications }}</div>
            <div class="stat-label">Applications</div>
          </div>
          <div class="stat-card" v-if="stats.pendingEmployers > 0" style="border-left:4px solid var(--warning)">
            <div class="stat-number" style="color:var(--warning)">{{ stats.pendingEmployers }}</div>
            <div class="stat-label">Pending Employer Approvals</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
          <div class="card">
            <h3 style="margin-bottom:1rem">Quick Actions</h3>
            <div style="display:flex;flex-direction:column;gap:0.75rem">
              <router-link to="/admin/users" class="btn btn-secondary">&#128101; Manage Users</router-link>
              <router-link to="/admin/jobs" class="btn btn-secondary">&#128188; View All Jobs</router-link>
              <router-link to="/admin/applications" class="btn btn-secondary">&#128196; View Applications</router-link>
            </div>
          </div>
          <div class="card">
            <h3 style="margin-bottom:1rem">System Status</h3>
            <div style="font-size:0.875rem;color:var(--gray-600)">
              <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--gray-100)">
                <span>Platform Status</span>
                <span class="badge badge-success">Active</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--gray-100)">
                <span>Total Users</span>
                <span>{{ stats.totalStudents + stats.totalEmployers }}</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding:0.5rem 0">
                <span>Active Job Listings</span>
                <span>{{ stats.totalJobs }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import api from '../../api'
import { store } from '../../store'

export default {
  data() {
    return { store, stats: {}, loading: true }
  },
  async mounted() {
    try {
      const { data } = await api.get('/admin/stats')
      this.stats = data
    } catch (err) {
      console.error(err)
    }
    this.loading = false
  }
}
</script>
