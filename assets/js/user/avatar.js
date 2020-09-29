//       实现基本剪裁效果


//获取建材区域的dom区域
var $image = $('#image');
//配置选项
const options = {
    //纵横比
    aspectRation: 1,
    //指定预览区域
    preview: '.img-preview'
}
//创建剪裁区域
$image.cropper(options);

//                        点击上传可以选择图片
$('button:contains("上传")').on('click', function () {
    $('#file').trigger('click');
})


//                        更换剪裁区的图片
$('#file').on('change', function () {
    var fileObj = this.files[0];
    var url = URL.createObjectURL(fileObj);
    $image.cropper('destroy').attr('src', url).cropper(options);
});



//                             点击确定 完成更换
$('button:contains("确定")').on('click', function () {
    // 1. 完成剪裁，得到canvas图片
    let canvas = $image.cropper('getCroppedCanvas', {
        width: 100,
        height: 100
    });
    // 2. 把图片转成字符串形式
    let str = canvas.toDataURL('image/png');
    // console.log(str);
    // 3. ajax提交字符串即可
    $.ajax({
        type: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: str
        },
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                // 调用父页面的函数，重新渲染头像
                window.parent.getUserInfo();
            }
        }
    });
})