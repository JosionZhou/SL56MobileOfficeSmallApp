var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countryList: {},
    cities:[],
    cityId:null,
    customerText:"",
    customerId:null,
    filtCountryList: {},
    modeofTransportList: {},
    modeofTransportNameList: {},
    modeofTransportIndex: 0,
    modeofTransportId: 0,
    showCountryLIst: false,
    hideCP: true,
    hideCustomer:true,
    hideDetail: true,
    countryText: "",
    countryId: null,
    ctrlText: '更多信息',
    countryWarning: false,
    weightWarning: false,
    productTypes: [
      { name: 'DOC', value: '0' },
      { name: 'WPX', value: '1', checked: true }
    ],
    volumes: [],
    volumeNames: [],
    volumeIndex: 0,
    volumeId: null,
    showErrorTips: false,
    errorTips: "",
    isLoading: false,
    rules:null,
    showRules:false,
    selectedRuleIndexs:[],
    dialogHeight:"300px",
    rulesText:"",
    SelectRuleIds:[]
  },

  /**o
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    var requestMark=0;
    var res = wx.getSystemInfoSync();
    this.setData({
      dialogHeight:res.windowHeight*0.7+"px"
    });
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/Common/GetModeOfTransportList',
      method: "GET",
      success: function (res) {
        requestMark++;
        if(requestMark==4){
          wx.hideLoading();
        }
        var names = new Array();
        for (var i = 0; i < res.length; i++) {
          names.push(res[i].Name);
        }
        main.setData({
          modeofTransportList: res,
          modeofTransportNameList: names
        });
        app.countryList = res;
      }
    }
    var data1 = {
      url: app.globalData.serverAddress + '/Common/GetCountryList',
      method: "GET",
      success: function (res) {
        requestMark++;
        if (requestMark == 4) {
          wx.hideLoading();
        }
        main.setData({
          countryList: res
        });
        app.modeOfTransportList = res
      }
    }
    var data2 = {
      url: app.globalData.serverAddress + '/Common/GetVolumetricDivisorList',
      method: "GET",
      success: function (res) {
        requestMark++;
        if (requestMark == 4) {
          wx.hideLoading();
        }
        var names = new Array();
        for (var i = 0; i < res.length; i++) {
          names.push(res[i].Name);
        }
        main.setData({
          volumes: res,
          volumeNames: names,
          volumeId: res[0].Id
        });
        app.volumes = res
      }
    }
    var data3 = {
      url: app.globalData.serverAddress + '/Calculation/GetRules',
      method: "GET",
      success: function (res) {
        requestMark++;
        if (requestMark == 4) {
          wx.hideLoading();
        }
        var items = res;
        for(var i=0;i<items.length;i++){
          items.IsSelected=false;
        }
        main.setData({
          rules:items
        });
      }
    }
    app.NetRequest(data);
    app.NetRequest(data1);
    app.NetRequest(data2);
    app.NetRequest(data3);
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
  // onShareAppMessage: function () {

  // }, 
  volumeChange: function (e) {
    this.setData({
      volumeIndex: e.detail.value,
      volumeId: this.data.volumes[e.detail.value].Id
    })
  },
  typeChange: function (e) {
    var productTypes = this.data.productTypes;
    for (var i = 0, len = productTypes.length; i < len; ++i) {
      productTypes[i].checked = productTypes[i].value == e.detail.value;
    }

    this.setData({
      productTypes: productTypes
    });
  },
  modeofTransportChange: function (e) {
    this.setData({
      modeofTransportIndex: e.detail.value,
      modeofTransportId: this.data.modeofTransportList[e.detail.value].Id
    })
  },
  search: function (e) {
    if (e.detail.value.country.trim() == "") {
      this.showErrorTips();
      this.setData({
        countryWarning: true,
        errorTips: "国家名不能为空"
      });
      return;
    } else {
      this.setData({
        countryWarning: false
      });
    };
    if (e.detail.value.weight.trim() == "") {
      this.showErrorTips();
      this.setData({
        weightWarning: true,
        errorTips: "重量不能为空"
      });
      return;
    } else {
      this.setData({
        weightWarning: false
      });
    }
    this.setData({
      isLoading: true
    });
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/Calculation/Calculate2',
      data: {
        ProductType: e.detail.value.productcode,
        CountryId: main.data.countryId,
        CityId: main.data.cityId,
        DeclaredValue: e.detail.value.declaredvalue,
        ModeOfTransportId: main.data.modeofTransportId,
        ActualWeight: e.detail.value.weight,
        Piece:e.detail.value.piece,
        PostalCode: e.detail.value.postalcode,
        SelectRuleIds: main.data.SelectRuleIds,
        CustomerId:main.data.customerId
      },
      success: function (res) {
        main.setData({
          isLoading: false
        });
        wx.hideLoading();
        if (res == null || res.length == 0) {
          wx.showModal({
            title: '提示',
            content: '当前条件查询无报价',
            showCancel: false
          });
          return;
        }
        app.priceResult = res;
        wx.navigateTo({
          url: 'priceresult'
        });
      },
      fail: function (res) {
        wx.hideLoading();
        wx.redirectTo({
          url: '/pages/pricecalculate/error',
        });
      }
    };
    app.NetRequest(data);
  },
  inputCountry: function (input) {
    var country = input.detail.value;
    this.setData({
      countryText: country
    });
    if (country == "") {
      this.setData({
        filtCountryList: {}
      });
    } else {
      var filtCountryList = new Array();
      var countryList = this.data.countryList;
      for (var i = 0; i < countryList.length; i++) {
        if (countryList[i].Name.toUpperCase().indexOf(country.toUpperCase()) != -1) {
          filtCountryList.push(countryList[i]);
        }
      }
      this.setData({
        filtCountryList: filtCountryList,
        hideCP: false
      });
    }
  },
  selectCountry: function (e) {
    var countryText = e.currentTarget.dataset["text"];
    var countryId = e.currentTarget.dataset["value"];
    var main=this;
    this.setData({
      countryText: countryText,
      countryId: countryId
    });
    hideCountryList(this);
    var data = {
      url: app.globalData.serverAddress + '/Calculation/GetCities?countryId='+countryId,
      method: "GET",
      success: function (res) {
        var names = new Array();
        for (var i = 0; i < res.length; i++) {
          names.push(res[i].ChineseName+"-"+res[i].ObjectName);
        }
        main.setData({
          cityNames: names,
          cities: res
        });
      }
    }
    app.NetRequest(data);
  },
  selectCustomer:function(e){
    var customerText = e.currentTarget.dataset["text"];
    var customerId = e.currentTarget.dataset["value"];
    var main = this;
    this.setData({
      customerText: customerText,
      customerId: customerId,
      hideCustomer:true
    });
  },
  cityChange:function(e){
    this.setData({
      cityIndex: e.detail.value,
      cityId: this.data.cities[e.detail.value].ObjectId
    })
  },
  showDetail: function (e) {
    this.setData({
      hideDetail: !this.data.hideDetail
    });
    if (this.data.hideDetail) {
      this.setData({
        ctrlText: '更多信息'
      });
    } else {
      this.setData({
        ctrlText: '简略信息'
      });
    }
  },
  showErrorTips: function () {
    var that = this;
    this.setData({
      showErrorTips: true
    });
    setTimeout(function () {
      that.setData({
        showErrorTips: false
      });
    }, 2000);
  },
  checkItem:function(e){
    var rules = this.data.rules;
    this.data.selectedRuleIndexs=new Array();
    for(var i=0;i<rules.length;i++){
      rules[i].IsSelected=false;
    }
    for(var i=0;i<e.detail.length;i++){
      rules[e.detail[i]].IsSelected=true;
      this.data.selectedRuleIndexs.push(e.detail[i]);
    }
    this.setData({
      rules:rules
    });
  },
  cancelRules:function(){
    // var rules = this.data.rules;
    // for(var i=0;i<rules.length;i++){
    //   rules[i].IsSelected=false;
    // }
    this.setData({
      showRules:false
    });
  },
  confirmRules:function(){
    var selectedRuleIndexs = this.data.selectedRuleIndexs;
    var rules = this.data.rules;
    var text="";
    for (var i = 0; i < selectedRuleIndexs.length;i++){
      text = (text + rules[selectedRuleIndexs[i]].Description+",");
      this.data.SelectRuleIds.push(rules[selectedRuleIndexs[i]].ObjectId);
    }
    this.setData({
      showRules:false,
      ruleText:text
    });
  },
  showRules:function(){
    this.setData({
      showRules:true
    });
  }
})
function hideCountryList(res) {
  res.setData({
    filtCountryList: {},
    hideCP: true
  });
}