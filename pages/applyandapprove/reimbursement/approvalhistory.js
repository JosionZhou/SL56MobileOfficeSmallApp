const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '正在获取数据',
    });
    let that=this;
    let data = {
      url: app.globalData.serverAddress + "/Reimbursement/MyApprovalHistory",
      method:"GET",
      success: function (res) {
        wx.hideLoading();
        that.setData({
          list:res,
        });
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
  toDetail(e){
    let data = this.data.list[e.currentTarget.dataset.index];
    data.IsCancelable=false;
    let params = JSON.stringify(data);
    wx.navigateTo({
      url: './apply?item='+ params
    });
  }
})