function PromiseX(fun){
    var _this = this;
    this.status = 'pendding';
    this.data = null;
    this.error = null;
    this.resolve = function(data){
        _this.changeStatus('success');
        _this.thenCb&&_this.thenCb(data);
        _this.data = data;
    }
    this.reject = function(e){
        _this.changeStatus('error');
        _this.thenErrCb&&_this.thenErrCb(e);
        _this.error = e;
    }
    fun&&fun(this.resolve,this.reject,this)
}
PromiseX.prototype.then = function(cb,errCb){
    if(this.data){
        cb&&cb(this.data);
    }
    if(this.error){
        errCb&&errCb(this.error);
    }
    this.thenCb = cb;
    this.thenErrCb = errCb;
    return this;
}
PromiseX.prototype.changeStatus = function(status){
    this.status = status;
}