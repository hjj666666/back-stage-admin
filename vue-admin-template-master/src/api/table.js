import request from '@/utils/request'

// api文件是用来封装获取数据的方法的
export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
