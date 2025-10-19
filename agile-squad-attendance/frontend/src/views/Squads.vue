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
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Squads</h2>
          <p class="text-gray-600 mt-1">Manage your agile squads and team members</p>
        </div>
        <button
          v-if="isAdmin"
          @click="showCreateModal = true"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
          </svg>
          Create Squad
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading && squads.length === 0" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p class="text-gray-500 mt-4">Loading squads...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="squads.length === 0" class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No squads yet</h3>
        <p class="mt-2 text-gray-500">Get started by creating your first squad</p>
        <button
          v-if="isAdmin"
          @click="showCreateModal = true"
          class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Squad
        </button>
      </div>

      <!-- Squads Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="squad in squads"
          :key="squad.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer"
          @click="viewSquad(squad.id)"
        >
          <!-- Squad Header -->
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-bold mb-1">{{ squad.name }}</h3>
                <p class="text-blue-100 text-sm">{{ squad.project_key || 'No project' }}</p>
              </div>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="squad.is_active ? 'bg-green-400 text-green-900' : 'bg-gray-400 text-gray-900'"
              >
                {{ squad.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>

          <!-- Squad Body -->
          <div class="p-6">
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ squad.description || 'No description provided' }}
            </p>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="text-center p-3 bg-blue-50 rounded-lg">
                <p class="text-2xl font-bold text-blue-600">{{ squad.members_count || 0 }}</p>
                <p class="text-xs text-gray-600 mt-1">Members</p>
              </div>
              <div class="text-center p-3 bg-green-50 rounded-lg">
                <p class="text-2xl font-bold text-green-600">{{ squad.active_sprint ? '1' : '0' }}</p>
                <p class="text-xs text-gray-600 mt-1">Active Sprint</p>
              </div>
            </div>

            <!-- Sprint Info -->
            <div v-if="squad.active_sprint" class="bg-gray-50 rounded-lg p-3 mb-4">
              <p class="text-xs font-medium text-gray-500 mb-1">Current Sprint</p>
              <p class="text-sm font-semibold text-gray-900">{{ squad.active_sprint.name }}</p>
              <p class="text-xs text-gray-600 mt-1">
                Ends {{ formatDate(squad.active_sprint.end_date) }}
              </p>
            </div>

            <!-- Timezone & Workdays -->
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>🌐 {{ squad.timezone }}</span>
              <span>📅 {{ squad.sprint_duration_days }}d sprints</span>
            </div>
          </div>

          <!-- Squad Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <button
              @click.stop="viewSquad(squad.id)"
              class="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View Details →
            </button>
            <div v-if="isAdmin || isSquadLead(squad)" class="flex gap-2">
              <button
                @click.stop="editSquad(squad)"
                class="text-gray-600 hover:text-gray-900"
                title="Edit"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Squad Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-semibold text-gray-900 mb-6">
          {{ showEditModal ? 'Edit Squad' : 'Create New Squad' }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Squad Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="squadForm.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Development Team Alpha"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="squadForm.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the squad..."
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Project Key</label>
              <input
                v-model="squadForm.project_key"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="PROJ-001"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jira Board ID</label>
              <input
                v-model="squadForm.jira_board_id"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Optional"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                v-model="squadForm.timezone"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sprint Duration (days)</label>
              <input
                v-model.number="squadForm.sprint_duration_days"
                type="number"
                min="7"
                max="30"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Workdays</label>
            <div class="flex gap-2">
              <label v-for="(day, index) in weekDays" :key="index" class="flex items-center">
                <input
                  v-model="selectedWorkdays"
                  type="checkbox"
                  :value="index + 1"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">{{ day }}</span>
              </label>
            </div>
          </div>

          <div class="flex items-center">
            <input
              v-model="squadForm.is_active"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label class="ml-2 text-sm text-gray-700">Active Squad</label>
          </div>

          <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p class="text-sm">{{ error }}</p>
          </div>

          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              :disabled="submitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              :disabled="submitting"
            >
              {{ submitting ? 'Saving...' : (showEditModal ? 'Update Squad' : 'Create Squad') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

export default {
  name: 'Squads',
  data() {
    return {
      squads: [],
      loading: false,
      submitting: false,
      showCreateModal: false,
      showEditModal: false,
      error: null,
      squadForm: {
        name: '',
        description: '',
        timezone: 'America/New_York',
        project_key: '',
        jira_board_id: '',
        sprint_duration_days: 14,
        is_active: true
      },
      selectedWorkdays: [1, 2, 3, 4, 5],
      weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      editingSquadId: null
    }
  },
  computed: {
    user() {
      const authStore = useAuthStore()
      return authStore.user
    },
    isAdmin() {
      return this.user?.role === 'admin'
    }
  },
  async mounted() {
    await this.loadSquads()
  },
  methods: {
    async loadSquads() {
      this.loading = true
      try {
        const response = await api.squads.getAll()
        this.squads = response.data.data || response.data
      } catch (error) {
        console.error('Error loading squads:', error)
      } finally {
        this.loading = false
      }
    },

    isSquadLead(squad) {
      return squad.members?.some(m => m.user_id === this.user?.id && m.role === 'lead')
    },

    viewSquad(squadId) {
      this.$router.push(`/squads/${squadId}`)
    },

    editSquad(squad) {
      this.editingSquadId = squad.id
      this.squadForm = {
        name: squad.name,
        description: squad.description || '',
        timezone: squad.timezone,
        project_key: squad.project_key || '',
        jira_board_id: squad.jira_board_id || '',
        sprint_duration_days: squad.sprint_duration_days,
        is_active: squad.is_active
      }
      this.selectedWorkdays = squad.workdays || [1, 2, 3, 4, 5]
      this.showEditModal = true
    },

    async handleSubmit() {
      this.error = null
      this.submitting = true

      try {
        const data = {
          ...this.squadForm,
          workdays: this.selectedWorkdays
        }

        if (this.showEditModal) {
          await api.squads.update(this.editingSquadId, data)
        } else {
          await api.squads.create(data)
        }

        this.closeModal()
        await this.loadSquads()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to save squad'
      } finally {
        this.submitting = false
      }
    },

    closeModal() {
      this.showCreateModal = false
      this.showEditModal = false
      this.editingSquadId = null
      this.squadForm = {
        name: '',
        description: '',
        timezone: 'America/New_York',
        project_key: '',
        jira_board_id: '',
        sprint_duration_days: 14,
        is_active: true
      }
      this.selectedWorkdays = [1, 2, 3, 4, 5]
      this.error = null
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },

    handleLogout() {
      const authStore = useAuthStore()
      authStore.logout()
      this.$router.push('/login')
    }
  }
}
</script>
