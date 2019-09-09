//app.js
// App()函数用来注册一个小程序
const util = require('./utils/util.js')
App({
  onLaunch: function (options) {
    
  },
  onShow(options) {
		console.log(options)
		if (options.referrerInfo.extraData) {
			var { mini_data } = options.referrerInfo.extraData;
			wx.setStorageSync('appToken', mini_data.appToken);
			wx.setStorageSync('header', mini_data.header);
			wx.setStorageSync('unionid', mini_data.unionid);
			wx.setStorageSync('openid', mini_data.openid);
			wx.setStorageSync('helper_id', mini_data.helper_id);
			wx.setStorageSync('sessionKey', mini_data.sessionKey);
			wx.setStorageSync('helper_type', mini_data.helper_type);
		}
  },
  onlogin() {
    // 登录
    var _this = this;

    // 说先获取code
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
						url: 'https://test.nonghuobang365.com/miniapp/helper/wxaaca12df01e9dce0/index?code=' + res.code,
            success: function (res) {
              console.log(res)
              if (res.statusCode === 200) {
                // 这时候需要分几种情况
                //返回结果分两种情况：
                //1、账户已绑定：返回小程序信息（openid，unitionId, sessionKey），帮手Id，帮手类型，appToken，并保存Cookies信息
                //2、账户未绑定：返回小程序信息（openid， sessionKey）

                //保存Cookie到Storage
                if (res && res.header && res.header['Set-Cookie']) {
                  wx.setStorageSync('cookieKey', res.header['Set-Cookie']);
                }

                if (res.data.data.id) {
                  // 有帮手ID，直接进首页
                  util.tohome(res.data.data.appToken, res.data.data.id)

                } else {

                  console.log("进登录页")
                  wx.setStorageSync('openid', res.data.data.openid);
                  wx.setStorageSync('sessionKey', res.data.data.sessionKey);

                  // 表示是还没绑定，则进入login界面进行绑定
                  wx.getUserInfo({
                    success(res) {
                      // 将String sessionKey,String signature, String rawData, String encryptedData, String iv传到后台
                      // 后台会根据这些字段生成unionId，后台会判断有没有绑定的，
                      wx.request({
												url: 'https://test.nonghuobang365.com/miniapp/helper/wxaaca12df01e9dce0/userInfo',
                        data: {
                          sessionKey: wx.getStorageSync('sessionKey'),
                          signature: res.signature,
                          rawData: res.rawData,
                          encryptedData: res.encryptedData,
                          iv: res.iv
                        },
                        success(res) {
                          console.log(res)

                          if (res.data.data.id) {
                            if (res && res.header && res.header['Set-Cookie']) {
                              wx.setStorageSync('cookieKey', res.header['Set-Cookie']);
                            }
                            // 有帮手ID，直接进首页
                            util.tohome(res.data.data.appToken, res.data.data.id)

                          } else if (res.data.data.unionid) {
                            
                            if (res && res.header && res.header['Set-Cookie']) {
                              wx.setStorageSync('cookieKey', res.header['Set-Cookie']);
                            }

                            wx.setStorageSync('unionid', res.data.data.unionid);
                            wx.setStorageSync('v', res.data.data.token);
                            wx.navigateTo({
                              url: '/pages/login/login'
                            })
                          } else {
                            wx.showToast({
                              title: '启动失败',
                              icon: 'none'
                            })
                          }
                        }
                      })

                    },
                    fail(res) {
                      console.log(res)
                    }
                  })
                }


              }
            },
            fail(res) {
              console.log("登录失败")
            },
            complete(res) {
            }
          })
        }
      },
      fail(res) {
        console.log("login_fail")
      },
      complete(res) {
      }
    })
  },
  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
		api_ctx: 'https://test.nonghuobang365.com/api',
    reg_phone: /^1[2,3,4,5,6,7,8,9]\d{9}$/,
		form_mini_data: '',
		res_ctx: 'https://test.nonghuobang365.com/api'
  }
})