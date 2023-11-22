// pages/goodstowarehouse/index.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputContent:"",
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
  addRefnumber(){
    let main=this;
    wx.showActionSheet({
      itemList: ['按车','按物理板','按虚拟板','按票'],
      success:function(res){
        wx.showLoading({
          title: '请稍后',
          mask:true
        });
        let type=res.tapIndex;
        let data={
          url:app.globalData.serverAddress + '/GoodsToWareHouse/GetList?number='+main.data.inputContent+'&type='+type,
          method:"GET",
          success:function(res){
            wx.hideLoading();
            console.log(res);
            let list = main.data.list;
            if(res.Success){
              res.Result.forEach(element => {
                //重复的单号不添加
                if(list.length==0 || list.findIndex(p=>p.ObjectId==element.ObjectId)==-1)
                  list.push(element);
              });
              main.setData({
                list:list,
                inputContent:""
              });
            }else{
              wx.showModal({
                title: '提示',
                content: res.Message,
                showCancel:false
              });
            }
          },
          fail:function(err){
            wx.hideLoading();
            console.log(err);
          }
        }
        app.NetRequest(data);
      }
    })
  },
  scan(){
    let main=this;
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        var result = res.result;
        if (result.length > 0) {
          main.setData({
            inputContent:result
          });
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
  doGoodsToWareHouse(){
    let main=this;
    console.log(main.data.list.toString())
    if(main.data.list.length==0){
      wx.showModal({
        title: '提示',
        content: '请先添加收货数据',
        showCancel:false
      });
      return;
    }
    let data={
      url:app.globalData.serverAddress + '/GoodsToWareHouse/Submit',
      data:JSON.stringify(main.data.list),
      success:function(res){
        wx.hideLoading();
        if(res.Success){
          wx.showModal({
            title: '提示',
            content: '操作成功',
            showCancel:false,
            complete: (res) => {
              main.setData({
                list:[]
              });
            }
          })
        }else{
          wx.showModal({
            title: '操作失败',
            content: res.Message,
            showCancel:false
          })
        }
        console.log(res);
      },
      fail:function(err){
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
            mask:true
          });
          app.NetRequest(data);
        }
      }
    })
  },
  removeItem(e){
    let main=this;
    wx.showModal({
      title: '警告',
      content: '确定移除当前单号吗？',
      complete: (res) => {
        if (res.cancel) {
          
        }
        if (res.confirm) {
          let index = e.currentTarget.dataset.index;
          let list = main.data.list;
          list.splice(index,1);
          main.setData({
            list:list
          });
        }
      }
    })
  }
})