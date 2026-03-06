import { getCoachTodayClasses } from '../../../utils/api'

Page({
  data: {
    classRecords: []
  },

  onLoad() {
    this.getTabBar().setData({ selected: '/pages/coach/class/class' })
    this.loadData()
  },

  onShow() {
    this.getTabBar().setData({ selected: '/pages/coach/class/class' })
  },

  async loadData() {
    try {
      const data = await getCoachTodayClasses()
      this.setData({ classRecords: data || [] })
    } catch (error) {
      console.error('加载课程失败:', error)
    }
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/coach/detail/detail?recordId=${id}`
    })
  },

  getStatusText(status) {
    const map = {
      'pending': '未开始',
      'ongoing': '正在上',
      'completed': '已完成'
    }
    return map[status] || status
  },

  getStatusClass(status) {
    const map = {
      'pending': 'tag-warning',
      'ongoing': 'tag-primary',
      'completed': 'tag-info'
    }
    return map[status] || ''
  }
})
