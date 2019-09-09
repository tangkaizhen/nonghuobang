// pages/add_medicine/add_medicine.js
//获取应用实例
const app = getApp()
Page({


  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    back_img: '../../images/icon_back.png',
    isHasMedicine: true,
    medicine_name: '',
    reminder_info: '请输入名称',
    isHiddenReminder: true,
    medicine_material_arr: [],
    airplane_height: 0,
    airplane_speed: 0,
    airplane_range: 0,
    airplane_quantity: 0,
    isshowPlane: false
  },
  // medicine_material_arr: [{ name: '药物1', dosage:'20',unit:'L'}]

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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {

    let _this = this;
    // 这时候需要判断是从添加飞机页面返回还是从添加药物界面返回

    wx.getStorage({
      key: 'medicine_material_arr',
      success: function (res) {
        console.log(res);
        if (res.data) {
          // 表示有传递过来的药物
          // 将传递过来的药物插入到药物数组中
          _this.setData({
            medicine_material_arr: res.data.concat(_this.data.medicine_material_arr)
          })

          // 增加好了之后，就把medicine_material_arr杀死，从新设置一个新的，好让下一步界面调用
          wx.removeStorage({
            key: 'medicine_material_arr',
            success: function (res) { },
          })
          wx.setStorage({
            key: 'medicine_material_arr_plane',
            data: _this.data.medicine_material_arr,
            success(res) {
            }
          })
        } else {
          // 表示没有传递过来的药物

        }
      },
    })

  },

  back_page() {
    wx.navigateBack({
      delta: 1
    })
  },
  add_medicine_next() {
    // 首先要检查数据的有效性
    // 检查是否有名字
    if (!this.data.medicine_name) {
      // 表示这时候是空的
      // 做出提示

      var _this = this;
      this.setData({
        reminder_info: '请输入名称',
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

    if (!this.data.medicine_material_arr.length) {
      // 这时候表示没有添加药物

      var _this = this;
      this.setData({
        reminder_info: '请添加药物',
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
    // 把药物
    wx.navigateTo({
      url: '../add_airplane/add_airplane?medicine_name=' + this.data.medicine_name
    })
  },
  
  bind_medic_name(e) {
    this.setData({
      medicine_name: e.detail.value
    })
  },
  add_medicine_materials() {
    wx.navigateTo({
      url: '../add_medicine_material/add_medicine_material'
    })
  }
})