const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ObjectId:0,
    BankAcc:"",
    BankName:"",
    Name:"",
    TypeId:3,
    IsError:false,
    ErrorMessage:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that=this;
    wx.showLoading({
      title: '数据加载中...',
    })
    let data = {
      url: app.globalData.serverAddress + "/Reimbursement/GetBankCardInfo",
      method:"GET",
      success: function (res) {
        wx.hideLoading();
        if(res!=null){
          that.setData({
            ObjectId:res.ObjectId,
            BankAcc:res.BankAcc,
            BankName:res.BankName,
            Name:res.Name
          });
        }
      }
    }
    app.NetRequest(data);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  submit(e){
    let that =this;
    let emptyItem = null;
    if(this.data.BankAcc.trim().length==0){
      emptyItem="银行卡号码"
    }else if(this.data.BankName.trim().length==0){
      emptyItem="银行名称"
    }else if(this.data.Name.trim().length==0){
      emptyItem="开户名"
    }
    if(emptyItem!=null){
      this.setData({
        IsError:true,
        ErrorMessage:emptyItem+"不能为空"
      });
      setTimeout(function () {
        that.setData({
          IsError: false,
          ErrorMessage: ""
        });
      }, 3000);
      return;
    }
    wx.showLoading({
      title: '数据提交中...',
    });
    let data = {
      url: app.globalData.serverAddress + "/Reimbursement/BankCardInfo",
      data: this.data,
      success: function (res) {
        wx.hideLoading();
        if (res.length == 0) {
          wx.showModal({
            showCancel:false,
            title:"提示",
            content:"数据提交成功",
            success:function(res){
              wx.navigateBack();
            }
          })
        } else {
          wx.showModal({
            showCancel: false,
            title: "操作失败",
            content: res
          });
        }
      }
    }
    app.NetRequest(data);
  }
})