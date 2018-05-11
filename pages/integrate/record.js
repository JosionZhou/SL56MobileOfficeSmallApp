// pages/integrate/record.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    pageIndex: 1,
    isShowLoading: false,
    isShowNoDataMark: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍后',
    });
    this.getData();
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
    if (this.data.isShowNoDataMark) {
      return;
    }
    this.setData({
      isShowLoading: true
    });
    this.data.pageIndex = this.data.pageIndex + 1;
    this.getData();
  },
  getData: function () {
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/Integrate/History?pageIndex=' + this.data.pageIndex,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        if (res.length > 0) {
          var items = main.data.items;
          for(var i=0;i<res.length;i++){
            items.push(res[i])
          }
          main.setData({
            items: items,
            isShowLoading: false
          });
        }
        if (res.length == 0) {
          main.setData({
            isShowLoading: false,
            isShowNoDataMark: true
          });
        }
      }
    }
    app.NetRequest(data);
  }
})