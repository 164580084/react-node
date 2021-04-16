/**
 * Created by WebStorm.
 * User: AnstJJ
 * Date: 2021-01-16
 * Time: 5:51 下午
 * page: api
 */

const express = require('express');
const app = express();  //创建express的实例
//导入 用户模块
let userRouter = require('./models/user')
let taskRouter = require('./models/tasks')
const models = require('../models');//模型对象
let Jwt = require('./jwt/jwt')
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

// 解决跨域问题
app.all("/*", function (req, res, next) {
    // 跨域处理
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next(); // 执行下一个路由
})
app.use(function (req, res, next) {
    console.log(req.url)
    // 我这里知识把登陆和注册请求去掉了，其他的多有请求都需要进行token校验 
    if (req.url != '/user/login' && req.url != '/user/register') {
        if (req.headers) {
            let token = req.headers.authorization;
            let jwt = new Jwt(token);
            let result = jwt.verifyToken();
            // 如果考验通过就next，否则就返回登陆信息不正确
            if (result == 'err') {
                console.log(result);
                res.send({ code: 401, msg: '请先登录' });
                // res.render('login.html');
            } else {
                next();
            }
        } else {
            res.send({ code: 401, msg: '请先登录' });
        }
    } else {
        next();
    }
});

/**
 * 用户相关
 */
app.use('/user', userRouter)


/**
 * 操作任务
 */
app.use('/taskRouter', taskRouter)




/**
 * 获取所有
 */
app.get('/list', async (req, res) => {
    // let user = await models.user.findAll()
    // console.log(user);
    res.json({
        user
    })
})


/**
 * 获取某个
 */
app.get('/detail/:id', async (req, res) => {
    let { id } = req.params;
    let user = await models.user.findOne({
        where: { id }
    })
    console.log(user);
    res.json({
        user
    })
})


app.listen(3001, () => {
    console.log('连接成功')
})