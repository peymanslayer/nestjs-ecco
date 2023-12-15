import { Module } from '@nestjs/common';
import { DatabaseModule } from './auth/database.module';
import { AuthController } from './auth/controller/auth.controller';
import { AuthService } from './auth/services/auth.service';
import { AuthProviders } from './auth/auth.provider';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule,AuthModule],
  controllers: [AuthController],
  providers: [AuthService, ...AuthProviders],
})
export class AppModule {}
