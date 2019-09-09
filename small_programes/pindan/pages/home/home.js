// pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
		ifShowAuth:false,
		authorization: true,
		helper_id:wx.getStorageSync('helper_id'),
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		filtrate_type:{
			filtrate_type1: 'icon_selection_s_all_h',
			filtrate_type2: 'icon_selection_s_cultivation_n',
			filtrate_type3: 'icon_selection_s_spray_n',
			filtrate_type4: 'icon_selection_s_harvest_n',
			filtrate_type5: 'icon_selection_s_hire_n',
		},
		isHideFil:true,
		search_txt:'筛选',
		showList:false,
		map_content_box:true,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'cookie': wx.getStorageSync('cookieKey')
		},
		pageNum:1,
		operate_type:'',
		keyword:'',
		map_operate_type:'',
		map_keyword:'',
		combineOrders:[],
		search_type:'/images/icon_index_mapmode_xin.png',
		longitude:'',
		latitude:'',
		polygons:[],
		markers:[],
		scale:14
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var _this = this

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
						// 有账号
						//  获取初始化数据
						//  获取初始化数据
						_this.setData({
							helper_id: wx.getStorageSync('helper_id')
						})
						_this.getCombineOrders(wx.getStorageSync('helper_id'), _this.data.operate_type, _this.data.keyword, _this.data.pageNum);
					} else {
						// 如果没有账号，需要跳转到login
						app.onlogin()
					}
				} else {
					// 用户还没授权
					_this.setData({
						ifShowAuth: true
					})
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
					ifShowAuth: false,
				})
				_this.getCombineOrders(wx.getStorageSync('helper_id'), _this.data.operate_type, _this.data.keyword, _this.data.pageNum);
			}
		} else {
			//用户按了拒绝按钮
			_this.setData({
				ifShowAuth: true,
				authorization: false
			})
		}
	},
  location_map(jobType, keyword) {
    let _this=this
    let mapCtx = wx.createMapContext('map')
    // 获取地图范围
    mapCtx.getRegion({
      success(res) {
        let minLng = res.southwest.longitude
        let maxLng = res.northeast.longitude
        let minLat = res.southwest.latitude
        let maxLat = res.northeast.latitude
        // 开始调用方法
        _this.onload_map(jobType, keyword, minLng, maxLng, minLat, maxLat)
      }
    })
  },
  // 自动定位
  auto_location(){
    let _this=this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        _this.setData({
          latitude: latitude,
          longitude: longitude,
        })
      }
    })
  },
  regionchange(){
    let _this=this;
    let jobType=_this.data.map_operate_type;
    let keyword = _this.data.map_keyword;
    _this.location_map(jobType, keyword)
  },
  to_search(){
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  getCombineOrders(id, jobType, keyword, pageNum){
    var _this = this;
    wx.request({
      url: app.globalData.api_ctx + '/helper/getCombineOrders.json', // 仅为示例，并非真实的接口地址
      data: {
        id: id,
        jobType: jobType,
        keyword: keyword,
        pageNum: pageNum,
        type:2,
        appToken: wx.getStorageSync('appToken')
      },
			header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.data) {
          if (res.data.data.combineOrders){
            let combineOrders = res.data.data.combineOrders;

            _this.setData({
              combineOrders: [..._this.data.combineOrders, ...combineOrders]
            })
          }
        }

      }
    })
  },
  onload_map(jobType, keyword, minLng, maxLng, minLat, maxLat){
    var _this = this;
    
    wx.request({
      url: app.globalData.api_ctx + '/helper/getCombineOrders.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'),
        jobType: jobType,
        keyword: keyword, 
        type:1,
        minLng: minLng,
        maxLng: maxLng,
        minLat: minLat,
        maxLat: maxLat,
        zoom: _this.data.scale,
        appToken: wx.getStorageSync('appToken')
      },
			header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.status==1){
          let combineOrders = res.data.data.combineOrders;

          if (combineOrders.length > 0) {
            let polygons = [];
            let markers = [];
            for (var i = 0; i < combineOrders.length; i++) {

              var plots_arr = combineOrders[i].plots;
              if (plots_arr[0]) {
                var points_arr = plots_arr[0].points;
                let polygons_plots_arr=[]

                let longitude_max = 0;
                let longitude_min = 100000;
                let latitude_max = 0;
                let latitude_min = 1000000;
                let longitude_center = 0;
                let latitude_center = 0;

                if (points_arr.length > 0) {
                  // 增加两个数组，存放经纬度的，为了后面求中心点
                  
                  for (let j = 0; j < points_arr.length; j++) {
                    polygons_plots_arr.push(
                      {
                        longitude: points_arr[j].longitude,
                        latitude: points_arr[j].latitude
                      }
                    )
                    if ((1 * points_arr[j].longitude) > longitude_max){
                      longitude_max = 1 * points_arr[j].longitude
                    }
                    if ((1 * points_arr[j].longitude) < longitude_min){
                      longitude_min = 1 * points_arr[j].longitude
                    }

                    if ((1 * points_arr[j].latitude) > latitude_max){
                      latitude_max = 1 * points_arr[j].latitude
                    }
                    if ((1 * points_arr[j].latitude) < latitude_min){
                      latitude_min = 1 * points_arr[j].latitude
                    }

                  }

                  // 这时候可以得出中心经纬度了

                  let longitude_center = (longitude_max + longitude_min)/2
                  let latitude_center = (latitude_max + latitude_min)/2
                }

                // 创建面覆盖物
                /* 这是区分是自己的地块还是别人的地块 */
                if (wx.getStorageSync('helper_id') == combineOrders[i].helperId) {
                  /* 表示自己的 */
                  polygons.push({
                    points: polygons_plots_arr,
                    strokeColor:'',
                    fillColor:'#ff0000',
                    strokeColor: '#ff0000'
                  })
                } else {
                  polygons.push({
                    points: polygons_plots_arr,
                    strokeColor: '',
                    fillColor: '#4eff00',
                    strokeColor:'#4eff00'
                  })
                }

                
                // 开始加载markers
                markers.push({
                  iconPath: '/images/icon_selection_map.png',
                  id: combineOrders[i].id,
                  latitude: latitude_center,
                  longitude: longitude_center,
                  width: 40,
                  height: 40
                })

                _this.setData({
                  polygons: polygons.concat(_this.data.polygons),
                  markers: markers.concat(_this.data.markers)
                })


              }
             

            }

          }

        }
      }
    })
  },
  makePhoneCall(event){
    let phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  // 这是点击marker的事件
  marker_fn(event){
    console.log(event)
  },
  to_my_order(){
    wx.navigateTo({
      url: '/pages/my_pindan/my_pindan'
    })
  },
  to_start(){
    wx.navigateTo({
      url: '/pages/write_pindan/write_pindan'
    })
  },
  select_filtrate_type(event){
    var _this=this;
    _this.setData({
      isHideFil: !_this.data.isHideFil,
    })
    console.log(event.currentTarget.dataset.index);
    var index = event.currentTarget.dataset.index;
    _this.setData({
      pageNum:1,
      combineOrders:[]
    })
    if (index==1){
      _this.setData({
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_h',
          filtrate_type2: 'icon_selection_s_cultivation_n',
          filtrate_type3: 'icon_selection_s_spray_n',
          filtrate_type4: 'icon_selection_s_harvest_n',
          filtrate_type5: 'icon_selection_s_hire_n',
        },
        search_txt:'全部',
        operate_type:''
      })
    } else if (index == 2){
      _this.setData({
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_n',
          filtrate_type2: 'icon_selection_s_cultivation_h',
          filtrate_type3: 'icon_selection_s_spray_n',
          filtrate_type4: 'icon_selection_s_harvest_n',
          filtrate_type5: 'icon_selection_s_hire_n',
        },
        search_txt: '耕种',
        operate_type: '耕种'
      })
    } else if (index == 3){
      _this.setData({
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_n',
          filtrate_type2: 'icon_selection_s_cultivation_n',
          filtrate_type3: 'icon_selection_s_spray_h',
          filtrate_type4: 'icon_selection_s_harvest_n',
          filtrate_type5: 'icon_selection_s_hire_n',
        },
        search_txt: '打药',
        operate_type: '打药'
      })
    } else if (index == 4){
      _this.setData({
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_n',
          filtrate_type2: 'icon_selection_s_cultivation_n',
          filtrate_type3: 'icon_selection_s_spray_n',
          filtrate_type4: 'icon_selection_s_harvest_h',
          filtrate_type5: 'icon_selection_s_hire_n',
        },
        search_txt: '收割',
        operate_type: '收割'
      })
    } else if (index == 5){
      _this.setData({
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_n',
          filtrate_type2: 'icon_selection_s_cultivation_n',
          filtrate_type3: 'icon_selection_s_spray_n',
          filtrate_type4: 'icon_selection_s_harvest_n',
          filtrate_type5: 'icon_selection_s_hire_h',
        },
        search_txt: '人工',
        operate_type: '人工'
      })
    }
    _this.setData({
      keyword: ''
    })
    _this.getCombineOrders(wx.getStorageSync('helper_id'), _this.data.operate_type, _this.data.keyword, _this.data.pageNum);
  },
  toggle_filtrate_box(){
    var _this=this;
    _this.setData({
      isHideFil:!_this.data.isHideFil,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    this.getCombineOrders(wx.getStorageSync('helper_id'), this.data.operate_type, this.data.keyword, ++this.data.pageNum);
  },
  switch_order(){
    var _this=this;
    _this.setData({
      showList:!this.data.showList
    })

    if (this.data.showList){
        // 出现地图
        _this.setData({
          search_type:'/images/icon_index_mapmode_xin.png'
        })
    }else{
      _this.setData({
        search_type: '/images/icon_tab_dingdan_normal1.png'
      })
    }
  }
})