// pages/order_details/order_details.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    star:{
      star0:'/images/icon_star_grey.png',
      star1:'/images/icon_star_grey.png',
      star2:'/images/icon_star_grey.png',
      star3:'/images/icon_star_grey.png',
      star4:'/images/icon_star_grey.png'
    },
    tag:{
      tag0:{
        txt:'态度好',
        ifEvaluate: false
      },
      tag1:{
        txt:'热情',
        ifEvaluate: false
      },
      tag2:{
        txt:'赞',
        ifEvaluate: false
      }
    },
    order: {},
    farmerId:'',
    imagesPath:[],
    uploadImagesPath:[],
    evaluate_txt:'',
    initData: wx.getStorageSync('initData'),
    ifHidden_outter_box: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
    // 加载订单详情
    wx.request({
      url: app.globalData.api_ctx + '/helper/getOrderDetails.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'),
        orderId: wx.getStorageSync('id'),
        appToken: wx.getStorageSync('appToken')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        
        util.hideloading()
        if (res.data.data) {
          // 在地图上加上marker
          _this.setData({
            order: res.data.data.order,
            ifHidden_outter_box: false,
            farmerId: res.data.data.order.farmer.id
          })
          
        }

      }
    })
  },
  back_page() {
    wx.navigateBack({
      delta: 1
    })
  },
  evaluate_start(e){

    var _this=this
    var id=e.currentTarget.dataset.id
    
    _this.setData({
      star: {
        star0: id >= 0 ? '/images/icon_star_yellow.png' : '/images/icon_star_grey.png',
        star1: id >= 1 ? '/images/icon_star_yellow.png' : '/images/icon_star_grey.png',
        star2: id >= 2 ? '/images/icon_star_yellow.png' : '/images/icon_star_grey.png',
        star3: id >= 3 ? '/images/icon_star_yellow.png' : '/images/icon_star_grey.png',
        star4: id >= 4 ? '/images/icon_star_yellow.png' : '/images/icon_star_grey.png',
      }
    })
  },
  
  evaluate_tag(e){
    var _this = this
    var id = e.currentTarget.dataset.id
    
      _this.setData({
        tag: {
          tag0: 
          {
            ..._this.data.tag.tag0,
            ifEvaluate: id == 0 ? !_this.data.tag.tag0.ifEvaluate : _this.data.tag.tag0.ifEvaluate
          },
          tag1: 
          {
            ..._this.data.tag.tag1,
            ifEvaluate: id == 1 ? !_this.data.tag.tag1.ifEvaluate : _this.data.tag.tag1.ifEvaluate
          },
          tag2: 
          {
            ..._this.data.tag.tag2,
            ifEvaluate: id == 2 ? !_this.data.tag.tag2.ifEvaluate : _this.data.tag.tag2.ifEvaluate
          }
        }
      })
  },
  evaluate_txt(e){
    this.setData({
      evaluate_txt: e.detail.value
    })
  },
  evaluate_btn(){
    // 首先检查信息的有效性
    var _this = this, star = 0, content = '', remarkKeys=''

    // 这是评星
    if (_this.data.star.star0 =='/images/icon_star_grey.png'){
      util.showInfo("请选择服务评星")
      return
    } else {
      // 这是表示已经点击评星，此时需要计算评星的多少
      if (_this.data.star.star4 == '/images/icon_star_yellow.png') {
        star = 5
      } else if (_this.data.star.star3 == '/images/icon_star_yellow.png'){
        star = 4
      } else if (_this.data.star.star2 == '/images/icon_star_yellow.png') {
        star = 3
      } else if (_this.data.star.star1 == '/images/icon_star_yellow.png') {
        star = 2
      } else if (_this.data.star.star0 == '/images/icon_star_yellow.png') {
        star = 1
      } 
    }

    //这是评价内容 
    if (!_this.data.evaluate_txt){
      util.showInfo("请输入服务评价内容")
      return
    }else{
      content = _this.data.evaluate_txt
    }

    // 看看是否有评价标签
    if(_this.data.tag.tag0.ifEvaluate){
      remarkKeys += _this.data.tag.tag0.txt+'-'
    }
    if(_this.data.tag.tag1.ifEvaluate){
      remarkKeys += _this.data.tag.tag1.txt+'-'
    }
    if(_this.data.tag.tag2.ifEvaluate){
      remarkKeys += _this.data.tag.tag2.txt + '-'
    }
    
    if (remarkKeys){
      remarkKeys = remarkKeys.substring(0, remarkKeys.length-1)
    }

    wx.request({
      url: app.globalData.api_ctx + '/helper/saveRemark.json', 
      data: {
        fromId: wx.getStorageSync('helper_id'),
        orderId: wx.getStorageSync('id'),
        toId:_this.data.farmerId,
        star,
        content,
        remarkKeys,
        remarkPic1: _this.data.uploadImagesPath[0] != undefined && _this.data.uploadImagesPath[0] != 'undefined' ? _this.data.uploadImagesPath[0]:'', 
        remarkPic2: _this.data.uploadImagesPath[1] != undefined && _this.data.uploadImagesPath[1] != 'undefined' ? _this.data.uploadImagesPath[1] : '', 
        remarkPic3: _this.data.uploadImagesPath[2] != undefined && _this.data.uploadImagesPath[2] != 'undefined' ? _this.data.uploadImagesPath[2] : ''
      }, 
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.status == 1) {
          util.hideloading()
          // 表示接单成功
          // 重新加载订单
          wx.navigateTo({
            url: '/pages/evaluate_success/evaluate_success',
          })
        }else{
          util.showInfo(res.data.msg)
          util.hideloading()
        }
      }
    })
    


  },
  chooseImage(e){
    var index = e.currentTarget.dataset.index
    var _this=this

    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        if (index || index == 0 || index == '0'){
          var imagesPath = _this.data.imagesPath
          var uploadImagesPath = _this.data.uploadImagesPath
          imagesPath[index] = res.tempFilePaths[0]
          

          util.uploadImage(5, res.tempFilePaths[0]).then(data => {
            uploadImagesPath[index] = data

            _this.setData({
              imagesPath,
              uploadImagesPath
            })
          })
        }else{
          util.uploadImage(5, res.tempFilePaths[0]).then(data=>{
            _this.setData({
              imagesPath: [..._this.data.imagesPath, ...res.tempFilePaths],
              uploadImagesPath: [..._this.data.uploadImagesPath, data]
            })
          })
        }

      }
    })

  }
})