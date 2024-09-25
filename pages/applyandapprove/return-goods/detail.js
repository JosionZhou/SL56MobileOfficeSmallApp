const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let main=this;
    let obj = JSON.parse(decodeURIComponent(options.item));
    this.setData(obj);
    let data = {
      url: app.globalData.serverAddress + "/Workflow/GetReturnRgds?workflowId="+obj.WorkflowId+"&formId=" + obj.FormId + "&instanceId=" + obj.InstanceId,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        main.setData({
          Remark:res.Data.Remark,
          Rgds:res.Data.Rgds,
          Activities:res.Data.Tracks,
          TakeGoodsPersonName:res.Data.TakeGoodsPersonName
        });
      }
    }
    wx.showLoading({
      title: '请稍后',
    });
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
  submit() {
    let main = this;
    if (main.data.IsPass == null) {
      wx.showModal({
        title: '提示',
        content: '请选择审核结果',
        showCancel: false
      });
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确定审核结果为：' + (main.data.IsPass ? '同意' : '拒绝') + ' 吗？',
      complete: (res) => {
        if (res.cancel) {

        }
        if (res.confirm) {
          main.doSubmit();
        }
      }
    })
  },
  doSubmit() {
    let main=this;
    let data = {
      url: app.globalData.serverAddress + "/Workflow/ToExamine",
      method: "POST",
      data:{
        WorkflowId:main.data.WorkflowId,
        FormId:main.data.FormId,
        TaskId:main.data.TaskId,
        TaskDefinitionKey:main.data.TaskDefinitionKey,
        IsPass:main.data.IsPass,
        Remark:main.data.ApprovalRemark==null?"":main.data.ApprovalRemark
      },
      success:function(res){
        wx.hideLoading();
        if(res.Success){
          wx.navigateBack();
        }else{
          wx.showModal({
            title: '操作失败',
            content: res.ErrorMessage,
            showCancel:false
          })
        }
      },
      fail:function(err){
        wx.hideLoading();
        wx.showModal({
          title: '操作失败',
          content: err.data.ExceptionMessage,
          showCancel:false
        })
      }
    }
    wx.showLoading({
      title: '请稍后',
    })
    app.NetRequest(data);
  },
  approvalChange(event) {
    this.setData({
      IsPass: event.detail.value == "0"
    });
  }
})