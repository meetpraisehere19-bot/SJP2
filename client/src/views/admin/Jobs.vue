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
        <h1>All Job Listings</h1>
        <p>View and manage all jobs on the platform</p>
      </div>

      <div class="loading" v-if="loading"><div class="spinner"></div></div>

      <div class="table-wrapper" v-else>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Employer</th>
              <th>Type</th>
              <th>Applicants</th>
              <th>Status</th>
              <th>Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in jobs" :key="job._id">
              <td style="font-weight:500">{{ job.title }}</td>
              <td>{{ job.employer?.companyName || job.employer?.email }}</td>
              <td><span class="badge badge-primary">{{ job.type }}</span></td>
              <td>{{ job.applicantCount }}</td>
              <td><span class="badge" :class="job.isActive ? 'badge-success' : 'badge-danger'">{{ job.isActive ? 'Active' : 'Closed' }}</span></td>
              <td>{{ new Date(job.createdAt).toLocaleDateString() }}</td>
              <td>
                <button class="btn btn-danger btn-sm" @click="deleteJob(job)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" v-if="!loading && !jobs.length">
        <p>No jobs on the platform yet.</p>
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
  async mounted() {
    try {
      const { data } = await api.get('/admin/jobs')
      this.jobs = data
    } catch (err) {
      console.error(err)
    }
    this.loading = false
  },
  methods: {
    async deleteJob(job) {
      if (!confirm(`Delete "${job.title}"?`)) return
      try {
        await api.delete(`/admin/jobs/${job._id}`)
        this.jobs = this.jobs.filter(j => j._id !== job._id)
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
