/**
 * Created by WebStorm.
 * User: AnstJJ
 * Date: 2021-01-16
 * Time: 5:54 下午
 * page: user
 */


const express = require('express');
const router = express();  //创建express的实例


router.get('/list',((req,res)=>{
    res.json({
        message:'哈哈哈'
    })
}))

module.exports = router;