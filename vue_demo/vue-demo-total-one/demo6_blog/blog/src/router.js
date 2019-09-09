import add from './components/AddBlog.vue'
import blog_list from './components/blog_list.vue'
import single_blog from './components/single_blog.vue'
// 这件文件专门做路由
export default [
    {path:'/',component:blog_list},
    {path:'/add',component:add},
    {path:'/blog/:id',component:single_blog},
]