// pages/integrate/applyforadd.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:"",
    name: "",
    evaluations:[],
    index: 0,
    basis: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍后',
    })
    var currentDate = (new Date()).toLocaleDateString();
    var nameInfo = wx.getStorageSync("nameInfo");
    this.setData({
      date:currentDate,
      name:nameInfo.split('/')[1]
    });
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/Integrate/GetEvaluations',
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        var array = new Array();
        for(var i=0;i<res.length;i++){
          array.push(res[i].description)
        }
        main.setData({
          evaluations:array
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
  onShareAppMessage: function () {
  
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      basis: this.data.evaluations[e.detail.value]
    })
  },
  submit:function(e){
   var basis=e.detail.value.basis;
   var name=e.detail.value.name;
   var mark=e.detail.value.mark;
  }
})