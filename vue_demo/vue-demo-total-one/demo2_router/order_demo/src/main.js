import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import {routes} from './routes'

Vue.use(VueRouter)

const router=new VueRouter({
  routes,
  // 去除url上面的#
  mode:"history"
})

// 路由守卫可以分为：全局守卫，路由独享守卫，组件内守卫
// 全局守卫，主要是查看是不是已经登录了，这个主要结合vuex来使用
// router.beforeEach((to, from, next) => {
//      if(to.path=="/login"||to.path=="/register"){
//          next();
//      }else{
//          console.log("您还没登录，请先登录");      
//          next("/login");
//      }
// })

new Vue({
  // 增强对象字面量
  router,
  el: '#app',
  render: h => h(App)
})