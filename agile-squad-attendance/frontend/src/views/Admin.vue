<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />

    <!-- Main Content -->
    <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Admin Panel</h2>
        <p class="mt-1 text-gray-600">Manage users, squads, and system configuration</p>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px space-x-8">
            <button
              @click="activeTab = 'users'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              User Management
            </button>
            <button
              @click="activeTab = 'squads'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'squads'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Squad Management
            </button>
            <button
              @click="activeTab = 'compliance'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'compliance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Compliance Rules
            </button>
            <button
              @click="activeTab = 'audit'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'audit'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Audit Trail
            </button>
          </nav>
        </div>
      </div>

      <!-- User Management Tab -->
      <div v-if="activeTab === 'users'" class="space-y-6">
        <!-- Action Bar -->
        <div class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Users</h3>
              <p class="mt-1 text-sm text-gray-600">Manage team members and their roles</p>
            </div>
            <button
              @click="showCreateUserModal = true"
              class="flex items-center gap-2 px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
              Add User
            </button>
          </div>

          <!-- Search and Filter -->
          <div class="flex gap-4 mt-4">
            <div class="flex-1">
              <input
                v-model="userSearch"
                type="text"
                placeholder="Search users..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              v-model="userRoleFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="squad_lead">Squad Lead</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>

        <!-- Users List -->
        <div class="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
          <div v-if="loading" class="p-8 text-center">
            <div class="inline-block w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          </div>

          <div v-else-if="filteredUsers.length === 0" class="p-8 text-center text-gray-500">
            <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <p class="mt-2">No users found</p>
          </div>

          <table v-else class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Name</th>
                <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Email</th>
                <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Role</th>
                <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Squads</th>
                <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <span class="text-sm font-medium text-blue-600">{{ getInitials(user.name) }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getRoleBadgeClass(user.role)" class="px-2 py-1 text-xs rounded-full">
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {{ user.squads_count || 0 }} squad(s)
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 text-xs rounded-full">
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                  <button
                    @click="editUser(user)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    @click="toggleUserStatus(user)"
                    :class="user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                  >
                    {{ user.is_active ? 'Deactivate' : 'Activate' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Squad Management Tab -->
      <div v-if="activeTab === 'squads'">
        <div class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <p class="text-gray-600">Squad management available in <router-link to="/squads" class="text-blue-600 hover:underline">Squads page</router-link></p>
        </div>
      </div>

      <!-- Compliance Rules Tab -->
      <div v-if="activeTab === 'compliance'">
        <div class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <p class="text-gray-600">Compliance rules available in <router-link to="/settings" class="text-blue-600 hover:underline">Settings page</router-link></p>
        </div>
      </div>

      <!-- Audit Trail Tab -->
      <div v-if="activeTab === 'audit'">
        <div class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div class="space-y-3">
            <div v-for="log in auditLogs" :key="log.id" class="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
              <div class="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-900">{{ log.action }}</p>
                <p class="mt-1 text-xs text-gray-500">{{ log.user_name }} • {{ formatTime(log.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateUserModal || editingUser" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="mb-6 text-xl font-bold text-gray-900">
          {{ editingUser ? 'Edit User' : 'Create New User' }}
        </h3>

        <form @submit.prevent="saveUser" class="space-y-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Full Name *</label>
              <input
                v-model="userForm.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Email *</label>
              <input
                v-model="userForm.email"
                type="email"
                required
                :disabled="!!editingUser"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div v-if="!editingUser" class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Password *</label>
              <input
                v-model="userForm.password"
                type="password"
                :required="!editingUser"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Confirm Password *</label>
              <input
                v-model="userForm.password_confirmation"
                type="password"
                :required="!editingUser"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Role *</label>
            <select
              v-model="userForm.role"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="member">Member</option>
              <option value="squad_lead">Squad Lead</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
            <p class="mt-1 text-xs text-gray-500">Select the user's role and permissions</p>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Timezone</label>
            <select
              v-model="userForm.timezone"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
          </div>

          <div v-if="formError" class="p-4 text-red-700 border-l-4 border-red-500 rounded bg-red-50">
            <p class="text-sm">{{ formError }}</p>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeUserModal"
              class="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : (editingUser ? 'Update User' : 'Create User') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import { formatDate, formatTime } from '../utils/dateHelpers'
import NavBar from '../components/NavBar.vue'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)

export default {
  name: 'Admin',
  components: {
    NavBar
  },
  data() {
    return {
      activeTab: 'users',
      loading: false,
      saving: false,
      users: [],
      auditLogs: [],
      showCreateUserModal: false,
      editingUser: null,
      userSearch: '',
      userRoleFilter: '',
      userForm: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'member',
        timezone: 'America/New_York'
      },
      formError: null
    }
  },
  computed: {
    user() {
      const authStore = useAuthStore()
      return authStore.user
    },
    filteredUsers() {
      let filtered = this.users

      if (this.userSearch) {
        const search = this.userSearch.toLowerCase()
        filtered = filtered.filter(u =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
        )
      }

      if (this.userRoleFilter) {
        filtered = filtered.filter(u => u.role === this.userRoleFilter)
      }

      return filtered
    }
  },
  async mounted() {
    // Check if user is admin
    if (this.user?.role !== 'admin') {
      this.$router.push('/dashboard')
      return
    }

    await this.loadUsers()
    await this.loadAuditLogs()
  },
  methods: {
    async loadUsers() {
      this.loading = true
      try {
        const response = await api.get('/users')
        this.users = response.data.data || response.data || []
      } catch (error) {
        console.error('Error loading users:', error)
      } finally {
        this.loading = false
      }
    },

    async loadAuditLogs() {
      try {
        const response = await api.get('/audit-logs?limit=20')
        this.auditLogs = response.data.data || response.data || []
      } catch (error) {
        console.error('Error loading audit logs:', error)
      }
    },

    async saveUser() {
      this.formError = null
      this.saving = true

      try {
        if (this.editingUser) {
          const response = await api.put(`/users/${this.editingUser.id}`, this.userForm)
          if (response.data.success) {
            await this.loadUsers()
            this.closeUserModal()
          }
        } else {
          const response = await api.post('/users', this.userForm)
          if (response.data.success) {
            await this.loadUsers()
            this.closeUserModal()
          }
        }
      } catch (error) {
        this.formError = error.response?.data?.message || 'Failed to save user'
      } finally {
        this.saving = false
      }
    },

    editUser(user) {
      this.editingUser = user
      this.userForm = {
        name: user.name,
        email: user.email,
        role: user.role,
        timezone: user.timezone || 'America/New_York'
      }
    },

    async toggleUserStatus(user) {
      if (!confirm(`Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} this user?`)) {
        return
      }

      try {
        await api.patch(`/users/${user.id}/status`, {
          is_active: !user.is_active
        })
        await this.loadUsers()
      } catch (error) {
        alert('Failed to update user status')
      }
    },

    closeUserModal() {
      this.showCreateUserModal = false
      this.editingUser = null
      this.userForm = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'member',
        timezone: 'America/New_York'
      }
      this.formError = null
    },

    getInitials(name) {
      return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'
    },

    getRoleLabel(role) {
      const labels = {
        admin: 'Admin',
        squad_lead: 'Squad Lead',
        member: 'Member',
        viewer: 'Viewer'
      }
      return labels[role] || role
    },

    getRoleBadgeClass(role) {
      const classes = {
        admin: 'bg-red-100 text-red-800',
        squad_lead: 'bg-purple-100 text-purple-800',
        member: 'bg-blue-100 text-blue-800',
        viewer: 'bg-gray-100 text-gray-800'
      }
      return classes[role] || 'bg-gray-100 text-gray-800'
    },

    formatDate,
    formatTime,

    handleLogout() {
      const authStore = useAuthStore()
      authStore.logout()
      this.$router.push('/login')
    }
  }
}
</script>
