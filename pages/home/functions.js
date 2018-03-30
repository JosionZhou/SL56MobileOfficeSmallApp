var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isLogin=app.globalData.isLogin;
    if (!isLogin) {
      wx.switchTab({
        url: '/pages/login/index',
      })
    }else{
      this.setData({
        isLogin:isLogin
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
    var isLogin = app.globalData.isLogin;
    this.setData({
      isLogin:isLogin
    });
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
  scanStation: function () {
    var main = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        var result = res.result;
        if (result.length > 0) {
          var array = result.split(",");
          if (array.length == 2) {
            wx.showModal({
              title: '提示',
              content: '是否切换到 ' + array[0],
              success: function (res) {
                if (res.confirm) {
                  main.changeStation(array[1]);
                }
              }
            })
          } else {
            wx.showModal({
              title: '错误',
              content: '扫描结果异常：' + result,
              showCancel: false
            })
          }
        } else {
          wx.showModal({
            title: '错误',
            content: '扫描错误，结果为空',
            showCancel: false
          })
        }
      }
    });
  },
  changeStation: function (stationId) {
    var data = {
      url: app.globalData.serverAddress + "/Station/ChangeStation?stationId="+stationId,
      success: function (res) {
        if (res) {
          wx.showModal({
            title: '提示',
            content: '操作成功',
            showCancel: false
          })
        } else {

          wx.showModal({
            title: '提示',
            content: '操作失败',
            showCancel: false
          })
        }
      }
    };
    app.NetRequest(data);
  },
  exitStation:function(){
    wx.showModal({
      title: '警告',
      content: '退出岗位后将失去对应的绩效考核，确定退出吗？',
      success:function(res){
        if(res.confirm){
          var data = {
            url: app.globalData.serverAddress + "/Station/ExitStation",
            success: function (res) {
              if (res.length==0) {
                wx.showModal({
                  title: '提示',
                  content: '操作成功',
                  showCancel: false
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '操作失败：'+res,
                  showCancel: false
                })
              }
            }
          };
          app.NetRequest(data);
        }
      }
    })
  },
  toLogin: function () {
    wx.switchTab({
      url: '/pages/login/index',
    })
  }
})