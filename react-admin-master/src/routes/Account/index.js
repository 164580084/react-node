import React from 'react'
import { Card, Cascader, Tooltip, Icon, Form, Checkbox, Select, Input, Button, Col, Row, message, BackTop } from 'antd'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/index'
import TypingCard from '../../components/TypingCard'
import PromptBox from '../../components/PromptBox'
import { randomNum, calculateWidth } from '../../utils/utils'
import { register } from '../../request/apiConfig/user'
const FormItem = Form.Item
const Option = Select.Option


@Form.create()
class Account extends React.Component {
  state = {
    focusItem: -1,   //保存当前聚焦的input
    code: ''         //验证码
  }
  componentDidMount() {
    this.createCode()
  }

  /**
   * 生成验证码
   */
  createCode = () => {
    const ctx = this.canvas.getContext('2d')
    const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let code = ''
    ctx.clearRect(0, 0, 80, 39)
    for (let i = 0; i < 4; i++) {
      const char = chars[randomNum(0, 57)]
      code += char
      ctx.font = randomNum(20, 25) + 'px SimHei'  //设置字体随机大小
      ctx.fillStyle = '#D3D7F7'
      ctx.textBaseline = 'middle'
      ctx.shadowOffsetX = randomNum(-3, 3)
      ctx.shadowOffsetY = randomNum(-3, 3)
      ctx.shadowBlur = randomNum(-3, 3)
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      let x = 80 / 5 * (i + 1)
      let y = 39 / 2
      let deg = randomNum(-25, 25)
      /**设置旋转角度和坐标原点**/
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(char, 0, 0)
      /**恢复旋转角度和坐标原点**/
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)
    }
    this.setState({
      code
    })
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        message.warning('请先填写正确的表单')
      } else {
        let params = {
          name: values.name,
          password: values.password
        }
        register(params).then(res => {
          if (res.code == 0) {
            message.success(res.msg)
          }
          message.error(res.msg);
        })
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const { getFieldDecorator, getFieldValue, getFieldError } = this.props.form
    const { focusItem, code } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 12,
          offset: 4,
        },
      },
    }
    return (
      <div>
        <Card bordered={false} title='新增账号'>
          <Form layout='horizontal' style={{ width: '70%', margin: '0 auto' }} onSubmit={this.handleSubmit}>
            <FormItem label="登陆账号" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '登陆账号' }],
              })(<Input placeholder="请输入登陆账号" />)}
            </FormItem>
            <FormItem label='密码' {...formItemLayout}>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码'
                    },
                    {
                      min: 6,
                      message: '密码至少为6个字符'
                    },
                    {
                      max: 16,
                      message: '密码最多为16个字符'
                    },
                    {
                      whitespace: true,
                      message: '密码中不能有空格'
                    }
                  ]
                })(
                  <Input type='password' />
                )
              }
            </FormItem>
            <FormItem label='确认密码' {...formItemLayout} required>
              {
                getFieldDecorator('confirm', {
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        const { getFieldValue } = this.props.form
                        if (!getFieldValue('password')) {
                          callback('请先输入上面的密码！')
                        }
                        if (value && value !== getFieldValue('password')) {
                          callback('两次输入不一致！')
                        }
                        callback()
                      }
                    }
                  ]
                })(
                  <Input type='password' />
                )
              }
            </FormItem>

            <Form.Item label='验证码'  {...formItemLayout}>
              {getFieldDecorator('verification', {
                validateFirst: true,
                rules: [
                  { required: true, message: '请输入验证码' },
                  {
                    validator: (rule, value, callback) => {
                      if (value.length >= 4 && code.toUpperCase() !== value.toUpperCase()) {
                        callback('验证码错误')
                      } else if (value.length < 4) {
                        callback('验证码错误')
                      }
                      callback()
                    }
                  }
                ]
              })(
                <Row>
                  <Col span={15}>
                    <Input
                      onFocus={() => this.setState({ focusItem: 2 })}
                      onBlur={() => this.setState({ focusItem: -1 })}
                      maxLength={4}
                      placeholder='验证码'
                      addonBefore={<span className='iconfont icon-securityCode-b'
                        style={focusItem === 2 ? styles.focus : {}} />} />
                  </Col>
                  <Col span={9}>
                    <canvas onClick={this.createCode} width="80" height='39' ref={el => this.canvas = el} />
                  </Col>
                </Row>
              )}
            </Form.Item>



            <FormItem style={{ textAlign: 'center' }} {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" >提交</Button>
            </FormItem>
          </Form>
        </Card>

      </div>
    )
  }
}
const styles = {
  focus: {
    width: '20px',
    opacity: 1
  },
}

export default Account