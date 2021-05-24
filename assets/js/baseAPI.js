// 每次调用$.ajax、$.post和$.get的时候
// 会先调用$.ajaxPrefilter对象
// 在这个函数中可以拿到Ajax提供的配置对象
$.ajaxPrefilter(function(opt) {
    // 在发起真正的ajax请求前，统一拼接请求的根路径
    opt.url = "http://api-breakingnews-web.itheima.net" + opt.url;
    console.log(opt.url);
    // 统一为有权限的接口,设置headers请求头
    if (opt.url.indexOf('/my/') !== -1) {
        opt.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    };
    // 全局统一挂载complete回调函数
    // 不论成功还是失败最终都会调用complete回调函数
    opt.complete = function(res) {
        // console.log('执行了complete回调：');
        // console.log(res);
        // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空token
            localStorage.removeItem('token');
            // 2.强制跳转到登录页面
            location.href = './login.html';
        }
    }
})