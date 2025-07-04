// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUPER_SECRET_KEY_123', // должен совпадать с тем, что в JwtModule.register()
    });
  }

  async validate(payload: any) {
    // payload — это то, что вы подписали при генерации токена (sub, email)
    return { userId: payload.sub, email: payload.email };
  }
}
