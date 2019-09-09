// pages/team_add/team_add.js
const app = getApp()
const util = require('../../js/util.js')
const md5 =require('../../js/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    team:{
      name:'',
      phone:'',
      idCardNo:'',
      pwd:'',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  nameInput(e) {
    var _this=this
    _this.setData({
      team:{
        ..._this.data.team,
        name:e.detail.value
      }
    })
  },
  phoneInput(e) {
    var _this = this
    _this.setData({
      team: {
        ..._this.data.team,
        phone: e.detail.value
      }
    })
  },
  identInput(e) {
    var _this = this
    _this.setData({
      team: {
        ..._this.data.team,
        idCardNo: e.detail.value
      }
    })
  },
  passInput(e) {
    var _this = this
    _this.setData({
      team: {
        ..._this.data.team,
        pwd: e.detail.value
      }
    })
  },
  team_add_save(){
    
    var _this = this, team = this.data.team
    if (!team.name){
      util.showInfo("请输入服务队名称")
      return;
    }
    if (!team.phone){
      util.showInfo("请输入服务队手机号")
      return;
    }
    if(!util.testPhone(team.phone)){
      util.showInfo("手机号格式错误")
      return
    }

    if (!team.idCardNo){
      util.showInfo("请输入服务队身份证号")
      return;
    }

    if (!util.testId(team.idCardNo)) {
      util.showInfo("身份证号格式错误")
      return
    }

    if (!team.pwd){
      util.showInfo("请输入服务队密码")
      return;
    }
    if (team.pwd.length<6){
      util.showInfo("服务队的密码最少为6位的数字或者字母的组合")
      return;
    }

    console.log(md5.hex_md5(123456)) 
    wx.request({
      url: app.globalData.api_ctx + '/helper/saveGroup.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'),
        name: team.name,
        phone: team.phone,
        idCardNo: team.idCardNo,
        pwd: team.pwd,
        password: md5.hex_md5(team.pwd),
        appToken: wx.getStorageSync('appToken')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.status==1) {
          // 上一张服务队列表界面需要刷新
          var _this = this
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //服务队列表界面
          prevPage.onLoad()
          wx.navigateBack({
            delta:1
          })
        }else{
          util.showInfo(res.data.msg)
        }
      }
    })
  },
  back_page(){
    wx.navigateBack({
      delta:1
    })
  }
})