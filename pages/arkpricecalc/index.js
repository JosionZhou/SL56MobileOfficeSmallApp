import WxValidator from '../../utils/WxValidate';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countryList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    var data = {
      url: app.globalData.serverAddress + '/Common/GetArkCountryList',
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        that.setData({
          countryList: res
        });
        app.modeOfTransportList = res
      }
    }
    app.NetRequest(data);
    // 验证字段的规则
    const rules = {
      dateStart: {
        required: true
      },
      dateEnd: {
        required: true
      },
      startCountry: {
        required: true
      },
      postcode1: {
        required: true
      },
      endCountry: {
        required: true
      },
      postcode2: {
        required: true
      },
      declaredvalue: {
        min: 0
      },
      piece: {
        required: true,
        min: 1
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      dateStart: {
        required: '最早发货日期不能为空'
      },
      dateEnd: {
        required: '最晚发货日期不能为空'
      },
      declaredvalue: {
        min: '申报价值不能小于0'
      },
      startCountry: {
        required: '发货地国家不能为空'
      },
      endCountry: {
        required: '目的地国家不能为空'
      },
      piece: {
        required: '件数不能为空',
        min: '件数不能小于1'
      },
      postcode1: {
        required: '发货地邮编不能为空'
      },
      postcode2: {
        required: '目的地邮编不能为空'
      }
    }
    this.WxValidator = new WxValidator(rules, messages);
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
  dateStartChange(e) {
    this.setData({
      dateStart: e.detail.value
    });
  },
  dateEndChange(e) {
    this.setData({
      dateEnd: e.detail.value
    });
  },
  inputCountry: function (input) {
    var country = input.detail.value;
    var type = input.currentTarget.dataset["type"];
    if (type == 1) {
      this.setData({
        startCountryText: country,
        showCountryCPType:1
      });
    } else {
      this.setData({
        endCountryText: country,
        showCountryCPType:2
      });
    }
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
    var type = e.currentTarget.dataset["type"];
    var countryText = e.currentTarget.dataset["text"];
    var countryId = e.currentTarget.dataset["value"];
    var that = this;
    if (type == 1) {
      this.setData({
        startCountryText: countryText,
        startCountryId: countryId
      });
    } else {
      this.setData({
        endCountryText: countryText,
        endCountryId: countryId
      });
    }
    this.hideCountryList(this);
  },
  hideCountryList: function (res) {
    res.setData({
      filtCountryList: {},
      hideCP: true
    });
  },
  search: function (e) {
    let that = this;
    if (!this.WxValidator.checkForm(e.detail.value)) {
      this.setData({
        IsError: true,
        ErrorMessage: this.WxValidator.errorList[0].msg
      });
      setTimeout(function () {
        that.setData({
          IsError: false,
          ErrorMessage: ""
        });
      }, 2000);
      return;
    }
    if(this.data.sizes==null || this.data.sizes.length!=e.detail.value.piece){
      wx.showModal({
        showCancel:false,
        title:'提示',
        content:'请输入每件规格尺寸信息'
      });
      return;
    }
    let data = e.detail.value;
    data.startCountryId=this.data.startCountryId;
    data.endCountryId=this.data.endCountryId;
    data.sizes = this.data.sizes;

    let req = {
      url: app.globalData.serverAddress + '/Calculation/Calculate3',
      data:data,
      method: "POST",
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if(res.indexOf("发货日期")!=-1){
          wx.showModal({
            showCancel:false,
            title:'操作异常',
            content:res
          });
        }else{
          wx.navigateTo({
            url: '/pages/arkpricecalc/result',
            success:function(r){
              r.eventChannel.emit("showData",res)
            }
          })
        }
      }
    }
    wx.showLoading({
      title: '请稍后'
    })
    app.NetRequest(req);
  },
  showSizes: function () {
    let that = this;
    if (that.data.piece > 0) {
      wx.navigateTo({
        url: '/pages/customerpricecalc/sizes/index',
        events: {
          submitSizes: function (data) {
            that.data.sizes = data.sizes;
            console.log(data.sizes);
          }
        },
        success: function (res) {
          res.eventChannel.emit("editSizes", {
            sizes: that.data.sizes,
            pieces: that.data.piece
          });
        }
      });
    }else{
      wx.showModal({
        showCancel:false,
        title:"提示",
        content:"件数必须大于0！",
      });
    }
  }
})