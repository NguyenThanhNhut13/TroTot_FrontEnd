
import { AuthResponse } from '../types/auth.type'
import http from '../utils/http'

export const URL_LOGIN = 'ola-chat/auth/login'
export const URL_REGISTER = 'ola-chat/users'
export const URL_LOGOUT = 'ola-chat/auth/logout'
export const URL_REFRESH_TOKEN = 'ola-chat/auth/refresh'

const authApi = {
  registerAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>(URL_REGISTER, body)
  },
  login(body: { username: string; password: string }) {
    return http.post<AuthResponse>(URL_LOGIN, body)
  },
  logout() {
    return http.post(URL_LOGOUT)
  }
}

export default authApi
