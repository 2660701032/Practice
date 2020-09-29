function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            console.log(res);
            if (res.status === 0) {
                var myname = res.data.nickname || res.data.username;
                $('.myname').text(myname);
                if (res.data.user_pic) {
                    $('.layui-nav-img').attr('src', res.data.user_pic).show();
                    $('.text-avatar').hide();
                } else {
                    var t = myname.substr(0, 1).toUpperCase();

                    $('.text-avatar').text(t).css('display', 'inline-block');
                    $('layui-nav-img').hide();
                }
            }
        }
    });
}
getUserInfo();


//          退出功能
$('#logout').click(function () {
    console.log(1);
    layer.confirm('你确定退出吗？', { icon: 3, title: '提示' }, function (index) {
        localStorage.removeItem('token');
        location.href = '/login.html';
        layer.close(index);
    })
})