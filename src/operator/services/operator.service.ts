import { Inject, Injectable } from '@nestjs/common';
import { Operator } from '../operator.schema';
import { OrderService } from 'src/order/services/order.service';
import { AuthService } from 'src/auth/services/auth.service';
import { InsertOperatorDto } from '../dtos/insertDto';
import { OperatorShop } from 'src/operatorShop/operatorShop.schema';

@Injectable()
export class OperatorService {
  constructor(
    @Inject('OPERATOR_PROVIDER')
    private readonly operatorRepository: typeof Operator,
    private readonly orderService: OrderService,
    private readonly authService:AuthService
  ) {}

  async insertOperator(body:InsertOperatorDto){
   let createOperator;
   const signUp=await this.authService.signUp(body);
   if(signUp.message!=='user exist'){
    createOperator=await this.operatorRepository.create({...body})
   }
   return{
    status:200,
    message:{
        signUp:signUp.message,
        createOperator
    }
   }
  }

  async findOneOperator(name:string){
    const findOneOperator=await this.operatorRepository.findOne({
        where:{name:name}
    });
    return{
     status:200,
     message:findOneOperator
    }
  }

  async findOneOperatorWithAssociaton(id:number){
   const findOneOperatorWithAssociaton=await this.operatorRepository.findOne({
    where:{id:id},
    include:OperatorShop
   })

   return{
    status:200,
    message:findOneOperatorWithAssociaton
   }
  }
}
