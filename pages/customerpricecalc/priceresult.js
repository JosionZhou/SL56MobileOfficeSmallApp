// pages/pricecalculate/priceresult.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideDetail:true,
    result:null,
    indexSet:[],
    isButton:false,
    tabs:[],
    activeIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = app.priceResult;
    var tempData = new Array();
    var emptyObj = new Object();
    tempData.push(emptyObj);
    data.forEach(element => {
      var tData=null;
      if(tempData.length>0){
        tData=tempData.find(p=>p.PriceType==element.PriceType);
      }
      if(tData==null){
        tData = new Object();
        tData.PriceList = new Array();
        tData.PriceType=element.PriceType;
        //若存在出口价，则把出口价显示在第一个选项卡
        if(element.PriceType=="出口价")
        {
          tempData[0]=tData;
        }else{
          tempData.push(tData);
        }
      }
      tData.PriceList.push(element);
    });
    if(tempData[0]==emptyObj){
      tempData.splice(0,1);
    }
    this.setData({
      result: data,
      tabs:tempData
    });
    var that=this;
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
    wx.hideLoading();
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
  // onShareAppMessage: function () {
  
  // },
  clickItem:function(event){
    var index = event.currentTarget.dataset.index;
    var result = this.data.tabs[this.data.activeIndex].PriceList;
    app.currentPriceItem=result[index];
    wx.navigateTo({
      url: 'priceDetail',
    })
  },
  countryRemark(event){
    this.data.isButton=true;
    var data = this.data.result[event.currentTarget.dataset.index];
    app.remark= data.Remark.split("\r\n");
    app.commonRemark = data.CommonRemark.split("\r\n");
    app.countryRemark = data.CountryRemark.split("\r\n");
    
  },
  tabClick:function(e){
    this.setData({
    sliderOffset: e.currentTarget.offsetLeft,
    activeIndex: e.currentTarget.id
  });
  }
})