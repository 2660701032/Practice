let laypage = layui.laypage;
let form = layui.form;

//                 获取文章列表 渲染

// 使用全局变量设置请求参数
let data = {
    pagenum: 1,  // 获取第1页的数据
    pagesize: 2, // 每页显示2条数据
};

function renderArticle() {
    $.ajax({
        url: '/my/article/list',
        data: data,
        success: function (res) {
            console.log(res);
            let html = template('tpl-list', res);
            $('tbody').html(html);
            //展示分页页码
            showPage(res.total);
        }
    });
}

renderArticle();

//                    分页
function showPage(t) {

    laypage.render({
        elem: 'page',
        count: t,
        limit: data.pagesize, // 每页显示条数
        limits: [2, 3, 5, 10],
        curr: data.pagenum, // 起始页，当前页
        layout: ['prev', 'page', 'next', 'count', 'limit', 'skip'],
        // 刷新页面 页码切换 .执行jump函数
        jump: function (obj, first) {
            console.log(first)
            if (first === undefined) {
                data.pagenum = obj.curr;
                data.pagesize = obj.limit;
                renderArticle();
            }
        }
    });
}

//                 获取所有的分类
$.ajax({
    url: '/my/article/cates',
    success: function (res) {
        var html = template('tpl-category', res)
        $('select[name=category]').html(html);
        form.render('select');
    }
});


//                    筛选功能
$('.search').on('submit', function (e) {
    e.preventDefault();
    let p = $(this).serializeArray();
    data.cate_id = p[0].value;
    data.state = p[1].value;
    data.pagenum = 1;
    renderArticle();
})



//                注册模板过滤器
template.defaults.imports.dateFormat = function (str) {
    let date = new Date(str);
    let y = date.getFullYear();
    let m = addZero(date.getMonth() + 1);
    let d = addZero(date.getDate());
    let h = addZero(date.getHours());
    let i = addZero(date.getMinutes());
    let s = addZero(date.getSeconds());
    return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
}

function addZero(n) {
    return n < 10 ? '0' + n : n;
}


//                     删除文章功能
$('body').on('click', 'button:contains("删除")', function () {
    let id = $(this).data('id');
    layer.confirm('是否要删除？', function (index) {
        $.ajax({
            url: '/my/article/delete/' + id,
            success: function (res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    renderArticle();
                }
            }
        });
        layer.close(index);
    });
})