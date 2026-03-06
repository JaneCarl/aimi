import { createLeaveRequest, getStudentLeaveRequests } from '../../../utils/api'

Page({
  data: {
    recordId: null,
    classDate: '',
    className: '',
    reason: '',
    leaveRequests: []
  },

  onLoad(options) {
    this.setData({
      recordId: Number(options.recordId),
      classDate: options.classDate || '',
      className: options.className || ''
    })
    this.loadLeaveRequests()
  },

  async loadLeaveRequests() {
    try {
      const studentId = wx.getStorageSync('currentStudentId') || 1
      const data = await getStudentLeaveRequests(studentId)
      this.setData({ leaveRequests: data || [] })
    } catch (error) {
      console.error('加载请假记录失败:', error)
    }
  },

  onReasonInput(e) {
    this.setData({
      reason: e.detail.value
    })
  },

  async submitLeave() {
    const { recordId, reason } = this.data

    if (!reason.trim()) {
      wx.showToast({
        title: '请填写请假理由',
        icon: 'none'
      })
      return
    }

    try {
      wx.showLoading({ title: '提交中...' })

      await createLeaveRequest({
        student_id: wx.getStorageSync('currentStudentId') || 1,
        record_id: recordId,
        reason
      })

      wx.hideLoading()

      wx.showToast({
        title: '提交成功',
        icon: 'success'
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (error) {
      wx.hideLoading()
      console.error('提交请假失败:', error)
    }
  },

  getStatusText(status) {
    const map = {
      'pending': '待审批',
      'approved': '已批准',
      'rejected': '已拒绝'
    }
    return map[status] || status
  },

  getStatusClass(status) {
    const map = {
      'pending': 'tag-warning',
      'approved': 'tag-primary',
      'rejected': 'tag-danger'
    }
    return map[status] || ''
  }
})
