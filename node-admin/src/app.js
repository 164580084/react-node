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

app.use(userRouter)

app.listen(3000,()=>{
    console.log('连接成功')
})