import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';
import VuexPersistence from 'vuex-persist'

import storage from '@/utils/storage'


Vue.use(Vuex);

// 登录状态等数据保存，以便支持刷新页面：https://www.npmjs.com/package/vuex-persist
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: 'VUEX-' + storage.RELEASE_VERSION//发布版本，有重大变化时调整，用于清理 缓存
  // reducer: state => ({
  //   userInfo: state.userInfo,
  //   token: state.token,
  // }),
  // filter: (mutation) => (
  //   mutation.type === 'setUser' ||
  //   mutation.type === 'setWechat' ||
  //   mutation.type === 'setCar' ||
  //   mutation.type === 'setOrder' ||
  //   mutation.type === 'resetAllStoreInfo'
  // )
})


export default new Vuex.Store({
  getters,
  actions,
  mutations,
  plugins: [vuexLocal.plugin],
  state: {
    isLoading: false, // 是否展示loading动画
    token: '',
    loginTime: 0,//登录时间，Token生成时间，7天失效
    userInfo: { // 用户信息
      userName: '',
    },
    userList: null,
    algoList: null,
    activeTab: 'home',//当前活动Tab
  }
});
