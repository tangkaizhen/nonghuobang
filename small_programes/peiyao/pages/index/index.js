//index.js
//获取应用实例
const app = getApp()
//Page()注册一个页面
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    peifang_img:'../../images/icon_add_peifang.png',
    medicines:[],
		helper_id: wx.getStorageSync('helper_id'),
    pageNum:1,
    ishidden_shage:true,
    ishidden_dialoge:true,
    delete_id:0,
		ifShowAuth:false,
		authorization: true,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
	onLoad: function () {
		var _this=this

		// 查看是否授权，如果没有授权需要将授权按钮显示
		// 首先看看有没有授权
		wx.getSetting({
			success: function (res) {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，
					_this.setData({
						ifShowAuth: false
					})

					// 这时候还要看看有没有账号
					if (wx.getStorageSync('helper_id')){
						// 有账号
						//  获取初始化数据
						_this.setData({
							helper_id: wx.getStorageSync('helper_id')
						})
						_this.onload_myFormulations(wx.getStorageSync('helper_id'), _this.data.pageNum);
					}else{
						// 如果没有账号，需要跳转到login
						app.onlogin()
					}
				} else {
          if (wx.getStorageSync('helper_id')){
            _this.setData({
							helper_id: wx.getStorageSync('helper_id')
						})
						_this.onload_myFormulations(wx.getStorageSync('helper_id'), _this.data.pageNum);
          }else{
            // 用户还没授权
            _this.setData({
              ifShowAuth: true
            })
          }
				}
			}
		})
	},
	onGotUserInfo: function (e) {
		let _this = this
		console.log("进onGotUserInfo")
		if (e.detail.userInfo) {
			//用户按了允许授权按钮
		

			if (!wx.getStorageSync('helper_id')) {
				wx.showLoading({
					title: '加载中',
					mask: true
				})
				app.onlogin()
				
			}else{
				_this.setData({
					ifShowAuth: false
				})
				_this.onload_myFormulations(wx.getStorageSync('helper_id'), _this.data.pageNum);
			}
		} else {
			//用户按了拒绝按钮
			_this.setData({
				ifShowAuth: true,
				authorization: false
			})
		}
	},
	onShow(){

	},
  back_home(){
    wx.navigateTo({
      url: '../home/home'
    })
  },
  to_add_medicine(){
    wx.navigateTo({
      url: '../add_medicine/add_medicine'
    })
  },
  medicine_details(event){
    console.log(event.currentTarget.dataset.formulationid)
    wx.navigateTo({
      url: '../medicine_details/medicine_details?formulationid=' + event.currentTarget.dataset.formulationid
    })
  },
  medicine_delete(event){
    var _this=this;
    console.log(event.currentTarget.dataset.id);
    // 首先出现弹框
    this.setData({
      ishidden_dialoge: false,
      ishidden_shage:false,
      delete_id: event.currentTarget.dataset.id
    })

  },
  dialoge_btn_confirm(){
    // 删除数组中指定的元素
    var _this=this;
    _this.setData({
      medicines: (this.data.medicines).filter(e => e.id != this.data.delete_id)
    })
    wx.request({
      url: app.globalData.api_ctx + '/helper/deleteFormulation.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'),
        formulationId: _this.data.delete_id,
        appToken: wx.getStorageSync('appToken')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.status==1){
            // 表示删除成功
          _this.setData({
            ishidden_dialoge: true,
            ishidden_shage: true,
            delete_id: 0
          })
        }
      }
    })
  },
  dialoge_btn_cancel(){
    this.setData({
      ishidden_dialoge: true,
      ishidden_shage: true
    })
  },
  
  onload_myFormulations(id,pageNum){
    var _this=this;
    
    wx.request({
      url: app.globalData.api_ctx + '/helper/myFormulations.json', // 仅为示例，并非真实的接口地址
      data: {
        id: id,
        pageNum: pageNum,
        appToken: wx.getStorageSync('appToken')
      },
      header: wx.getStorageSync('header'),
      success(res) {
					console.log(res)
        if (res.data.data){
          if (res.data.data.formulations) {
            let formulation_arr = res.data.data.formulations;

            if (formulation_arr.length == 0) {
              // 这时候表示数组的长度为0
            } else {
              _this.setData({
                medicines: _this.data.medicines.concat(formulation_arr)
              })
            }

          }
        }
        
      }
    })
  },
  onPullDownRefresh(){
  },
  onReachBottom(){
    // 滚动加载
    //  获取初始化数据
    this.onload_myFormulations(wx.getStorageSync('helper_id'), ++(this.data.pageNum));
  },
  back_page(){
    wx.navigateBack({
      delta: 1
    })
  }

})
