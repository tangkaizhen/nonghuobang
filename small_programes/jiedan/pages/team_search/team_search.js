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
    let _this = this;
    if (wx.getStorageSync('team_history')) {
      let old_value = wx.getStorageSync('team_history');
      let old_value_arr = old_value.split("-");
      _this.setData({
        history: old_value_arr
      })
    }

  },
  search_btn(event) {
    let _this = this;

    util.set_history_cookie('team_history', _this.data.keyword)
    _this.to_result(_this.data.keyword);
  },
  to_result(keyword) {
    let _this = this;
    
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //首页
    
    prevPage.setData({
      pageNum: 1,
      groups: [],
      keyword
    })

    prevPage.onload_teams(keyword,1);
    wx.navigateBack({
      delta: 1
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