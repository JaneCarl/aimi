import { getCoachHome, getCoachTodayClasses } from '../../../utils/api'

Page({
  data: {
    banners: [],
    todayCount: 0,
    coach: {}
  },

  onLoad() {
    this.getTabBar().setData({ selected: '/pages/coach/home/home' })
    this.loadData()
  },

  onShow() {
    this.getTabBar().setData({ selected: '/pages/coach/home/home' })
  },

  async loadData() {
    try {
      const [homeData, todayData] = await Promise.all([
        getCoachHome(),
        getCoachTodayClasses()
      ])

      this.setData({
        banners: homeData.banners || [],
        todayCount: homeData.todayCount || 0,
        coach: homeData.coach || {}
      })
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  },

  navigateToClass() {
    wx.switchTab({
      url: '/pages/coach/class/class'
    })
  },

  navigateToStudents() {
    wx.switchTab({
      url: '/pages/coach/students/students'
    })
  }
})
