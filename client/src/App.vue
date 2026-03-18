<template>
  <div id="app">
    <nav class="navbar">
      <div class="container navbar-inner">
        <router-link to="/" class="logo">
          <span class="logo-icon">&#9733;</span>Job Success Agency
        </router-link>
        <div class="nav-links">
          <router-link to="/jobs">Browse Jobs</router-link>
          <template v-if="!store.isLoggedIn">
            <router-link to="/login" class="btn btn-secondary btn-sm">Log In</router-link>
            <router-link to="/register" class="btn btn-primary btn-sm">Sign Up</router-link>
          </template>
          <template v-else>
            <router-link :to="`/${store.user.role}/dashboard`">Dashboard</router-link>
            <div class="user-menu">
              <button class="user-btn" @click="showMenu = !showMenu">
                <span class="avatar">{{ store.user.firstName?.[0] }}{{ store.user.lastName?.[0] }}</span>
                <span>{{ store.user.firstName }}</span>
              </button>
              <div class="dropdown" v-if="showMenu" @click="showMenu = false">
                <router-link :to="`/${store.user.role}/profile`" v-if="store.user.role !== 'admin'">Profile</router-link>
                <button @click="logout">Log Out</button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { store } from './store'

export default {
  data() {
    return { store, showMenu: false }
  },
  methods: {
    logout() {
      store.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.navbar {
  background: #fff;
  border-bottom: 1px solid var(--gray-200);
  height: 64px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}
.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary) !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logo-icon {
  font-size: 1.5rem;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.nav-links > a {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-600);
}
.nav-links > a:not(.btn):hover {
  color: var(--primary);
}
/* Nav button visual improvements */
.nav-links .btn {
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-weight: 600;
  min-width: 88px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}
.nav-links .btn-sm { font-size: 0.85rem; padding: 0.35rem 0.75rem; }
.nav-links .btn-primary {
  background: linear-gradient(90deg, var(--primary), var(--primary-2));
  color: #fff;
  box-shadow: 0 6px 18px rgba(79,70,229,0.12);
  border: none;
}
.nav-links .btn-primary:hover, .nav-links .btn-primary:focus {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(79,70,229,0.18);
}
.nav-links .btn-secondary {
  background: transparent;
  color: var(--gray-700);
  border: 1px solid rgba(71,85,105,0.08);
}
.nav-links .btn-secondary:hover, .nav-links .btn-secondary:focus {
  background: rgba(79,70,229,0.06);
  color: var(--primary);
  transform: translateY(-2px);
}

/* Ensure primary nav button text remains readable */
.nav-links .btn-primary:hover,
.nav-links .btn-primary:focus {
  color: #fff;
}
.user-menu {
  position: relative;
}
.user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid var(--gray-200);
  border-radius: 9999px;
  padding: 0.25rem 0.75rem 0.25rem 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-700);
}
.user-btn:hover {
  background: var(--gray-50);
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}
.dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  min-width: 160px;
  overflow: hidden;
  z-index: 50;
}
.dropdown a, .dropdown button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  color: var(--gray-700);
  background: none;
  border: none;
}
.dropdown a:hover, .dropdown button:hover {
  background: var(--gray-50);
  color: var(--primary);
}
</style>