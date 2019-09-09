// pages/my_pindan/my_pindan.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    filtrate_type: {
      filtrate_type1: 'icon_selection_s_all_h',
      filtrate_type2: 'icon_selection_s_cultivation_n',
      filtrate_type3: 'icon_selection_s_spray_n',
      filtrate_type4: 'icon_selection_s_harvest_n',
      filtrate_type5: 'icon_selection_s_hire_n',
    },
    isHideFil: true,
    search_txt: '筛选',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'cookie': wx.getStorageSync('cookieKey')
    },
    keyword: '',
    operate_type:'',
    pageNum:1,
    combineOrders:[],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 首先获取拼单列表
    var _this = this;
    _this.setData({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'cookie': wx.getStorageSync('cookieKey')
      }
    })
    _this.setData({
      keyword: ''
    })
    //  获取初始化数据
    _this.myCombineOrders(_this.data.operate_type, _this.data.keyword, _this.data.pageNum);
  },
  myCombineOrders(jobType, keyword, pageNum){
    var _this = this;
    wx.request({
      url: app.globalData.api_ctx + '/helper/myCombineOrders.json', // 仅为示例，并非真实的接口地址
      data: {
        id: wx.getStorageSync('helper_id'),
        jobType: jobType,
        keyword: keyword,
        pageNum: pageNum,
        appToken: wx.getStorageSync('appToken')
      },
			header: wx.getStorageSync('header'),
      success(res) {
        console.log(res)
        if (res.data.data) {
          if (res.data.data.combineOrders) {
            let combineOrders = res.data.data.combineOrders;

            _this.setData({
              combineOrders: [..._this.data.combineOrders, ...combineOrders]
            })
          }
        }

      }
    })
  },
  back_page(){
    wx.navigateBack({
      delta: 1
    })
  },
  to_start(){
    wx.navigateTo({
      url: '/pages/write_pindan/write_pindan'
    })
  },
  select_filtrate_type(event) {
    var _this = this;
    _this.setData({
      isHideFil: !_this.data.isHideFil,
    })
    console.log(event.currentTarget.dataset.index);
    var index = event.currentTarget.dataset.index;
    _this.setData({
      pageNum: 1,
      combineOrders: []
    })
    if (index == 1) {
      _this.setData({
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_h',
          filtrate_type2: 'icon_selection_s_cultivation_n',
          filtrate_type3: 'icon_selection_s_spray_n',
          filtrate_type4: 'icon_selection_s_harvest_n',
          filtrate_type5: 'icon_selection_s_hire_n',
        },
        search_txt: '全部',
        operate_type:''
      })
    } else if (index == 2) {
      _this.setData({
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_n',
          filtrate_type2: 'icon_selection_s_cultivation_h',
          filtrate_type3: 'icon_selection_s_spray_n',
          filtrate_type4: 'icon_selection_s_harvest_n',
          filtrate_type5: 'icon_selection_s_hire_n',
        },
        search_txt: '耕种',
        operate_type: '耕种'
      })
    } else if (index == 3) {
      _this.setData({
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_n',
          filtrate_type2: 'icon_selection_s_cultivation_n',
          filtrate_type3: 'icon_selection_s_spray_h',
          filtrate_type4: 'icon_selection_s_harvest_n',
          filtrate_type5: 'icon_selection_s_hire_n',
        },
        search_txt: '打药',
        operate_type: '打药'
      })
    } else if (index == 4) {
      _this.setData({ 
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_n',
          filtrate_type2: 'icon_selection_s_cultivation_n',
          filtrate_type3: 'icon_selection_s_spray_n',
          filtrate_type4: 'icon_selection_s_harvest_h',
          filtrate_type5: 'icon_selection_s_hire_n',
        },
        search_txt: '收割',
        operate_type: '收割'
      })
    } else if (index == 5) {
      _this.setData({
        filtrate_type: {
          filtrate_type1: 'icon_selection_s_all_n',
          filtrate_type2: 'icon_selection_s_cultivation_n',
          filtrate_type3: 'icon_selection_s_spray_n',
          filtrate_type4: 'icon_selection_s_harvest_n',
          filtrate_type5: 'icon_selection_s_hire_h',
        },
        search_txt: '人工',
        operate_type: '人工'
      })
    }
    _this.setData({
      keyword: ''
    })
    _this.myCombineOrders(_this.data.operate_type, _this.data.keyword, _this.data.pageNum);

  },
  to_search() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  to_delete(event){
    var _this = this;
    let combineOrderId = event.currentTarget.dataset.id;
    let index=event.currentTarget.dataset.index;
    wx.showModal({
      title: '删除拼单',
      content: '您确定要删除这个拼单吗？',
      cancelColor:'',
      confirmColor:'#6cd986',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          
          wx.request({
            url: app.globalData.api_ctx + '/helper/deleteCombineOrder.json', // 仅为示例，并非真实的接口地址
            data: {
              id: wx.getStorageSync('helper_id'),
              combineOrderId: combineOrderId,
              appToken: wx.getStorageSync('appToken')
            },
						header: wx.getStorageSync('header'),
            success(res) {
              console.log(res);
              if (res.data.status==0){
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                })
              }else{
                let new_combineOrders = _this.data.combineOrders.filter((v, i) => {
                  return i != index
                })
                _this.setData({
                  combineOrders: new_combineOrders
                })

                wx.showToast({
                  title: '删除成功',
                  icon: 'none'
                })
              }
              
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }

    })
  },
  to_ediotr(event){
    var _this = this;
    let combineOrderId = event.currentTarget.dataset.id;
    let index = event.currentTarget.dataset.index;

    wx.navigateTo({
      url: '../write_pindan/write_pindan?combineOrderId=' + combineOrderId + '&index='+index
    })

  },
  toggle_filtrate_box() {
    var _this = this;
    _this.setData({
      isHideFil: !_this.data.isHideFil,
    })
  }
})