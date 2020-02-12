import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 在main.js入口文件中注册axios，就可以在各个vue文件通过this.xxx的方式使用
import axios from '@/common/axios.js'
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
