import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export const store=new Vuex.Store({
// 数据源
    state: {
        products:[
            {name:"马云",price:1000},
            {name:"马化腾",price:800},
            {name:"马冬梅",price:600},
            {name:"马蓉",price:400}
         ]
    },
// 这里面主要放置一些方法
    getters:{
        // getter里面可以放置各种方法
        salesProducts(state){
            var salesProducts=state.products.map(pro=>{
                return {
                    name:pro.name,
                    price:pro.price/2
                }
           });
           return salesProducts
        }
    },
// 修改state
    mutations:{
        reducePrice(state,payload){
            state.products.forEach(product => {
              return product.price-=payload
            });
          }
    },
    
    //action:不能直接修改state，只能提交一个mutation，其对异步很有效果 
    actions:{
        reducePrice(context,payload){
            setTimeout(()=>{context.commit('reducePrice',payload)},2000)
        }
    }
});