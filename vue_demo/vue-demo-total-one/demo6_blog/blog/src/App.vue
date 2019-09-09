<template>
  <div id="app">
      <ul>
        <li>
            <router-link to='/'>列表</router-link>
            <router-link to='/add'>新增</router-link>
        </li>
      </ul>
      <router-view></router-view>
  </div>
</template>

<script>
import AddBlog from './components/AddBlog'
import blog_list from './components/blog_list'
// 必须加上export default，否则没法在其他文件中引入
export default {
  name: 'App',
  components: {
    AddBlog,blog_list
  }
}
</script>

<style scoped>
*{
  margin: 0;
  padding: 0
}
#app ul{
   background: #ff0000
}
</style>
