var app = getApp();
Page({

  data: {
    id: null,
    isEdit: false,
    isNew: true,
    form: {},
    lastChanged: null,

    // 下拉数据（完整，含code）
    customOptions: [],
    trafModeOptions: [],
    countryOptions: [],

    // picker显示名称数组
    customNames: [],
    trafModeNames: [],
    countryNames: [],
    healthNames: ['正常', '异常'],
    vaccinateNames: ['是', '否'],

    // 各picker当前选中索引
    customIndex: -1,
    trafModeIndex: -1,
    countryIndex: -1,
    healthIndex: 0,
    vaccinateIndex: 0,

    // 日期时间
    arrivalDate: '',
    arrivalTime: '',

    // 允许编辑状态
    canEdit: true
  },

  onLoad: function (options) {
    var id = options.id;
    var main = this;

    if (id) {
      this.setData({ isNew: false, id: id });
      this.loadDetail(parseInt(id));
    } else {
      wx.showLoading({ title: '加载中...', mask: true });
      this.setData({ isNew: true, canEdit: true });
      this.loadDefaultValues();
    }

    this.loadDropdownOptions();
  },

  loadDropdownOptions: function () {
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/CDBindingRoadImport/GetDropdownOptions',
      method: "GET",
      success: function (res) {
        if (res.Success) {
          var customs = res.Customs || [];
          var trafModes = res.TrafModes || [];
          var countries = res.Countries || [];

          main.setData({
            customOptions: customs,
            customNames: customs.map(function (c) { return c.nameCN; }),
            trafModeOptions: trafModes,
            trafModeNames: trafModes.map(function (t) { return t.nameCN; }),
            countryOptions: countries,
            countryNames: countries.map(function (c) { return c.nameCN; })
          });

          // 如果表单数据已加载（编辑记录或新记录的默认值），回填picker索引
          if (main.data.isNew || main.data.form.ObjectId) {
            main.fillDropdownIndices(main.data.form);
          }

          wx.hideLoading();
        }
      }
    };
    app.NetRequest(data);
  },

  loadDetail: function (id) {
    var main = this;
    wx.showLoading({ title: '请稍后' });

    var data = {
      url: app.globalData.serverAddress + '/CDBindingRoadImport/GetDetail?id=' + id,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        var form = res;

        if (form.ArrivalDateTime) {
          var dt = form.ArrivalDateTime.replace('T', ' ').substring(0, 16);
          main.setData({
            arrivalDate: dt.substring(0, 10),
            arrivalTime: dt.substring(11, 16)
          });
        }

        var canEdit = (form.Status === 0 || form.Status === 2);

        main.setData({
          form: form,
          lastChanged: form.LastChanged,
          canEdit: canEdit,
          isNew: false
        });

        // 如果基础数据已加载，回填picker索引；否则等loadDropdownOptions完成后自动回填
        if (main.data.customOptions.length > 0) {
          main.fillDropdownIndices(form);
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({ title: '提示', content: '加载失败', showCancel: false });
      }
    };
    app.NetRequest(data);
  },

  loadDefaultValues: function () {
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/CDBindingRoadImport/GetDefaultValues',
      method: "GET",
      success: function (res) {
        if (res.Success && res.Data) {
          var form = main.data.form;
          form.DeclarationID = res.Data.DeclarationID || '';
          form.MasterID = res.Data.MasterID || '';
          form.MasterName = res.Data.MasterName || '';
          form.BorderTransportMeansID = res.Data.BorderTransportMeansID || '';
          form.BorderTransportMeansName = res.Data.BorderTransportMeansName || '';
          form.DeclarationOfficeID = res.Data.DeclarationOfficeID || '';
          form.CarrierID = res.Data.CarrierID || '';
          form.BorderTransportRountingCountryCode = res.Data.BorderTransportRountingCountryCode || '';
          form.BorderTransportTypeCode = res.Data.BorderTransportTypeCode || '';
          form.MasterNumStaffMember = res.Data.MasterNumStaffMember || 1;
          form.MasterHealthStatus = res.Data.MasterHealthStatus || 1;
          form.MasterVaccinate = res.Data.MasterVaccinate || 1;
          main.setData({ form: form });

          // 解析默认抵境日期时间
          if (res.Data.ArrivalDateTime) {
            var dt = res.Data.ArrivalDateTime.substring(0, 16);
            main.setData({
              arrivalDate: dt.substring(0, 10),
              arrivalTime: dt.substring(11, 16)
            });
          }

          // 如果下拉数据已加载，回填picker索引
          if (main.data.customOptions.length > 0) {
            main.fillDropdownIndices(form);
          }
        }
      }
    };
    app.NetRequest(data);
  },

  fillDropdownIndices: function (form) {
    var main = this;

    // 口岸海关
    var customs = main.data.customOptions;
    for (var i = 0; i < customs.length; i++) {
      if (customs[i].code === form.DeclarationOfficeID) {
        main.setData({ customIndex: i });
        break;
      }
    }

    // 运输方式
    var trafs = main.data.trafModeOptions;
    for (var i = 0; i < trafs.length; i++) {
      if (trafs[i].code === form.BorderTransportTypeCode) {
        main.setData({ trafModeIndex: i });
        break;
      }
    }

    // 国别
    var countries = main.data.countryOptions;
    for (var i = 0; i < countries.length; i++) {
      if (countries[i].code === form.BorderTransportRountingCountryCode) {
        main.setData({ countryIndex: i });
        break;
      }
    }

    // 健康状况
    if (form.MasterHealthStatus === 2) {
      main.setData({ healthIndex: 1 });
    }
    // 接种疫苗
    if (form.MasterVaccinate === 2) {
      main.setData({ vaccinateIndex: 1 });
    }
  },

  // 文本输入
  inputInfo: function (e) {
    var form = this.data.form;
    var field = e.currentTarget.dataset.field;
    form[field] = e.detail.value;
    this.setData({ form: form });
  },

  // 口岸海关picker
  customChange: function (e) {
    var idx = parseInt(e.detail.value);
    var form = this.data.form;
    form.DeclarationOfficeID = this.data.customOptions[idx].code;
    this.setData({ customIndex: idx, form: form });
  },

  // 运输方式picker
  trafModeChange: function (e) {
    var idx = parseInt(e.detail.value);
    var form = this.data.form;
    form.BorderTransportTypeCode = this.data.trafModeOptions[idx].code;
    this.setData({ trafModeIndex: idx, form: form });
  },

  // 国别picker
  countryChange: function (e) {
    var idx = parseInt(e.detail.value);
    var form = this.data.form;
    form.BorderTransportRountingCountryCode = this.data.countryOptions[idx].code;
    this.setData({ countryIndex: idx, form: form });
  },

  // 健康picker
  healthChange: function (e) {
    var idx = parseInt(e.detail.value);
    var form = this.data.form;
    form.MasterHealthStatus = idx + 1;
    this.setData({ healthIndex: idx, form: form });
  },

  // 接种vaccinate picker
  vaccinateChange: function (e) {
    var idx = parseInt(e.detail.value);
    var form = this.data.form;
    form.MasterVaccinate = idx + 1;
    this.setData({ vaccinateIndex: idx, form: form });
  },

  // 日期
  bindDateChange: function (e) {
    this.setData({ arrivalDate: e.detail.value });
  },

  // 时间
  bindTimeChange: function (e) {
    this.setData({ arrivalTime: e.detail.value });
  },

  // 仅保存
  save: function () {
    var msg = this.validate();
    if (msg) {
      wx.showModal({ content: msg, showCancel: false });
      return;
    }
    this.buildArrivalDateTime();
    var form = this.prepareSaveData();

    var url = this.data.isNew
      ? app.globalData.serverAddress + '/CDBindingRoadImport/Create'
      : app.globalData.serverAddress + '/CDBindingRoadImport/Update';

    var main = this;
    wx.showLoading({ title: '请稍后' });

    var data = {
      url: url,
      method: "POST",
      data: form,
      success: function (res) {
        wx.hideLoading();
        if (res.Success) {
          wx.navigateBack();
        } else {
          wx.showModal({ title: '保存失败', content: res.Message, showCancel: false });
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({ title: '错误', content: '网络请求失败', showCancel: false });
      }
    };
    app.NetRequest(data);
  },

  // 保存并申报
  saveAndSend: function () {
    var msg = this.validate();
    if (msg) {
      wx.showModal({ content: msg, showCancel: false });
      return;
    }
    this.buildArrivalDateTime();
    var form = this.prepareSaveData();

    var main = this;
    wx.showLoading({ title: '提交申报...', mask: true });

    var data = {
      url: app.globalData.serverAddress + '/CDBindingRoadImport/SaveAndSend',
      method: "POST",
      data: form,
      success: function (res) {
        wx.hideLoading();
        if (res.Success) {
          wx.showToast({ title: '申报成功', icon: 'success' });
          setTimeout(function () { wx.navigateBack(); }, 1500);
        } else {
          wx.showModal({ title: '申报失败', content: res.Message, showCancel: false });
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({ title: '错误', content: '网络请求失败', showCancel: false });
      }
    };
    app.NetRequest(data);
  },

  // 单独申报
  sendOnly: function () {
    var main = this;
    wx.showModal({
      title: '确认申报',
      content: '确定要将该记录提交申报吗？',
      success: function (res) {
        if (!res.confirm) return;
        wx.showLoading({ title: '提交申报...', mask: true });

        var data = {
          url: app.globalData.serverAddress + '/CDBindingRoadImport/SendFile',
          method: "POST",
          data: { ObjectId: main.data.id },
          success: function (res) {
            wx.hideLoading();
            if (res.Success) {
              wx.showToast({ title: '申报已提交', icon: 'success' });
              setTimeout(function () { wx.navigateBack(); }, 1500);
            } else {
              wx.showModal({ title: '申报失败', content: res.Message, showCancel: false });
            }
          },
          fail: function () {
            wx.hideLoading();
            wx.showModal({ title: '错误', content: '网络请求失败', showCancel: false });
          }
        };
        app.NetRequest(data);
      }
    });
  },

  // 删除
  del: function () {
    if (this.data.isNew) return;

    var main = this;
    wx.showModal({
      title: '警告',
      content: '确定删除吗？',
      success: function (res) {
        if (!res.confirm) return;
        wx.showLoading({ title: '请稍后' });

        var data = {
          url: app.globalData.serverAddress + '/CDBindingRoadImport/Delete',
          method: "POST",
          data: { ObjectId: main.data.id, LastChanged: main.data.lastChanged },
          success: function (res) {
            wx.hideLoading();
            if (res.Success) {
              wx.navigateBack();
            } else {
              wx.showModal({ title: '删除失败', content: res.Message, showCancel: false });
            }
          },
          fail: function () {
            wx.hideLoading();
            wx.showModal({ title: '错误', content: '网络请求失败', showCancel: false });
          }
        };
        app.NetRequest(data);
      }
    });
  },

  buildArrivalDateTime: function () {
    if (this.data.arrivalDate && this.data.arrivalTime) {
      this.data.form.ArrivalDateTime = this.data.arrivalDate + ' ' + this.data.arrivalTime + ':00';
    }
  },

  prepareSaveData: function () {
    var f = this.data.form;
    return {
      ObjectId: this.data.isNew ? 0 : this.data.id,
      DeclarationOfficeID: f.DeclarationOfficeID || '',
      ArrivalDateTime: f.ArrivalDateTime || null,
      CarrierID: f.CarrierID || '',
      BorderTransportMeansID: f.BorderTransportMeansID || '',
      BorderTransportMeansName: f.BorderTransportMeansName || '',
      BorderTransportTypeCode: f.BorderTransportTypeCode || '',
      BorderTransportRountingCountryCode: f.BorderTransportRountingCountryCode || '',
      MasterID: f.MasterID || '',
      MasterName: f.MasterName || '',
      MasterNumStaffMember: f.MasterNumStaffMember || 1,
      MasterHealthStatus: f.MasterHealthStatus || 1,
      MasterVaccinate: f.MasterVaccinate || 1,
      Remark: f.Remark || '',
      LastChanged: this.data.lastChanged
    };
  },

  validate: function () {
    var f = this.data.form;
    if (!f.DeclarationOfficeID) return '请选择进出境口岸海关';
    if (!this.data.arrivalDate) return '请选择抵境日期';
    if (!this.data.arrivalTime) return '请选择抵境时间';
    if (!f.BorderTransportMeansID || !f.BorderTransportMeansID.trim()) return '请输入运输工具代码';
    if (!f.BorderTransportMeansName || !f.BorderTransportMeansName.trim()) return '请输入运输工具名称';
    if (!f.MasterID || !f.MasterID.trim()) return '请输入驾驶员代码';
    if (!f.MasterName || !f.MasterName.trim()) return '请输入驾驶员名称';
    return null;
  }
})
