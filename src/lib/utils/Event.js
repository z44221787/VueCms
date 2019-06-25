//发布订阅模式
      function EventEmiter() {
        this._events = {};
    };

    EventEmiter.prototype.on = function (eventName, callback) {
        if (this._events[eventName]) {
            //如果有就放一个新的
            this._events[eventName].push(callback);
        } else {
            //如果没有就创建一个数组
            this._events[eventName] = [callback];
        }
    };

    // eventName, rest
    EventEmiter.prototype.emit = function () {
        var eventName = '';
        var rest = [];
        for (var i= 1;i<arguments.length;i++) {
            rest.push(arguments[i]);
        }
        if (arguments.length>=1) {
            eventName = arguments[0];
        }
        if (this._events[eventName]) { //循环一次执行
            var that = this;
            for (var item in this._events[eventName]) {
                this._events[eventName][item].apply(that, rest);
            }
        }
    };

    EventEmiter.prototype.removeListener = function (eventName, callback) {
        if (this._events[eventName]) {
            //当前数组和传递过来的callback相等则移除掉
            this._events[eventName] = this._events[eventName].filter(function (item) {
                item !== callback
            });
        }
    };

    EventEmiter.prototype.once = function (eventName, callback) {
        function one() {
            //在one函数运行原来的函数，只有将one清空
            callback.apply(this, arguments);
            //先绑定 执行后再删除
            this.removeListener(eventName, one);
        }
        this.on(eventName, one);
        //此时emit触发会执行此函数，会给这个函数传递rest参数
    };


    // 注册全局event 发布订阅对象
    var zEvent = new EventEmiter();