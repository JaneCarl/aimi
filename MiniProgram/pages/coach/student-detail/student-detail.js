import { getCoachStudentDetail } from '../../../utils/api'

Page({
  data: {
    studentId: null,
    student: {},
    recentRecords: []
  },

  onLoad(options) {
    this.setData({ studentId: Number(options.studentId) })
    this.loadData()
  },

  async loadData() {
    try {
      const data = await getCoachStudentDetail(this.data.studentId)
      this.setData({
        student: data,
        recentRecords: data.recentRecords || []
      })
    } catch (error) {
      console.error('加载学生详情失败:', error)
    }
  },

  getAge(birthDate) {
    if (!birthDate) return 0
    const birth = new Date(birthDate)
    const now = new Date()
    return now.getFullYear() - birth.getFullYear()
  }
})
