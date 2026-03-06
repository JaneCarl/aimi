import { getParentGrowth } from '../../../utils/api'

Page({
  data: {
    growthRecords: []
  },

  onLoad() {
    this.getTabBar().setData({ selected: '/pages/parent/growth/growth' })
    this.loadData()
  },

  onShow() {
    this.getTabBar().setData({ selected: '/pages/parent/growth/growth' })
  },

  async loadData() {
    try {
      const studentId = wx.getStorageSync('currentStudentId') || 1
      const data = await getParentGrowth(studentId)
      this.setData({ growthRecords: data || [] })
    } catch (error) {
      console.error('加载成长记录失败:', error)
    }
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url
    if (!url) return

    wx.previewImage({
      current: url,
      urls: [url]
    })
  },

  formatDate(dateStr) {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
})
