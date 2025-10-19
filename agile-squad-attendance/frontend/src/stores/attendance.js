import { defineStore } from 'pinia'
import { attendanceAPI } from '../services/api'

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    todayAttendance: null,
    presenceBoard: null,
    attendanceHistory: [],
    stats: null,
    loading: false,
    error: null
  }),

  getters: {
    isCheckedInToday: (state) => {
      return state.todayAttendance && state.todayAttendance.length > 0
    },
    currentCheckIn: (state) => {
      return state.todayAttendance?.[0] || null
    },
    hasCheckedOut: (state) => {
      return state.currentCheckIn?.check_out_time != null
    }
  },

  actions: {
    async fetchTodayAttendance() {
      this.loading = true
      this.error = null
      try {
        const response = await attendanceAPI.getToday()
        if (response.data.success) {
          this.todayAttendance = response.data.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch attendance'
      } finally {
        this.loading = false
      }
    },

    async checkIn(data) {
      this.loading = true
      this.error = null
      try {
        const response = await attendanceAPI.checkIn(data)
        if (response.data.success) {
          await this.fetchTodayAttendance()
          return response.data.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Check-in failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkOut(data = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await attendanceAPI.checkOut(data)
        if (response.data.success) {
          await this.fetchTodayAttendance()
          return response.data.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Check-out failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateWorkMode(workMode) {
      this.loading = true
      this.error = null
      try {
        if (this.todayAttendance?.id) {
          const response = await attendanceAPI.update(this.todayAttendance.id, {
            work_mode: workMode
          })
          if (response.data.success) {
            await this.fetchTodayAttendance()
            return response.data.data
          }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update work mode'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchSquadPresenceBoard(squadId) {
      this.loading = true
      this.error = null
      try {
        const response = await attendanceAPI.getSquadToday(squadId)
        if (response.data.success) {
          this.presenceBoard = response.data.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch presence board'
      } finally {
        this.loading = false
      }
    },

    async fetchAttendanceHistory(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await attendanceAPI.getAll(params)
        if (response.data.success) {
          this.attendanceHistory = response.data.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch history'
      } finally {
        this.loading = false
      }
    },

    async fetchStats(params) {
      this.loading = true
      this.error = null
      try {
        const response = await attendanceAPI.getStats(params)
        if (response.data.success) {
          this.stats = response.data.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch stats'
      } finally {
        this.loading = false
      }
    }
  }
})
