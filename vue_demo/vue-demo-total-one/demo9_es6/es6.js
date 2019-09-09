// 函数默认值
function User(name='tkz',age=13){
    this.name=name;
    this.age=age;
}

// 展开运算符
function calcTotal(...numbers){
// sum的初始值就是0
    return numbers.reduce((sum,number)=>{
        return sum+=number
    },0)
}
console.log(calcTotal(1,2,3))

// 解构
let expense={
    type:"es6",
    amount:"45"
}
let {type,amount}=expense
let names=["王志伟","小胡","唐凯震"]
let [a,b,c]=names



