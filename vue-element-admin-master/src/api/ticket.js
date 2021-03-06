import request from '@/utils/request'

import axios from 'axios'


// 这个应该是获取展示在页面中的数据
// 首先是获取列表函数url 
// 携带参数query(搜索关键词)：限制条件   limit: 20 （返回的数量）  page（返回第几页的数据） title: ""  (标题关键字)
// 需要返回值：列表数据list (返回来的数据集合)  total(数据空中所有数据的总数)
export function fetchList(query) {
  return request({
    //   下面是后端的地址
    url: `ticket/getLists?pageNum=${query.pageNum}&pageSize=${query.pageSize}&title=${query.title}`,
    method: 'get',
  })
  //return axios.get(`http://mffavp.natappfree.cc/menu/ticket/getLists?pageNum=${query.pageNum}&pageSize=${query.pageSize}&introduction=${query.introduction}`)
}


// 新增数据的api,请求为post请求
// 携带參數（data）新增门票的相关数据
export function createTicket(data){
  return request({
    //   下面是后端的地址
    url: 'ticket/addTicket',
    method: 'post',
    data
  })
  // return axios.post('http://mffavp.natappfree.cc/menu/ticket/addTicket',   
  //   data,
  // )
}


// 跟新列表數據api,post請求
// 携带更新后的列表數據
// 返回參數应该返回一个参数（boolean）：后端是否接受到参数并完成相应的更新
export function updateTicket(data){
  return request({
    //   下面是后端的地址
    url: 'ticket/updateTicket',
    method: 'post',
    data
  })
  // return axios.post('http://mffavp.natappfree.cc/menu/ticket/updateTicket',   
  //   data,
  // )
}



// 刪除列表數據api,post請求
// 携带(id):需要删除的数据的id
// 返回參數应该返回一个参数（boolean）：后端是否接受到参数并完成相应的更新
export function deleteTicket(id) {
    return request({
    //   下面是后端的地址
      url: `ticket/deleteTicket?ticketId=${id}`,
      method: 'post',
    })
  // deleteTicket
  //return axios.post(`http://mffavp.natappfree.cc/menu/ticket/deleteTicket?ticketId=${id}`)
  
}

// 添加一个修改状态的接口
export function chageStatus(id) {
  return request({
  //   下面是后端的地址
    url: `ticket/updateStatus?ticketId=${id}`,
    method: 'post',
  })
  // deleteTicket
 // return axios.post(`http://mffavp.natappfree.cc/menu/ticket/updateStatus?ticketId=${id}`)  
}