import { Controller, Get, Body, Res, Post, Delete, Param, Put } from '@nestjs/common';
import { InsertOrderDto } from '../dtos/insert.order.dto';
import { Response } from 'express';
import { OrderService } from '../services/order.service';
import { FindOrderDto } from '../dtos/find.order.dto';
import { DeleteOrderDto } from '../dtos/delete.order.dto';
import { GenerateCode } from '../services/generate.code';
import { OrderDriverService } from '../services/orderDriver.service';
import { UpdateOrderDto } from '../dtos/update.order.dto';
import { HttpService } from '@nestjs/axios';


@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly generateCodeService: GenerateCode,
    private readonly orderDriverService:OrderDriverService,
    private readonly httpService:HttpService
  ) {}
  @Post('/api/insertorder')
  async insertOrder(@Body() body: InsertOrderDto, @Res() response: Response) {
    try {
      const insertOrder = await this.orderService.insertOrder(body);
      response.status(insertOrder.status).json(insertOrder.message);
    } catch (err) {
      console.log(err);
      response.status(500).json('internal server error');
    }
  }

  @Post('/api/findOrder')
  async findOrder(@Body() body: FindOrderDto, @Res() response: Response) {
    try {
      const findOrder = await this.orderService.findOrder(body);
      response.status(findOrder.status).json(findOrder.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Delete('/api/deleteOrder')
  async deleteOrder(@Body() body: DeleteOrderDto, @Res() response: Response) {
    try {
      const deleteOrder =
        await this.orderService.deleteOrderAndUpdateComment(body);
      response.status(deleteOrder.status).json(deleteOrder.message);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }

  @Post('/api/ShopPassword')
  generatePassword(@Res() response: Response) {
    try{
    const generatePassword = this.generateCodeService.generateCode();
    response.status(generatePassword.status).json(generatePassword.message)
  }catch(err){
    response.status(500).json('internal server error')
  }
}

@Get('/api/getOrderByDriver/:id')
async getOrderByDriver(@Res() response: Response,@Param() id:any){
  try{
   const getOrderByDriver=await this.orderDriverService.findAllOrderOfDriver(id.id);
   response.status(getOrderByDriver.status).json(getOrderByDriver.message)
  }catch(err){
    console.log(err);
    
   response.status(500).json('internal server error')
  }
}
@Post('/api/updateOrderDriver')
async updateOrderDriver(@Body() body:UpdateOrderDto,@Res() response:Response ){
 try{
  const updateOrderDriver=await this.orderService.updateOrderDriver(body.driverId,body.shopId,body.orderId);
  response.status(updateOrderDriver.status).json(updateOrderDriver.message)
 }catch(err){
  console.log(err);
  response.status(500).json('internal server error')
 }
}

@Post('/api/insertOrderDriverById')
async insertOrderDriverById(@Body() body:UpdateOrderDto,@Res() response:Response){
  try{
    const insertOrderDriverById=await this.orderDriverService.insertOrderByDriver(body.driverId,body.orderId);
    response.status(insertOrderDriverById.status).json(insertOrderDriverById.message)
  }catch(err){
    console.log(err);
    response.status(500).json(err.mesaage)
    
  }
}
@Post('/api/getOrderById')
async getOrderById(@Body() body:FindOrderDto,@Res() response:Response){
 try{
  const getOrderById=await this.orderService.getOrderById(body.id);
  response.status(getOrderById.status).json(getOrderById.message)
 }catch(err){
  response.status(500).json('internal server error')
 }
}

@Post('/api/getOrdersByUser')
async getOrdersByUser(@Body() body:FindOrderDto,@Res() response:Response){
 try{
 const getOrdersByUser=await this.orderService.findOrderByUserId(body.userId);
 response.status(getOrdersByUser.status).json(getOrdersByUser.message)
}catch(err){
  response.status(500).json('internal server Error')
}
}

@Post('/api/updateOrder')
async updateOrderByPassword(@Body() body:InsertOrderDto,@Res() response:Response){
  try{
  const updateOrder=await this.orderService.updateOrderByPassword(body.Password5Number,body.shopId);
  response.status(updateOrder.status).json(updateOrder.message)
}catch(err){
  response.status(500).json('internal server error')
}
}

@Put('/api/updateOrderById')
async updateOrderById(@Body() body:InsertOrderDto,@Res() response:Response){
try{
 const updateOrderById=await this.orderService.updateOrder(body.id,body);
 response.status(updateOrderById.status).json(updateOrderById.message)
}catch(err){
  response.status(500).json('internal server error')
}
}
}
