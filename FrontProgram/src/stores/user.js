import { defineStore } from 'pinia'
import { adminLogin } from '@/api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null')
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    async login(loginForm) {
      try {
        const data = await adminLogin(loginForm)
        this.token = data.token
        this.userInfo = data.admin

        localStorage.setItem('token', data.token)
        localStorage.setItem('userInfo', JSON.stringify(data.admin))

        return data
      } catch (error) {
        throw error
      }
    },

    logout() {
      this.token = ''
      this.userInfo = null

      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }
})
