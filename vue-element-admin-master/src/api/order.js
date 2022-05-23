import request from '@/utils/request'

// 这个应该是获取展示在页面中的数据
export function fetchList(query) {
  return request({
    url: '/order/getAllOrders',
    method: 'get'
  })
}


