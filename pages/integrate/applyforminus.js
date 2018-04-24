// pages/integrate/applyforminus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    name: "",
    array:
    [
      "捡垃圾",
      "搞卫生",
      "帮助他人"
    ],
    index:0,
    basis:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var currentDate = (new Date()).toLocaleDateString();
    var nameInfo = wx.getStorageSync("nameInfo");
    this.setData({
      date: currentDate,
      name: nameInfo.split('/')[1]
    });
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
  onShareAppMessage: function () {

  },
  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value,
      basis:this.data.array[e.detail.value]
    })
  }
})