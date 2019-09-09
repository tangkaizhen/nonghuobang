// pages/people_center/people_center.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    helper:{},
    res_ctx: app.globalData.res_ctx
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		

    var _this = this
    wx.request({
      url: app.globalData.api_ctx + '/helper/mine.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
      },
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.status == 1) {
          var helper = res.data.data.helper
          _this.setData({
            helper
          })
        }
      }
    })
  },
  icon_back(){
    wx.navigateBack({
      delta:1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  to_person_info(){
    wx.navigateTo({
      url: '/pages/person_info/person_info',
    })
  },
  to_wallet(){
    wx.navigateTo({
      url: '/pages/wallet/wallet',
    })
  },
  to_evaluate(){
    wx.navigateTo({
      url: '/pages/person_center_evaluate_list/person_center_evaluate_list',
    })
  },
})