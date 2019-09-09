<template>
    <div class="single_blog">
        <h1>{{blog.title}}</h1>
        <p>{{blog.body}}</p>
    </div>
</template>
<script>
export default {
    name:'single_blog',
    data () {
        return {
            blog:{},
            id:this.$route.params.id
        }
    },
    created() {
        // 首先获取路由参数
        this.$http.get("http://jsonplaceholder.typicode.com/posts/"+this.id)
        .then(data=>{
            this.blog=data.body
        })
    },
}
</script>
