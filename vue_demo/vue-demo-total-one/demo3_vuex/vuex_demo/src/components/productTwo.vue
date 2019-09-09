<template>
  <div class="product-list-two">
      <h1>productTwo</h1>
      <ul>
          <li v-for="pro in products">
               {{pro.name}}{{pro.price}}
          </li>
        </ul>
  </div>
</template>

<script>
export default {
  name: 'productTwo',
  computed:{
      products(){
          return this.$store.getters.salesProducts;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
