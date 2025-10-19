<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />

    <!-- Main Content -->
    <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="py-12 text-center">
        <div
          class="inline-block w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"
        ></div>
        <p class="mt-4 text-gray-500">Loading squad details...</p>
      </div>

      <!-- Squad Details -->
      <div v-else-if="squad">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <router-link to="/squads" class="text-gray-600 hover:text-gray-900">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </router-link>
            <h2 class="text-3xl font-bold text-gray-900">{{ squad.name }}</h2>
            <span
              class="px-3 py-1 text-xs font-medium rounded-full"
              :class="
                squad.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              "
            >
              {{ squad.is_active ? "Active" : "Inactive" }}
            </span>
          </div>
          <p class="text-gray-600">
            {{ squad.description || "No description available" }}
          </p>
        </div>

        <!-- Squad Info Cards -->
        <div class="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Members</p>
                <p class="text-3xl font-bold text-blue-600">
                  {{ members.length }}
                </p>
              </div>
              <div
                class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full"
              >
                <svg
                  class="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Sprint Duration</p>
                <p class="text-3xl font-bold text-green-600">
                  {{ squad.sprint_duration_days }}d
                </p>
              </div>
              <div
                class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full"
              >
                <svg
                  class="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Timezone</p>
                <p class="text-lg font-bold text-purple-600">
                  {{ squad.timezone }}
                </p>
              </div>
              <div
                class="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full"
              >
                <svg
                  class="w-6 h-6 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Sprint -->
        <div
          v-if="activeSprint"
          class="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <h3 class="mb-4 text-xl font-semibold text-gray-900">
            Active Sprint
          </h3>
          <div
            class="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50"
          >
            <h4 class="mb-2 text-lg font-bold text-gray-900">
              {{ activeSprint.name }}
            </h4>
            <p class="mb-4 text-gray-600">{{ activeSprint.description }}</p>

            <div class="grid grid-cols-2 gap-4 mb-4 md:grid-cols-4">
              <div>
                <p class="text-xs text-gray-500">Start Date</p>
                <p class="font-medium text-gray-900">
                  {{ formatDate(activeSprint.start_date) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">End Date</p>
                <p class="font-medium text-gray-900">
                  {{ formatDate(activeSprint.end_date) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Days Remaining</p>
                <p class="font-medium text-blue-600">
                  {{ getDaysRemaining(activeSprint.end_date) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Status</p>
                <span
                  class="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full"
                >
                  {{ activeSprint.status }}
                </span>
              </div>
            </div>

            <div
              v-if="activeSprint.goals && activeSprint.goals.length"
              class="mt-4"
            >
              <p class="mb-2 text-sm font-medium text-gray-700">
                Sprint Goals:
              </p>
              <ul class="space-y-1 list-disc list-inside">
                <li
                  v-for="(goal, index) in activeSprint.goals"
                  :key="index"
                  class="text-sm text-gray-600"
                >
                  {{ goal }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Team Members -->
        <div
          class="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Team Members</h3>
            <button
              v-if="canManage"
              @click="showAddMemberModal = true"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Add Member
            </button>
          </div>

          <div
            v-if="members.length === 0"
            class="py-8 text-center text-gray-500"
          >
            <p>No members in this squad yet</p>
          </div>

          <div
            v-else
            class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <div
              v-for="member in members"
              :key="member.id"
              class="p-4 transition border border-gray-200 rounded-lg hover:shadow-md"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full"
                >
                  <span class="font-semibold text-blue-600">{{
                    getInitials(member.name)
                  }}</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ member.name }}</h4>
                  <p class="text-sm text-gray-600">{{ member.email }}</p>
                  <span
                    class="inline-block mt-1 px-2 py-0.5 text-xs rounded-full"
                    :class="getRoleBadgeClass(member.pivot?.role)"
                  >
                    {{ member.pivot?.role || "member" }}
                  </span>
                </div>
                <button
                  v-if="canManage && member.pivot?.role !== 'lead'"
                  @click="removeMember(member.id)"
                  class="text-red-600 hover:text-red-700"
                  title="Remove"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Presence Board -->
        <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 class="mb-6 text-xl font-semibold text-gray-900">
            Today's Presence
          </h3>

          <div
            v-if="presenceBoard.length === 0"
            class="py-8 text-center text-gray-500"
          >
            <p>No attendance records for today</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="record in presenceBoard"
              :key="record.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full"
                >
                  <svg
                    class="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">
                    {{ record.user?.name }}
                  </p>
                  <p class="text-sm text-gray-600">
                    Checked in at {{ formatTime(record.check_in_time) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span
                  class="px-3 py-1 text-xs font-medium rounded-full"
                  :class="getWorkModeClass(record.work_mode)"
                >
                  {{ getWorkModeLabel(record.work_mode) }}
                </span>
                <span
                  v-if="!record.check_out_time"
                  class="text-sm font-medium text-green-600"
                >
                  Active
                </span>
                <span v-else class="text-sm text-gray-500">
                  Out at {{ formatTime(record.check_out_time) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Member Modal -->
    <div
      v-if="showAddMemberModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div class="w-full max-w-md p-6 bg-white rounded-xl">
        <h3 class="mb-4 text-xl font-bold text-gray-900">Add Team Member</h3>

        <form @submit.prevent="addMember" class="space-y-4">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700"
              >Select User</label
            >
            <select
              v-model="addMemberForm.user_id"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a user...</option>
              <option
                v-for="user in availableUsers"
                :key="user.id"
                :value="user.id"
              >
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700"
              >Role</label
            >
            <select
              v-model="addMemberForm.role"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="member">Member</option>
              <option value="lead">Squad Lead</option>
            </select>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700"
              >Joined Date</label
            >
            <input
              v-model="addMemberForm.joined_at"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div
            v-if="addMemberError"
            class="p-3 text-sm text-red-700 rounded-lg bg-red-50"
          >
            {{ addMemberError }}
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeAddMemberModal"
              class="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="addingMember"
              class="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ addingMember ? "Adding..." : "Add Member" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import axios from "axios";
import NavBar from "../components/NavBar.vue";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
  name: "SquadDetail",
  components: {
    NavBar,
  },
  data() {
    return {
      squad: null,
      members: [],
      activeSprint: null,
      presenceBoard: [],
      loading: false,
      showAddMemberModal: false,
      availableUsers: [],
      addMemberForm: {
        user_id: "",
        role: "member",
        joined_at: new Date().toISOString().split("T")[0],
      },
      addMemberError: null,
      addingMember: false,
    };
  },
  computed: {
    user() {
      const authStore = useAuthStore();
      return authStore.user;
    },
    canManage() {
      return this.user?.role === "admin" || this.isSquadLead;
    },
    isSquadLead() {
      return this.members.some(
        (m) => m.id === this.user?.id && m.pivot?.role === "lead"
      );
    },
  },
  async mounted() {
    await this.loadSquadDetails();
    await this.loadAvailableUsers();
  },
  methods: {
    async loadAvailableUsers() {
      try {
        const response = await api.get("/users");
        this.availableUsers = response.data.data || response.data || [];
      } catch (error) {
        console.error("Error loading users:", error);
      }
    },

    async addMember() {
      this.addMemberError = null;
      this.addingMember = true;

      try {
        await api.post(`/squads/${this.squad.id}/members`, this.addMemberForm);
        await this.loadSquadDetails();
        this.closeAddMemberModal();
      } catch (error) {
        this.addMemberError =
          error.response?.data?.message || "Failed to add member";
      } finally {
        this.addingMember = false;
      }
    },

    closeAddMemberModal() {
      this.showAddMemberModal = false;
      this.addMemberForm = {
        user_id: "",
        role: "member",
        joined_at: new Date().toISOString().split("T")[0],
      };
      this.addMemberError = null;
    },

    async loadSquadDetails() {
      this.loading = true;
      try {
        const squadId = this.$route.params.id;

        // Load squad details
        const squadResponse = await api.get(`/squads/${squadId}`);
        this.squad = squadResponse.data.data || squadResponse.data;

        // Load members
        const membersResponse = await api.get(`/squads/${squadId}/members`);
        this.members = membersResponse.data.data || membersResponse.data || [];

        // Load active sprint
        try {
          const sprintResponse = await api.get(
            `/squads/${squadId}/active-sprint`
          );
          this.activeSprint = sprintResponse.data.data || sprintResponse.data;
        } catch (error) {
          console.log("No active sprint");
        }

        // Load today's presence
        const presenceResponse = await api.get(
          `/attendance/squad/${squadId}/today`
        );
        const responseData = presenceResponse.data.data;
        this.presenceBoard = responseData.presence_board || [];
      } catch (error) {
        console.error("Error loading squad details:", error);
        alert("Failed to load squad details");
      } finally {
        this.loading = false;
      }
    },

    async removeMember(userId) {
      if (!confirm("Are you sure you want to remove this member?")) return;

      try {
        await api.delete(`/squads/${this.squad.id}/members/${userId}`);
        await this.loadSquadDetails();
      } catch (error) {
        alert("Failed to remove member");
      }
    },

    getInitials(name) {
      return (
        name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase() || "??"
      );
    },

    getRoleBadgeClass(role) {
      const classes = {
        lead: "bg-yellow-100 text-yellow-800",
        member: "bg-blue-100 text-blue-800",
        viewer: "bg-gray-100 text-gray-800",
      };
      return classes[role] || "bg-gray-100 text-gray-800";
    },

    getWorkModeLabel(mode) {
      const labels = {
        office: "🏢 Office",
        remote: "🏠 Remote",
        client_site: "👥 Client",
        ooo: "🚫 OOO",
      };
      return labels[mode] || mode;
    },

    getWorkModeClass(mode) {
      const classes = {
        office: "bg-blue-100 text-blue-800",
        remote: "bg-purple-100 text-purple-800",
        client_site: "bg-green-100 text-green-800",
        ooo: "bg-gray-100 text-gray-800",
      };
      return classes[mode] || "bg-gray-100 text-gray-800";
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },

    formatTime(timeString) {
      return new Date(timeString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    getDaysRemaining(endDate) {
      const end = new Date(endDate);
      const today = new Date();
      const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
      return diff > 0 ? `${diff} days` : "Ended";
    },

    handleLogout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push("/login");
    },
  },
};
</script>
