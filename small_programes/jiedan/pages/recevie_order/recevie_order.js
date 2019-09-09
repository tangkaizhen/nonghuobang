// pages/recevie_order/recevie_order.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    res_ctx: app.globalData.res_ctx,
    filtrate_type: {
      filtrate_type1: 'icon_selection_s_all_h',
      filtrate_type2: 'icon_selection_s_cultivation_n',
      filtrate_type3: 'icon_selection_s_spray_n',
      filtrate_type4: 'icon_selection_s_harvest_n',
      filtrate_type5: 'icon_selection_s_hire_n',
    },
    isHideFil: true,
    weather:{},
    weather_img:'',
    position_city: '',
    recevie_order_position_obj:{},
    keyword:'',
    orderType:0,
    operate_type: '全部',
    pageNum:1,
    orders:[],
    // 这个主要是判断没有order时候，就不要出现加载中的弹框了
    hasOrder:false,
    click_recevie_btn_id:0,
    hidden_recevie_outter_box:true,
		ifShowAuth: false,
		authorization: true,
		helper_id: wx.getStorageSync('helper_id'),
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		var _this = this
    // 获取一些初始化数据
    wx.request({
      url: app.globalData.api_ctx + '/helper/initData.json',
      data: {
        appToken: wx.getStorageSync('appToken'),
        type: wx.getStorageSync('helper_type')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.data) {
          wx.setStorageSync('initData', res.data.data);
        }

      }
    })
    
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
					if (wx.getStorageSync('helper_id')) {
						wx.setTabBarItem({
							index: 0,
							text: '接单',
							iconPath: '/images/icon_tab_shouye_normal.png',
							selectedIconPath: '/images/icon_tab_shouye_highlight.png'
						})
						wx.setTabBarItem({
							index: 1,
							text: '订单',
							iconPath: '/images/icon_tab_dingdan_normal.png',
							selectedIconPath: '/images/icon_tab_dingdan_highlight.png'
						})

						// 有账号
						//  获取初始化数据
						_this.setData({
							helper_id: wx.getStorageSync('helper_id')
						})

						// 将TabBar隐藏
						wx.showTabBar()
						_this.fn_auto_location()

					} else {
						// 如果没有账号，需要跳转到login
						app.onlogin()
					}
				} else {
          if (wx.getStorageSync('helper_id')){
            wx.setTabBarItem({
              index: 0,
              text: '接单',
              iconPath: '/images/icon_tab_shouye_normal.png',
              selectedIconPath: '/images/icon_tab_shouye_highlight.png'
            })
            wx.setTabBarItem({
              index: 1,
              text: '订单',
              iconPath: '/images/icon_tab_dingdan_normal.png',
              selectedIconPath: '/images/icon_tab_dingdan_highlight.png'
            })

            // 有账号
            //  获取初始化数据
            _this.setData({
              helper_id: wx.getStorageSync('helper_id')
            })
            // 将TabBar隐藏
            wx.showTabBar()
            _this.fn_auto_location()
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
				//用户按了拒绝按钮
				_this.setData({
					ifShowAuth:false
				})	

				// 这时候还要看看有没有账号
				if (wx.getStorageSync('helper_id')) {
					wx.setTabBarItem({
						index: 0,
						text: '接单',
						iconPath: '/images/icon_tab_shouye_normal.png',
						selectedIconPath: '/images/icon_tab_shouye_highlight.png'
					})
					wx.setTabBarItem({
						index: 1,
						text: '订单',
						iconPath: '/images/icon_tab_dingdan_normal.png',
						selectedIconPath: '/images/icon_tab_dingdan_highlight.png'
					})
				}	
				// 将TabBar隐藏
				wx.showTabBar()
				_this.fn_auto_location()
			}
		} else {
			//用户按了拒绝按钮
			_this.setData({
				ifShowAuth: true,
				authorization: false
			})
		}
	},

  toggle_filtrate_box() {
    var _this = this;

    _this.setData({
      isHideFil: !_this.data.isHideFil
    })
  },
  // 选择一个新的条件，将之前的条件全部重置
  reset_condition(){
    
    this.setData({
      filtrate_type: {
        filtrate_type1: 'icon_selection_s_all_h',
        filtrate_type2: 'icon_selection_s_cultivation_n',
        filtrate_type3: 'icon_selection_s_spray_n',
        filtrate_type4: 'icon_selection_s_harvest_n',
        filtrate_type5: 'icon_selection_s_hire_n',
      },
      isHideFil: true,
      weather: {},
      weather_img: '',
      position_city: '',
      recevie_order_position_obj: {},
      keyword: '',
      orderType: 0,
      pageNum: 1,
      
      hidden_recevie_outter_box: true,
    })
  },
  select_filtrate_type(event) {
    var _this = this;
    var index = event.currentTarget.dataset.index;

    _this.setData({
      isHideFil: !_this.data.isHideFil,
      filtrate_type: {
        filtrate_type1: index == 1 ? 'icon_selection_s_all_h' : 'icon_selection_s_all_n',
        filtrate_type2: index == 2 ? 'icon_selection_s_cultivation_h' : 'icon_selection_s_cultivation_n',
        filtrate_type3: index == 3 ? 'icon_selection_s_spray_h' : 'icon_selection_s_spray_n',
        filtrate_type4: index == 4 ? 'icon_selection_s_harvest_h' : 'icon_selection_s_harvest_n',
        filtrate_type5: index == 5 ? 'icon_selection_s_hire_h' : 'icon_selection_s_hire_n',
      },
      pageNum: 1,
      keyword: '',
      orders: [],
      hidden_recevie_outter_box: false
    })  

    if (index == 1) {
      _this.setData({
        operate_type: '全部',
      })
    } else if (index == 2) {
      _this.setData({
        operate_type: '耕种'
      })
    } else if (index == 3) {
      _this.setData({
        operate_type: '打药'
      })
    } else if (index == 4) {
      _this.setData({
        operate_type: '收割'
      })
    } else if (index == 5) {
      _this.setData({
        operate_type: '人工'
      })
    }
    
    var search_jobType=''
    if (_this.data.operate_type != '全部') {
      search_jobType = _this.data.operate_type
    }

    _this.onload_order(_this.data.recevie_order_position_obj.province, _this.data.recevie_order_position_obj.city, '', search_jobType, _this.data.keyword, _this.data.orderType, _this.data.recevie_order_position_obj.longitude, _this.data.recevie_order_position_obj.latitude, _this.data.pageNum);

  },
  
  fn_auto_location(){
    var _this = this
    
    // 首先自动定位
    util.auto_location().then(res => {
      var longitude = res.longitude
      var latitude = res.latitude

      // 根据获得的经纬转变成地址
      util.lnglat_to_location(longitude, latitude).then(res => {
        var recevie_order_position_obj = res.result.address_component
        recevie_order_position_obj = {
          ...recevie_order_position_obj,
          longitude,
          latitude
        }
        _this.setData({
          position_city: recevie_order_position_obj.city,
          recevie_order_position_obj
        })
        // 存在历史定位过的城市
        util.set_history_cookie('recevie_order_city', recevie_order_position_obj.city)

        var search_jobType=''
        if (_this.data.operate_type!='全部'){
          search_jobType = _this.data.operate_type
        }
        _this.onload_order(recevie_order_position_obj.province, recevie_order_position_obj.city, '', search_jobType, _this.data.keyword, _this.data.orderType, recevie_order_position_obj.longitude, recevie_order_position_obj.latitude, _this.data.pageNum);
        // 加载天气
        _this.onload_weather(recevie_order_position_obj.province, recevie_order_position_obj.city)
      }).catch(error=>{
				console.log(error)
			})
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasOrder){
        var _this=this
        util.showloading("加载中")
        var search_jobType = ''
        if (_this.data.operate_type != '全部') {
          search_jobType = _this.data.operate_type
        }

        _this.onload_order(_this.data.recevie_order_position_obj.province, _this.data.recevie_order_position_obj.city, '', search_jobType, _this.data.keyword, _this.data.orderType, _this.data.recevie_order_position_obj.longitude, _this.data.recevie_order_position_obj.latitude, _this.data.pageNum);

    }
  },
  // 加载订单
  onload_order(province, city, district, jobType, keyword, orderType, longitude, latitude, pageNum){
    var _this = this;
    wx.request({
      url: app.globalData.api_ctx + '/helper/grabOrderList.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'),
        province,
        city,
        district,
        jobType,
        keyword,
        orderType,
        type:2,
        longitude,
        latitude,
        pageNum,
        appToken: wx.getStorageSync('appToken')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        util.hideloading()

        console.log(res)
        if (res.data.status==1) {
          var orders = res.data.data.orders
          if (orders.length>0){

          orders.forEach(order=>{
            return order.location = order.location.substring(0,15)
          })
          orders.forEach(order=>{
            return order.distance = order.distance.toFixed(2)
          })

          _this.setData({
            hidden_recevie_outter_box: false,
            orders: [..._this.data.orders,...orders],
            pageNum: ++_this.data.pageNum,
            hasOrder: true
          })

          if (orders.length < 10){
            _this.setData({
              hasOrder: false
            })
          }
          } else {
            // 这时候表示没有了
            _this.setData({
              hasOrder:false
            })
          }
        }
      }
    })
  },
  // 加载天气
  onload_weather(province,city){
    var _this=this
    // 加载天气
    wx.request({
      url: app.globalData.api_ctx + '/helper/getCityWeather.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        province: province,
        city: city
      },
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.status == 1) {
            _this.setData({
              weather: res.data.data,
              weather_img: _this.weatherImgPath(res.data.data.img),
            })
          util.hideloading()
        }
      }
    })
  },

  weatherImgPath(img){
    if (img == "") {
      return ""
    } else {
      return "/images/weather_icon/" + parseInt(img) + ".png";
    }
  },
  // 跳转搜索页
  search_box(){
    wx.navigateTo({
      url: '/pages/search/search?recevie_order_position_obj=' + JSON.stringify(this.data.recevie_order_position_obj)
    })
  },
  // 跳转排序页
  filtrate_inner_box(){
    wx.navigateTo({
      url: '/pages/screen/screen?recevie_order_position_obj=' + JSON.stringify(this.data.recevie_order_position_obj)
    })
  },
  // 跳转定位页
  recevie_location() {
    wx.navigateTo({
      url: '/pages/home_location/home_location?recevie_order_position_obj='+JSON.stringify(this.data.recevie_order_position_obj)
    })
  },
  // 跳转天气页
  recevie_weather() {
    wx.navigateTo({
      url: '/pages/recevie_weather/recevie_weather?weather='+JSON.stringify(this.data.weather)
    })
  },

  recevie_btn(e){

    var _this=this
    var id = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '申请订单',
      content: '您确定要申请接单吗?',
      confirmColor:'#6cd986',
      success(res) {
        if (res.confirm) {

          wx.request({
            url: app.globalData.api_ctx + '/helper/grabOrder.json', // 仅为示例，并非真实的接口地址
            data: {
              appToken: wx.getStorageSync('appToken'),
              id: wx.getStorageSync('helper_id'),
              orderId: id
            },
            header: wx.getStorageSync('header'),
            success(res) {
              console.log(res)
              if (res.data.status == 1) {

                var orders=_this.data.orders

                orders.forEach(order=>{
                  if (order.id == id){
                    order.applyFlag=1
                  }
                })
                _this.setData({
                  orders
                })

              } else if (res.data.status == 0){
                util.showInfo(res.data.msg)
              }
            }
          })

        } else if (res.cancel) {
        }
      }
    })

  },
  to_order_details(e){
    var id = e.currentTarget.dataset.id
    wx.setStorageSync('id', id); //保存Cookie到Storage
    wx.navigateTo({
      url: '/pages/recevie_order_details/recevie_order_details'
    })

  },
  
  onTabItemTap() {
    util.showloading("加载中")
    var _this=this

     _this.setData({
       pageNum:1,
       hidden_recevie_outter_box:true,
       orders:[]
     })

       _this.onload_order(_this.data.recevie_order_position_obj.province, _this.data.recevie_order_position_obj.city, '', '', '', 0, _this.data.recevie_order_position_obj.longitude, _this.data.recevie_order_position_obj.latitude, _this.data.pageNum);
    }
})