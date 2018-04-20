// pages/deliveryrecord/detail.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:null,
    tabs: ["基本信息", "规格", "轨迹信息","费用明细","待跟进问题"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    width:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
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
    wx.showLoading({
      title: '请稍后',
      mask:true
    });
     var id = options.id
     var main=this;
     var data = {
       url: app.globalData.serverAddress + '/Express/Detail',
       method:"GET",
       data: {
         id: id
       },
       success: function (res) {
         wx.hideLoading();
         main.setData({
           item:res
         });
       }
     }
     app.NetRequest(data);
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
})