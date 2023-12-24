import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dtos/signUp.dto';
import { Auth } from '../auth.entity';
import { DriverService } from 'src/driver/services/driver.service';
import { Driver } from 'src/driver/driver.entity';
import { StockService } from 'src/ReceiveStock/services/stock.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_REPOSITORY') private authRepository: typeof Auth,
    private readonly jwt: JwtService,
    private readonly driverService:DriverService,
    private readonly stockService:StockService,
    private readonly mailService:MailerService
  ) {}

  // start signup service
  async signUp(BodyOfRequset: SignUpDto) {
    const signUp = await this.authRepository.findOne({
      where: { mobile: BodyOfRequset.mobile },
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
     const insertUser=await this.createUser(generateToken, Body, hashPassword);
     const insertToAllRoles=await this.registerAllRoles(Body.role,Body.name)
      return{
        status:200,
        message:{
          insertUser,
          insertToAllRoles
        }
      } ;
    } else {
      return {
        status: 400,
        message: 'token not generate',
      };
    }
  }

  async registerAllRoles(role:string,name:string){
    switch (role) {
      case 'driver':
       return this.driverService.insertDriver(name);
       case 'ReceiveStock':
       return this.stockService.insertStockReciever(name);
      default:
        break;
    }
  }

  async createUser(token: string, Body: SignUpDto, hashpassword: string) {
    const createUser = await this.authRepository.create({
      email:Body.email,
      password: hashpassword,
      originalPassword:Body.password,
      token: token,
      name: Body.name,
      role:Body.role,
      mobile:Body.mobile,
      personelCode:Body.personelCode,
      shopCode:Body.shopCode
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
      where: { personelCode: Body.personelCode },
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

  async loginProcess(findedUser: Auth, Body: SignUpDto) {
    const comparePassword = await bcrypt.compare(
      Body.password,
      findedUser.password,
    );
    if (comparePassword) {
      return {
        status: 200,
        message:findedUser
      };
    } else {
      return {
        status: 400,
        message: 'password not match',
      };
    }
  }

  // end of login service
  async generatePassword(){
    const maxNumberOfPassword = 99999;
    const minNumberOfPassword = 10000;
    const password= Math.floor(
        Math.random() * (maxNumberOfPassword - minNumberOfPassword) + 1,
      );
    return{
        status:200,
        message:password
    }
  }
  async sendEmail(body:SignUpDto){
    const findUserByEmail=await this.authRepository.findOne({where:{email:body.email}});
    if(!findUserByEmail){
      return{
        status:400,
        message:'user not exist'
      }
    }
    this.mailService.sendMail({
     from:'peymantaghitash2022@gmail.com',
     to:body.email,
     subject:'is email',
     text:findUserByEmail.originalPassword,
     html:`<b> ${findUserByEmail.originalPassword} </b>`
    })
    return{
      status:200,
      message:'email send'
    }
   }

   async resetPassword(body:SignUpDto){
    const findUserByEmail=await this.authRepository.findOne({where:{email:body.email}});
    const hashPassword=await bcrypt.hash(body.password,10);
    findUserByEmail.password=hashPassword
    findUserByEmail.save();
    return{
      status:200,
      message:findUserByEmail
    }
   }
  }



