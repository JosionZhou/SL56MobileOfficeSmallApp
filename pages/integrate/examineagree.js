// pages/integrate/examineagree.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score:0,
    objectId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      score:options.score,
      objectId:options.objectId
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
  agree:function(e){
    wx.showLoading({
      title: '请稍后',
    });
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/Integrate/Agree?objectId=' + this.data.objectId+'&score='+e.detail.value.score+'&remark='+e.detail.value.remark,
      success: function (res) {
        wx.hideLoading();
        if (res.length > 0) {
          wx.showModal({
            title: '操作异常',
            content: res,
            showCancel:false
          })
        }else{
          wx.navigateBack({
            delta:2
          });
        }
      }
    }
    app.NetRequest(data);
  }
})