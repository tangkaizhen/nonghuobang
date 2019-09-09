const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    trade:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bill_id=wx.getStorageSync('bill_id')
    var _this = this
    wx.request({
      url: app.globalData.api_ctx + '/helper/getTradeDetails.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
        tradeId: wx.getStorageSync('bill_id')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.status == 1) {
          console.log(res)
          var trade = res.data.data.trade
          var type = trade.type;
          var type_val = '';
          var bill_income_name = '';
          var bill_income_num = '';

          if (type == 2) {
            bill_income_name = '提现';
            if (trade.state == 1) {
              type_val = '提现中';
            } else if (trade.state == 2) {
              type_val = '提现成功';
            } else if (trade.state == 6) {
              type_val = '提现已受理';
            }
            bill_income_num = "￥" + trade.money
          } else if (type == 6) {
            bill_income_name = '收入小计';
            type_val = '已结算';
            bill_income_num = "线上收款 ￥" + trade.money
          } else if (type == 10) {
            bill_income_name = '收入小计';
            type_val = '已结算';
            bill_income_num = "线下收款 ￥" + trade.money
          }


          trade={
            ...trade,
            bill_income_num,
            bill_income_name,
            type_val
          }
          _this.setData({
            trade
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  back_page() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})