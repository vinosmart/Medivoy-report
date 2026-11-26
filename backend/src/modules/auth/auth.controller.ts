import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('google') async google(@Body() body: { idToken: string }) {
    return this.auth.loginWithGoogle(body.idToken)
  }
}
