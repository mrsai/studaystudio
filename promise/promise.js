function PromiseB(fun) {
    this.succArg = undefined;
    this.failArg = undefined;
    this.succCbs = [];
    this.failCbs = [];

    this._execFun(fun);
}

PromiseB.prototype.STATUS = {
    PENDING: 1, //挂起状态
    RESOLVE: 2, //完成状态
    REJECT: 3   //拒绝状态
}

PromiseB.prototype._isFunction = function(f) {
    return Object.prototype.toString.call(f) === '[object Function]';
}

PromiseB.prototype._exex = function(callback,arg){
    var newcallback;

    if(this._isFunction(callback)){
        if(callback instanceof PromiseB){
            callback.resolve(args);
        }else{
            newcallback = new PromiseB(callback);
            newcallback.resolve(args);
        }
    }
}
//fun 为最外层函数
PromiseB.prototype._execFun = function(fun){
    var _this = this;
    // 判断是否是函数，绑定俩个成功和失败的方法
    if(this._isFunction(fun)){
        // 对应 resolve 方法
        fun(function(){
            //获取所有的参数,转化为数组
            _this.succArg = Array.prototype.slice.apply(arguments);
            // 设置当前状态
            _this._status = _this.STATUS.RESOLVE;
            //执行resolve 方法
            _this.resolve.apply(_this,_this.succArg);
        // 对应 reject 方法
        },function(){
            _this.failArg = Array.prototype.slice.apply(arguments);
            _this._status = _this.STATUS.REJECT;
            _this.reject.apply(_this, _this.succArg);
        })
    }else{
        this.resolve(fun);
    }
} 

PromiseB.prototype.resolve = function(){
    var arg = arguments,
        ret,
        callback = this.succCbs.shift();

    if(this._status === this.STATUS.RESOLVE && callback){
        ret = callback.apply(callback,arg);
        if(!(ret instanceof PromiseB)){
            var _ret = ret;
            ret = new PromiseB(function(resolve){
                setTimeout(function(){
                    resolve(_ret);
                })
            });

            ret.succCbs = this.succCbs.slice();
        }
    }
}

PromiseB.prototype.reject = function(){
    var arg = arguments,
        ret,
        callback = this.failCbs.shift();

    if(this._status === this.STATUS.REJECT && callback){
        ret = callback.apply(callback,arg);
        if(!(ret instanceof PromiseB)){
            var _ret = ret;
            ret = new PromiseB(function(reject){
                setTimeout(function(){
                    reject(_ret);
                })
            });

            ret.failCbs = this.failCbs.slice();
        }
    }
}

PromiseB.prototype.then = function(s,f){
    this.done(s);
    this.fail(f);
    return this;
}

PromiseB.prototype.done = function(fun){
    if(this._isFunction(fun)){
        if(this._status === this.STATUS.RESOLVE){
            fun.apply(fun,this.succArg);
        }else{
            this.succCbs.push(fun);
        }
    }
    return this;
}

PromiseB.prototype.fail = function(fun){
    if(this._isFunction(fun)){
        if(this._status === this.STATUS.REJECT){
            fun.apply(fun,this.failArg);
        }else{
            this.failCbs.push(fun);
        }
    }
    return this;
}

PromiseB.prototype.always = function(fun){
    this.done(fun);
    this.fail(fun);
    return this;
}
