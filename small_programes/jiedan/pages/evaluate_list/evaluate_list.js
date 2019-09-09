// pages/evaluate_list/evaluate_list.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    res_ctx: app.globalData.res_ctx,
    remarks:[],
    evaluate_type_index:{
      evaluate_type0:true,
      evaluate_type1:false,
      evaluate_type2: false,
      evaluate_type3: false
    },
    type:0,
    pageNum:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
    this.getFarmerRate(_this.data.type, _this.data.pageNum)
  },
  getFarmerRate(type, pageNum){
    var _this = this
    wx.request({
      url: app.globalData.api_ctx + '/helper/getFarmerRate.json', // 仅为示例，并非真实的接口地址
      data: {
        appToken: wx.getStorageSync('appToken'),
        id: wx.getStorageSync('helper_id'),
        farmerId: wx.getStorageSync('farmerId'),
        type: type,
        pageNum: pageNum
      },
      header: wx.getStorageSync('header'),
      success(res) {
        util.hideloading()
        console.log(res)
        if (res.data.status == 1) {
          if (res.data.data.remarks.length>0){
            _this.setData({
              pageNum: ++_this.data.pageNum
            })
            _this.setData({
              remarks: [..._this.data.remarks, ...res.data.data.remarks]
            })
          }
        }
      }
    })
  },
  onReachBottom(){
    util.showloading("加载中")
    var _this=this
    
    this.getFarmerRate(_this.data.type, _this.data.pageNum)
  },
  evaluate_type(e){
    var _this=this
    var index=e.currentTarget.dataset.index
    _this.setData({
      ..._this.data.evaluate_type_index,
      evaluate_type_index:{
        evaluate_type0: index==0?true:false,
        evaluate_type1: index==1?true:false,
        evaluate_type2: index==2?true:false,
        evaluate_type3: index==3?true:false,
      },
      pageNum:1,
      remarks:[]
    })

    if(index==0){
      _this.setData({
        type:0
      })
    } else if (index == 1){
      _this.setData({
        type:3
      })

    } else if (index == 2) {
      _this.setData({
        type:2
      })

    } else if (index == 3) {
      _this.setData({
        type:1
      })

    }

    this.getFarmerRate(_this.data.type, _this.data.pageNum)
  },
  back_page() {
    wx.navigateBack({
      delta: 1
    })
  }
})