const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    audit_status:true,
    ifHidden_page_shade:true,
    helper_type: wx.getStorageSync('helper_type'),
    helper:{},
    phone_front:'',
    phone_end:'',
    recevie_order_position_obj:{},
    res_ctx: app.globalData.res_ctx
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		
    this.onload_account()
  },
  onload_account(){
    var _this = this
    wx.request({
      url: app.globalData.api_ctx + '/helper/myAccount.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
      },
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.status == 1) {
          var helper = res.data.data.helper
          _this.setData({
            helper,
            phone_front: helper.phone.substring(0,3),
            phone_end: helper.phone.substring(helper.phone.length - 4, helper.phone.length),
            recevie_order_position_obj:{
              nation:'中国',
              province: helper.province,
              city: helper.city,
              district: helper.district,
              street: helper.street,
              address: helper.address,
              longitude: helper.longitude,
              latitude: helper.latitude
            }
          })
        }
      }
    })
  },
  to_check(){
    // 这时候需要判断是个人帮手还是企业帮手
    if (this.data.helper_type==1){
      wx.navigateTo({
        url: '/pages/identity_authentication/identity_authentication',
      })
    } else if (this.data.helper_type == 2){
      wx.navigateTo({
        url: '/pages/com_identity_authentication/com_identity_authentication',
      })
    }
  },
  to_select_position(){
    wx.navigateTo({
      url: '/pages/person_info_location/person_info_location?recevie_order_position_obj=' + JSON.stringify(this.data.recevie_order_position_obj)
    })
  },
  select_headerImg(){
    var _this=this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
          util.uploadImage(1, res.tempFilePaths[0]).then(data => {
            util.showInfo("替换成功")
            _this.setData({
              helper:{
                ..._this.data.helper,
                headImg:data
              }
            })
            wx.request({
              url: app.globalData.api_ctx + '/helper/saveAccount.json', // 仅为示例，并非真实的接口地址
              data: {
                appToken: wx.getStorageSync('appToken'),
                id: wx.getStorageSync('helper_id'),
                headImg: data
              },
              header: wx.getStorageSync('header'),
              success(res) {
                if (res.data.status == 1) {
                }
              }
            })

          })
      }
    })
  },
  to_edite_name(){
    wx.navigateTo({
      url: '/pages/edite_name/edite_name?name='+this.data.helper.name,
    })
  },
  to_edite_phone(){
    wx.navigateTo({
      url: '/pages/change_phone_first/change_phone_first?phone=' + this.data.helper.phone
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
  back_page(){
    wx.navigateBack({
      delta:1
    })
  }
})