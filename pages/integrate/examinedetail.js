// pages/integrate/examinedetail.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar1:"/image/avatar.png",
    avatar2:"",
    item:null,
    isShowButton:false,
    id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id:id
    });
    this.setData({
      avatar2: app.globalData.userInfo.avatarUrl
    });
    if (options.type == 1) {
      this.setData({
        isShowButton: true
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
    this.getData();
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
  getData: function () {
    wx.showLoading({
      title: '请稍后',
    });
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/Integrate/Detail?id=' + this.data.id,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        main.setData({
          item: res
        });
        if (res.status == 1||res.status==2){
          main.setData({
            isShowButton:false
          });
        }
        var integralType = res.integralType == 0 ? "加分" : "减分";
        wx.setNavigationBarTitle({
          title: res.createBy + "对" + res.scoreOwner + "的" + integralType + "申请",
        });
      }
    }
    app.NetRequest(data);
  },
  agree:function(){
    wx.navigateTo({
      url: 'examineagree?score='+this.data.item.score+'&objectId='+this.data.item.objectId,
    })
  },
  reject: function () {
    wx.navigateTo({
      url: 'examinereject?score=' + this.data.item.score + '&objectId=' + this.data.item.objectId,
    })
  }
})