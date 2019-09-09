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
    isshowPlane: false,
    formulationId:''
  },
  // medicine_material_arr: [{ name: '药物1', dosage:'20',unit:'L'}]

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    console.log(options)
    let formulationid = options.formulationid;
    // 根据传递过来的formulationid进行详情查询
    wx.request({
      url: app.globalData.api_ctx + '/helper/getFormulationDetails.json',
      data: {
        id: wx.getStorageSync('helper_id'),
        formulationId: formulationid,
        appToken: wx.getStorageSync('appToken')
      },
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.status == 1) {

          _this.setData({
            medicine_name: res.data.data.formulation.name,
            medicine_material_arr: res.data.data.formulation.pesticides,
            airplane_height: res.data.data.formulation.height,
            airplane_speed: res.data.data.formulation.velocity,
            airplane_range: res.data.data.formulation.sprayingSwath,
            airplane_quantity: res.data.data.formulation.dosageMu,
            formulationId: res.data.data.formulation.id,
            isshowPlane:true,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;

    wx.getStorage({
      key: 'medicine_material_arr',
      success: function (res) {
        console.log(res);
        if (res.data) {
          // 表示有传递过来的药物
          // 将传递过来的药物插入到药物数组中

          // 这时候要判断到底药物是新增还是编辑
          if (res.data[0].index || res.data[0].index==0){
            // 表示编辑
            var arr = _this.data.medicine_material_arr
            // 过滤掉index
            arr[res.data[0].index] = res.data[0]

            console.log(arr)
            _this.setData({
              medicine_material_arr: arr
            })

          }else{
            // 表示新增
            _this.setData({
              medicine_material_arr: res.data.concat(_this.data.medicine_material_arr)
            })
          }
          

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
  // 编辑药物
  edite_medicine(event){
    console.log(event.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/add_medicine_material/add_medicine_material?dataset=' + JSON.stringify(event.currentTarget.dataset)
    })
  },
  // 删除药物
  medicine_arr_delete(event){
    var _this=this;
    var delete_index=event.currentTarget.dataset.index;
    var delete_arr = _this.data.medicine_material_arr;
    delete_arr.splice(delete_index,1);
    console.log(delete_arr);
    _this.setData({
      medicine_material_arr: delete_arr
    })
  },
  back_page() {
    wx.navigateBack({
      delta: 1
    })
  },
  medicine_complete() {
      var _this = this;
    // 首先要检查数据的有效性
    // 检查是否有名字
    if (!this.data.medicine_name) {
      // 表示这时候是空的
      // 做出提示

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
    
    // 开始保存
    var old_medicine_material_arr = _this.data.medicine_material_arr;
    var new_medicine_material_arr=[];

    for (var i = 0; i < old_medicine_material_arr.length;i++){
      new_medicine_material_arr.push(
        {
          name: old_medicine_material_arr[i].name,
          dosage: old_medicine_material_arr[i].dosage,
          unit: old_medicine_material_arr[i].unit
        }
      )
    }
    console.log(new_medicine_material_arr);
    wx.request({
      url: app.globalData.api_ctx + '/helper/saveFormulation.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'), 
        formulationId: _this.data.formulationId,
        name: _this.data.medicine_name,
        height: _this.data.airplane_height,
        velocity: _this.data.airplane_speed,
        sprayingSwath: _this.data.airplane_range,
        dosageMu: _this.data.airplane_quantity,
        pesticides: new_medicine_material_arr,
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

          // 杀死所有的页面到配药列表中

          wx.reLaunch({
            url: '../index/index'
          })
        }
      }
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
  }
})