// pages/customerinterview/interviewnote/history.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notes:[],
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let main=this;
    main.setData({
      name:options.name
    });
    var data = {
      url:app.globalData.serverAddress + '/Interview/GetInterviewNoteHistory?pageIndex=null&interviewId='+options.interviewId,
      method:"GET",
      success:function(res){
        console.log(res);
        wx.hideLoading();
        main.setData({
          notes:res
        });
      },
      fail:function(err){
        wx.hideLoading();
        console.log(err);
      }
    }
    wx.showLoading({
      title: '请稍后...',
      mask:true
    })
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
  detail(e){

  }
})