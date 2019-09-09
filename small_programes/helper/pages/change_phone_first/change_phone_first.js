// pages/change_phone_first/change_phone_first.js
const app = getApp()
const util = require('../../js/util.js')
const md5 = require('../../js/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishiddenBg:true,
    helper_tel: '',
    helper_pass: '',
    verification: '获取验证码',
    openid: '',
    v: '',
    can_get_verification: true,
    verification_code: '',
    unionid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      helper_tel: options.phone
    })
  },
  back_page(){
    wx.navigateBack({
      delta
    })
  },
  get_verification() {
    var _this = this;
    if (!_this.data.can_get_verification) {
      return;
    }
    // 首先进行数据有效性进行检测
    if (!this.data.helper_tel) {
      util.showInfo('请输入电话号码')
      return;
    }

    if (!app.globalData.reg_phone.test(this.data.helper_tel)) {
      var _this = this;

      util.showInfo('手机号格式错误')
      return;
    }

    _this.setData({
      can_get_verification: false
    })

    let interval_num = 30

    // 开始和接口交互
    wx.request({
      url: app.globalData.api_ctx + '/helper/sendSMS.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: 'MTM5MTk5OTc5NTYwODA3Nw==',
        phone: _this.data.helper_tel,
        type: 3,
        v: _this.data.v
      },
      success(res) {
        console.log(res)

        if (res.data.status == 1) {

          // 表示验证码获取成功
          let interval = setInterval(function () {
            _this.setData({
              verification: interval_num + 's'
            })
            if (interval_num == 1) {
              _this.setData({
                verification: '获取验证码',
                can_get_verification: true
              })
              interval_num = 30;
              clearInterval(interval);
              return;
            }
            --interval_num;
          }, 1000)

        } else {
          _this.setData({
            verification: '获取验证码',
            can_get_verification: true
          })

          util.showInfo(res.data.msg)
        }
      }
    })

  },
  to_next(){
    if (!this.data.helper_pass){
      util.showInfo("请输入密码")
      return
    }
    if (!this.data.verification_code){
      util.showInfo("请输入验证码")
      return
    }

    var _this = this
    wx.request({
      url: app.globalData.api_ctx + '/helper/checkPhone.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
        phone: _this.data.helper_tel,
        password: md5.hex_md5(_this.data.helper_pass),
        checkCode: _this.data.verification_code
      },
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.status == 1) {
          wx.navigateTo({
            url: '/pages/change_phone_second/change_phone_second?password=' + _this.data.helper_pass + '&checkCode=' + _this.data.verification_code,
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
  bind_helper_tel(e) {
    this.setData({
      helper_tel: e.detail.value
    })
  },
  bind_helper_pass(e) {
    this.setData({
      helper_pass: e.detail.value
    })
  },
  bind_helper_code(e) {
    this.setData({
      verification_code: e.detail.value
    })
  }
})