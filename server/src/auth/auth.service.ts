import { Injectable } from '@nestjs/common'

export interface User {
  id: string
  openid: string
  phone: string
  nickname: string
  avatar: string
  schoolId?: string
  schoolName?: string
  role: 'student' | 'agent' | 'distributor' | 'admin'
  ageVerified: boolean
  createdAt: string
}

export interface LoginResult {
  user: User
  token: string
}

@Injectable()
export class AuthService {
  private users: Map<string, User> = new Map()

  async login(code: string, encryptedData?: string, iv?: string): Promise<LoginResult | null> {
    // 模拟微信登录 - 实际项目中需要调用微信接口
    // const wxResult = await wxService.code2Session(code)
    
    // 模拟生成 openid
    const openid = `mock_openid_${code}_${Date.now()}`
    
    // 检查用户是否存在
    let user = Array.from(this.users.values()).find(u => u.openid === openid)
    
    if (!user) {
      // 创建新用户
      user = {
        id: `user_${Date.now()}`,
        openid,
        phone: '',
        nickname: '新用户',
        avatar: '',
        role: 'student',
        ageVerified: false,
        createdAt: new Date().toISOString(),
      }
      this.users.set(openid, user)
    }

    // 生成 token (实际项目中使用 JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')

    return { user, token }
  }

  async getUserById(userId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.id === userId)
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUserById(userId)
    if (user) {
      Object.assign(user, data)
      this.users.set(user.openid, user)
    }
    return user
  }

  async verifyAge(userId: string, idCard: string): Promise<boolean> {
    // 简化验证 - 实际项目中需要对接身份证实名认证
    const birthYear = parseInt(idCard.substring(6, 10))
    const currentYear = new Date().getFullYear()
    const age = currentYear - birthYear
    return age >= 18
  }
}
