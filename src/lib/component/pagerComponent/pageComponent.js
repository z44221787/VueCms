avalon.component("ms-pager", {
    template: heredoc(function () {
        /*
          <div class="pagination">
            <ul>
            <li ms-for="el in @pages" 
               ms-class="[ el == @currentPage && 'active' ]">
               <a href="javascript:void(0)" ms-on-click="@gotoPage(el, $event)">{{el}}</a>
            </li>
            </ul>
          </div>
         */
    }),
    defaults: {
        totalPage: 25,
        currentPage: 1,
        showPage: 7,
        events: [],
        pages: [1, 2, 3],
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
        onReady:function(e) {
            console.info(e);
        },
        gotoPage: function (page, e) {
            this.currentPage = page;
            this.pages = this.getPages();
        },
        getPages: function () {
            var pages = [];
            var s = this.showPage, l = this.currentPage, r = this.currentPage, c = this.totalPage;
            pages.push(l);
            while (true) {
                if (pages.length >= s) {
                    break;
                }
                if (l > 1) {
                    pages.unshift(--l);
                }
                if (pages.length >= s) {
                    break;
                }
                if (r < c) {
                    pages.push(++r);
                }
            }

            return pages;
        }
    }
});