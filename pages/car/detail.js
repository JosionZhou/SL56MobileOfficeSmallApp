var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    car: new Object()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var main = this;
    if (id != null) {
      wx.showLoading({
        title: '请稍后',
      });
      var data1 = {
        url: app.globalData.serverAddress + '/Car/GetCar?id=' + id,
        method: "GET",
        success: function (res) {
          main.setData({
            car: res
          });
          wx.hideLoading();
        }
      }
      app.NetRequest(data1);
    } else {
      var obj = new Object();
      obj.Status = 0;
      obj.ObjectNo = null;
      obj.Remark = null;
      main.setData({
        car: obj
      });
    }
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
  onShareAppMessage: function () {

  },
  save: function () {
    if (this.data.car.ObjectNo == null || this.data.car.ObjectNo.trim().length == 0) {
      wx.showModal({
        content: "车牌号码不能为空",
        showCancel: false
      });
      return;
    }
    var url = app.globalData.serverAddress;
    if (this.data.car.ObjectId != null) {
      url = url + "/Car/Update";
    } else {
      url = url + "/Car/Add";
    }

    wx.showLoading({
      title: '请稍后',
    });
    var data = {
      url: url,
      method: "POST",
      data: this.data.car,
      success: function (res) {
        wx.hideLoading();
        if (res.Success) {
          wx.navigateBack();
        } else {
          wx.showModal({
            title: "保存失败",
            content: res.Message,
            showCancel: false
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: res.data.Message,
          content: res.data.ExceptionMessage,
          showCancel: false
        })
      }
    }
    app.NetRequest(data);
  },
  delete: function () {
    var main=this;
    wx.showModal({
      title: "警告",
      content: "确定删除吗？",
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍后',
          });
          var data = {
            url: app.globalData.serverAddress+"/Car/Delete",
            method: "DELETE",
            data: main.data.car,
            success: function (res) {
              wx.hideLoading();
              if (res.Success) {
                wx.navigateBack();
              } else {
                wx.showModal({
                  title: "删除失败",
                  content: res.Message,
                  showCancel: false
                })
              }
            },
            fail: function (res) {
              wx.hideLoading();
              wx.showModal({
                title: res.data.Message,
                content: res.data.ExceptionMessage,
                showCancel: false
              })
            }
          }
          app.NetRequest(data);
        }
      }
    })
  },
  switchStatus: function () {
    var tempData = this.data.car;
    if (tempData.Status == 0) {
      tempData.Status = 1;
    } else {
      tempData.Status = 0;
    }
    this.setData({
      car: tempData
    });
  },
  inputInfo: function (e) {
    var car = this.data.car;
    switch (e.target.id) {
      case "ObjectNo":
        car.ObjectNo = e.detail.value;
        break;
      case "Remark":
        car.Remark = e.detail.value;
        break;
    }
    this.setData({
      car: car
    });
  }
})