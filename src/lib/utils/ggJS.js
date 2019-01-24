/**
 *  输入校验函数
 *  @param  <string>  a  html字符串
 *  @return    返回 html字符串
 */
function encodeHTML(a) {
    return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
};


/**  
 *  判断是否不等于null  
 *  @param <string> data  
 *  @return    true:非空  false:空 
 */
function isNotNull(data) {
    return (data === "" || typeof data == "undefined" || data === null) ? false : true;
};


/**判断当前字符串是否可以转换为数字格式**********/
function isNumber(str) {
    var n = Number(str);
    if (!isNaN(n)) {
        return true
    }
};

/**比较两个数值的大小**********/
function getTowNumMax(num1, num2) {
    var n1 = Number(num1);
    var n2 = Number(num2);
    if (n1 > n2) {
        return n1;
    } else {
        return n2;
    }
};

/**
 *  判断一个值是否在一个数组中
 *  @param  <string>  search
 *  @param  <Array>   array
 *  @return <Boolen>  true:search在数组array中  false:search不在数组array中
 */
function in_array(search, array) {
    for (var i in array) {
        if (array[i] == search) {
            return true;
        }
    }
    return false;
};



//比较两个对象是否相等
function equal(objA, objB) {
    var ja = jQuery(objA);
    var jb = jQuery(objB);
    return ja.is(jb);
};

//==========================================================================获取随机颜色函数=====================================================================
//==========================================================================获取随机颜色函数=====================================================================
//var getRandomColor = function () {
//    return '#' + (function (h) {
//        return new Array(7 - h.length).join("0") + h
//    })((Math.random() * 0x1000000 << 0).toString(16))
//}
var getRandomColor = function () {
    return '#' + (function (color) {
        //这个写法比较有意思,Math.floor(Math.random()*16);返回的是一个小于或等于16的数.然后作为0123456789abcdef的下标,这样每次就会得到一个这个字符串当中的一个字符
        return (color += ('0123456789abcdef'.split(''))[Math.floor(Math.random() * 16)])
            //然后判断这个新字符串的长度是否到6,因为16进制的颜色是由6个字符组成的,如果到6了,就返回这6个字符拼成的字符串,如果没有就执行arguments.callee(color)也就是函数本身.
            &&
            (color.length == 6) ? color : arguments.callee(color); //将''字符串传给color
    })('');
};


//获取随机数
var getRandom = function () {
    return Math.random() / 2;
};


var currentcolor;

function ShowSelected(selectedId, entid) {

    var list = document.getElementById("gvList").getElementsByTagName("tr");
    for (i = 0; i < list.length; i++) {

        if (list[i].style.backgroundColor == 'yellow') {
            list[i].style.backgroundColor = currentcolor;
        }
    }

    var o = document.getElementById(selectedId);

    currentcolor = o.style.backgroundColor;

    o.style.backgroundColor = 'yellow';

    window.parent.frames[2].location.href = "Y_YQStaff_List.aspx?deptId=" + entid;


};



//解决IE8不支持 map 方法
if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let A be a new array created as if by the expression new Array(len) where Array is
        // the standard built-in constructor with that name and len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Let mappedValue be the result of calling the Call internal method of callback
                // with T as the this value and argument list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

                // For best browser support, use the following:
                A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
    };
};



if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/ ) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ?
            Math.ceil(from) :
            Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
};


//解决IE8不支持 map 方法
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
    String.prototype.ltrim = function () {
        return this.replace(/(^\s*)/g, "");
    }
    String.prototype.rtrim = function () {
        return this.replace(/(\s*$)/g, "");
    }
};



//解决IE10以下不支持Function.bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
};



//判断浏览器是否低于IE9版本,用于处理触发事件兼容性
function isUnderIE9() {
    var browser = navigator.appName
    var b_version = navigator.appVersion
    var version = b_version.split(";");
    var trim_Version = version[1].replace(/[ ]/g, "");
    if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE6.0") {
        return true;
    } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE7.0") {
        return true;
    } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE8.0") {
        return true;
    }
    //else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
    //    alert("IE 9.0");
    //}
    return false;
};


//判断当前字符串是否为url路径
function isURL(str_url) { // 验证url
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)" +
        "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@
        +
        "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        +
        "|" // 允许IP和DOMAIN（域名）
        +
        "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
        +
        "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
        +
        "[a-z]{2,6})" // first level domain- .com or .museum
        +
        "(:[0-9]{1,4})?" // 端口- :80
        +
        "((/?)|" // a slash isn't required if there is no file name
        +
        "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);
    var b = re.test(str_url);
    var bb = false;
    var str0 = str_url.charAt(0);
    if (str0 == "/" || str0 == "\\" || str0 == ".." || str0 == "~") {
        bb = true;
    }
    var result = false
    if (b == true || bb == true) {
        result = true;
    }
    return result;
};



       //在制定位置插入字符
function insertStr(soure, start, newStr) {
    return soure.slice(0, start) + newStr + soure.slice(start);
};

    //格式化html标记
function heredoc(fn) {
    return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').
    replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
}

    //解析注释节点
function getOpenTag(str, callBackArray) {
    var i = str.indexOf('<!--'); //处理注释节点
    var l = str.indexOf('-->');
    if (i === -1) {
        return false;
    }
    if (l === -1) {
        return false;
        //thow('注释节点没有闭合 ' + str.slice(i, 100));
    } else {
        //判断当前节点是否属于avalon2的注释节点,属于则不记录入node
    var node = {
        nodeName: '#comment',
        nodeValue: str.slice((i + 4), l),
        nodeSourceValue: str.slice(i, l + 3),
        start: i + 4,
        end: l
        };
    if (node.nodeSourceValue.indexOf("--ms") == -1 &&
        node.nodeSourceValue.indexOf("-end") == -1 &&
        node.nodeSourceValue.indexOf("--for") == -1 &&
        node.nodeSourceValue.indexOf("<!-- Code injected by live-server -->") == -1) {
            callBackArray.push(node);
        }
            //移除当前位子字符串
        str = str.substr(l + 3, str.length);
    }
    if (str.toString().indexOf('-->') != -1) {
        getOpenTag(str, callBackArray)
    }
};

