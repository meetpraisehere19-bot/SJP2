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
        <h1>My Job Postings</h1>
        <p>Manage your active and past job listings</p>
      </div>

      <div class="loading" v-if="loading"><div class="spinner"></div></div>

      <div v-else-if="jobs.length">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Location</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="job in jobs" :key="job._id">
                <td style="font-weight:500">{{ job.title }}</td>
                <td><span class="badge badge-primary">{{ job.type }}</span></td>
                <td>{{ job.location }}</td>
                <td>{{ job.applicantCount }}</td>
                <td><span class="badge" :class="job.isActive ? 'badge-success' : 'badge-danger'">{{ job.isActive ? 'Active' : 'Closed' }}</span></td>
                <td>
                  <div style="display:flex;gap:0.5rem">
                    <router-link :to="`/employer/applications/${job._id}`" class="btn btn-secondary btn-sm">Applicants</router-link>
                    <button class="btn btn-sm" :class="job.isActive ? 'btn-danger' : 'btn-success'" @click="toggleJob(job)">
                      {{ job.isActive ? 'Close' : 'Reopen' }}
                    </button>
                    <button class="btn btn-danger btn-sm" @click="deleteJob(job._id)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="empty-state" v-else>
        <p>No jobs posted yet.</p>
        <router-link to="/employer/post-job" class="btn btn-primary" style="margin-top:1rem">Post Your First Job</router-link>
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
    await this.fetchJobs()
  },
  methods: {
    async fetchJobs() {
      this.loading = true
      try {
        // Restricted endpoint returns only jobs created by current employer.
        const { data } = await api.get('/jobs/employer/mine')
        this.jobs = data
      } catch (err) {
        console.error(err)
      }
      this.loading = false
    },
    async toggleJob(job) {
      try {
        await api.put(`/jobs/${job._id}`, { isActive: !job.isActive })
        // Reflect active/closed state immediately after successful API update.
        job.isActive = !job.isActive
      } catch (err) {
        console.error(err)
      }
    },
    async deleteJob(id) {
      if (!confirm('Are you sure you want to delete this job?')) return
      try {
        await api.delete(`/jobs/${id}`)
        // Remove deleted row locally to avoid an extra fetch.
        this.jobs = this.jobs.filter(j => j._id !== id)
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
