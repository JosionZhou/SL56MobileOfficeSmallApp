// pages/goodstowarehouse/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputContent: "",
    list: [],
    date: "点击这里选择日期",
    selectNumber: "请选择 装车号/物理板号/虚拟板号",
    carNumber: "请选择 车牌号(可选)",
    addItemList: ['装车号', '物理板号', '虚拟板号', '原单号'],
    addItemIndex: 1,
    showNumbers: [
      ['装车号', '物理板号', '虚拟板号'],
      []
    ],
    isShowSelectNumber: false,
    allNumbers: null,
    typeIndex: 0,
    warehouseName: "",
    selectNumberIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '获取数据中',
    });
    let main = this;
    var data = {
      url: app.globalData.serverAddress + '/TruckingShipment/GetCars',
      method: "GET",
      success: function (res) {
        var carNumbers = [];
        var tempCarData = [];
        tempCarData = res.filter(p => p.Status == 0);
        carNumbers = tempCarData.map(p => p.ObjectNo);
        main.setData({
          cars: tempCarData,
          carNumbers: carNumbers
        });
        wx.hideLoading();
      },
      fail:function(err){
        wx.hideLoading();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  addRefnumber() {
    this.doGetRGDListFromType(this.data.addItemIndex, this.data.inputContent);
  }, 
  clearCarChange:function(){
    this.setData({
      selectedCarIndex: null,
      carNumber: '请选择 车牌号(可选)',
      selectedCarId: null
    })
  },
  carChange:function(e){
    this.setData({
      selectedCarIndex: e.detail.value,
      carNumber: this.data.cars[e.detail.value].ObjectNo,
      selectedCarId: this.data.cars[e.detail.value].ObjectId
    });
    this.processNumbers(this.data.selectNumberIndex[0])
  },
  doGetRGDListFromType(type, number) {
    let main = this;
    if (number == null || number.trim().length == 0) {
      wx.showModal({
        title: '提示',
        content: main.data.addItemList[main.data.addItemIndex] + " 不能为空",
        showCancel: false,
        mask: true
      });
      return;
    }
    wx.showLoading({
      title: '请稍后',
      mask: true
    });
    let data = {
      url: app.globalData.serverAddress + '/GoodsToWareHouse/GetList?number=' + number + '&type=' + type,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        let list = main.data.list;
        if (res.Success) {
          res.Result.forEach(element => {
            //重复的单号不添加
            if (list.length == 0 || list.findIndex(p => p.ObjectId == element.ObjectId) == -1)
              list.push(element);
          });
          main.setData({
            list: list,
            inputContent: ""
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.Message,
            showCancel: false
          });
        }
      },
      fail: function (err) {
        wx.hideLoading();
        console.log(err);
      }
    }
    app.NetRequest(data);
  },
  scan() {
    let main = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        var result = res.result;
        if (result.length > 0) {
          main.setData({
            inputContent: result
          });
          main.addRefnumber();
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
  doGoodsToWareHouse() {
    let main = this;
    console.log(main.data.list.toString())
    if (main.data.list.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请先添加收货数据',
        showCancel: false
      });
      return;
    }
    let data = {
      url: app.globalData.serverAddress + '/GoodsToWareHouse/Submit',
      data: {
        data: main.data.list,
        warehouseName: main.data.warehouseName
      },
      success: function (res) {
        wx.hideLoading();
        if (res.Success) {
          wx.showModal({
            title: '提示',
            content: '操作成功',
            showCancel: false,
            complete: (res) => {
              main.setData({
                list: [],
                warehouseName: ""
              });
            }
          })
        } else {
          wx.showModal({
            title: '操作失败',
            content: res.Message,
            showCancel: false
          })
        }
        console.log(res);
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showModal({
          title: '操作失败',
          content: '请重试'
        })
        console.log(err);
      }
    }
    wx.showModal({
      title: '提示',
      content: '确认标识交仓吗？',
      complete: (res) => {
        if (res.cancel) {

        }
        if (res.confirm) {
          wx.showLoading({
            title: '请稍后',
            mask: true
          });
          app.NetRequest(data);
        }
      }
    })
  },
  removeItem(e) {
    let main = this;
    wx.showModal({
      title: '警告',
      content: '确定移除当前单号吗？',
      complete: (res) => {
        if (res.cancel) {

        }
        if (res.confirm) {
          let index = e.currentTarget.dataset.index;
          let list = main.data.list;
          list.splice(index, 1);
          main.setData({
            list: list
          });
        }
      }
    })
  },
  selectDate(e) {
    let main = this;
    wx.showLoading({
      title: '请稍后',
    })
    let data = {
      url: app.globalData.serverAddress + '/GoodsToWareHouse/GetNumberList?date=' + main.data.date,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        if (res.findIndex(p => p.Value.length > 0) == -1) {
          wx.showModal({
            title: '提示',
            content: '当前日期查询不到对应的数据！',
            showCancel: false,
            mask: true
          });
          return;
        }
        //设置号码选择器默认值
        let defaultTypeNumbers = res[0].Value;
        let showNumbers = main.data.showNumbers;
        showNumbers[1] = defaultTypeNumbers;
        let selectNumberIndex = [0, 0];
        main.setData({
          allNumbers: res,
          isShowSelectNumber: true,
          showNumbers: showNumbers,
          selectNumberIndex: selectNumberIndex,
          selectNumber: '请选择 装车号/物理板号/虚拟板号'
        });
        main.clearCarChange();
        main.processNumbers(0);
        console.log(res[0].Value);
      },
      fail: function (err) {
        wx.hideLoading();
        console.log(err);
        wx.showModal({
          title: '操作失败',
          content: err.data.Message,
          showCancel: false,
          mask: true
        });
      }
    }
    app.NetRequest(data);
  },
  numberSelect(e) {
    console.log(e);
    let numberPickerColumn2SelectIndex = e.detail.value[1];
    let showNumbers = this.data.showNumbers;
    let selectNumber = showNumbers[0][this.data.typeIndex] + '：' + showNumbers[1][numberPickerColumn2SelectIndex];
    this.setData({
      selectNumber: selectNumber
    });
    let reqNumberData = showNumbers[1][numberPickerColumn2SelectIndex];
    reqNumberData = reqNumberData.replace(/\(.*\)/, "");
    this.doGetRGDListFromType(this.data.typeIndex, reqNumberData)
  },
  columnChanged(e) {
    if (e.detail.column == 0) {
      this.processNumbers(e.detail.value);
    }
  },
  processNumbers(typeIndex){
    let main = this;
    let allNumbers = main.data.allNumbers[typeIndex].Value;
    let currentTypeNumbers=new Array(); 
    //号码以|分隔CarId，在此处进行截取和过滤
    allNumbers.forEach(element => {
      let splits = element.split('|');
      let currentNumberCarId = splits[0];
      if(!main.data.selectedCarId || main.data.selectedCarId==currentNumberCarId){
        currentTypeNumbers.push(splits[1]);
      }
    });
    let showNumbers = main.data.showNumbers;
    showNumbers[1] = currentTypeNumbers;
    main.setData({
      showNumbers: showNumbers,
      typeIndex: typeIndex
    });
  },
  bindTypeChange(e) {
    this.setData({
      addItemIndex: e.detail.value
    });
  }
})