<template>
    <h1>Menu</h1>
</template>
<script>
export default {
    data(){
        return{
            name:"唐凯震"
        }
    },
    // 下面是组件内守卫

    // 进入组件之前
    // beforeRouteEnter (to, from, next) {
    //     // ...
    //     next(vue=>{
    //         console.log(vue.name)
    //     })
    // },

    // beforeRouteLeave(to, from, next){
    //     if(confirm("确定离开吗")){
    //         next()
    //     }
    // }
}
</script>
