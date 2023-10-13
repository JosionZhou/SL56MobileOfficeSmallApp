// pages/customerinterview/interviewmanager/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    pageIndex:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getData();
  },
  getData(){
    let main =this;
    if(main.data.isShowNoDataMark){
      return;
    }
    main.setData({
      isShowLoading:true
    });
    var data = {
      url: app.globalData.serverAddress + '/Interview/GetManagerInterviewHistory?pageIndex='+main.data.pageIndex,
      method: "GET",
      success: function (res) {
        console.log(res);
        let list = main.data.list;
        if(res.Data.length>0){
          res.Data.forEach(element => {
            list.push(element);
          });
          main.setData({
            list:list,
            isShowLoading:false
          });
          if(res.Data.length<20){
            main.setData({
              isShowNoDataMark:true
            });
          }
        }else{
          main.setData({
            isShowLoading:false,
            isShowNoDataMark:true
          });
        }
      },
      fail:function(err){
        console.log(err);
        wx.showToast({
          icon:"none",
          mask:true,
          duration:3000,
          title: err.data.Message+'：'+err.data.ExceptionMessage,
        });
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
    if (this.data.isShowNoDataMark) {
      return;
    }
    this.setData({
      isShowLoading: true
    });
    this.data.pageIndex = this.data.pageIndex + 1;
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  readNote(e){
    wx.navigateTo({
      url: '../interviewnote/history?interviewId='+e.target.dataset.id+'&name='+e.target.dataset.name,
    })
  }
})