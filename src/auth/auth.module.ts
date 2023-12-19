import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { StockService } from 'src/ReceiveStock/services/stock.service';
import { StockModule } from 'src/ReceiveStock/stock.module';
import { AuthProviders } from './auth.provider';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { DriverModule } from 'src/driver/driver.module';

@Module({
  imports: [
    JwtModule.register({
      secret: '1234rt'
    }),
    StockModule,
    DriverModule
  ],
  controllers:[AuthController],
  providers:[AuthService,...AuthProviders],
  exports: [JwtModule,AuthService],
})
export class AuthModule {}
