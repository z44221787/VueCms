function heredoc(fn) {
    return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').
            replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
}
var treeID = 0;
avalon.component('tree', {
    template: heredoc(function () {
        /*
         <ul>
         <li ms-for="(index, el) in @tree | get(0)">{{el.text}}
         <span ms-click='@openSubTree(el,$event)' ms-text="@changeIcon(el)"></span>
        <div ms-visible="el.open" ms-html='@renderSubTree(el)'></div>
         </li>
         </ul>
         */
    }),
    defaults: {
        onInit:function(e){
            avalon.log(e);
        },
        tree: [],
        renderSubTree: function (el) {
            //return  el.subtree.length ? "<wbr ms-widget='{is:'tree', $id:'tree_" + (++treeID) + "', tree: el.subtree}' />" : ''
            return  el.subtree.length ?"<wbr ms-widget='{is:\"tree\",$id:\""+(++treeID)+"\",tree:el.subtree}' />":''
        },
        openSubTree: function (el,e) {
            el.open = !el.open
        },
        changeIcon: function (el) {
            return el.open && el.subtree.length ? '[-]' : '[+]'
        }
    }
})

