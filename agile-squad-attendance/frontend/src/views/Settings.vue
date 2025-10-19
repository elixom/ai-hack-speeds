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
            <router-link to="/settings" class="text-blue-600 font-medium">Settings</router-link>
            <button @click="handleLogout" class="text-gray-600 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Settings</h2>
        <p class="text-gray-600 mt-1">Manage system configuration, integrations, and compliance rules</p>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'integrations'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'integrations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Integrations
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
              @click="activeTab = 'notifications'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Notifications
            </button>
          </nav>
        </div>
      </div>

      <!-- Integrations Tab -->
      <div v-if="activeTab === 'integrations'">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">External Integrations</h3>
          <p class="text-gray-600 mb-6">Configure connections to external services. Integration settings are stored in the integrations table in the database.</p>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Google Calendar</h4>
                <p class="text-sm text-gray-600">Sync holidays and sprint events</p>
              </div>
              <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Coming Soon</span>
            </div>
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Slack</h4>
                <p class="text-sm text-gray-600">Send notifications and reminders</p>
              </div>
              <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Coming Soon</span>
            </div>
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Jira</h4>
                <p class="text-sm text-gray-600">Link attendance with sprint tasks</p>
              </div>
              <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Compliance Rules Tab -->
      <div v-if="activeTab === 'compliance'">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Compliance Rules</h3>
          <p class="text-gray-600 mb-6">Define attendance rules and compliance thresholds for your squads. Rules are stored in the compliance_rules table.</p>
          
          <div class="text-center py-12 text-gray-500">
            <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p class="text-lg font-medium mb-2">Compliance Module</p>
            <p class="text-sm">This feature will allow you to set minimum hours, late arrival limits, and other attendance rules.</p>
            <p class="text-sm mt-2 text-blue-600">Coming in Phase 2</p>
          </div>
        </div>
      </div>

      <!-- Notifications Tab -->
      <div v-if="activeTab === 'notifications'">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
          <p class="text-gray-600 mb-6">Configure email, Slack, and MS Teams notifications for various events.</p>
          
          <div class="text-center py-12 text-gray-500">
            <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <p class="text-lg font-medium mb-2">Notifications System</p>
            <p class="text-sm">Configure reminders, alerts, and reports via Email, Slack, and MS Teams.</p>
            <p class="text-sm mt-2 text-blue-600">Coming in Phase 2</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Settings',
  data() {
    return {
      activeTab: 'integrations'
    }
  },
  computed: {
    user() {
      const authStore = useAuthStore()
      return authStore.user
    }
  },
  methods: {
    handleLogout() {
      const authStore = useAuthStore()
      authStore.logout()
      this.$router.push('/login')
    }
  }
}
</script>
