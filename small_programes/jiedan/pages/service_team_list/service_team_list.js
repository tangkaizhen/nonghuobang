// pages/service_team_list/service_team_list.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    res_ctx: app.globalData.res_ctx,
    groups:[],
    keyword:'',
    pageNum: 1,
    // 这个主要是判断没有group时候，就不要出现加载中的弹框了
    hasGroup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // 开始加载数据
    util.showloading("加载中")

    _this.onload_teams('', 1)
  },
  onload_teams(keyword, pageNum){
    var _this = this;
    // 开始加载数据
    util.showloading("加载中")

    wx.request({
      url: app.globalData.api_ctx + '/helper/myGroups.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'),
        keyword,
        pageNum,
        appToken: wx.getStorageSync('appToken')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        util.hideloading()
        console.log(res)
        if (res.data.data) {                                        
          if (res.data.data.groups.length>0){
            _this.setData({
              groups: [..._this.data.groups,...res.data.data.groups],
              hasGroup: true
            })

            if (res.data.data.groups.length < 10) {
              _this.setData({
                hasGroup: false
              })
            }

          }else{
            // 这时候表示没有了
            _this.setData({
              hasGroup: false
            })
          }
        }

      }
    })
  },
  assign_team(e){
    var _this=this
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '分配订单',
      content: '确定要分配给这个服务队吗？',
      confirmColor: '#0095ff',
      success(res) {
        if (res.confirm) {

          wx.request({
            url: app.globalData.api_ctx + '/helper/assign.json', // 仅为示例，并非真实的接口地址
            data: {
              appToken: wx.getStorageSync('appToken'),
              id: wx.getStorageSync('helper_id'),
              orderId: wx.getStorageSync('id'),
              helperId: id
            },
            header: wx.getStorageSync('header'),
            success(res) {
              console.log(res)
              if (res.data.status == 1) {
                
                
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];  //上一页
                if (prevPage.route == "pages/home/home"){
                  prevPage.setData({
                    pageNum: 1,
                    keyword: '',
                    orders: []
                  })
                  var order_type_num = prevPage.order_type_word_to_num()
                  prevPage.onload_orders(order_type_num, prevPage.data.keyword, prevPage.data.isHidden, prevPage.data.isAssigned, prevPage.data.pageNum);
                  

                }else{
                  prevPage.onLoad()
                }
                wx.navigateBack({
                  delta:1
                })
              }else{
                util.showInfo(res.data.msg)
              }
            }
          })

        } else if (res.cancel) {
          _this.cancel_btn_again()
        }
      }
    })
  },
  onReachBottom(){
    var _this=this
    if(_this.data.hasGroup){
      util.showloading("加载中")
      _this.setData({
        pageNum: _this.data.pageNum + 1
      })

      _this.onload_teams(_this.data.keyword, _this.data.pageNum)
    }
  },
  back_page(){
    wx.navigateBack({
      delta:1
    })
  },
  team_add(){
    wx.navigateTo({
      url: '/pages/team_add/team_add',
    })
  },
  to_search(){
    wx.navigateTo({
      url: '/pages/team_search/team_search',
    })
  }
})