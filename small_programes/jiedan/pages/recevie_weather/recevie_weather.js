// pages/recevie_weather/recevie_weather.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weather:{},
    weather_img:'',
    weather_box:true,
    weather_box_bg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    var weather = JSON.parse(options.weather)
    _this.setData({
      weather,
      weather_img: _this.weatherImgPath1(weather.img),
      weather_box:false
    })
    _this.set_home_bg(weather.img)
  },
  
  weatherImgPath1(img){
    if (img == "") {
      return ""
    } else {
      return "/images/weather_icon/w_" + parseInt(img) + "_white.png";
    }
  },
  set_home_bg(number) {
    
    var num = 1 * number;
    var img_src=''
    /* 注意要根据不同的天气给界面以不同的背景 */
    if (num == 0 || num == "") {
      img_src ='/miniapp/images/weather_bg/bg_weather_sunny.png'
    } else if (num == 1) {
      img_src = '/miniapp/images/weather_bg/bg_weather_cloudy.png'
    } else if (num == 2) {
      img_src = '/miniapp/images/weather_bg/bg_weather_overcast.png'
    } else if (num == 301 || num == 25 || num == 21 || num == 22 || num == 23 || num == 24 || num == 19 || num == 3 || num == 6 || num == 7 || num == 8 || num == 9 || num == 10 || num == 11 || num == 12) {
      img_src = '/miniapp/images/weather_bg/bg_weather_rainy.png'
    } else if (num == 4 || num == 5) {
      img_src = '/miniapp/images/weather_bg/bg_weather_thunder.png'
    } else if (num == 302 || num == 26 || num == 27 || num == 28 || num == 13 || num == 14 || num == 15 || num == 16 || num == 17) {
      img_src = '/miniapp/images/weather_bg/bg_weather_snow.png'
    } else if (num == 18 || num == 32 || num == 49 || num == 53 || num == 54 || num == 55 || num == 56 || num == 57 || num == 58) {
      img_src = '/miniapp/images/weather_bg/bg_weather_forg.png'
    } else if (num == 20 || num == 31) {
      img_src = '/miniapp/images/weather_bg/bg_weather_sandstorm.png'
    } else if (num == 29 || num == 30) {
      img_src = '/miniapp/images/weather_bg/bg_weather_sand.png'
    }

    this.setData({
      weather_box_bg: app.globalData.img_ctx + img_src
    })
  },
  back_page(){
    wx.navigateBack({
      delta: 1
    })
  }
})