// pages/home_location/home_location.js
const app = getApp()
const util = require('../../js/util.js')
const LAreaData = require('../../js/LAreaData.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityData: [],
    districtData:[],
    streetData:[],
    city_input_del:true,
    city_input_backspace:true,
    city_input_value:'',
    details_input_value:'',
    search_header:'搜索结果',
    search_city:false,
    search_district:true,
    search_street:true,
    search_details:true,
    input_disabled:false,
    complete_btn:false,
    hidden_complete_btn:true,
    select_district_name:'',
    select_street_name:'',
    auto_location_txt: '自动定位'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
    if (options.city){
      // 表示从其他界面有城市传过来
      var city = options.city

      var allDistrict = []
      var allCity = []
      // 开始查询其所对应的区
      for (var i = 0; i < LAreaData.LAreaData.length; i++) {
        for (var j = 0; j < LAreaData.LAreaData[i].child.length; j++) {
          if (LAreaData.LAreaData[i].child[j].name.indexOf(city) > -1 ) {
            allCity.push(LAreaData.LAreaData[i].child[j])
            allDistrict = [...allDistrict, ...LAreaData.LAreaData[i].child[j].child]
          }
        }
      }
      _this.setData({
        districtData: allDistrict,
        cityData: allCity
      })

      _this.setData({
        search_header: '请选择您所在的行政区',
        city_input_backspace: false,
        city_input_del: true,
        search_city: true,
        search_district: false,
        search_street: true,
        city_input_value: city,
        input_disabled: true
      })

    } 
  },
  auto_location() {
    var _this = this
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 3];  //首页
    _this.setData({
      auto_location_txt: '定位中...'
    })
    prevPage.setData({
      pageNum: 1,
      orders:[]
    })

    prevPage.fn_auto_location()
    wx.navigateBack({
      delta: 2
    })
  },
  city_input(e){
    var _this=this
    var val = e.detail.value
    this.setData({
      city_input_value: e.detail.value
    })

    if (val){
      _this.setData({
        city_input_del:false
      })
    }else{
      _this.setData({
        city_input_del: true
      })
    }

    var allCity=[]
    // 开始查询
    for (var i = 0; i < LAreaData.LAreaData.length; i++) {
      for (var j = 0; j < LAreaData.LAreaData[i].child.length; j++) {
        if (LAreaData.LAreaData[i].child[j].name.indexOf(val) > -1 && val != '') {
          allCity.push(LAreaData.LAreaData[i].child[j])
        }
      }
    }
    _this.setData({
      cityData: allCity
    })

  },
  details_input(e){
    var _this = this
    this.setData({
      details_input_value: e.detail.value,
      complete_btn: e.detail.value==''?false:true
    })
  },
  city_input_del(){
    var _this=this
    _this.setData({
      city_input_del: true,
      city_input_value:'',
      cityData:[]
    })
  },
  city_click(e){
    var _this=this
    var select_city_name = e.currentTarget.dataset.name
    var city_arr = _this.data.cityData;

    for (var i = 0; i < city_arr.length; i++) {
      if (city_arr[i].name == select_city_name) {
        _this.setData({
          districtData: city_arr[i].child
        })
      }
    }

    _this.setData({
      search_header:'请选择您所在的行政区',
      city_input_backspace:false,
      city_input_del:true,
      search_city:true,
      search_district:false,
      search_street:true,
      city_input_value: select_city_name,
      input_disabled:true
    })
  },

  district_click(e) {
    var _this = this
    var id = e.currentTarget.dataset.id
    var district_name = e.currentTarget.dataset.name

    // 获取一些初始化数据
    wx.request({
      url: app.globalData.api_ctx + '/helper/getStreets.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        districtId: id
      },
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.status==1) {
          
          _this.setData({
            streetData: res.data.data.streets
          })
        }

      }
    })

    _this.setData({
      search_header: '请选择您所在的街道',
      city_input_backspace: false,
      city_input_del: true,
      search_city: true,
      search_district: true,
      search_street: false,
      city_input_value: _this.data.city_input_value + '-' + district_name,
      input_disabled: true,
      select_district_name: district_name
    })
  },
  street_click(e){
    var _this = this
    var street_name = e.currentTarget.dataset.name

    _this.setData({
      search_header: '详细地址',
      city_input_backspace: false,
      city_input_del: true,
      search_city: true,
      search_district: true,
      search_street: true,
      search_details:false,
      hidden_complete_btn:false,
      city_input_value: _this.data.city_input_value + '-' + street_name,
      input_disabled: true,
      select_street_name: street_name
    })
  },
  city_input_backspace(){
    var _this=this
    var position = _this.data.city_input_value.split('-')
    if (!_this.data.search_details){
      // 这时候表示处于填写详细地址阶段
      _this.setData({
        search_header: '请选择您所在的街道',
        city_input_backspace: false,
        city_input_del: true,
        search_city: true,
        search_district: true,
        search_street: false,
        search_details: true,
        hidden_complete_btn: true,
        city_input_value: position[0] + '-' + position[1],
        input_disabled: true,
        details_input_value:'',
        complete_btn:false
      })
    } else if (!_this.data.search_street){
      // 这时候表示处于选择街道阶段
      _this.setData({
        search_header: '请选择您所在的行政区',
        city_input_backspace: false,
        city_input_del: true,
        search_city: true,
        search_district: false,
        search_street: true,
        search_details: true,
        hidden_complete_btn: true,
        city_input_value: position[0],
        input_disabled: true,
        details_input_value: ''
      })
    } else if (!_this.data.search_district) {
      // 这时候表示处于选择区阶段
      _this.setData({
        search_header: '搜索结果',
        city_input_backspace: true,
        city_input_del: false,
        search_city: false,
        search_district: true,
        search_street: true,
        search_details: true,
        hidden_complete_btn: true,
        city_input_value: position[0],
        input_disabled: false,
        details_input_value: ''
      })
    } else if (!_this.data.search_city) {
      // 这时候表示处于选择市阶段
    }
    
  },
  close_btn(){
    wx.navigateBack({
      delta: 1
    })
  },
  complete_btn(){
    var _this=this
    if (this.data.details_input_value){
      var recevie_order_position_obj={
        province: _this.data.cityData[0].pro,
        city: _this.data.city_input_value.split("-")[0],
        district: _this.data.city_input_value.split("-")[1],
        street: _this.data.city_input_value.split("-")[2],
        address: _this.data.details_input_value
      }

      // 将地址转变成经纬度
      util.location_to_lnglat(recevie_order_position_obj.province + recevie_order_position_obj.city + recevie_order_position_obj.district + recevie_order_position_obj.street + recevie_order_position_obj.address)
        .then(res =>{
          recevie_order_position_obj={
            ...recevie_order_position_obj,
            longitude: res.location.lng,
            latitude: res.location.lat
          }

          // 从页面栈中获取首页
          util.showloading("加载中")

          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 3];  //首页

          prevPage.setData({
            recevie_order_position_obj,
            position_city: recevie_order_position_obj.city,
            pageNum:1,
            hidden_recevie_outter_box:true,
            orders:[]
          })
          prevPage.onload_order(recevie_order_position_obj.province, recevie_order_position_obj.city, '', prevPage.data.operate_type == '全部' ? '' : prevPage.data.operate_type, prevPage.data.keyword, prevPage.data.orderType, recevie_order_position_obj.longitude, recevie_order_position_obj.latitude, prevPage.data.pageNum);

          prevPage.onload_weather(recevie_order_position_obj.province, recevie_order_position_obj.city)

          wx.navigateBack({
            delta: 2
          })
        })
    }
  }
})