// pages/add_airplane/add_airplane.js
const app = getApp()
const util = require('../../js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    back_img: '../../images/icon_back.png',
    reminder_info: '',
    isHiddenReminder: true,
    airplane_height: '',
    airplane_speed: '',
    airplane_range: '',
    header: '',
    airplane_quantity: '',
    medicine_name: '',
    airplane_order: '',
    selected_order_num: [],
    selected_order_id: []
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('selected_order_num')) {
      this.setData({
        selected_order_num: wx.getStorageSync('selected_order_num'),
        airplane_order: wx.getStorageSync('selected_order_num').join(',')
      })
      wx.removeStorageSync('selected_order_num')
    }
    if (wx.getStorageSync('selected_order_id')) {

      this.setData({
        selected_order_id: wx.getStorageSync('selected_order_id')
      })
      wx.removeStorageSync('selected_order_id')
    }
  },
  back_page() {
    wx.navigateBack({
      delta: 1
    })
  },
  to_bind_order() {
    wx.navigateTo({
      url: '/pages/bind_order/bind_order',
    })
  },
  bind_airplane_height(e) {
    this.setData({
      airplane_height: e.detail.value
    })
  },
  bind_airplane_speed(e) {
    this.setData({
      airplane_speed: e.detail.value
    })
  },
  bind_airplane_range(e) {
    this.setData({
      airplane_range: e.detail.value
    })
  },
  bind_airplane_quantity(e) {
    this.setData({
      airplane_quantity: e.detail.value
    })
  },
  add_medicine_complete() {
    var _this = this;
    // 首先检查数据的有效性
    if (!this.data.airplane_height) {
      // 表示这时候是空的
      // 做出提示

      var _this = this;
      this.setData({
        reminder_info: '请输入飞机的高度',
        isHiddenReminder: false
      });

      setTimeout(function () {
        _this.setData({
          reminder_info: '',
          isHiddenReminder: true
        });
      }, 1000);

      return;
    }
    if (!this.data.airplane_speed) {
      // 表示这时候是空的
      // 做出提示

      var _this = this;
      this.setData({
        reminder_info: '请输入飞机的速度',
        isHiddenReminder: false
      });

      setTimeout(function () {
        _this.setData({
          reminder_info: '',
          isHiddenReminder: true
        });
      }, 1000);

      return;
    }
    if (!this.data.airplane_range) {
      // 表示这时候是空的
      // 做出提示

      var _this = this;
      this.setData({
        reminder_info: '请输入飞机的喷幅',
        isHiddenReminder: false
      });

      setTimeout(function () {
        _this.setData({
          reminder_info: '',
          isHiddenReminder: true
        });
      }, 1000);

      return;
    }
    if (!this.data.airplane_quantity) {
      // 表示这时候是空的
      // 做出提示

      var _this = this;
      this.setData({
        reminder_info: '请输入每亩用量',
        isHiddenReminder: false
      });

      setTimeout(function () {
        _this.setData({
          reminder_info: '',
          isHiddenReminder: true
        });
      }, 1000);

      return;
    }

    var data = {}
    if (this.data.airplane_order) {

    }
    // 从上一张页面中获取传递过来的药物
    wx.getStorage({
      key: 'medicine_material_arr_plane',
      success: function (res) {
        console.log(res);
        if (res.data) {
          // 表示有传递过来的药物
          wx.request({
            url: app.globalData.api_ctx + '/helper/saveFormulation.json', // 仅为示例，并非真实的接口地址
            data: {
              id: wx.getStorageSync('helper_id'),
              name: _this.data.medicine_name,
              height: _this.data.airplane_height,
              velocity: _this.data.airplane_speed,
              sprayingSwath: _this.data.airplane_range,
              dosageMu: _this.data.airplane_quantity,
              pesticides: res.data,
              orderIds: _this.data.selected_order_id.join(','),
              appToken: wx.getStorageSync('appToken')
            },
            header: wx.getStorageSync('header'),
            success(res) {
              console.log(res)
              if (res.data.status == 1) {

                // 最后一步需要消除传递过来的药物
                wx.removeStorage({
                  key: 'medicine_material_arr_plane',
                  success: function (res) { },
                })

                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 3];
                var formulations = prevPage.data.formulations
                formulations.push({
                  id: res.data.data.formulationId, 
                  name: _this.data.medicine_name
                })
                prevPage.setData({
                  formulations
                })
                wx.navigateBack({
                  delta:2
                })
              } else {
                util.showInfo(res.data.msg)
              }
            }
          })

        } else {
          // 表示没有传递过来的药物

        }
      },
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.medicine_name) {

      this.setData({
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'cookie': wx.getStorageSync('cookieKey')
        }
      })
      this.setData({
        medicine_name: options.medicine_name
      })

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },



})