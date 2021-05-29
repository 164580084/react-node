/**
 * Created by WebStorm.
 * User: AnstJJ
 * Date: 2021-01-16
 * Time: 5:54 下午
 * page: user
 */


const express = require('express');
const router = express();  //创建express的实例
const models = require('../../models');//模型对象
let Jwt = require('../jwt/jwt')

function token(data) {
    let jwt = new Jwt(data)
    let token = jwt.generateToken()
    return token
}

/**
 * 注册
 */
router.post('/register', async (req, res) => {
    let { name, password } = req.body
    //
    console.log(name, password)
    let user = await models.user.findOne({
        where: { name }
    })
    if (!user) {
        // let jwt = new Jwt(name)
        // let token = jwt.generateToken()
        let user = await models.user.create({
            name,
            password,
        })
        res.json({
            code: 0,
            data: {
                id: user.id,
                name: user.name
            },
            // token,
            msg: '注册成功'
        })
        return
    }
    res.json({
        code: -1,
        msg: '叼毛~~您已注册请直接登陆吧'
    })
});
/**
 * 登陆
 */
router.post('/login', async (req, res) => {
    console.log(req.body)
    let { name, password } = req.body
    let user = await models.user.findOne({
        where: { name }
    })
    if (!user) {
        res.json({
            code: -1,
            msg: '叼毛~~请让管理员帮您开通账号～'
        })
        return
    }
    /**
     * 身份验证
     */
    if (user.password == password) {
        res.json({
            code: 0,
            data: {
                id: user.id,
                name: user.name
            },
            token: token(user.id),
            msg: '登陆成功'
        })
    } else {
        res.json({
            code: -1,
            msg: '叼毛~~请检查账号密码是否正确'
        })
    }


})


module.exports = router;