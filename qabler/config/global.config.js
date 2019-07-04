'use strict'
//全局配置，根据不同环境不一样
module.exports = {
  "development": {
    BASE_URL: "http://minerupdate.aaajoy.net:8005/ctrl.cgi",
    RELEASE_VERSION: "1.0.0",//发布版本，有重大变化时调整，用于清理 缓存
  },
  "test": {
    BASE_URL: "http://minerupdate.aaajoy.net:8005/ctrl.cgi",
    RELEASE_VERSION: "1.0.0",//发布版本，有重大变化时调整，用于清理 缓存
  },
  "production": {
    BASE_URL: "http://minerupdate.aaajoy.net:8005/ctrl.cgi",
    RELEASE_VERSION: "1.0.0",//发布版本，有重大变化时调整，用于清理 缓存
  }
}
