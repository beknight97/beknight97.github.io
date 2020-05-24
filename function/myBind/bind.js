Function.prototype.myCall=function(object,...args){//object为当前调用mycall函数的新this指向
    const obj=object||window;//判断传入object是否为空    
    obj.fn=this;//由于是当前函数调用的myCall方法，所以this指向当前函数内部，通过赋值临时在object内构建新的临时函数

   

    const result=obj.fn(...args);//判断参数部分是否存在，进行临时函数的调用。


    delete obj.fn;
    return result;//返回临时调用取得的数值并且删除临时函数。
}


Function.prototype.myApply=function(object){
    const obj=object||window;
    obj.fn=this;


    const result=arguments[1]?obj.fn(...arguments[1]):obj.fn();


    delete obj.fn;
    return result
}


Function.prototype.myBind=function(object,...args){
    const obj=object||window
    const funcThis=this;//暂存当前调用myBind的函数
    return function(..._args){//返回一个匿名函数，可以完成延迟调用
        return funcThis.myCall(obj,args.concat(_args));//将暂存的函数利用apply绑定到传入的对象object中，通过concat来连接延迟调用时传入的数组
    }
}