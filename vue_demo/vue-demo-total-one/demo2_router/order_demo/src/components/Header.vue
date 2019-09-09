<template>
    <header>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a href="/" class="navbar-brand">Pizza点餐系统</a>
            <ul class="navbar-nav">
                <!-- 编译之后还是a标签 -->
                <li><router-link :to="homeLink" class="navbar-link">主页</router-link></li>
                <li><router-link to="menu" class="navbar-link">菜单</router-link></li>
                <li><router-link to="admin" class="navbar-link">管理</router-link></li>
                <li><router-link to="about" class="navbar-link">关于我们</router-link></li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <li><router-link to="login" class="navbar-link">登录</router-link></li>
                <li><router-link to="register" class="navbar-link">注册</router-link></li>
            </ul>
        </nav>
    </header>
</template>

<script>
export default {
    data(){
        return{
            "homeLink":"/"
        }
    }
}
</script>

