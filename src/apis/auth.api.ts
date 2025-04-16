
import { ref } from 'yup'
import { AuthResponse } from '../types/auth.type'
import http from '../utils/http'

export const URL_LOGIN = 'api/v1/auth/login'
export const URL_REGISTER = 'api/v1/auth/register'
export const URL_LOGOUT = 'api/v1/auth/logout'
export const URL_REFRESH_TOKEN = 'api/v1/auth/refresh'
export const URL_VERIFY_OTP = 'api/v1/auth/verify-otp'

const authApi = {
  registerAccount(body: { credential: string; fullname: String; password: string ; confirmPassword: string }) {
    return http.post<AuthResponse>(URL_REGISTER, body)
  },
  login(body: { credential: string; password: string }) {
    return http.post<AuthResponse>(URL_LOGIN, body)
  },
  logout(body: { refreshToken: string }) {
    return http.post<AuthResponse>(URL_LOGOUT, body)
  },
  refreshToken(body: {accessToken: String; refreshToken: String}) {
    return http.post<AuthResponse>(URL_REFRESH_TOKEN, body)
  },
  verifyOtp(body: { credential: string ; otp: string }) {
    return http.post<AuthResponse>(URL_VERIFY_OTP, body)
  },
}

export default authApi
