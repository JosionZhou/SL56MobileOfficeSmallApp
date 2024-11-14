// pages/applyandapprove/all-workflows/all-workflows.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      pageIndex:1,
      items:[],
      isNoData:false,
      types:[
        {
          id:8,
          name:"对内用款",
          checked:true
        },
        {
          id:9,
          name:"对外用款",
          checked:true
        },
        {
          id:10,
          name:"未确认费用",
          checked:true
        },
        {
          id:7,
          name:"费用调减",
          checked:true
        },
        {
          id:6,
          name:"退货",
          checked:false
        }
      ],
      selectedWorkflowIds:"8,9,10,7"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.getData();
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
      if(!this.data.isNoData){
        let pageIndex=this.data.pageIndex;
        this.setData({
          pageIndex:pageIndex+1
        });
        this.getData();
      }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    getData(){
      let that = this;
      wx.showLoading({
        title: '获取数据中...',
      });
      let data = {
        url: app.globalData.serverAddress + "/Workflow/GetAllWorkflows?pageIndex="+that.data.pageIndex+"&workflowIds="+this.data.selectedWorkflowIds,
        method: "GET",
        success: function (res) {
          let items = that.data.items;
          res.forEach(element => {
            items.push(element);
          });
          that.setData({
            items: items
          });
          if(res.length==0){
            that.setData({
              isNoData:true
            })
          }
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
    checkboxChange(e){
      let checkedIndexes = e.detail.value;
      let selectedWorkflowIds = new Array();
      checkedIndexes.forEach(index => {
        selectedWorkflowIds.push(this.data.types[index].id);
      });
      this.setData({
        selectedWorkflowIds:selectedWorkflowIds.toString(),
        pageIndex:1,
        items:[]
      });
      if(this.data.selectedWorkflowIds.length>0){
        this.getData();
      }
    },
    detail(e) {
      let data = this.data.items[e.currentTarget.dataset.index];
      data.IsApprovaling = true;
      data.IsEditable=false;
      data.IsApprovaling=false;
      let params = JSON.stringify(data);
      //退货申请
      if(data.WorkflowId==6){
        wx.navigateTo({
          url: '../return-goods/detail?item='+encodeURIComponent(params),
        })
      }else if (data.WorkflowId == 8 || data.WorkflowId == 9) {//对内/对外用款申请
        wx.navigateTo({
          url: '../reimbursement/apply?item=' + encodeURIComponent(params)
        });
      }else if(data.WorkflowId==7){//费用调减
        wx.navigateTo({
          url: '../fee-decrease-or-waiver/detail?item=' + encodeURIComponent(params)
        });
      }else if(data.WorkflowId==10){//未确认费用
        wx.navigateTo({
          url: '../feedisputed/detail?item='+encodeURIComponent(params),
        })
      }
    }
})