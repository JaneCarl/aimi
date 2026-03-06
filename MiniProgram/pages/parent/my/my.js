import { getParentStudentDetail } from '../../../utils/api'

Page({
  data: {
    student: {
      name: '宝宝',
      birth_date: '2018-01-01',
      remaining_hours: 10,
      points: 100,
      photo: ''
    }
  },

  onLoad() {
    this.getTabBar().setData({ selected: '/pages/parent/my/my' })
    this.loadData()
  },

  onShow() {
    this.getTabBar().setData({ selected: '/pages/parent/my/my' })
  },

  async loadData() {
    try {
      const studentId = wx.getStorageSync('currentStudentId') || 1
      const data = await getParentStudentDetail(studentId)
      this.setData({ student: data || this.data.student })
    } catch (error) {
      console.error('加载学员详情失败:', error)
    }
  },

  switchStudent() {
    wx.showToast({
      title: '切换学生功能开发中',
      icon: 'none'
    })
  },

  navigateTo(e) {
    const page = e.currentTarget.dataset.page
    wx.showToast({
      title: `${page}功能开发中`,
      icon: 'none'
    })
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('role')
          wx.removeStorageSync('currentStudentId')

          getApp().globalData.token = ''
          getApp().globalData.userInfo = null
          getApp().globalData.role = ''

          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      }
    })
  },

  getAge(birthDate) {
    if (!birthDate) return 0
    const birth = new Date(birthDate)
    const now = new Date()
    return now.getFullYear() - birth.getFullYear()
  }
})
