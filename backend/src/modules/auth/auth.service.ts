import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { OAuth2Client } from 'google-auth-library'
import { User } from './entities/user.entity'
export interface UserPayload { sub: string; email: string; role: string }
@Injectable()
export class AuthService {
  private googleClient: OAuth2Client
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {
    this.googleClient = new OAuth2Client(this.config.get<string>('GOOGLE_CLIENT_ID'))
  }

  async loginWithGoogle(idToken: string) {
    const clientId = this.config.get<string>('GOOGLE_CLIENT_ID')
    if (!clientId) throw new UnauthorizedException('Google sign-in is not configured')

    let ticket
    try {
      ticket = await this.googleClient.verifyIdToken({ idToken, audience: clientId })
    } catch {
      throw new UnauthorizedException('Invalid Google token')
    }

    const payload = ticket.getPayload()
    if (!payload?.email || !payload.email_verified) {
      throw new UnauthorizedException('Google account email is not verified')
    }

    const { sub: googleId, email, name, picture } = payload

    let user = await this.userRepo.findOne({ where: { googleId } })
    if (!user) {
      user = await this.userRepo.findOne({ where: { email } })
    }

    if (user) {
      user.googleId = googleId
      user.name = name ?? user.name
      user.avatarUrl = picture ?? user.avatarUrl
      await this.userRepo.save(user)
    } else {
      user = this.userRepo.create({
        email,
        googleId,
        name: name ?? null,
        avatarUrl: picture ?? null,
        role: 'patient',
      })
      await this.userRepo.save(user)
    }

    return this.generateToken(user)
  }

  private generateToken(user: User) {
    const payload: UserPayload = { sub: user.id, email: user.email, role: user.role }
    return {
      access_token: this.jwt.sign(payload),
      user: { id: user.id, email: user.email, role: user.role, name: user.name, avatarUrl: user.avatarUrl },
    }
  }

  async validateUser(payload: UserPayload) {
    return this.userRepo.findOne({ where: { id: payload.sub } })
  }
}
