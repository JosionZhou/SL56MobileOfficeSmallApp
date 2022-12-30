// pages/arkpricecalc/result.js
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
    let that =this;
    let channel = this.getOpenerEventChannel();
    channel.on("showData",function(data){
      data.forEach(element => {
        element.ShippingDate = element.ShippingDate.replace("T"," ");
        element.ShowChargeLineItems=false;
        element.ShowWeightAdjusted=false;
      });
      that.setData({
        list:data
      });
    });
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
  openChargeLineItems(e){
    let index = e.currentTarget.dataset["index"];
    let list = this.data.list;
    let isShow=list[index].ShowChargeLineItems;
    list[index].ShowChargeLineItems=!isShow;
    list[index].ShowWeightAdjusted=false;
    this.setData({
      list:list
    });
  },
  openWeightAdjusted(e){
    let index = e.currentTarget.dataset["index"];
    let list = this.data.list;
    let isShow=list[index].ShowWeightAdjusted;
    list[index].ShowWeightAdjusted=!isShow;
    list[index].ShowChargeLineItems=false;
    this.setData({
      list:list
    });
  }
})