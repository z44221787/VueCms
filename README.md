例子：----------------------------------------
    <!-- 基类 -->
<script type="text/javascript" src="/src/lib/jquery-1.8/jquery.js"></script>

<script type="text/javascript" src="/node_modules/avalon2/dist/avalon.js"></script>

<!-- 帮助类 -->
<script type="text/javascript" src="/src/pages/outils.min.js"></script>

<script type="text/javascript" src="/src/lib/utils/uuid.js"></script>

    <!-- 分页 -->
<script type="text/javascript" src="/src/lib/layui/dist/layui.js"></script>

<link rel="stylesheet" href="/src/lib/layui/dist/css/layui-page.css">


<style>
        /* 解决页面初始化加载出现花括号 */
        .ms-controller {
            display: none;
        }

        ul
        {
            list-style-type: none;
            padding: 10px;
            margin: 10px;
        }

        ul li
        {
            background-repeat: no-repeat;
            background-position: 0px 5px; 
            padding-left: 14px; 
        }



        .hover{
            color: red
        }

</style>



 //事件处理 -解决方案
<script>

function msg(e, ee) 
{
    alert("您当前点击了栏目编号为" + e.F_Id);
    jQuery(ee.target).css("color", "red");
}


//处理传递的数据,然后再继续传递--------数据组件 流转过程如果需要修改传递数据 解决方案
avalon.filters.idsOp = function (obj) 
{
    var ids = Enumerable.From(obj.data.classId).Select("x=>x.F_Id").ToArray().join(",");
    obj.data.classId = ids;
    return obj;
}

</script>

   
   
<xmp ms-widget='{is:"ms-data",url:"http://172.24.248.39/ApiService/GetClassListByName",data:{classNames:"药监动态"},dataType:"jsonp"}'>
    <!-- <ul id='ceshi' ms-for="(i v) in data.list">
        <li><a ms-attr="{href:'http://www.baidu.com?className='+@v.F_Id}" ms-css="{width:data.list.length}" target="_blank">{{@v.F_ClassName}}</a></li>
    </ul>
    -->
    <div type='widget' widget='{is:"ms-data",url:"http://172.24.248.39/ApiService/GetDocListByClassId",data:{rows:2,page:1,classId:data.list},dataType:"jsonp",reName:"docData"} | idsOp'>
        <!-- <h1>
      共有{{docData.list.length}}篇文章
     <ul ms-for="(i v) in docData.list">
        <li ms-attr="{name:'koko'}" ms-hover="['hover']" ms-on-dblclick-1="trigger('msg',@v,$event)" ms-on-dblclick-2="trigger('msg',@v,$event)">{{@v.F_Topic | truncate(20,'...')}} &nbsp;&nbsp;发布时间{{@v.F_CreatorTime | date("yyyy MM dd:HH:mm:ss")}}</li>
     </ul> 
    </h1> -->
        <div type='widget' widget='{is:"ms-page",count:@docData.records,changData:@docData,rowsName:"rows",pageName:"page"}'></div>
    </div>
</xmp>

    
<xmp ms-widget='{is:"ms-data",url:"http://localhost/ApiService/GetClassListByName",data:{classNames:"通知公告"},dataType:"jsonp"}'>
        <!-- 
       <ul id='ceshi' ms-for="(i v) in data.list">
            <li><a ms-attr="{href:'http://www.baidu.com?className='+@v.F_Id}" ms-css="{width:data.list.length}" target="_blank">{{@v.F_ClassName}}</a></li>
        </ul>-->
        <div type='widget' widget='{is:"ms-data",url:"http://localhost/ApiService/GetDocListByClassId",data:{rows:2,page:"owner",classId:data.list},dataType:"jsonp",reName:"docData"} | idsOp'>
            <!-- <h1>
          共有{{docData.list.length}}篇文章
         <ul ms-for="(i v) in docData.list">
            <li ms-attr="{name:'koko'}" ms-hover="['hover']" ms-on-dblclick-1="trigger('msg',@v,$event)" ms-on-dblclick-2="trigger('msg',@v,$event)">{{@v.F_Topic | truncate(20,'...')}} &nbsp;&nbsp;发布时间{{@v.F_CreatorTime | date("yyyy MM dd:HH:mm:ss")}}</li>
         </ul> 
        </h1> -->
               <div type="widget" widget='{is:"ms-page",count:@docData.records,rows:2}'></div>
        </div>
</xmp>


例子：----------------------------------------

