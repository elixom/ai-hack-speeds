<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link
            to="/dashboard"
            class="text-xl font-bold text-gray-900 sm:text-2xl"
          >
            Agile Squad
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden space-x-4 md:flex md:items-center">
          <router-link
            to="/dashboard"
            :class="
              isActive('/dashboard')
                ? 'font-medium text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            "
            class="text-sm"
          >
            Dashboard
          </router-link>
          <router-link
            to="/squads"
            :class="
              isActive('/squads')
                ? 'font-medium text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            "
            class="text-sm"
          >
            Squads
          </router-link>
          <router-link
            to="/leave-requests"
            :class="
              isActive('/leave-requests')
                ? 'font-medium text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            "
            class="text-sm"
          >
            Leave
          </router-link>
          <router-link
            v-if="user?.role === 'admin'"
            to="/admin"
            :class="
              isActive('/admin')
                ? 'font-medium text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            "
            class="text-sm"
          >
            Admin
          </router-link>

          <!-- User Menu Dropdown -->
          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <div
                class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full"
              >
                <span class="text-xs font-medium text-blue-600">{{
                  getUserInitials()
                }}</span>
              </div>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                @click="showUserMenu = false"
              >
                👤 Profile
              </router-link>
              <router-link
                to="/attendance"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                @click="showUserMenu = false"
              >
                📅 My Attendance
              </router-link>
              <router-link
                to="/reports"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                @click="showUserMenu = false"
              >
                📊 Reports
              </router-link>
              <router-link
                to="/settings"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                @click="showUserMenu = false"
              >
                ⚙️ Settings
              </router-link>
              <hr class="my-1" />
              <button
                @click="handleLogout"
                class="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center md:hidden">
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="inline-flex items-center justify-center p-2 text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!showMobileMenu"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="pb-3 md:hidden">
        <router-link
          to="/dashboard"
          :class="
            isActive('/dashboard')
              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
              : 'text-gray-600'
          "
          class="block px-4 py-2 text-base font-medium hover:bg-gray-50"
          @click="showMobileMenu = false"
        >
          📊 Dashboard
        </router-link>
        <router-link
          to="/squads"
          :class="
            isActive('/squads')
              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
              : 'text-gray-600'
          "
          class="block px-4 py-2 text-base font-medium hover:bg-gray-50"
          @click="showMobileMenu = false"
        >
          👥 Squads
        </router-link>
        <router-link
          to="/attendance"
          :class="
            isActive('/attendance')
              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
              : 'text-gray-600'
          "
          class="block px-4 py-2 text-base font-medium hover:bg-gray-50"
          @click="showMobileMenu = false"
        >
          📅 Attendance
        </router-link>
        <router-link
          to="/leave-requests"
          :class="
            isActive('/leave-requests')
              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
              : 'text-gray-600'
          "
          class="block px-4 py-2 text-base font-medium hover:bg-gray-50"
          @click="showMobileMenu = false"
        >
          🏖️ Leave
        </router-link>
        <router-link
          to="/reports"
          :class="
            isActive('/reports')
              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
              : 'text-gray-600'
          "
          class="block px-4 py-2 text-base font-medium hover:bg-gray-50"
          @click="showMobileMenu = false"
        >
          📈 Reports
        </router-link>
        <router-link
          v-if="user?.role === 'admin'"
          to="/admin"
          :class="
            isActive('/admin')
              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
              : 'text-gray-600'
          "
          class="block px-4 py-2 text-base font-medium hover:bg-gray-50"
          @click="showMobileMenu = false"
        >
          👑 Admin
        </router-link>
        <router-link
          v-if="user?.role === 'admin'"
          to="/settings"
          :class="
            isActive('/settings')
              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
              : 'text-gray-600'
          "
          class="block px-4 py-2 text-base font-medium hover:bg-gray-50"
          @click="showMobileMenu = false"
        >
          ⚙️ Settings
        </router-link>
        <router-link
          to="/profile"
          :class="
            isActive('/profile')
              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
              : 'text-gray-600'
          "
          class="block px-4 py-2 text-base font-medium hover:bg-gray-50"
          @click="showMobileMenu = false"
        >
          👤 Profile
        </router-link>
        <button
          @click="handleLogout"
          class="block w-full px-4 py-2 text-base font-medium text-left text-red-600 hover:bg-red-50"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter, useRoute } from "vue-router";

export default {
  name: "NavBar",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    const showUserMenu = ref(false);
    const showMobileMenu = ref(false);

    const user = authStore.user;

    const isActive = (path) => {
      return route.path.startsWith(path);
    };

    const getUserInitials = () => {
      if (!user?.name) return "??";
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    };

    const handleLogout = () => {
      authStore.logout();
      router.push("/login");
    };

    return {
      user,
      showUserMenu,
      showMobileMenu,
      isActive,
      getUserInitials,
      handleLogout,
    };
  },
};
</script>
