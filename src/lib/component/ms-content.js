// 是否开启调试
avalon.config({ debug: true });

// avalon ms-content特殊处理，使其可以支持插槽使用模板语法，支持数据传递 class='ms-controller'
avalon.component("ms-content", {
    template: "<cc class='ms-controller'><slot name='rdata'></slot></cc>",
    defaults: {
        // 用于初始化组件数据--初始化定义变量
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
            // 清空模板组件下的html
            var htmlTemplate = $(dom).find('template').text();
            // 将所有zr- 替换为ms-
            var html = $(e.target).html().replace(new RegExp('zr-', "g"), 'ms-').replace(new RegExp(
                '{#', "g"), '{{').replace(new RegExp('#}', "g"), '}}');
            $(dom).html(html);
            if (htmlTemplate) {
                $(dom).find('template').html(htmlTemplate.replace(new RegExp('{{', "g"), '{#')
                    .replace(new RegExp('}}', "g"), '#}'));
            }
            // 处理模板语句-------------------------------

            // 修改自身，将自己更改为 控制器
            var uuid = UUID();
            dom.setAttribute('ms-controller', uuid);

            // 事件定义
            var options = {};

            options.trigger = function () {
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
                dddd = (dddd.slice(dddd.length - 1) == ',') ? dddd.slice(
                    0, -1) : dddd;
                //解析参数，判断参数类型，然后给与方法回调
                eval(funcName + "(" + dddd + ")");
            };


            // 定义vm 并扫描执行转换vm
            vm = avalon.define({
                $id: uuid,
                data: this.data,
                trigger: options.trigger
            });

            // 查看event中是否设置了订阅事件名，如果设置了则添加事件订阅
            for (var i = 0; i < this.events.length; i++) {
                var tahtEvent = this.events[i];
                (function (tahtEvent) {
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
                })(tahtEvent);
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
                });
                mm.then(function (data) {
                    // 向this.data 中加入数据
                    vm.data = data;
                    // 最后扫描
                    avalon.scan(dom, vm);
                    console.log("ok!");
                }, function () {
                    console.log('fail!');
                });
            } else {
                // 最后扫描
                avalon.scan(dom, vm);
            }


        },
        onReady: avalon.noop,
        onViewChange: avalon.noop,
        onDispose: avalon.noop
    },
    soleSlot: 'rdata'
});


/**
 * get 获取数据
 * @param {string} url 路径
 * @param {object} params 参数
 * @param {string} dataType 数据类型 默认json
 */
var getData = function (url, params, dataType, async) {
    if (dataType == null && dataType === 'undefined' || dataType === '') {
        dataType = 'json';
    }
    if (async == null && async === 'undefined' || async === '') {
        async = true;
    }
    if (async === false) {
        // 此时是同步执行
        jQuery.support.cors = true;
        var resultData;
        jQuery.ajax({
            type: "GET",
            url: url,
            cache: false,
            data: params,
            dataType: dataType,
            async: false,
            success: function (data, state) {
                if (data) {
                    resultData = data;
                }
            },
            error:function(state){
                resultData = {error:true,state:state};
            }
        });
        // 同步promise执行
        return new PromiseX(function (resolve, reject, e) {
            resolve(resultData);
        });

    } else {
        var mm = new PromiseX(function (resolve, reject, e) {
            jQuery.support.cors = true;
            jQuery.ajax({
                type: "GET",
                url: url,
                cache: false,
                data: params,
                dataType: dataType,
                async: true,
                success: function (data, state) {
                    if (data) {
                        resolve(data);
                    }
                },
                error:function(state){
                    resultData = {error:true,state:state};
                }
            });
        });
        return mm;
    }
};

/**
 * post 获取数据
 * @param {any} url 路径
 * @param {any} params 参数
 * @param {any} dataType   数据类型 默认json
 */
