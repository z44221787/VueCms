      //数据组件--用于数据传递获取
        avalon.component("ms-data", {
            template: "<cc><slot name='rdata'></slot></cc>",
            defaults: {
                reName: "",
                pdata: null,
                data: null,
                url: "",
                type: "get",
                cache: false,
                dataType: "json",
                beforeSend: null,
                success: null,
                async: true,
                onInit: avalon.noop,
                onReady: function (e) {
                    var that = this;
                    var urlQueryObj = outils.parseQueryString(location.href);
                    if (!outils.isEmptyObject(urlQueryObj)) {
                        //参数处理
                        for (var pro in urlQueryObj) {
                            //去除hash值，返回正确的属性值
                            urlQueryObj[pro] = urlQueryObj[pro].replace("#!page", "");
                        }
                    }
                    var queryData = {};
                    avalon.mix(queryData, that.$model.data); //单纯拷贝查询对象
                    //循环属性，判断属性存在才将属性拷贝到vm和$model中
                    for (var p in urlQueryObj) {
                        if (typeof that.data[p] != "undefined" && that.data[p].toString().toLowerCase() == "owner") {
                            that.data[p] = urlQueryObj[p];
                            queryData[p] = urlQueryObj[p];
                        }
                    }
                    //0、如果当前存在url，则异步加载ajax数据
                    if (this.url != null) {
                        jQuery.ajax({
                            type: that.type,
                            url: that.url,
                            data: queryData,
                            dataType: that.dataType,
                            cache: that.cache,
                            async: that.async, //默认异步处理
                            success: function (data, ee) {
                                //0、判断返回数据是否为json或对象格式，不对则消息提醒
                                if (avalon.isObject(data) == false) {
                                    avalon.error('请求数据并非json格式或jsonp格式，请以标准json格式或jsonp格式返回');
                                    return false;
                                }
                                //1、组件处理--组件的其他UI样式，属性，事件处理

                                //1、组件处理--组件的其他UI样式，属性，事件处理

                                //2、组件内部处理---处理组件内部注释代码部分和嵌套组件处理
                                var eInnerHtml = e.target.innerHTML;
                                var tempDom = jQuery(e.target).clone(); //临时dom对象，用于处理注释节点
                                tempDom.find('div[type="widget"]').remove();
                                var DEFAULT_VERSION = 8.0;
                                var ua = navigator.userAgent.toLowerCase();
                                var isIE = ua.indexOf("msie") > -1;
                                var safariVersion;
                                if (isIE) {
                                    safariVersion = ua.match(/msie ([\d.]+)/)[1];
                                }
                                if (safariVersion <= DEFAULT_VERSION) {
                                    eInnerHtml = avalon.unescapeHTML(e.target.innerHTML);
                                };
                                var options = {
                                    $id: ""
                                };
                                //拷贝基础属性
                                var copyData = {
                                    pParams: {
                                        type: that.type,
                                        url: that.url,
                                        data: that.data,
                                        dataType: that.dataType,
                                        cache: that.cache,
                                        async: that.async
                                    }
                                };
                                //兼容IE8拷贝
                                for (var p in urlQueryObj) {
                                    if (typeof copyData.pParams.data[p] != "undefined" && copyData.pParams.data[p].toString().toLowerCase() == "owner") {
                                        copyData.pParams.data[p] = urlQueryObj[p];
                                    }
                                }
                                avalon.mix(true, data, copyData); //拷贝数据
                                //属性拷贝
                                for (var pro in that.$model) {
                                    if (pro != "onInit" && pro != "onReady" && pro !=
                                        "onViewChange" && pro != "onDispose") {
                                        options[pro] = that.$model[pro];
                                    }
                                }
                                if (that.reName != "") {
                                    options[that.reName] = data;
                                } else {
                                    options["data"] = data;
                                }
                                //当前组件转化为控制器，方便作用域控制
                                var uuid = UUID();
                                jQuery(e.target).attr("ms-controller", uuid);
                                options["$id"] = uuid;
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
                                var vmAjax = avalon.define(options);
                                //将注释行存放于nodes中,并且将所有注释执行节点转为可执行节点
                                var nodes = [];

                                //只处理当前节点的子级节点的注释属性
                                getOpenTag(tempDom.get(0).innerHTML, nodes);
                                var html = eInnerHtml;
                                if (nodes.length >= 1) {
                                    //处理注释节点--全部替换为dom
                                    for (var node in nodes) {
                                        html = html.replace(nodes[node].nodeSourceValue, nodes[
                                            node].nodeValue)
                                    }
                                }
                                //将注释行存放于nodes中,并且将所有注释执行节点转为可执行节点
                                jQuery(e.target).html(html);

                                //转换内部div[type="widget"]变为组件--必须顺着替换，然后统一扫描
                                var widget_Childs = jQuery(e.target).find('div[type="widget"]');

                                //1、重新写入组件标签，替换当前内容
                                for (var i = 0; i < widget_Childs.length; i++) {
                                    //渲染新标签
                                    var templateId = UUID();
                                    var attr = jQuery(widget_Childs[i]).attr("widget");
                                    //循环属性
                                    if (that.reName != "") {
                                        attr = insertStr(attr, attr.lastIndexOf("}"),
                                            ",pdata:@" + that.reName + ""); //传递父级回调数据给子组件
                                    } else {
                                        attr = insertStr(attr, attr.lastIndexOf("}"),
                                            ",pdata:@data"); //传递父级回调数据给子组件
                                    }
                                    //获取当前组件is属性
                                    var template = jQuery("<xmp ms-widget='" + attr +"'></xmp>");
                                    //添加随机Id编号
                                    template.attr("id", templateId);

                                    // template.attr("ms-widget", attr);
                                    template.text(jQuery(widget_Childs[i]).html());

                                    jQuery(template).data("dd", "test");

                                    jQuery(widget_Childs[i]).replaceWith(template);
                                }
                                //转换内部div[type="widget"]变为组件

                                //重新统一扫描整个组件
                                avalon.scan(e.target);
                                //2、组件内部处理---处理组件内部注释代码部分和嵌套组件处理
                            }
                        });
                    } else {
                        //1、组件处理--组件的其他UI样式，属性，事件处理

                        //1、组件处理--组件的其他UI样式，属性，事件处理

                        //2、组件内部处理---处理组件内部注释代码部分和嵌套组件处理
                        var eInnerHtml = e.target.innerHTML;
                        var tempDom = jQuery(e.target).clone(); //临时dom对象，用于处理注释节点
                        tempDom.find('div[type="widget"]').remove();
                        var DEFAULT_VERSION = 8.0;
                        var ua = navigator.userAgent.toLowerCase();
                        var isIE = ua.indexOf("msie") > -1;
                        var safariVersion;
                        if (isIE) {
                            safariVersion = ua.match(/msie ([\d.]+)/)[1];
                        }
                        if (safariVersion <= DEFAULT_VERSION) {
                            eInnerHtml = avalon.unescapeHTML(e.target.innerHTML);
                        };
                        var options = {
                            $id: ""
                        };
                        //属性拷贝
                        for (var pro in that.$model) {
                            if (pro != "onInit" && pro != "onReady" && pro != "onViewChange" && pro !=
                                "onDispose") {
                                options[pro] = that.$model[pro];
                            }
                        }
                        if (that.reName != "") {
                            options[that.reName] = that.data;
                        } else {
                            options["data"] = that.data;
                        }
                        //当前组件转化为控制器，方便作用域控制
                        var uuid = UUID();
                        jQuery(e.target).attr("ms-controller", uuid);
                        options["$id"] = uuid;
                        var vmAjax = avalon.define(options);
                        //将注释行存放于nodes中,并且将所有注释执行节点转为可执行节点
                        var nodes = [];

                        //只处理当前节点的子级节点的注释属性
                        getOpenTag(tempDom.get(0).innerHTML, nodes);
                        var html = eInnerHtml;
                        if (nodes.length >= 1) {
                            //处理注释节点--全部替换为dom
                            for (var node in nodes) {
                                html = html.replace(nodes[node].nodeSourceValue, nodes[node].nodeValue)
                            }
                        }
                        //将注释行存放于nodes中,并且将所有注释执行节点转为可执行节点
                        jQuery(e.target).html(html);

                        //转换内部template变为组件--必须顺着替换，然后统一扫描
                        var widget_Childs = jQuery(e.target).find('div[type="widget"]');

                        //1、重新写入组件标签，替换当前内容
                        for (var i = 0; i < widget_Childs.length; i++) {
                            //渲染新标签
                            var templateId = UUID();
                            var attr = jQuery(widget_Childs[i]).attr("widget");
                            //循环属性
                            if (that.reName != "") {
                                attr = insertStr(attr, attr.lastIndexOf("}"), ",pdata:@" + that.reName + ""); //传递父级回调数据给子组件
                            } else {
                                attr = insertStr(attr, attr.lastIndexOf("}"), ",pdata:@data"); //传递父级回调数据给子组件
                            }
                            //获取当前组件is属性
                            var template = jQuery("<xmp ms-widget='" + attr + "'></xmp>");
                            //添加随机Id编号
                            template.attr("id", templateId);
                            // template.attr("ms-widget", attr);
                            template.text(jQuery(widget_Childs[i]).html());
                            jQuery(widget_Childs[i]).replaceWith(template);
                        }
                        //转换内部template变为组件

                        //重新统一扫描整个组件
                        avalon.scan(e.target);
                        //2、组件内部处理---处理组件内部注释代码部分和嵌套组件处理
                    }
                },
                onViewChange: avalon.noop,
                onDispose: avalon.noop
            },
            soleSlot: "rdata"
        });

        //分页组件--用于分页数据使用
        avalon.component("ms-page", {
            template: heredoc(function () {
                /*
                  <div></div>
                 */
            }),
            defaults: {
                rows: 15, //当组件独立是使用此属性
                page: 1, //当组件独立是使用此属性
                rowsName: null,
                pageName: null,
                count: 0, //总数据数量
                changData: null, //当组件存在于数据ms-data组件中时使用此属性
                params: null,
                ajaxPage: true, //默认为ajax分页，否则使用跳转样式分页
                onInit: avalon.noop,
                onReady: function (e) {
                    var that = this;
                    //数据拷贝
                    layui.use(['laypage', 'layer'], function () {
                        var laypage = layui.laypage,
                            layer = layui.layer;
                        //总页数低于页码总数
                        if (that.changData != null) {
                            var limitRows = that.rowsName != null ? that.changData.pParams.$model.data[that.rowsName] : that.changData.pParams.$model.data.rows;
                            laypage.render({
                                elem: e.target,
                                skip: true, //是否开启跳页
                                first: "<<",
                                last: ">>",
                                curr: location.hash.replace('#!page=', ''), //获取hash值为page的当前页
                                hash: 'page', //自定义hash值
                                //hash:true,
                                limit: limitRows == undefined ? that.rows : limitRows,
                                count: that.count, //数据总数
                                jump: function (obj, first) { //触发分页后的回调
                                    // obj.curr
                                    var dataParams = {};
                                    avalon.mix(true, dataParams, that.changData.pParams
                                        .$model.data);
                                    if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                        //添加路由
                                        if (that.pageName != null) {
                                            dataParams[that.pageName] = obj.curr
                                        } else {
                                            dataParams.page = obj.curr;
                                        }
                                        jQuery.ajax({
                                            type: that.changData.pParams.type,
                                            url: that.changData.pParams.url,
                                            data: dataParams,
                                            dataType: that.changData.pParams.dataType,
                                            cache: that.changData.pParams.cache,
                                            async: that.changData.pParams.async, //默认异步处理
                                            success: function (data, ee) {
                                                avalon.mix(that.changData,
                                                    data);
                                            }
                                        });
                                    } else {
                                        if (location.hash.indexOf('#!page=') > -1) {
                                            if (that.pageName != null) {
                                                dataParams[that.pageName] = obj.curr
                                            } else {
                                                dataParams.page = obj.curr;
                                            }
                                            jQuery.ajax({
                                                type: that.changData.pParams.type,
                                                url: that.changData.pParams.url,
                                                data: dataParams,
                                                dataType: that.changData.pParams
                                                    .dataType,
                                                cache: that.changData.pParams.cache,
                                                async: that.changData.pParams.async, //默认异步处理
                                                success: function (data, ee) {
                                                    avalon.mix(that.changData,
                                                        data);
                                                }
                                            });
                                        } else {
                                            avalon.log("初次加载,此时不触发分页ajax");
                                        }

                                    }
                                }
                            });
                        } else {
                            //当不存在changeData的情况,分页组件不结合数据组件使用Ajax处理，使用整页刷新方式，获取当前页面url
                            laypage.render({
                                elem: e.target,
                                skip: true, //是否开启跳页
                                first: "<<",
                                last: ">>",
                                limit:that.rows,
                                count: that.count, //数据总数
                                curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
                                    var page = location.search.match(/page=(\d+)/);
                                    return page ? page[1] : 1;
                                }(), 
                                jump: function(e, first){ //触发分页后的回调
                                    if(!first){ //一定要加此判断，否则初始时会无限刷新
                                        //先去除当前href所有参数，然后重新组装，并且拼接上页码值
                                        var pageName=that.pageName==null?"page":that.pageName;
                                        var _locationHash=location.hash;
                                        var _urlSearchObj = outils.parseQueryString(location.search);
                                        _urlSearchObj[pageName]=e.curr;
                                        var _urlParams=outils.stringfyQueryString(_urlSearchObj);
                                        location.href ="?"+_urlParams+_locationHash;
                                    }
                                }
                            })
                        }
                    })
                }
            }
        });
  