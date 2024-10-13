import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { ExtractJwt } from 'passport-jwt';

import * as config from 'config';

const jwtConfig = config.get('jwt');

// 다른 곳에서도 주입(Dependency Injection) 해서 사용하기 위함 -> @Injectable()
@Injectable()
// The class extends the PassportStrategy class from the @nestjs/passport package.
// you're passing the JWT Strategy defined by the passport-jwt package.
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    // passes two important options
    super({
      // This configures the secret key that JWT Strategy will use
      // to decrypt the JWT token in order to validate it.
      // and access its payload.
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret,
      // This configuration tells Passport to extract the JWT from the Authorization header.
      // to look for the JWT in the Authorization header of the incoming request.
      // passed over as a bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // 위에서 토큰이 유효한지 체크가 되면 validate 메소드에서 payload 에 있는 유저이름이 데이터베이스에서
  // 있는 유저인지 확인 후 있다면 유저 객체를 return 값으로 던져줍니다.
  // return 값은 @UseGuards(AuthGuard()) 를 이용한 모든 요청의 Request Object에 들어갑니다.
  async validate(payload) {
    const { username } = payload;
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
