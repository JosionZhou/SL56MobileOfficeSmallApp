var util = require('../../../utils/util.js');
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subFunctions: [{
        name: "申请",
        image: "apply",
        showbadge: false,
        event: "apply",
        showBadge: false
      },
      {
        name: "审批",
        image: "approval1",
        showbadge: false,
        event: "approval",
        showBadge: true
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
  //报销申请
  apply() {
    let data = {
      url: app.globalData.serverAddress + "/Reimbursement/GetBankCardInfo",
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        if (res != null) {
          wx.navigateTo({
            url: '/pages/applyandapprove/reimbursement/apply',
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
  //报销审批
  approval() {
    wx.navigateTo({
      url: '/pages/applyandapprove/reimbursement/approval',
    });
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