var app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stations:[],
    stationNames: [],
    stationIndex:0,
    stationId:null,
    middleWidth:0,
    circleBtnWidth:0,
    stationMembers:[],
    hideSearch:true,
    searchFocus:false,
    searchResult:[],
    showSearchResultView:false,
    key:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var stationNames = new Array();
    for(var i=0;i<app.stations.length;i++){
      stationNames.push(app.stations[i].Name)
    }
    this.setData({
      stations: app.stations,
      stationNames: stationNames,
      stationId: app.stations[0].Id
    });
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          middleWidth:res.windowWidth/2,
          circleBtnWidth: res.windowWidth / 6
        });
      },
    });
    this.getStationMembers();
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
  stationChange: function (e) {
    this.setData({
      stationIndex: e.detail.value,
      stationId: this.data.stations[e.detail.value].Id
    });
    this.getStationMembers();
  },
  getStationMembers:function(){
    var that=this;
    wx.showLoading({
      title: '获取成员信息',
    });
    var data = {
      url: app.globalData.serverAddress + '/Station/GetMembers?stationId='+that.data.stationId,
      method: "GET",
      success: function (res) {
        if(res!=null && res.length>0){
          that.setData({
            stationMembers:res
          });
        }
        wx.hideLoading();
      }
    }
    app.NetRequest(data);
  },
  removeMember:function(e){
    var that=this;
    var empId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '警告',
      content: '确定移除当前成员？id:'+empId,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#004ea2',
      confirmText: '确定',
      confirmColor: 'red',
      success: function(res) {
        if(res.confirm){
          wx.showLoading({
            title: '处理中',
          });
          var data = {
            url: app.globalData.serverAddress + '/Station/RemoveStationMember?stationId='+that.data.stationId+'&empId=' + empId,
            method: "POST",
            success: function (res) {
              if (res.length > 0) {
                wx.showModal({
                  title: '操作失败',
                  content: res,
                  showCancel: false
                })
              }
              else {
                wx.hideLoading();
                that.getStationMembers();
              }
            }
          }
          app.NetRequest(data);
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    });
  },
  addMember:function(){
    this.setData({
      hideSearch:false,
      searchFocus:true
    });
  },
  search: function (e) {
    var that = this;
    if(e.detail.value.trim().length==0)
    {
      that.setData({
        searchResult: [],
        showSearchResultView: false
      });
      return;
    }
    var data = {
      url: app.globalData.serverAddress + '/Station/SearchMembers?key='+e.detail.value,
      method: "GET",
      success: function (res) {
        if(res.length>0){
          that.setData({
            searchResult:res,
            showSearchResultView:true
          });
        }else{
          that.setData({
            searchResult: [],
            showSearchResultView: false
          });
        }
      }
    }
    app.NetRequest(data);
  },
  selectEmployee:function(e){
    var that=this;
    var name = e.currentTarget.dataset["name"];
    var id = e.currentTarget.dataset["id"];
    wx.showModal({
      title: '提示',
      content: '确定将 [' + name + '] 添加到当前岗位？',
      cancelColor: '#004ea2',
      confirmColor: 'red',
      success:function(res){
        if(res.confirm){
          wx.showLoading({
            title: '处理中',
          });
          var data = {
            url: app.globalData.serverAddress + '/Station/AddStationMember?stationId=' + that.data.stationId + '&empId=' + id,
            method: "POST",
            success: function (res) {
              wx.hideLoading();
              if(res.length>0){
                wx.showModal({
                  title: '操作失败',
                  content: res,
                  showCancel:false
                })
              }else{
                that.setData({
                  showSearchResultView:false,
                  key:"",
                  hideSearch:true
                });
                that.getStationMembers();
              }
            }
          }
          app.NetRequest(data);
        }
      }
    })
  }
})