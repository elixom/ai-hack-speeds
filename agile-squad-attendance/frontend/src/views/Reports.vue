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
            <router-link to="/reports" class="text-blue-600 font-medium">Reports</router-link>
            <button @click="handleLogout" class="text-gray-600 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Reports & Analytics</h2>
        <p class="text-gray-600 mt-1">View detailed attendance reports and insights</p>
      </div>

      <!-- Report Type Selector -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="reportType = 'summary'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                reportType === 'summary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Summary Report
            </button>
            <button
              @click="reportType = 'squad'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                reportType === 'squad'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Squad Report
            </button>
            <button
              @click="reportType === 'sprint'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                reportType === 'sprint'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Sprint Report
            </button>
          </nav>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Report Filters</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              v-model="filters.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              v-model="filters.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div v-if="reportType === 'squad'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Squad</label>
            <select
              v-model="filters.squadId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Squads</option>
              <option v-for="squad in squads" :key="squad.id" :value="squad.id">
                {{ squad.name }}
              </option>
            </select>
          </div>
          <div class="flex items-end gap-2">
            <button
              @click="generateReport"
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Generate
            </button>
            <button
              @click="exportPDF"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
              title="Export PDF"
            >
              PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Report -->
      <div v-if="reportType === 'summary' && reportData" class="space-y-6">
        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Total Members</p>
                <p class="text-3xl font-bold text-blue-600">{{ reportData.totalMembers }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Active Days</p>
                <p class="text-3xl font-bold text-green-600">{{ reportData.activeDays }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Total Hours</p>
                <p class="text-3xl font-bold text-purple-600">{{ reportData.totalHours }}h</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Avg Attendance</p>
                <p class="text-3xl font-bold text-yellow-600">{{ reportData.avgAttendance }}%</p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Placeholder -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Attendance Trends</h3>
          <div class="text-center py-12 text-gray-500">
            <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <p>Charts will be displayed here</p>
            <p class="text-sm mt-2">Install chart library for visualization</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!reportData" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-lg font-medium text-gray-900 mb-2">Generate a Report</p>
        <p class="text-gray-600">Select filters above and click Generate to view attendance reports</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

export default {
  name: 'Reports',
  data() {
    return {
      reportType: 'summary',
      filters: {
        startDate: '',
        endDate: '',
        squadId: ''
      },
      squads: [],
      reportData: null,
      loading: false
    }
  },
  computed: {
    user() {
      const authStore = useAuthStore()
      return authStore.user
    }
  },
  async mounted() {
    await this.loadSquads()
    
    // Set default date range (last 30 days)
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)
    
    this.filters.endDate = today.toISOString().split('T')[0]
    this.filters.startDate = thirtyDaysAgo.toISOString().split('T')[0]
  },
  methods: {
    async loadSquads() {
      try {
        const response = await api.squads.getAll()
        this.squads = response.data.data || response.data || []
      } catch (error) {
        console.error('Error loading squads:', error)
      }
    },

    async generateReport() {
      this.loading = true
      try {
        // Simulate report generation
        // In production, this would call a backend API endpoint
        const response = await api.attendance.getStats(this.filters)
        
        // Mock data for demonstration
        this.reportData = {
          totalMembers: 25,
          activeDays: 20,
          totalHours: 3200,
          avgAttendance: 85
        }
      } catch (error) {
        console.error('Error generating report:', error)
        alert('Failed to generate report')
      } finally {
        this.loading = false
      }
    },

    exportPDF() {
      alert('PDF export functionality will be implemented with a PDF generation library like jsPDF or server-side PDF generation.')
    },

    handleLogout() {
      const authStore = useAuthStore()
      authStore.logout()
      this.$router.push('/login')
    }
  }
}
</script>
