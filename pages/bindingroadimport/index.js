var app = getApp();
Page({

  data: {
    items: [],
    pageIndex: 1,
    hasMore: true,
    isShowLoading: false,
    isShowNoDataMark: false
  },

  onLoad: function (options) {

  },

  onShow: function () {
    this.setData({ pageIndex: 1, items: [], hasMore: true });
    this.loadData();
  },

  loadData: function () {
    if (!this.data.hasMore) return;

    var main = this;
    main.setData({ isShowLoading: true });

    var data = {
      url: app.globalData.serverAddress + '/CDBindingRoadImport/GetList?pageIndex=' + main.data.pageIndex,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        var items = main.data.items.concat(res.items);
        main.setData({
          items: items,
          pageIndex: main.data.pageIndex + 1,
          hasMore: items.length < res.totalRecords,
          isShowLoading: false,
          isShowNoDataMark: items.length >= res.totalRecords
        });
      },
      fail: function () {
        wx.hideLoading();
        main.setData({ isShowLoading: false });
        wx.showModal({ title: '提示', content: '加载失败，请重试', showCancel: false });
      }
    };
    app.NetRequest(data);
  },

  onPullDownRefresh: function () {
    this.setData({ pageIndex: 1, items: [], hasMore: true, isShowNoDataMark: false });
    this.loadData();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    this.loadData();
  },

  tapItem: function (e) {
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({ url: 'detail?id=' + item.ObjectId });
  },

  addNew: function () {
    wx.navigateTo({ url: 'detail' });
  },

  getStatusText: function (status) {
    var map = {
      0: '初始',
      1: '申报中',
      2: '申报失败',
      3: '已申报',
      4: '删除中',
      5: '删除失败',
      6: '已删除'
    };
    return map[status] || '未知';
  }
})
