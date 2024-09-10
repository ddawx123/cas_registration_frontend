import './wizard.css';
import 'antd/dist/antd.css';
import React from "react";
import {
    PageHeader,
    Form,
    Input,
    Checkbox,
    Button,
    Modal
} from 'antd';

export default class RegisterWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            re_password: '',
            cellphone: '',
            agreeable: false
        };
    }
    callBackend() {
        let break_reason = this.checkInput();
        if (break_reason !== '') return Modal.warning({
            title: '表单校验失败',
            content: break_reason,
        });
        console.log(this.state);
    }
    checkInput() {
        if (this.state.username === '') return '请输入有效的用户名';
        if (this.state.password === '' || this.state.re_password === '') return '请输入密码';
        if (this.state.password !== this.state.re_password) return '确认密码输入不一致';
        if (this.state.cellphone.length !== 11) return '手机号长度不符合要求（目前仅支持中国大陆手机号）';
        if (!this.state.agreeable) return '请先接受许可条款';
        let cn_PhoneRule_CM = new RegExp('^((13[4-9])|(14[7-8])|(15[0-2,7-9])|(165)|(178)|(18[2-4,7-8])|(19[5,7,8]))\\d{8}|(170[3,5,6])\\d{7}$');
        let cn_PhoneRule_CU = new RegExp('^((13[0-2])|(14[5,6])|(15[5-6])|(16[6-7])|(17[1,5,6])|(18[5,6])|(196))\\d{8}|(170[4,7-9])\\d{7}$');
        let cn_PhoneRule_CT = new RegExp('^((133)|(149)|(153)|(162)|(17[3,7])|(18[0,1,9])|(19[0,1,3,9]))\\d{8}|((170[0-2])|(174[0-5]))\\d{7}$');
        let cn_PhoneRule_CBN = new RegExp('^((192))\\d{8}$');
        return !(cn_PhoneRule_CM.test(this.state.cellphone) || cn_PhoneRule_CU.test(this.state.cellphone) || cn_PhoneRule_CT.test(this.state.cellphone) || cn_PhoneRule_CBN.test(this.state.cellphone)) ? '手机号段非法或暂不支持（目前仅支持中国大陆手机号）' : '';
    }
    render() {
        return (
            <div className="App">
                <PageHeader
                    style={{
                        border: '0px',
                    }}
                    onBack={() => {
                        window.history.go(-1);
                    }}
                    title="注册"
                    subTitle="Registration"
                />
                <Form>
                    <Form.Item label="用户名">
                        <Input onChange={(e) => { this.setState({ username: e.target.value }) }} />
                    </Form.Item>
                    <Form.Item label="新密码" hasFeedback>
                        <Input.Password onChange={(e) => { this.setState({ password: e.target.value }) }} />
                    </Form.Item>
                    <Form.Item label="确认密码" hasFeedback>
                        <Input.Password onChange={(e) => { this.setState({ re_password: e.target.value }) }} />
                    </Form.Item>
                    <Form.Item label="绑定手机号">
                        <Input onChange={(e) => { this.setState({ cellphone: e.target.value }) }} />
                    </Form.Item>
                    <Form.Item>
                        <Checkbox onChange={(e) => { this.setState({ agreeable: e.target.checked }) }}>
                            同意&nbsp;<a href="./#" target="_self">叮云科技一站通许可条款</a>
                        </Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <ul style={{
                            color: '#666',
                            fontSize: '10px',
                            listStyle: 'square',
                            marginBottom: '0px',
                            padding: '0px'
                        }}>
                            <li style={{listStyle: 'none'}}>相关信息说明：</li>
                            <li>已开通企业微信的用户首次登录企业微信即自动开通一站通，无需通过本系统重复注册</li>
                            <li>本系统仅供未纳入企业微信管理的用户手动申请一站通，基于数据安全政策，此类用户只允许访问部分应用。后续可前往用户中心绑定企业微信开通完整权限</li>
                            <li>您的注册行为将被系统记录，并由风控系统评估是否允许自助开户，如不满足自助开户条件，您的账户注册申请将进入人工审核队列，请通过审批中心查询账户申请进度</li>
                        </ul>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" onClick={this.callBackend.bind(this)}>
                            立即注册
                        </Button>
                        &nbsp;
                        <Button type="danger" htmlType="reset">
                        重置表单
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}