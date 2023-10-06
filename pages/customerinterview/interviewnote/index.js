// pages/customerinterview/interviewnote/index.js
import FileHelper from '../../../utils/FileHelper';
const fs = wx.getFileSystemManager();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteType: '面访笔记',
    remarkLength: 0,
    firstName: '',
    name: '',
    images: [],
    isReadonly: true,
    remark: '',
    interviewId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let main=this;
    let id = options.id;
    let interviewId = options.interviewId;
    let name = options.name;
    let firstName = name.substring(0, 1);
    this.data.interviewId=interviewId;
    if (name != null && name.length > 0) {
      this.setData({
        firstName: firstName,
        name: name
      });
    }
    this.FileHelper = new FileHelper();
    if (id == null) {
      this.setData({
        isReadonly: false
      });
    }else{
      let data = {
        url:app.globalData.serverAddress + '/Interview/GetInterviewNoteDetail?interviewNoteId='+id,
        method:'GET',
        success:function(res){
          let images = main.data.images;
          res.Attachments.forEach(element => {
            main.FileHelper.downloadFile(element.ServerFilePath,r=>{ 
              let image = new Object();
              image.Path=r.tempFilePath;
              images.push(image);
              main.setData({
                images:images
              });
            });
          });
          main.setData({
            noteType:res.NoteType,
            showAddress:res.Address.split('|')[0],
            remark:res.Remark
          });
        },
        fail:function(err){
          console.log(err);
        }
      }
      app.NetRequest(data);
    }
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
  selectNoteType(e) {
    if (this.data.isReadonly) return;
    let noteType = e.currentTarget.dataset.notetype;
    this.setData({
      noteType: noteType
    });
  },
  selectLocation() {
    if (this.data.isReadonly) return;
    let main = this;
    wx.chooseLocation({
      success: res => {
        console.log(res);
        main.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.address + "|" + res.latitude + "," + res.longitude,
          showAddress: res.address
        });
      }
    });
  },
  inputRemark(e) {
    let remark = e.detail.value;
    this.setData({
      remark: remark,
      remarkLength: remark.length
    });
  },
  //打开摄像头或者选择相册文件
  selectImage() {
    let main = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        console.log(res);
        let images = main.data.images;
        let imageName = "图片" + (parseInt(images.length) + 1);
        let image = new Object();
        image.Path = res.tempFiles[0].tempFilePath;
        image.ObjectName = imageName;
        fs.readFile({
          filePath: image.Path,
          success(res) {
            main.FileHelper.uploadFile(image.Path, function (data) {
              console.log("serverFilePath:", data);
              image.ServerFilePath = data;
              images.push(image);
              main.setData({
                images: images
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
  openImage(e) {
    let urls = this.data.images.map(p => p.Path);
    let index = e.target.dataset.index;
    wx.previewImage({
      urls: urls,
      current: urls[index]
    });
  },
  removeImage(e) {
    let index = e.target.dataset.index;
    let images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images: images
    });
  },
  save() {
    let main=this;
    if(this.data.showAddress==null || this.data.showAddress.trim().length==0){
      wx.showModal({
        title: '提示',
        content: '请选择拜访地点',
        showCancel:false
      });
      return;
    }
    if(this.data.remark==null || this.data.remark.trim().length==0){
      wx.showModal({
        title: '提示',
        content: '请输入笔记内容',
        showCancel:false
      });
      return;
    }
    let interviewNote = new Object();
    interviewNote.Address = this.data.address;
    interviewNote.Remark = this.data.remark;
    interviewNote.NoteType = this.data.noteType;
    interviewNote.Attachments = this.data.images;
    interviewNote.InterviewId=this.data.interviewId;
    console.log(interviewNote);
    wx.showLoading({
      title: '请稍后...',
      mask:true
    });
    let data = {
      url:app.globalData.serverAddress + '/Interview/SaveInterviewNote',
      data:JSON.stringify(interviewNote),
      success:function(res){
        console.log(res);
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '保存成功',
          mask:true,
          showCancel:false
        });
        main.setData({
          isReadonly:true
        });
      },
      fail:function(err){
        wx.hideLoading();
        wx.showModal({
          title: '保存失败',
          content: err.data.Message+'：'+err.data.ExceptionMessage,
          showCancel:false
          });
      }
    }
    app.NetRequest(data);
  }
})