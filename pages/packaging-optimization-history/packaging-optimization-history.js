const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: "",
    pageIndex: 1,
    markTypes: ["所有", "标识优化", "标识删除"],
    markTypeIndex: 0,
    isAmazonTypes: ["所有", "是亚马逊", "非亚马逊"],
    isAmazonTypeIndex: 0,
    isShowNoDataMark: false,
    isLoadingData: false,
    result: [],
    isSearched: false
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
    if (!this.data.isSearched)
      return;
    if (this.data.isShowNoDataMark)
      return;
    this.data.pageIndex++;
    this.search();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  clearInput() {
    this.setData({
      key: ""
    });
  },
  bindMarkTypeChange(e) {
    this.setData({
      markTypeIndex: e.detail.value
    })
  },
  bindIsAmazonChange(e) {
    this.setData({
      isAmazonTypeIndex: e.detail.value
    })
  },
  search() {
    this.data.isSearched = true;
    let that = this;
    let reqData = {
      url: app.globalData.serverAddress + '/PackagingOptimization/SearchProcessList',
      method: "GET",
      data: {
        key: that.data.key,
        pageIndex: that.data.pageIndex,
        markType: that.data.markTypeIndex > 0 ? that.data.markTypeIndex : null,
        isAmazon: that.data.isAmazonTypeIndex > 0 ? that.data.isAmazonTypeIndex==1 : null
      },
      success: function (res) {
        if (res.length > 0) {
          let result = that.data.result;
          res.forEach(element => {
            result.push(element);
          });
          that.setData({
            result: result,
            isLoadingData: false,
            isShowNoDataMark:res.length<20
          });
        }else{
          that.setData({
            isShowNoDataMark: true,
            isLoadingData: false
          });
        }
      }
    };
    that.setData({
      isLoadingData: true
    });
    app.NetRequest(reqData);
  },
  btnSearch() {
    this.data.pageIndex = 1;
    this.data.isShowNoDataMark = false;
    this.setData({
      pageIndex:1,
      isShowNoDataMark:false,
      result:[]
    });
    this.search();
  }
})