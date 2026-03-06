import { getCoachStudents } from '../../../utils/api'

Page({
  data: {
    students: []
  },

  onLoad() {
    this.getTabBar().setData({ selected: '/pages/coach/students/students' })
    this.loadData()
  },

  onShow() {
    this.getTabBar().setData({ selected: '/pages/coach/students/students' })
  },

  async loadData() {
    try {
      const data = await getCoachStudents()
      this.setData({ students: data || [] })
    } catch (error) {
      console.error('加载学生列表失败:', error)
    }
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/coach/student-detail/student-detail?studentId=${id}`
    })
  }
})
