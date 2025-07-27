import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PassportStrategy } from '@nestjs/passport';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET environment variable is not defined!');

    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    };

    super(options);
  }

  async validate(payload: any) {
    return { userId: payload.userId, email: payload.email };
  }
}
