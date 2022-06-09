class FileHelper {
  constructor() {
    this.app = getApp();
  }
  /**
   * 
   * @param {String} fileName 文件名
   * @param {ArrayBuffer} content 二进制文件内容
   * @param {Function} callback 成功上传后执行的回调方法，参数为服务器返回的文件路径
   */
  uploadFile(filePath, callback) {
    wx.showLoading({
      title: '文件上传中...',
    });
    let fileName = filePath.split("//")[1].replace("/", "");
    wx.uploadFile({
      header: this.app.globalData.header,
      filePath: filePath,
      name: fileName,
      url: this.app.globalData.serverAddress + "/File/Upload",
      success: res => {
        wx.hideLoading();
        if (res.statusCode != 200) {
          wx.showModal({
            showCancel: false,
            title: "附件上传失败",
            content: res.data
          });
        } else {
          //返回的结果会被直接拼接一对双引号，需要移除掉
          callback(res.data.replace("\"", "").replace("\"", ""));
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: "附件上传失败",
          content: res.data
        });
      }
    });
  }

  /**
   * 
   * @param {String} serverFilePath 服务器文件路径
   */
  downloadFile(serverFilePath, callback) {
    wx.showLoading({
      title: '获取文件中...',
    });
    wx.downloadFile({
      header: this.app.globalData.header,
      url: this.app.globalData.serverAddress + "/File/Download?path=" + serverFilePath,
      success: function (res) {
        wx.hideLoading();
        callback(res);
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: "获取附件失败",
          content: res.data
        });
      }
    });
  }
}
export default FileHelper