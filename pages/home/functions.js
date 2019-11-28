var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    mainFunctions:
    [
      { name: "岗位扫描", image: "scan", event: "scanStation" },
      { name: "积分管理", image: "manager", event: "integrateManager" },
      { name: "快件查询", image: "search", event: "expresssearch" }
    ],
    subFunctions:
    [
      // { name: "申请加分", image: "add", showbadge: false, event: "addIntegrate" },
      // { name: "申请扣分", image: "minus", showbadge: false, event: "minusIntegrate" },
      // { name: "审批", image: "stamp", showbadge: false, event: "examine" },
      // { name: "申请记录", image: "history", showbadge: false, event: "record" },
      { name: "岗位退出", image: "exitstation", showbadge: false, event: "exitStation" },
      { name: "外价计算", image: "calculateprice", showbadge: false, event: "customerPrice" },
      { name: "内价计算", image: "costpricecalc", showbadge: false, event: "costPrice" }
    ],
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isLogin = app.globalData.isLogin;
    if (!isLogin) {
      wx.switchTab({
        url: '/pages/login/index',
      })
    } else {
      this.setData({
        isLogin: isLogin
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
      isLogin: isLogin
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
                  main.changeStation(array[1], array[0]);
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
  changeStation: function (stationId, stationName) {
    var data = {
      url: app.globalData.serverAddress + "/Station/ChangeStation?stationId=" + stationId,
      success: function (res) {
        if (res) {
          wx.setStorageSync("stationName", stationName);
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
  exitStation: function () {
    wx.showModal({
      title: '警告',
      content: '退出岗位后将失去对应的绩效考核，确定退出吗？',
      success: function (res) {
        if (res.confirm) {
          var data = {
            url: app.globalData.serverAddress + "/Station/ExitStation",
            success: function (res) {
              if (res.length == 0) {
                wx.removeStorageSync("stationName");
                wx.showModal({
                  title: '提示',
                  content: '操作成功',
                  showCancel: false
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '操作失败：' + res,
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
  },
  expresssearch: function () {
    wx.navigateTo({
      url: '/pages/expresssearch/index',
    })
  },
  integrateManager: function () {
    wx.navigateTo({
      url: '/pages/integrate/index',
    })
  },
  addIntegrate: function () {
    wx.navigateTo({
      url: '/pages/integrate/applyforadd',
    })
  },
  minusIntegrate: function () {
    wx.navigateTo({
      url: '/pages/integrate/applyforminus',
    })
  },
  examine: function () {
    if (this.data.count > 0) {
      wx.navigateTo({
        url: '/pages/integrate/examine',
      })
    }
  },
  record: function () {
    wx.navigateTo({
      url: '/pages/integrate/record',
    })
  },
  customerPrice: function () {
    wx.navigateTo({
      url: '/pages/customerpricecalc/index',
    })
  },
  costPrice: function () {
    wx.navigateTo({
      url: '/pages/costpricecalc/index',
    })
  }
})