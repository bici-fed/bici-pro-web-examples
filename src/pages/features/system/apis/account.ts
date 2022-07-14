import http from '@/utils/http';

export const queryCurrentUser = params => {
  return new Promise(resolve => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(v => {
        resolve(v);
      });
  });
};
/**
 * 根据组织code，分页获取用户列表
 * @param params
 */
export const queryUserPageList = params => {
  return http({
    url: '/api/system/service/remote/user/getUserPageList',
    method: 'POST',
    data: params
  });
};
