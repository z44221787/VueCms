例子：----------------------------------------  
所有依赖 
    <script type="text/javascript" src="/src/lib/jquery-1.8/jquery.js"></script>  
    <!-- 模版所需要js文件 -->  
    <script type="text/javascript" src="/node_modules/avalon2/dist/avalon.js"></script>  
    <script type="text/javascript" src="/src/lib/utils/uuid.js"></script>  
    <script type="text/javascript" src="/src/lib/utils/promiseM.js"></script>  
    <script type="text/javascript" src="/src/lib/utils/Event.js"></script>  
    <script type="text/javascript" src="/src/lib/component/ms-content.js"></script>      

/* 解决页面初始化加载出现花括号 */  页面中写入样式    
<style>  
        xmp {
            display: none;
        }
        .ms-controller {
            display: none;
        }
        [ms-controller] {
            display: none;
        }
</style>  

一、数据组件注意事项---请仔细阅读理解（看例子理解 index.text.1.html）
    1、数据组件中如果使用模板引擎，需要使用注释标签包裹，数据组件可以无限制嵌套，一个数据组件中可以使用一个UI组件，如例子

    2、模板语法中对于变量名建议添加@前缀

    3、模板引擎指令，需要使用双引号包裹，值用单引号,   组件指令 widget不限制

    4、数据组件 is:'ms-content' 固定参数,
               load：数据初始化函数(可以不写),
               events:组件通信事件函数(可以不写),
               data：数据对象，如果load函数编写了可以不写
    <xmp ms-widget="{is:'ms-content',load:['初始化函数名','参数1','参数2'],events:['changeLimitNum','消息事件函数名2'],data:{}">  
    组件内部调用子组件请将ms-widget 改为 zr-widget 其他不变  

二、组件参数 load 用法使用说明  
    <xmp ms-widget="{is:'ms-content',load:['loadData','参数1','参数2']">  
    load 用于组件数据域对象data的初始化，一般的数据初始化请在这个函数中执行  

    外部注册一个函数 使用e.resolve(data);将数据对象压入组件,vm为当前组件vm作用域对象  
    function loadData(e,vm){
        var data={num:3,array:[1, 2, 3, 4, 5, 6],object: {a: 1, b: 2, c: 3, d: 4, e: 5}};
        e.resolve(data);
   }


三、组件参数 evetns 用法详细说明：  
    <xmp ms-widget="{is:'ms-content',load:['初始化函数名','参数1','参数2'],events:['changeLimitNum','消息事件函数名2']">  
    用于组件与外部html事件 或与内部子组件通过事件进行通信 ，可以通过消息函数改变组件内部作用域  
    例如：消息函数名：changeLimitNum 表示外部已经注册了一个名为changeLimitNum 的函数  
    
    外部注册函数  最后一个参数ee总是默认为当前组件的vm作用域，前面的参数为emit传参  
    function changeLimitNum(e,ee) {  
       ee.data.num=Number(e);  // 改变作用于值
   }  

   通过事件触发函数changeLimitNum执行，并传递参数，zEvent.emit 发布执行函数  
   function change() {  
       zEvent.emit('changeLimitNum',$("#num").val());  
   }  


