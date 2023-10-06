// pages/customerinterview/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[      
    {
      name: "面访二维码",
      image: "qrcode",
      event: "interviewCode"
    },
    {
      name: "已面访",
      image: "interview-complete",
      event: "interviewHistory"
    },
    // {
    //   name: "面访笔记",
    //   image: "apply",
    //   event: "interviewNote"
    // },
    {
      name: "面访管理",
      image: "interview-manager",
      hide:true,
      event: "interviewManager"
    }
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let main=this;
    let data = {
      url:app.globalData.serverAddress + '/Interview/IsManager',
      method:"GET",
      success:function(res){
        console.log("isManager:",res);
        let items = main.data.items;
        items[2].hide=!res;
        main.setData({
          items:items
        });
      },
      fail:function(err){
        console.log(err);
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
  interviewCode(){
    wx.navigateTo({
      url: '/pages/customerinterview/scanqrcode/index',
    });
  },
  interviewHistory(){
    wx.navigateTo({
      url: '/pages/customerinterview/interviewhistory/index',
    });
  },
  interviewManager(){
    wx.navigateTo({
      url: './interviewmanager/index',
    })
  }
})