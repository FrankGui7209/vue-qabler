import axios from 'axios'
import store from '@/vuex/store';
import router from '@/router'

axios.interceptors.request.use(
  config => {
    config.headers.token = store.state.token;
    config.headers['Content-Type']="application/json"
    // if (config.method == 'post') {
    //   if (!(config.headers && config.headers['Content-Type'])) {
    //     config.transformRequest = [function (data) {
    //       return qs.stringify(data)
    //     }];
    //   }
    // }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

axios.interceptors.response.use(
  res => {
    // console.log(res)
    if (res && res.hasOwnProperty('data') && res.data.hasOwnProperty('retcode')) {
      res = res.data;
    }
    if (res && res.retcode === -100) {
      router.replace({
        path: '/login',
        toUrl: {redirect: router.currentRoute.fullPath}
      });
      return null;//Promise.reject(res.data);
    }
    return res;
  },
  err => {
    return Promise.reject(err);
  });

const api = {
  invoke: (method, paramObj) => axios.post('/app',
    {method: method, params: paramObj}, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

export default api
