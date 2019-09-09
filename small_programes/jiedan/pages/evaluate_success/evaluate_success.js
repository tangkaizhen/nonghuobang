// pages/order_details/order_details.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    order:{}
  },
  onLoad(){
    var _this=this
    // 加载订单详情
    wx.request({
      url: app.globalData.api_ctx + '/helper/getOrderDetails.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'),
        orderId: wx.getStorageSync('id'),
        appToken: wx.getStorageSync('appToken')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.data) {
          // 在地图上加上marker
          _this.setData({
            order: res.data.data.order,
          })
        }
      }
    })
  },
  back_page(){
    wx.navigateBack({
      delta: 2
    })
  },
  to_order_details(){
    wx.navigateTo({
      url: '/pages/order_details/order_details',
    })
  }
}) 