import WxValidate from '../../../utils/WxValidate'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ObjectName: null,
    Amount: null,
    CurrencyIndex: 0,
    Remark: "",
    IsError: false,
    ErrorMessage: "",
    EditDetail:null,
    IsEditable:true,
    IsContinue:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    let detail = new Object();
    detail.ObjectName = null;
    detail.Amount = null;
    this.setData({
      Detail: detail
    });
    wx.showLoading({
      title: '加载中...',
    })
    let data1 = {
      url: app.globalData.serverAddress + "/Data/GetDepartments",
      method: "GET",
      success: function (res) {
        let departmentNames = res.map(p => p.ObjectName);
        that.setData({
          Departments: res,
          DepartmentNames: departmentNames
        });
        app.NetRequest(data2);
      }
    };
    let data2 = {
      url: app.globalData.serverAddress + "/Data/GetCurrencies",
      method: "GET",
      success: function (res) {
        let currencyNames = res.map(p => p.ObjectName);
        that.setData({
          Currencies: res,
          CurrencyNames: currencyNames
        });
        app.NetRequest(data3);
      }
    };
    let data3 = {
      url: app.globalData.serverAddress + "/Data/GetIsUseCars",
      method: "GET",
      success: function (res) {
        let carNos = res.map(p => p.ObjectNo);
        that.setData({
          Cars: res,
          CarNos: carNos
        });
        that.setDetailInfo();
        wx.hideLoading();
      }
    };
    app.NetRequest(data1);
    // 验证字段的规则
    const rules = {
      ObjectName: {
        required: true
      },
      Amount: {
        required: true,
        min: 0.01
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      ObjectName: {
        required: '报销明细名称不能为空'
      },
      Amount: {
        required: '报销明细金额不能为空',
        min: '报销明细金额最为 0.01'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)

    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('editDetail', function (detail) {
      that.setData({
        EditDetail:detail.data
      });
    });
  },

  setDetailInfo(){
    let data =this.data.EditDetail;
    if(data==null)return;
    let currencyIndex,departmentIndex,carIndex=null;
    currencyIndex=this.data.Currencies.findIndex(p=>p.ObjectId==data.CurrencyId);
    if(data.DepartmentId!=null){
      departmentIndex=this.data.Departments.findIndex(p=>p.ObjectId==data.DepartmentId);
    }
    if(data.ItemId!=null){
      carIndex=this.data.Cars.findIndex(p=>p.ObjectId==data.ItemId);
    }
    this.setData({
      IsEditable:data.IsEditable,
      ObjectName:data.ObjectName,
      Amount:data.Amount,
      Remark:data.Remark,
      CurrencyIndex:currencyIndex,
      DepartmentIndex:departmentIndex,
      CarIndex:carIndex
    });
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
  add(e) {
    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(e.detail.value)) {
      this.setData({
        IsError: true,
        ErrorMessage: this.WxValidate.errorList[0].msg
      });
      let that = this;
      setTimeout(function () {
        that.setData({
          IsError: false,
          ErrorMessage: ""
        });
      }, 3000);
      return false;
    } else {
      const eventChannel = this.getOpenerEventChannel();
      let Detail = this.data.Detail;
      Detail.ObjectName = this.data.ObjectName;
      Detail.Amount = this.data.Amount;
      Detail.CurrencyId = this.data.Currencies[this.data.CurrencyIndex].ObjectId;
      Detail.Remark = this.data.Remark;
      Detail.CurrencyName=this.data.Currencies[this.data.CurrencyIndex].ObjectName;
      if (this.data.DepartmentIndex !=null) {
        Detail.DepartmentId = this.data.Departments[this.data.DepartmentIndex].ObjectId;
      }
      if (this.data.CarIndex !=null) {
        Detail.ItemId = this.data.Cars[this.data.CarIndex].ObjectId;
      }
      eventChannel.emit('addDetail', {
        data: Detail
      });
      if(this.data.IsContinue){
        this.addAndNext();
      }else{
        wx.navigateBack();
      }
    }
  },
  addAndNext(){
    let data= {
      ObjectName: null,
      Amount: null,
      CurrencyIndex: 0,
      Remark: "",
      IsError: false,
      ErrorMessage: "",
      EditDetail:null,
      IsEditable:true,
      IsContinue:false
    }
    this.setData(data)
    this.onLoad();
  },
  tapNext(){
    this.setData({
      IsContinue:true
    })
  }
})