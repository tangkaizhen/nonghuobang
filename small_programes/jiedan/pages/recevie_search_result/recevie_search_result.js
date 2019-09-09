// pages/recevie_order/recevie_order.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    res_ctx: app.globalData.res_ctx,
    position_city: '',
    recevie_order_position_obj: {},
    keyword: '',
    orderType: 0,
    pageNum: 1,
    order: [],
    click_recevie_btn_id: 0,
    recevie_btn_txt: '申请接单',
    hidden_recevie_outter_box: true
  },
  // 选择一个新的条件，将之前的条件全部重置
  reset_condition() {

    this.setData({
      keyword: '',
      pageNum: 1,
      recevie_order_position_obj: {},
      order: []
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    if (options.recevie_order_position_obj && options.keyword) {
      this.setData({
        keyword: options.keyword,
        recevie_order_position_obj: JSON.parse(options.recevie_order_position_obj)
      })
    }

    _this.onload_order(_this.data.recevie_order_position_obj.province, _this.data.recevie_order_position_obj.city, '', '', _this.data.keyword, 0, _this.data.recevie_order_position_obj.longitude, _this.data.recevie_order_position_obj.latitude, _this.data.pageNum);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this
    util.showloading("加载中")
    var search_jobType = ''
    if (_this.data.operate_type != '全部') {
      search_jobType = _this.data.operate_type
    }

    _this.onload_order(_this.data.recevie_order_position_obj.province, _this.data.recevie_order_position_obj.city, '', search_jobType, _this.data.keyword, _this.data.orderType, _this.data.recevie_order_position_obj.longitude, _this.data.recevie_order_position_obj.latitude, _this.data.pageNum);

  },
  // 加载订单
  onload_order(province, city, district, jobType, keyword, orderType, longitude, latitude, pageNum) {
    var _this = this;
    wx.request({
      url: app.globalData.api_ctx + '/helper/grabOrderList.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'),
        province,
        city,
        district,
        jobType,
        keyword,
        orderType,
        type: 2,
        longitude,
        latitude,
        pageNum,
        appToken: wx.getStorageSync('appToken')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        util.hideloading()

        console.log(res)
        if (res.data.status == 1) {
          var orders = res.data.data.orders
          orders.forEach(order => {
            return order.location = order.location.substring(0, 15)
          })
          orders.forEach(order => {
            return order.distance = order.distance.toFixed(2)
          })

          if (orders.length > 0) {
            _this.setData({
              pageNum: ++_this.data.pageNum,
            })
          }
          _this.setData({
            order: [..._this.data.order, ...orders]
          })
        }
      }
    })
  },

  recevie_btn(e) {
    if (this.data.recevie_btn_txt == '申请接单') {
      var _this = this
      var id = e.currentTarget.dataset.id

      wx.showModal({
        title: '申请订单',
        content: '您确定要申请接单吗?',
        confirmColor: '#0095ff',
        success(res) {
          if (res.confirm) {
            _this.setData({
              click_recevie_btn_id: id
            })

            wx.request({
              url: app.globalData.api_ctx + '/helper/grabOrder.json', // 仅为示例，并非真实的接口地址
              data: {
                appToken: wx.getStorageSync('appToken'),
                id: wx.getStorageSync('helper_id'),
                orderId: id
              },
              header: wx.getStorageSync('header'),
              success(res) {
                console.log(res)
                if (res.data.status == 1) {
                  _this.setData({
                    click_recevie_btn_id: id,
                    recevie_btn_txt: '已申请'
                  })
                }
              }
            })

          } else if (res.cancel) {
          }
        }
      })
    }
  },
  back_page() {
    wx.navigateBack({
      delta: 2
    })
  },
  to_search_box() {
    wx.navigateBack({
      delta: 1
    })
  },
  to_order_details(e) {
    var id = e.currentTarget.dataset.id
    wx.setStorageSync('id', id); //保存Cookie到Storage
    wx.navigateTo({
      url: '/pages/order_details/order_details'
    })
  }
})