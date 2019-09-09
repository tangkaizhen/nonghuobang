// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import App from './App'
import routes from './router'

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.config.productionTip = false

// 自定义指令，这是全局指令
Vue.directive("rainbow", {
  bind(el,binding,vnode){
    el.style.color='#'+Math.random().toString(16).slice(2,8)
  }
})

// 过滤器
Vue.filter("Upp",value=>{
  return value.toUpperCase()
})

Vue.filter("sippet",value=>{
  return value.slice(0,50)+'...'
})

// 路由
var router=new VueRouter({
  // 这是es6的用法
  routes,
  mode:'history'
})

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  components: { App },
  template: '<App/>'
})

