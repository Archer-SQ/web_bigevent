// 导入express
const express = require('express');
// 创建服务器的实例对象
const app = express();
// 导入验证包
const joi = require('@hapi/joi');
// 导入cors中间件
const cors = require('cors');
app.use(cors());
// 通过如下的代码，配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件：
app.use(express.urlencoded({ extended: false }));
// 手动封装一个res.cc()函数来处理向客户端响应失败结果的信息
// 一定要在路由模块之前对res.cc()进行封装
app.use((req, res, next) => {
    // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    res.cc = (err, status = 1) => {
        res.send({
            // 状态
            status,
            // 状态描述，判断err是错误对象还是字符串
            message: err instanceof Error ? err.message : err
        });
    }
    next();
});
// 一定要在路由之前，配置解析Token的中间件
const expressJWT = require('express-jwt');
const config = require('./config');
// 使用.unless({path:[/^\/api\//]})指定哪些接口不需要进行Token的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }));
// 导入并注册用户路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);
// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo');
// 注意：以/my开头的接口，都是有权限的接口，需要进行token的身份认证
app.use('/my', userinfoRouter);
// 定义错误级别全局中间件
app.use((err, req, res, next) => {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err);
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！');
    // 未知错误
    res.cc(err);
});
//启动服务器
app.listen(3007, () => {
    console.log('express server running at http://127.0.0.1:3007');
});