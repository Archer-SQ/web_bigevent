// 在此处定义和用户相关的路由处理函数，供/router/user.js模块进行调用
// 导入mysql操作模块
const db = require('../db/index');
// 导入bcryptjs
const bcrypt = require('bcryptjs');
// 导入生成token字符串的包
const jwt = require('jsonwebtoken');
// 导入全局的配置文件
const config = require('../config');
// 暴露注册用户的处理函数
exports.reguser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userInfo = req.body;
    // 对表单中的数据进行合法校验
    // if (!userInfo.username || !userInfo.password) {
    //     // return res.send({ status: 1, message: '用户名或密码不能为空！' });
    //     res.cc('用户名或密码不能为空！');
    // }

    // 定义SQL语句，查询用户名是否被占用
    const sqlStr1 = 'select * from ev_users where username=?';
    db.query(sqlStr1, userInfo.username, (err, results) => {
        // 执行sql语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err);
        };
        // 判断用户名是否被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
            return res.cc('用户名被占用，请更换其他用户名！');
        };
        // 对用户名的密码，进行bcrypt加密，返回值为加密之后的密码字符串
        /* 加密处理 - 同步方法
         * bcryptjs.hashSync(data, salt)
         *    - data  要加密的数据
         *    - slat  用于哈希密码的盐。如果指定为数字，则将使用指定的轮数生成盐并将其使用。推荐 10 
         */
        userInfo.password = bcrypt.hashSync(userInfo.password, 10);
        // 定义插入新用户的sql语句
        const sqlStr2 = 'insert into ev_users set ?';
        const userData = { username: userInfo.username, password: userInfo.password };
        db.query(sqlStr2, userData, (err, results) => {
            // 执行sql语句失败
            if (err) {
                // return res.send({ status: 1, message: err.message });
                return res.cc(err);
            }
            // SQL语句执行成功，但是影响行数不是1
            if (results.affectedRows !== 1) {
                // return res.send({ status: 1, message: '注册用户失败，请稍后再试！' });
                return res.cc('注册用户失败，请稍后再试！');
            }
            // 注册成功
            // res.send({ status: 0, message: '注册成功!' });
            res.cc('注册成功!', 0);
        })
    });
};
// 暴露登陆的处理函数
exports.login = (req, res) => {
    // 1.接收表单数据
    const userinfo = req.body;
    // 2.定义sql语句
    const sqlStr = 'select * from ev_users where username=?';
    // 3.执行sql语句，查询用户的数据
    db.query(sqlStr, userinfo.username, (err, results) => {
        // sql语句执行失败
        if (err) return res.cc(err);
        // 执行sql语句成功，但是查询到数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败！');
        // 判断用户输入的登陆密码是否和数据库中的一致
        // 将用户输入的密码和数据库中的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        // 如果对比结果为false，则输入密码不正确
        if (!compareResult) {
            return res.cc('登陆失败！');
        }
        // 生成密码的token字符串
        // 核心注意点：在生成 Token 字符串的时候，一定要剔除 密码 和 头像 的值
        // 1.通过 ES6 的高级语法，快速剔除 密码 和 头像 的值：
        const user = {...results[0], password: '', user_pic: '' };
        // 对用户信息进行加密，生成token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });
        // 调用res.send()将token响应给客户端
        res.send({
            status: 0,
            message: '登陆成功！',
            // 为了方便客户端使用Token,在服务器端直接拼接上Bearer的前缀
            token: 'Bearer ' + tokenStr
        })
    })
};