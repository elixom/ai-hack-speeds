<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white border-b border-gray-200 shadow-sm">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link
              to="/dashboard"
              class="text-2xl font-bold text-gray-900"
              >Agile Squad</router-link
            >
          </div>
          <div class="flex items-center space-x-4">
            <router-link
              to="/dashboard"
              class="text-gray-600 hover:text-gray-900"
              >Dashboard</router-link
            >
            <router-link
              to="/leave-requests"
              class="text-gray-600 hover:text-gray-900"
              >Leave</router-link
            >
            <router-link to="/profile" class="text-gray-600 hover:text-gray-900"
              >Profile</router-link
            >
            <button
              @click="handleLogout"
              class="text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Squads</h2>
          <p class="mt-1 text-gray-600">
            Manage your agile squads and team members
          </p>
        </div>
        <button
          v-if="isAdmin"
          @click="showCreateModal = true"
          class="flex items-center px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          Create Squad
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading && squads.length === 0" class="py-12 text-center">
        <div
          class="inline-block w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"
        ></div>
        <p class="mt-4 text-gray-500">Loading squads...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="squads.length === 0" class="py-12 text-center">
        <svg
          class="w-16 h-16 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No squads yet</h3>
        <p class="mt-2 text-gray-500">
          Get started by creating your first squad
        </p>
        <button
          v-if="isAdmin"
          @click="showCreateModal = true"
          class="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Create Squad
        </button>
      </div>

      <!-- Squads Grid -->
      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="squad in squads"
          :key="squad.id"
          class="flex flex-col overflow-hidden transition bg-white border border-gray-200 shadow-sm cursor-pointer rounded-xl hover:shadow-md"
          @click="viewSquad(squad.id)"
        >
          <!-- Squad Header -->
          <div
            class="p-6 text-white bg-gradient-to-r from-blue-500 to-indigo-600"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="mb-1 text-xl font-bold">{{ squad.name }}</h3>
                <p class="text-sm text-blue-100">
                  {{ squad.project_key || "No project" }}
                </p>
              </div>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="
                  squad.is_active
                    ? 'bg-green-400 text-green-900'
                    : 'bg-gray-400 text-gray-900'
                "
              >
                {{ squad.is_active ? "Active" : "Inactive" }}
              </span>
            </div>
          </div>

          <!-- Squad Body -->
          <div class="flex-1 p-6">
            <p class="mb-4 text-sm text-gray-600 line-clamp-2">
              {{ squad.description || "No description provided" }}
            </p>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="p-3 text-center rounded-lg bg-blue-50">
                <p class="text-2xl font-bold text-blue-600">
                  {{ squad.members.length }}
                </p>
                <p class="mt-1 text-xs text-gray-600">Members</p>
              </div>
              <div class="p-3 text-center rounded-lg bg-green-50">
                <p class="text-2xl font-bold text-green-600">
                  {{ squad.sprints.length }}
                </p>
                <p class="mt-1 text-xs text-gray-600">Active Sprint</p>
              </div>
            </div>

            <!-- Sprint Info -->
            <div
              v-if="squad.active_sprint"
              class="p-3 mb-4 rounded-lg bg-gray-50"
            >
              <p class="mb-1 text-xs font-medium text-gray-500">
                Current Sprint
              </p>
              <p class="text-sm font-semibold text-gray-900">
                {{ squad.active_sprint.name }}
              </p>
              <p class="mt-1 text-xs text-gray-600">
                Ends {{ formatDate(squad.active_sprint.end_date) }}
              </p>
            </div>

            <!-- Timezone & Workdays -->
            <div
              class="flex items-center justify-between text-xs text-gray-500"
            >
              <span>🌐 {{ squad.timezone }}</span>
              <span>📅 {{ squad.sprint_duration_days }}d sprints</span>
            </div>
          </div>

          <!-- Squad Footer -->
          <div
            class="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50"
          >
            <button
              @click.stop="viewSquad(squad.id)"
              class="text-sm font-medium text-blue-600 hover:text-blue-700"
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
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Squad Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <h3 class="mb-6 text-2xl font-semibold text-gray-900">
          {{ showEditModal ? "Edit Squad" : "Create New Squad" }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">
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
            <label class="block mb-1 text-sm font-medium text-gray-700"
              >Description</label
            >
            <textarea
              v-model="squadForm.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the squad..."
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700"
                >Project Key</label
              >
              <input
                v-model="squadForm.project_key"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="PROJ-001"
              />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700"
                >Jira Board ID</label
              >
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
              <label class="block mb-1 text-sm font-medium text-gray-700"
                >Timezone</label
              >
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
              <label class="block mb-1 text-sm font-medium text-gray-700"
                >Sprint Duration (days)</label
              >
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
            <label class="block mb-2 text-sm font-medium text-gray-700"
              >Workdays</label
            >
            <div class="flex gap-2">
              <label
                v-for="(day, index) in weekDays"
                :key="index"
                class="flex items-center"
              >
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

          <div
            v-if="error"
            class="p-4 text-red-700 border-l-4 border-red-500 rounded bg-red-50"
          >
            <p class="text-sm">{{ error }}</p>
          </div>

          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              :disabled="submitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              :disabled="submitting"
            >
              {{
                submitting
                  ? "Saving..."
                  : showEditModal
                  ? "Update Squad"
                  : "Create Squad"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import api from "../services/api";

export default {
  name: "Squads",
  data() {
    return {
      squads: [],
      loading: false,
      submitting: false,
      showCreateModal: false,
      showEditModal: false,
      error: null,
      squadForm: {
        name: "",
        description: "",
        timezone: "America/New_York",
        project_key: "",
        jira_board_id: "",
        sprint_duration_days: 14,
        is_active: true,
      },
      selectedWorkdays: [1, 2, 3, 4, 5],
      weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      editingSquadId: null,
    };
  },
  computed: {
    user() {
      const authStore = useAuthStore();
      return authStore.user;
    },
    isAdmin() {
      return this.user?.role === "admin";
    },
  },
  async mounted() {
    await this.loadSquads();
  },
  methods: {
    async loadSquads() {
      this.loading = true;
      try {
        const response = await api.squads.getAll();
        this.squads = response.data.data || response.data;
      } catch (error) {
        console.error("Error loading squads:", error);
      } finally {
        this.loading = false;
      }
    },

    isSquadLead(squad) {
      return squad.members?.some(
        (m) => m.user_id === this.user?.id && m.role === "lead"
      );
    },

    viewSquad(squadId) {
      this.$router.push(`/squads/${squadId}`);
    },

    editSquad(squad) {
      this.editingSquadId = squad.id;
      this.squadForm = {
        name: squad.name,
        description: squad.description || "",
        timezone: squad.timezone,
        project_key: squad.project_key || "",
        jira_board_id: squad.jira_board_id || "",
        sprint_duration_days: squad.sprint_duration_days,
        is_active: squad.is_active,
      };
      this.selectedWorkdays = squad.workdays || [1, 2, 3, 4, 5];
      this.showEditModal = true;
    },

    async handleSubmit() {
      this.error = null;
      this.submitting = true;

      try {
        const data = {
          ...this.squadForm,
          workdays: this.selectedWorkdays,
        };

        if (this.showEditModal) {
          await api.squads.update(this.editingSquadId, data);
        } else {
          await api.squads.create(data);
        }

        this.closeModal();
        await this.loadSquads();
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to save squad";
      } finally {
        this.submitting = false;
      }
    },

    closeModal() {
      this.showCreateModal = false;
      this.showEditModal = false;
      this.editingSquadId = null;
      this.squadForm = {
        name: "",
        description: "",
        timezone: "America/New_York",
        project_key: "",
        jira_board_id: "",
        sprint_duration_days: 14,
        is_active: true,
      };
      this.selectedWorkdays = [1, 2, 3, 4, 5];
      this.error = null;
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    },

    handleLogout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push("/login");
    },
  },
};
</script>
