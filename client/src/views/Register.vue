<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Create Account</h1>
      <p class="subtitle">Join the employment portal</p>

      <div class="alert alert-error" v-if="error">{{ error }}</div>

      <div class="role-tabs">
        <button :class="{ active: form.role === 'student' }" @click="form.role = 'student'">I'm a Student</button>
        <button :class="{ active: form.role === 'employer' }" @click="form.role = 'employer'">I'm an Employer</button>
      </div>

      <form @submit.prevent="register">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>First Name</label>
            <input class="form-control" v-model="form.firstName" required placeholder="John">
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input class="form-control" v-model="form.lastName" required placeholder="Doe">
          </div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" class="form-control" v-model="form.email" required placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" class="form-control" v-model="form.password" required minlength="6" placeholder="Min. 6 characters">
        </div>

        <!-- Student fields -->
        <template v-if="form.role === 'student'">
          <div class="form-group">
            <label>University</label>
            <input class="form-control" v-model="form.university" placeholder="University name">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="form-group">
              <label>Major</label>
              <input class="form-control" v-model="form.major" placeholder="Computer Science">
            </div>
            <div class="form-group">
              <label>Graduation Year</label>
              <input type="number" class="form-control" v-model="form.graduationYear" placeholder="2026">
            </div>
          </div>
        </template>

        <!-- Employer fields -->
        <template v-if="form.role === 'employer'">
          <div class="form-group">
            <label>Company Name</label>
            <input class="form-control" v-model="form.companyName" required placeholder="Company Inc.">
          </div>
          <div class="form-group">
            <label>Industry</label>
            <input class="form-control" v-model="form.industry" placeholder="Technology">
          </div>
        </template>

        <button class="btn btn-primary btn-lg" style="width:100%" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <p v-if="form.role === 'employer'" class="notice">
        Employer accounts require admin approval before posting jobs.
      </p>

      <p class="auth-footer">
        Already have an account? <router-link to="/login">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../api'
import { store } from '../store'

export default {
  data() {
    return {
      form: {
        email: '', password: '', firstName: '', lastName: '',
        role: 'student', university: '', major: '', graduationYear: null,
        companyName: '', industry: ''
      },
      error: '', loading: false
    }
  },
  methods: {
    async register() {
      this.error = ''
      this.loading = true
      try {
        const { data } = await api.post('/auth/register', this.form)
        // Registration returns token + user; start session immediately.
        store.login(data.token, data.user)
        this.$router.push(`/${data.user.role}/dashboard`)
      } catch (err) {
        this.error = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed'
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #eef2ff 0%, #f0f9ff 100%);
}
.auth-card {
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
}
.auth-card h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
}
.subtitle {
  color: var(--gray-500);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}
.role-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.role-tabs button {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius);
  background: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--gray-500);
  transition: all 0.2s;
}
.role-tabs button.active {
  border-color: var(--primary);
  color: var(--primary);
  background: #eef2ff;
}
.notice {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.8125rem;
  color: var(--warning);
  background: #fffbeb;
  padding: 0.5rem;
  border-radius: var(--radius);
}
.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--gray-500);
}
</style>
