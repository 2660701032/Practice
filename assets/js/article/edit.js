// 最开头，加载所需的模块
let form = layui.form;

// ------------------- 获取地址栏的id参数值，这个id就是文章的id --------------
let id = new URLSearchParams(location.search).get('id');


// ------------------- 获取真实的分类，并渲染到下拉框的位置 -------------------
$.ajax({
    url: '/my/article/cates',
    success: function (res) {
        // console.log(res)
        let html = template('tpl-category', res);
        $('select[name=cate_id]').html(html);
        // 更新渲染
        form.render('select');
        // 现在，分类渲染完毕，可以发送请求获取文章详情了
        // ------------------- 请求当前这篇文章详情，完成数据回填 --------------------
        $.ajax({
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status === 0) {
                    // console.log(res);
                    // 使用layui的form模块中的 val 方法 快速为表单赋值（数据回填）
                    form.val('xxx', res.data);
                    // --------------------  内容区更换为富文本编辑器 -------------------------
                    initEditor();
                    // 更换图片
                    $image.cropper('destroy').attr('src', 'http://ajax.frontend.itheima.net' + res.data.cover_img).cropper(options);
                }
            }
        });
    }
});


// --------------------  使用剪裁插件 ----------------------------------
// 初始化剪裁框
let $image = $('#image');
let options = {
    // 宽高比例
    aspectRatio: 400 / 280,
    // 预览区容器的类名
    preview: '.img-preview',
    autoCropArea: 1
};
$image.cropper(options);

// 点击按钮，能够选择图片
$('button:contains("选择封面")').on('click', function () {
    $('#file').trigger('click');
})

// 文件域的文件切换的时候，更换剪裁区的图片
$('#file').on('change', function () {
    let fileObj = this.files[0];
    let url = URL.createObjectURL(fileObj);
    // 销毁剪裁区 --> 更换图片 --> 重新生成剪裁区
    $image.cropper('destroy').attr('src', url).cropper(options);
})



// ------------------- 完成修改功能 -------------------
$('form').on('submit', function (e) {
    e.preventDefault();

    // 收集表单数据
    // let fd = new FormData(表单的DOM对象);
    let fd = new FormData(this);
    // 替换FormData对象里面的一项
    fd.set('content', tinyMCE.activeEditor.getContent());

    // 剪裁图片
    let canvas = $image.cropper('getCroppedCanvas', {
        width: 400,
        height: 280
    });
    // 把图片转成 blob 形式
    canvas.toBlob(function (blob) {
        // 形参 blob 就是转换后的结果
        // console.log(blob);
        // 把 文件 追加到fd中
        fd.append('cover_img', blob);

        // 根据接口要求，修改文章的时候，FormData中必须有文章id
        fd.append('Id', id);

        // 遍历fd对象，检查一下fd对象中是否包括了接口要求的5个参数
        // fd.forEach((value, key) => {
        //     console.log(key, value)
        // })

        // ajax提交给接口，从而完成添加
        $.ajax({
            type: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 提交formdata数据，必须加下面两个选项
            processData: false,
            contentType: false,
            success: function (res) {
                // console.log(res);
                layer.msg(res.message);
                if (res.status === 0) {
                    location.href = '/article/article.html';
                }
            }
        });
    });



});