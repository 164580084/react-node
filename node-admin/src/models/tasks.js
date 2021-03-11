/**
 * Created by WebStorm.
 * User: AnstJJ
 * Date: 2021-03-09
 * Time: 4:37 下午
 * page: tasks
 */
const express = require('express');
const router = express();  //创建express的实例
const models = require('../../models');//模型对象


/**
 * 添加
 */
router.post(`/add`, async (req, res) => {
    let {title, date, content} = req.body
    try {
        let task = await models.task.create({
            title,
            date,
            content,
            status: 0
        })
        res.json({
            code: 0,
            msg: '添加成功'
        })
    } catch (e) {
        res.json({
            code: -1,
            msg: '叼毛~~瞎鸡巴搞'
        })
    }
});


/**
 * 获取列表
 */
router.get(`/list`, async (req, res) => {
    let task = await models.task.findAll()
    res.json({
        code: 0,
        data: task,
    })
});

/**
 * 编辑
 */
router.post(`/edit/:id`, async (req, res) => {
    let {id} = req.params
    let {title, date, content} = req.body
    //
    let task = await models.task.update({
        title,
        date,
        content,
    }, {
        where: {
            id
        }
    })
    if(task.toString()>0){
        res.json({
            code: 0,
            msg: '修改成功'
        })
        return
    }
    res.json({
        code: -1,
        msg: '查询不到您的id'
    })

});

/**
 * 删除
 */
router.post(`/remove/:id`, async (req, res) => {
    let {id} = req.params

    let task = await models.task.findOne({
        where: {id}
    })
    if(task){
        let task = await models.task.destroy({
            where: {
                id
            }
        })
        res.json({
            code: 0,
            task,
            msg: '删除成功'
        })
        return
    }
    res.json({
        code: -1,
        msg: '查询不到您的id'
    })

});


module.exports = router;