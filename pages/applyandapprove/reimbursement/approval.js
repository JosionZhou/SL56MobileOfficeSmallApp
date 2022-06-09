const app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
    let that = this;
    wx.showLoading({
      title: '获取数据中...',
    });
    let data = {
      url: app.globalData.serverAddress + "/Reimbursement/ApprovalList",
      method:"GET",
      success:function(res){
        that.setData({
          items:res
        });
        wx.hideLoading();
      },
      fail:function(res){
        wx.hideLoading();
        wx.showModal({
          showCancel:false,
          title:"获取数据失败",
          content:res
        });
      }
    }
    app.NetRequest(data);
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
  approval(e){
    let data = this.data.items[e.currentTarget.dataset.index];
    data.IsApprovaling=true;
    let params = JSON.stringify(data);
    wx.navigateTo({
      url: './apply?item='+ params
    });
  }
})