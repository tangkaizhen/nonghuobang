// pages/userNotice/userNotice.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    userNotice_txt:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let _this = this;
    //访问服务器，获取数据
    wx.request({
      url: app.globalData.api_ctx+'/helper/userNotice.json', // 仅为示例，并非真实的接口地址
      success(res) {
        console.log(res)
        if (res.statusCode==200){
          let new_content = _this.htmlEscape(res.data.data.userNotice.content);
          //说明调用接口成功
          _this.setData({
            userNotice_txt: new_content
          })
        }
      }
    })
  },
  htmlEscape: function (html) {
    var reg = /(&lt;)|(&gt;)|(&amp;)|(&quot;)|(&ldquo;)|(&rdquo;)/g;
    return html.replace(reg, function (match) {
      switch (match) {
        case "&lt;":
          return "<";
        case "&ldquo;":
          return "";
        case "&gt;":
          return ">"
        case "&rdquo;":
          return ""
        case "&amp;":
          return "&";
        case "&quot;":
          return "\""
      }
    });
  },
  back_page() {
    wx.navigateBack({
      delta: 1
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