import { getParentSchedule } from '../../../utils/api'

Page({
  data: {
    studentId: null,
    currentDate: '',
    currentMonth: '',
    calendarDays: [],
    scheduleList: []
  },

  onLoad(options) {
    const studentId = options.studentId || 1
    this.setData({
      studentId,
      currentDate: this.getCurrentDate(),
      currentMonth: this.getCurrentMonth()
    })
    this.loadData()
  },

  onShow() {
    this.getTabBar().setData({ selected: '/pages/parent/schedule/schedule' })
  },

  getCurrentDate() {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  },

  getCurrentMonth() {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  },

  generateCalendar() {
    const [year, month] = this.data.currentMonth.split('-').map(Number)
    const days = []
    const daysInMonth = new Date(year, month, 0).getDate()

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      const schedule = this.data.scheduleList.find(item => item.class_date === dateStr)
      let status = ''

      if (schedule) {
        if (schedule.status === 'completed') {
          status = 'completed'
        } else if (schedule.attendance_status) {
          status = schedule.attendance_status
        } else {
          status = 'upcoming'
        }
      }

      days.push({
        date: dateStr,
        day: i,
        status,
        schedule
      })
    }

    this.setData({ calendarDays: days })
  },

  async loadData() {
    try {
      const data = await getParentSchedule(this.data.studentId, this.data.currentMonth)
      this.setData({ scheduleList: data || [] })
      this.generateCalendar()
    } catch (error) {
      console.error('加载课表失败:', error)
    }
  },

  prevMonth() {
    const [year, month] = this.data.currentMonth.split('-').map(Number)
    let newYear = year
    let newMonth = month - 1

    if (newMonth === 0) {
      newYear = year - 1
      newMonth = 12
    }

    this.setData({
      currentMonth: `${newYear}-${String(newMonth).padStart(2, '0')}`
    })
    this.loadData()
  },

  nextMonth() {
    const [year, month] = this.data.currentMonth.split('-').map(Number)
    let newYear = year
    let newMonth = month + 1

    if (newMonth === 13) {
      newYear = year + 1
      newMonth = 1
    }

    this.setData({
      currentMonth: `${newYear}-${String(newMonth).padStart(2, '0')}`
    })
    this.loadData()
  },

  applyLeave(e) {
    const schedule = e.currentTarget.dataset.schedule
    if (!schedule) return

    wx.navigateTo({
      url: `/pages/parent/leave/leave?recordId=${schedule.id}&classDate=${schedule.class_date}&className=${schedule.class_name}`
    })
  },

  getStatusText(status) {
    const map = {
      'completed': '已完成',
      'normal': '正常',
      'late': '迟到',
      'leave': '请假',
      'absent': '缺席',
      'upcoming': '未上'
    }
    return map[status] || status
  },

  getStatusClass(status) {
    const map = {
      'completed': 'tag-info',
      'normal': 'tag-primary',
      'late': 'tag-warning',
      'leave': 'tag-info',
      'absent': 'tag-danger',
      'upcoming': 'tag-warning'
    }
    return map[status] || ''
  }
})
