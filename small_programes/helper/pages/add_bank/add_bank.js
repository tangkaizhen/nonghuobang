// pages/add_bank/add_bank.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    bank_array: ['工商银行', '农业银行', '中国银行', '建设银行', '招商银行', '交通银行', '邮储银行', '浦发银行', '兴业银行', '光大银行', '民生银行', '中信银行', '广发银行', '平安银行', '华夏银行'],
    bank_index:-1,
    bank:{
      cardNo:'',
      bank:'',
      subBank:'',
      owner:'',
      idCardNo:'',
      phone:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  back_page() {
    wx.navigateBack({
      delta: 1
    })
  },
  bind_cardNo(e){
    var _this=this
    _this.setData({
      bank:{
        ..._this.data.bank,
        cardNo: e.detail.value
      } 
    })
  },
  bind_subBank(e){
    this.setData({
      bank:{
        ...this.data.bank,
        subBank: e.detail.value
      } 
    })
  },
  bind_owner(e){
    this.setData({
      bank:{
        ...this.data.bank,
        owner: e.detail.value
      } 
    })
  },
  bind_idCardNo(e){
    this.setData({
      bank:{
        ...this.data.bank,
        idCardNo: e.detail.value
      } 
    })
  },
  bind_phone(e){
    this.setData({
      bank:{
        ...this.data.bank,
        phone: e.detail.value
      } 
    })
  },
  bindPickerChange(e){
    this.setData({
      bank_index: e.detail.value,
      bank: {
        ...this.data.bank,
        bank: this.data.bank_array[e.detail.value] 
      } 
    })
  },
  add_bank_btn(){
    if (!this.data.bank.cardNo){
      util.showInfo("请输入银行卡卡号")
      return
    }
    if (!this.data.bank.bank){
      util.showInfo("请选择银行卡类型")
      return
    }
    if (!this.data.bank.subBank){
      util.showInfo("请输入开户行")
      return
    }
    if (!this.data.bank.owner){
      util.showInfo("请输入持卡人")
      return
    }
    if (!this.data.bank.idCardNo){
      util.showInfo("请输入身份证")
      return
    }
    if (!util.testId(this.data.bank.idCardNo)){
      util.showInfo("请输入正确的身份证")
      return
    }
    if (!this.data.bank.phone) {
      util.showInfo("请输入手机号")
      return
    }
    if (!util.testPhone(this.data.bank.phone)){
      util.showInfo("请输入正确的手机号")
      return
    }

    var _this = this
    wx.request({
      url: app.globalData.api_ctx + '/helper/addBank.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
        owner: _this.data.bank.owner,
        bank: _this.data.bank.bank,
        type: 1,
        cardNo: _this.data.bank.cardNo,
        phone: _this.data.bank.phone,
        idCardNo: _this.data.bank.idCardNo,
        subBank: _this.data.bank.subBank
      },
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.status == 1) {
          util.showInfo("新增成功")
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; 
          console.log(prevPage) 
          prevPage.onLoad_banks();
          _this.back_page()
        } else {
          util.showInfo(res.data.msg)
        }
      }
    })
  }
})