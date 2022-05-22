import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

// 引入我们获取Token的方法
import { getToken } from '@/utils/auth'

// create an axios instance
// 这里封装一个axios实例
const service = axios.create({
  // 直接将这里的baseurl改为后端的baseurl即可
  baseURL:"http://9iugn5.natappfree.cc", // url = base url + request url
  
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
// 请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 判断vuex中的token是否存在 
    // 存在的话就放在http header当中的X-Token
    // 就是说在header中加了个X-Token
    // 但这里我们是看不了http请求的因为mock拦截了
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
// 响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */

  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    //逻辑就是判断是不是20000 不是20000再细分 判断是否失效
    //到最后也是 return Promise.reject(error) 交给我们自行处理
    // 将这里的code改为后端返回的code
    if (res.code !== 2000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 10000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          // 如果请求成功
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 10000
    })
    return Promise.reject(error)
  }
)

export default service
