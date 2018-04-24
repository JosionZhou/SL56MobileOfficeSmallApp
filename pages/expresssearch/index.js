// pages/deliveryrecord/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key:"",
    result: [],
    pageIndex: 1,
    // numberText: "",
    // filtText: "筛选",
    // isShowFilter: false,
    isShowLoading: false,
    isShowNoDataMark: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var dateStart = app.dateProcess(-30);
    // var dateEnd = app.dateProcess(1);
    // this.setData({
    //   dateStart: dateStart,
    //   dateEnd: dateEnd
    // });
    wx.showLoading({
      title: '请稍后',
    });
    this.search();
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
    if (this.data.isShowNoDataMark) {
      return;
    }
    this.setData({
      isShowLoading: true
    });
    this.data.pageIndex = this.data.pageIndex + 1;
    this.search();
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  // filt: function () {
  //   if (this.data.isShowFilter) {
  //     this.setData({
  //       filtText: "筛选",
  //       isShowFilter: false
  //     });
  //     this.search();
  //   } else {
  //     this.setData({
  //       filtText: "确定",
  //       isShowFilter: true
  //     });
  //   }
  // }
  // ,
  // bindDateStartChange: function (e) {
  //   this.setData({
  //     dateStart: e.detail.value
  //   })
  // },
  // bindDateEndChange: function (e) {
  //   this.setData({
  //     dateEnd: e.detail.value
  //   });
  // },
  search: function (e) {
    var main = this;
    var requestData = null;
    var url = ""; 
    if (e != null) {
      this.setData({
        key:e.detail.value,
        pageIndex:1,
        result:[],
        isShowLoading: false,
        isShowNoDataMark: false
      });
    } 
    if (this.data.key != null && this.data.key.trim() != "") {
      requestData = {
        pageIndex: this.data.pageIndex,
        key: this.data.key.toUpperCase()
      }
      url = app.globalData.serverAddress + '/Express/SearchList';
    } else {
      requestData = {
        pageIndex: this.data.pageIndex
      }
      url=app.globalData.serverAddress + '/Express/GetList';
    }
    var data = {
      url: url,
      method: "GET",
      data: requestData,
      success: function (res) {
        if (res.length > 0) {
          var result = main.data.result;
          for (var i = 0; i < res.length; i++) {
            result.push(res[i])
          }
          main.setData({
            result: result,
            isShowLoading: false
          });
        } else {
          main.setData({
            isShowNoDataMark: true,
            isShowLoading: false
          });
        }
        wx.hideLoading();
      }
    }
    app.NetRequest(data);
  },
  inputReferenceNumber: function (e) {
    var filtResult = new Array();
    var result = this.data.result;
    for (var i = 0; i < result.length; i++) {
      if (result[i].ReferenceNumber.toLowerCase().indexOf(e.detail.value.toLowerCase()) != -1) {
        filtResult.push(result[i]);
      }
    }
    this.setData({
      inputVal: e.detail.value,
      filtResult: filtResult
    });
  },
  clearInput: function () {
    this.setData({
      key: "",
      pageIndex: 1,
      result: [],
      isShowLoading: false,
      isShowNoDataMark: false
    });
    this.search();
  },
  tapItem:function(e){
    var palletno = e.currentTarget.dataset.palletno;
    app.globalData.palletno=palletno;
  }
})

