// 这是es6关于类的定义
// react就是通过class来定义的

class Person{
    // 构造器是必须的
    constructor({name,age}){
        this.name=name;
        this.age=age
    }
    
    talk(){
        return '我会说话'
    }
}

//这是继承
class Child extends Person{

    constructor({name,age}) {
        // 调用fuji
        super({name,age});
    }

}
