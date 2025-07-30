import { GithubFilled, GitlabFilled, HomeFilled } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="2025"
      links={[
        {
          key: 'iDEV Forum',
          title: <HomeFilled />,
          href: 'https://forum.idev.top',
          blankTarget: true,
        },
        {
          key: 'Shortener Code',
          title: <GitlabFilled />,
          href: 'https://git.jetsung.com/idev/shortener-server',
          blankTarget: true,
        },
        {
          key: 'Shortener GitHub',
          title: <GithubFilled />,
          href: 'https://github.com/idev-sig/shortener-server',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
