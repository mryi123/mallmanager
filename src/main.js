// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/login.css'
import router from './router'
import http from '@/assets/plugins/http';
import CurBreadcrumb from '@/components/common/curBreadcrumb'

Vue.component('CurBreadcrumb',CurBreadcrumb)
// 安装插件
Vue.use(ElementUI)
Vue.use(http)
Vue.use(require('vue-moment'))
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

