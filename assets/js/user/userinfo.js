let form = layui.form;

function renderForm() {
    $.ajax({

        url: '/my/userinfo',
        success: function (res) {
            form.val('abc', res.data);
        }
    })
}
renderForm();

//       点击提交 
$('form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                window.parent.getUserInfo();
            }
        }
    })
})

//           点击退出
$('button[type]=reset').click(function (e) {
    e.preventDefault();
    renderForm();
})