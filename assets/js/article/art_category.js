$(function() {
    var form = layui.form;
    initArtCateList();
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！');
                }
                // console.log(res);
                var htmlstr = template('tpl-table', res);
                $('tbody').html(htmlstr);
            }
        });
    }

    // 通过layer.open弹出层实现添加类别功能
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });
    // 通过body代理为form-add绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        // 阻止表单默认的提交事件
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
                initArtCateList();
                layer.msg('新增分类成功！');
                // 根据索引,关闭对应的弹出层
                layer.close(indexAdd);
            }
        });
    });
    // 通过tbody代理为编辑按钮绑定点击事件
    $('tbody').on('click', '#btnEdiCate', function() {
        // 弹出编辑框
        indexEdi = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // 将修改前的数据填充到弹出层中
        var id = $(this).attr('data-id');
        // 发起请求获取相应的数据
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        });
    });
    // 通过tbody代理为form-edit绑定submit事件
    $('tbody').on('submit', '#form-edit', function(e) {
        // 阻止表单默认的提交事件
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate/",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改分类失败！');
                }
                layer.msg('修改分类成功！');
                // 根据索引,关闭对应的弹出层
                layer.close(indexEdi);
                initArtCateList();
            }
        });
    });
    // 用tbody代理删除按钮通过confirm弹出框实现删除功能
    $('tbody').on('click', '#btnDelCate', function() {
        var id = $(this).attr('data-id');
        // 提示用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            });
        });
    });
});