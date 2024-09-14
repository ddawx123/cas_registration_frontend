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
import { RequestTool } from "./utils/requestTool";

export default class RegisterWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            re_password: '',
            cellphone: '',
            agreeable: false,
            in_progress: false
        };
    }
    callBackend() {
        let break_reason = this.checkInput();
        if (break_reason !== '') return Modal.warning({
            title: '表单校验失败',
            content: break_reason,
            okText: '好',
        });
        this.setState({ in_progress: true });
        console.log('request:', this.state);
        RequestTool.post(atob('aHR0cHM6Ly9hcGkuZHNjaXRlY2guY29tL2NnaS1iaW4vcmVnaXN0ZXIuY2dp'), this.state).then((res) => {
            console.log('response:', res);
            this.setState({ in_progress: false });
            switch (res) {
                case 'OK':
                    this.setState({
                        username: '',
                        password: '',
                        re_password: '',
                        cellphone: '',
                        agreeable: false
                    });
                    Modal.success({
                        title: '注册成功',
                        content: '账户注册成功，欢迎加入叮云科技一站通！请注意，我们的后台风控机制仍将审核此次注册是否合规，若系统判定账户存在风险，可能临时锁定您的账户并需您配合进行二次实人认证',
                        okText: '好',
                        onOk: args => {
                            window.history.go(-1);
                        }
                    });
                    break;
                case 'IllegalRequest':
                    this.setState({
                        username: '',
                        password: '',
                        re_password: '',
                        cellphone: ''
                    });
                    Modal.warning({
                        title: '注册操作受限',
                        content: '平台前后端正在升级，建议稍后重试',
                        okText: '好',
                    });
                    break;
                case 'InvalidRequest':
                    this.setState({
                        username: '',
                        password: '',
                        re_password: '',
                        cellphone: ''
                    });
                    Modal.info({
                        title: '注册操作受限',
                        content: '缺少必要表单字段，如持续出现此提示，可能系平台前后端正在升级，建议稍后重试',
                        okText: '好',
                    });
                    break;
                case 'UserAlreadyExists':
                    Modal.warning({
                        title: '注册操作受限',
                        content: '当前输入的用户名或手机号已被其他用户使用，建议更换其他再次尝试。若手机号为您本人所属，可能该手机号为运营商二次放号，请前往账户服务中心提供相关证明信息后由后台工作人员为您审核开户！',
                        okText: '好',
                    });
                    break;
                case 'InternalNotAllowed':
                    Modal.info({
                        title: '注册操作受限',
                        content: '当前指定的用户名为平台预留账户，不允许外部注册，请更换后再次尝试',
                        okText: '好',
                    });
                    break;
                default:
                    this.setState({
                        username: '',
                        password: '',
                        re_password: '',
                        cellphone: ''
                    });
                    Modal.error({
                        title: '用户注册服务异常',
                        content: '用户注册服务后端异常，请稍后再尝试注册账户',
                        okText: '好',
                    });
                    break;
            }
        }).catch((e) => {
            console.log(e);
            Modal.error({
                title: '服务不可用',
                content: '目前暂无法触达后端服务，请检查网络，如网络正常请稍后重试',
                okText: '好',
            });
        });
    }
    checkInput() {
        if (this.state.username === '') return '请输入有效的用户名';
        if (this.state.password === '' || this.state.re_password === '') return '请输入密码';
        if (this.state.password.length <= 6 || this.state.re_password.length <= 6) return '密码长度不符合复杂性要求，请输入7位及以上的密码';
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
                        <Input onChange={(e) => { this.setState({ username: e.target.value }) }} value={this.state.username} />
                    </Form.Item>
                    <Form.Item label="新密码" hasFeedback>
                        <Input.Password onChange={(e) => { this.setState({ password: e.target.value }) }} value={this.state.password} />
                    </Form.Item>
                    <Form.Item label="确认密码" hasFeedback>
                        <Input.Password onChange={(e) => { this.setState({ re_password: e.target.value }) }} value={this.state.re_password} />
                    </Form.Item>
                    <Form.Item label="绑定手机号">
                        <Input onChange={(e) => { this.setState({ cellphone: e.target.value }) }} value={this.state.cellphone} />
                    </Form.Item>
                    <Form.Item>
                        <Checkbox onChange={(e) => { this.setState({ agreeable: e.target.checked }) }} checked={this.state.agreeable}>
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
                        <Button type="primary" htmlType="submit" onClick={this.callBackend.bind(this)} loading={this.state.in_progress}>
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