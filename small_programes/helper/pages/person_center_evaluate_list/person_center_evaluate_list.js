// pages/evaluate_list/evaluate_list.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    res_ctx: app.globalData.res_ctx,
    remarks: [],
    evaluate_type_index: {
      evaluate_type0: true,
      evaluate_type1: false,
      evaluate_type2: false,
      evaluate_type3: false
    },
    // 当rateType=1表示我的评价，当rateType=2表示农户评价
    rateType:1,
    type: 0,
    pageNum: 1,
  },
  back_page() {
    wx.navigateBack({
      delta: 1
    })
  },
  select_kind(e){
    var rateType = e.currentTarget.dataset.rate
    this.setData({
      rateType: rateType,
      pageNum: 1,
      remarks: []
    })
    this.onload_evaluate(this.data.rateType, this.data.type)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    this.onload_evaluate(1, 0)
  },
  onload_evaluate(rateType,type) {
    var _this = this
    wx.request({
      url: app.globalData.api_ctx + '/helper/myRate.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
        rateType,
        type: type,
        pageNum: _this.data.pageNum
      },
      header: wx.getStorageSync('header'),
      success(res) {
        util.hideloading()
        console.log(res)
        if (res.data.status == 1) {

          if (res.data.data.remarks.length > 0) {
            _this.setData({
              pageNum: ++_this.data.pageNum,
              remarks: [..._this.data.remarks, ...res.data.data.remarks]
            })
          }
        }
      }
    })
  },
  onReachBottom() {
    util.showloading("加载中")
    var _this = this

    this.onload_evaluate(_this.data.type, _this.data.pageNum)
  },
  evaluate_type(e) {
    var _this = this
    var index = e.currentTarget.dataset.index
    _this.setData({
      ..._this.data.evaluate_type_index,
      evaluate_type_index: {
        evaluate_type0: index == 0 ? true : false,
        evaluate_type1: index == 1 ? true : false,
        evaluate_type2: index == 2 ? true : false,
        evaluate_type3: index == 3 ? true : false,
      },
      pageNum: 1,
      remarks: []
    })

    if (index == 0) {
      _this.setData({
        type: 0
      })
    } else if (index == 1) {
      _this.setData({
        type: 3
      })

    } else if (index == 2) {
      _this.setData({
        type: 2
      })

    } else if (index == 3) {
      _this.setData({
        type: 1
      })

    }

    this.onload_evaluate(_this.data.rateType, _this.data.type)
  },
  back_page() {
    wx.navigateBack({
      delta: 1
    })
  }
})