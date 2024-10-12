import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async singIn(@Body() authData: AuthDto, @Res() res: Response) {
    const token = await this.authService.signIn(authData);
    return res.status(HttpStatus.OK).send(token);
  }
}