四、数据组件中使用模板引擎指令  
    1、插值表达式 {{@msg}} <div>{{@msg}}</div>  

    2、双向绑定 zr-duplex <input type='text' zr-duplex='@num'>  

    3、双向绑定数据强制转换   
       zr-duplex-string：强制转换为字符串  

       zr-duplex-number：强制转换为数字  

       zr-duplex-boolean：强制转换为bool型  

       zr-duplex-checked：特殊 用于radio 和checkbox控件（radio和checkbox控件请使用）  

    4、条件判断指令 zr-if   <div zr-if="1==1"></div>,条件判断指令会根据条件情况判断是否加载包裹的标签体  

    5、显示隐藏指令 zr-visible <div zr-visible="1==1"></div>,显示隐藏指令是根据条件情况利用display：block、none显示隐藏标签体  

    6、属性指令 zr-attr <div zr-attr="{id:@id}"></div> , 语法类同 jquery 语法  

    7、样式指令 zr-css <div zr-css="{color:@color}"></div>, 语法类同 jquery 语法  

    8、类指令  zr-class <div zr-class="[@aaa, @bbb,'pages']"></div>,类名直接对应放入数组中  

    9、鼠标按下松开指令 zr-active <div zr-active="[@aaa, @bbb,'pages']"></div> 鼠标按下放入某个类，松开移除  

    10、鼠标划上移开指令 zr-hover <div zr-hover="[@aaa, @bbb,'pages']"></div> 鼠标划上放入某个类，移开移除  

    11、文本指令 zr-text <div zr-text="@aaa"></div> 类同插值表达式 <div>{{@aaa}}</div>  

    12、html指令 zr-html <div zr-html="@aaa"></div> 如果需要放入html标记标签等，需要使用这个标签，文本标签和插值表达式不支持html  

    13、循环指令 zr-for  <ul zr-for="el in @data"><li>{{@el}}</li></ul></div>   
                        <ul zr-for="(index value) in @data"><li>{{@value}}</li></ul></div>  

    14、事件指令 zr-on-xxx  <div zr-on-click="trigger('functionName',@v,$event)"></div>  
        注1、 当前支持几乎所有js事件类型，如： animationend、 blur、 change、 input、 click、 dblclick、 focus、 keydown、   keypress、 keyup、 mousedown、 mouseenter、 mouseleave、 mousemove、 mouseout、 mouseover、 mouseup、 scan、 scroll、   submit  

        注2、 事件可以叠加执行 如 zr-on-click-1 zr-on-click-2,只需要在指令后添加索引值就可以，从1开始  

        注3、 事件触发自定义函数  
             /**@param functionName：自定义函数名  
                @param arguments：其他参数  
                $event 固定写法，获取当前elment对象
                // 如果需要改变作用于，需要将整个data传递
                参数个数无限制，不过需要保证第一位参数为需要执行的自定义函数名称  
              */  
            使用trigger('functionName',@data,$event),触发编写的js函数  

        注4、 支持数据传递到函数中，$event为特殊参数:该参数可以方便获取事件类型，和可以使用$event.target获取触发事件的dom  

    15、常用管道过滤器  
        uppercase:转换大写 {{@a | uppercase}}  

        lowercase:转小写  {{@a | lowercase}}  

        capitalize：首字母大写 {{@a | capitalize}}

        htmltoText:html转纯文本 {{@a | htmltoText}}

        truncate(length,str):截取字符串  {{@a | truncate(10,'...')}}  

        escape：对html格式转义  {{@a | escape}}  

        sanitize：对用户输入的字符串进行反XSS处理，去掉onclick, javascript:alert，<script>等危险属性与标签。number  

        number(length)：对需要处理的数字的整数部分插入千分号（每三个数字插入一个逗号），有一个参数fractionSize，用于保留小数点的后几  位。fractionSize:小数部分的精度，默认为3。  {{@a | number}} 、  {{@a | number(3)}}  

        currency(length):用于格式化货币，类似于number过滤器（即插入千分号），但前面加了一个货币符号，默认使用人民币符号\uFFE5     symbol, 货币符号，默认是\uFFE5 fractionSize，小数点后保留多少数，默认是2  {{@a | currency}} 、  {{@a | currency(3)}}  

        date(formats):对日期进行格式化，date(formats), 目标可能是符合一定格式的字符串，数值，或Date对象。  {{@a | date('yyyy-MM-dd HH:mm:ss')}}  

        limitBy： 只能用于ms-for循环,对数组与对象都有效, 限制输出到页面的个数,  
            参数：  
                limit: 最大个数,必须是数字或字符  
                begin: 开始循环的个数, 可选,默认值0  
                <li ms-for="el in @array | limitBy(3,0)">{{el}}</li>  

        orderBy:只能用于ms-for循环,对数组与对象都有效, 用于排序,   
        参数  
            key: 要排序的属性名  
            dir: -1或1, 顺序或倒序,可选,默认值1  
             <li zr-for="el in @array | orderBy('name',1)">{{el}}</li>  

        change：用于ms-duplex 双向绑定 使其失去焦点时才进行同步, 而不是每次变化都同步  
        <input ms-duplex='@aaa | change'>{{@aaa}}  

        debounce：用于ms-duplex 双向绑定 使其经过多少毫秒进行同步, 而不是每次变化都同步，多用于自动搜索框    
        <input ms-duplex='@aaa | debounce(200)'>  


五：自定义过滤器 ---可以用于组件上或者是组件内部，可用于特殊数据处理  
avalon.filters.idsOp = function (obj)   
{  
    var ids = Enumerable.From(obj.data.classId).Select("x=>x.F_Id").ToArray().join(",");  
    obj.data.classId = ids;  
    return obj;  
}  


知识点补充
众所周知,ms-attr是返回一个对象. 我们只想对其中的一个字段进行格式化. 比如我们要处理title. 那么就起名为title.
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <script type="text/javascript" src="../dist/avalon.js"></script>
        <script>
            avalon.filters.title = function (obj, a, b) {
                var title = obj.title
                var newTitle = avalon.filters.truncate(title, a, b)
                obj.title = newTitle
                return obj
            }
            var vm = avalon.define({
                $id: 'test',
                el: '123456789qwert'
            })

        </script>
    </head>
    <body ms-controller="test">
        <div ms-attr="{title:@el} | title(10,'...')">333</div>
    </body>
</html>


六、 自定义组件 --请按照基本格式编写


配置
avalon2遵循coc原则，配置项比较少。只有两个配置项。

双花括号也默认是python一些著名模板的界定符，为了防止冲突，我们有更换界定符的需求。 这时我们可以这样做

 avalon.config({
    interpolate: ['{%','%}']
 })
 //或
 avalon.config({
    interpolate: ['{?','?}']
 })
 //或
 avalon.config({
    interpolate: ['{&','&}']
 })
注意,左右界定符的长度应该为2,并且不能出现<, >,因为出现源码括号在旧式IE下会变成注释节点 我们再看下一个有用的配置项，debug。avalon默认是在控制台下打印没有调试消息的， 上线时我们不愿用户看到它们，可以这样关掉它们。

 avalon.config({
    debug: false
 })


.NET下雨mvc@冲突取巧解决的方式：

 <tr ms-for="el in @("@")fields">...</tr>
