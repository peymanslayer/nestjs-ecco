import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dtos/signUp.dto';
import { Auth } from '../auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_REPOSITORY') private authRepository: typeof Auth,
    private readonly jwt: JwtService,
  ) {}

  // start signup service
  async signUp(BodyOfRequset: SignUpDto) {
    const signUp = await this.authRepository.findOne({
      where: { name: BodyOfRequset.name },
    });
    if (signUp) {
      return {
        status: 400,
        message: 'user exist',
      };
    } else {
      return await this.signUpProcess(BodyOfRequset);
    }
  }

  async signUpProcess(Body: SignUpDto) {
    const hashPassword = await bcrypt.hash(Body.password, 10);
    if (hashPassword) {
      return await this.generateTokenAndCreateUser(Body, hashPassword);
    } else {
      return {
        status: 400,
        message: 'password not hashed',
      };
    }
  }

  async generateTokenAndCreateUser(Body: SignUpDto, hashPassword: string) {
    const generateToken = this.jwt.sign({ name: Body.name });
    if (generateToken) {
      return await this.createUser(generateToken, Body, hashPassword);
    } else {
      return {
        status: 400,
        message: 'token not generate',
      };
    }
  }

  async createUser(token: string, Body: SignUpDto, hashpassword: string) {
    const createUser = await this.authRepository.create({
      password: hashpassword,
      token: token,
      name: Body.name,
    });
    if (createUser) {
      return {
        status: 200,
        message: createUser,
      };
    } else {
      return {
        status: 400,
        message: 'user not create',
      };
    }
  }
  // end of signup service

  /////////////////////////////////////

  // start login service

  async login(Body: SignUpDto) {
    const findUser = await this.authRepository.findOne({
      where: { name: Body.name },
    });
    if (!findUser) {
      return {
        status: 400,
        message: 'user not exist',
      };
    } else {
      return await this.loginProcess(findUser, Body);
    }
  }

  async loginProcess(findedUser: SignUpDto, Body: SignUpDto) {
    const comparePassword = await bcrypt.compare(
      Body.password,
      findedUser.password,
    );
    if (comparePassword) {
      return {
        status: 200,
        message: findedUser,
      };
    } else {
      return {
        status: 400,
        message: 'password not match',
      };
    }
  }

  // end of login service
}
