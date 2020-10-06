// 自定义验证规则

let form = layui.form;
form.verify({
    // 长度 
    len: [/\S{6,12}/, '长度应为6~12位'],
    // 新密码不能和原密码相同 
    diff: function (val) {
        let oldPwd = $('.oldPwd').val();
        if (oldPwd === val) {
            return '新密码不能和原密码相同';
        }
    },

    // 两次新密码必须一致 
    same: function (val) {
        let newPwd = $('.newPwd').val();
        if (newPwd !== val) {
            return '两次密码不一致';
        }
    }
});

//             重置密码功能
$('form').on('submit', function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    $.ajax({
        type: 'POST',
        url: '/my/updatepwd',
        data: data,
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                $('form')[0].reset();
            }
        }
    });
});