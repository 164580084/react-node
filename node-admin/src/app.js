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
const models = require('../models');//模型对象

/**
 * 创建
 */
app.post('/register', async (req, res) => {
    let {name,password} = req.query;
    console.log(name, password);
    // let user = await models.user.create({
    //     name,
    //     password
    // })
    // console.log(user);
    // res.json({
    //     message: '创建成功',
    //     user
    // })
})

/**
 * 获取所有
 */
app.get('/list', async (req, res) => {
    let user = await models.user.findAll()
    console.log(user);
    res.json({
        user
    })
})


/**
 * 获取某个
 */
app.get('/detail/:id', async (req, res) => {
    let {id}=req.params;
    let user = await models.user.findOne({
        where:{id}
    })
    console.log(user);
    res.json({
        user
    })
})



app.listen(3001, () => {
    console.log('连接成功')
})