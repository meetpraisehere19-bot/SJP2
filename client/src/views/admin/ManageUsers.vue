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
        <h1>Manage Users</h1>
        <p>View and manage all platform users</p>
      </div>

      <!-- Filters -->
      <div style="display:flex;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-sm" :class="filter === '' ? 'btn-primary' : 'btn-secondary'" @click="filter = ''; fetchUsers()">All</button>
        <button class="btn btn-sm" :class="filter === 'student' ? 'btn-primary' : 'btn-secondary'" @click="filter = 'student'; fetchUsers()">Students</button>
        <button class="btn btn-sm" :class="filter === 'employer' ? 'btn-primary' : 'btn-secondary'" @click="filter = 'employer'; fetchUsers()">Employers</button>
      </div>

      <div class="loading" v-if="loading"><div class="spinner"></div></div>

      <div class="table-wrapper" v-else>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td style="font-weight:500">{{ user.firstName }} {{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td><span class="badge" :class="user.role === 'student' ? 'badge-info' : 'badge-primary'">{{ user.role }}</span></td>
              <td>
                <span class="badge" :class="user.isActive ? 'badge-success' : 'badge-danger'">{{ user.isActive ? 'Active' : 'Inactive' }}</span>
                <span v-if="user.role === 'employer' && !user.isApproved" class="badge badge-warning" style="margin-left:0.25rem">Pending</span>
              </td>
              <td>{{ new Date(user.createdAt).toLocaleDateString() }}</td>
              <td>
                <div style="display:flex;gap:0.375rem;flex-wrap:wrap">
                  <button v-if="user.role === 'employer' && !user.isApproved" class="btn btn-success btn-sm" @click="approveUser(user)">Approve</button>
                  <button class="btn btn-sm" :class="user.isActive ? 'btn-danger' : 'btn-success'" @click="toggleActive(user)">
                    {{ user.isActive ? 'Deactivate' : 'Activate' }}
                  </button>
                  <button v-if="user.role !== 'admin'" class="btn btn-danger btn-sm" @click="deleteUser(user)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api'
import { store } from '../../store'

export default {
  data() {
    return { store, users: [], loading: true, filter: '' }
  },
  async mounted() {
    await this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      this.loading = true
      try {
        // Reuse one endpoint with role filter query param.
        const params = {}
        if (this.filter) params.role = this.filter
        const { data } = await api.get('/admin/users', { params })
        this.users = data.users
      } catch (err) {
        console.error(err)
      }
      this.loading = false
    },
    async approveUser(user) {
      try {
        await api.put(`/admin/users/${user._id}/approve`, { isApproved: true })
        user.isApproved = true
      } catch (err) {
        console.error(err)
      }
    },
    async toggleActive(user) {
      try {
        const { data } = await api.put(`/admin/users/${user._id}/toggle-active`)
        user.isActive = data.isActive
      } catch (err) {
        console.error(err)
      }
    },
    async deleteUser(user) {
      if (!confirm(`Delete ${user.firstName} ${user.lastName}? This cannot be undone.`)) return
      try {
        await api.delete(`/admin/users/${user._id}`)
        // Keep table in sync without forcing a full refetch.
        this.users = this.users.filter(u => u._id !== user._id)
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
