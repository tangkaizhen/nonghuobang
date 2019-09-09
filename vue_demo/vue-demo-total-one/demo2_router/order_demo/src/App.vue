<template>
  <div id="app">
      <div class="container">
          <!-- 导航组件 -->
          <Hea></Hea>
          
          <router-view></router-view> 
      </div>
  </div>
</template>
<script>
import Hea from "./components/Header"
export default {
  name: 'app',
  components: {
      Hea
  },
  data () {
    return{
    }
  },
  created () {
    // fetch
    fetch("/api/test/testToken.php",{
      method:"post",
      body:"hello"
    }).then(re=>{
      console.log(re);
    })
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
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
