<template>
  <div class="details">
      <button @click="back_home">返回</button>
      {{cu.name}}
      <button @click="delte(cu.id)">删除</button>
  </div>
</template>

<script>
export default {
  name: 'details',
  data () {
    return {
        cu:{}
    }
  },
  created () {
    this.$http.get("http://localhost:3000/users/"+this.$route.params.id)
            .then(res=>{
                if(res.status==200){
                      this.cu=res.body
                }
            });
  },
  methods: {
    back_home(){
        this.$router.push("/home");
    },
    delte(id){
        if(confirm("确定删除")){
            this.$http.delete("http://localhost:3000/users/"+id)
              .then(res=>{
                  if(res.status==200){
                    this.$router.push("/home");
                  }
            });
        }else{
          alert("取消删除");
        }
        
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
