import request from '@/utils/request'

// 这个应该是获取展示在页面中的数据
//page: 1,
// 请求数据的多少
//limit: 20,
//intro: "",
export function fetchList(query) {
  return request({
    url: `/travel/getAllTravel?pageNum=${query.page}&pageSize=${query.limit}&introduction=${query.intro}`,
    method: 'get',
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/travel/detail',
    method: 'get',
    params: { id }
  })
}


export function createArticle(data) {
  return request({
    url: '/travel/addTravel',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/travel/updateTravel',
    method: 'post',
    data
  })
}

export function deleteArticle(id) {
  return request({
    url: `/travel/deleteTravelById?travelId=${id}`,
    method: 'post',
  })
}

export function changeStatus(id) {
  return request({
    url: `/travel/changeStatus?travelId=${id}`,
    method: 'post',
  })
}