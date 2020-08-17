// pages/expresssearch/addproblem.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rgdId:null,
    problems:[],
    problemNames:[],
    problemId:null,
    problemIndex:0,
    remark:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var main = this;
    main.data.rgdId=options.id;
    var data={
      url: app.globalData.serverAddress +"/Problem/GetProblemDefinitions",
      method:"GET",
      success:function(res){
        var problemNames= new Array();
        var defaultIndex=0;
        for(var i=0;i<res.length;i++){
          problemNames.push(res[i].Description);
          if(res[i].Description=="服务商拒收"){
            defaultIndex=i;
          }
        }
        main.setData({
          problems: res,
          problemNames:problemNames,
          problemIndex:defaultIndex
        });
      }
    }
    app.NetRequest(data);
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
  problemChange:function(event){
    this.setData({
      problemIndex:event.detail.value
    });
  },
  input:function(event){
    this.setData({
      remark:event.detail.value
    });
  },
  submit:function(){
    var main=this;
    wx.showLoading({
      title: '请稍后',
    });
    var data={
      url:app.globalData.serverAddress + "/Problem/AddProblem",
      data:{
        rgdId:parseInt(this.data.rgdId),
        problemId:this.data.problems[this.data.problemIndex].ObjectId,
        remark:this.data.remark
      },
      success(res){
        wx.hideLoading();
        if(res.Success){
          wx.showModal({
            title: '提示',
            content: '操作成功',
            showCancel:false,
            success:function(res){
              main.setData({
                remark:""
              });
            }
          });
        }else{
          wx.showModal({
            title: '操作失败',
            content: res.Message,
            showCancel:false
          });
        }
      },
      fail:function(res){
        wx.hideLoading();
        wx.showModal({
          title: '操作失败',
          content: res.data.message + "：" + res.data.exceptionMessage,
          showCancel:false
        })
      }
    }
    app.NetRequest(data);
  }
})