<template>
  <div id="app">
    <ul class="nav_ul">
          <li>
              <router-link to="/home">主页</router-link>
          </li>
          <li>
              <router-link to="/about">关于我们</router-link>
          </li>
          <li>
              <router-link to="/add">增加</router-link>
          </li>
        </ul>
        
        <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.nav_ul{
  overflow: hidden;
}
.nav_ul li{
    float: left;
    font-size: 20px;
    color: #ff0000;
    margin-right: 40px
}
</style>
