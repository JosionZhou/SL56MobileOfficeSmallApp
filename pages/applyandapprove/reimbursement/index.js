var util = require('../../../utils/util.js')
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
        showBadge:false 
      },
      {
        name: "审批",
        image: "approval1",
        showbadge: false,
        event: "approval",
        showBadge:true 
      },
      {
        name: "我的报销",
        image: "reimbursement",
        showbadge: false,
        event: "mylist",
        showBadge:false 
      }
    ]
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
    let that=this;
    util.getWaitApprovalCount(function(res){
      that.setData({
        waitApprovalCount:res
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
    wx.navigateTo({
      url: '/pages/applyandapprove/reimbursement/apply',
    });
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
  }
})