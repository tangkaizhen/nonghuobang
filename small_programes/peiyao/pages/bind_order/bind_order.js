// pages/bind_order/bind_order.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:app.globalData.statusBarHeight,
    orders:[],
    res_ctx: app.globalData.res_ctx,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载订单
    this.onLoad_orders(1)
  },
  onLoad_orders(pageNum){
    var _this=this
    wx.request({
      url: app.globalData.api_ctx + '/helper/getFormulationOrders.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'),
        appToken: wx.getStorageSync('appToken'),
        pageNum
      },
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.status == 1) {
          var orders = res.data.data.orders
          orders = orders.map(order=>{
            order.ifSelect=false
            return order
          })
          _this.setData({
            orders: [..._this.data.orders, ...orders]
          })
        } else {
          util.showInfo(res.data.msg)
        }
      }
    })
  },
  back_page(){
    wx.navigateBack({
      delta:1
    })
  },
  bind_medicine_complete(){
    // 检验数据有效性
    var ifSelect=false
    var selected_order_num=[]
    var selected_order_id=[]

    this.data.orders.map(order=>{
      if (order.ifSelect==true){
        ifSelect = true
        selected_order_num.push(order.orderNo)
        selected_order_id.push(order.id)
      }
    })

    if (!ifSelect){
      util.showInfo("请选择订单")
      return;
    }

    wx.setStorageSync("selected_order_num", selected_order_num)
    wx.setStorageSync("selected_order_id", selected_order_id)
    wx.navigateBack({
      delta:1
    })
  },
  select_order(e){
    var index = e.currentTarget.dataset.index
    var orders = this.data.orders
    orders[index].ifSelect = !orders[index].ifSelect
    this.setData({
      orders
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