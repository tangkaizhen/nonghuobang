// pages/my_banks/my_banks.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    ifShow_my_banks_operate_box:false,
    banks:[],
    ifHidden_page_shade:true,
    del_id:'',
    del_index:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载银行卡
    this.onLoad_banks()
  },
  onLoad_banks(){
    var _this=this
    wx.request({
      url: app.globalData.api_ctx + '/helper/myBanks.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'),
        appToken: wx.getStorageSync('appToken')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.status==1) {

          var banks = res.data.data.banks
          var new_banks=[]
          banks.forEach((v,k)=>{
            var logo_obj=util.name_to_bankLogo(v.bank)
            v={
              ...v,
              cardNo: v.cardNo.substring(v.cardNo.length-4, v.cardNo.length),
              ...logo_obj
            }
            new_banks.push(v)
          })
          _this.setData({
            banks: new_banks
          })
        }else{
          util.showInfo(res.data.msg)
        }
      }
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

  },
  my_banks_cancel(){
    this.setData({
      ifShow_my_banks_operate_box:false,
      ifHidden_page_shade: true
    })
  },
  my_banks_operate(e){
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    this.setData({
      ifShow_my_banks_operate_box:true,
      ifHidden_page_shade:false,
      del_id:id,
      del_index: index
    })
  },
  back_page() {
    wx.navigateBack({
      delta: 1
    })
  },
  my_banks_del(){
    var _this = this

    wx.showModal({
      title: '删除银行卡',
      content: '您确定要删除这张银行卡吗',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.api_ctx + '/helper/deleteBank.json', // 仅为示例，并非真实的接口地址
            data: {
              id: wx.getStorageSync('helper_id'),
              bankId: _this.data.del_id,
              appToken: wx.getStorageSync('appToken')
            },
            header: wx.getStorageSync('header'),
            success(res) {
              console.log(res)
              if (res.data.status == 1) {
                util.showInfo("删除成功")
                var new_banks=_this.data.banks.filter((v,k)=>{
                  return v.id != _this.data.del_id
                })
                _this.setData({
                  banks: new_banks
                })
                _this.my_banks_cancel()
              } else {
                util.showInfo(res.data.msg)
              }
            }
          })
        } else if (res.cancel) {
          _this.my_banks_cancel()
        }
      }
    })
    
  },
  add_bank(){
    wx.navigateTo({
      url: '/pages/add_bank/add_bank',
    })
  }
})