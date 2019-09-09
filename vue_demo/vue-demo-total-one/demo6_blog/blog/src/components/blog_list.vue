<template>
    <div id="blog-list">
        <h2>博客总览</h2>
        <input type="text" v-model="filter_value">
        <div v-for="blog in filter_blogs" class="single-blog">
            <h2 class="blog_title" @click="to_details(blog.id)" v-rainbow>{{blog.title|Upp}}</h2>
            <article>
                {{blog.body|sippet}}
            </article>
        </div>
    </div>
</template>

<script>
export default {
    name:"blog-list",
    data () {
        return {
            blogs:[],
            filter_value:''
        }
    },
    created() {
        // 如果加载本地的json，需要将json文件放在static文件中
        // this.$http.get("../../static/posts.json")

        this.$http.get("http://jsonplaceholder.typicode.com/posts")
             .then(data=>{
                 this.blogs=data.body.slice(0,10)
             })
    },

    // 计算属性
    computed: {
        filter_blogs(){
            var _this=this
            return _this.blogs.filter(blog=>{
                // 注意每一个迭代器函数都必须要有return

                // 该方法类似 indexOf() 和 lastIndexOf()，但是它返回指定的值，而不是字符串的位置。
                return blog.title.match(_this.filter_value)
            })
        }
    },

    methods: {
        to_details(id){
            this.$router.push("/blog/"+id)
        }
    }
}
</script>

<style scoped>
.blog_title{
    cursor: pointer;
}
</style>


