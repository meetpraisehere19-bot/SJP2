<template>
  <div class="container" style="padding:2rem 1.5rem">
    <div class="loading" v-if="loading"><div class="spinner"></div></div>

    <div v-else-if="job" class="job-detail">
      <div class="detail-header">
        <div>
          <h1>{{ job.title }}</h1>
          <div class="company-name">{{ job.employer?.companyName }}</div>
          <div class="meta-row">
            <span class="badge" :class="typeBadge(job.type)">{{ job.type }}</span>
            <span>&#128205; {{ job.location }}</span>
            <span v-if="job.salary?.min">&#128176; £{{ job.salary.min.toLocaleString() }} - £{{ job.salary.max?.toLocaleString() }}</span>
            <span>&#128197; Posted {{ timeAgo(job.createdAt) }}</span>
            <span v-if="job.deadline">&#9200; Deadline: {{ new Date(job.deadline).toLocaleDateString() }}</span>
          </div>
        </div>
        <button v-if="canApply" class="btn btn-primary btn-lg" @click="showApply = true">Apply Now</button>
      </div>

      <div class="detail-grid">
        <div class="detail-main">
          <section>
            <h2>Description</h2>
            <div class="content" v-html="nl2br(job.description)"></div>
          </section>
          <section>
            <h2>Requirements</h2>
            <div class="content" v-html="nl2br(job.requirements)"></div>
          </section>
          <section v-if="job.responsibilities">
            <h2>Responsibilities</h2>
            <div class="content" v-html="nl2br(job.responsibilities)"></div>
          </section>
        </div>
        <div class="detail-sidebar">
          <div class="card">
            <h3>Job Overview</h3>
            <div class="overview-item"><strong>Type</strong><span>{{ job.type }}</span></div>
            <div class="overview-item"><strong>Location</strong><span>{{ job.location }}</span></div>
            <div class="overview-item" v-if="job.experience"><strong>Experience</strong><span>{{ job.experience }}</span></div>
            <div class="overview-item"><strong>Applicants</strong><span>{{ job.applicantCount }}</span></div>
          </div>
          <div class="card" v-if="job.skills?.length">
            <h3>Skills Required</h3>
            <div class="skills-list">
              <span v-for="skill in job.skills" :key="skill" class="badge badge-primary">{{ skill }}</span>
            </div>
          </div>
          <div class="card" v-if="job.employer">
            <h3>About {{ job.employer.companyName }}</h3>
            <p class="company-desc">{{ job.employer.companyDescription || 'No description available.' }}</p>
            <a v-if="job.employer.companyWebsite" :href="job.employer.companyWebsite" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="margin-top:0.5rem">Visit Website</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Apply Modal -->
    <div class="modal-overlay" v-if="showApply" @click.self="showApply = false">
      <div class="modal">
        <h2>Apply for {{ job.title }}</h2>
        <div class="alert alert-error" v-if="applyError">{{ applyError }}</div>
        <div class="alert alert-success" v-if="applySuccess">Application submitted successfully!</div>
        <form @submit.prevent="submitApplication" v-if="!applySuccess">
          <div class="form-group">
            <label>Cover Letter</label>
            <textarea class="form-control" v-model="coverLetter" rows="5" placeholder="Tell the employer why you're a great fit..."></textarea>
          </div>
          <div class="form-group">
            <label>Resume (optional - your profile resume will be used if not provided)</label>
            <input type="file" @change="onFileChange" accept=".pdf,.doc,.docx">
          </div>
          <div style="display:flex;gap:1rem;justify-content:flex-end">
            <button type="button" class="btn btn-secondary" @click="showApply = false">Cancel</button>
            <button class="btn btn-primary" :disabled="applying">{{ applying ? 'Submitting...' : 'Submit Application' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'
import { store } from '../store'

export default {
  data() {
    return { job: null, loading: true, showApply: false, coverLetter: '', resumeFile: null, applying: false, applyError: '', applySuccess: false }
  },
  computed: {
    canApply() {
      return store.isLoggedIn && store.isStudent
    }
  },
  mounted() {
    this.fetchJob()
  },
  methods: {
    async fetchJob() {
      try {
        const { data } = await api.get(`/jobs/${this.$route.params.id}`)
        this.job = data
      } catch (err) {
        console.error(err)
      }
      this.loading = false
    },
    onFileChange(e) {
      this.resumeFile = e.target.files[0]
    },
    async submitApplication() {
      this.applyError = ''
      this.applying = true
      try {
        const formData = new FormData()
        formData.append('jobId', this.job._id)
        formData.append('coverLetter', this.coverLetter)
        if (this.resumeFile) formData.append('resume', this.resumeFile)
        await api.post('/applications', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        this.applySuccess = true
      } catch (err) {
        this.applyError = err.response?.data?.message || 'Failed to submit application'
      }
      this.applying = false
    },
    typeBadge(type) {
      const map = { 'full-time': 'badge-primary', 'part-time': 'badge-info', internship: 'badge-success', contract: 'badge-warning', remote: 'badge-primary' }
      return map[type] || 'badge-primary'
    },
    timeAgo(date) {
      const days = Math.floor((Date.now() - new Date(date)) / 86400000)
      if (days === 0) return 'today'
      if (days === 1) return 'yesterday'
      if (days < 30) return `${days} days ago`
      return new Date(date).toLocaleDateString()
    },
    nl2br(text) {
      if (!text) return ''
      const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return escaped.replace(/\n/g, '<br>')
    }
  }
}
</script>

<style scoped>
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
}
.detail-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--gray-900);
}
.company-name {
  color: var(--primary);
  font-weight: 600;
  font-size: 1.0625rem;
  margin: 0.25rem 0 0.75rem;
}
.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--gray-500);
  align-items: center;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 2rem;
}
.detail-main section {
  margin-bottom: 2rem;
}
.detail-main h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--gray-800);
}
.content {
  color: var(--gray-600);
  line-height: 1.7;
}
.detail-sidebar .card {
  margin-bottom: 1.25rem;
}
.detail-sidebar h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--gray-800);
}
.overview-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--gray-100);
  font-size: 0.875rem;
}
.overview-item strong {
  color: var(--gray-600);
  font-weight: 500;
}
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.company-desc {
  font-size: 0.875rem;
  color: var(--gray-500);
  line-height: 1.6;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}
.modal {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 2rem;
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal h2 {
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
}
@media (max-width: 768px) {
  .detail-grid { grid-template-columns: 1fr; }
  .detail-header { flex-direction: column; }
}
</style>
