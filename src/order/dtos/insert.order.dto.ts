import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InsertOrderDto {
  @IsNotEmpty()
  @IsNumber()
  woodPallet: number;

  @IsNotEmpty()
  @IsNumber()
  plasticPallet: number;

  @IsNotEmpty()
  @IsNumber()
  basketOfPegahYogurt: number;

  @IsNotEmpty()
  @IsNumber()
  basketOfPegahِDough: number;

  @IsNotEmpty()
  @IsNumber()
  dominoBasket: number;

  @IsNotEmpty()
  @IsNumber()
  harazBasket: number;

  @IsNotEmpty()
  @IsNumber()
  kallehBasket: number;

  @IsNotEmpty()
  @IsNumber()
  boxBasket: number;

  @IsNotEmpty()
  @IsNumber()
  orderNumber:number

  @IsNotEmpty()
  shopId:number

  @IsNotEmpty()
  driverId:number

  @IsNotEmpty()
  Password5Number:number

  @IsNotEmpty()
  history:string

  @IsNotEmpty()
  userId:number

  @IsNotEmpty()
  id:number
}
