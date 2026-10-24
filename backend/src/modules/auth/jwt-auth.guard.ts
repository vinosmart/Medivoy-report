import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) { const req = context.switchToHttp().getRequest(); console.log('[JwtAuthGuard] Headers:', req.headers); return super.canActivate(context) }
  handleRequest(err, user, info) { console.log('[JwtAuthGuard] handleRequest:', { err, user, info }); if (err || !user) throw err || new UnauthorizedException('Unauthorized'); return user }
}
