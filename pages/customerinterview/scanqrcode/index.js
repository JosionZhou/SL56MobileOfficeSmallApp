// pages/interviewscancode/index.js
let app = getApp();
let tmCode=null;
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
    let main =this;
    var data = {
      url: app.globalData.serverAddress + '/Interview/GetQRCodeData',
      method: "GET",
      success: function (res) {
        console.log(res);
        res.Seconds=16;
        res.IsRefresh=false;
        main.setData(res);
        main.countdown();
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
    clearTimeout(tmCode);
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
  countdown(){
    this.setData({
      Seconds:this.data.Seconds-1
    });
    if(this.data.Seconds==0){
      clearTimeout(tmCode);
      this.onLoad();
    }else{
      tmCode = setTimeout(this.countdown,1000);
    }
  },
  refresh(){
    this.setData({
      IsRefresh:true
    });
    clearTimeout(tmCode);
    this.onLoad();
  }
})