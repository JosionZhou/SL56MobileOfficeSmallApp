// pages/customerinterview/interviewhistory/detail.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '请稍后...',
      mask:true
    });
    let id = options.id;
    this.setData({
      disableAddNote:options.disableAddNote
    });
    let main =this;
    var data = {
      url: app.globalData.serverAddress + '/Interview/GetInterviewDetail?id='+id,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        main.setData(res.Data);
        wx.hideLoading();
      },
      fail:function(err){
        wx.hideLoading();
        console.log(err);
        wx.showToast({
          icon:"none",
          mask:true,
          duration:3000,
          title: err.data.Message+'：'+err.data.ExceptionMessage,
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
  addNote(){
    wx.navigateTo({
      url: '../interviewnote/index?interviewId='+this.data.ObjectId+'&name='+this.data.PersonName,
    })
  },
  readNote(){
    wx.navigateTo({
      url: '../interviewnote/history?interviewId='+this.data.ObjectId+'&name='+this.data.PersonName,
    })
  }
})