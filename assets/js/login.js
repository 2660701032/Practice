//              点击切换注册和登录功能
$('#logo a').click(function () {
    $('#logo').hide().next().show();
})


$('#register a').click(function () {
    $('#logo').show().next().hide();
})


//            实现注册功能
//表单提交 阻止默认行为 收取用户名密码 提交接口
$('#register form').on('submit', function (e) {
    e.prevnetDefault();
    //收集数据
    var data = $(this).serialize();
    // console.log(data);
    $.ajax({
        type: 'POST',
        url: 'http://ajax.frontend.itheima.net/api/reguser',
        data: data,
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                $('#logo').show().next().hide();
                $('#register form')[0].reset();//reset是dom方法 所以要把jq转换成js
            }
        }
    });
})



//           自定义表单验证
//1. 用户密码不能为空
//2. 密码 重复密码长度6-12位 且不能出现空格
//3. 密码和重复密码必须一致
var form = layui.form;
// console.log(form);
form.verify({
    len: [/^\S{6,12}$/, '长度必须6-12位，不能有空格'],
    same: function (rev) {
        var pwd = $('#register .pwd').val();
        if (pwd !== rev) {
            return '两次密码不一致';
        }
    }
})


//          登录功能
$('#logo form').on('submit', function (e) {
    e.prevnetDefault();
    $.ajax({
        type: 'POST',
        url: 'http://ajax.frontend.itheima.net/api/login',
        data: $(this).serialize(),
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        }
    })
})