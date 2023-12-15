import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: '1234rt'
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
