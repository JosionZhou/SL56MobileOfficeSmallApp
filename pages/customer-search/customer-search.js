var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: "",
    result: [],
    isShowLoading: false,
    isShowNoDataMark: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  onReachBottom: function () {},

  //防抖延时800ms执行查询操作
  inputKey:function(e){
    if (e != null) {
      clearTimeout(this.data.timer);
      this.setData({
        key: e.detail.value,
        result: [],
        isShowLoading: false,
        isShowNoDataMark: false,
        timer:setTimeout(() => {
          this.search();
        }, 800)
      });
    }
  },

  search: function () {
    var main = this;
    var requestData = null;
    var url = "";
    if (this.data.key != null && this.data.key.trim() != "") {
      requestData = {
        key: this.data.key
      }
      url = app.globalData.serverAddress + '/Customer/Search';
    } else {
      wx.hideLoading();
      return;
    }
    var data = {
      url: url,
      method: "GET",
      data: requestData,
      success: function (res) {
        wx.hideLoading();
        if (data.data.key != main.data.key) return;
        var result = new Array();
        for (var i = 0; i < res.length; i++) {
          result.push(res[i])
        }
        main.setData({
          result: result,
          isShowNoDataMark: true
        });
      }
    }
    wx.showLoading({
      title: '请稍候',
    })
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
      result: [],
      isShowLoading: false,
      isShowNoDataMark: false
    });
    this.search();
  },
  tapItem: function (e) {
    var palletno = e.currentTarget.dataset.palletno;
    app.globalData.palletno = palletno;
  }
})