// pages/components/checkboxlistdialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowDialog:{
      type:Boolean,
      value:false
    },
    items:{
      type:Array,
      value:[]
    },
    height:{
      type:String,
      value:"0px"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkboxChange:function(e){
      this.triggerEvent("checkItem",e.detail.value);
    },
    btnCancel(){
      this.triggerEvent("cancel");
    },
    btnOk(){
      this.triggerEvent("ok");
    }
  }
})
