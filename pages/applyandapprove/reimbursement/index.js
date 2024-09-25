var util = require('../../../utils/util.js');
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subFunctions: [{
        name: "对内用款申请",
        image: "in_apply",
        showbadge: false,
        event: "inApply",
        showBadge: false
      },{
        name: "对外用款申请",
        image: "out_apply",
        showbadge: false,
        event: "outApply",
        showBadge: false
      },
      {
        name: "我的报销",
        image: "reimbursement",
        showbadge: false,
        event: "mylist",
        showBadge: false
      },
      {
        name: "审批历史",
        image: "approval1",
        showbadge: false,
        event: "approvalhistory",
        showBadge: false
      }
    ],
    bankAccountId: null
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
    let that = this;
    util.getWaitApprovalCount(function (res) {
      that.setData({
        waitApprovalCount: res
      });
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  //对内用款申请
  inApply(){
    this.apply(1);
  },
  //对外用款申请
  outApply(){
    this.apply(2);
  },
  //报销申请
  apply(type) {
    let data = {
      url: app.globalData.serverAddress + "/Reimbursement/GetBankCardInfo",
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        if (res != null) {
          wx.navigateTo({
            url: '/pages/applyandapprove/reimbursement/apply?type='+type,
          });
        } else {
          wx.showModal({
            showCancel: false,
            title: "提示",
            content: "报销申请前，需要完善银行卡信息",
            success: function (res) {
              wx.navigateTo({
                url: '/pages/bankcardinfo/index',
              })
            }
          })
        }
      }
    }
    app.NetRequest(data);
  },
  mylist() {
    wx.navigateTo({
      url: '/pages/applyandapprove/reimbursement/mylist',
    });
  },
  approvalhistory(){
    wx.navigateTo({
      url: '/pages/applyandapprove/reimbursement/approvalhistory',
    });
  }
})