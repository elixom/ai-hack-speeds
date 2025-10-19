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
            <router-link to="/profile" class="text-gray-600 hover:text-gray-900">Profile</router-link>
            <button @click="handleLogout" class="text-gray-600 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Attendance History</h2>
        <p class="text-gray-600 mt-1">View and manage your attendance records</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              v-model="filters.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              v-model="filters.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
            <select
              v-model="filters.workMode"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="office">Office</option>
              <option value="remote">Remote</option>
              <option value="client_site">Client Site</option>
              <option value="ooo">Out of Office</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="applyFilters"
              class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Days</p>
              <p class="text-3xl font-bold text-blue-600">{{ stats.totalDays }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Hours</p>
              <p class="text-3xl font-bold text-green-600">{{ stats.totalHours }}h</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Average Hours/Day</p>
              <p class="text-3xl font-bold text-purple-600">{{ stats.avgHours }}h</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Remote Days</p>
              <p class="text-3xl font-bold text-yellow-600">{{ stats.remoteDays }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Attendance Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Attendance Records</h3>
          <button
            @click="exportData"
            class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
            Export CSV
          </button>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p class="text-gray-500 mt-4">Loading attendance records...</p>
        </div>

        <div v-else-if="filteredRecords.length === 0" class="p-12 text-center text-gray-500">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p>No attendance records found</p>
          <p class="text-sm mt-2">Try adjusting your filters</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Mode</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="record in filteredRecords" :key="record.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ formatDate(record.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatTime(record.check_in_time) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ record.check_out_time ? formatTime(record.check_out_time) : '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ record.check_out_time ? calculateDuration(record) : '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getWorkModeClass(record.work_mode)">
                    {{ getWorkModeLabel(record.work_mode) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ record.event_type || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    class="px-2 py-1 text-xs rounded-full"
                    :class="record.check_out_time ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                  >
                    {{ record.check_out_time ? 'Complete' : 'In Progress' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {{ record.notes || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

export default {
  name: 'Attendance',
  data() {
    return {
      records: [],
      filteredRecords: [],
      loading: false,
      filters: {
        startDate: '',
        endDate: '',
        workMode: ''
      },
      stats: {
        totalDays: 0,
        totalHours: 0,
        avgHours: 0,
        remoteDays: 0
      }
    }
  },
  computed: {
    user() {
      const authStore = useAuthStore()
      return authStore.user
    }
  },
  async mounted() {
    await this.loadRecords()
  },
  methods: {
    async loadRecords() {
      this.loading = true
      try {
        const response = await api.attendance.getAll()
        this.records = response.data.data || response.data || []
        this.filteredRecords = [...this.records]
        this.calculateStats()
      } catch (error) {
        console.error('Error loading records:', error)
      } finally {
        this.loading = false
      }
    },

    applyFilters() {
      let filtered = [...this.records]

      if (this.filters.startDate) {
        filtered = filtered.filter(r => r.date >= this.filters.startDate)
      }

      if (this.filters.endDate) {
        filtered = filtered.filter(r => r.date <= this.filters.endDate)
      }

      if (this.filters.workMode) {
        filtered = filtered.filter(r => r.work_mode === this.filters.workMode)
      }

      this.filteredRecords = filtered
      this.calculateStats()
    },

    calculateStats() {
      this.stats.totalDays = this.filteredRecords.length
      this.stats.remoteDays = this.filteredRecords.filter(r => r.work_mode === 'remote').length

      const totalMinutes = this.filteredRecords.reduce((sum, r) => {
        if (r.check_out_time) {
          const checkIn = new Date(r.check_in_time)
          const checkOut = new Date(r.check_out_time)
          return sum + (checkOut - checkIn) / 1000 / 60
        }
        return sum
      }, 0)

      this.stats.totalHours = Math.round(totalMinutes / 60)
      this.stats.avgHours = this.stats.totalDays > 0 
        ? Math.round((totalMinutes / this.stats.totalDays / 60) * 10) / 10 
        : 0
    },

    exportData() {
      // Create CSV
      const headers = ['Date', 'Check In', 'Check Out', 'Duration', 'Work Mode', 'Event Type', 'Notes']
      const rows = this.filteredRecords.map(r => [
        r.date,
        this.formatTime(r.check_in_time),
        r.check_out_time ? this.formatTime(r.check_out_time) : '',
        r.check_out_time ? this.calculateDuration(r) : '',
        r.work_mode,
        r.event_type || '',
        r.notes || ''
      ])

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `attendance_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    },

    formatTime(timeString) {
      if (!timeString) return '-'
      return new Date(timeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    calculateDuration(record) {
      if (!record.check_in_time || !record.check_out_time) return '-'
      
      const checkIn = new Date(record.check_in_time)
      const checkOut = new Date(record.check_out_time)
      const diff = checkOut - checkIn
      const hours = Math.floor(diff / 1000 / 60 / 60)
      const minutes = Math.floor((diff / 1000 / 60) % 60)
      
      return `${hours}h ${minutes}m`
    },

    getWorkModeLabel(mode) {
      const labels = {
        office: '🏢 Office',
        remote: '🏠 Remote',
        client_site: '👥 Client',
        ooo: '🚫 OOO'
      }
      return labels[mode] || mode
    },

    getWorkModeClass(mode) {
      const classes = {
        office: 'bg-blue-100 text-blue-800',
        remote: 'bg-purple-100 text-purple-800',
        client_site: 'bg-green-100 text-green-800',
        ooo: 'bg-gray-100 text-gray-800'
      }
      return classes[mode] || 'bg-gray-100 text-gray-800'
    },

    handleLogout() {
      const authStore = useAuthStore()
      authStore.logout()
      this.$router.push('/login')
    }
  }
}
</script>
