// pages/register/register.js
const app = getApp()
const util = require('../../js/util.js')
const md5 = require('../../js/md5.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		statusBarHeight: app.globalData.statusBarHeight,
		res_ctx: app.globalData.res_ctx,
		// 帮手类型，1是个人，2是企业
		type:1,
		phone:'',
		checkCode:'',
		pic1:'',
		pic2:'',
		pic3:'',
		number:''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var obj=JSON.parse(options.phone_checkcode)
		if (obj){
			this.setData({
				phone: obj.phone,
				checkCode: obj.verification_code
			})
		}
	},
	setNumber(e){
		var number = e.detail.value
		this.setData({
			number
		})
	},
	back_page(){
		wx.navigateBack({
			delate:1
		})
	},
	select_type(e){
		var register_type = e.currentTarget.dataset.register
		this.setData({
			type: register_type
		})
	},
	select_img(e) {
		var _this = this
		var upload = e.currentTarget.dataset.upload

		// 上传图片类型 接口的type 
		var certificate_img_type=2
		if(this.data.type==1){
			certificate_img_type=2
		} else if (this.data.type == 2){
			certificate_img_type = 3
		}

		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
			sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
			success: res => {
				util.uploadImage(certificate_img_type, res.tempFilePaths[0]).then(data => {
					if (upload == 1){
						_this.setData({
							pic1: data
						})
					} else if (upload == 2){
						_this.setData({
							pic2: data
						})
					} else if (upload == 3){
						_this.setData({
							pic3: data
						})
					}

				})
			}
		})
	},
	register_btn(){
		var _this=this
		// 首先验证数据的完整性
		if(this.data.type==1){
			// 表示个人
			if (!this.data.number){
				util.showInfo("请输入身份证号")
				return;
			}
			if (!util.testId(this.data.number)){
				util.showInfo("身份证号不正确")
				return;
			}
			if (!this.data.pic1){
				util.showInfo("请上传身份证正面")
				return;
			}
			if (!this.data.pic2){
				util.showInfo("请上传身份证反面")
				return;
			}
		} else if (this.data.type == 2){
			if (!this.data.number) {
				util.showInfo("请输入社会统一信用代码")
				return;
			}
			// 表示企业
			if (!this.data.pic3) {
				util.showInfo("请上传营业执照")
				return;
			}
		}

		var data={}
		if (_this.data.type==1){
			data ={
				appToken: 'MTM5MTk5OTc5NTYwODA3Nw==',
				phone: _this.data.phone,
				openid: wx.getStorageSync('openid'),
				unionid: wx.getStorageSync('unionid'),
				checkCode: _this.data.checkCode,
				type: _this.data.type,
				pic1: _this.data.pic1,
				pic2: _this.data.pic2,
				number: _this.data.number
			}
		}else{
			data = {
				appToken: 'MTM5MTk5OTc5NTYwODA3Nw==',
				phone: _this.data.phone,
				openid: wx.getStorageSync('openid'),
				unionid: wx.getStorageSync('unionid'),
				checkCode: _this.data.checkCode,
				type: _this.data.type,
				pic1: _this.data.pic3,
				number: _this.data.number
			}
		}
		// 开始注册
		wx.request({
			url: app.globalData.api_ctx + '/helper/registerMiniApp.json', // 仅为示例，并非真实的接口地址
			data,
			success(res) {
				console.log(res)
				if (res.data.status == 1) {
					if (res && res.header && res.header['Set-Cookie']) {
						wx.setStorageSync('cookieKey', res.header['Set-Cookie']); //保存Cookie到Storage
					}
					// 有帮手ID，直接进首页
					util.tohome(res.data.data.appToken, res.data.data.id, res.data.data.type)
				} else {
					util.showInfo(res.data.msg)
				}
			}
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