import http from '@/utils/http'

/**
 * 获得组织机构
 * @param params
 */
export const fetchDeptTree = (params) => {
  return http({
      url:'/api/dept/tree',
  })
}