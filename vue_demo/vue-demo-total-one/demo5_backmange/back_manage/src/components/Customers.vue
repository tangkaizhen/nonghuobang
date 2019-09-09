<template>
  <div class="customers">
        <Alert :message="alert"></Alert>
        <h1>用户管理系统</h1>
        <input type="text" v-model="search_word">
        <table>
              <thead>
                    <tr>
                        <th>姓名</th>
                        <th>电话</th>
                        <th>邮箱</th>
                        <th></th>
                    </tr>
              </thead>
              <tbody>
                  <tr v-for="(customer, index) in sarch">
                      <td>{{customer.name}}</td>
                      <td>{{customer.phone}}</td>
                      <td>{{customer.email}}</td>
                      <td><router-link :to="'/details/'+customer.id">详情</router-link></td>
                  </tr>
              </tbody>
        </table>
  </div>
</template>

<script>
import Alert from './Alert'
export default {
  name: 'customers',
  components:{Alert},
  data () {
    return {
        alert:"",
        search_word:"",
        customers:[]
    }
  },
  computed: {
        //查找用户   
      sarch(){
          return this.customers.filter(cu=>{
                return cu.name.indexOf(this.search_word)>-1
          }
          )
      }
  },
  created () {

      if(this.$route.params.alert){
          this.alert=this.$route.params.alert
      }else{
      }
      
      this.$http.get("http://localhost:3000/users")
            .then(res=>{
                if(res.status==200){
                      this.customers=res.body;
                }
            });
  },
  methods: {
      details(id){
          
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.customers table,.customers tr{
    width: 100%
}
.customers tr{
    border-bottom: 5px solid #000;
    padding:10px 0
}
.customers th,.customers td{
    width: 20%
}
</style>
