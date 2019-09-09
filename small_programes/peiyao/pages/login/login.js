// pages/login/login.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    helper_tel: '',
    verification: '获取验证码',
    reminder_info: '',
    isShowIdentity: true,
    ishiddenBg: true,
    openid: '',
    v: '',
    can_get_verification: true,
    verification_code: '',
    unionid: ''
  },
  onLoad(options) {
    let _this = this;

    _this.setData({
      openid: wx.getStorageSync('openid'),
      v: wx.getStorageSync('v'),
      unionid: wx.getStorageSync('unionid'),
    })

  },
  login_protocol() {
    wx.navigateTo({
      url: '../userNotice/userNotice'
    })
  },
  to_next() {
    var _this = this;
    // 要进行数据有效的验证
    if (!this.data.helper_tel) {
      util.showInfo('请输入电话号码')
      return;
    }

    if (!app.globalData.reg_phone.test(this.data.helper_tel)) {
      util.showInfo('手机号格式错误')
      return;
    }

    if (!this.data.verification_code) {
      util.showInfo('请输入验证码')
      return;
    }
    wx.request({
      url: app.globalData.api_ctx + '/helper/bindMiniApp.json', //login
      data: {
        appToken: 'MTM5MTk5OTc5NTYwODA3Nw==',
        phone: _this.data.helper_tel,
        unionid: _this.data.unionid,
        checkCode: _this.data.verification_code
      },
      success: function (res) {
        console.log(res);

        //  这时候如果返回1：表示绑定成功，跳首页，2：表示是新的手机号：出现弹框
        if (res.data.status == 1) {
          if (res && res.header && res.header['Set-Cookie']) {
            wx.setStorageSync('cookieKey', res.header['Set-Cookie']); //保存Cookie到Storage
            wx.setStorageSync('header', {
              'Content-Type': 'application/x-www-form-urlencoded',
              'cookie': res.header['Set-Cookie']
            });
          }

          // 有帮手ID，直接进首页
          util.tohome(res.data.data.appToken, res.data.data.id)

        } else if (res.data.status == 2) {
          //2：表示是新的手机号：出现弹框
					// 跳转到注册界面
					wx.navigateTo({
						url: '/pages/register/register?phone_checkcode=' + JSON.stringify({
							phone: _this.data.helper_tel,
							verification_code: _this.data.verification_code
						}),
					})
					
          // _this.setData({
          //   ishiddenBg: false,
          //   isShowIdentity: false
          // })
        } else {
          util.showInfo(res.data.msg)
        }
      }

    })

  },
	back_page(){
		wx.navigateBack({
			delta:1
		})
	},
  to_home(event) {
    var _this = this;
    let identity_type = event.currentTarget.dataset.identity;

    // 开始调用123：帮手注册接口
    wx.request({
      url: app.globalData.api_ctx + '/helper/registerMiniApp.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: 'MTM5MTk5OTc5NTYwODA3Nw==',
        phone: _this.data.helper_tel,
        openid: _this.data.openid,
        unionid: _this.data.unionid,
        checkCode: _this.data.verification_code,
        type: identity_type,
      },
      success(res) {
        console.log(res)


        if (res.data.status == 1) {
          if (res && res.header && res.header['Set-Cookie']) {
            wx.setStorageSync('cookieKey', res.header['Set-Cookie']); //保存Cookie到Storage
            wx.setStorageSync('header', {
              'Content-Type': 'application/x-www-form-urlencoded',
              'cookie': res.header['Set-Cookie']
            });
          }
          // 有帮手ID，直接进首页
          util.tohome(res.data.data.appToken, res.data.data.id)

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