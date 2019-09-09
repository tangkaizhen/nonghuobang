// pages/order_details/order_details.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    res_ctx: app.globalData.res_ctx,
    map_lng_lat: {
      longitude: 120.30,
      latitude: 31.57
    },
    order_btn_one: false,
    order_btn_two: true,
    order: {},
    markers: [],
    recevie_btn_txt: '申请接单',
    ifHidden_outter_box:true,
    ifHidden_shade_black: true,
    ifHidden_order_tel_cancel: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // 开始加载数据
    util.showloading("加载中")

    wx.request({
      url: app.globalData.api_ctx + '/helper/getOrderDetails.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'),
        orderId: wx.getStorageSync('id'),
        appToken: wx.getStorageSync('appToken')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        util.hideloading()
        if (res.data.data) {
          // 在地图上加上marker
          _this.setData({
            order: res.data.data.order,
            ifHidden_outter_box:false,
            markers: [{
              iconPath: '/images/icon_location.png',
              id: 0,
              latitude: res.data.data.order.latitude,
              longitude: res.data.data.order.longitude,
              width: 15,
              height: 20
            }]
          })
        }
      }
    })
  },
  
  icon_dian() {
    var _this = this;
    _this.setData({
      ifHidden_order_tel_cancel: !_this.data.ifHidden_order_tel_cancel,
    })
  },
  makePhoneCall() {
    var _this = this
    _this.setData({
      ifHidden_order_tel_cancel: true,
    })
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('initData').customerService //仅为示例，并非真实的电话号码
    })

  },
  
  back_page() {
    wx.navigateBack({
      delta: 1
    })
  },
 
  farmer_details() {
    wx.navigateTo({
      url: '/pages/famer_details/famer_details'
    })

    wx.setStorageSync('farmerId', this.data.order.farmer.id);
  },
  
  applyOrder(e) {
    if (this.data.recevie_btn_txt == '申请接单') {

      var _this = this

      wx.showModal({
        title: '申请订单',
        content: '您确定要申请接单吗?',
        confirmColor: '#6cd986',
        success(res) {
          if (res.confirm) {

            wx.request({
              url: app.globalData.api_ctx + '/helper/grabOrder.json', // 仅为示例，并非真实的接口地址
              data: {
                appToken: wx.getStorageSync('appToken'),
                id: wx.getStorageSync('helper_id'),
                orderId: wx.getStorageSync('id')
              },
              header: wx.getStorageSync('header'),
              success(res) {
                console.log(res)
                if (res.data.status == 1) {
                  _this.setData({
                    recevie_btn_txt: '已申请'
                  })

                  // 这时候也需要将外面对应的订单状态改变

                  var pages = getCurrentPages();
                  var prevPage = pages[pages.length - 2];  //首页
                  // 直接在prevPage的orders里面将该order去除(wx.getStorageSync('id'))

                  var prevPage_orders = prevPage.data.orders
                  prevPage_orders.forEach((o)=> {
                      if (o.id == wx.getStorageSync('id')){
                        o.applyFlag=1
                      }
                  })
                  prevPage.setData({
                    orders: prevPage_orders
                  })

                } else if (res.data.status == 0) {
                  util.showInfo(res.data.msg)
                }
              }
            })

          } else if (res.cancel) {
          }
        }
      })

    }
  }
})