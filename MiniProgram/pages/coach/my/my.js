import { getCoachStats } from '../../../utils/api'

Page({
  data: {
    coach: {
      nickname: '教练',
      avatar: ''
    },
    stats: {
      classCount: 0,
      recordCount: 0,
      studentCount: 0,
      avgScore: 0
    }
  },

  onLoad() {
    this.getTabBar().setData({ selected: '/pages/coach/my/my' })
    this.loadData()
  },

  onShow() {
    this.getTabBar().setData({ selected: '/pages/coach/my/my' })
  },

  async loadData() {
    try {
      const data = await getCoachStats()
      this.setData({ stats: data || this.data.stats })
    } catch (error) {
      console.error('加载统计数据失败:', error)
    }
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

          getApp().globalData.token = ''
          getApp().globalData.userInfo = null
          getApp().globalData.role = ''

          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      }
    })
  }
})
