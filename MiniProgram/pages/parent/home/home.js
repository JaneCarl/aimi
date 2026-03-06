import { getParentHome } from '../../../utils/api'

Page({
  data: {
    banners: [],
    nextClass: null,
    promotionalCourses: [],
    studentPhoto: '',
    currentStudent: null
  },

  onLoad() {
    this.getTabBar().setData({ selected: '/pages/parent/home/home' })
    this.loadData()
  },

  onShow() {
    this.getTabBar().setData({ selected: '/pages/parent/home/home' })
  },

  async loadData() {
    try {
      const data = await getParentHome()
      this.setData({
        banners: data.banners || [],
        nextClass: data.nextClass || null,
        promotionalCourses: data.promotionalCourses || [],
        studentPhoto: data.studentPhoto || ''
      })
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  },

  switchStudent() {
    wx.showToast({
      title: '切换学生功能开发中',
      icon: 'none'
    })
  },

  navigateToCourse(e) {
    const id = e.currentTarget.dataset.id
    wx.showToast({
      title: '课程详情功能开发中',
      icon: 'none'
    })
  }
})
