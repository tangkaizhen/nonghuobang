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

// 这个里面可以添加一些公用的方法
function tohome(appToken, helper_id) {
  console.log("进首页")
  // 表示绑定成功直接到首页
	wx.setStorageSync('header', {
		'Content-Type': 'application/x-www-form-urlencoded',
		'cookie': wx.getStorageSync('cookieKey')
	})
  wx.setStorageSync('appToken', appToken);
  wx.setStorageSync('helper_id', helper_id);
  wx.navigateTo({
    url: '/pages/home/home'
  })
}

// 消息提示框
function showInfo(msg) {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 1000,
    mask: true
  })
} 
function showloading() {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
}
function hideloading() {
  wx.hideLoading()
}
// 检测身份证号是否符合规则
var isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;

function testId(id) {
	if (!isIDCard1.test(id)) {
		return false;
	} else {
		return true
	}
}
function uploadImage(type, path) {
	return new Promise((resolve, reject) => {
		wx.uploadFile({
			url: 'https://test.nonghuobang365.com/api/helper/uploadPic.json',
			filePath: path,
			name: 'file',
			formData: {
				type
			},
			success(res) {
				if (res.statusCode == 200) {
					var data = res.data.replace(/\"/g, "")
					resolve(data);
				} else {
					util.showInfo("图片上传失败")
					util.hideloading("图片上传中")
				}
			}
		})
	})
}
module.exports = {
	uploadImage,
	testId,
  formatTime: formatTime,
  tohome: tohome,
  showInfo: showInfo,
  showloading: showloading,
  hideloading: hideloading
}
