import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    authData: AuthDto,
  ): Promise<{ user: User; access_token: string }> {
    const user = await this.usersService.findByWithPassword(authData.email);

    if (!user) {
      throw new UnauthorizedException('The email or password is incorrect');
    }

    if (!this.comparePasswords(authData.password, user.password)) {
      throw new UnauthorizedException('The email or password is incorrect');
    }

    const payload = { sub: user.id, email: user.email };

    delete user.password;

    return {
      user: user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  comparePasswords(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
