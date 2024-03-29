// pages/chat/chat.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rgdId: null,
    rgdNo: null,
    pageIndex: 1,
    chatRecords: [],
    isShowLoading: false,
    isShowNoDataMark: false,
    fileUrl: app.globalData.serverAddress + "/DeliveryRecord/ChatFile?id=",
    thumbnailImageUrl: app.globalData.serverAddress + "/DeliveryRecord/GetThumbnailImage?id="
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.rgdId = options.rgdId;
    this.data.rgdNo = options.rgdNo;
    wx.setNavigationBarTitle({
      title: this.data.rgdNo + "-聊天记录",
    })
    console.log("rgdId:", this.data.rgdId);
    this.getData();
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
    // if (this.data.isShowNoDataMark) {
    //   return;
    // }
    // this.setData({
    //   isShowLoading: true
    // });
    // this.data.pageIndex = this.data.pageIndex + 1;
    // this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  getData() {
    let that = this;
    let reqData = {
      url: app.globalData.serverAddress + "/InstantMessage/GetMessages4?receiveGoodsDetailId=" + this.data.rgdId + "&pageIndex=" + this.data.pageIndex,
      method: "GET",
      success: function (res) {
        console.log(res);
        let records = that.data.chatRecords;
        res.forEach(element => {
          let reg = /<a.*a>/;
          element.Content = element.Content.replace(reg, '');
          records.push(element);
        });
        that.setData({
          chatRecords: records,
          isShowLoading: false,
          // isShowNoDataMark: res.length < 20
          isShowNoDataMark: true
        });
      }
    }
    app.NetRequest(reqData);
  },
  tapItem(event) {
    let id = event.currentTarget.dataset.id;
    let isFile = event.currentTarget.dataset.isfile;
    let fileType = event.currentTarget.dataset.filetype;
    if (!isFile) return;
    wx.downloadFile({
      url: this.data.fileUrl + id,
      success: function (res) {
        if (fileType == "pic") {
          wx.previewImage({
            urls: [res.tempFilePath],
          })
        } else {
          wx.openDocument({
            filePath: res.tempFilePath,
          });
        }
      }
    })
  }
})