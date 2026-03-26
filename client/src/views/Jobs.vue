<template>
  <div class="container" style="padding:2rem 1.5rem">
    <div class="page-header">
      <h1>Browse Jobs</h1>
      <p>Find the perfect opportunity</p>
    </div>

    <!-- Filters -->
    <div class="filters">
      <input class="form-control" v-model="search" placeholder="Search jobs..." @input="debounceSearch">
      <select class="form-control" v-model="typeFilter" @change="fetchJobs">
        <option value="">All Types</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="internship">Internship</option>
        <option value="contract">Contract</option>
        <option value="remote">Remote</option>
      </select>
      <input class="form-control" v-model="locationFilter" placeholder="Location..." @input="debounceSearch">
    </div>

    <div class="loading" v-if="loading"><div class="spinner"></div></div>

    <div class="jobs-grid" v-else-if="jobs.length">
      <router-link :to="`/jobs/${job._id}`" class="job-card" v-for="job in jobs" :key="job._id" style="text-decoration:none;color:inherit">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <div>
            <h3>{{ job.title }}</h3>
            <div class="company">{{ job.employer?.companyName || 'Company' }}</div>
          </div>
          <span class="badge" :class="typeBadge(job.type)">{{ job.type }}</span>
        </div>
        <div class="meta">
          <span>&#128205; {{ job.location }}</span>
          <span v-if="job.salary?.min">&#128176; £{{ job.salary.min.toLocaleString() }} - £{{ job.salary.max?.toLocaleString() }}</span>
          <span>&#128197; {{ timeAgo(job.createdAt) }}</span>
        </div>
        <div class="skills" v-if="job.skills?.length">
          <span v-for="skill in job.skills.slice(0, 4)" :key="skill">{{ skill }}</span>
        </div>
      </router-link>
    </div>

    <div class="empty-state" v-else>
      <p>No jobs found matching your criteria.</p>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button class="btn btn-secondary btn-sm" :disabled="page <= 1" @click="page--; fetchJobs()">Previous</button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button class="btn btn-secondary btn-sm" :disabled="page >= totalPages" @click="page++; fetchJobs()">Next</button>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return { jobs: [], loading: true, search: '', typeFilter: '', locationFilter: '', page: 1, totalPages: 1, timer: null }
  },
  mounted() {
    this.fetchJobs()
  },
  methods: {
    async fetchJobs() {
      this.loading = true
      try {
        // Build query params from active filters and current page.
        const params = { page: this.page, limit: 12 }
        if (this.search) params.search = this.search
        if (this.typeFilter) params.type = this.typeFilter
        if (this.locationFilter) params.location = this.locationFilter
        const { data } = await api.get('/jobs', { params })
        this.jobs = data.jobs
        this.totalPages = data.totalPages
      } catch (err) {
        console.error(err)
      }
      this.loading = false
    },
    debounceSearch() {
      clearTimeout(this.timer)
      // Debounce avoids firing an API call on every keystroke.
      this.timer = setTimeout(() => { this.page = 1; this.fetchJobs() }, 400)
    },
    typeBadge(type) {
      const map = { 'full-time': 'badge-primary', 'part-time': 'badge-info', internship: 'badge-success', contract: 'badge-warning', remote: 'badge-primary' }
      return map[type] || 'badge-primary'
    },
    timeAgo(date) {
      const days = Math.floor((Date.now() - new Date(date)) / 86400000)
      if (days === 0) return 'Today'
      if (days === 1) return 'Yesterday'
      if (days < 30) return `${days}d ago`
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  font-size: 0.875rem;
  color: var(--gray-500);
}
@media (max-width: 768px) {
  .filters { grid-template-columns: 1fr; }
}
</style>
