import { Body, Inject, Injectable } from '@nestjs/common';
import { Order } from '../order,entity';
import { InsertOrderDto } from '../dtos/insert.order.dto';
import { FindOrderDto } from '../dtos/find.order.dto';
import { DeleteOrderDto } from '../dtos/delete.order.dto';
import { CommentService } from 'src/comment/services/comment.service';
import { DriverService } from 'src/driver/services/driver.service';
import { forwardRef } from '@nestjs/common';
import { OrderDriver } from '../orderDriver.entity';
import { GenerateCode } from './generate.code';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_REPOSITORY') private readonly orderRepository: typeof Order,
    @Inject('ORDERDRIVER_REPOSITORY')
    private readonly orderDriverrRepository: typeof OrderDriver,
    @Inject(forwardRef(() => DriverService))
    private readonly driverSerice: DriverService,
    private readonly commentService: CommentService,
    private readonly generateService:GenerateCode
  ) {}

  async insertOrder(body: InsertOrderDto) {
    const insertOrder = await this.orderRepository.create<Order>({ ...body });
    const maxNumberOfShopCode = 1;
    const minNumberOfShopCode = 1000;
    if (!body.shopId) {
      insertOrder.shopId =
        Math.floor(
          Math.random() * (maxNumberOfShopCode - minNumberOfShopCode + 1),
        ) + minNumberOfShopCode;
    }
    insertOrder.Password5Number = body.Password5Number;
    insertOrder.save();
    if (insertOrder) {
      return {
        status: 201,
        message: insertOrder,
      };
    } else {
      return {
        status: 401,
        message: 'order not created',
      };
    }
  }

  async findOrder(body: FindOrderDto) {
    const findOrder = await this.orderRepository.findOne({
      where: { shopCode: body.shopId },
    });
    if (findOrder) {
      return {
        status: 200,
        message: findOrder,
      };
    } else {
      return {
        status: 400,
        message: 'order not founded',
      };
    }
  }

  async findOrderByUserId(userId:number){
   const findOrderByUserId=await this.orderRepository.findAndCountAll({
    where:{userId:userId}
   });
   return{
    status:200,
    message:findOrderByUserId
   }
  }
  async deleteOrderAndUpdateComment(body: DeleteOrderDto) {
    console.log(body);
    
    const insertComment = await this.commentService.insertComment(body.comment,body.id);
    if (insertComment.status==400) {
      return {
        status: 400,
        message: 'comment not inserted',
      };
    } else {
      return await this.deleteOrderProcess(body.id,body.userId);
    }
  }

  async deleteOrderProcess(id: number,userId:number) {
    const deleteOrder = await this.orderRepository.destroy({
      where: { id: id },
    });
    const findAllOrder=await this.orderRepository.findAndCountAll({
      where:{userId:userId}
    })
    if (deleteOrder) {
      return {
        status: 200,
        message: findAllOrder,
      };
    } else {
      return {
        status: 400,
        message: 'order not deleted',
      };
    }
  }

  async updateOrderDriver(driverId: number, shopId: number, orderId: number) {
    let array=[];
    await this.orderDriverrRepository.create({
      driverId: driverId,
      orderId: orderId,
    });
    // const findDriver = await this.driverSerice.findDriver(driverId);
    const updateOrder = await this.orderDriverrRepository.findAll({
      where: { orderId: orderId },
    });
    for(let i=0;i<updateOrder.length;i++){
      let driver=await this.driverSerice.findDriver(updateOrder[i].driverId);
      array.push(driver)
    }
      return {
        status: 200,
        message:array
      };
    }

    async findOrderById(id:number){
     const findOrderById=await this.orderRepository.findByPk(id);
     return findOrderById
    }

    async updateOrderByPassword(password:number,shopId:number){
      let generateCode:number
      const findOneOrder=await this.orderRepository.findByPk(shopId);
      let passwords=findOneOrder.Password5Number
      if(passwords==null){
      generateCode=this.generateService.generateCode().message;
      }else{
        generateCode=passwords
      }
      const updateOrder=await this.orderRepository.update({
        Password5Number:generateCode
      },
      {
        where:{id:shopId}
      })

      if(updateOrder[0]==0){
        return{
          status:400,
          message:'order not update'
        }
      }else{
        return{
          status:200,
          message:findOneOrder
        }
      }

}
 async updateOrder(id:number,body:InsertOrderDto){
  const updateOrder=await this.orderRepository.update({...body},{
    where:{id:id}
  });
  if(updateOrder[0]==0){
    return{
      status:400,
      message:'order not updated'
    }
  }else{
    const findOrderById=await this.orderRepository.findByPk(id);
    return{
      status:200,
      message:findOrderById
    }
  }
 }

 async getOrderById(id:number){
  const findOrderById=await this.orderRepository.findByPk(id);
  if(!findOrderById){
    return{
      status:400,
      message:'order not found'
    }
  }
  return{
    status:200,
    message:findOrderById
  }
 }
} 
