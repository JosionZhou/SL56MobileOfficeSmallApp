// pages/customerpricecalc/sizes/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sizes:1,
    pieces:1,
    errors:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    let eventChannel = this.getOpenerEventChannel();
    eventChannel.on("editSizes",function(data){
      let pieces = parseInt(data.pieces);
      if(data.sizes!=null && data.sizes.length>0){
        let sizes=[];
        if(data.sizes.length>pieces){
          for(let i=0;i<pieces;i++){
            sizes.push(data.sizes[i]);
          }
        }
        else if(data.sizes.length<pieces){
          sizes=data.sizes;
          for(let i=0;i<pieces-data.sizes.length;i++)
          {
            sizes.push({});
          }
        }
        else{
          sizes=data.sizes;
        }
        that.setData({
          sizes:sizes,
          pieces:pieces
        });
      }else{
        let sizes = [];
        for(let i=0;i<pieces;i++)
        {
          sizes.push({});
        }
        that.setData({
          sizes:sizes,
          pieces:pieces
        });
      }
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
  submit(formdata){
    let that = this;
    let sizes = [];
    let errors={};
    for(let i=0;i<this.data.pieces;i++){
      let size={};
      let weight='weight'+i;
      let length='length'+i;
      let width='width'+i;
      let height='height'+i;
      if(formdata.detail.value[weight]>0){
        size.ActualWeight=formdata.detail.value[weight];
      }else{
        errors[weight]=true;
      }
      if(formdata.detail.value[length]>0){
        size.Length=formdata.detail.value[length];
      }else{
        errors[length]=true;
      }
      if(formdata.detail.value[width]>0){
        size.Width=formdata.detail.value[width];
      }else{
        errors[width]=true;
      }
      if(formdata.detail.value[height]>0){
        size.Height=formdata.detail.value[height];
      }else{
        errors[height]=true;
      }
      sizes.push(size);
    }
    this.setData({
      sizes:sizes,
      errors:errors
    });
    if(JSON.stringify(errors)=="{}"){
      let eventChannel = this.getOpenerEventChannel();
      eventChannel.emit("submitSizes",{sizes:that.data.sizes});
      wx.navigateBack({
        delta: 0,
      });
    }
  },
  getError(name){
    return this.data.errors.indexOf(name)>=0;
  }
})