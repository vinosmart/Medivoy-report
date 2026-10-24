import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService, UserPayload } from './auth.service'
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) { super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: 'change-me' }) }
  async validate(payload: UserPayload) { const user = await this.auth.validateUser(payload); if (!user) throw new UnauthorizedException(); return { userId: payload.sub, email: payload.email, role: payload.role } }
}
