// pages/search/search.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    keyword: '',
    history: [],
    recevie_order_position_obj:{}
  },
  bind_keyword: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options.recevie_order_position_obj){
      this.setData({
        recevie_order_position_obj: JSON.parse(options.recevie_order_position_obj)
      })
    }
    
    let _this = this;
    if (wx.getStorageSync('recevie_order_history')) {
      let old_value = wx.getStorageSync('recevie_order_history');
      let old_value_arr = old_value.split("-");
      _this.setData({
        history: old_value_arr
      })
    }

  },
  search_btn(event) {
    let _this = this;

    util.set_history_cookie('recevie_order_history', _this.data.keyword)
    _this.to_result(_this.data.keyword);
  },
  to_result(keyword) {
    let _this = this;

    wx.navigateTo({
      url: '/pages/recevie_search_result/recevie_search_result?recevie_order_position_obj=' + JSON.stringify(this.data.recevie_order_position_obj) + '&keyword=' + keyword
    })   
  },

  history_to_result(event) {
    let keyword = event.currentTarget.dataset.keyword;
    let _this = this;

    _this.to_result(keyword)
  },
  back_page() {
    wx.navigateBack({
      delta: 1
    })
  },
})