var postData = function (url, params, dataType, async) {
    if (dataType == null && dataType === 'undefined' || dataType === '') {
        dataType = 'json';
    }
    if (async == null && async === 'undefined' || async === '') {
        async = true;
    }
    if (async === false) {
        // 此时是同步执行
        jQuery.support.cors = true;
        var resultData;
        jQuery.ajax({
            type: "POST",
            url: url,
            cache: false,
            data: params,
            dataType: dataType,
            async: false,
            success: function (data, state) {
                if (data) {
                    resultData = data;
                }
            },
            error:function(state){
                resultData = {error:true,state:state};
            }
        });
        // 同步promise执行
        return new PromiseX(function (resolve, reject, e) {
            resolve(resultData);
        });

    } else {
        var mm = new PromiseX(function (resolve, reject, e) {
            jQuery.support.cors = true;
            jQuery.ajax({
                type: "POST",
                url: url,
                cache: false,
                data: params,
                dataType: dataType,
                async: true,
                success: function (data, state) {
                    if (data) {
                        resolve(data);
                    }
                },
                error:function(state){
                    resultData = {error:true,state:state};
                }
            });
        });
        return mm;
    }
};


//-----------------------------------------扩展指令------------------------------------------------//
avalon.directive('tohtml', {
    init: function init() {
        var node = this.node;
        if (node.isVoidTag) {
            avalon.error('自闭合元素不能使用ms-text');
        }
        //var child = { nodeName: '#text', nodeValue: this.getValue() };
        //node.children.splice(0, node.children.length, child);
        //if (inBrowser) {
        //    avalon.clearHTML(node.dom);
        //    node.dom.appendChild(avalon.vdom(child, 'toDOM'));
        //}
        //this.node = child;
        //var type = 'expr';
        //this.type = this.name = type;
        //var directive$$1 = avalon.directives[type];
        //var me = this;
        //this.callback = function (value) {
        //    directive$$1.update.call(me, me.node, value);
        //};
    },
    //diff: function diff(newVal, oldVal) {
    //    console.info('diff');
    //},
    update: function update(vdom, value) {
        console.info('update');
        if (value != null && value != '' && typeof value != 'undefined') {
            var htmlChild = avalon.filters.formatHTMLDecode(value);
            if ($(htmlChild).length > 0) {
                $(vdom.dom).html($(htmlChild));
            } else {
                $(vdom.dom).html(htmlChild);
            }
        }
    },
    beforeDispose: function beforeDispose() {
        console.info('beforeDispose');
    },
    delay: true
});




// 自定义过滤器  过滤器扩展

/**
 * html转纯文本
 * @param {any} str
 */
avalon.filters.htmltoText = function (str) {
    var text = str.replace(/<.*?>/g, "");
    text = text.replace(/&nbsp;/ig, "");
    // 去除所有空格
    text = text.replace(/\s/g, "");
    //text = text.replace(/(^\s+)|(\s+$)/g, "");
    return text;
};

/**
 * 首字母大写
 * @param {any} value
 */
avalon.filters.capitalize = function (value) {
    if (!value) return "";
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 * 截取字符串--特殊处理，适用于中英文
 * @param {string} str 字符串
 * @param {number} n 截取长度
 * @param {string} mm 截取后补的字符...
 */
avalon.filters.subStr = function (str, n, mm) {
    var r = /[^\x00-\xff]/g;
    if (str.replace(r, "**").length <= n) { return str; }
    var m = Math.floor(n / 2);
    for (var i = m; i < str.length; i++) {
        if (str.substr(0, i).replace(r, "**").length >= n) {
            return str.substr(0, i) + mm;
        }
    }
    return str;
};


//-------------------------------------------项目中属性的特殊处理-----------------------------//


//------------------------------------------ 字典值格式化管道方法-------------------------------------//

/**
 * 将html文本转义
 * @param {any} html
 */
avalon.filters.formatHTMLEncode = function (html) {
    var temp = document.createElement("div");
    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
    var output = temp.innerHTML;
    temp = null;
    return output;
};


/**
 * 将转义文本编码为html文本
 * @param {any} text
 */
avalon.filters.formatHTMLDecode = function (text) {
    var output = text;
    if (text.indexOf("&lt;") >= 0 && text.indexOf("&gt;") >= 0) {
        var temp = document.createElement("div");
        temp.innerHTML = text;
        output = temp.innerText || temp.textContent;
        temp = null;
    } else {
        output = text
    }
    return output;
};

//------------------------------------------ 字典值格式化管道方法-------------------------------------//

// 通用常用方法
/**
 * 通用常用方法
 * @param {any} fn
 */
function heredoc(fn) {
    return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').
        replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
};

