import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dtos/signUp.dto';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/api/signup')
  async signUp(@Body() body: SignUpDto, @Res() response: Response) {
    try {
      const signUp = await this.authService.signUp(body);
      response.status(signUp.status).json(signUp.message);
    } catch (err) {
      console.log(err);
      response.status(500).json('internal server Error');
    }
  }

  @Post('/api/login')
  async logIn(@Body() body: SignUpDto, @Res() response: Response) {
    try {
      const logIn = await this.authService.login(body);
      response.status(logIn.status).json(logIn.message);
    } catch (err) {
      console.log(err);
      response.status(500).json('internal server Error');
    }
  }
}
