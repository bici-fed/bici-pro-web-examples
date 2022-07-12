
import {
    AlipayCircleOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoCircleOutlined,
    UserOutlined,
    WeiboCircleOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
} from '@bicitech-design/pro-components';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import {history} from 'umi';
import LOGO from '@/assets/logo.svg';
import LOGIN_BG from '@/assets/login_bg.png';

const LoginMessage: React.FC<{
    content: string;
}> = ({ content }) => {
    return (
        <Alert
            style={{
                marginBottom: 24,
            }}
            message={content}
            type="error"
            showIcon
        />
    );
};

const Login: React.FC = () => {
    const [userLoginState, setUserLoginState] = useState<any>({});
    const [type, setType] = useState<string>('account');
    const { initialState, setInitialState } = useState({});

    const fetchUserInfo = async () => {
        const userInfo = await initialState?.fetchUserInfo?.();
        if (userInfo) {
            await setInitialState((s) => ({
                ...s,
                currentUser: userInfo,
            }));
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            // 登录
            // const msg = await login({ ...values, type });
            const msg = {status:'ok'};
            if (msg.status === 'ok') {
                const defaultLoginSuccessMessage ="登录成功！"
                message.success(defaultLoginSuccessMessage);
                await fetchUserInfo();
                const urlParams = new URL(window.location.href).searchParams;
                history.push(urlParams.get('redirect') || '/');
                return;
            }
            console.log(msg);
            // 如果失败去设置用户错误信息
            setUserLoginState(msg);
        } catch (error) {
            const defaultLoginFailureMessage = "登录失败，请重试！";
            console.log(error);
            message.error(defaultLoginFailureMessage);
        }
    };
    const { status, type: loginType } = userLoginState;

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <LoginForm
                    logo={<img alt="logo" src={LOGO} />}
                    title="BICI TECH"
                    subTitle="BICI Tech 博智云创是西南地区最强的数字化工厂"
                    initialValues={{
                        autoLogin: true,
                    }}
                    actions={[]}
                    onFinish={async (values) => {
                        // await handleSubmit({});
                        history.push('/home')
                    }}
                >
                    {/*<Tabs activeKey={type} onChange={setType}>*/}
                    {/*    <Tabs.TabPane*/}
                    {/*        key="account"*/}
                    {/*        tab="账户密码登录"*/}
                    {/*    />*/}
                    {/*    <Tabs.TabPane*/}
                    {/*        key="mobile"*/}
                    {/*        tab="手机号登录"*/}
                    {/*    />*/}
                    {/*</Tabs>*/}

                    {status === 'error' && loginType === 'account' && (
                        <LoginMessage
                            content="账户或密码错误(admin/ant.design)"
                        />
                    )}
                    {type === 'account' && (
                        <>
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={styles.prefixIcon} />,
                                }}
                                placeholder="用户名: admin"
                                rules={[
                                    {
                                        required: true,
                                        message: "请输入用户名!",
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon} />,
                                }}
                                placeholder="密码: 123456"
                                rules={[
                                    {
                                        required: true,
                                        message: "请输入密码！",
                                    },
                                ]}
                            />
                        </>
                    )}

                    {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
                    {type === 'mobile' && (
                        <>
                            <ProFormText
                                fieldProps={{
                                    size: 'large',
                                    prefix: <MobileOutlined className={styles.prefixIcon} />,
                                }}
                                name="mobile"
                                placeholder="手机号"
                                rules={[
                                    {
                                        required: true,
                                        message:"请输入手机号！",
                                    },
                                    {
                                        pattern: /^1\d{10}$/,
                                        message: "手机号格式错误！",
                                    },
                                ]}
                            />
                        </>
                    )}
                    <div
                        style={{
                            marginBottom: 24,
                        }}
                    >
                        <ProFormCheckbox noStyle name="autoLogin">
                            自动登录
                        </ProFormCheckbox>
                        <a
                            style={{
                                float: 'right',
                            }}
                        >
                            忘记密码
                        </a>
                    </div>
                </LoginForm>
            </div>
        </div>
    );
};

export default Login;