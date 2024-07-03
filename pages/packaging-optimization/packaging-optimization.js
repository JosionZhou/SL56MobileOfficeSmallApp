// pages/packaging-optimization/packaging-optimization.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    IsSelectAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    wx.showLoading({
      title: '请稍后',
    });
    var data = {
      url: app.globalData.serverAddress + '/DeliveryRecord/GetCanPackagingOptimizationList',
      method: "GET",
      success: function (res) {
        console.log(res);
        that.setData({
          result: res
        });
        wx.hideLoading();
      }
    }
    app.NetRequest(data);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  check(e) {
    let id = e.currentTarget.dataset.id;
    let items = this.data.result;
    items.forEach(element => {
      if (element.Id == id) {
        element.IsSelected = !element.IsSelected;
      }
    });
    this.setData({
      result: items
    });
    let selectCount = this.data.result.filter(p => p.IsSelected).length;
    if (selectCount == this.data.result.length) {
      this.setData({
        IsSelectAll: true
      });
    } else {
      this.setData({
        IsSelectAll: false
      });
    }
    console.log(this.data.items);
  },
  checkAll(e) {
    let items = this.data.result;
    let selected = this.data.IsSelectAll;
    items.forEach(element => {
      element.IsSelected = !selected;
    });
    this.setData({
      result: items,
      IsSelectAll: !selected
    });
  },
  batchDelete() {
    let that = this;
    let ids = that.data.result.filter(p=>p.IsSelected).map(p=>p.Id);
    if(!ids || ids.length==0){
      wx.showModal({
        title: '提示',
        content: '请先选择单号',
        showCancel:false
      });
      return;
    }
    wx.showModal({
      showCancel: true,
      title: "提示",
      content: "确定删除吗？",
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍后'
          });
          var data = {
            url: app.globalData.serverAddress + '/DeliveryRecord/MarkPackagingOptimization',
            method: "POST",
            data:ids,
            success: function (res) {
              console.log(res);
              if(res.length==0){
                that.onLoad();
              }else{
                wx.showModal({
                  title: '操作失败',
                  content: res,
                  showCancel:false
                })
              }
              wx.hideLoading();
            }
          }
          app.NetRequest(data);
        }
      }
    });
  }
})