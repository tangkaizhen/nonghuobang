<template>
    <div class="add_blog">
        <h2>添加博客</h2>
        <!-- 
            v-if:是把dom结构都去除了，
            v-show：是将dom结构藏起来
         -->
        <form action="" v-if="ifshowblog">
            <label>博客标题</label>
            <input type="text" v-model="blog.title" required>
            <label>博客内容</label>
            <textarea name="" id="" cols="30" rows="10" v-model="blog.content"></textarea>
            <div class="checkboxes">
                <label>vue.js</label>
                <input type="checkbox" value="vue.js" v-model="blog.checkboxs">
                <label>node.js</label>
                <input type="checkbox" value="node.js" v-model="blog.checkboxs">
                <label>react.js</label>
                <input type="checkbox" value="react.js" v-model="blog.checkboxs">
                <label>angular.js</label>
                <input type="checkbox" value="angular.js" v-model="blog.checkboxs">
            </div>
            <label>作者:</label>
            <select name="" id="" v-model="blog.author">
                <option value="志伟" selected>志伟</option>
                <option value="小胡">小胡</option>
                <option value="阿震">阿震</option>
            </select>

            <!-- prevent是组织点击的默认事件 -->
            <button @click.prevent="post">添加博客</button>
        </form>
        <p v-else>博客添加成功</p>
    </div>
</template>

<script>
export default {
    name:'add_blog',
    data () {
        return {
            // 有关联的数据尽量使用object
            blog:{
                title:'',
                content:'',
                checkboxs:[],
                author:''
            },
            ifshowblog:true,
        }
    }, 
    methods: {
        post(){
            // 这是调用vue-resource的插件，vue实例的属性和方法都是以$开头的，其是基于promise的
            this.$http.post("http://jsonplaceholder.typicode.com/posts",{
                userId:1,
                title:this.blog.title,
                body:this.blog.content
            })
            .then(data=>{
                this.ifshowblog=false
            })
        }
    },
}
</script>

<style scoped>

</style>


