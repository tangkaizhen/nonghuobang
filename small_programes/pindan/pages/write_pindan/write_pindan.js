// pages/write_pindan/write_pindan.js
const app = getApp()
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
const util = require('../../utils/util.js')
var qqmapsdk
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    filtrate_type: {
      filtrate_type1: 'icon_selection_s_all_h',
      filtrate_type2: 'icon_selection_s_cultivation_h',
      filtrate_type3: 'icon_selection_s_spray_n',
      filtrate_type4: 'icon_selection_s_harvest_n',
      filtrate_type5: 'icon_selection_s_hire_n',
    },
    info_date:'',
    crops:["水稻","小麦","玉米","马铃薯","果树","葡萄","蔬菜"],
    crop_value:'',
    crop_index:'',
    region:'',
    province:'',
    city:'',
    district:'',
    info_name:'',
    info_tel:'',
    info_details:'',
    info_area:'',
    jobType:'耕种',
    editor_id:'',
    editor_index:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'E7CBZ-D2QHJ-YQQF7-KH3H5-GQVN2-5PF2I'
    });

    console.log(options);
    if (options.combineOrderId && options.index){
      let combineOrderId = options.combineOrderId;
      let index = options.index;
      console.log(combineOrderId)
      console.log(index)
      _this.setData({
        editor_id: combineOrderId,
        editor_index: index,

      })

      // 根据combineOrderId来获取拼单的详情信息
      wx.request({
        url: app.globalData.api_ctx + '/helper/getCombineOrderDetails.json', // 仅为示例，并非真实的接口地址
        data: {
          id: wx.getStorageSync('helper_id'),
          appToken: wx.getStorageSync('appToken'),
          combineOrderId: combineOrderId
        },
				header: wx.getStorageSync('header'),
        success(res) {
          console.log(res)
          let combineOrder = res.data.data.combineOrder
          
          _this.setData({
            info_name: combineOrder.contactName,
            info_tel: combineOrder.contactPhone,
            region: combineOrder.province + '-' + combineOrder.city + '-' + combineOrder.district,
            info_details: combineOrder.address,
            crop_value: combineOrder.cropsType,
            jobType: combineOrder.jobType,
            info_area: combineOrder.serviceArea,
            info_date: combineOrder.serviceDate,
            province: combineOrder.province,
            city: combineOrder.city,
            district: combineOrder.district
          })
          let jobType = combineOrder.jobType
          if (jobType == '耕种') {
            _this.setData({
              filtrate_type: {
                filtrate_type1: 'icon_selection_s_all_n',
                filtrate_type2: 'icon_selection_s_cultivation_h',
                filtrate_type3: 'icon_selection_s_spray_n',
                filtrate_type4: 'icon_selection_s_harvest_n',
                filtrate_type5: 'icon_selection_s_hire_n',
              },
            })
          } else if (jobType == '打药') {
            _this.setData({
              filtrate_type: {
                filtrate_type1: 'icon_selection_s_all_n',
                filtrate_type2: 'icon_selection_s_cultivation_n',
                filtrate_type3: 'icon_selection_s_spray_h',
                filtrate_type4: 'icon_selection_s_harvest_n',
                filtrate_type5: 'icon_selection_s_hire_n',
              },
            })
          } else if (jobType == '收割') {
            _this.setData({
              filtrate_type: {
                filtrate_type1: 'icon_selection_s_all_n',
                filtrate_type2: 'icon_selection_s_cultivation_n',
                filtrate_type3: 'icon_selection_s_spray_n',
                filtrate_type4: 'icon_selection_s_harvest_h',
                filtrate_type5: 'icon_selection_s_hire_n',
              },
            })
          } else if (jobType == '人工') {
            _this.setData({
              filtrate_type: {
                filtrate_type1: 'icon_selection_s_all_n',
                filtrate_type2: 'icon_selection_s_cultivation_n',
                filtrate_type3: 'icon_selection_s_spray_n',
                filtrate_type4: 'icon_selection_s_harvest_n',
                filtrate_type5: 'icon_selection_s_hire_h',
              },
            })
          }


        }
      })

    }
  },
  back_page(){
    wx.navigateBack({
      delta: 1
    })
  },
  bindDateChange: function (e) {
    this.setData({
      info_date: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    let _this=this
    this.setData({
      crop_value: _this.data.crops[e.detail.value]
    })
  },
  bindRegionChange: function (e) {
    var _this=this;
    console.log(e.detail.value);
    var region_arr = e.detail.value;
    var region_arr_str=''
    if (region_arr[1]=='全部'){
      region_arr_str = region_arr[0]
      this.setData({
        province: region_arr[0]
      })
    } else if (region_arr[2] == '全部'){
      region_arr_str = region_arr[0] +'-'+ region_arr[1]
      this.setData({
        province: region_arr[0],
        city: region_arr[1]
      })
    }else{
      region_arr_str = region_arr[0] + '-' + region_arr[1] + '-' + region_arr[2],
        this.setData({
          province: region_arr[0],
          city: region_arr[1],
          district: region_arr[2]
        })
    }

    this.setData({
      region: region_arr_str
    })
  },
  select_filtrate_type(event) {
    var _this = this;
    _this.setData({
      isHideFil: !_this.data.isHideFil,
    })
    console.log(event.currentTarget.dataset.index);
    var index = event.currentTarget.dataset.index;
    if (index == 2) {
      _this.setData({
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_n',
          filtrate_type2: 'icon_selection_s_cultivation_h',
          filtrate_type3: 'icon_selection_s_spray_n',
          filtrate_type4: 'icon_selection_s_harvest_n',
          filtrate_type5: 'icon_selection_s_hire_n',
        },
        search_txt: '耕种',
        jobType:'耕种'
      })
    } else if (index == 3) {
      _this.setData({
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_n',
          filtrate_type2: 'icon_selection_s_cultivation_n',
          filtrate_type3: 'icon_selection_s_spray_h',
          filtrate_type4: 'icon_selection_s_harvest_n',
          filtrate_type5: 'icon_selection_s_hire_n',
        },
        search_txt: '打药',
        jobType: '打药'
      })
    } else if (index == 4) {
      _this.setData({
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_n',
          filtrate_type2: 'icon_selection_s_cultivation_n',
          filtrate_type3: 'icon_selection_s_spray_n',
          filtrate_type4: 'icon_selection_s_harvest_h',
          filtrate_type5: 'icon_selection_s_hire_n',
        },
        search_txt: '收割',
        jobType: '收割'
      })
    } else if (index == 5) {
      _this.setData({
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_n',
          filtrate_type2: 'icon_selection_s_cultivation_n',
          filtrate_type3: 'icon_selection_s_spray_n',
          filtrate_type4: 'icon_selection_s_harvest_n',
          filtrate_type5: 'icon_selection_s_hire_h',
        },
        search_txt: '人工',
        jobType: '人工'
      })
    }
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
  bind_info_name(e){
    this.setData({
      info_name: e.detail.value
    })
  },
  bind_info_tel(e){
    this.setData({
      info_tel: e.detail.value
    })
  },
  bind_info_details(e){
    this.setData({
      info_details: e.detail.value
    })
  },
  bind_info_area(e){
    this.setData({
      info_area: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  start_pindan: function () {
    util.showloading()
    var _this=this;
    // 首先检查数据的有效性
    if (!_this.data.info_name){
      wx.showToast({
        title: '请输入联系人',
        icon: 'none',
      })
      return;
    }
    if (!_this.data.info_tel){
      wx.showToast({
        title: '请输入联系电话',
        icon:'none',
      })
      return;
    }
    if (!app.globalData.reg_phone.test(_this.data.info_tel)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
      })

      return;
    }
    if (!_this.data.region) {
      wx.showToast({
        title: '请选择作业地址',
        icon: 'none',
      })
      return;
    } 
    if (!_this.data.info_details) {
      wx.showToast({
        title: '请输入详细的地址',
        icon: 'none',
      })
      return;
    }
    if (!_this.data.crop_value) {
      wx.showToast({
        title: '请选择作物种类',
        icon: 'none',
      })
      return;
    }
    if (!_this.data.info_area) {
      wx.showToast({
        title: '请输入服务亩数',
        icon: 'none',
      })
      return;
    }
    if (!_this.data.info_date) {
      wx.showToast({
        title: '请选择服务时间',
        icon: 'none',
      })
      return;
    }

    qqmapsdk.geocoder({
      address: _this.data.province + _this.data.city + _this.data.district + _this.data.info_details, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        let data = {}
        let title=''
        if (_this.data.editor_id){
          title='拼单编辑成功'
          data = {
            combineOrderId: _this.data.editor_id,
            id: wx.getStorageSync('helper_id'),
            contactName: _this.data.info_name,
            contactPhone: _this.data.info_tel,
            province: _this.data.province,
            city: _this.data.city,
            district: _this.data.district, 
            address: _this.data.info_details,
            longitude: longitude,
            latitude: latitude,
            jobType: _this.data.jobType,
            cropsType: _this.data.crop_value,
            serviceArea: _this.data.info_area,
            serviceDate: _this.data.info_date,
            appToken: wx.getStorageSync('appToken')
          }
        }else{
          title= '拼单添加成功'
          data = {
            id: wx.getStorageSync('helper_id'),
            contactName: _this.data.info_name,
            contactPhone: _this.data.info_tel,
            province: _this.data.province,
            city: _this.data.city,
            district: _this.data.district,
            address: _this.data.info_details,
            longitude: longitude,
            latitude: latitude,
            jobType: _this.data.jobType,
            cropsType: _this.data.crop_value,
            serviceArea: _this.data.info_area,
            serviceDate: _this.data.info_date,
            appToken: wx.getStorageSync('appToken')
          }
        }
        
        // 开始进行保存
        wx.request({
          url: app.globalData.api_ctx + '/helper/saveCombineOrder.json', // 仅为示例，并非真实的接口地址
          data: data,
					header: wx.getStorageSync('header'),
          success(res) {
            console.log(res)
            if(res.data.status){

            wx.showToast({
              title: title,
              icon:'none',
              duration: 2000,
              success(){
                
                util.hideloading()
                // 判断是否从我的拼单过来，如果是从我的拼单来，需要刷新页面或者重新加载
                var pages = getCurrentPages();
                var currPage = pages[pages.length - 1];   //当前页面
                var prevPage = pages[pages.length - 2];  //上一个页面
                if (prevPage.route =='pages/my_pindan/my_pindan'){
                  prevPage.setData({
                    pageNum: 1,
                    combineOrders: []
                  })
                  prevPage.myCombineOrders(prevPage.data.operate_type, prevPage.data.keyword, prevPage.data.pageNum)
                }


                setTimeout(function(){
                  wx.navigateBack({
                    delta: 1
                  })
                },1000)
                
              }
            })
            
          }else{
              wx.showToast({
                title: '保存失败',
                icon: 'none',
                duration: 2000
              })
          }

          }
        })

      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
    

    
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