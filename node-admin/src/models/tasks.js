/**
 * Created by WebStorm.
 * User: AnstJJ
 * Date: 2021-03-09
 * Time: 4:37 下午
 * page: tasks
 */
const express = require('express');
const { Op } = require('sequelize');
const router = express();  //创建express的实例
const models = require('../../models');//模型对象

function err(e) {
    res.json({
        code: -1,
        msg: `${e}`
    })
}

/**
 * 添加
 */
router.post(`/add`, async (req, res) => {
    let { date, userName, shipNumber, phone, price, number, status, remarks } = req.body
    try {
        let task = await models.tasks.create({
            date, userName, shipNumber, phone, price, number, status, remarks, total: price * number
        })
        res.json({
            code: 0,
            msg: '添加成功'
        })
    } catch (e) {
        err(e)
    }
});


/**
 * 获取列表
 */
router.get(`/list`, async (req, res) => {
    let task = await models.tasks.findAll({
        order: [['id', 'DESC']]
    })
    try {
        res.json({
            code: 0,
            data: task,
        })
    } catch (e) {
        err(e)
    }

});

/**
 * 修改
 */
router.post(`/edit/:id`, async (req, res) => {
    let { id } = req.params
    let { date, userName, shipNumber, phone, price, number, status, remarks } = req.body
    //
    let task = await models.tasks.update({
        date, userName, shipNumber, phone, price, number, status, remarks, total: price * number
    }, {
        where: {
            id
        }
    })
    if (task.toString() > 0) {
        res.json({
            code: 0,
            msg: '修改成功'
        })
        return
    }
    err('查询不到您的id')

});

/**
 * 删除
 */
router.post(`/remove/:id`, async (req, res) => {
    let { id } = req.params

    let task = await models.tasks.findOne({
        where: { id }
    })
    if (task) {
        let task = await models.tasks.destroy({
            where: {
                id
            }
        })
        res.json({
            code: 0,
            msg: '删除成功'
        })
        return
    }
    err('查询不到您的id')
});

/**
 * 搜索
 */
router.post(`/search`, async (req, res) => {
    let { type, text, star, end } = req.body
    console.log(type, text, star, end,)
    let criteria = {};

    if (type) {
        criteria['status'] = type
    }
    if (text) {
        criteria['userName'] = text
    }
    if (star || end) {
        let data={}
        star?data[Op.gt]=`${star} 00:00:00`:null
        end?data[Op.lt]=`${end} 23:59:59`:null
        criteria['date']=data
    }

    console.log(criteria,'213123123')
    let task = await models.tasks.findAll({
        order: [['id', 'DESC']],
        where: criteria,
        // where: {

        //     // status: type,
        //     // userName: text || null
        // }
    })
    // let task = await models.tasks.findOne({
    //     where: { id }
    // })
    if (task) {
        res.json({
            code: 0,
            data: task,
        })
        return
    }
    // err('查询不到您的id')
});


module.exports = router;