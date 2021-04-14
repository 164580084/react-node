import React from 'react'
import { Button, Table, Row, Col, DatePicker, Input, Select, Modal, Statistic, Card, Icon, Radio, Form, Drawer, message } from 'antd'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/index'
import TypingCard from '../../components/TypingCard'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react/index'
import { addList, getList, removeList, editList, searchList } from '../../request/apiConfig/tasks'
import moment from 'moment';
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const options = [
    { label: '全部', value: '' },
    { label: '已付款', value: '1' },
    { label: '未付款', value: '2' },
];
const STATUS = ['', '已付款', '未付款']
const OPERAType = ['新增', '修改', '查看']
@withRouter @inject('appStore') @observer @Form.create()
class List extends React.Component {
    state = {
        operationType: 0, //0 增加 1修改 2查看
        visible: false,
        searchData: {
            type: '',
            text: '',
            star: '',
            end: ''
        },
        formData: {
            date: '',
            userName: '',
            shipNumber: '',
            phone: '',
            price: '',
            number: '',
            status: '',
            remarks: ''
        },
        data: [],
        columns: [
            {
                title: '日期',
                dataIndex: 'date',
                key: 'date',
                align: 'center'
            },
            {
                title: '客户',
                dataIndex: 'userName',
                key: 'userName',
                align: 'center'
            },
            {
                title: '船号',
                dataIndex: 'shipNumber',
                key: 'shipNumber',
                align: 'center'
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
                align: 'center'
            },
            {
                title: '单价',
                dataIndex: 'price',
                key: 'price',
                align: 'center'
            },
            {
                title: '数量',
                dataIndex: 'number',
                key: 'number',
                align: 'center'
            },
            {
                title: '金额',
                dataIndex: 'total',
                key: 'total',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'edit',
                key: 'edit',
                align: 'center',
                render: (text, record) => (
                    <div>
                        <Button type="primary" onClick={() => this.look(record)}>查看</Button>&emsp;
                        <Button type="primary" onClick={() => this.edit(record)}>编辑</Button>&emsp;
                        <Button type="danger" onClick={() => this.remove(record)}>删除</Button>
                    </div>
                ),
            },
        ]
    }

    componentDidMount() {
        this.getListData()
    }
    getListData = () => {
        getList().then(res => {
            if (res.code == 0) {
                res.data.map((item, index) => {
                    item.date = moment(item.date).format('YYYY-MM-DD HH:mm:ss')
                    item.status = STATUS[item.status]
                })
                this.setState({
                    data: res.data
                })
            }
        })
    }
    searchPost = () => {
        let { searchData } = this.state;
        let params = searchData
        searchList({ params }).then(res => {
            console.log(res, )
            if (res.code == 0) {
                res.data.map((item, index) => {
                    item.date = moment(item.date).format('YYYY-MM-DD HH:mm:ss')
                    item.status = STATUS[item.status]
                })
                this.setState({
                    data: res.data
                })
            }
        })
    }
    /**
     * 选择状态
     */
    radioChange = e => {
        let { searchData } = this.state;
        console.log('radio3 checked', e.target.value);
        searchData.type = e.target.value
        this.setState({
            searchData
        }, () => {
            this.searchPost()
        });
    };
    look = (e) => {
        console.log(e)
        this.setState({
            formData: e,
            operationType: 2
        }, () => {
            console.log(this.state.formData, '123')
            this.showDrawer()
        });
    }
    /**
     * 编辑
     */
    edit = (e) => {
        console.log(e)
        this.setState({
            formData: e,
            operationType: 1
        }, () => {
            console.log(this.state.formData, '123')
            this.setState({
                visible: true,
            });
        });
    }

