import http from '@/utils/http';

export const queryMenuList = params => {
  return http({
    url: '/api/menu',
    method: 'get',
    data: params
  });
};
