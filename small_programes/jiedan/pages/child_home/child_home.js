// pages/home/home.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    isHideFil:true,
    order_type_select:{
      order_type0:true,
      order_type3: false,
      order_type4: false,
      order_type5: false,
      order_type6: false,
      order_type7: false,
      order_type8: false
    },
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
    },
    order_cancel_select_img:false,
    search_filtrate_txt:'全部订单',
    select_search_filtrate_txt:'全部订单',
    header:{},
    pageNum:1,
    keyword:'',
    isHidden:false,
    isAssigned:false,
    orders:[],
    // 这个主要是判断没有order时候，就不要出现加载中的弹框了
    hasOrder: false,
    res_ctx: app.globalData.res_ctx,
    ifHideShade:true,
    ifHidden_cancel_write_box:true,
    ifHidden_cancel_box:true,
    hide_order_box:true,
    cancel_reason:'与其他订单时间冲突',
    helper_type: wx.getStorageSync('helper_type')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 开始加载数据
    util.showloading("订单加载中")
    var _this = this;

    wx.setStorageSync('header', {
      'Content-Type': 'application/x-www-form-urlencoded',
      'cookie': wx.getStorageSync('cookieKey')
    });
    
    var order_type_num=_this.order_type_word_to_num()
    //  获取初始化数据
    _this.onload_orders(order_type_num,_this.data.keyword,_this.data.isHidden,_this.data.isAssigned,_this.data.pageNum);

    // 获取一些初始化数据
    wx.request({
      url: app.globalData.api_ctx + '/helper/initData.json', 
      data: {
        appToken: wx.getStorageSync('appToken'),
        type: wx.getStorageSync('helper_type')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.data) {
          wx.setStorageSync('initData', res.data.data);
        }

      }
    })

  },
  // 订单类型文字转成订单类型数字
  order_type_word_to_num(){
    var _this=this
    var order_type = _this.data.search_filtrate_txt
    var order_type_num = 0
    if (order_type == '' || order_type == '全部订单') {
      order_type_num = 0
    } else if (order_type == '待作业') {
      order_type_num = 3
    } else if (order_type == '待结算') {
      order_type_num = 4
    } else if (order_type == '待评价') {
      order_type_num = 5
    } else if (order_type == '已完成') {
      order_type_num = 6
    } else if (order_type == '未通过') {
      order_type_num = 7
    } else if (order_type == '已取消') {
      order_type_num = 8
    } else if (order_type == '作业中') {
      order_type_num = 9
    }

    return order_type_num
  },
  onload_orders(type, keyword, isHidden, isAssigned,pageNum){
    var _this = this;
    wx.request({
      url: app.globalData.api_ctx + '/helper/myOrders.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'), 
        type: type, 
        keyword: keyword, 
        isHidden: isHidden, 
        isAssigned: isAssigned, 
        pageNum: pageNum,
        appToken: wx.getStorageSync('appToken')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        util.hideloading()
        console.log(res)
        if (res.data.data) {
          var order_arr = res.data.data.orders;
          if (order_arr.length>0){

            _this.setData({
              orders: [..._this.data.orders, ...order_arr],
              hide_order_box: false,
              hasOrder: true
            })
            
            if (order_arr.length < 10) {
              _this.setData({
                hasOrder: false
              })
            }

          }else{
            // 这时候表示没有了
            _this.setData({
              hasOrder: false
            })
          }
          
        }
      }
    })
  },
  toggle_filtrate_box() {

    var _this = this;
    _this.setData({
      isHideFil: !_this.data.isHideFil,
      ifHideShade: !_this.data.ifHideShade
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasOrder) {
      util.showloading("订单加载中")
      var _this=this
      _this.setData({
        pageNum: this.data.pageNum+1
      })

      var order_type_num = _this.order_type_word_to_num()
      _this.onload_orders(order_type_num, _this.data.keyword, _this.data.isHidden, _this.data.isAssigned, _this.data.pageNum);
    }
  },
  to_search() {
    wx.navigateTo({
      url: '/pages/home_order_search/home_order_search'
    })
  },
  order_list(e){
    let _this=this
    console.log(e)

    var order_type = e.currentTarget.dataset.val
    var order_index = e.currentTarget.dataset.index
    _this.setData({
      order_type_select: {
        order_type0: (order_index == 0?true:false),
        order_type3: (order_index == 3 ? true : false),
        order_type4: (order_index == 4 ? true : false),
        order_type5: (order_index == 5 ? true : false),
        order_type6: (order_index == 6 ? true : false),
        order_type7: (order_index == 7 ? true : false),
        order_type8: (order_index == 8 ? true : false)
      },
      select_search_filtrate_txt: order_type
    })

    if (order_index==8){
      _this.setData({
        order_cancel_select_img:false
      })
    }
  },
  order_cancel_box(){
    let _this=this;
    _this.setData({
      order_cancel_select_img: !_this.data.order_cancel_select_img,
      
    })

  },
  order_btn_cancel(){
    this.filtrate_reset()
  },
  // 重新设置筛选条件归零
  filtrate_reset(){
    let _this = this;
    _this.setData({
      isHideFil: true,
      ifHideShade: true,
      select_search_filtrate_txt: '全部订单',
      order_cancel_select_img: false,
      order_type_select: {
        order_type0: true,
        order_type3: false,
        order_type4: false,
        order_type5: false,
        order_type6: false,
        order_type7: false,
        order_type8: false
      }
    })
  },
  // 筛选订单
  order_btn_confirm(){
    let _this = this;
    util.showloading("订单加载中")
    _this.setData({
      isHideFil: true,
      search_filtrate_txt:_this.data.select_search_filtrate_txt,
      ifHideShade: true,
      pageNum: 1,
      keyword: '',
      isHidden: _this.data.order_cancel_select_img,
      orders:[]
    })

    _this.filtrate_reset()
    var order_type_num = _this.order_type_word_to_num()
    _this.onload_orders(order_type_num, _this.data.keyword, _this.data.isHidden, _this.data.isAssigned, _this.data.pageNum);

  },
  // 前往订单详情页
  to_order_detail(e){
    var id = e.currentTarget.dataset.id
    wx.setStorageSync('id', id); //保存Cookie到Storage
    wx.navigateTo({
      url: '/pages/order_details/order_details'
    })
  },

  // 下面就是各种订单状态的一些按钮
  // 首先是子帮手是不是要接单
  // 子帮手拒绝接单
  child_refuse_order(e){
    var _this = this
    var id = e.currentTarget.dataset.id
    this.orderRefuseId = id
    _this.setData({
      ifHidden_cancel_box: false,
      ifHideShade: false
    })
  },
  child_confirm_order(e){
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
                _this.reload()
              }
            }
          })
        } else if (res.cancel) {
          // 这时候点击了取消按钮
        }
      }
    })
  },
  bind_cancel_reason(e) {
    this.setData({
      cancel_reason: e.detail.value
    })
  },
  cancel_btn_again(){
    var _this = this
    // 恢复到最初设置
    _this.reset_refuse_cancel_box()
  },
  // 拒绝或者取消出现弹窗时候，再点击我再想想，需要将弹框的状态重置
  reset_refuse_cancel_box(){
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
  cancel_btn_refuse(){
    var _this = this
    var orderRefuseId = this.orderRefuseId
    wx.showModal({
      title: '拒绝接单',
      content: '您确定拒绝该订单吗?',
      confirmColor:'#6cd986',
      success(res) {
        if (res.confirm) {
          util.showloading("加载中")
          wx.request({
            url: app.globalData.api_ctx + '/helper/declineOrder.json', // 仅为示例，并非真实的接口地址
            data: {
              id: wx.getStorageSync('helper_id'),
              orderId: orderRefuseId,
              reason:_this.data.cancel_reason
            },
            header: wx.getStorageSync('header'),
            success(res) {
              console.log(res)
              if (res.data.status==1) {
                util.hideloading()
                // 表示拒绝订单成功
                _this.reset_refuse_cancel_box()

                // 直接在prevPage的orders里面将该order去除(wx.getStorageSync('id'))
                let filterOrders = _this.data.orders.filter(order => {
                  return order.id != orderRefuseId
                })
                _this.setData({
                  orders: filterOrders
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

  // 这是待作业时候的按钮
  start_work(e){

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
          _this.reload()
        }
      }
    })
  },
  // 重新加载订单
  reload(){
    var _this=this
    _this.setData({
      pageNum: 1,
      keyword: '',
      orders: []
    })
    var order_type_num = _this.order_type_word_to_num()
    _this.onload_orders(order_type_num, _this.data.keyword, _this.data.isHidden, _this.data.isAssigned, _this.data.pageNum);
  },
  //待作业 这是企业帮手指派订单
 
  // 这是作业中出现的按钮情况
  complete_work(e){

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
                _this.reload()
              }
            }
          })
        } else if (res.cancel) {
          // 这时候点击了取消按钮
        }
      }
    })
  },
  // 这是价格待确认时候，联系农户
  contact_farmer(e){
    console.log(e.currentTarget)
    util.makePhoneCall(e.currentTarget.dataset.phone)
  },
  // 这是待评价
  immediate_evaluate(e){
    var _this = this
    var orderId = e.currentTarget.dataset.id
    wx.setStorageSync('id', orderId); //保存Cookie到Storage
    wx.navigateTo({
      url: '/pages/evaluate/evaluate'
    })
  },
  onTabItemTap(item) {
    var _this=this
    util.showloading("订单加载中")
    _this.setData({
      isHideFil: true,
      search_filtrate_txt: '全部订单',
      ifHideShade: true,
      pageNum: 1,
      keyword: '',
      isHidden: false,
      isAssigned: false,
      orders: []
    })

    _this.filtrate_reset()

    var order_type_num = _this.order_type_word_to_num()
    _this.onload_orders(order_type_num, '', _this.data.isHidden, _this.data.isAssigned, _this.data.pageNum);
  }
})