export default [
  {
    path: '/account',
    layout: false,
    routes: [{ name: '登录', path: '/account/login', component: './Account/Login' }],
  },
  { path: '/dashboard', name: '仪表盘', icon: 'dashboard', component: './Dashboard' },
  { name: '短址管理', icon: 'UnorderedListOutlined', path: '/shortens', component: './Shortener' },
  { name: '查看日志', icon: 'UnorderedListOutlined', path: '/histories', component: './History' },
  { path: '/', redirect: '/dashboard' },
  { path: '*', layout: false, component: './404' },
];
