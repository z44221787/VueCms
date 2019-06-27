avalon.component("ms-loading", {
    template: heredoc(function () {
        /*
        <cc ms-if="@loading">
            <slot name='rloading'></slot>
        <cc/>
         */
    }),
    defaults: {
        loading:true,
        onInit: function (e) {
            // 查看event中是否设置了订阅事件名，如果设置了则添加事件订阅
            for (var i = 0; i < this.events.length; i++) {
                var tahtEvent = this.events[i];
                zEvent.on(tahtEvent, function () {
                    var args = [];
                    args = avalon.mix(true, args, arguments);
                    args.push(e.vmodel);
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
        },
    },
    soleSlot: 'rloading'
});