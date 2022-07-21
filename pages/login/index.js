// pages/login/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorTips: "",
    showErrorTips: false,
    uerNameWarning: false,
    passwordWarning: false,
    userName: "",
    password: "",
    isLogin:false,
    avatar:"/image/avatar.png",
    nameInfo:"",
    stationName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var main = this;
    wx.login({
      success: function (res) {
        app.globalData.js_code = res.code;
        wx.getUserInfo({
          success: function (res) {
            app.globalData.userInfo = res.userInfo;
            console.log(res.userInfo.avatarUrl);
            main.setData({
              avatar: res.userInfo.avatarUrl
            });
            wx.showLoading({
              title: '请稍后',
              mask: true
            })
            main.wxOauth();
          }
        })
      }
    });

    var headImgWidth = parseInt(wx.getSystemInfoSync().windowWidth * 0.2);
    var cameraLeft = parseInt(headImgWidth / 2) - 5;
    this.setData({
      headImgWidth: headImgWidth,
      rightBoxWidth: wx.getSystemInfoSync().windowWidth - headImgWidth - 10,
      cameraLeft: cameraLeft
    });
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
    var stationName = wx.getStorageSync("stationName");
    this.setData({
      stationName:stationName
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
  userInfoHandler: function (e) {
    if (e.detail.errMsg.indexOf("fail") != -1) {//微信用户未授权(获取用户公开信息)给当前小程序
      wx.showModal({
        title: '提示',
        content: '请先同意授权后再登录',
        showCancel: false
      });
    } else {
      if (app.globalData.openId != null && app.globalData.openId != "") {
        this.login();
      } else {
        this.doAuth();
      }
    }
  },
  inputUserName: function (e) {
    this.setData({
      userName: e.detail.value
    });
  },
  inputPassword: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  login: function () {
    wx.removeStorageSync("ASPSESSID");//移除保存的会话id
    wx.removeStorageSync("ASPAUTH");//移除保存的凭证
    var userName = this.data.userName;
    var password = this.data.password;
    if (userName.trim().length == 0) {
      this.setData({
        errorTips: "账号不能为空",
        userNameWarning: true
      });
      this.showErrorTips();
      return;
    }
    if (password.trim().length == 0) {
      this.setData({
        errorTips: "密码不能为空",
        passwordWarning: true
      });
      this.showErrorTips();
      return;
    }
    wx.showLoading({
      title: '登录中',
      mask: true
    });
    var main = this;
    wx.request({
      url: app.globalData.serverAddress + '/account/logon1',
      method: 'POST',
      data: {
        Username: userName,
        Password: password,
        OpenId: app.globalData.openId,
        AvatarUrl: app.globalData.userInfo.avatarUrl
      },
      success: function (res) {
        //登录验证返回true
        if (res.data) {
          wx.hideLoading();
          var jumpUrl = "/pages/home/functions"
          main.getAuthInfo(jumpUrl);
        }
        else {
          wx.hideLoading();
          wx.showModal({
            title: '登录失败',
            showCancel: false,
            content: '用户名或密码不正确',
          })
        }
      },
      fail: function (msg) {
      }
    })
  },
  //当前客户端与服务端的身份凭证是否有效
  getIsAuthenticated: function (authCallback, unAuthCallback) {
    var data = {
      url: app.globalData.serverAddress + "/Account/IsAuthenticated",
      method: "GET",
      success: authCallback,
      fail: unAuthCallback,
    };
    app.NetRequest(data);
  },
  wxOauth: function () {
    var main = this;
    //凭证未失效
    var authCallback = function () {
      wx.hideLoading();
      app.globalData.id = wx.getStorageSync("id");
      app.globalData.isLogin=true;
      var nameInfo = wx.getStorageSync("nameInfo");
      var stationName = wx.getStorageSync("stationName");
      main.setData({
        isLogin:true,
        nameInfo:nameInfo,
        stationName:stationName
      });
      wx.setNavigationBarTitle({
        title: "个人中心",
      });
      wx.switchTab({
        url: '/pages/home/functions',
      });
    }
    //凭证失效
    var unAuthCallback = function () {
      wx.hideLoading();
      wx.removeStorageSync("ASPSESSID");//移除保存的会话id
      wx.removeStorageSync("ASPAUTH");//移除保存的凭证
      main.doAuth();
    }
    this.getIsAuthenticated(authCallback, unAuthCallback);
  },
  doAuth: function () {
    wx.showLoading({
      title: '请稍后',
    });
    var main = this;
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo;
        app.globalData.encryptedData = res.encryptedData;
        app.globalData.iv = res.iv;
        var url = app.globalData.authServerAddress + "/WeChatAuth/OAuth6";
        var success = function (res) {
          wx.hideLoading();
          app.globalData.openId = res.openid;
          wx.setStorageSync("OpenId", res.openid);
          if (res.islogin) {
            main.getAuthInfo();
          }
        };
        var fail = function (res) {
          wx.hideLoading();
          var index1 = res.data.indexOf("<title>");
          var index2 = res.data.indexOf("</title>");
          var errMsg = "";
          if (index1 != -1) {
            errMsg = res.data.substr(index1 + 7, index2 - (index1 + 7));
          }
          if (errMsg.length == 0) {
            errMsg = res.data;
          }
          wx.showModal({
            title: '获取验证失败',
            content: errMsg,
            showCancel: false
          });
        }
        var data = {
          url: url,
          success: success,
          fail: fail,
          data: {
            code: app.globalData.js_code,
            iv: app.globalData.iv,
            encryptedData: app.globalData.encryptedData
          }
        };
        app.NetRequest(data);
      }
    })
  },
  getAuthInfo: function (jumpUrl) {
    var main=this;
    var data = {
      url: app.globalData.authServerAddress + "/WeChatAuth/GetAuth6Info",
      data: {
        openId: app.globalData.openId
      },
      success: function (res) {
        wx.setStorageSync("ASPSESSID", res.session_id);//存储sessionId
        wx.setStorageSync("ASPAUTH", res.auth);//存储服务器验证信息
        wx.setStorageSync("nameInfo", res.objectno+"/"+res.objectname);
        wx.setStorageSync("stationName", res.stationname);
        app.globalData.id = res.id;
        wx.setStorageSync("id", res.id);
        app.globalData.isLogin=true;
        main.setData({
          isLogin:true,
          nameInfo: res.objectno + "/" + res.objectname,
          stationName:res.stationname
        });
        wx.setNavigationBarTitle({
          title: "个人中心",
        });
        if (jumpUrl == null) {
          jumpUrl = "/pages/home/functions";
        }
        wx.switchTab({
          url: jumpUrl,
        })
      }
    };
    app.NetRequest(data);
  },
  showErrorTips: function () {
    var that = this;
    this.setData({
      showErrorTips: true
    });
    setTimeout(function () {
      that.setData({
        showErrorTips: false,
        userNameWarning: false,
        passwordWarning: false
      });
    }, 2000);
  },
  changeAccount: function () {
    var main=this;
    wx.showModal({
      title: '提示',
      content: '是否切换账号',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍后',
          });
          var data = {
            url: app.globalData.serverAddress + "/BusinessCard/Unbind?id=" + app.globalData.id,
            success: function (res) {
              wx.hideLoading();
              if (res) {
                wx.removeStorageSync("ASPSESSID");//移除保存的会话id
                wx.removeStorageSync("ASPAUTH");//移除保存的凭证
                app.globalData.isLogin = false;
                main.setData({
                  isLogin: false
                });
              } else {
                wx.showModal({
                  title: "解绑失败",
                  showCancel: false
                })
              }

            },
            fail: function (res) {
              wx.hideLoading();
              wx.showModal({
                title: "操作异常",
                content: res,
                showCancel: false
              })
            }
          };
          app.NetRequest(data);
        }
      }
    });
  },
  bankInfo(){
    wx.navigateTo({
      url: '/pages/bankcardinfo/index',
    })
  }
})