
class HD {
    static PENDING = "pending";
    static FULFILLED = "fulfilled";
    static REJECTED = "rejected";

    constructor(executor) {
        this.status=HD.PENDING;
        this.value=null;
        this.callbacks=[];
        try {//在构建对象的时候，通过参数传递执行器，这个执行器会立即在window对象下进行调用，需要用到HD类中的resolve和reject方法。
            executor(this.resolve.bind(this),this.reject.bind(this));//由于resolve和reject函数会在window对象下调用，所以需要用bind实现对当前HD类的绑定。
        } catch (error) {
            this.reject(error)//如果在执行器运行阶段出现错误，那么需要对错误进行处理,下一个then中会收到error。
        }
    }
    then(onFulfilled,onRejected){//then中接受两个参数
        if(typeof onFulfilled!='function'){//为了保证传递空参数的时候不发生报错的现象
            onFulfilled=()=>this.value;//为了保证then的穿透传递,需要将当前的数值进行存储，当下一个then的时候可以进行调用
        }
        if(typeof onRejected!='function'){
            onRejected=()=>this.value;
        }
        
        let promise= new HD((resolve,reject)=>{//then会根据上一promise对象传递的状态执行then中的参数函数
            if(this.status==HD.PENDING){//上一promise对象为pending证明需要延迟执行。
                this.callbacks.push({//需要使用callback来存储then中需要延迟执行的函数参数。
                    onFulfilled:value=>{
                        this.parse(promise,onFulfilled(value),resolve,reject)
                    }
                    ,
                    onRejected:value=>{
                        this.parse(promise,onRejected(value),resolve,reject)
                    }
                })   
            }
            if(this.status==HD.FULFILLED){//根据上一promise状态，执行函数参数onfulfilled，并且利用resolve或reject改变当前返回的promise状态。       
                setTimeout(()=>{
                    this.parse(promise,onFulfilled(this.value),resolve,reject)
                }
                )  
            }
            if(this.status==HD.REJECTED){
                setTimeout(()=>{
                    this.parse(promise,onRejected(this.value),resolve,reject) 
                })
            }
        })
        return promise;
    }

    resolve(value){
        if(this.status==HD.PENDING){//判断状态，只能处理pending->fulfilled
            this.status=HD.FULFILLED;
            this.value=value;
            setTimeout(()=>{//需要使用settimeout来进行包裹，这样就可以保证promise函数的异步执行功能。
            this.callbacks.map(//如果resolve存在延迟执行的情况，callback存储了then中的处理函数，可以延迟后进行调用。
                callback=>{
                    callback.onFulfilled(this.value);
                }
            )
            }
            )
        }
    }

    reject(reason){
        if(this.status==HD.PENDING){
            this.status=HD.REJECTED;
            this.value=reason;
            setTimeout(()=>{
            this.callbacks.map(
                callback=>{
                    callback.onRejected(reason);
                }
            )
            }
            )
        }
    }

    parse(promise,result,resolve,reject){//result为then中函数参数的返回值，也同样为下一个then所接受的value。
        if(promise==result){
            throw new TypeError("chaining cycle detected")
            }
        try {
 
            if(result instanceof HD)//判断返回值是否为promise实例。
            {
            result.then(resolve,reject)//由于是promise实例，所以需要将promise实例中的状态和数值进行保留，采用默认的resolve和reject方法可以完成状态保留的任务。
            }else{//因为then参数为resolve和reject的时候，会在取值result的时候改变状态，不需要进行parse函数。
            resolve(result)//返回的下一个promise都需要改变为resolve状态   
            }
        } catch (error) {
            reject(error);//如果遇到错误的情况，下一个promise改变为reject状态
        }
    }



    static resolve(value){
        return new HD((resolve,reject)=>{
            if(value instanceof HD){
             value.then(resolve,reject);
            }else{
             resolve(value);   
            }
            
        })
    }

    static reject(value){
        return new HD((resolve,reject)=>{ 
             reject(value);   
        })
    }

//race和all都是改变的是新返回promise的状态。
    static all(promises){
        const resolves=[];//存储所有promise成功所返回的结果
        return new HD((resolve,reject)=>{
           promises.forEach(promise=>{          
            promise.then(value=>{
                resolves.push(value)
                if(resolves.length==promises.length){
                    resolve(resolves)
                }
                },reason=>{
                    reject(reason)
                })
        }) 
        })
    }

    static race(promises){
        return new HD((resolve,reject)=>{
            promises.map(promise=>{
                promise.then(value=>{//如果状态发生改变后就不会变动，所以根据循环的promise先后顺序来取得状态和状态值。
                    resolve(value)                    
                },reason=>{
                    reject(reason)
                }
                )
            })
        })
    }

}