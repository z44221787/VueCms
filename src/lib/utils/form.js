﻿function conveterParamsToJson(paramsAndValues) {
    var jsonObj = {};

    var param = paramsAndValues.split("&");
    for (var i = 0; param != null && i < param.length; i++) {
        var para = param[i].split("=");
        jsonObj[para[0]] = para[1];
    }

    return jsonObj;
}

/**
 * 将表单数据封装为json
 * @param form
 * @returns
 */
function getFormData(form) {
    var formValues = $("#" + form).serialize();
    //关于jquery的serialize方法转换空格为+号的解决方法  
    formValues = formValues.replace(/\+/g, " ");   // g表示对整个字符串中符合条件的都进行替换  
    var temp = decodeURIComponent(JSON.stringify(conveterParamsToJson(formValues)));
    var queryParam = JSON.parse(temp);
    return queryParam;
}

/**
 * 将表单数据封装为参数字符串,表单中包含富文本时，必须调用此方法
 * @param form   
 * @returns
 */
function getFormDataToParamStr(form) {
    var formValues = $("#" + form).serialize();
    //关于jquery的serialize方法转换空格为+号的解决方法  
    formValues = formValues.replace(/\+/g, " ");   // g表示对整个字符串中符合条件的都进行替换  

    return formValues;
}