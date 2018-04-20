var sliderWidth = 120; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["未处理(2)", "已处理"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    doneCount: 0,
    undoCount: 0,
    doneList: [],
    undoList: [
      {
        avatar: "/image/avatar.png",
        name:"张三",
        date:"2014/12/12 15:20",
        mark:10,
        basis:"打扫办公室"
      }
    ]
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          headImgWidth: parseInt(res.windowWidth * 0.2),
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});