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
        <h1>My Applications</h1>
        <p>Track all your job applications</p>
      </div>

      <div class="loading" v-if="loading"><div class="spinner"></div></div>

      <div v-else-if="applications.length">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="app in applications" :key="app._id">
                <td>
                  <router-link :to="`/jobs/${app.job?._id}`" style="font-weight:500">{{ app.job?.title }}</router-link>
                </td>
                <td>{{ app.job?.employer?.companyName }}</td>
                <td>{{ new Date(app.createdAt).toLocaleDateString() }}</td>
                <td><span class="badge" :class="statusBadge(app.status)">{{ app.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="empty-state" v-else>
        <p>No applications yet.</p>
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
    return { store, applications: [], loading: true }
  },
  async mounted() {
    try {
      const { data } = await api.get('/applications/mine')
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
