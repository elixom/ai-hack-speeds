<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/dashboard" class="text-2xl font-bold text-gray-900">Agile Squad</router-link>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/dashboard" class="text-gray-600 hover:text-gray-900">Dashboard</router-link>
            <router-link to="/squads" class="text-gray-600 hover:text-gray-900">Squads</router-link>
            <router-link to="/leave-requests" class="text-gray-600 hover:text-gray-900">Leave</router-link>
            <button @click="handleLogout" class="text-gray-600 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Profile Settings</h2>
        <p class="text-gray-600 mt-1">Manage your account information and preferences</p>
      </div>

      <!-- Profile Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
          <div class="flex items-center gap-6">
            <div class="w-24 h-24 rounded-full bg-white flex items-center justify-center">
              <span class="text-4xl font-bold text-blue-600">{{ getInitials(user?.name) }}</span>
            </div>
            <div class="text-white">
              <h3 class="text-2xl font-bold">{{ user?.name }}</h3>
              <p class="text-blue-100">{{ user?.email }}</p>
              <span class="inline-block mt-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                {{ getRoleLabel(user?.role) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Profile Info -->
        <div class="p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
          
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                v-model="profileForm.name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                v-model="profileForm.email"
                type="email"
                disabled
                class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                v-model="profileForm.timezone"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/Phoenix">Arizona Time</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
                <option value="Asia/Dubai">Dubai (GST)</option>
                <option value="Australia/Sydney">Sydney (AEDT)</option>
              </select>
            </div>

            <div v-if="updateError" class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p class="text-sm">{{ updateError }}</p>
            </div>

            <div v-if="updateSuccess" class="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              <p class="text-sm">Profile updated successfully!</p>
            </div>

            <button
              type="submit"
              :disabled="updating"
              class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {{ updating ? 'Updating...' : 'Update Profile' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Change Password Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h4 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h4>
        
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              v-model="passwordForm.current_password"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              v-model="passwordForm.new_password"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password (min. 8 characters)"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              v-model="passwordForm.new_password_confirmation"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
            />
          </div>

          <div v-if="passwordError" class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p class="text-sm">{{ passwordError }}</p>
          </div>

          <div v-if="passwordSuccess" class="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            <p class="text-sm">Password changed successfully!</p>
          </div>

          <button
            type="submit"
            :disabled="changingPassword"
            class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {{ changingPassword ? 'Changing...' : 'Change Password' }}
          </button>
        </form>
      </div>

      <!-- Account Stats -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 class="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h4>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <p class="text-2xl font-bold text-blue-600">{{ stats.totalDays || 0 }}</p>
            <p class="text-xs text-gray-600 mt-1">Days Tracked</p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-2xl font-bold text-green-600">{{ stats.totalHours || 0 }}</p>
            <p class="text-xs text-gray-600 mt-1">Total Hours</p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <p class="text-2xl font-bold text-purple-600">{{ stats.squadsCount || 0 }}</p>
            <p class="text-xs text-gray-600 mt-1">Squads</p>
          </div>
          <div class="text-center p-4 bg-yellow-50 rounded-lg">
            <p class="text-2xl font-bold text-yellow-600">{{ stats.leaveRequests || 0 }}</p>
            <p class="text-xs text-gray-600 mt-1">Leave Requests</p>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t">
          <p class="text-sm text-gray-600">
            <strong>Member since:</strong> {{ formatDate(user?.created_at) }}
          </p>
          <p class="text-sm text-gray-600 mt-2">
            <strong>Last login:</strong> {{ formatDate(user?.last_login_at || new Date()) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import api from '../services/api'
import { formatDate } from '../utils/dateHelpers'

export default {
  name: 'Profile',
  data() {
    return {
      profileForm: {
        name: '',
        email: '',
        timezone: 'America/New_York'
      },
      passwordForm: {
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      },
      stats: {
        totalDays: 0,
        totalHours: 0,
        squadsCount: 0,
        leaveRequests: 0
      },
      updating: false,
      updateError: null,
      updateSuccess: false,
      changingPassword: false,
      passwordError: null,
      passwordSuccess: false
    }
  },
  computed: {
    user() {
      const authStore = useAuthStore()
      return authStore.user
    }
  },
  mounted() {
    this.loadProfile()
    this.loadStats()
  },
  methods: {
    loadProfile() {
      if (this.user) {
        this.profileForm = {
          name: this.user.name || '',
          email: this.user.email || '',
          timezone: this.user.timezone || 'America/New_York'
        }
      }
    },

    async loadStats() {
      try {
        // Fetch attendance stats
        const attendanceResponse = await api.attendance.getAll()
        const attendance = attendanceResponse.data.data || attendanceResponse.data || []
        this.stats.totalDays = attendance.length
        
        // Calculate total hours
        const totalMinutes = attendance.reduce((sum, record) => {
          if (record.check_out_time) {
            const checkIn = new Date(record.check_in_time)
            const checkOut = new Date(record.check_out_time)
            const minutes = (checkOut - checkIn) / 1000 / 60
            return sum + minutes
          }
          return sum
        }, 0)
        this.stats.totalHours = Math.round(totalMinutes / 60)

        // Fetch squads
        const squadsResponse = await api.squads.getAll()
        const squads = squadsResponse.data.data || squadsResponse.data || []
        this.stats.squadsCount = squads.length

        // Fetch leave requests
        const leaveResponse = await api.leave.getMyRequests()
        const leaves = leaveResponse.data.data || leaveResponse.data || []
        this.stats.leaveRequests = leaves.length
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    },

    async updateProfile() {
      this.updateError = null
      this.updateSuccess = false
      this.updating = true

      try {
        const response = await api.auth.updateProfile(this.profileForm)
        if (response.data.success) {
          const authStore = useAuthStore()
          await authStore.fetchUser()
          this.updateSuccess = true
          setTimeout(() => this.updateSuccess = false, 3000)
        }
      } catch (error) {
        this.updateError = error.response?.data?.message || 'Failed to update profile'
      } finally {
        this.updating = false
      }
    },

    async changePassword() {
      this.passwordError = null
      this.passwordSuccess = false

      // Validation
      if (this.passwordForm.new_password.length < 8) {
        this.passwordError = 'New password must be at least 8 characters'
        return
      }

      if (this.passwordForm.new_password !== this.passwordForm.new_password_confirmation) {
        this.passwordError = 'Passwords do not match'
        return
      }

      this.changingPassword = true

      try {
        const response = await api.auth.changePassword(this.passwordForm)
        if (response.data.success) {
          this.passwordSuccess = true
          this.passwordForm = {
            current_password: '',
            new_password: '',
            new_password_confirmation: ''
          }
          setTimeout(() => this.passwordSuccess = false, 3000)
        }
      } catch (error) {
        this.passwordError = error.response?.data?.message || 'Failed to change password'
      } finally {
        this.changingPassword = false
      }
    },

    getInitials(name) {
      return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'
    },

    getRoleLabel(role) {
      const labels = {
        admin: '👑 Administrator',
        squad_lead: '⭐ Squad Lead',
        member: '👤 Member',
        viewer: '👁️ Viewer'
      }
      return labels[role] || role
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    handleLogout() {
      const authStore = useAuthStore()
      authStore.logout()
      this.$router.push('/login')
    }
  }
}
</script>
