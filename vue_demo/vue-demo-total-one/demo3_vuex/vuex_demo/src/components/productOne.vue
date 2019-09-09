<template>
  <div class="">
        <h1>productOne</h1>
        <ul>
          <li v-for="pro in salesProducts">
                {{pro.name}}{{pro.price}}
          </li>
        </ul>
        <button @click="reducePrice(20)">商品降价</button>
  </div>
</template>


<script>
import {mapGetters,mapActions} from 'vuex'
export default {
  computed:{
      ...mapGetters([
        "salesProducts"
      ])
  },
  methods: {
    // reducePrice(num){
    //   // 这个主要利用到了事件
    //   // this.$store.commit('reducePrice')
    
    //   this.$store.dispatch('reducePrice',num)
    // }
    ...mapActions([
      'reducePrice'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li{
  cursor: pointer;
}
</style>
