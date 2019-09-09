// pages/add_medicine_material/add_medicine_material.js
//获取应用实例
const app = getApp()
Page({


  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    back_img: '../../images/icon_back.png',
    select: false,
    medicine_name: '',
    medicine_quantity: '',
    reminder_info: '',
    isHiddenReminder: true,
    medicine_unit_value: 'kg/㎡',
    medicine_material_arr_index: 'empty'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (options.dataset) {
      console.log(options.dataset)
      var data_obj = JSON.parse(options.dataset)
      _this.setData({
        medicine_material_arr_index: data_obj.index,
        medicine_name: data_obj.item.name,
        medicine_quantity: data_obj.item.dosage,
        medicine_unit_value: data_obj.item.unit
      })
    }
    // 
  },


  back_page() {
    wx.navigateBack({
      delta: 1
    })
  },
  toggle_select() {
    this.setData({
      select: !this.data.select
    });
  },
  bind_medic_name(e) {
    this.setData({
      medicine_name: e.detail.value
    })
  },
  bind_medic_quantity(e) {
    this.setData({
      medicine_quantity: e.detail.value
    })
  },
  add_medicine_complete() {
    // 首先需要判断数据的有效性
    // 检查是否有名字
    if (!this.data.medicine_name) {
      // 表示这时候是空的
      // 做出提示

      var _this = this;
      this.setData({
        reminder_info: '请输入药物名称',
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

    if (!this.data.medicine_quantity) {
      // 表示这时候是空的
      // 做出提示

      var _this = this;
      this.setData({
        reminder_info: '请输入用量',
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

    // 当数据有效性都正确时候，进行页面跳转
    // 这时候还需要将数据带入上一张界面
    var medicine_material_arr = []
    if (this.data.medicine_material_arr_index == 'empty') {
      medicine_material_arr = [
        { name: this.data.medicine_name, dosage: this.data.medicine_quantity, unit: this.data.medicine_unit_value }
      ]

    } else {
      medicine_material_arr = [
        { index: this.data.medicine_material_arr_index, name: this.data.medicine_name, dosage: this.data.medicine_quantity, unit: this.data.medicine_unit_value }
      ]
    }





    wx.setStorage({
      key: 'medicine_material_arr',
      data: medicine_material_arr,
      success(res) {
        wx.navigateBack({
          delta: 1
        })
      }
    })


  },
  mySelect(e) {
    var name = e.currentTarget.dataset.unit
    this.setData({
      medicine_unit_value: name,
      select: false
    })
  }
})