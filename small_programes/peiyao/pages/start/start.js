// pages/start/start.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorization: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    if (wx.getStorageSync('helper_id')) {
      wx.navigateTo({ url: '/pages/index/index' });
      return;
    }
    
      // 查看是否授权
      wx.getSetting({
        success: function (res) {
          console.log(res)
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，直接调用login
            if (wx.getLaunchOptionsSync().scene != 1037) {

            app.onlogin()
						
            }
          } else {
            // 用户还没授权
            _this.setData({
              authorization: true
            })
          }
        }
      })
  },
  onGotUserInfo: function (e) {
    let _this = this
    console.log(e)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      app.onlogin()
    } else {
      //用户按了拒绝按钮
      _this.setData({
        authorization: false
      })
    }
  }

})