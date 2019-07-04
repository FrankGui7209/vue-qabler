// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAntd from 'vue-antd-ui'
import VueViser from 'viser-vue'
import ElementUI from 'element-ui';
import store from '@/vuex/store';
import 'element-ui/lib/theme-chalk/index.css';
import 'vue-antd-ui/dist/antd.css'
import './assets/css/reset.css'
// import './common/js/rem'
import './assets/semantic.css'
import './assets/semantic.js'
import api from '@/utils/api'

Vue.config.productionTip = false

Vue.use(VueAntd)
Vue.use(VueViser)
Vue.use(ElementUI)
Vue.prototype.$api = api
Vue.prototype.$store = store
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
