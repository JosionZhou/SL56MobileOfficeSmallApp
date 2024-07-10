import WxValidate from '../../../utils/WxValidate';
import FileHelper from '../../../utils/FileHelper';
var app = getApp();
const fs = wx.getFileSystemManager();
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
    EditDetail: null,
    IsEditable: true,
    IsContinue: false,
    Attachments: [],
    ReceiveGoodsDetailId: null,
    ReceiveGoodsDetailNo: "",
    Type:null,//1:对内申请  2:对外申请
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.FileHelper = new FileHelper();
    let that = this;
    let detail = new Object();
    detail.ObjectName = null;
    detail.Amount = null;
    this.setData({
      Detail: detail,
      Type:options.type
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
      Attachments: {
        required: true
      },
      Amount: {
        required: true,
        min: 0.01
      },
      NoAttachmentTypesCount: {
        max: 0
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      ObjectName: {
        required: '报销明细名称不能为空'
      },
      Attachments: {
        required: '附件不能为空'
      },
      Amount: {
        required: '报销明细金额不能为空',
        min: '报销明细金额最为 0.01'
      },
      NoAttachmentTypesCount: {
        max: "请选择附件类型"
      }
    }
    this.WxValidate = new WxValidate(rules, messages)

    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('editDetail', function (detail) {
      that.setData({
        EditDetail: detail.data
      });
    });
  },

  setDetailInfo() {
    let data = this.data.EditDetail;
    console.log(data);
    if (data == null) return;
    let currencyIndex, departmentIndex, carIndex = null;
    currencyIndex = this.data.Currencies.findIndex(p => p.ObjectId == data.CurrencyId);
    if (data.DepartmentId != null) {
      departmentIndex = this.data.Departments.findIndex(p => p.ObjectId == data.DepartmentId);
    }
    if (data.ItemId != null) {
      carIndex = this.data.Cars.findIndex(p => p.ObjectId == data.ItemId);
    }
    this.setData({
      IsEditable: data.IsEditable,
      ObjectName: data.ObjectName,
      Amount: data.Amount,
      Remark: data.Remark,
      CurrencyIndex: currencyIndex,
      DepartmentIndex: departmentIndex,
      CarIndex: carIndex,
      Attachments: data.Attachments,
      ReceiveGoodsDetailId:data.ReceiveGoodsDetailId,
      ReceiveGoodsDetailNo:data.ReceiveGoodsDetailNo
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
    console.log("back");
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
  async add(e) {
    if (this.data.ReceiveGoodsDetailNo != null && this.data.ReceiveGoodsDetailNo.trim().length > 0) {
      let result = await this.checkReceiveGoodsDetailNumber();

      if(result==-1){
        wx.showModal({
          title: '提示',
          content: '单号不存在，请检查输入是否正确',
          showCancel:false
        });
        this.setData({
          ReceiveGoodsDetailId:null
        });
        return;
      }else{
        this.setData({
          ReceiveGoodsDetailId:result
        });
      }
    }else{
      this.setData({
        ReceiveGoodsDetailId:null
      });
    }
    let count = this.data.Attachments.filter(p => p.AttachmentType == null).length;
    this.setData({
      NoAttachmentTypesCount: count
    });
    e.detail.value.NoAttachmentTypesCount = count;
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
      //是否存在支付凭证
      let paymentVoucherCount = this.data.Attachments.filter(p => p.AttachmentType == 3).length;
      if (paymentVoucherCount == 0) {
        wx.showModal({
          showCancel: false,
          title: "警告",
          content: "请添加【支付凭证】附件"
        });
        return;
      }
      const eventChannel = this.getOpenerEventChannel();
      let Detail = this.data.Detail;
      Detail.ObjectName = this.data.ObjectName;
      Detail.Amount = this.data.Amount;
      Detail.CurrencyId = this.data.Currencies[this.data.CurrencyIndex].ObjectId;
      Detail.Remark = this.data.Remark;
      Detail.Attachments = this.data.Attachments;
      Detail.CurrencyName = this.data.Currencies[this.data.CurrencyIndex].ObjectName;
      Detail.ReceiveGoodsDetailNo=this.data.ReceiveGoodsDetailNo;
      Detail.ReceiveGoodsDetailId = this.data.ReceiveGoodsDetailId;
      if (this.data.DepartmentIndex != null) {
        Detail.DepartmentId = this.data.Departments[this.data.DepartmentIndex].ObjectId;
      }
      if (this.data.CarIndex != null) {
        Detail.ItemId = this.data.Cars[this.data.CarIndex].ObjectId;
      }
      eventChannel.emit('addDetail', {
        data: Detail
      });
      if (this.data.IsContinue) {
        this.addAndNext();
      } else {
        wx.navigateBack();
      }
    }
  },
  addAndNext() {
    let data = {
      ObjectName: null,
      Amount: null,
      CurrencyIndex: 0,
      Remark: "",
      IsError: false,
      ErrorMessage: "",
      EditDetail: null,
      IsEditable: true,
      IsContinue: false,
      Attachments: [],
      ReceiveGoodsDetailId:null,
      ReceiveGoodsDetailNo:""
    }
    this.setData(data)
    this.onLoad({type:this.data.Type});
  },
  tapNext() {
    this.setData({
      IsContinue: true
    })
  },
  addAttachment: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['选择照片', '选择聊天文件'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.openMedia();
          } else {
            that.selectChatToGetFile();
          }
        }
      }
    });
  },
  //打开摄像头或者选择相册文件
  openMedia: function () {
    let that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        console.log(res);
        let attachments = that.data.Attachments;
        let attachment = new Object();
        attachment.Path = res.tempFiles[0].tempFilePath;
        attachment.Size = res.tempFiles[0].size;
        attachment.Type = res.type;
        attachment.ObjectName = attachment.Path.split("//")[1].replace("/", "");
        fs.readFile({
          filePath: attachment.Path,
          success(res) {
            that.FileHelper.uploadFile(attachment.Path, function (data) {
              console.log("serverFilePath:", data);
              attachment.ServerFilePath = data;
              attachments.push(attachment);
              that.setData({
                Attachments: attachments
              });
            });
          },
          fail(res) {
            console.error("readFail", res)
          }
        });
      }
    });
  },
  //选择对话中的文件
  selectChatToGetFile() {
    let that = this;
    wx.chooseMessageFile({
      count: 1,
      success: function (res) {
        let attachments = that.data.Attachments;
        let attachment = new Object();
        console.log(res);
        attachment.Path = res.tempFiles[0].path;
        attachment.Size = res.tempFiles[0].size;
        attachment.Type = res.tempFiles[0].type;
        attachment.ObjectName = attachment.Path.split("//")[1].replace("/", "");
        //如果是图片或者PDF文件则添加到附件中去
        if (attachment.Type == "image" || attachment.Path.toUpperCase().indexOf(".PDF") == attachment.Path.length - 4) {
          fs.readFile({
            filePath: attachment.Path,
            success(res) {
              that.FileHelper.uploadFile(attachment.Path, function (data) {
                console.log("serverFilePath:", data);
                attachment.ServerFilePath = data;
                attachments.push(attachment);
                that.setData({
                  Attachments: attachments
                });
              });
            },
            fail(res) {
              console.error("readFileFail", res);
              wx.showModal({
                showCancel: false,
                title: "操作异常",
                content: "读取文件失败，请重试！"
              })
            }
          });
        } else {
          wx.showModal({
            showCancel: false,
            title: "不支持的附件类型",
            content: "请选择图片或者PDF文件"
          });
        }
      }
    });
  },
  selectAttachmentType(event) {
    if (!this.data.IsEditable) {
      return;
    }
    let that = this;
    wx.showActionSheet({
      itemList: ["物品图片", "发票/收据", "支付凭证", "店面图片"],
      success: function (res) {
        if (!res.cancel) {
          let index = event.currentTarget.dataset.attachmentIndex;
          let attachments = that.data.Attachments;
          attachments[index].AttachmentType = res.tapIndex + 1;
          that.setData({
            Attachments: attachments
          });
        }
      }
    });
  },
  removeAttachment(event) {
    if (!this.data.IsEditable) {
      return;
    }
    let that = this;
    wx.showActionSheet({
      itemList: ["移除"],
      success: function (res) {
        if (!res.cancel) {
          let attachments = that.data.Attachments;
          attachments.splice(res.tapIndex, 1);
          that.setData({
            Attachments: attachments
          });
        }
      }
    });
  },
  //预览附件
  previewAttachment(event) {
    let that = this;
    let index = event.currentTarget.dataset.attachmentIndex;
    let wxFilePath = this.data.Attachments[index].Path;
    let fileType = this.data.Attachments[index].Type;
    let serverFilePath = this.data.Attachments[index].ServerFilePath;
    new Promise(function (resolve) {
      if (wxFilePath == null) {
        that.FileHelper.downloadFile(serverFilePath, function (res) {
          wxFilePath = res.tempFilePath;
          resolve(true);
        });
      } else {
        resolve(true);
      }
    }).then(function () {
      if (fileType == 'image') {
        wx.previewImage({
          current: wxFilePath,
          urls: [wxFilePath]
        })
      } else {
        wx.openDocument({
          filePath: wxFilePath,
          fail: function (res) {
            wx.showModal({
              showCancel: false,
              title: '预览失败',
              content: res.errMsg
            });
          }
        });
      }
    });
  },
  removeAttachment(event) {
    if (!this.data.IsEditable) {
      return;
    }
    let that = this;
    wx.showActionSheet({
      itemList: ["移除"],
      success: function (res) {
        if (!res.cancel) {
          let attachments = that.data.Attachments;
          attachments.splice(res.tapIndex, 1);
          that.setData({
            Attachments: attachments
          });
        }
      }
    });
  },
  //根据单号查询，如果有多个(包括已退货的)则弹出选择，如果只有一个则直接默认选择此收货数据的id
  async checkReceiveGoodsDetailNumber() {
    let that = this;
    return new Promise(function(resolve,reject) {
      wx.showLoading({
        title: '单号检测中',
      });
      let data = {
        url: app.globalData.serverAddress + "/Reimbursement/GetRgdNumbers?rgdNo="+that.data.ReceiveGoodsDetailNo.trim(),
        method: "GET",
        success: function (res) {
          wx.hideLoading();
          if(res.length==0){
            resolve(-1);
          }else if(res.length==1){
            resolve(res[0].ObjectId);
          }else{
            let numbers = res.map(p=>p.ObjectNo);
            wx.showModal({
              title: '提示',
              content: '该单号存在多条数据，请手动选择',
              showCancel:false,
              complete: (res1) => {
                if (res1.confirm) {
                  wx.showActionSheet({
                    itemList: numbers,
                    success:function(res2){
                      resolve(res[res2.tapIndex].ObjectId);
                    }
                  })
                }
              }
            })
          }
        }
      };
      app.NetRequest(data);
    });
  }
})