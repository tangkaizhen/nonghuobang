// vue-resource是基于promise，fetch,axios也是基于promise的

// let promise=new Promise((resolve,reject)=>{
//     resolve()
// })

// promise是很好的处理异步请求的方式
// promise
//     .then(()=>console.log("成功，没有任何问题1"))
//     .then(()=>cosole.log("成功，没有任何问题2"))
//     .then(()=>console.log("成功，没有任何问题3"))
//     .catch(()=>console.log("有问题啦1"))
//     .catch(()=>console.log("有问题啦2"))
//     .catch(()=>console.long("有问题啦3"))
// catch只能执行一个，但是then可以有多个

// 现在请求数据可以用fetch，以后就不要ajax了
let url="https://jsonplaceholder.typicode.com/posts";

// fetch(url)
//         .then(res=>res.json())
//         .then(data=>data)
//         .catch(err=>err)

/**
 * async,await是终极解决异步的方法
 */
// async function func(){
//     return (await new Promise((resolve,reject)=>{

//         setTimeout(function(){
//             resolve("hello world")
//         },2000)

//     }))

// }
// func().then(res=>console.log(res))

let posts=[
    {
        title:"post one",body:"this is post one"
    },
    {
        title:"post two",body:"this is post two"
    }
]

// 这是模板字符串
function show(){
    
    let str='';
    posts.forEach(post=>{
        str+=`<li>这是${post.title}，她的body是${post.body}</li>`
    })
    document.body.innerHTML=str;
}

// 利用回调函数执行异步操作
function into(post,callback){
    setTimeout(function(){
        posts.push(post)
        callback()
    },2000)
}
into({title:"post three",body:"this is post three"},show)


