<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Welcome Back</h1>
      <p class="subtitle">Sign in to your account</p>

      <div class="alert alert-error" v-if="error">{{ error }}</div>

      <div class="role-tabs">
        <button :class="{ active: role === 'student' }" @click="role = 'student'">Student</button>
        <button :class="{ active: role === 'employer' }" @click="role = 'employer'">Employer</button>
        <button :class="{ active: role === 'admin' }" @click="role = 'admin'">Admin</button>
      </div>

      <form @submit.prevent="login">
        <div class="form-group">
          <label>Email</label>
          <input type="email" class="form-control" v-model="email" required placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" class="form-control" v-model="password" required placeholder="Enter your password">
        </div>
        <button class="btn btn-primary btn-lg" style="width:100%" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="auth-footer">
        Don't have an account? <router-link to="/register">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../api'
import { store } from '../store'

export default {
  data() {
    return { email: '', password: '', role: 'student', error: '', loading: false }
  },
  methods: {
    async login() {
      this.error = ''
      this.loading = true
      try {
        const { data } = await api.post('/auth/login', { email: this.email, password: this.password })
        // Prevent role-tab mismatch (for example, logging in as student on employer tab).
        if (data.user.role !== this.role) {
          this.error = `This account is not a ${this.role} account`
          this.loading = false
          return
        }
        store.login(data.token, data.user)
        this.$router.push(`/${data.user.role}/dashboard`)
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed'
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
  max-width: 440px;
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
.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--gray-500);
}
</style>
