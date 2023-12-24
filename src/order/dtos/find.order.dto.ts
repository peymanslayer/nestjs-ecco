import { IsNotEmpty, IsNumber } from "class-validator";

export class FindOrderDto{
 @IsNotEmpty()
 @IsNumber()
 shopId:number

 @IsNotEmpty()
 @IsNumber()
 userId:number

 @IsNotEmpty()
 id:number

 @IsNotEmpty()
 beforeHistory:string

 @IsNotEmpty()
 afterHistory:string
}