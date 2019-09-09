//es6数组遍历均是以迭代器作为基础的。

// var color=["red","blue","green"]
// color.forEach(co=>{
//     console.log(co);
// })


var numbers = [1, 2, 3, 4, 5]
// map要求每一项都要映射到
// 如果箭头函数写在同一行，就不需要加return，否则需要加个return。
// let numbers2=numbers.map(num=>num*2);
// console.log(numbers2)

// var sum = 0;
// numbers.forEach(number => {
//     sum += number;
// })


var products = [{
        name: "sucai1",
        type: "vegetable"
    },
    {
        name: "sucai2",
        type: "vegetable"
    },
    {
        name: "sucai3",
        type: "vegetable"
    },
    {
        name: "banana1",
        type: "fruit"
    },
    {
        name: "banana2",
        type: "fruit"
    }
]
product_names=[];
products.map(product=>{
    product_names.push(product.name)
})
// console.log(product_names)
// 当箭头函数没有{}时候，可以不要加return，当有大括号，需要加上return
var vege = products.filter(product => product.type == "fruit")
// console.log(vege);

// generator生成器，和函数不一样的是，其可以返回多个值
function* add_index(){
        let index=1;
        while(true){
            // yield相当于return
            yield index++;
        }
}

var gen=add_index();
for(var i=0;i<10;i++){
    // console.log(gen.next().value);
}

// 模板字符串,如果取值，用${}
// 可以直接插值
// let template=`sdfcv`;
// document.getElementById("content").innerHTML=template;
// function moban(){
//     return `2+1`
// };
// console.log(moban());





        
