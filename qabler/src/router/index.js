import Vue from 'vue'
import Router from 'vue-router'
// import HomePage from '@/pages/home-page/HomePage.vue'
// import UserManage from '@/pages/home-page/UserManage.vue'
// import DeviceManage from '@/pages/home-page/DeviceManage.vue'
// import PoolManage from '@/pages/home-page/PoolManage.vue'
//
// import PagesPage from '@/pages/pages-page/PagesPage.vue'
// import PageLogin from '@/pages/pages-page/views/page-login/PageLogin.vue'
// import PageRegister from '@/pages/pages-page/views/page-register/PageRegister.vue'
// import PageForgotPassword from '@/pages/pages-page/views/page-forgot-password/PageForgotPassword.vue'
// import PageError400 from '@/pages/pages-page/views/page-error400/PageError400.vue'
// import PageError401 from '@/pages/pages-page/views/page-error401/PageError401.vue'
// import PageError403 from '@/pages/pages-page/views/page-error403/PageError403.vue'
// import PageError404 from '@/pages/pages-page/views/page-error404/PageError404.vue'
// import PageError500 from '@/pages/pages-page/views/page-error500/PageError500.vue'
// import PageError503 from '@/pages/pages-page/views/page-error503/PageError503.vue'
// import PageEmpty from '@/pages/pages-page/views/page-empty/PageEmpty.vue'
// import PageRtl from '@/pages/pages-page/views/page-rtl/PageRtl.vue'
// import PageEmail from '@/pages/pages-page/views/page-email/PageEmail.vue'



Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: (resolve)=>require(['@/pages/home-page/HomePage.vue'],resolve)
    },
    {
      path: '/userManage',
      name: 'UserManage',
      component: (resolve)=>require(['@/pages/home-page/UserManage.vue'],resolve)
    },
    {
      path: '/deviceManage',
      name: 'DeviceManage',
      component: (resolve)=>require(['@/pages/home-page/DeviceManage.vue'],resolve)
    },
    {
      path: '/poolManage',
      name: 'PoolManage',
      component: (resolve)=>require(['@/pages/home-page/PoolManage.vue'],resolve)
    },
    {
      path: '/login',
      name: 'PageLogin',
      component: (resolve)=>require(['@/pages/pages-page/views/page-login/PageLogin.vue'],resolve)
    }
  ],
})
