
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
function tohome(appToken, helper_id, type) {
  console.log("进首页")
  // 表示绑定成功直接到首页
  wx.setStorageSync('appToken', appToken);
  wx.setStorageSync('helper_id', helper_id);
  wx.setStorageSync('helper_type', type);
	wx.setStorageSync('header', {
		'Content-Type': 'application/x-www-form-urlencoded',
		'cookie': wx.getStorageSync('cookieKey')
	});
  wx.navigateTo({
    url: '/pages/home/home',
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

function showloading(title) {
  wx.showLoading({
    title,
    mask: true
  })
}

function hideloading() {
  wx.hideLoading()
}
function auto_location() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        resolve(res)
      }
    })

  })
}

// 经纬度转地址
function lnglat_to_location(longitude, latitude) {

  var QQMapWX = require('./qqmap-wx-jssdk.min.js')
  // 实例化API核心类
  var qqmapsdk = new QQMapWX({
    key: 'E7CBZ-D2QHJ-YQQF7-KH3H5-GQVN2-5PF2I'
  });

  return new Promise((resolve, reject) => {
    qqmapsdk.reverseGeocoder({
      location: {
        longitude,
        latitude
      },
      success: function (res) {//成功后的回调
        resolve(res);
      },
      fail: function (error) {
      },
      complete: function (res) {
      }
    })
  })
}

// 地址转经纬度
function location_to_lnglat(address) {
  var QQMapWX = require('./qqmap-wx-jssdk.min.js')
  // 实例化API核心类
  var qqmapsdk = new QQMapWX({
    key: 'E7CBZ-D2QHJ-YQQF7-KH3H5-GQVN2-5PF2I'
  });

  return new Promise((resolve, reject) => {
    qqmapsdk.geocoder({
      address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {//成功后的回调
        var result = res.result;
        resolve(result)
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
      }
    })
  })
}

function uploadImage(type, path) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: 'https://www.nonghuobang.cn/api/helper/uploadPic.json',
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

function set_history_cookie(key, value) {

  // 设置历史记录:好比key为order_history,格式为：order_history='值1-值2-值3-值4-值5'

  // 接单首页定位中的热门城市key=recevie_order_city
  if (wx.getStorageSync(key)) {
    let old_value = wx.getStorageSync(key);
    let old_value_arr = old_value.split("-");
    let search_value = old_value_arr.find(val => {
      return val == value
    })
    if (!search_value) {
      //表示cookie没有新的keyword，需要加上这个新值到cookie里
      // 这时候需要判断如果超过6个就停止了
      if (old_value_arr.length >= 6) {
        old_value_arr.pop()
        old_value = old_value_arr.join("-");
        old_value = value + '-' + old_value;
        wx.setStorageSync(key, old_value)
      } else {
        old_value = value + '-' + old_value;
        wx.setStorageSync(key, old_value)
      }

    }
  } else {
    wx.setStorageSync(key, value)
  }

}
function makePhoneCall(phoneNumber) {
  var _this = this
  wx.makePhoneCall({
    phoneNumber
  })

}

// 检测手机号是否符合规则
var reg_phone = /^1[2,3,4,5,6,7,8,9]\d{9}$/
function testPhone(phone) {
  if (!reg_phone.test(phone)) {
    return false;
  } else {
    return true
  }
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

function name_to_bankLogo(b_name) {
  if (b_name.indexOf('工商银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/ICBC.png",
      bank_background: { "background": "linear-gradient(to right, #ff4747, #ff5985)", "boxShadow": "0 1px 2px #e75b66" }
    }
  } else if (b_name.indexOf('农业银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/ABC.png",
      bank_background: { "background": "linear-gradient(to right, #59eaff, #4cffde)", "boxShadow": "0 1px 2px #23bea2" }
    }
  } else if (b_name.indexOf('中国银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/BOC.png",
      bank_background: { "background": "linear-gradient(to right, #ff4747, #ff5985)", "boxShadow": "0 1px 2px #e75b66" }
    }
  } else if (b_name.indexOf('建设银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/CCB.png",
      bank_background: { "background": "linear-gradient(to right, #4cacff, #59eaff)", "boxShadow": "0 1px 2px #4a91c8" }
    }
  } else if (b_name.indexOf('招商银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/CMB.png",
      bank_background: { "background": "linear-gradient(to right, #ff4747, #ff5985)", "boxShadow": "0 1px 2px #e75b66" }
    }
  } else if (b_name.indexOf('交通银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/COMM.png",
      bank_background: { "background": "linear-gradient(to right, #4cacff, #59eaff)", "boxShadow": "0 1px 2px #4a91c8" }
    }
  } else if (b_name.indexOf('邮储银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/PSBC.png",
      bank_background: { "background": "linear-gradient(to right, #59eaff, #4cffde)", "boxShadow": "0 1px 2px #23bea2" }
    }
  } else if (b_name.indexOf('浦发银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/SPDB.png",
      bank_background: { "background": "linear-gradient(to right, #4cacff, #59eaff)", "boxShadow": "0 1px 2px #4a91c8" }
    }
  } else if (b_name.indexOf('兴业银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/CIB.png",
      bank_background: { "background": "linear-gradient(to right, #4cacff, #59eaff)", "boxShadow": "0 1px 2px #4a91c8" }
    }
  } else if (b_name.indexOf('光大银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/CEB.png",
      bank_background: { "background": "linear-gradient(to right, #ff4747, #ff5985)", "boxShadow": "0 1px 2px #fbae3b" }
    }
  } else if (b_name.indexOf('民生银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/CMBC.png",
      bank_background: { "background": "linear-gradient(to right, #59eaff, #4cffde)", "boxShadow": "0 1px 2px #23bea2" }
    }
  } else if (b_name.indexOf('中信银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/CITIC.png",
      bank_background: { "background": "linear-gradient(to right, #ff4747, #ff5985)", "boxShadow": "0 1px 2px #e75b66" }
    }
  } else if (b_name.indexOf('广发银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/GDB.png",
      bank_background: { "background": "linear-gradient(to right, #ff4747, #ff5985)", "boxShadow": "0 1px 2px #e75b66" }
    }
  } else if (b_name.indexOf('平安银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/SPABANK.png",
      bank_background: { "background": "linear-gradient(to right, #ff4747, #ff5985)", "boxShadow": "0 1px 2px #fbae3b" }
    }
  } else if (b_name.indexOf('华夏银行') > -1) {
    return {
      bank_logo: "/images/bank_logo/HXBANK.png",
      bank_background: { "background": "linear-gradient(to right, #ff4747, #ff5985)", "boxShadow": "0 1px 2px #e75b66" }
    }
  } else if (b_name == '其他') {
    return {
      bank_logo: "/images/bank_logo/bankDefaultIcon.png",
      bank_background: { "background": "#000", "boxShadow": "0 1px 2px #000" }
    }
  }
}
module.exports = {
  formatTime: formatTime,
  tohome: tohome,
  showInfo: showInfo,
  showloading: showloading,
  hideloading: hideloading,
  auto_location,
  lnglat_to_location,
  set_history_cookie,
  location_to_lnglat,
  makePhoneCall,
  uploadImage,
  testPhone,
  testId,
  name_to_bankLogo
}
