<template>
    <div>
        <button @click="toLastpage">跳转到上一个界面</button>
        <button @click="toThatpage">跳转指定的界面</button>
    </div>
</template>

<script>
export default {
    methods: {
        toLastpage(){
            // this表示实例，带$表示是vue实例的属性，这是表示跳转到上一个界面
            this.$router.go(-1);
        },
        toThatpage(){
            // 跳转到指定的界面
            // this.$router.replace("/menu");
            // 还有一种跳转的方法
            this.$router.push("/menu")
        }
    }
}
</script>
