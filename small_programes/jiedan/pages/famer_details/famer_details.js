// pages/famer_details/famer_details.js
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
    farmer_banner:'/images/pic_sculpture_default_l.png',
    farmer:{},
    remarks:[],
    markers:[],
    ifHidden_outter_box: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载农户信息
    var _this=this
    wx.request({
      url: app.globalData.api_ctx + '/helper/getFarmerDetails.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
        farmerId: wx.getStorageSync('farmerId'),
        longitude: 120, 
        latitude: 32
      },
      header: wx.getStorageSync('header'),
      success(res) {
          console.log(res)
        if (res.data.status == 1) {
          var farmer=res.data.data.farmer

          farmer.distance = farmer.distance == undefined || farmer.distance == 'undefined' ?0: farmer.distance.toFixed(2)
          
          
          _this.setData({
            farmer:farmer,
            ifHidden_outter_box: false,
            remarks: res.data.data.remarks,
            markers: [{
              iconPath: '/images/icon_location.png',
              id: 0,
              latitude: res.data.data.farmer.latitude,
              longitude: res.data.data.farmer.longitude,
              width: 15,
              height: 20
            }]
          })
        }
      }
    })
  },
  makePhoneCall() {
    var _this = this
    
    wx.makePhoneCall({
      phoneNumber: _this.data.farmer.phone //仅为示例，并非真实的电话号码
    })

  },
  to_search_all(){
    wx.navigateTo({
      url: '/pages/evaluate_list/evaluate_list'
    })
  },
  back_page(){
    wx.navigateBack({
      delta: 1
    })
  }
})