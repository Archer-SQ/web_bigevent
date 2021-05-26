$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传按钮绑定文件输入框
    $('#upLoad').on('click', function() {
        // 自动触发文件上传
        $('#file').trigger('click');
    });

    // 为文件框绑定change事件
    $('#file').on('change', function(e) {
        // 获取用户选择的文件
        // console.log(e);
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片！');
        }
        // 1.拿到用户选择的文件
        var file = e.target.files[0];
        // 2.将文件转化为路径
        var imgURL = URL.createObjectURL(file);
        // 3.重新初始化剪裁区域
        $image
            .cropper('destroy') //销毁旧的剪裁区域
            .attr('src', imgURL) //重新设置图片路径
            .cropper(options) //重新初始化剪裁区域
    });
    // 将剪裁后的头像上传到服务器
    // 为确定按钮绑定点击事件
    $('#btnUpLoad').on('click', function() {
        // 1.拿到用户剪裁好之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串;
            // 2.调用接口，把头像上传到服务器
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！');
                }
                layer.msg('更换头像成功！');
                window.parent.getUserInfo();
            }
        });
    });
})