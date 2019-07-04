import storage from '@/utils/storage'
// 判断是否登陆
export const isLogin = ({commit}) => {
  const user = storage.getItem('loginInfo');
  console.log("user:"+user)
  return !!user;
};

