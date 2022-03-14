import Cookies from 'js-cookie'

// 这个文件就是用来给浏览器的cookies设置Token通过ToKen判断是否已经登陆
const TokenKey = 'Admin-Token'

// 获取我们保存在Cookies中的Token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 设置Cookies中的Token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 移除Cookies中的Token
export function removeToken() {
  return Cookies.remove(TokenKey)
}
