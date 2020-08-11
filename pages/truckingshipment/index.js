var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNew: false,
    truckLoadingTypes:['香港','分公司','第三方'],
    truckLoadingNo:'待生成',
    truckLoadingTypeIndex:0,
    companys:[],
    companyNames:[],
    companyIndex:null,
    companyId:null,
    cars:[],
    carNumbers:[],
    carNumber:'待选择',
    referenceNumbers:[],
    selectedCarIndex:null,
    selectedCarId:null,
    palletNumbers:[],
    isShowReferenceNumber:false,
    status:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var main = this;
    var id = options.id;
    var truckLoading = app.globalData.TruckLoading;
    if (truckLoading!=null){
      main.setData({
        truckLoadingNo: truckLoading.ObjectNo,
        carNumber:truckLoading.CarNumber,
        truckLoadingTypeIndex: truckLoading.TruckLoadingType,
        companyId: truckLoading.ToCompanyId,
        status:truckLoading.Status
      });
      app.globalData.TruckLoading=null;
    }
    var data1={
      url: app.globalData.serverAddress + '/TruckingShipment/GetCars',
      method:"GET",
      success: function (res) {
        var carNumbers = new Array();
        for(var i=0;i<res.length;i++){
          carNumbers.push(res[i].ObjectNo);
        }
        main.setData({
          cars: res,
          carNumbers: carNumbers
        });
      }
    }
    var data2 = {
      url: app.globalData.serverAddress + '/TruckingShipment/GetCompanys',
      method: "GET",
      success: function (res) {
        var companyNames = new Array();
        var companyIndex=null;
        for(var i=0;i<res.length;i++){
          companyNames.push(res[i].ObjectName)
          if(main.data.companyId==res[i].ObjectId){
            companyIndex=i;
          }
        }
        main.setData({
          companys:res,
          companyNames:companyNames,
          companyIndex:companyIndex
        });
      }
    }
    if(id!=null)
    {
      var data3={
        url: app.globalData.serverAddress + '/TruckingShipment/GetTruckLoadingDetail',
        method: "GET",
        data:{
          id:id
        },
        success:function(res){
          var isShowReferenceNumber = res.PalletNos.length==0 || res.PalletNos[0].length==0;
          console.log(res.PalletNos.length);
          main.setData({
            referenceNumbers:res.ReferenceNumbers,
            palletNumbers:res.PalletNos,
            isShowReferenceNumber: isShowReferenceNumber
          });
        }
      }
      app.NetRequest(data3);
    }else{
      main.setData({
        isNew:true
      });
    }
    app.NetRequest(data1);
    app.NetRequest(data2);
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
  carChange:function(e){
    this.setData({
      selectedCarIndex: e.detail.value,
      carNumber: this.data.cars[e.detail.value].ObjectNo,
      selectedCarId: this.data.cars[e.detail.value].ObjectId
    })
  },
  scanPalletNo:function(e){
    var main=this;
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        var result = res.result;
        if (result.length > 0) {
          var reg = /^P-\d{4}\/\d{2}\/\d{2}-\d{3,}$/;
          if(reg.test(result))
          {
            var palletNumbers = main.data.palletNumbers;
            if(palletNumbers.indexOf(result)==-1)
            {
              palletNumbers.push(result);
              main.setData({
                palletNumbers:palletNumbers
              });
            }else{
              wx.showToast({
                title: '板号已存在',
                icon:"none"
              });
            }
          }
          else{
            wx.showModal({
              title: '错误',
              content: '板号格式不正确',
              showCancel:false
            })
          }
        } else {
          wx.showModal({
            title: '错误',
            content: '扫描错误，结果为空',
            showCancel: false
          })
        }
      }
    });
  },
  showRemoveMenu: function (e) {
    var main=this;
    if(!this.data.isNew){
      return;
    }
    wx.showActionSheet({
      itemList: ['移除板号'],
      itemColor:'#f44455',
      success: function (res) {
        if (!res.cancel && res.tapIndex==0) {
          var tapNo = e.currentTarget.dataset.no;
          var palletNumbers = main.data.palletNumbers;
          palletNumbers.splice(palletNumbers.indexOf(tapNo),1);
          main.setData({
            palletNumbers:palletNumbers
          });
        }
      }
    });
  },
  truckingShipment:function(){
    var main=this;
    if(this.data.truckLoadingTypeIndex==1 && this.data.companyId==null){
      wx.showModal({
        title: '提示',
        content: '请选择分公司',
        showCancel: false
      });
      return;
    }
    if(this.data.selectedCarId==null){
      wx.showModal({
        title: '提示',
        content: '请选择车牌号',
        showCancel:false
      });
      return;
    }
    if(this.data.palletNumbers.length==0){
      wx.showModal({
        title: '提示',
        content: '请扫描添加板号',
        showCancel: false
      });
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认出货吗？\n 出货后板号将不可修改！',
      success:function(res){
        if(res.confirm){
          wx.showLoading({
            title: '请稍后',
          });
          var data = {
            url: app.globalData.serverAddress + '/TruckingShipment/TruckLoading',
            type: 'POST',
            data: {
              truckLoadingType: main.data.truckLoadingTypeIndex,
              toCompanyId: main.data.companyId,
              palletizedNos: main.data.palletNumbers.toString(),
              carId:main.data.selectedCarId
            },
            success: function (res) {
              wx.hideLoading();
              if (res.Success) {
                main.setData({
                  truckLoadingNo: res.Message,
                  isNew: false,
                  status: 1
                });
              } else {
                wx.showModal({
                  title: '错误',
                  content: res.Message,
                  showCancel: false
                });
              }
            },
            fail:function(res){
              wx.hideLoading();
              console.log(res);
              wx.showModal({
                title: '操作失败',
                content: res.data.message + "：" + res.data.exceptionMessage,
                showCancel:false
              })
            }
          }
          app.NetRequest(data);
        }
      }
    });
  },
  truckLoadingTypeChange: function (e) {
    this.setData({
      truckLoadingTypeIndex: parseInt(e.detail.value)
    })
  },
  companyChange:function(e){
    var main=this;
    this.setData({
      companyId:main.data.companys[e.detail.value].ObjectId,
      companyIndex: e.detail.value
    });
  },
  toggleNo:function(e){
    this.setData({
      isShowReferenceNumber:e.detail.value
    });
  }
})