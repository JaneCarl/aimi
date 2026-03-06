import { wechatLogin } from '../../utils/api'

Page({
  data: {
    role: '',
    openid: ''
  },

  onLoad() {
    this.setData({
      role: wx.getStorageSync('role') || '',
      openid: 'oK' + Math.random().toString(36).substring(7)
    })
  },

  onRoleChange(e) {
    this.setData({
      role: e.detail.value
    })
  },

  async handleLogin() {
    const { role, openid } = this.data

    if (!role) {
      wx.showToast({
        title: '请选择角色',
        icon: 'none'
      })
      return
    }

    if (!openid) {
      wx.showToast({
        title: '请输入OpenID',
        icon: 'none'
      })
      return
    }

    try {
      wx.showLoading({ title: '登录中...' })

      const data = await wechatLogin({
        openid,
        role,
        nickname: role === 'coach' ? '教练' : '家长'
      })

      wx.setStorageSync('token', data.token)
      wx.setStorageSync('userInfo', data.userInfo)
      wx.setStorageSync('role', role)

      getApp().globalData.token = data.token
      getApp().globalData.userInfo = data.userInfo
      getApp().globalData.role = role

      wx.hideLoading()

      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })

      setTimeout(() => {
        const url = role === 'coach' ? '/pages/coach/home/home' : '/pages/parent/home/home'
        wx.switchTab({ url })
      }, 1000)
    } catch (error) {
      wx.hideLoading()
      console.error('登录失败:', error)
    }
  }
})
