// pages/wallet/wallet.js
const app = getApp()
const util = require('../../js/util.js')
const md5 = require('../../js/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    withdraw_num:'',
    ifShow_withdraw_box:false,
    ifShow_page_shade:false,
    ifShow_pass_box:false,
    isSetPwd:false,
    hasCards:false,
    wallet:{},
    banks:[],
    select_bank_id:'',
    passWord: '',
    passWordArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    wx.request({
      url: app.globalData.api_ctx + '/helper/myWallet.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
      },
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.status == 1) {
          console.log(res)
          _this.setData({
            hasCards: res.data.data.hasCards,
            isSetPwd: res.data.data.isSetPwd,
            wallet: res.data.data.wallet,
          })
        }
      }
    })

    this.onLoad_banks()
  },
  onChangeInput: function (e) {
    let that = this;
    if (e.detail.value.length > 6) {
      return;
    }
    if (e.detail.value.length > that.data.passWord.length) {
      that.data.passWordArr.push(true);
    } else if (e.detail.value.length < that.data.passWord.length) {
      that.data.passWordArr.pop();
    }
    that.setData({
      passWord: e.detail.value,
      passWordArr: that.data.passWordArr
    });
  },
  onTapCommit: function () {
    let that = this;
    if (that.data.passWord.length == 0) {
      util.showInfo("请输入密码")
      return;
    }
    if (that.data.passWord.length < 6) {
      util.showInfo("密码一共6位")
      return;
    }
    var passWord=that.data.passWord
    wx.request({
      url: app.globalData.api_ctx + '/helper/withdraw.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
        bankId: that.data.select_bank_id,
        money: that.data.withdraw_num,
        walletPwd: md5.hex_md5(that.data.passWord),
      },
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.status == 1) {
          console.log(res)
          that.wallet_pass_box_cancel();
          that.close_withdraw_box();
        } else {
          util.showInfo(res.data.msg)
        }
      }
    })
  },
  select_bank(e){
    this.setData({
      select_bank_id: e.currentTarget.dataset.id
    })
  },
  onLoad_banks(){
    var _this=this
    wx.request({
      url: app.globalData.api_ctx + '/helper/myBanks.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
      },
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.status == 1) {
          var banks = res.data.data.banks
          var new_banks = []
          banks.forEach((v, k) => {
            var logo_obj = util.name_to_bankLogo(v.bank)
            v = {
              ...v,
              cardNo: v.cardNo.substring(v.cardNo.length - 4, v.cardNo.length),
              ...logo_obj
            }
            new_banks.push(v)
          })
          _this.setData({
            banks: new_banks
          })
        } else {
          util.showInfo(res.data.msg)
        }
      }
    })
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
  my_banks(){
    wx.navigateTo({
      url: '/pages/my_banks/my_banks?hasCards=' + this.data.hasCards
    })
  },
  withdraw_box(){
    this.setData({
      ifShow_withdraw_box:true,
    })
  },
  close_withdraw_box(){
    this.setData({
      ifShow_withdraw_box: false,
      withdraw_num:'',
      select_bank_id:''
    })
  },
  wallet_pass_box_cancel(){
    this.setData({
      ifShow_pass_box: false,
      ifShow_page_shade: false,
      passWord:'',
      passWordArr:[]
    })
  },
  bind_withdraw_num(e){
    this.setData({
      withdraw_num: e.detail.value
    })
  },
  withdraw_num_clear(){
    this.setData({
      withdraw_num:''
    })
  },
  to_add_bank(){
    wx.navigateTo({
      url: '/pages/add_bank/add_bank',
    })
  },
  withdraw_num_btn(){
    if(!this.data.withdraw_num){
      util.showInfo("请输入提现金额")
      return
    }
    if(1*this.data.withdraw_num<=0){
      util.showInfo("请输入正确的提现金额")
      return
    }
    if(1*this.data.withdraw_num>2000){
      util.showInfo("每次最多提现2000")
      return
    }
    if(!this.data.select_bank_id){
      util.showInfo("请选择提现银行卡")
      return
    }
    this.setData({
      ifShow_pass_box:true,
      ifShow_page_shade:true
    })
  },
  to_my_bill(){
    wx.navigateTo({
      url: '/pages/bill/bill'
    })
  },
  set_wallet_pass(){
    wx.navigateTo({
      url: '/pages/set_wallet_password/set_wallet_password?isSetPwd=' + this.data.isSetPwd,
    })
  }
})