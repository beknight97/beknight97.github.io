//防抖就是令某个函数多次调用仅取最后一次延迟执行,防止函数重复执行造成页面卡顿
function debounce(func,wait,immediate){
    var timeOut,result;
    let debounced= function(){
        clearTimeout(timeOut);
        var _this=this//将this指向当前所使用的元素。
        var args=arguments//func中需要传递当前所使用元素的内部参数。
        if(immediate){//如果immediate为true意思是刚进入就立即执行，之后的多次调用没有效果
            var now=!timeOut;
            timeOut=setTimeout(()=>{
                now=null;
            },
            wait
            )//第一次进入就设置计时器，如果计时器完成那么timeOut为true，永远无法再次调用func。只能通过再次触发deebounce事件。
            if(now){
            result=func.apply(_this.args)                
            }
        }else{
        timeOut=setTimeout(function(){//返回变量的目的是清除延迟执行的函数,只从最后一次事件调用开始计时，完成防抖的效果。    
            result=func.apply(_this,args)
        },wait);
        }
        return result;
    }
    debounced.cancel=function(){
        clearTimeout(timeOut)//通过清除定时器来实现结束防抖，只能通过再次触发事件来继续防抖。
        timeOut=null;//并且将计时器数据清零从头记录。
    }
    return debounced;
}