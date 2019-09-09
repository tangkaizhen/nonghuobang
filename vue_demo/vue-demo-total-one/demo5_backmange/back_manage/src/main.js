// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Cus from './components/Customers.vue'
import About from './components/About.vue'
import Add from './components/Add.vue'
import Details from './components/CustomerDetails.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(VueResource)
const routes=[
  {path:"/",component:Cus},
  {path:"/home",name:"Cus",component:Cus},
  {path:"/about",component:About},
  {path:"/add",component:Add},
  {path:"/details/:id",component:Details}
]

const router=new VueRouter({
  routes,
  mode:"history"
})

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  components: { App },
  template: '<App/>'
})
