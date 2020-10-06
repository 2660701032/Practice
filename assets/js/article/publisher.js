let form = layui.form;

//                  获取和渲染
$.ajax({
    url: '/my/article/cates',
    success: function (res) {
        let html = template('tpl-category', res);
        $('select[name=cate_id]').html(html);
        form.render('select');
    }
});

//            富文本编辑器 
initEditor();

//                剪裁插件 
let $image = $('#image');
let options = {
    aspectRatio: 400 / 280,  // 宽高比例
    preview: '.img-preview',// 预览区类名
};
$image.cropper(options);

//                 选择图片功能
$('button:contains("选择封面")').on('click', function () {
    $('#file').trigger('click');
})

//                  更换剪裁区图片功能
$('#file').on('change', function () {
    let fileObj = this.files[0];
    let url = URL.createObjectURL(fileObj);
    // 这个顺序必须为 销毁剪裁区destory  更换图片 重新生成剪裁区
    $image.cropper('destroy').attr('src', url).cropper(options);
})

//                   添加功能
$('form').on('submit', function (e) {
    e.preventDefault();
    let fd = new FormData(this);
    fd.set('content', tinyMCE.activeEditor.getContent());
    // 剪裁图片
    let canvas = $image.cropper('getCroppedCanvas', {
        width: 400,
        height: 280
    });
    // 把图片转成blob
    canvas.toBlob(function (blob) {
        fd.append('cover_img', blob);
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            processData: false,
            contentType: false,
            success: function (res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    location.href = '/article/article.html';
                }
            }
        });
    });

});