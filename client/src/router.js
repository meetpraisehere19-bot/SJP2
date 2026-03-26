import { createRouter, createWebHistory } from 'vue-router'
import { store } from './store'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Jobs from './views/Jobs.vue'
import JobDetail from './views/JobDetail.vue'

// Student views
import StudentDashboard from './views/student/Dashboard.vue'
import MyApplications from './views/student/MyApplications.vue'
import StudentProfile from './views/student/Profile.vue'

// Employer views
import EmployerDashboard from './views/employer/Dashboard.vue'
import PostJob from './views/employer/PostJob.vue'
import ManageJobs from './views/employer/ManageJobs.vue'
import ViewApplications from './views/employer/ViewApplications.vue'
import EmployerProfile from './views/employer/Profile.vue'

// Admin views
import AdminDashboard from './views/admin/Dashboard.vue'
import ManageUsers from './views/admin/ManageUsers.vue'
import AdminJobs from './views/admin/Jobs.vue'
import AdminApplications from './views/admin/Applications.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login, meta: { guest: true } },
  { path: '/register', component: Register, meta: { guest: true } },
  { path: '/jobs', component: Jobs },
  { path: '/jobs/:id', component: JobDetail },

  // Student routes
  { path: '/student/dashboard', component: StudentDashboard, meta: { auth: true, role: 'student' } },
  { path: '/student/applications', component: MyApplications, meta: { auth: true, role: 'student' } },
  { path: '/student/profile', component: StudentProfile, meta: { auth: true, role: 'student' } },

  // Employer routes
  { path: '/employer/dashboard', component: EmployerDashboard, meta: { auth: true, role: 'employer' } },
  { path: '/employer/post-job', component: PostJob, meta: { auth: true, role: 'employer' } },
  { path: '/employer/jobs', component: ManageJobs, meta: { auth: true, role: 'employer' } },
  { path: '/employer/applications/:jobId', component: ViewApplications, meta: { auth: true, role: 'employer' } },
  { path: '/employer/profile', component: EmployerProfile, meta: { auth: true, role: 'employer' } },

  // Admin routes
  { path: '/admin/dashboard', component: AdminDashboard, meta: { auth: true, role: 'admin' } },
  { path: '/admin/users', component: ManageUsers, meta: { auth: true, role: 'admin' } },
  { path: '/admin/jobs', component: AdminJobs, meta: { auth: true, role: 'admin' } },
  { path: '/admin/applications', component: AdminApplications, meta: { auth: true, role: 'admin' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route meta contract:
// - auth: route requires login
// - guest: route is only for logged-out users
// - role: logged-in user must match this role
router.beforeEach((to, from, next) => {
  if (to.meta.auth && !store.isLoggedIn) {
    return next('/login')
  }
  if (to.meta.guest && store.isLoggedIn) {
    return next(`/${store.user.role}/dashboard`)
  }
  if (to.meta.role && store.user?.role !== to.meta.role) {
    return next(`/${store.user.role}/dashboard`)
  }
  next()
})

export default router
