Component({
  data: {
    selected: 0,
    ifHidden_tabbar:true,
    color: "#7A7E83",
    selectedColor: "#6cd986",
    list: [{
      pagePath: "/pages/recevie_order/recevie_order",
      iconPath: "/images/icon_tab_shouye_normal.png",
      selectedIconPath: "/images/icon_tab_shouye_highlight.png",
      text: "接单"
    }, {
      pagePath: "/pages/home/home",
      iconPath: "/images/icon_tab_dingdan_normal.png",
      selectedIconPath: "/images/icon_tab_dingdan_highlight.png",
      text: "订单"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})