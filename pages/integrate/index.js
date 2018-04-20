// pages/integrate/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subFunctions:
    [
      { name: "申请加分", image: "add", showbadge: false, event: "addIntegrate" },
      { name: "申请扣分", image: "minus", showbadge: false, event: "minusIntegrate" },
      { name: "审批", image: "stamp", showbadge: true, event: "examine" }
    ]
  },

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
  addIntegrate: function () {
    wx.navigateTo({
      url: '/pages/integrate/applyforadd',
    })
  },
  minusIntegrate: function () {
    wx.navigateTo({
      url: '/pages/integrate/applyforminus',
    })
  },
  examine: function () {
    wx.navigateTo({
      url: '/pages/integrate/examine',
    })
  }
})