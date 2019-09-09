// pages/bill/bill.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    pageNum:1,
    // 这个主要是判断没有trade时候，就不要出现加载中的弹框了
    hasTrade: false,
    trades:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onLoad_bill()
  },
  onLoad_bill(){
    var _this = this
    wx.request({
      url: app.globalData.api_ctx + '/helper/tradeRecord.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
        pageNum: _this.data.pageNum
      },
      header: wx.getStorageSync('header'),
      success(res) {
          console.log(res)
        util.hideloading()
        if (res.data.status == 1) {
          var new_trades = res.data.data.trades
          if (new_trades.length>0){
            new_trades=new_trades.map(v=>{
              
              var type = v.type
              var type_val = ''

              if (type == 1) {
                type_val = '充值';
              } else if (type == 2) {
                type_val = '提现';
              } else if (type == 3) {
                type_val = '订金支付';
              } else if (type == 4) {
                type_val = '线上支付';
              } else if (type == 5) {
                type_val = '线下支付';
              } else if (type == 6) {
                type_val = '线上收款';
              } else if (type == 7) {
                type_val = '退款';
              } else if (type == 8) {
                type_val = '佣金';
              } else if (type == 10) {
                type_val = '线下收款';
              }
              v={
                ...v,
                type_val
              }

              return v
            })
            _this.setData({
              trades: [..._this.data.trades, ...new_trades]
            })

            if (new_trades.length < 10) {
              _this.setData({
                hasTrade: false
              })
            }else{
              _this.setData({
                hasTrade: true
              })
            }
          }else{

              _this.setData({
                hasTrade: false
              })
          }
        }
      }
    })
  },
  back_page() {
    wx.navigateBack({
      delta: 1
    })
  },
  
  to_bill_details(e){
    var bill_id = e.currentTarget.dataset.id
    wx.setStorageSync("bill_id", bill_id)
    wx.navigateTo({
      url: '/pages/bill_details/bill_details',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasTrade) {
      util.showloading("加载中")
      var _this = this
      _this.setData({
        pageNum: this.data.pageNum + 1
      })

      _this.onLoad_bill();
    }
  }
})