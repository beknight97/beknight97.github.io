function simpleClone(object){
    var obj={};
    for(var i in object){
        obj[i]=object[i]
    }
    return obj;
}


function DeepCopy(object){
    if(typeof object!=='object'){
        return;//如果传入的参数不为对象那么就直接返回
    }    
    var newobj=object.constructor===Array?[]:{};//判断参数为数组或对象

    for(var i in object){
        newobj[i]=typeof object[i]==='object'?
        copy(object[i]):obj[i];//如果发现元素为对象那么就进行递归存储
    }
    return newobj
}