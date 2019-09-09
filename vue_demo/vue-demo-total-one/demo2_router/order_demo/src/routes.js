import Home from "./components/Home"
import Admin from "./components/Admin"
import Login from "./components/Login"
import Menu from "./components/Menu"
import Register from "./components/Register"
import About from "./components/about/About"
import Contact from "./components/about/Contact"
import Delivery from "./components/about/Delivery"
import History from "./components/about/History"
import Ordering from "./components/about/Ordering"

export const routes=[
    {path:"/",component:Home},
    {path:"/home",component:Home},
    // 路由独享守卫
    {path:"/admin",component:Admin,beforeEnter: (to, from, next) => {
        console.log("需要登录")
    }},
    {path:"/login",component:Login},
    {path:"/menu",component:Menu},
    {path:"/register",component:Register},
    {path:"/about",redirect: "/about/contact",component:About,children:[
          {path:"/contact",component:Contact},
          {path:"/history",component:History},
          {path:"/delivery",component:Delivery},
          {path:"/order",component:Ordering},
        ]},
        // 当找不到指定的路由，就会重定向到/
    {path:"*",redirect: "/"},
]