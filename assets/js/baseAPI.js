// 每次调用$.ajax、$.post和$.get的时候
// 会先调用$.ajaxPrefilter对象
// 在这个函数中可以拿到Ajax提供的配置对象
$.ajaxPrefilter(function(opt) {
    // 在发起真正的ajax请求前，统一拼接请求的根路径
    opt.url = "http://api-breakingnews-web.itheima.net" + opt.url;
    console.log(opt.url);
})