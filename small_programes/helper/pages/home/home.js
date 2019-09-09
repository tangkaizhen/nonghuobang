// pages/home/home.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    // 配药小程序
    BappId: 'wxa64c9cda17213d26',
    // 拼单小程序id
    PappId:'wxaaca12df01e9dce0',
    // 接单小程序id
    JappId:'wx26509205fe07860e',
    // 服务小程序
    FappId:'wx70278e0aec4988b3',
    // 农机小程序
    NappId: 'wxb551e64956a3990a',
    mini_data: {
      helper_id:'0',
      header: {},
      appToken:'',
      unionid:'',
      helper_type:''
    },
		ifShowAuth:true
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this

		// 查看是否授权，如果没有授权需要将授权按钮显示
		// 首先看看有没有授权
		wx.getSetting({
			success: function (res) {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，直接调用login
					_this.setData({
						ifShowAuth:false
					})
				} else {
					// 用户还没授权
					_this.setData({
						ifShowAuth: true
					})
				}
			}
		})

  },
	onShow(){
		wx.hideLoading()
	},
  to_people_center(){
		var _this = this
		// 首先检查是不是已经登录了
		if (this.checkLoginAuth()) {
			return
		}

    wx.navigateTo({
      url: '/pages/people_center/people_center',
    })
  },
	checkLoginAuth(){

		var _this = this
		// 首先检查是不是已经登录了
		if (!wx.getStorageSync('helper_id')) {
			// 表示没有登录

			// 首先看看有没有授权
			wx.getSetting({
				success: function (res) {
					if (res.authSetting['scope.userInfo']) {
						// 已经授权，直接调用login

						wx.showModal({
							title: '登录',
							content: '您未登录，请先登录',
							success(res) {
								if (res.confirm) {
									wx.showLoading({
										title: '加载中',
										mask: true
									})
									app.onlogin()
								} else if (res.cancel) {
								}
							}
						})
					}
				}
			})
			return true;
		}
	},
	toJMP(){
		var _this = this
		// 首先检查是不是已经登录了
		if (this.checkLoginAuth()) {
			return
		}

		var mini_data = {
			helper_id: wx.getStorageSync('helper_id'),
			header: wx.getStorageSync('header'),
			appToken: wx.getStorageSync('appToken'),
			unionid: wx.getStorageSync('unionid'),
			openid: wx.getStorageSync('openid'),
			sessionKey: wx.getStorageSync('sessionKey'),
			helper_type: wx.getStorageSync('helper_type')
		}

		// 开始跳转小程序
		wx.navigateToMiniProgram({
			appId: _this.data.JappId,
			envVersion: 'develop',
			extraData: {
				mini_data
			},
			success(res) {
				// 打开成功
				console.log(res)
			}
		})
	},
	toServiceMP(){
		var _this = this
		// 首先检查是不是已经登录了
		if (this.checkLoginAuth()) {
			return
		}

		var mini_data = {
			helper_id: wx.getStorageSync('helper_id'),
			header: wx.getStorageSync('header'),
			appToken: wx.getStorageSync('appToken'),
			unionid: wx.getStorageSync('unionid'),
			openid: wx.getStorageSync('openid'),
			sessionKey: wx.getStorageSync('sessionKey'),
			helper_type: wx.getStorageSync('helper_type')
		}

		// 开始跳转小程序
		wx.navigateToMiniProgram({
			appId: _this.data.FappId,
			envVersion: 'develop',
			extraData: {
				mini_data
			},
			success(res) {
				// 打开成功
				console.log(res)
			}
		})
	},
	toPinDanMP(){
		var _this = this
		// 首先检查是不是已经登录了
		if (this.checkLoginAuth()) {
			return
		}

		var mini_data = {
			helper_id: wx.getStorageSync('helper_id'),
			header: wx.getStorageSync('header'),
			appToken: wx.getStorageSync('appToken'),
			unionid: wx.getStorageSync('unionid'),
			openid: wx.getStorageSync('openid'),
			sessionKey: wx.getStorageSync('sessionKey'),
			helper_type: wx.getStorageSync('helper_type')
		}

		// 开始跳转小程序
		wx.navigateToMiniProgram({
			appId: _this.data.PappId,
			envVersion: 'develop',
			extraData: {
				mini_data
			},
			success(res) {
				// 打开成功
				console.log(res)
			}
		})
	},
	toArgMP(){
		var _this = this
		// 首先检查是不是已经登录了
		if (this.checkLoginAuth()) {
			return
		}

		var mini_data = {
			helper_id: wx.getStorageSync('helper_id'),
			header: wx.getStorageSync('header'),
			appToken: wx.getStorageSync('appToken'),
			unionid: wx.getStorageSync('unionid'),
			openid: wx.getStorageSync('openid'),
			sessionKey: wx.getStorageSync('sessionKey'),
			helper_type: wx.getStorageSync('helper_type')
		}

		// 开始跳转小程序
		wx.navigateToMiniProgram({
			appId: _this.data.NappId,
			envVersion: 'develop',
			path: 'pages/index/main',
			extraData: {
				mini_data
			},
			success(res) {
				// 打开成功
				console.log(res)
			}
		})
	},
	toMedicineMP(){
		var _this=this
		// 首先检查是不是已经登录了
		if(this.checkLoginAuth()){
			return
		}

		var mini_data={
			helper_id: wx.getStorageSync('helper_id'),
			header: wx.getStorageSync('header'),
			appToken: wx.getStorageSync('appToken'),
			unionid: wx.getStorageSync('unionid'),
			openid: wx.getStorageSync('openid'),
			sessionKey: wx.getStorageSync('sessionKey'),
			helper_type: wx.getStorageSync('helper_type')
		}

		// 开始跳转小程序
		wx.navigateToMiniProgram({
			appId: _this.data.BappId,
			envVersion: 'develop',
			extraData: {
				mini_data
			},
			success(res) {
				// 打开成功
				console.log(res)
			}
		})

	},
	onGotUserInfo: function (e) {
		let _this = this
		console.log("进onGotUserInfo")
		if (e.detail.userInfo) {
			//用户按了允许授权按钮
			_this.setData({
				ifShowAuth: false
			})
			if (!wx.getStorageSync('helper_id')) {
				wx.showModal({
					title: '登录',
					content: '您未登录，请先登录',
					success(res) {
						if (res.confirm) {
							wx.showLoading({
								title: '加载中',
								mask:true
							})
							app.onlogin()
						} else if (res.cancel) {
						}
					}
				})
			}
			
		} else {
			//用户按了拒绝按钮
			_this.setData({
				ifShowAuth: true
			})
		}
	}
})