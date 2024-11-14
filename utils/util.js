const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const now = () => {
  return formatTime(new Date());
}

const getWaitApprovalCount = (callback) => {
  let app = getApp();
  return new Promise(function (resolve) {
    let data = {
      url: app.globalData.serverAddress + "/Reimbursement/GetApprovalListCount",
      method: "GET",
      success:function(res){
        resolve(res)
      }
    }
    app.NetRequest(data);
  }).then(function(res){
    callback(res);
  });
}
const getIsGetAllWorkflowsPermission = (callback) => {
  let app = getApp();
  return new Promise(function (resolve) {
    let data = {
      url: app.globalData.serverAddress + "/Workflow/GetIsGetAllWorkflowsPermission",
      method: "GET",
      success:function(res){
        resolve(res)
      }
    }
    app.NetRequest(data);
  }).then(function(res){
    callback(res);
  });
}

module.exports = {
  formatTime: formatTime,
  now: now,
  getWaitApprovalCount: getWaitApprovalCount,
  getIsGetAllWorkflowsPermission:getIsGetAllWorkflowsPermission
}