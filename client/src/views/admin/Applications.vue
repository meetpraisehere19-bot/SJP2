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
        <h1>All Applications</h1>
        <p>Overview of all job applications on the platform</p>
      </div>

      <div class="loading" v-if="loading"><div class="spinner"></div></div>

      <div class="table-wrapper" v-else>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Job</th>
              <th>Company</th>
              <th>Status</th>
              <th>Applied</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in applications" :key="app._id">
              <td>{{ app.student?.firstName }} {{ app.student?.lastName }}</td>
              <td style="font-weight:500">{{ app.job?.title }}</td>
              <td>{{ app.job?.employer?.companyName }}</td>
              <td><span class="badge" :class="statusBadge(app.status)">{{ app.status }}</span></td>
              <td>{{ new Date(app.createdAt).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" v-if="!loading && !applications.length">
        <p>No applications on the platform yet.</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api'
import { store } from '../../store'

export default {
  data() {
    return { store, applications: [], loading: true }
  },
  async mounted() {
    try {
      const { data } = await api.get('/admin/applications')
      this.applications = data
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
