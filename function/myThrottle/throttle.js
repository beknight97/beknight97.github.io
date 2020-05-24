// function throttle(func,wait){
//     let _this,args;
//     let old=0;
//     return function(){
//         _this=this;
//         args=arguments;
//         let now=new Date().valueOf();
//         if(now-old>wait){
//             func.apply(_this,args);//第一次进入会立即执行，但是鼠标移动出去的时候会根据时间间隔来判断是否执行函数
//             old=now;
//         }
//     }
// }

// function throttle(func,wait){
//     let _this,args,timeout;

//     return function(){
//         _this=this;
//         args=arguments;

//         if(!timeout){
//             timeout=setTimeout(()=>{
//                 timeout=null;
//                 func.apply(_this,args);//第一次会存在时间间隔执行，但是鼠标移动出去的时候会根据记录的最后一刻延迟执行函数
//             },wait)
//         }
//     }
// }



//第一次输出，最后一次不调用
//第一次不调用，最后依次调用
//第一次调用，最后一次调用


function throttle(func,wait,options){
    let _this,args,timeout;
    let old=0;
    let later=function(){
        old=new Date().valueOf();
        timeout=null;
        func.apply(_this,args);        
    }
    if(!options)options={};
    return function(){
        _this=this;
        args=arguments;
        let now=new Date().valueOf();

        if(options.leading===false&&!old){//通过修改old的方法保证如果都为false的话可以继续通过一号方法执行函数
            old=now;//如果不执行第一次那么就先对old进行记录
        }

        if(now-old>wait){
            if(timeout){
                clearTimeout(timeout);
                timeout=null;
            }
            func.apply(_this,args);//由于old为0所以第一次必然执行函数
            old=now
        }
        else if(!timeout&&options.trailing!==false){
            timeout=setTimeout(later,wait)//由于临结束的时候，settimeout会记录动作，最后一次调用会执行
        }
    }
}
