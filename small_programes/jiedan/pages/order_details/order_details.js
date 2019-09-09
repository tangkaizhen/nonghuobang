// pages/order_details/order_details.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    res_ctx: app.globalData.res_ctx,
    map_lng_lat:{
      longitude:120.30,
      latitude: 31.57
    },
    cancel_obj:{
      cancal_slect0:{
        val:'与其他订单时间冲突',
        img:'/images/icon_radio_s.png'
      },
      cancal_slect1:{
        val:'临时有事',
        img:'/images/icon_radio_n.png'
      },
      cancal_slect2:{
        val:'不符合订单要求',
        img:'/images/icon_radio_n.png'
      },
      cancal_slect3:{
        val:'其他',
        img:'/images/icon_radio_n.png'
      }
    },
    order:{},
    cancel_reason:'与其他订单时间冲突',
    // 这是拒绝和取消订单公用一个弹窗，需要将标题的文字改变
    cancel_refuse_box_header:'拒绝',
    helper_type: wx.getStorageSync('helper_type'),
    markers:[],
    change_values:{
      price:0,
      area:0,
      helperNum :0,
      jobDays :0,
    },
    change_total_price:0,
    ifHidden_outter_box:true,
    // 子帮手
    ifHidden_child_box: true,
    // 取消框
    ifHidden_helper_cancel_box: true,
    // 取消订单或者拒绝订单弹窗
    ifHidden_cancel_box: true,
    // 取消订单或者拒绝订单弹窗中的输入框
    ifHidden_cancel_write_box: true,

    ifHideShade: true,
    // 订单打电话和取消订单的弹窗
    ifHidden_order_tel_cancel:true,
    // 订单打电话和取消订单的弹窗中的取消框
    ifHidden_order_cancel:true,
    // 修改订单框
    ifHidden_change_box:true,
    // 实测弹框
    ifHidden_actual_box:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.load_order_details()
  },
  // 加载订单详情状态
  load_order_details(){
    var _this = this;
    // 开始加载数据
    util.showloading("加载中")

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
        console.log(res)
        if (res.data.data) {
          // 在地图上加上marker
          _this.setData({
            order: res.data.data.order,
            change_total_price: res.data.data.order.jobType == '人工' ? (1 * res.data.data.order.price * res.data.data.order.helperNum * res.data.data.order.jobDays) : (1 * res.data.data.order.price * res.data.data.order.area),
            change_values:{
              price: res.data.data.order.price,
              area: res.data.data.order.area,
              helperNum: res.data.data.order.helperNum,
              jobDays: res.data.data.order.jobDays,
            },
            ifHidden_outter_box:false,
            markers: [{
              iconPath: '/images/icon_location.png',
              id: 0,
              latitude: res.data.data.order.latitude,
              longitude: res.data.data.order.longitude,
              width: 15,
              height: 20
            }]
          })

          // 首先要判断是否显示取消订单的按钮
          var order = res.data.data.order
          var helper_type = wx.getStorageSync('helper_type')

          /* 判断右上角是否显示取消订单按钮 */
          if ((order.state == 2 || order.state == 8) &&
            (helper_type == 1
              || (helper_type == 2 && order.assignFlag == 0)
              || (helper_type == 3 && order.assignFlag == 2)
            )) {
            /* 只有在订单为待作业或者作业中才显示取消订单按钮 */
            _this.setData({
              ifHidden_order_cancel: false
            })
          }

          // 只有是非人工时候，出现实测状态
          // if (order.jobType!='非人工'){
          //   wx.request({
          //     url: app.globalData.api_ctx + '/helper/getActualArea.json', // 仅为示例，并非真实的接口地址
          //     data: {
          //       id: wx.getStorageSync('helper_id'),
          //       orderId: wx.getStorageSync('id'),
          //       appToken: wx.getStorageSync('appToken')
          //     },
          //     header: wx.getStorageSync('header'),
          //     success(res) {
          //       console.log(res)
          //       if (res.data.status == 1) {
                  
          //       }
          //     }
          //   })

          // }
        }

      }
    })
    
  },
  // icon_dian(){
  //   var _this=this;
  //   _this.setData({
  //     ifHidden_order_tel_cancel: !_this.data.ifHidden_order_tel_cancel,
  //   })
  // },
  to_peifang(e){
    var id = e.currentTarget.dataset.peifangid
    if (id){
      // 查看配方
      wx.navigateTo({
        url: '/pages/medicine_details/medicine_details'
      })
      wx.setStorageSync("formulationid", id)
    }else{
      // 绑定配方
      wx.navigateTo({
        url: '/pages/medicine_list/medicine_list'
      })
    }
  },
  makePhoneCall(){
    var _this = this
    _this.setData({
      ifHidden_order_tel_cancel: true,
    })
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('initData').customerService //仅为示例，并非真实的电话号码
    })

  },

  // 这是点击顶部的电话和取消订单框中的取消订单按钮
  order_cancel_box(){
    var _this=this

    _this.setData({
      cancel_refuse_box_header: '取消',
      ifHidden_cancel_box:false,
      ifHidden_order_tel_cancel:true,
      ifHideShade:false
    })


  },
  back_page(){
    wx.navigateBack({
      delta: 1
    })
  },

  bind_cancel_reason(e){
    this.setData({
      cancel_reason: e.detail.value
    })
  },
  // 子帮手拒绝接单
  child_refuse_order(e) {
    var _this = this
    var id = e.currentTarget.dataset.id
    this.orderRefuseId = id
    _this.setData({
      ifHidden_cancel_box: false,
      ifHideShade: false
    })
  },
  child_confirm_order(e) {
    // 这是点击了确认接单
    var _this = this
    var orderId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认接单',
      content: '您确认接该订单吗?',
      confirmColor: '#6cd986',
      success(res) {
        if (res.confirm) {
          util.showloading("加载中")
          wx.request({
            url: app.globalData.api_ctx + '/helper/acceptOrder.json', // 仅为示例，并非真实的接口地址
            data: {
              id: wx.getStorageSync('helper_id'),
              orderId
            },
            header: wx.getStorageSync('header'),
            success(res) {
              console.log(res)
              if (res.data.status == 1) {
                util.hideloading()
                // 表示接单成功
                // 重新加载订单
                _this.onLoad()
              }
            }
          })
        } else if (res.cancel) {
          // 这时候点击了取消按钮
        }
      }
    })
  },

  cancel_btn_cancel(){
    var _this=this
    // 首先查看是不是选择其他的取消理由
    if (!_this.data.ifHidden_cancel_write_box){
      if (!_this.data.cancel_reason){
        util.showInfo("请输入取消订单理由")
        return
       }
    }

    wx.showModal({
      title: '取消订单',
      content: '确定要取消订单吗？',
      confirmColor: '#0095ff',
      success(res) {
        if (res.confirm) {

          wx.request({
            url: app.globalData.api_ctx + '/helper/cancelOrder.json', // 仅为示例，并非真实的接口地址
            data: {
              appToken: wx.getStorageSync('appToken'),
              id: wx.getStorageSync('helper_id'),
              orderId: wx.getStorageSync('id'),
              reason: _this.data.cancel_reason
            },
            header: wx.getStorageSync('header'),
            success(res) {
              console.log(res)
              if (res.data.status==1) {

                wx.showToast({
                  title: '订单取消成功',
                  icon: 'success',
                  duration: 1000,
                  success(){
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })

              }
            }
          })

        } else if (res.cancel) {
          _this.cancel_btn_again()
        }
      } 
    })

  },
  cantact_farmer(e){
    var _this=this
    var phoneNumber = e.currentTarget.dataset.phone
    wx.showModal({
      title: '联系农户',
      content: '拨打农户电话',
      confirmColor: '#6cd986',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber
          })
        }else{

        }
      }
    })
  },
  // 这是作业中出现的按钮情况
  complete_work(e) {
    var _this = this
    var orderId = e.currentTarget.dataset.id
    wx.showModal({
      title: '完成',
      content: '您确认完成订单吗?',
      confirmColor: '#6cd986',
      success(res) {
        if (res.confirm) {
          util.showloading("请稍等")
          wx.request({
            url: app.globalData.api_ctx + '/helper/finishOrder.json', // 仅为示例，并非真实的接口地址
            data: {
              id: wx.getStorageSync('helper_id'),
              orderId
            },
            header: wx.getStorageSync('header'),
            success(res) {
              console.log(res)
              if (res.data.status == 1) {
                util.hideloading()
                // 重新加载订单

                var order = _this.data.order
                order.state=3
                _this.setData({
                  order
                })

                // 同时还要改变外面对应订单列表的状态
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];  //首页
                // 直接在prevPage的orders里面将该order去除(wx.getStorageSync('id'))
                prevPage.reload()  
              }
            }
          })
        } else if (res.cancel) {
          // 这时候点击了取消按钮
        }
      }
    })
  },
  
  cancel_btn_again(){
    var _this=this
    _this.setData({
      cancel_reason:'与其他订单时间冲突',
      ifHidden_cancel_box:true,
      ifHideShade:true,
      ifHidden_cancel_write_box:true,
      ifHidden_cancel_write_box:true,
      cancel_obj: {
        cancal_slect0: {
          ..._this.data.cancel_obj.cancal_slect0,
          img:'/images/icon_radio_s.png'
        },
        cancal_slect1: {
          ..._this.data.cancel_obj.cancal_slect1,
          img:'/images/icon_radio_n.png'
        },
        cancal_slect2: {
          ..._this.data.cancel_obj.cancal_slect2,
          img:'/images/icon_radio_n.png'
        },
        cancal_slect3: {
          ..._this.data.cancel_obj.cancal_slect3,
          img:'/images/icon_radio_n.png'
        }
      }

    })
  },
  // 这是点击在申请状态时候，点击取消申请时候出现
  cancelGrabbing(){
    console.log("进")
    wx.showModal({
      title: '取消申请',
      content: '确认要取消申请吗？',
      confirmColor: '#6cd986',
      success(res) {
        if (res.confirm) {

          wx.request({
            url: app.globalData.api_ctx + '/helper/cancelGrabbing.json', // 仅为示例，并非真实的接口地址
            data: {
              appToken: wx.getStorageSync('appToken'),
              id: wx.getStorageSync('helper_id'),
              orderId: wx.getStorageSync('id')
            },
            header: wx.getStorageSync('header'),
            success(res) {
              console.log(res)
              if (res.data.status==1) {
                wx.showToast({
                  title: '取消申请成功',
                  icon: 'success',
                  duration: 1000,
                  success() {

                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2];  //首页
                    // 直接在prevPage的orders里面将该order去除(wx.getStorageSync('id'))
                    let filterOrders=prevPage.data.orders.filter(order=>{
                      return order.id != wx.getStorageSync('id')
                    })
                    prevPage.setData({
                      orders: filterOrders
                    })
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              }
            }
          })

        } else if (res.cancel) {
          
        }
      },
      fail(res){
        console.log("fail")
      },
      complete(res){
        console.log("complete")
      }
    })
  },
  farmer_details(){
    wx.navigateTo({
      url: '/pages/famer_details/famer_details'
    })

    wx.setStorageSync('farmerId',this.data.order.farmer.id);
  },

// 这是待确认时候的状态
  refuse_receive_order(e) {
    var _this = this
    var id = e.currentTarget.dataset.id
    _this.setData({
      cancel_refuse_box_header:'拒绝',
      ifHidden_cancel_box: false,
      ifHideShade: false
    })
  },
  cancel_select(e) {
    var _this = this
    var id = e.currentTarget.dataset.id;

    _this.setData({
      cancel_obj: {
        cancal_slect0: {
          ..._this.data.cancel_obj.cancal_slect0,
          img: id == 0 ? '/images/icon_radio_s.png' : '/images/icon_radio_n.png',
        },
        cancal_slect1: {
          ..._this.data.cancel_obj.cancal_slect1,
          img: id == 1 ? '/images/icon_radio_s.png' : '/images/icon_radio_n.png'
        },
        cancal_slect2: {
          ..._this.data.cancel_obj.cancal_slect2,
          img: id == 2 ? '/images/icon_radio_s.png' : '/images/icon_radio_n.png'
        },
        cancal_slect3: {
          ..._this.data.cancel_obj.cancal_slect3,
          img: id == 3 ? '/images/icon_radio_s.png' : '/images/icon_radio_n.png'
        }
      },
      ifHidden_cancel_write_box: id == 3 ? false : true
    })

    if (id == 0) {
      _this.setData({
        cancel_reason: _this.data.cancel_obj.cancal_slect0.val
      })
    } else if (id == 1) {
      _this.setData({
        cancel_reason: _this.data.cancel_obj.cancal_slect1.val
      })
    } else if (id == 2) {
      _this.setData({
        cancel_reason: _this.data.cancel_obj.cancal_slect2.val
      })
    } else if (id == 3) {
      _this.setData({
        cancel_reason: ''
      })
    }
  },

  cancel_btn_again() {
    var _this = this
    // 恢复到最初设置
    _this.reset_refuse_cancel_box()
  },
  // 拒绝或者取消出现弹窗时候，再点击我再想想，需要将弹框的状态重置
  reset_refuse_cancel_box() {
    var _this = this
    // 恢复到最初设置
    _this.setData({
      ifHidden_cancel_box: true,
      ifHideShade: true,
      cancel_reason: '与其他订单时间冲突',
      ifHidden_cancel_write_box: true,
      cancel_obj: {
        cancal_slect0: {
          val: '与其他订单时间冲突',
          img: '/images/icon_radio_s.png'
        },
        cancal_slect1: {
          val: '临时有事',
          img: '/images/icon_radio_n.png'
        },
        cancal_slect2: {
          val: '不符合订单要求',
          img: '/images/icon_radio_n.png'
        },
        cancal_slect3: {
          val: '其他',
          img: '/images/icon_radio_n.png'
        },
      }
    })
  },
  cancel_btn_refuse() {
    var _this = this
    if (_this.data.cancel_refuse_box_header!='取消'){

    wx.showModal({
      title: '拒绝接单',
      content: '您确定拒绝该订单吗?',
      confirmColor: '#6cd986',
      success(res) {
        if (res.confirm) {
          var url=''
          if (_this.data.helper_type == 3 || _this.data.helper_type == '3'){
            url = app.globalData.api_ctx + '/helper/declineOrder.json'
          }else{
            url = app.globalData.api_ctx + '/helper/rejectOrder.json'
          }
          wx.request({
            url, // 仅为示例，并非真实的接口地址
            data: {
              id: wx.getStorageSync('helper_id'),
              orderId: wx.getStorageSync('id'),
              reason: _this.data.cancel_reason
            },
            header: wx.getStorageSync('header'),
            success(res) {
              console.log(res)
              if (res.data.status == 1) {
                // 表示拒绝订单成功
                // 重新加载订单

                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];  //首页
                // 直接在prevPage的orders里面将该order去除(wx.getStorageSync('id'))
                let filterOrders = prevPage.data.orders.filter(order => {
                  return order.id != wx.getStorageSync('id')
                })
                prevPage.setData({
                  orders: filterOrders
                })
                wx.navigateBack({
                  delta: 1
                })

              }else{
                util.showInfo(res.data.msg)
              }
            }
          })
        } else if (res.cancel) {
          // 这时候点击了取消按钮
          _this.reset_refuse_cancel_box()
        }
      },
      fail(err){
        console.log(err)
      },
      complete(res){
        console.log(res)
      }
    })
    }else{
      // 这是点击取消订单时候
      wx.showModal({
        title: '取消接单',
        content: '确定取消该订单吗?',
        confirmColor: '#6cd986',
        success(res) {
          if (res.confirm) {

            wx.request({
              url: app.globalData.api_ctx + '/helper/cancelOrder.json', // 仅为示例，并非真实的接口地址
              data: {
                id: wx.getStorageSync('helper_id'),
                orderId: wx.getStorageSync('id'),
                reason: _this.data.cancel_reason
              },
              header: wx.getStorageSync('header'),
              success(res) {
                console.log(res)
                if (res.data.status == 1) {
                  // 表示取消订单成功
                  var order=_this.data.order
                  order.state=6

                  _this.setData({
                    ifHidden_cancel_box: true,
                    ifHideShade: true,
                    order
                  })
                }
              }
            })
          } else if (res.cancel) {
            // 这时候点击了取消按钮
            _this.reset_refuse_cancel_box()
          }
        }
      })
    }
  },
  confrim_receive_order(e) {
    // 这是点击了确认接单
    var _this = this
    var orderId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认接单',
      content: '您确认接该订单吗?',
      confirmColor: '#6cd986',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.api_ctx + '/helper/confirmOrder.json', // 仅为示例，并非真实的接口地址
            data: {
              id: wx.getStorageSync('helper_id'),
              orderId
            },
            header: wx.getStorageSync('header'),
            success(res) {
              console.log(res)
              if (res.data.status == 1) {
                // 表示接单成功
                // 重新加载订单
                _this.load_order_details()


                // 同时还要改变外面对应订单列表的状态
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];  //首页

                // 直接在prevPage的orders里面将该order去除(wx.getStorageSync('id'))
                prevPage.reload()              
              }
            }
          })
        } else if (res.cancel) {
          // 这时候点击了取消按钮
        }
      }
    })
  },
