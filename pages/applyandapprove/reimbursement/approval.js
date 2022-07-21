const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    IsSelectAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

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
    wx.showLoading({
      title: '获取数据中...',
    });
    let data = {
      url: app.globalData.serverAddress + "/Reimbursement/ApprovalList",
      method: "GET",
      success: function (res) {
        that.setData({
          items: res
        });
        wx.hideLoading();
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: "获取数据失败",
          content: res
        });
      }
    }
    app.NetRequest(data);
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
  approval(e) {
    let data = this.data.items[e.currentTarget.dataset.index];
    data.IsApprovaling = true;
    let params = JSON.stringify(data);
    wx.navigateTo({
      url: './apply?item=' + params
    });
  },
  check(e) {
    let id = e.currentTarget.dataset.id;
    let items = this.data.items;
    items.forEach(element => {
      if (element.FormId == id) {
        element.IsSelected = !element.IsSelected;
      }
    });
    this.setData({
      items: items
    });
    let selectCount = this.data.items.filter(p => p.IsSelected).length;
    if (selectCount == this.data.items.length) {
      this.setData({
        IsSelectAll: true
      });
    } else {
      this.setData({
        IsSelectAll: false
      });
    }
    console.log(this.data.items);
  },
  checkAll(e) {
    let items = this.data.items;
    let selected = this.data.IsSelectAll;
    items.forEach(element => {
      element.IsSelected = !selected;
    });
    this.setData({
      items: items,
      IsSelectAll: !selected
    });
  },
  doApprovalAction(postData, action) {
    var that=this;
    wx.showLoading({
      title: '数据提交中...',
    });
    let data = {
      url: app.globalData.serverAddress + "/Reimbursement/"+action,
      data: postData,
      success: function (res) {
        wx.hideLoading();
        if (res.length == 0) {
          that.setData({
            IsSelectAll:false
          });
          that.onShow();
        } else {
          wx.showModal({
            showCancel: false,
            title: "操作失败",
            content: res
          });
        }
      },
      fail:function(res){
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: "操作失败",
          content: "请重试"
        });
      }
    }
    app.NetRequest(data);
  },
  agree(e) {
    let action="Approval";
    let id= e.currentTarget.dataset.id;
    let item = this.data.items.find(p=>p.FormId==id);
    item.IsPass=true;
    this.doApprovalAction(item,action);
  },
  reject(e) {
    let action="Approval";
    let id= e.currentTarget.dataset.id;
    let item = this.data.items.find(p=>p.FormId==id);
    item.IsPass=false;
    this.doApprovalAction(item,action);
  },
  batchAgree() {
    let action="Approvals";
    let selectItems = this.data.items.filter(p=>p.IsSelected);
    selectItems.forEach(element => {
      element.IsPass=true;
      element.Remark="批量同意";
    });
    this.doApprovalAction(selectItems,action);
  },
  batchReject() {
    let action="Approvals";
    let selectItems = this.data.items.filter(p=>p.IsSelected);
    selectItems.forEach(element => {
      element.IsPass=false;
      element.Remark="批量拒绝";
    });
    this.doApprovalAction(selectItems,action);
  }
})