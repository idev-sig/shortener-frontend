import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';
const useStyles = createStyles(({ token }) => {
  return {
    container: {
      backgroundPosition: '100% -30%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '274px auto',
      // backgroundImage:
      //   "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
    },
    textHeading: {
      fontSize: '20px',
      color: token.colorTextHeading,
    },
    welcome: {
      fontSize: '14px',
      color: token.colorTextSecondary,
      lineHeight: '22px',
      marginTop: 16,
      marginBottom: 32,
      width: '65%',
    },
    card: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 16,
    },
  };
})

const Dashboard: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const { styles } = useStyles(token);
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        styles={{
          body:{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
          }
        }}
      >
        <div className={styles.container}>
          <div className={styles.textHeading}>
            欢迎使用 Shortener 短网址生成器
          </div>
          <p className={styles.welcome}>
            Shortener 是一个使用 Go 语言开发的短网址生成器。<a href='https://git.jetsung.com/idev/shortener' target='_blank'>后端使用 Gin 框架</a>，<a href='https://git.jetsung.com/idev/shortener-frontend' target='_blank'>前端使用 React 框架</a>，UI 框架使用 Ant Design。
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
