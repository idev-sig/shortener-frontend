import { Footer } from '@/components';
import { login } from '@/services/shortener/account';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { Alert, message } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
// 主题配置
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
    hero: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      padding: '4vw 16px',
    },
    marginBottom: {
      marginBottom: '24px',
    },
    fotget: {
      float: 'right',
    },
  };
});
// 登录提示消息
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
// 界面渲染
const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const [messageApi, contextHolder] = message.useMessage();

  const { styles } = useStyles();

  // 获取用户信息
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  // 登录请求
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      const msg = await login({
        ...values,
      });
      const defaultLoginSuccessMessage = '登录成功！';
      const urlParams = new URL(window.location.href).searchParams;
      if (msg.token) {
        localStorage.setItem('token', msg.token);
      }
      await fetchUserInfo();
      // 如果失败去设置用户错误信息
      history.push(urlParams.get('redirect') || '/');
      messageApi.success(defaultLoginSuccessMessage);
      setUserLoginState(msg);
    } catch (error: any) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      let { errcode, errinfo } = error?.response?.data;

      if (!errcode) {
        errcode = error?.response?.status || 1;
      }
      if (!errinfo) {
        errinfo = defaultLoginFailureMessage;
      }

      const err: API.LoginResult = {
        errcode,
        errinfo,
      };

      messageApi.error(err.errinfo);
      setUserLoginState(err);
    }
  };
  const { errcode, errinfo } = userLoginState;
  return (
    <div className={styles.container}>
      {contextHolder}
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      <div className={styles.hero}>
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Shortener"
          subTitle={'短网址管理平台'}
          initialValues={{
            auto: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          {errcode && errinfo && <LoginMessage content={errinfo} />}
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder={'用户名'}
              // initialValue={'admin'}
              rules={[
                {
                  required: true,
                  message: '用户名是必填项！',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder={'密码'}
              // initialValue={'ant.design'}
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
          </>
          <div className={styles.marginBottom}>
            <ProFormCheckbox noStyle name="auto">
              自动登录
            </ProFormCheckbox>
            <a className={styles.fotget}>忘记密码 ?</a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
