const app= getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex:0,
    tabs: ["待审批", "已完成"],
    items1:[],//待审批列表
    items2:[]//已完成审批列表
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
    let that =this;
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
      title: '获取数据中...',
    });
    let data = {
      url: app.globalData.serverAddress + "/Reimbursement/MyReimbursement",
      method:"GET",
      success: function (res) {
        wx.hideLoading();
        that.setData({
          items1:res.List1,
          items2:res.List2
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
  tabClick(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  toDetail(e){
    let data = null;
    let type=e.currentTarget.dataset.type;
    if(type==0){
      data = this.data.items1[e.currentTarget.dataset.index];
    }else{
      data = this.data.items2[e.currentTarget.dataset.index];
    }
    data.IsCancelable=data.CurrentState==0;
    let params = JSON.stringify(data);
    wx.navigateTo({
      url: './apply?item='+ params
    });
  }
})