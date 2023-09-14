// pages/truckingshipment/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cars: [],
    truckLoadings: [],
    pageIndex: 1,
    isShowLoading: false,
    isShowNoDataMark: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var main = this;
    //显示此页面时，如果是第一页，则自动刷新
    if (main.data.pageIndex == 1) {
      main.setData({
        truckLoadings: []
      });
      wx.showLoading({
        title: '请稍后',
      });
      var data1 = {
        url: app.globalData.serverAddress + '/TruckingShipment/GetCars',
        method: "GET",
        success: function (res) {
          main.data.cars = res;
          main.getTruckLoadings();
        }
      }
      app.NetRequest(data1);
    }
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
    this.getTruckLoadings();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getTruckLoadings: function () {
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/TruckingShipment/GetTruckLoadings',
      method: "GET",
      data: {
        pageIndex: main.data.pageIndex
      },
      success: function (res) {
        var truckLoadings = main.data.truckLoadings;
        for (var i = 0; i < res.length; i++) {
          for (var j = 0; j < main.data.cars.length; j++) {
            if (main.data.cars[j].ObjectId == res[i].CarId) {
              res[i].CarNumber = main.data.cars[j].ObjectNo;
              res[i].CreateAt = res[i].CreateAt.replace(/T/, ' ');
              truckLoadings.push(res[i]);
            }
          }
        }
        main.setData({
          truckLoadings: truckLoadings,
          isShowLoading: false,
          isShowNoDataMark: res.length == 0
        });
        wx.hideLoading();
      }
    }
    app.NetRequest(data);
  },
  addTruckLoading: function (e) {
    wx.navigateTo({
      url: '/pages/truckingshipment/index',
    });
  },
  tapItem: function (e) {
    var item = e.currentTarget.dataset.item;
    app.globalData.TruckLoading = item;
  },
  release(e) {
    var main = this;
    let id = e.currentTarget.dataset.id;
    let truckLoadings = main.data.truckLoadings;
    let obj = truckLoadings.find(p => p.ObjectId == id);
    if (obj.Status == 0) {
      wx.showModal({
        title: '提示',
        content: '未发车，不能放行！',
        showCancel: false
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确定标识放行吗',
      complete: (res) => {
        if (res.confirm) {
          console.log(e.currentTarget.dataset.id);
          wx.showLoading({
            title: '请稍后...',
            mask: true
          });
          var data = {
            url: app.globalData.serverAddress + '/TruckingShipment/Release?id=' + id,
            //操作时间过长，不等待返回结果
            // success: function (res) {
            //   if(res.Success){
            //     obj.Status=2;
            //     main.setData({
            //       truckLoadings: truckLoadings,
            //     });
            //   }else{
            //     wx.showModal({
            //       title: '提示',
            //       content: '操作失败：'+res.Message,
            //       showCancel:false
            //       })
            //   }
            // },
            // fail:function(res){
            //   wx.showModal({
            //     title: '提示',
            //     content: '操作失败，请重新打开页面后重试！',
            //     showCancel:false
            //     })
            // }
          }
          app.NetRequest(data);
          wx.hideLoading();
          obj.Status = 3;
          main.setData({
            truckLoadings: truckLoadings,
          });
        }
      }
    })
  },
  vehicleInspection(e){
    var main = this;
    let id = e.currentTarget.dataset.id;
    let truckLoadings = main.data.truckLoadings;
    let obj = truckLoadings.find(p => p.ObjectId == id);
    if (obj.Status == 0) {
      wx.showModal({
        title: '提示',
        content: '未发车，不能标识查车！',
        showCancel: false
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确定标识海关查车吗',
      complete: (res) => {
        if (res.confirm) {
          console.log(e.currentTarget.dataset.id);
          wx.showLoading({
            title: '请稍后...',
            mask: true
          });
          var data = {
            url: app.globalData.serverAddress + '/TruckingShipment/VehicleInspection?id=' + id,
          }
          app.NetRequest(data);
          wx.hideLoading();
          obj.Status = 3;
          main.setData({
            truckLoadings: truckLoadings,
          });
        }
      }
    })
  }
})