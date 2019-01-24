//处理简单json数据
/***简单json数组格式转换为复杂层级json格式---json格式中需要包含id与pid字段区分父级和子级,默认子节点名称为children
参数：jsonobj:简单json数组、json数组格式字符串、json文本路径
返回：标准json对象***/
R_convertSimpleJsonData = function (jsonobj) {
    var result = {};
    //可以排除不需要
    //for (var p in jsonobj) {
    //    if (p != 'root') {
    //        result[p] = jsonobj[p];
    //    }
    //}
    result.root = [];
    var root = [];
    //var root = jsonobj.root;
    if (typeof BoolUrl == "undefined" || BoolUrl == null || BoolUrl == "null" || BoolUrl == "" || BoolUrl == false) {
        if (jQuery.isArray(jsonobj)) {
            root = jsonobj;
        }
        else if ((typeof jsonobj) == "string") {
            root = eval(jsonobj);
        }
    }
    //var root = jsonobj;
    for (var i = 0; i < root.length; i++) {
        var ri = root[i];
        //参数构建---------------------
        ri.text = ri.name;
        ri.v = ri.value;
        ri.n = ri.name
        ri.pId = ri.pId;
        ri.id = ri.id;

        //参数构建---------------------
        for (var j = 0; j < root.length; j++) {
            root[j].leaf = true;
            for (var k = 0; k < root.length; k++) {
                if (root[k].pId.toUpperCase() == root[j].id.toUpperCase()) {
                    root[j].leaf = false;
                    break;
                }
            }
        }
        if (ri.pId != 0 && ri.pId != '0') {
            for (var j = 0; j < root.length; j++) {
                var rj = root[j];
                if (rj.id.toUpperCase() == ri.pId.toUpperCase()) {
                    //构建子节点属性---------添加正常children
                    rj.children = !rj.children ? [] : rj.children;
                    rj.children.push(ri);
                    //构建子节点属性---------添加特殊需要s子节点
                    rj.s = !rj.s ? [] : rj.s;
                    rj.s.push(ri);
                    break;
                }
            }
        }
        if (ri.pId == 0 || ri.pId == '0') {
            result.root.push(ri);
        }
    }
    return result;
};




//处理简单json数据
/***简单json数组格式转换为复杂层级json格式---json格式中需要包含id与pid字段区分父级和子级
参数：jsonobj:简单json数组、json数组格式字符串、json文本路径
参数：childNodeName:子节点名称，默认为children
返回：标准json对象***/
R_convertSimpleJsonDataByName = function (jsonobj, childNodeName, rootPidValue) {
    var result = {};
    //可以排除不需要
    //for (var p in jsonobj) {
    //    if (p != 'root') {
    //        result[p] = jsonobj[p];
    //    }
    //}
    result.root = [];
    var root = [];
    //var root = jsonobj.root;
    if (typeof BoolUrl == "undefined" || BoolUrl == null || BoolUrl == "null" || BoolUrl == "" || BoolUrl == false) {
        if (jQuery.isArray(jsonobj)) {
            root = jsonobj;
        }
        else if ((typeof jsonobj) == "string") {
            root = eval(jsonobj);
        }
    }
    //var root = jsonobj;
    for (var i = 0; i < root.length; i++) {
        var ri = root[i];
        //参数构建---------------------
        ri.text = ri.name;
        ri.v = ri.value;
        ri.n = ri.name
        ri.pId = ri.pId;
        ri.id = ri.id;

        //参数构建---------------------
        for (var j = 0; j < root.length; j++) {
            root[j].leaf = true;
            root[j].rlevels = j;
            for (var k = 0; k < root.length; k++) {
                if (root[k].pId.toUpperCase() == root[j].id.toUpperCase()) {
                    root[j].leaf = false;
                    break;
                }
            }
        }
        if (ri.pId !== rootPidValue) {
            for (var j = 0; j < root.length; j++) {
                var rj = root[j];
                if (rj.id.toUpperCase() == ri.pId.toUpperCase()) {
                    //构建子节点属性---------添加正常children
                    rj[childNodeName] = !rj[childNodeName] ? [] : rj[childNodeName];
                    rj[childNodeName].push(ri);
                    //构建子节点属性---------添加特殊需要s子节点
                    rj.s = !rj.s ? [] : rj.s;
                    rj.s.push(ri);
                    break;
                }
            }
        }
        if (ri.pId === rootPidValue) {
            result.root.push(ri);
        }
    }
    return result;
};