// pages/home_location/home_location.js
const app = getApp()
const util = require('../../js/util.js')
const pinyin = require('../../js/pinyin.js')
const LAreaData = require('../../js/LAreaData.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: 'inToViewhistory',
    more_city: ['当前', '历史', '热门', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    cityData: [],
    hotCities: wx.getStorageSync('initData').hotCities,
    recevie_order_position_obj: {},
    history: [],
    auto_location_txt: '自动定位'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    this.setData({
      recevie_order_position_obj: JSON.parse(options.recevie_order_position_obj)
    })

    if (wx.getStorageSync('recevie_order_city')) {
      let old_value = wx.getStorageSync('recevie_order_city');
      let old_value_arr = old_value.split("-");
      _this.setData({
        history: old_value_arr
      })
    }

    util.showloading("城市加载中")
    var all_city = []
    for (var i = 0; i < LAreaData.LAreaData.length; i++) {
      for (var j = 0; j < LAreaData.LAreaData[i].child.length; j++) {
        /* 这时候需要对所有的城市名首字进行汉语拼音判断 */
        var city_name = LAreaData.LAreaData[i].child[j].name;
        /* 取第一个汉字 */
        city_name = city_name.substring(0, 1);
        /* 取第一个字母 */
        var letter = pinyin.pinyin.getCamelChars(city_name);
        LAreaData.LAreaData[i].child[j].letter = letter
        LAreaData.LAreaData[i].child[j].pro = LAreaData.LAreaData[i].name
        all_city.push(LAreaData.LAreaData[i].child[j])
      }
    }

    this.setData({
      cityData: all_city,
    })

    util.hideloading()
  },
  auto_location() {
    var _this = this
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //首页
    _this.setData({
      auto_location_txt: '定位中...'
    })
    prevPage.setData({
      pageNum: 1,
      orders: []
    })

    prevPage.fn_auto_location()
    wx.navigateBack({
      delta: 1
    })
  },
  // 这是点击热门城市
  select_city(event) {
    var city = event.currentTarget.dataset.city
    // 存入历史城市中
    util.set_history_cookie('recevie_order_city', city)

    wx.navigateTo({
      url: '/pages/person_info_location_write/person_info_location_write?city=' + city
    })
  },
  // 点击右侧的字母，跳转到对应的字母地方
  scrollToViewFn(e) {
    var id = e.currentTarget.dataset.id
    if (id == '当前' || id == '历史') {
      this.setData({
        toView: 'inToViewhistory'
      })
    } else if (id == '热门') {
      this.setData({
        toView: 'inToViewhot'
      })
    } else {
      this.setData({
        toView: 'inToView' + id
      })
    }
  },
  // 跳转到地址填写界面
  to_write() {
    wx.navigateTo({
      url: '/pages/person_info_location_write/person_info_location_write'
    })
  },
  // 回退
  close_btn() {
    wx.navigateBack({
      delta: 1
    })
  }
})



