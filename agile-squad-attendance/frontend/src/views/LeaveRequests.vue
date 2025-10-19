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
          <h2 class="text-3xl font-bold text-gray-900">Leave Requests</h2>
          <p class="text-gray-600 mt-1">Manage your leave requests and approvals</p>
        </div>
        <button
          @click="showRequestModal = true"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
          </svg>
          Request Leave
        </button>
      </div>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'my-requests'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition',
              activeTab === 'my-requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            My Requests
            <span v-if="myRequests.length > 0" class="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
              {{ myRequests.length }}
            </span>
          </button>
          <button
            v-if="canApprove"
            @click="activeTab = 'pending-approvals'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition',
              activeTab === 'pending-approvals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Pending Approvals
            <span v-if="pendingApprovals.length > 0" class="ml-2 px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
              {{ pendingApprovals.length }}
            </span>
          </button>
        </nav>
      </div>

      <!-- My Requests Tab -->
      <div v-if="activeTab === 'my-requests'">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p class="text-gray-500 mt-4">Loading requests...</p>
        </div>

        <div v-else-if="myRequests.length === 0" class="text-center py-12">
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No leave requests</h3>
          <p class="mt-2 text-gray-500">Submit your first leave request to get started</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="request in myRequests"
            :key="request.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ getLeaveTypeLabel(request.leave_type) }}</h3>
                  <span
                    class="px-3 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(request.status)"
                  >
                    {{ request.status }}
                  </span>
                </div>
                <p class="text-gray-600 text-sm mb-3">{{ request.reason }}</p>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-gray-500">Start Date</p>
                    <p class="font-medium text-gray-900">{{ formatDate(request.start_date) }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500">End Date</p>
                    <p class="font-medium text-gray-900">{{ formatDate(request.end_date) }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Duration</p>
                    <p class="font-medium text-gray-900">{{ calculateDuration(request) }} days</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Submitted</p>
                    <p class="font-medium text-gray-900">{{ formatDateTime(request.created_at) }}</p>
                  </div>
                </div>

                <!-- Approval Status -->
                <div v-if="request.approval" class="mt-4 pt-4 border-t">
                  <div class="flex items-center gap-2">
                    <svg v-if="request.status === 'approved'" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else-if="request.status === 'rejected'" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                    <p class="text-sm text-gray-600">
                      {{ request.status === 'approved' ? 'Approved' : 'Rejected' }} by 
                      <span class="font-medium">{{ request.approval.approver?.name }}</span>
                      on {{ formatDateTime(request.approval.approved_at || request.approval.rejected_at) }}
                    </p>
                  </div>
                  <p v-if="request.approval.comments" class="text-sm text-gray-600 mt-2 italic">
                    "{{ request.approval.comments }}"
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div v-if="request.status === 'pending'" class="flex gap-2">
                <button
                  @click="editRequest(request)"
                  class="text-blue-600 hover:text-blue-700"
                  title="Edit"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                </button>
                <button
                  @click="cancelRequest(request.id)"
                  class="text-red-600 hover:text-red-700"
                  title="Cancel"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Approvals Tab -->
      <div v-if="activeTab === 'pending-approvals' && canApprove">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p class="text-gray-500 mt-4">Loading approvals...</p>
        </div>

        <div v-else-if="pendingApprovals.length === 0" class="text-center py-12">
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">All caught up!</h3>
          <p class="mt-2 text-gray-500">No pending leave requests to approve</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="request in pendingApprovals"
            :key="request.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span class="text-blue-600 font-semibold">{{ getInitials(request.user?.name) }}</span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ request.user?.name }}</h3>
                  <p class="text-sm text-gray-500">{{ request.user?.email }}</p>
                </div>
              </div>
              <span class="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                Pending Approval
              </span>
            </div>

            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <p class="text-sm font-medium text-gray-700 mb-2">{{ getLeaveTypeLabel(request.leave_type) }}</p>
              <p class="text-gray-600 text-sm mb-3">{{ request.reason }}</p>
              
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p class="text-gray-500">Start Date</p>
                  <p class="font-medium text-gray-900">{{ formatDate(request.start_date) }}</p>
                </div>
                <div>
                  <p class="text-gray-500">End Date</p>
                  <p class="font-medium text-gray-900">{{ formatDate(request.end_date) }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Duration</p>
                  <p class="font-medium text-gray-900">{{ calculateDuration(request) }} days</p>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                @click="showApprovalModal(request, 'approve')"
                class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Approve
              </button>
              <button
                @click="showApprovalModal(request, 'reject')"
                class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-medium"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Request Leave Modal -->
    <div v-if="showRequestModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-lg w-full p-6">
        <h3 class="text-2xl font-semibold text-gray-900 mb-6">Request Leave</h3>

        <form @submit.prevent="submitLeaveRequest" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Leave Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="leaveForm.leave_type"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select leave type</option>
              <option value="vacation">Vacation</option>
              <option value="sick">Sick Leave</option>
              <option value="public_holiday">Public Holiday</option>
              <option value="training">Training</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span class="text-red-500">*</span>
              </label>
              <input
                v-model="leaveForm.start_date"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                End Date <span class="text-red-500">*</span>
              </label>
              <input
                v-model="leaveForm.end_date"
                type="date"
                required
                :min="leaveForm.start_date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Reason <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="leaveForm.reason"
              rows="4"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Please provide a reason for your leave request..."
            ></textarea>
          </div>

          <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p class="text-sm">{{ error }}</p>
          </div>

          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="closeRequestModal"
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
              {{ submitting ? 'Submitting...' : 'Submit Request' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Approval Modal -->
    <div v-if="approvalModal.show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-lg w-full p-6">
        <h3 class="text-2xl font-semibold text-gray-900 mb-6">
          {{ approvalModal.action === 'approve' ? 'Approve' : 'Reject' }} Leave Request
        </h3>

        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">{{ approvalModal.request?.user?.name }}</p>
          <p class="font-medium text-gray-900">{{ getLeaveTypeLabel(approvalModal.request?.leave_type) }}</p>
          <p class="text-sm text-gray-600 mt-2">
            {{ formatDate(approvalModal.request?.start_date) }} - {{ formatDate(approvalModal.request?.end_date) }}
          </p>
        </div>

        <form @submit.prevent="handleApproval" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Comments {{ approvalModal.action === 'reject' ? '(Required)' : '(Optional)' }}
            </label>
            <textarea
              v-model="approvalModal.comments"
              rows="4"
              :required="approvalModal.action === 'reject'"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              :placeholder="approvalModal.action === 'approve' ? 'Add any notes...' : 'Please provide a reason for rejection...'"
            ></textarea>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="closeApprovalModal"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              :disabled="submitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              :class="[
                'flex-1 px-4 py-2 rounded-lg text-white font-medium',
                approvalModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              ]"
              :disabled="submitting"
            >
              {{ submitting ? 'Processing...' : (approvalModal.action === 'approve' ? 'Approve' : 'Reject') }}
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
  name: 'LeaveRequests',
  data() {
    return {
      activeTab: 'my-requests',
      myRequests: [],
      pendingApprovals: [],
      loading: false,
      submitting: false,
      showRequestModal: false,
      error: null,
      leaveForm: {
        leave_type: '',
        start_date: '',
        end_date: '',
        reason: ''
      },
      approvalModal: {
        show: false,
        request: null,
        action: null,
        comments: ''
      }
    }
  },
  computed: {
    user() {
      const authStore = useAuthStore()
      return authStore.user
    },
    canApprove() {
      return this.user?.role === 'admin' || this.user?.role === 'squad_lead'
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        await this.loadMyRequests()
        if (this.canApprove) {
          await this.loadPendingApprovals()
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        this.loading = false
      }
    },

    async loadMyRequests() {
      try {
        const response = await api.leave.getMyRequests()
        this.myRequests = response.data.data || response.data
      } catch (error) {
        console.error('Error loading requests:', error)
      }
    },

    async loadPendingApprovals() {
      try {
        const response = await api.leave.getPendingApprovals()
        this.pendingApprovals = response.data.data || response.data
      } catch (error) {
        console.error('Error loading approvals:', error)
      }
    },

    async submitLeaveRequest() {
      this.error = null
      this.submitting = true

      try {
        await api.leave.create(this.leaveForm)
        this.closeRequestModal()
        await this.loadMyRequests()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to submit request'
      } finally {
        this.submitting = false
      }
    },

    showApprovalModal(request, action) {
      this.approvalModal = {
        show: true,
        request,
        action,
        comments: ''
      }
    },

    async handleApproval() {
      this.submitting = true
      try {
        if (this.approvalModal.action === 'approve') {
          await api.leave.approve(this.approvalModal.request.id, {
            comments: this.approvalModal.comments
          })
        } else {
          await api.leave.reject(this.approvalModal.request.id, {
            comments: this.approvalModal.comments
          })
        }
        
        this.closeApprovalModal()
        await this.loadData()
      } catch (error) {
        alert('Failed to process approval')
      } finally {
        this.submitting = false
      }
    },

    async cancelRequest(id) {
      if (!confirm('Are you sure you want to cancel this request?')) return

      try {
        await api.leave.cancel(id)
        await this.loadMyRequests()
      } catch (error) {
        alert('Failed to cancel request')
      }
    },

    editRequest(request) {
      this.leaveForm = {
        leave_type: request.leave_type,
        start_date: request.start_date,
        end_date: request.end_date,
        reason: request.reason
      }
      this.showRequestModal = true
    },

    closeRequestModal() {
      this.showRequestModal = false
      this.leaveForm = {
        leave_type: '',
        start_date: '',
        end_date: '',
        reason: ''
      }
      this.error = null
    },

    closeApprovalModal() {
      this.approvalModal = {
        show: false,
        request: null,
        action: null,
        comments: ''
      }
    },

    getLeaveTypeLabel(type) {
      const labels = {
        vacation: '🏖️ Vacation',
        sick: '🤒 Sick Leave',
        public_holiday: '🎉 Public Holiday',
        training: '📚 Training',
        other: '📋 Other'
      }
      return labels[type] || type
    },

    getStatusClass(status) {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    },

    formatDateTime(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    calculateDuration(request) {
      const start = new Date(request.start_date)
      const end = new Date(request.end_date)
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
      return diff
    },

    getInitials(name) {
      return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'
    },

    handleLogout() {
      const authStore = useAuthStore()
      authStore.logout()
      this.$router.push('/login')
    }
  }
}
</script>