一、数据组件注意事项---请仔细阅读理解（看例子理解）
    1、数据组件中如果使用模板引擎，需要使用注释标签包裹，数据组件可以无限制嵌套，一个数据组件中可以使用一个UI组件，如例子

    2、模板语法中对于变量名建议添加@前缀

    3、模板引擎指令，需要使用双引号包裹，值用单引号,   组件指令 widget不限制

    4、数据组件 传递的data数据中某属性来源与url则对应属性值改为owner 如classNames，表示将url参数classNames传递给接口服务
    <xmp ms-widget='{is:"ms-data",url:"http://xxx.xx.xx/ApiService/XXXX",data:{classNames:"owner"},dataType:"jsonp"}

    5、模板引擎注释体html标签，一旦使用指令或表达式，不允许跨数据组件，必须在同一个数据组件闭合，如果没有使用指令或表达式，允许跨域多个数据组件闭合，详细可看例子

三、数据组件中使用模板引擎指令
    1、插值表达式 {{@msg}} <div>{{@msg}}</div>

    2、条件判断指令 ms-if   <div ms-if="1==1"></div>,条件判断指令会根据条件情况判断是否加载包裹的标签体

    3、显示隐藏指令 ms-visible <div ms-visible="1==1"></div>,显示隐藏指令是根据条件情况利用display：block、none显示隐藏标签体

    4、属性指令 ms-attr <div ms-attr="{id:@id}"></div> , 语法类同 jquery 语法

    5、样式指令 ms-css <div ms-css="{color:@color}"></div>, 语法类同 jquery 语法

    6、类指令  ms-class <div ms-class="[@aaa, @bbb,'pages']"></div>,类名直接对应放入数组中

    7、鼠标按下松开指令 ms-active <div ms-active="[@aaa, @bbb,'pages']"></div> 鼠标按下放入某个类，松开移除

    8、鼠标划上移开指令 ms-hover <div ms-hover="[@aaa, @bbb,'pages']"></div> 鼠标划上放入某个类，移开移除

    9、文本指令 ms-text <div ms-text="@aaa"></div> 类同插值表达式 <div>{{@aaa}}</div>

    10、html指令 ms-html <div ms-html="@aaa"></div> 如果需要放入html标记标签等，需要使用这个标签，文本标签和插值表达式不支持html

    11、循环指令 ms-for  <ul ms-for="(index value) in @data"><li>{{@value}}</li></ul></div>

    12、事件指令 ms-on-xxx  <div ms-on-click="trigger('functionName',@v,$event)"></div>
        注1、 当前支持几乎所有js事件类型，如： animationend、 blur、 change、 input、 click、 dblclick、 focus、 keydown、 keypress、 keyup、 mousedown、 mouseenter、 mouseleave、 mousemove、 mouseout、 mouseover、 mouseup、 scan、 scroll、 submit

        注2、 事件可以叠加执行 如 ms-on-click-1 ms-on-click-2,只需要在指令后添加索引值就可以，从1开始

        注3、 事件触发自定义函数
             /**@param functionName：自定义函数名
                @param arguments：其他参数
                参数个数无限制，不过需要保证第一位参数为需要执行的自定义函数名称
              */
            使用trigger('functionName',@data,$event),触发编写的js函数

        注4、 支持数据传递到函数中，$event为特殊参数:该参数可以方便获取事件类型，和可以使用$event.target获取触发事件的dom

    13、常用管道过滤器
        uppercase:转换大写 {{@a | uppercase}}

        lowercase:转小写  {{@a | lowercase}}

        truncate(length,str):截取字符串  {{@a | truncate(10,'...')}}

        escape：对html格式转义  {{@a | escape}}

        sanitize：对用户输入的字符串进行反XSS处理，去掉onclick, javascript:alert，<script>等危险属性与标签。number

        number(length)：对需要处理的数字的整数部分插入千分号（每三个数字插入一个逗号），有一个参数fractionSize，用于保留小数点的后几位。fractionSize:小数部分的精度，默认为3。  {{@a | number}} 、  {{@a | number(3)}}

        currency(length):用于格式化货币，类似于number过滤器（即插入千分号），但前面加了一个货币符号，默认使用人民币符号\uFFE5   symbol, 货币符号，默认是\uFFE5 fractionSize，小数点后保留多少数，默认是2  {{@a | currency}} 、  {{@a | currency(3)}}

        date(formats):对日期进行格式化，date(formats), 目标可能是符合一定格式的字符串，数值，或Date对象。  {{@a | date('yyyy-MM-dd HH:mm:ss')}}