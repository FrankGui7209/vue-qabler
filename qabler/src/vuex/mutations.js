import storage from '@/utils/storage'

// 设置用户登录信息
export const setUserInfo = (state, data) => {
  state.userInfo = data;
};
// 用户登出
export const signOut = (state) => {
  localStorage.clear();
  storage.removeItem('vuex');
  storage.removeItem('loginInfo');
  state.userInfo = {};
  state.token = '';
};
export const setToken = (state, data) => {
  state.token = data;
};
export const setLoginTime = (state, data) => {
  state.loginTime = data;
};
export const setActiveTab = (state, data) => {
  state.activeTab = data;
};
// 设置加载状态
export const setLoadingStatus = (state, status) => {
  state.isLoading = status;
};
export const setUserList = (state, data) => {
  state.userList = data;
};
export const setAlgoList = (state, data) => {
  state.algoList = data;
};
