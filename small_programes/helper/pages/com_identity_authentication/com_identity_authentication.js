const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    res_ctx: app.globalData.res_ctx,
    z_img: '/images/pic_yyzh.png',
    z_res: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  select_yyzh(){

    var _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        util.uploadImage(1, res.tempFilePaths[0]).then(data => {
            _this.setData({
              z_img: _this.data.res_ctx + '/' + data,
              z_res: data
            })
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  identity_btn(){
    var that = this
    if (this.data.z_img == '/images/pic_yyzh.png') {
      util.showInfo("请选择营业执照")
      return
    }
    wx.request({
      url: app.globalData.api_ctx + '/helper/saveAccount.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
        businessLicensePic: that.data.z_res,
      },
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.status == 1) {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.onload_account()
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})