import { Controller, Post, Body, Get, Headers, Put } from '@nestjs/common'
import { AuthService } from './auth.service'

class LoginDto {
  code: string
  encryptedData?: string
  iv?: string
}

class UpdateUserDto {
  phone?: string
  nickname?: string
  avatar?: string
  schoolId?: string
  schoolName?: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body.code, body.encryptedData, body.iv)
    if (!result) {
      return {
        code: 401,
        msg: '登录失败',
        data: null,
      }
    }
    return {
      code: 200,
      msg: 'success',
      data: result,
    }
  }

  @Get('user')
  async getUser(@Headers('Authorization') auth: string) {
    if (!auth) {
      return {
        code: 401,
        msg: '未登录',
        data: null,
      }
    }
    // 解析 token
    const userId = Buffer.from(auth.replace('Bearer ', ''), 'base64').toString().split(':')[0]
    const user = await this.authService.getUserById(userId)
    return {
      code: 200,
      msg: 'success',
      data: user,
    }
  }

  @Put('user')
  async updateUser(
    @Headers('Authorization') auth: string,
    @Body() body: UpdateUserDto,
  ) {
    const userId = Buffer.from(auth.replace('Bearer ', ''), 'base64').toString().split(':')[0]
    const user = await this.authService.updateUser(userId, body)
    return {
      code: 200,
      msg: 'success',
      data: user,
    }
  }

  @Post('verify-age')
  async verifyAge(
    @Headers('Authorization') auth: string,
    @Body() body: { idCard: string },
  ) {
    const userId = Buffer.from(auth.replace('Bearer ', ''), 'base64').toString().split(':')[0]
    const success = await this.authService.verifyAge(userId, body.idCard)
    if (success) {
      await this.authService.updateUser(userId, { ageVerified: true })
    }
    return {
      code: success ? 200 : 400,
      msg: success ? '验证通过' : '未满18岁，无法购买果酒',
      data: { success },
    }
  }
}
