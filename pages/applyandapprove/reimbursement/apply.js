import WxValidate from '../../../utils/WxValidate';
import FileHelper from '../../../utils/FileHelper';
import {
  now
} from '../../../utils/util';
const fs = wx.getFileSystemManager();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CreateAt: null,
    CreateBy: null,
    ObjectName: "",
    Details: [],
    Attachments: [],
    IsError: false,
    ErrorMessage: "",
    Object: null,
    NoAttachmentTypesCount: 0,
    IsEditable: true, //true表示新增，false表示打开查看
    IsPass: null,
    ApprovalRemark: "",
    ApprovalObj: null,
    IsCancelable: false,
    AllAmount: 0,
    IsAddNew: false,
    Type: null,
    CompanyNames: [],
    CompanyIndex: 0,
    RcvName: null, //收款方名称
    RcvAcc: null, //收款方账号
    RcvBankName: null //收款方开户行
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    this.FileHelper = new FileHelper();
    if (options != null && options.type != null) {
      that.setData({
        Type: options.type
      });
    }
    if (options != null && options.item != null) {
      let item = JSON.parse(options.item);
      that.data.ApprovalObj = item;
      wx.showLoading({
        title: '获取数据中...',
      });
      let data = {
        url: app.globalData.serverAddress + "/Reimbursement/GetApproval?formId=" + item.FormId + "&instanceId=" + item.InstanceId,
        method: "GET",
        success: function (res) {
          wx.hideLoading();
          let allAmount = 0.0;
          res.Details.forEach(element => {
            allAmount += parseFloat(element.Amount);
          });
          that.setData({
            ObjectName: res.ObjectName,
            CreateBy: res.CreateBy,
            CreateAt: res.CreateAt,
            Attachments: res.Attachments,
            Details: res.Details,
            IsEditable: res.IsEditable,
            IsCancelable: item.IsCancelable,
            IsApprovaling: item.IsApprovaling,
            AllAmount: allAmount,
            Activities: res.Tracks,
            Type:res.Type,
            CompanyIndex:res.CompanyIndex,
            RcvName:res.RcvName,
            RcvAcc:res.RcvAcc,
            RcvBankName:res.RcvBankName
          });
        }
      }
      app.NetRequest(data);
    } else {
      this.setData({
        CreateAt: now(),
        CreateBy: wx.getStorageSync("nameInfo")
      });
      // 验证字段的规则
      const rules = {
        ObjectName: {
          required: true
        },
        RcvName: {
          required: that.data.Type == 2
        },
        RcvAcc: {
          required: that.data.Type == 2
        },
        RcvBankName: {
          required: that.data.Type == 2
        },
        Details: {
          required: true
        },
        // Attachments: {
        //   required: true
        // },
        NoAttachmentTypesCount: {
          max: 0
        }
      }

      // 验证字段的提示信息，若不传则调用默认的信息
      const messages = {
        ObjectName: {
          required: '请输入报销名称'
        },
        RcvName: {
          required: '收款方名称不能为空'
        },
        RcvAcc: {
          required: '收款方账号不能为空'
        },
        RcvBankName: {
          required: '收款方开户行不能为空'
        },
        Details: {
          required: '报销明细不能为空'
        },
        // Attachments: {
        //   required: '附件不能为空'
        // },
        NoAttachmentTypesCount: {
          max: "请选择附件类型"
        }
      }

      // 创建实例对象
      this.WxValidate = new WxValidate(rules, messages);
    }
    this.getCompanys();
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
  getCompanys() {
    let that = this;
    let reqData = {
      url: app.globalData.serverAddress + "/Reimbursement/GetCompanys",
      method: "GET",
      success: function (res) {
        console.log(res);
        that.setData({
          CompanyNames: res
        });
      }
    }
    app.NetRequest(reqData);
  },
  submit(e) {
    let that = this;
    //审核模式
    if (!this.data.IsEditable) {
      //先判断是否选择了 “同意”或者“不同意”
      if (this.data.IsPass == null) {
        this.setData({
          IsError: true,
          ErrorMessage: "请选择审核结果！"
        });
        setTimeout(function () {
          that.setData({
            IsError: false,
            ErrorMessage: ""
          });
        }, 3000);
      } else {
        let showContent = "当前审核结果为：" + (that.data.IsPass ? "[同意]" : "[不同意]") + ";是否提交审核结果？";
        wx.showModal({
          title: "提示",
          content: showContent,
          success: function (res) {
            if (res.confirm) {
              wx.showLoading({
                title: '数据提交中...',
              });
              let postData = that.data.ApprovalObj;
              postData.IsPass = that.data.IsPass;
              postData.Remark = that.data.ApprovalRemark;
              let data = {
                url: app.globalData.serverAddress + "/Reimbursement/Approval",
                data: postData,
                success: function (res) {
                  wx.hideLoading();
                  if (res.length == 0) {
                    wx.navigateBack();
                  } else {
                    wx.showModal({
                      showCancel: false,
                      title: "操作失败",
                      content: res
                    });
                  }
                }
              }
              app.NetRequest(data);
            }
          }
        });
      }
    }
    //编辑模式
    else {
      // let count = this.data.Attachments.filter(p => p.AttachmentType == null).length;
      // this.setData({
      //   NoAttachmentTypesCount: count
      // });
      // e.detail.value.NoAttachmentTypesCount = count;
      // 传入表单数据，调用验证方法
      if (!this.WxValidate.checkForm(e.detail.value)) {
        console.log(e.detail.value);
        this.setData({
          IsError: true,
          ErrorMessage: this.WxValidate.errorList[0].msg
        });
        setTimeout(function () {
          that.setData({
            IsError: false,
            ErrorMessage: ""
          });
        }, 3000);
        return false;
      } else {
        wx.showLoading({
          title: '数据提交中...',
        });
        let data = {
          url: app.globalData.serverAddress + "/Reimbursement/Apply",
          method: "POST",
          data: {
            ObjectName: this.data.ObjectName,
            CreateAt: this.data.CreateAt,
            Details: this.data.Details,
            Attachments: this.data.Attachments,
            Type:this.data.Type,
            BelongCompanyId: parseInt(this.data.CompanyIndex) + 1,
            RcvName: this.data.RcvName,
            RcvAcc: this.data.RcvAcc,
            RcvBankName: this.data.RcvBankName
          },
          success: function (res) {
            wx.hideLoading();
            if (res.length > 0) {
              wx.showModal({
                showCancel: false,
                title: "操作失败",
                content: res
              });
            } else {
              if (that.data.IsAddNew) {
                let data = {
                  CreateAt: null,
                  CreateBy: null,
                  ObjectName: "",
                  Details: [],
                  Attachments: [],
                  IsError: false,
                  ErrorMessage: "",
                  Object: null,
                  NoAttachmentTypesCount: 0,
                  IsEditable: true, //true表示新增，false表示打开查看
                  IsPass: null,
                  ApprovalRemark: "",
                  ApprovalObj: null,
                  IsCancelable: false,
                  AllAmount: 0,
                  IsAddNew: false,
                  Type: that.data.Type,
                  CompanyNames: [],
                  CompanyIndex: 0,
                  RcvName: null, //收款方名称
                  RcvAcc: null, //收款方账号
                  RcvBankName: null //收款方开户行
                }
                that.setData(data);
                that.onLoad();
              } else {
                wx.redirectTo({
                  url: './mylist',
                });
              }
            }
          },
          fail: function (res) {
            wx.hideLoading();
            wx.showModal({
              showCancel: false,
              title: "操作失败",
              content: res
            });
          }
        }
        app.NetRequest(data);
      }
    }
  },
  addDetail: function () {
    let that = this;
    wx.navigateTo({
      url: './detail',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        addDetail: function (detail) {
          let details = that.data.Details;
          details.push(detail.data);
          let allAmount = 0.0;
          details.forEach(element => {
            allAmount += parseFloat(element.Amount);
          });
          that.setData({
            Details: details,
            AllAmount: allAmount
          });
          console.log("data", that.data.Details);
        }
      }
    })
  },
  editDetail: function (event) {
    var that = this;
    let index = event.currentTarget.dataset.detailIndex;
    let detail = this.data.Details[index];
    detail.IsEditable = that.data.IsEditable;
    wx.navigateTo({
      url: './detail',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据（获取在明细页面编辑过的对象）
        addDetail: function (detail) {
          let details = that.data.Details;
          details.splice(index, 1, detail.data);
          let allAmount = 0.0;
          details.forEach(element => {
            allAmount += parseFloat(element.Amount);
          });
          that.setData({
            Details: details,
            AllAmount: allAmount
          });
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据（把当前点击的明细对象传递到明细页面）
        res.eventChannel.emit('editDetail', {
          data: detail
        })
      }
    })
  },
  removeDetail: function (event) {
    if (!this.data.IsEditable) {
      return;
    }
    var that = this;
    let index = event.currentTarget.dataset.detailIndex;
    wx.showActionSheet({
      itemList: ['移除'],
      success: function (res) {
        if (!res.cancel) {
          let details = that.data.Details;
          details.splice(index, 1);
          that.setData({
            Details: details
          });
        }
      }
    });
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
  //IsPass初始值为null，此时点击不同意无法直接动态绑定赋值，由此事件赋值FALSE
  bindStartFalse() {
    if (this.data.IsPass == null) {
      this.setData({
        IsPass: false
      });
    }
  },
  cancel() {
    let that = this;
    wx.showModal({
      title: "提示",
      content: "确定取消申请吗？",
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '数据提交中...',
          });
          let data = {
            url: app.globalData.serverAddress + "/Reimbursement/Cancel?formId=" + that.data.ApprovalObj.FormId,
            method: "POST",
            success: function (res) {
              wx.hideLoading();
              if (res.length > 0) {
                wx.showModal({
                  showCancel: false,
                  title: "操作失败",
                  content: res
                });
              } else {
                wx.navigateBack();
              }
            }
          }
          app.NetRequest(data);
        }
      }
    })
  },
  addNew() {
    this.setData({
      IsAddNew: true
    })
  }
})