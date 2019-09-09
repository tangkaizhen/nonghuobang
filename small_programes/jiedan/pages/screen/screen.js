// pages/screen/screen.js
const app = getApp()
const util = require('../../js/util.js')
const LAreaData = require('../../js/LAreaData.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:'',
    select_district:'',
    districtData:[],
    filtrate_type: {
      filtrate_type1: 'icon_selection_s_all_h_white',
      filtrate_type2: 'icon_selection_s_cultivation_n_white',
      filtrate_type3: 'icon_selection_s_spray_n_white',
      filtrate_type4: 'icon_selection_s_harvest_n_white',
      filtrate_type5: 'icon_selection_s_hire_n_white',
    },
    select_sort:'智能排序',
    recevie_order_position_obj:{},
    hidden_district_box:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this

    if (options.recevie_order_position_obj) {
      this.setData({
        recevie_order_position_obj: JSON.parse(options.recevie_order_position_obj),
        city: JSON.parse(options.recevie_order_position_obj).city
      })
    }

    var all_district = []
    for (var i = 0; i < LAreaData.LAreaData.length; i++) {
      for (var j = 0; j < LAreaData.LAreaData[i].child.length; j++) {
        var city_name = LAreaData.LAreaData[i].child[j].name;
        if (city_name == _this.data.city){
          all_district=all_district.concat(LAreaData.LAreaData[i].child[j].child)
        }
      }
    }
    this.setData({
      districtData: all_district
    })
  },
  position_select_city_btn(){
    var _this=this
    _this.setData({
      hidden_district_box:!_this.data.hidden_district_box,
    })
  },
  select_filtrate_type(event) {
    var _this = this;
    var index = event.currentTarget.dataset.index;

    if (index == 1){
      _this.setData({
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_h_white',
          filtrate_type2: 'icon_selection_s_cultivation_n_white',
          filtrate_type3: 'icon_selection_s_spray_n_white',
          filtrate_type4: 'icon_selection_s_harvest_n_white',
          filtrate_type5: 'icon_selection_s_hire_n_white'
        },
      })
    } else if (index ==2){
      _this.setData({
        filtrate_type: {
          ..._this.data.filtrate_type,
          filtrate_type1:'icon_selection_s_all_n_white',
          filtrate_type2: _this.data.filtrate_type.filtrate_type2 == 'icon_selection_s_cultivation_h_white' ? 'icon_selection_s_cultivation_n_white' : 'icon_selection_s_cultivation_h_white',
        },
      })
    } else if (index ==3) {
      _this.setData({
        filtrate_type: {
          ..._this.data.filtrate_type,
          filtrate_type1: 'icon_selection_s_all_n_white',
          filtrate_type3: _this.data.filtrate_type.filtrate_type3 == 'icon_selection_s_spray_n_white' ? 'icon_selection_s_spray_h_white' : 'icon_selection_s_spray_n_white',
        },
      })
    } else if (index ==4) {
      _this.setData({
        filtrate_type: {
          ..._this.data.filtrate_type,
          filtrate_type1: 'icon_selection_s_all_n_white',
          filtrate_type4: _this.data.filtrate_type.filtrate_type4 == 'icon_selection_s_harvest_n_white' ? 'icon_selection_s_harvest_h_white' : 'icon_selection_s_harvest_n_white',
        },
      })
    } else if (index ==5) {
      _this.setData({
        filtrate_type: {
          ..._this.data.filtrate_type,
          filtrate_type1: 'icon_selection_s_all_n_white',
          filtrate_type5: _this.data.filtrate_type.filtrate_type5 == 'icon_selection_s_hire_n_white' ? 'icon_selection_s_hire_h_white' : 'icon_selection_s_hire_n_white',
        },
      })
    }
  },
  select_district(e){
    var _this=this
    var name = e.currentTarget.dataset.name
    var position_arr=_this.data.city.split("-")
    _this.setData({
      select_district: name,
      hidden_district_box:true,
      city: name == '不限' ? position_arr[0] : position_arr[0] + '-' + name
    })
  },
  sort_btn(e){
    var _this = this
    var name = e.currentTarget.dataset.name
    _this.setData({
      select_sort: name,
    })
  },
  close_btn(){
    wx.navigateBack({
      delta: 1
    })
  },
  
  complete_btn(){
    var _this=this
    var position_arr=_this.data.city.split('-')

    var operate_type=''
    var operate_obj=_this.data.filtrate_type

    if (operate_obj.filtrate_type1.indexOf("_h_")==-1){
      if (operate_obj.filtrate_type2.indexOf("_h_") > -1){
        operate_type = operate_type+'耕种,'
      }
      if (operate_obj.filtrate_type3.indexOf("_h_") > -1){
        operate_type = operate_type+'打药,'
      }
      if (operate_obj.filtrate_type4.indexOf("_h_") > -1){
        operate_type = operate_type+'收割,'
      }
      if (operate_obj.filtrate_type5.indexOf("_h_") > -1){
        operate_type = operate_type+'人工,'
      }

    }
    
    if (operate_type){
      operate_type = operate_type.substring(0, operate_type.length-1)
    }

    var orderType=0
    if (_this.data.select_sort =='成交最高'){
      orderType = 1
    } else if (_this.data.select_sort == '距离最近'){
      orderType = 2
    } else if (_this.data.select_sort == '评分最高') {
      orderType = 3
    }

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //首页

    prevPage.setData({
      pageNum: 1,
      operate_type: operate_type == '' ? '全部' : operate_type.split(',')[0],
      orders:[]
    })

    // 将地址转变成经纬度
    util.location_to_lnglat(_this.data.recevie_order_position_obj.province + _this.data.recevie_order_position_obj.city + _this.data.select_district)
      .then(res => {
        prevPage.onload_order(_this.data.recevie_order_position_obj.province, _this.data.recevie_order_position_obj.city, _this.data.select_district, operate_type, '',orderType, res.location.lng, res.location.lat,1);

          wx.navigateBack({
            delta: 1
          })
      })
  }
})