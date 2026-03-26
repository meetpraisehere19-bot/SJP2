import { reactive } from 'vue'

export const store = reactive({
  // Hydrate auth state from localStorage so refresh keeps the session.
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,

  get isLoggedIn() {
    return !!this.token && !!this.user
  },

  get isStudent() {
    return this.user?.role === 'student'
  },

  get isEmployer() {
    return this.user?.role === 'employer'
  },

  get isAdmin() {
    return this.user?.role === 'admin'
  },

  login(token, user) {
    this.token = token
    this.user = user
    // Keep auth state persistent across browser reloads.
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  },

  logout() {
    this.token = null
    this.user = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  updateUser(user) {
    this.user = user
    localStorage.setItem('user', JSON.stringify(user))
  }
})
