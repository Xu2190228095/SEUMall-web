import Cookies from 'js-cookie'

const TokenKey = 'loginToken'
const TokenKey_c = 'loginToken_c'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getToken_c() {
  return Cookies.get(TokenKey_c)
}

export function setToken_c(token) {
  return Cookies.set(TokenKey_c, token)
}

export function removeToken_c() {
  return Cookies.remove(TokenKey_c)
}
