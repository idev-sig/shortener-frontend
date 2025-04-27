import { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */
let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 1 : 0;

const getAccess = () => {
  return access;
};

// 登录
const accountLogin = async (req: Request, res: Response) => {
  const { password, username } = req.body;
  console.log('req:', req.body);
  await waitTime(2000);
  if (password === 'admin' && username === 'admin') {
    res.send({
      token: 'admin-token',
    });
    access = 1;
    return;
  }
  if (password === 'user' && username === 'user') {
    res.send({
      token: 'user-token',
    });
    access = 2;
    return;
  }
  res.status(401).send({
    errcode: 401,
    errinfo: 'Authentication Failed',
  });
};

// 退出登录
const accountLogout = (req: Request, res: Response) => {
  access = 0;
  res.status(204).send({});
};

// 获取当前用户信息
const currentUser = (req: Request, res: Response) => {
  if (!getAccess()) {
    res.status(401).send({
      errcode: '401',
      errinfo: '请先登录！',
    });
    return;
  }
  res.send({
    name: 'jetsung',
  });
};

export default {
  // 登录
  'POST /api/account/login': accountLogin,

  // 退出登录
  'POST /api/account/logout': accountLogout,

  // 获取当前用户信息
  'GET /api/users/current': currentUser,
};
