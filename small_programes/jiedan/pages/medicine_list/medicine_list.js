// pages/medicine_list/medicine_list.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    formulations:[],
    selectedId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onload_peifang(1)
    
  },
  onload_peifang(pageNum){
    var _this=this
    wx.request({
      url: app.globalData.api_ctx + '/helper/myFormulations.json',
      data: {
        id: wx.getStorageSync('helper_id'),
        pageNum,
        appToken: wx.getStorageSync('appToken')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.status == 1) {
          _this.setData({
            formulations: [..._this.data.formulations, ...res.data.data.formulations]
          })
        }
      }
    })
  },
  selectmedicine(e){
    var id = e.currentTarget.dataset.id
    this.setData({
      selectedId:id
    })
  },
  back_page(){
    wx.navigateBack({
      delta:1
    })
  },
  medicine_btn(){
    var _this=this
    // 验证数据有效性
    if(!this.data.selectedId){
      util.showInfo("请选择配方")
      return;
    }

    wx.request({
      url: app.globalData.api_ctx + '/helper/bindOrderFormulation.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'),
        orderId: wx.getStorageSync('id'),
        formulationId: _this.data.selectedId,
        appToken: wx.getStorageSync('appToken')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.status == 1) {

          wx.setStorageSync("formulationid", _this.data.selectedId)
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          var prevnextPage = pages[pages.length - 3];

          if(prevPage.route.indexOf("medicine_details") > -1){
            // 表示从配方详情跳转过来
            wx.navigateBack({
              delta: 2
            })

            prevnextPage.setData({
              order:{
                ...prevnextPage.data.order,
                formulationId: _this.data.selectedId
              }
            })
          }else{
            prevPage.setData({
              order: {
                ...prevPage.data.order,
                formulationId: _this.data.selectedId
              }
            })
            wx.navigateBack({
              delta: 1
            })
          }
        }
      }
    })
  },
  to_add_medicine() {
    wx.navigateTo({
      url: '../add_medicine/add_medicine'
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