// pages/change_phone_first/change_phone_first.js
const app = getApp()
const util = require('../../js/util.js')
const md5 = require('../../js/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishiddenBg: true,
    helper_tel: '',
    verification: '获取验证码',
    openid: '',
    v: '',
    can_get_verification: true,
    verification_code: '',
    password:'',
    checkCode:'',
    unionid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      password: options.password,
      checkCode: options.checkCode
    })
  },
  back_page() {
    wx.navigateBack({
      delta: 1
    })
  },
  to_next(){
    if (!this.data.helper_tel) {
      util.showInfo("请输入手机号码")
      return
    }
    if (!util.testPhone(this.data.helper_tel)) {
      util.showInfo("手机号码格式错误")
      return
    }
    if (!this.data.verification_code) {
      util.showInfo("请输入验证码")
      return
    }

    var _this = this
    wx.request({
      url: app.globalData.api_ctx + '/helper/changePhone.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
        newPhone: _this.data.helper_tel,
        checkCode: _this.data.checkCode,
        password: md5.hex_md5(_this.data.password),
        newCheckCode: _this.data.verification_code
      },
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.status == 1) {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 3];
          prevPage.setData({
            phone_front: _this.data.helper_tel.substring(0,3),
            phone_end: _this.data.helper_tel.substring(_this.data.helper_tel.length - 4, _this.data.helper_tel.length),
            helper:{
              ...prevPage.data.helper,
              phone: _this.data.helper_tel
            }
          })
          wx.navigateBack({
            delta:2
          })
        } else {
          util.showInfo(res.data.msg)
        }
      }
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
  bind_helper_tel(e) {
    this.setData({
      helper_tel: e.detail.value
    })
  },
  
  bind_helper_code(e) {
    this.setData({
      verification_code: e.detail.value
    })
  }
})