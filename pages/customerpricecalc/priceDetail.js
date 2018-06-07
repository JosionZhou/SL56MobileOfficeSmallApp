var app=getApp()
Page({
  data: {
    tabs: ["基本信息","费用明细","报价声明", "报价备注", "国家备注"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    width:0,
    remark:null,
    commonRemark:null,
    countryRemark:null
  },
  onLoad: function () {
    var that = this;
    var currentPriceItem = app.currentPriceItem;
    this.setData({
      item: currentPriceItem,
      remark: currentPriceItem.Remark.replace(/<p>/g, "").split("</p>"),
      commonRemark: currentPriceItem.CommonRemark.replace(/<p>/g, "").split("</p>"),
      countryRemark: currentPriceItem.CountryRemark.replace(/<p>/g, "").split("</p>")
    });
    wx.getSystemInfo({
      success: function (res) {
        var sliderWidth = res.windowWidth / that.data.tabs.length;
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          width: sliderWidth
        });
      }
    });
    this.setData({
      remark:getApp().remark,
      commonRemark:getApp().commonRemark,
      countryRemark:getApp().countryRemark
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});