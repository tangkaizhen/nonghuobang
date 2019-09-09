<template>
    <div>
        <div class="row mb-5">
            <div class="col-4">
                <ul class="list-group mb-5">
                    <!-- tag是表示将router-link转变成li标签 -->
                    <router-link to="/about/history" tag="li" class="nav-link">历史订单</router-link>
                    <router-link to="/about/contact" tag="li" class="nav-link">联系我们</router-link>
                    <router-link to="/about/order" tag="li" class="nav-link">点餐文档</router-link>
                    <router-link to="/about/delivery" tag="li" class="nav-link">快递信息</router-link>
                </ul>
            </div>
            <div class="col-8">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>

<style scoped>
.nav-link{
    cursor: pointer;
}
</style>
