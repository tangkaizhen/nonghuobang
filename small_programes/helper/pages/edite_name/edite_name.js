const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    helper_type: wx.getStorageSync('helper_type'),
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.name != undefined && options.name != 'undefined'){
      this.setData({
        name: options.name
      })
    }
  },
  name(e){
    this.setData({
      name: e.detail.value
    })
  },
  back_page() {
    wx.navigateBack({
      delta: 1
    })
  },
  name_save(){
    var _this=this
    if(!this.data.name){
      util.showInfo("请输入名称")
      return
    }

    wx.request({
      url: app.globalData.api_ctx + '/helper/saveAccount.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
        name: this.data.name
      },
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.status == 1) {
          util.showInfo("保存成功")

          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; 
          var prevnextPage = pages[pages.length - 3]; 
          prevPage.setData({
            helper: {
              ...prevPage.data.helper,
              name: _this.data.name
            }
          })
          prevnextPage.setData({
            helper: {
              ...prevnextPage.data.helper,
              name: _this.data.name
            }
          })
          _this.back_page()
        }
      }
    })
  }
})