    /**
     * 增加显示
     */
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            formData: {},
            visible: false,
        });
    };
    remove = (e) => {
        let that = this
        confirm({
            title: '您确定要删除当前记录嘛?',
            onOk() {
                let path = `/${e.id}`
                removeList(path).then(res => {
                    if (res.code == 0) {
                        message.success(res.msg);
                        that.getListData()
                    } else {
                        message.error(res.msg);
                    }
                })
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    onChangeTime = (dates, dateStrings) => {
        console.log('From: ', dates[0], ', to: ', dates[1]);
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
        let { searchData } = this.state;
        searchData.star = dateStrings[0]
        searchData.end = dateStrings[1]
        this.setState({
            searchData
        }, () => {
            this.searchPost()
        });
    }

    handleSubmit = e => {
        let { operationType, formData } = this.state;
        e.preventDefault()
        this.props.form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                values.date = moment(values.date).format('YYYY-MM-DD HH:mm:ss')
                console.log(values)
                let re;
                if (operationType) {
                    re = editList({ params: values, path: `/${formData.id}` })
                } else {
                    re = addList({ params: values })
                }
                re.then(res => {
                    if (res.code == 0) {
                        message.success(res.msg);
                        this.onClose()
                        this.getListData()
                    } else {
                        message.error(res.msg);
                    }
                })

                // editList

                // addList({ params: values }).then(res => {

                // })
            }
        })
    }

    render() {
        const { data, columns, formData, operationType, searchData } = this.state
        const { getFieldDecorator } = this.props.form
        return (
            <div>
                <Row style={{ backgroundColor: 'white' }}>
                    <div style={{ padding: 24 }}>
                        <Radio.Group
                            options={options}
                            onChange={this.radioChange}
                            value={searchData.type}
                            optionType="button"
                            buttonStyle="solid"
                        />
                        <RangePicker
                            ranges={{
                                Today: [moment(), moment()],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                            }}
                            onChange={this.onChangeTime}
                        />
                        <Row type="flex" justify="space-between" style={{ marginTop: 30 }}>
                            <div>
                                {/* {
                                        console.log(value, )
                                        // searchData.value = value
                                        // this.setState({
                                        //     searchData
                                        // })
                                    } */}
                                <Search
                                    placeholder="请输入姓名查询"
                                    onSearch={(value) => {
                                        searchData.text = value
                                        console.log(value)
                                        this.setState({
                                            searchData
                                        }, () => {
                                            this.searchPost()
                                        })
                                    }}
                                    style={{ width: 300, height: 35, marginRight: 20 }}
                                    enterButton={'查询'}
                                />
                            </div>

                            <Button type="primary" onClick={() => {
                                this.setState({
                                    operationType: 0
                                }, () => {
                                    this.showDrawer()
                                })
                            }}>增加</Button>
                        </Row>


                        <Row type="flex" gutter={16} align={'middle'} justify={'center'} style={{ marginTop: 15 }}>
                            <Statistic title="已付款" value={112893} valueStyle={{ color: '#d81923' }} />&emsp;&emsp;&emsp;
                        <Statistic title="赊账" value={112893} valueStyle={{ color: '#d81923' }} />
                        </Row>

                    </div>


                    <Col span={24}>
                        <Table columns={columns} dataSource={data} />
                    </Col>
                </Row>


                {/* 抽屉栏 */}
                <Drawer
                    title={OPERAType[operationType]}
                    width={720}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    destroyOnClose
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Form layout="vertical" onSubmit={this.handleSubmit}>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="日期">
                                    {getFieldDecorator('date', {
                                        initialValue: formData.date ? moment(formData.date) : '',
                                        rules: [{ required: true, message: '请选择日期' }],
                                    })(<DatePicker format="YYYY-MM-DD HH:mm:ss" style={{ width: 324 }} />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="客户">
                                    {getFieldDecorator('userName', {
                                        initialValue: formData.userName,
                                        rules: [{
                                            required: true, message: '请输入客户姓名',
                                        }],
                                    })(<Input placeholder="请输入客户姓名" maxLength={11} />)}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="船号">
                                    {getFieldDecorator('shipNumber', {
                                        initialValue: formData.shipNumber,
                                        rules: [{ required: true, message: '请输入船号' }],
                                    })(<Input placeholder="请输入船号" />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="客户手机号">
                                    {getFieldDecorator('phone', {
                                        initialValue: formData.phone,
                                        rules: [{
                                            required: true, message: '请输入正确的手机号', pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                                        }],
                                    })(<Input placeholder="请输入客户手机号" maxLength={11} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="单价">
                                    {getFieldDecorator('price', {
                                        initialValue: formData.price,
                                        rules: [{
                                            required: true, message: '请输入正确的单价', pattern: new RegExp(/^[0-9]+(.[0-9]{1,3})?$/, "g"),
                                        }],
                                    })(<Input placeholder="请输入单价" />)}
                                </Form.Item>
                            </Col>


                            <Col span={12}>
                                <Form.Item label="数量">
                                    {getFieldDecorator('number', {
                                        initialValue: formData.number,
                                        rules: [{
                                            required: true, message: '请输入正确的数量', pattern: new RegExp(/^[1-9]\d*$/, "g"),
                                        }],
                                    })(<Input placeholder="请输入数量" />)}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="付款状态">

                                    {getFieldDecorator('status', {
                                        initialValue: formData.status == '已付款' ? '1' : '2',
                                        rules: [{
                                            required: true, message: '请选择付款状态',
                                        }],
                                    })(<Radio.Group>
                                        <Radio.Button value="1">已付款</Radio.Button>
                                        <Radio.Button value="2">未付款</Radio.Button>
                                    </Radio.Group>)}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="备注">
                                    {getFieldDecorator('remarks', {
                                        initialValue: formData.remarks,
                                        rules: [
                                            {
                                                required: false,
                                                message: 'please enter url description',
                                            },
                                        ],
                                    })(<Input.TextArea rows={4} placeholder="备注" />)}
                                </Form.Item>
                            </Col>
                        </Row>


                        {
                            operationType == 2 ? null :

                                <Form.Item>
                                    <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                                        取消
                        </Button>
                                    <Button type="primary" htmlType="submit">
                                        提交
                        </Button>

                                </Form.Item>

                        }


                    </Form>

                </Drawer>
            </div>
        )
    }
}

export default List