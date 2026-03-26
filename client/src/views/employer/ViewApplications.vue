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
        <h1>Job Applicants</h1>
        <p>Review and manage applications for this position</p>
      </div>

      <div class="loading" v-if="loading"><div class="spinner"></div></div>

      <div v-else-if="applications.length">
        <div class="card" v-for="app in applications" :key="app._id" style="margin-bottom:1.25rem">
          <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:1rem">
            <div>
              <h3 style="font-size:1.0625rem;margin-bottom:0.25rem">{{ app.student?.firstName }} {{ app.student?.lastName }}</h3>
              <div style="font-size:0.8125rem;color:var(--gray-500);margin-bottom:0.5rem">
                {{ app.student?.email }} &middot; {{ app.student?.university || 'N/A' }} &middot; {{ app.student?.major || 'N/A' }}
              </div>
              <div v-if="app.student?.skills?.length" style="display:flex;flex-wrap:wrap;gap:0.25rem;margin-bottom:0.5rem">
                <span v-for="skill in app.student.skills" :key="skill" class="badge badge-primary" style="font-size:0.6875rem">{{ skill }}</span>
              </div>
              <div v-if="app.coverLetter" style="font-size:0.875rem;color:var(--gray-600);margin-top:0.5rem;border-left:3px solid var(--gray-200);padding-left:0.75rem">
                {{ app.coverLetter }}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:0.5rem;align-items:flex-end;min-width:180px">
              <span class="badge" :class="statusBadge(app.status)">{{ app.status }}</span>
              <select class="form-control" style="width:auto;font-size:0.8125rem" @change="updateStatus(app, $event.target.value)" :value="app.status">
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <small style="color:var(--gray-400)">Applied {{ new Date(app.createdAt).toLocaleDateString() }}</small>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" v-else>
        <p>No applications received for this position yet.</p>
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
      const { data } = await api.get(`/applications/job/${this.$route.params.jobId}`)
      this.applications = data
    } catch (err) {
      console.error(err)
    }
    this.loading = false
  },
  methods: {
    async updateStatus(app, status) {
      try {
        await api.put(`/applications/${app._id}/status`, { status })
        // Update local row immediately after successful save.
        app.status = status
      } catch (err) {
        console.error(err)
      }
    },
    statusBadge(status) {
      const map = { pending: 'badge-warning', reviewed: 'badge-info', shortlisted: 'badge-primary', interview: 'badge-primary', accepted: 'badge-success', rejected: 'badge-danger' }
      return map[status] || 'badge-primary'
    }
  }
}
</script>