// 这是待作业时候的按钮
  start_work(e) {

    // 这是点击了确认接单
    var _this = this
    var orderId = e.currentTarget.dataset.id
    util.showloading("加载中")
    wx.request({
      url: app.globalData.api_ctx + '/helper/startWork.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'),
        orderId
      },
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.status == 1) {
          util.hideloading()
          // 重新加载订单
          _this.onLoad()

          // 同时还要改变外面对应订单列表的状态
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //首页

          // 直接在prevPage的orders里面将该order去除(wx.getStorageSync('id'))
          prevPage.reload()  
        }
      }
    })
  },
// 指派订单
  assgin_order(){
    var _this = this
    wx.navigateTo({
      url: '/pages/service_team_list/service_team_list',
    })
  },
// 企业帮手指派后，联系子帮手按钮
  contact_child_helper(e){
    var _this = this
    var phoneNumber = e.currentTarget.dataset.phone
    wx.showModal({
      title: '联系服务队',
      content: '拨打服务队电话？',
      confirmColor: '#6cd986',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber
          })
        }
      }
    })
  },

// 这是开始作业时候状态
  change_box_cancel(){
    var _this = this
    _this.setData({ 
      ifHidden_change_box: true,
      ifHideShade: true,
      change_values: {
        price: _this.data.order.price,
        area: _this.data.order.area,
        helperNum: _this.data.order.helperNum,
        jobDays: _this.data.order.jobDays,
      },
      change_total_price: _this.data.order.jobType == '人工' ? (1 * _this.data.order.price * _this.data.order.helperNum * _this.data.order.jobDays) : (1 * _this.data.order.price * _this.data.order.area)
    })
  },
  change_price(){
    var _this=this
    _this.setData({
      ifHidden_change_box:false,
      ifHideShade:false
    })
  },
  changeInputPrice(e){
    var _this=this
    var price = e.detail.value
    this.setData({
      change_values:{
        ..._this.data.change_values,
        price
      }
    })
    _this.calcu_total_price()
  },
  changeInputArea(e){
    var _this=this
    var area = e.detail.value
    this.setData({
      change_values:{
        ..._this.data.change_values,
        area
      }
    })
    _this.calcu_total_price()
  },
  changeInputHelperNum(e){
    var _this=this
    var helperNum = e.detail.value
    this.setData({
      change_values:{
        ..._this.data.change_values,
        helperNum 
      }
    })
    _this.calcu_total_price()
  },
  changeInputJobDays(e){
    var _this=this
    var jobDays = e.detail.value
    this.setData({
      change_values:{
        ..._this.data.change_values,
        jobDays 
      }
    })
    _this.calcu_total_price()
  },
  calcu_total_price(){
    var _this=this
    var sum=0
    if (_this.data.order.jobType=='人工'){
      sum = 1*_this.data.change_values.price * _this.data.change_values.helperNum * _this.data.change_values.jobDays
    }else{
      sum = 1 * _this.data.change_values.price * _this.data.change_values.area
    }

    _this.setData({
      change_total_price: sum
    })
  },
  // 这是点击修改价格确认修改
  change_box_confirm(e){
    var _this=this
    var id = e.currentTarget.dataset.id
    var data={}
    if (_this.data.order.jobType == '人工'){
      data={
        id: wx.getStorageSync('helper_id'),
        orderId: wx.getStorageSync('id'),
        updatePrice: _this.data.change_values.price,
        updateHelperNum: _this.data.change_values.helperNum,
        updateJobDays: _this.data.change_values.jobDays 
      }
    }else{
      data = {
        id: wx.getStorageSync('helper_id'),
        orderId: wx.getStorageSync('id'),
        updatePrice: _this.data.change_values.price,
        updateArea: _this.data.change_values.area
      }
    }

    wx.request({
      url: app.globalData.api_ctx + '/helper/updateOrder.json', // 仅为示例，并非真实的接口地址
      data,
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.status == 1) {
          util.showInfo("修改成功")
          // 重新加载订单
          _this.onLoad()
          _this.change_box_cancel()
        }else{
          util.showInfo("修改失败")
        }
      }
    })

  },
  //点击实测弹窗
  measure_btn_record(){
    var _this=this
    _this.setData({
      ifHidden_actual_box:false,
      ifHideShade:false
    })
  },
  // 点击立即评价
  immediate_evaluate(e){
    var _this = this
    var orderId = e.currentTarget.dataset.id
    wx.setStorageSync('id', orderId); //保存Cookie到Storage
    wx.navigateTo({
      url: '/pages/evaluate/evaluate'
    })
  },
  actual_box_btn_cancel(){
    var _this = this
    _this.setData({
      ifHidden_actual_box: true,
      ifHideShade: true
    })
  },
  actual_box_btn_confirm(){
    var _this = this
    _this.setData({
      ifHidden_actual_box: true,
      ifHideShade: true
    })
  }
})