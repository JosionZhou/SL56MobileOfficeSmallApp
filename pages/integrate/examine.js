var sliderWidth = 120; // 需要设置slider的宽度，用于计算中间位置
var app=getApp()
Page({
  data: {
    items:[]
  },
  onLoad: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '请稍后',
    })
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/Integrate/GetExamineList',
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        main.setData({
          items: res
        });
      }
    }
    app.NetRequest(data);
  }
});