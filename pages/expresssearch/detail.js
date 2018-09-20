// pages/deliveryrecord/detail.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:null,
    tabs: ["基本信息", "规格", "轨迹","费用","待跟进问题","附件"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    width:0,
    palletno:"",
    contacts:[],
    rules:[],
    customerPhoneStrs: [],
    customerPhoneNumbers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        var sliderWidth = res.windowWidth / that.data.tabs.length;
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          width: sliderWidth,
          palletno: app.globalData.palletno
        });
      }
    });
    wx.showLoading({
      title: '请稍后',
      mask:true
    });
     var id = options.id
     var main=this;
     var data = {
       url: app.globalData.serverAddress + '/Express/Detail',
       method:"GET",
       data: {
         id: id
       },
       success: function (res) {
         wx.hideLoading();
         var rules=new Array();
         for (var i = 0; i < res.SelectedRules.length;i++){
           var r={
             Description: res.SelectedRules[i].Description
           }
           rules.push(r);
         }
         for (var i = 0; i < res.SelectedTemplateRules.length; i++) {
           var r = {
             Description: res.SelectedTemplateRules[i].Description
           }
           rules.push(r);
         }
         var showItems = new Array();
         var numbers = new Array();
         for (var i = 0; i < res.Contacts.length; i++) {
           showItems.push((i+1) + ". " +res.Contacts[i].ObjectName + "-" + res.Contacts[i].Department + "-" + res.Contacts[i].MobilePhone)
           numbers.push(res.Contacts[i].MobilePhone);
         }
         main.setData({
           item:res,
           rules:rules,
           customerPhoneStrs:showItems,
           customerPhoneNumbers:numbers
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
  // onShareAppMessage: function () {
  
  // },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  open: function (e) {
    var t = e.currentTarget.dataset.type;
    var contacts;
    if(t==1){
     contacts = this.data.item.Contacts;
    }
    if(t==2){
      contacts=new Array();
      var item = {
        ObjectName: this.data.item.SalesmanName,
        Department:"业务",
        MobilePhone: this.data.item.SalesmanPhone
      }
      contacts.push(item);
    }
    if (t == 3) {
      contacts = new Array();
      var item = {
        ObjectName: this.data.item.MerchandiserName,
        Department: "跟单",
        MobilePhone: this.data.item.MerchandiserPhone
      }
      contacts.push(item);
    }
    this.setData({
      contacts: contacts
    });
    var showItems = new Array();
    for(var i=0;i<contacts.length;i++){
      showItems.push(contacts[i].ObjectName + "-" + contacts[i].Department +"-"+ contacts[i].MobilePhone)
    }
    var main=this;
    wx.showActionSheet({
      itemList: showItems,
      success: function (res) {
        if (!res.cancel) {
          wx.makePhoneCall({
            phoneNumber: main.data.contacts[res.tapIndex].MobilePhone,
          })
        }
      }
    });
  },
  openAttachment:function(e){
    var id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    var main = this;
    var id = e.currentTarget.dataset.id;
    wx.downloadFile({
      url: app.globalData.serverAddress + '/Express/Attachment?id=' + id,
      header: app.globalData.header,
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          wx.openDocument({
            filePath: res.tempFilePath,
            //图片类型用openDocument会打开失败，在失败方法里用previewImage打开即可
            fail:function(e){
              console.log(e);
              wx.previewImage({
                urls: [res.tempFilePath],
                current:res.tempFilePath
              })
            }
          })
        } else {
          wx.showToast({
            title: '获取附件失败',
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '获取附件失败',
          icon: 'none'
        })
      }
    })
  },
  bindPickerChange: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.customerPhoneNumbers[e.detail.value]
    })
  }
})