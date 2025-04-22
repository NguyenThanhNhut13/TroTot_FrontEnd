import { SuccessResponse } from "./utils.type"

export type Role = 'ADMIN' | 'USER'

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED'

export type AuthProvider = 'LOCAL' | 'GOOGLE' | 'FACEBOOK'

export interface User {
  id: string // đổi từ _id nếu backend trả về "id"
  fullName: string
  address: string
  dob: Date
}

export type UserRespone = SuccessResponse<{
  id: string // đổi từ _id nếu backend trả về "id"
  fullName: string
  address: string
  dob: Date
}>