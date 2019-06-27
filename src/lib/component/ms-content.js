// avalon ms-content特殊处理，使其可以支持插槽使用模板语法，支持数据传递 class='ms-controller'
avalon.component("ms-content", {
    template: heredoc(function () {
        /*
          <cc class='ms-controller'>
            <slot name='rdata'></slot>
          </cc>
         */
    }),
    defaults: {
        // 用于初始化组件数据--初始化定义变量
        isIE:function(){
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if(isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                return 'ie'
            } else if(isEdge) {
                return 'edge';//edge
            } else if(isIE11) {
                return 'ie11'; //IE11  
            }else{
                return -1;//不是ie浏览器
            }
        },
        load: [],
        data: {},
        events: [],
        trigger: function () {
            var args = [];
            avalon.mix(args, arguments);
            var funcName = args[0];
            avalon.Array.removeAt(args, 0);
            var dddd = "";
            for (var i = 0; i < args.length; i++) {
                if (avalon.isObject(args[i])) {
                    dddd += "args[" + i + "]" + ",";
                } else {
                    dddd += "\'" + args[i] + "\'" + ",";
                }
            }
            dddd = (dddd.slice(dddd.length - 1) == ',') ? dddd.slice(0, -1) : dddd;
            //解析参数，判断参数类型，然后给与方法回调
            eval(funcName + "(" + dddd + ")");
        },
        onInit: function (e) {
            // 处理模板语句-------------------------------
            var dom = e.target;
            var that = this;
            var vm; // vm 对象
            // 将所有zr- 替换为ms-
            var html = $(e.target).html().replace(new RegExp('zr-', "g"), 'ms-').replace(new RegExp(
                '{#', "g"), '{{').replace(new RegExp('#}', "g"), '}}');
            $(dom).html(html);

            // // 替换模板组件插槽中的双括号，使其不被框架解析，让其流转到下次解析，从而让作用域保持在组件内部，而不是使用父级作用域，造成变量污染
            var htmlTemplates = dom.getElementsByTagName('template');
            if (htmlTemplates.length > 0) {
                for (var i = 0; i < htmlTemplates.length; i++) {
                    if(that.isIE() === 'ie' || that.isIE() ==='ie11') {
                        if ( htmlTemplates[i].innerText !== '') {
                            htmlTemplates[i].innerHTML =htmlTemplates[i].innerText.toString().replace(new RegExp('ms-', "g"), 'zr-').replace(new RegExp('{{', "g"), '{#').replace(new RegExp('}}', "g"), '#}');
                        }
                    } else {
                        if ( htmlTemplates[i].innerHTML!== '') {
                            htmlTemplates[i].innerHTML = htmlTemplates[i].innerHTML.toString().replace(new RegExp('ms-', "g"), 'zr-').replace(new RegExp('{{', "g"), '{#').replace(new RegExp('}}', "g"), '#}');
                        }
                    }
                }
            }
            // 处理模板语句-------------------------------

            // 修改自身，将自己更改为 控制器
            var uuid = UUID();
            // dom.setAttribute('ms-controller', uuid);
            dom.setAttribute('ms-important', uuid);
            // 事件定义
            var options = {};

            // 定义vm 并扫描执行转换vm
            vm = avalon.define({
                $id: uuid,
                data: this.data,
                trigger:avalon.noop
            });

            options.trigger = function () {
                var args = [];
                avalon.mix(args, arguments);
                var funcName = args[0];
                avalon.Array.removeAt(args, 0);
                args.push(vm);
                var dddd = "";
                for (var i = 0; i < args.length; i++) {
                    if (avalon.isObject(args[i])) {
                        dddd += "args[" + i + "]" + ",";
                    } else {
                        dddd += "\'" + args[i] + "\'" + ",";
                    }
                }
                dddd = (dddd.slice(dddd.length - 1) == ',') ? dddd.slice(
                    0, -1) : dddd;
                //解析参数，判断参数类型，然后给与方法回调
                eval(funcName + "(" + dddd + ")");
            };
            vm.trigger = options.trigger;

            // 查看event中是否设置了订阅事件名，如果设置了则添加事件订阅
            for (var i = 0; i < this.events.length; i++) {
                var tahtEvent = this.events[i];
                zEvent.on(tahtEvent, function () {
                    var args = [];
                    args = avalon.mix(true, args, arguments);
                    args.push(vm);
                    var dddd = "";
                    for (var i = 0; i < args.length; i++) {
                        if (avalon.isObject(args[i])) {
                            dddd += "args[" + i + "]" + ",";
                        } else {
                            dddd += "\'" + args[i] + "\'" + ",";
                        }
                    }
                    dddd = (dddd.slice(dddd.length - 1) == ',') ? dddd.slice(0, -1) : dddd;
                    eval(tahtEvent + "(" + dddd + ")");
                });
            }

            // 处理数据-- 如果存在load事件
            if (this.load.length > 0) {
                var thatLoad = this.load;
                var mm = new PromiseX(function (resolve, reject, e) {
                    var args = [];
                    args = avalon.mix(args, thatLoad);
                    var funcName = thatLoad[0];
                    avalon.Array.removeAt(args, 0);
                    args.push(e);
                    args.push(vm);
                    var dddd = "";
                    for (var i = 0; i < args.length; i++) {
                        if (avalon.isObject(args[i])) {
                            dddd += "args[" + i + "]" + ",";
                        } else {
                            dddd += "\'" + args[i] + "\'" + ",";
                        }
                    }
                    dddd = (dddd.slice(dddd.length - 1) == ',') ? dddd.slice(0, -1) : dddd;
                    //解析参数，判断参数类型，然后给与方法回调
                    eval(funcName + "(" + dddd + ")");
                    avalon.scan(dom, vm);
                    avalon.log("data load start!");
                });
                mm.then(function (data) {
                    // 向this.data 中加入数据,改变dom作用域
                     vm.data = data;
                    // 稍微修改一下，保证传递数据以后才scan其他组件，保证整个组件树顺序执行
                    // avalon.scan(dom, vm);
                    avalon.log("data load complate!");
                }, function () {
                    avalon.log('fail!');
                });
            }
            else {
                // 最后扫描
                avalon.scan(dom, vm);
                avalon.log("scan!");
            }
        },
        onReady: function(e) {
            avalon.log(e);
        },
        onViewChange: function(e) {
            avalon.log(e);
        },
        onDispose: avalon.noop
    },
    soleSlot: 'rdata'
});


// ajax 获取数据
var getData = function (url, params, dataType) {
    if (!dataType) {
        dataType = 'json';
    }
    var mm = new PromiseX(function (resolve, reject, e) {
        jQuery.support.cors = true;
        jQuery.get(url, params, function (data, state) {
            if (data) {
                resolve(data);
            }
        }, dataType);
    });
    return mm;
};

// ajax post 数据
var postData = function (url, params, dataType) {
    if (!dataType) {
        dataType = 'json';
    }
    var mm = new PromiseX(function (resolve, reject, e) {
        jQuery.support.cors = true;
        jQuery.post(url, params, function (data, state) {
            if (data) {
                resolve(data);
            }
        }, dataType);
    });
    return mm;
};


// 自定义过滤器  过滤器扩展

// html转纯文本
avalon.filters.htmltoText = function (str) {
    var text = str.replace(/<.*?>/g, "");
    return text;
};

// 首字母大写
avalon.filters.capitalize = function (value) {
    if (!value) return "";
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
};



// 通用常用方法
function heredoc(fn) {
    return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').
        replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
};