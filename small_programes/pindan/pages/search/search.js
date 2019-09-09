// pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    keyword:'',
    history:[]
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
    let _this=this;
    if (wx.getStorageSync('pindan_history')) {
      let old_value = wx.getStorageSync('pindan_history');
      let old_value_arr = old_value.split("-");
      _this.setData({
        history: old_value_arr
      })
    }
  },
  search_btn(event){
    let _this=this;
    console.log(event);
    // 设置拼单的历史记录的key为pindan_history,格式为：pindan_history='值1-值2-值3-值4-值5'
    if(wx.getStorageSync('pindan_history')){
      let old_value = wx.getStorageSync('pindan_history');
      let old_value_arr=old_value.split("-");
      let search_value=old_value_arr.find (value=>{
        console.log(_this.data.keyword)
        console.log(value == _this.data.keyword)
        return value == _this.data.keyword
      })
      console.log(old_value + '====' + old_value_arr + '====' + search_value)
      if (!search_value){
        //表示cookie没有新的keyword，需要加上这个新值到cookie里
        old_value += '-' + _this.data.keyword;
        try {
          wx.setStorageSync('pindan_history', old_value)
        } catch (e) { }
      }
    }else{
      try {
        wx.setStorageSync('pindan_history', _this.data.keyword)
      } catch (e) {}
    }

    _this.to_pindan_home();
  },
  to_pindan_home(){

    let _this=this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      keyword: _this.data.keyword,
      pageNum: 1,
      combineOrders: []
    })
    if (prevPage.getCombineOrders){
      prevPage.getCombineOrders(wx.getStorageSync('helper_id'), prevPage.data.operate_type, prevPage.data.keyword, prevPage.data.pageNum)
    }else{
      prevPage.myCombineOrders(prevPage.data.operate_type, prevPage.data.keyword, prevPage.data.pageNum)
    }
    

    wx.navigateBack({
      delta: 1
    })
  },
  history_to_home(event){
    let keyword=event.currentTarget.dataset.keyword;
    let _this = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      keyword: keyword,
      pageNum: 1,
      combineOrders: []
    })
    if (prevPage.getCombineOrders){
      prevPage.getCombineOrders(wx.getStorageSync('helper_id'), prevPage.data.operate_type, prevPage.data.keyword, prevPage.data.pageNum)
    }else{
      prevPage.myCombineOrders(prevPage.data.operate_type, prevPage.data.keyword, prevPage.data.pageNum)
    }
    

    wx.navigateBack({
      delta: 1
    })

  },
  back_page(){
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