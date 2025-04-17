import { Footer } from '@/components';
import { APIAccountLogin } from '@/services/shortener/api';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { Alert, message } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
// 主题配置
const useStyles = createStyles(({ token }) => {
  console.log('token: ', token);
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
      padding: '4vw 16px'
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
  const [userLoginState, setUserLoginState] = useState<API2.LoginResult>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();

  // 获取用户信息
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    console.log('userInfo: ', userInfo);
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
  const handleSubmit = async (values: API2.LoginParams) => {
    try {
      const msg = await APIAccountLogin({
        ...values,
      });
      const defaultLoginSuccessMessage = '登录成功！';
      message.success(defaultLoginSuccessMessage);
      await fetchUserInfo();
      const urlParams = new URL(window.location.href).searchParams;
      if (msg.token) {
        localStorage.setItem('token', msg.token);
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
      history.push(urlParams.get('redirect') || '/');
    } catch (error: Error | any) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      const errInfo = error?.response?.data as API2.LoginResult;
      if (!errInfo.errcode) {
        errInfo.errcode = error?.response?.status || 1;
      }
      if (!errInfo.errinfo) {
        errInfo.errinfo = defaultLoginFailureMessage;
      }
      setUserLoginState(errInfo)
    }
  };
  const { errcode, errinfo } = userLoginState;
  return (
    <div className={styles.container}>
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
            await handleSubmit(values as API2.LoginParams);
          }}
        >
          {errcode && errinfo && (
            <LoginMessage content={ errinfo } />
          )}
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'用户名: admin or user'}
                initialValue={'admin'}
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
                placeholder={'密码: ant.design'}
                initialValue={'ant.design'}
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
            <a className={styles.fotget}>
              忘记密码 ?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
