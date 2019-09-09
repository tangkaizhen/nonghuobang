<template>
  <div id="app">
        <productOne></productOne>
        <productTwo></productTwo>
  </div>
</template>

<script>
import productOne from './components/productOne'
import productTwo from './components/productTwo'
export default {
  name: 'App',
  data () {
    return {
       
    }
  },
  components:{productOne,productTwo}
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
</style>
