<template>
  <div class="add">

        <form @submit="submit_form" action="">
            <h1>用户信息</h1>
            <input type="text" v-model="customer.name" placeholder="name">
            <input type="text" v-model="customer.phone" placeholder="tel">
            <input type="text" v-model="customer.email" placeholder="email">
            <input type="text" v-model="customer.age" placeholder="age">
            <input type="text" v-model="customer.companyId" placeholder="companyId">
            <input type="submit" value="提交">
        </form>
  </div>
</template>

<script>
export default {
  name: 'add',
  data () {
    return {
        customer:{
            name:"",
            phone:"",
            email:"",
            age:0,
            companyId:0,
        }
    }
  },
  methods:{
    submit_form(e){

        this.$http.post("http://localhost:3000/users",this.customer)
            .then(res=>{
                //这是通过name的方式提交路由                
                this.$router.push({name:"Cus",params:{alert:"用户信息"}});
            });


            // 阻止默认提交事件
            e.preventDefault();
            
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
