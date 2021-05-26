$(function() {
    // 方法一
    // 去到注册页面
    // $('#link-reg').on('click', function() {
    //     $(this).css('display', 'none').parent().next().children().css('display', 'block');
    // });
    // 去到登陆页面
    // $('#link-login').on('click', function() {
    //     $(this).css('display', 'none').parent().prev().children().css('display', 'block');
    // });
    // 方法二
    // 去到注册页面
    $('#link-reg').on('click', function() {
        $('.login').hide();
        $('.reg').show();
    });
    // 去到登陆页面
    $('#link-login').on('click', function() {
        $('.reg').hide();
        $('.login').show();
    });
    // 自定义表单校验规则
    // 从layui中获取form对象
    var form = layui.form;
    // 通过form.verify自定义校验规则
    form.verify({
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,
        pwd: [
            /^[\S]{6,15}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: function(value) {
            // 拿到第一次输入的密码
            var pwd = $('.reg [name=password]').val();
            // 对两次密码进行比较,如果不一致，则返回并提示
            if (pwd !== value) {
                return "密码不一致！请重新输入"
            }
        }
    });
    // 监听注册表单提交事件
    var layer = layui.layer;
    $('#form_reg').on('submit', function(e) {
        // 阻止表单默认提交事件
        e.preventDefault();
        // 利用ajax发起post请求
        $.post('/api/reguser', { username: $('.reg [name=username]').val(), password: $('.reg [name=password]').val() }, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功！');
            $('#link-login').trigger('click');
        });
    });
    // 监听登陆表单提交事件
    $('#form_login').on('submit', function(e) {
        // 阻止表单默认提交事件
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败！');
                }
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = './index.html';
            }
        });

    });
});