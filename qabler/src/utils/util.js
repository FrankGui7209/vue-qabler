
// 日期格式化
const privateFormat = function (dateVal, formatStr) {
  let str = formatStr || 'YYYY年MM月DD日 HH:mm'
  let Week = ['日', '一', '二', '三', '四', '五', '六']

  str = str.replace(/yyyy|YYYY/, dateVal.getFullYear())
  str = str.replace(/yy|YY/, (dateVal.getYear() % 100) > 9 ? (dateVal.getYear() % 100).toString() : '0' + (dateVal.getYear() % 100))

  str = str.replace(/MM/, dateVal.getMonth() >= 9 ? (dateVal.getMonth() + 1).toString() : '0' + (dateVal.getMonth() + 1))
  str = str.replace(/M/g, dateVal.getMonth() + 1)

  str = str.replace(/w|W/g, Week[dateVal.getDay()])

  str = str.replace(/dd|DD/, dateVal.getDate() > 9 ? dateVal.getDate().toString() : '0' + dateVal.getDate())
  str = str.replace(/d|D/g, dateVal.getDate())

  str = str.replace(/hh|HH/, dateVal.getHours() > 9 ? dateVal.getHours().toString() : '0' + dateVal.getHours())
  str = str.replace(/h|H/g, dateVal.getHours())
  str = str.replace(/mm/, dateVal.getMinutes() > 9 ? dateVal.getMinutes().toString() : '0' + dateVal.getMinutes())
  str = str.replace(/m/g, dateVal.getMinutes())

  str = str.replace(/ss|SS/, dateVal.getSeconds() > 9 ? dateVal.getSeconds().toString() : '0' + dateVal.getSeconds())
  str = str.replace(/s|S/g, dateVal.getSeconds())

  return str
}

function convertToDate (str) {
  if (!str) return null
  let date = str
  if (/^\d+$/.test(str)) {
    if (str * 1 < 9999999999) {
      str = str * 1000
    }
    date = new Date()
    date.setTime(str)
  }
  if (typeof str === 'string') {
    date = new Date(str.replace(/-/g, '/'))//仅仅支持1024-12-24 12:22:22这种格式
  }
  return date
}

function isSameDay (date1, date2) {
  let d1 = convertToDate(date1)
  let d2 = convertToDate(date2)
  if (d1 == null || d2 == null) return false
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

function formatTime (str, formatStr) {
  let date = convertToDate(str)
  if (date == null) return null
  return privateFormat(date, formatStr || 'HH:mm:ss')
}

function formatDateTime (str, formatStr) {
  let date = convertToDate(str)
  if (date == null) return null
  return privateFormat(date, formatStr)
}

function formatDate (date, divCode) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  return [year, month, day].map(formatNumber).join(divCode || '/')
}

function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 缩写时间格式
 * @param dateTime
 * @returns {string}
 */
function shortDateTime (dateTime) {
  if (!dateTime) return ''
  let dateVal = null
  if (/^\d+$/.test(dateTime)) { //纯数字字符串，说明是时间戳格式
    if (dateTime * 1 < 9999999999) {
      dateTime = dateTime * 1000
    }
    dateVal = new Date()
    dateVal.setTime(dateTime)
  }
  if (typeof dateTime === 'string') {
    dateVal = new Date(dateTime.replace(/-/g, '/'))//仅仅支持1024-12-24 12:22:22这种格式
  }

  if (dateVal) {
    let newData = Date.parse(new Date())
    let diffTime = (newData - dateVal) * 1

    if (diffTime >= 7 * 24 * 3600 * 1000 || diffTime < 0) {
      return formatDateTime(dateVal, 'YYYY年MM月DD日')
    } else if (diffTime > 24 * 3600 * 1000) {
      // //注释("一周之内");
      // var time = newData - diffTime;
      let dayNum = Math.floor(diffTime / (24 * 60 * 60 * 1000))
      return dayNum + '天前'

    } else if (diffTime >= 3600 * 1000) {
      // //注释("一天之内");
      // var time = newData - diffTime;
      let dayNum = Math.floor(diffTime / (60 * 60 * 1000))
      return dayNum + '小时前'
    } else {
      // //注释("一小时之内");
      // var time = newData - diffTime;
      let dayNum = Math.floor(diffTime / (60 * 1000))
      if (dayNum < 3) {
        return '刚刚'
      }
      return dayNum + '分钟前'
    }
  }
}

const firstImage = function (images) {
  if (!images) return ''
  return images.split(';')[0]
}
const isMobile = function (mobile) {
  var re = /(^1[3|4|5|6|7|8|9][0-9]{9}$)/
  return re.test(mobile)
}
const hideMiddleStr = function (str, startIndex, length) {
  if (!str) {
    return ''
  }
  if (str.length <= startIndex || str.length <= length) {
    return str
  }

  return str.substring(0, startIndex) + '*'.repeat(length) + str.substring(startIndex + length, str.length)
}
const setUnreadCount = function (count) {
  if (!count || +count === 0) {
    wx.removeTabBarBadge({ index: 1 })
  } else {
    wx.setTabBarBadge({ index: 1, text: count + '' })
  }
}
const util = {
  formatDate,
  formatTime,
  convertToDate,
  shortDateTime,
  formatDateTime,
  firstImage,
  isMobile,
  hideMiddleStr,
  formatNumber,
  setUnreadCount,
  isSameDay
}

export default util
