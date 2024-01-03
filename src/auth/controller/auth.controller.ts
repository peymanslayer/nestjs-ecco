import { Controller, Post, Body, Res, Get, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dtos/signUp.dto';
import { Response } from 'express';
import { UniqueConstraintError } from 'sequelize';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DeleteUserDto } from '../dtos/deleteUser';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/api/signup')
  async signUp(@Body() body: SignUpDto, @Res() response: Response) {
    try {
      const signUp = await this.authService.signUp(body);
      response.status(signUp.status).json(signUp.message);
    } catch (err) {
      if(err instanceof UniqueConstraintError){
        response.status(400).json('already in use')
      }else{
      console.log(err);
      response.status(500).json('internal server Error');
    }
  }
  }

  @Post('/api/login')
  async logIn(@Body() body: SignUpDto, @Res() response: Response) {
    try {
      const logIn = await this.authService.login(body);
      console.log(logIn.message);
      
      response.status(logIn.status).json(logIn.message);
    } catch (err) {
      console.log(err);
      response.status(500).json('internal server Error');
    }
  }

  @Post('/api/sendEmail')
  async sendEmail(@Body() body: SignUpDto, @Res() response: Response){
  try{
   const sendEmail=await this.authService.sendEmail(body);
   response.status(sendEmail.status).json(sendEmail.message)
  }catch(err){
    console.log(err);
    response.status(500).json('is internal')
    
  }
  }

  @Post('/api/resetPassword')
  async resetPassword(@Body() body: SignUpDto, @Res() response: Response){
    try{
      const resetPassword=await this.authService.resetPassword(body);
      response.status(resetPassword.status).json(resetPassword.message)
    }catch(err){
      response.status(500).json('inetrnal server error')
    }
  }

  @Get('/api/sameUser')
  async sameUsers(@Body() body: SignUpDto, @Res() response: Response){
    try{
      const sameUser=await this.authService.sameUsers(body);
      response.status(sameUser.status).json(sameUser.message)
    }catch(err){
      console.log(err);
      
      response.status(500).json('internal server error')
    }
  }

  @Post('/api/findByRole')
  async findByRole(@Body() body: SignUpDto, @Res() response: Response){
   try{
    const findByRole=await this.authService.findByRole(body);
    response.status(findByRole.status).json(findByRole.message)
   }catch(err){
    response.status(500).json('internal server error')
   } 
  }

  @Post('/api/importExcel')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'uploads/',
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
  }))
  async importExcel(@UploadedFile() file:Express.Multer.File, @Res() response: Response){
   try{
   const importExcel=await this.authService.importDriversExcelToMysql(file);
   response.status(200).json('uploaded')
   }catch(err){
    console.log(err);
    
    response.status(500).json('internal server error')
   }
  }

  @Delete('/api/deleteUser')
  async deleteUser(@Body() body: DeleteUserDto, @Res() response: Response){
    try{
      const deleteUser=await this.authService.deleteUser(body.id);
      response.status(deleteUser.status).json(deleteUser.message)
    }catch(err){
      console.log(err);
      
      response.status(500).json('internal server error')
    }
  }

  @Post('/api/getUserById')
  async  getUserById(@Body() body: DeleteUserDto, @Res() response: Response){
   try{
    const getUserById=await this.authService.getUserById(body.id);
    response.status(getUserById.status).json(getUserById.message)
   }catch(err){
    response.status(500).json('internal server error')
   }
  }
}
