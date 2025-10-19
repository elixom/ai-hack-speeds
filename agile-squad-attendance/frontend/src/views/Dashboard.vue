<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />

    <!-- Main Content -->
    <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900">
          Welcome back, {{ user?.name }}!
        </h2>
        <p class="mt-1 text-gray-600">{{ getCurrentDate() }}</p>
      </div>

      <!-- Check-In/Out Card -->
      <div class="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        <div class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 class="mb-4 text-xl font-semibold text-gray-900">Attendance</h3>

          <!-- Current Status -->
          <div v-if="todayAttendance" class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-sm text-gray-600">Current Status</p>
                <p
                  class="text-2xl font-bold"
                  :class="isCheckedIn ? 'text-green-600' : 'text-gray-400'"
                >
                  {{ isCheckedIn ? "Checked In" : "Checked Out" }}
                </p>
              </div>
              <div
                class="flex items-center justify-center w-12 h-12 rounded-full"
                :class="isCheckedIn ? 'bg-green-100' : 'bg-gray-100'"
              >
                <svg
                  v-if="isCheckedIn"
                  class="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  class="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div v-if="todayAttendance.check_in_time" class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Check In:</span>
                <span class="font-medium text-gray-900">{{
                  formatTime(todayAttendance.check_in_time)
                }}</span>
              </div>
              <div
                v-if="todayAttendance.check_out_time"
                class="flex justify-between text-sm"
              >
                <span class="text-gray-600">Check Out:</span>
                <span class="font-medium text-gray-900">{{
                  formatTime(todayAttendance.check_out_time)
                }}</span>
              </div>
              <div
                v-if="todayAttendance.check_out_time"
                class="flex justify-between pt-2 text-sm border-t"
              >
                <span class="text-gray-600">Total Hours:</span>
                <span class="font-semibold text-blue-600">{{
                  calculateHours(todayAttendance)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Check In/Out Buttons -->
          <div class="space-y-3">
            <button
              v-if="!isCheckedIn"
              @click="showCheckInModal = true"
              class="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
              :disabled="loading"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              Check In
            </button>

            <button
              v-if="isCheckedIn"
              @click="showCheckOutModal = true"
              class="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition bg-red-600 rounded-lg hover:bg-red-700"
              :disabled="loading"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.293l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 7.586V4a1 1 0 012 0v3.586l1.293-1.293a1 1 0 011.414 1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              Check Out
            </button>
          </div>

          <!-- Work Mode -->
          <div v-if="todayAttendance" class="pt-4 mt-4 border-t">
            <label class="block mb-2 text-sm font-medium text-gray-700"
              >Work Mode</label
            >
            <select
              v-model="todayAttendance.work_mode"
              @change="updateWorkMode"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              :disabled="!isCheckedIn"
            >
              <option value="office">🏢 Office</option>
              <option value="remote">🏠 Remote</option>
              <option value="client_site">👥 Client Site</option>
              <option value="ooo">🚫 Out of Office</option>
            </select>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 class="mb-4 text-xl font-semibold text-gray-900">This Week</h3>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 rounded-lg bg-blue-50">
              <p class="text-sm font-medium text-blue-600">Days Present</p>
              <p class="mt-2 text-3xl font-bold text-blue-900">
                {{ stats.daysPresent || 0 }}
              </p>
            </div>
            <div class="p-4 rounded-lg bg-green-50">
              <p class="text-sm font-medium text-green-600">Total Hours</p>
              <p class="mt-2 text-3xl font-bold text-green-900">
                {{ stats.totalHours || 0 }}
              </p>
            </div>
            <div class="p-4 rounded-lg bg-yellow-50">
              <p class="text-sm font-medium text-yellow-600">Avg. Hours/Day</p>
              <p class="mt-2 text-3xl font-bold text-yellow-900">
                {{ stats.avgHours || 0 }}
              </p>
            </div>
            <div class="p-4 rounded-lg bg-purple-50">
              <p class="text-sm font-medium text-purple-600">Remote Days</p>
              <p class="mt-2 text-3xl font-bold text-purple-900">
                {{ stats.remoteDays || 0 }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h3 class="mb-4 text-xl font-semibold text-gray-900">
          Recent Activity
        </h3>

        <div
          v-if="loading && !recentAttendance.length"
          class="py-8 text-center"
        >
          <div
            class="inline-block w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"
          ></div>
          <p class="mt-2 text-gray-500">Loading...</p>
        </div>

        <div
          v-else-if="recentAttendance.length === 0"
          class="py-8 text-center text-gray-500"
        >
          <svg
            class="w-12 h-12 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p class="mt-2">No attendance records yet</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Date
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Check In
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Check Out
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Hours
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Mode
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="record in recentAttendance"
                :key="record.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {{ formatDate(record.date) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {{ formatTime(record.check_in_time) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {{
                    record.check_out_time
                      ? formatTime(record.check_out_time)
                      : "-"
                  }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {{ record.check_out_time ? calculateHours(record) : "-" }}
                </td>
                <td class="px-6 py-4 text-sm whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs rounded-full"
                    :class="getWorkModeClass(record.work_mode)"
                  >
                    {{ getWorkModeLabel(record.work_mode) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs rounded-full"
                    :class="
                      record.check_out_time
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    "
                  >
                    {{ record.check_out_time ? "Complete" : "In Progress" }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Check In Modal -->
    <div
      v-if="showCheckInModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div class="w-full max-w-md p-6 bg-white rounded-xl">
        <h3 class="mb-4 text-xl font-semibold text-gray-900">Check In</h3>

        <div class="space-y-4">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700"
              >Work Mode</label
            >
            <select
              v-model="checkInForm.work_mode"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="office">🏢 Office</option>
              <option value="remote">🏠 Remote</option>
              <option value="client_site">👥 Client Site</option>
            </select>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700"
              >Squad</label
            >
            <select
              v-model="checkInForm.squad_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Please Choose</option>
              <option v-for="squad in user.squads" :value="squad.id">
                {{ squad.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700"
              >Event Type (Optional)</label
            >
            <select
              v-model="checkInForm.event_type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Regular Day</option>
              <option value="standup">Daily Standup</option>
              <option value="sprint_planning">Sprint Planning</option>
              <option value="retro">Retrospective</option>
              <option value="demo">Sprint Demo</option>
            </select>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700"
              >Notes (Optional)</label
            >
            <textarea
              v-model="checkInForm.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Any notes for today..."
            ></textarea>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            @click="showCheckInModal = false"
            class="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            @click="handleCheckIn"
            class="flex-1 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
            :disabled="loading"
          >
            {{ loading ? "Checking in..." : "Check In" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Check Out Modal -->
    <div
      v-if="showCheckOutModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div class="w-full max-w-md p-6 bg-white rounded-xl">
        <h3 class="mb-4 text-xl font-semibold text-gray-900">Check Out</h3>

        <div class="space-y-4">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700"
              >Today's Summary (Optional)</label
            >
            <textarea
              v-model="checkOutForm.notes"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="What did you accomplish today?"
            ></textarea>
          </div>

          <div class="p-4 rounded-lg bg-blue-50">
            <p class="text-sm text-gray-600">Total hours today:</p>
            <p class="mt-1 text-2xl font-bold text-blue-600">
              {{ calculateCurrentHours() }}
            </p>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            @click="showCheckOutModal = false"
            class="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            @click="handleCheckOut"
            class="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            :disabled="loading"
          >
            {{ loading ? "Checking out..." : "Check Out" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import { useAttendanceStore } from "../stores/attendance";
import NavBar from "../components/NavBar.vue";

export default {
  name: "Dashboard",
  components: {
    NavBar,
  },
  data() {
    return {
      loading: false,
      showCheckInModal: false,
      showCheckOutModal: false,
      checkInForm: {
        squad_id: "",
        work_mode: "office",
        event_type: "",
        notes: "",
      },
      checkOutForm: {
        notes: "",
      },
      stats: {
        daysPresent: 0,
        totalHours: 0,
        avgHours: 0,
        remoteDays: 0,
      },
    };
  },
  computed: {
    user() {
      const authStore = useAuthStore();
      return authStore.user;
    },
    todayAttendance() {
      const attendanceStore = useAttendanceStore();
      this.checkOutForm.attendance_id = attendanceStore.todayAttendance?.id;
      return attendanceStore.todayAttendance;
    },
    recentAttendance() {
      const attendanceStore = useAttendanceStore();
      return attendanceStore.attendanceHistory;
    },
    isCheckedIn() {
      return (
        this.todayAttendance?.check_in_time &&
        !this.todayAttendance?.check_out_time
      );
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const attendanceStore = useAttendanceStore();
        await attendanceStore.fetchTodayAttendance();
        await attendanceStore.fetchAttendanceHistory();
        await this.fetchStats();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchStats() {
      // Calculate stats from recent attendance
      const recent = this.recentAttendance.filter((r) => {
        const date = new Date(r.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date >= weekAgo;
      });

      this.stats.daysPresent = recent.length;
      this.stats.remoteDays = recent.filter(
        (r) => r.work_mode === "remote"
      ).length;

      const totalMinutes = recent.reduce((sum, r) => {
        if (r.check_out_time) {
          const hours = this.calculateHours(r);
          return sum + parseFloat(hours) * 60;
        }
        return sum;
      }, 0);

      this.stats.totalHours = Math.round((totalMinutes / 60) * 10) / 10;
      this.stats.avgHours =
        recent.length > 0
          ? Math.round((totalMinutes / recent.length / 60) * 10) / 10
          : 0;
    },

    async handleCheckIn() {
      this.loading = true;
      try {
        const attendanceStore = useAttendanceStore();
        await attendanceStore.checkIn(this.checkInForm);
        this.showCheckInModal = false;
        this.checkInForm = { work_mode: "office", event_type: "", notes: "" };
        await this.loadData();
      } catch (error) {
        alert("Already checked in today for this squad or an error occurred.");
      } finally {
        this.loading = false;
      }
    },

    async handleCheckOut() {
      this.loading = true;
      try {
        const attendanceStore = useAttendanceStore();
        await attendanceStore.checkOut(this.checkOutForm);
        this.showCheckOutModal = false;
        this.checkOutForm = { notes: "" };
        await this.loadData();
      } catch (error) {
        alert("Failed to check out. Please try again.");
      } finally {
        this.loading = false;
      }
    },

    async updateWorkMode() {
      if (!this.isCheckedIn) return;

      try {
        const attendanceStore = useAttendanceStore();
        await attendanceStore.updateWorkMode(this.todayAttendance.work_mode);
      } catch (error) {
        alert("Failed to update work mode");
      }
    },

    handleLogout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push("/login");
    },

    getCurrentDate() {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date().toLocaleDateString("en-US", options);
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },

    formatTime(timeString) {
      if (!timeString) return "-";
      return new Date(timeString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    calculateHours(record) {
      if (!record.check_in_time || !record.check_out_time) return "-";

      const checkIn = new Date(record.check_in_time);
      const checkOut = new Date(record.check_out_time);
      const diff = checkOut - checkIn;
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      return `${hours}h ${minutes}m`;
    },

    calculateCurrentHours() {
      if (!this.todayAttendance?.check_in_time) return "0h 0m";

      const checkIn = new Date(this.todayAttendance.check_in_time);
      const now = new Date();
      const diff = now - checkIn;
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      return `${hours}h ${minutes}m`;
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
  },
};
</script>
