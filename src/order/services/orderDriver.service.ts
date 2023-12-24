import { Inject, Injectable } from '@nestjs/common';
import { OrderDriver } from '../orderDriver.entity';
import { Order } from '../order,entity';
import { DriverService } from 'src/driver/services/driver.service';
import { forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { GenerateCode } from './generate.code';
import { Op, or } from 'sequelize';

@Injectable()
export class OrderDriverService {
  constructor(
    @Inject('ORDERDRIVER_REPOSITORY')
    private readonly orderDriverRepository: typeof OrderDriver,
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: typeof Order,
    private readonly orderService: OrderService,
    private readonly generateCodeService: GenerateCode,
    @Inject(forwardRef(() => DriverService))
    private readonly driverService: DriverService,
  ) {}
  async findAllOrderOfDriver(id: number) {
    const findAllOrderOfDriver = await this.driverService.findOneDriverById(id);
    if (!findAllOrderOfDriver) {
      return {
        status: 400,
        message: 'error',
      };
    }
    return {
      status: 200,
      message: findAllOrderOfDriver,
    };
  }

  async insertOrderByDriver(driverId: number, orderId: number) {
    console.log(driverId,orderId);
    
    let array = [];
    const insertOrderDriver = await this.orderDriverRepository.create({
      driverId: driverId,
      orderId: orderId,
    });
    const code = this.generateCodeService.generateCode().message;
    const updateOrder=await this.orderRepository.update({
      driver:driverId,
      registeredPassword: code,
      isRegisteredByDriver:1
    },{
      where:{id:orderId}
    })
    if(!updateOrder){
      return{
        status:400,
        message:'order not updated'
      }
    }
    const findAllOrderByOrderId = await this.orderDriverRepository.findAll({
      where: { driverId: driverId },
    });

    for (let i = 0; i < findAllOrderByOrderId.length; i++) {
      const findOrder = await this.orderService.findOrderById(
        findAllOrderByOrderId[i].orderId,
      );
      array.push(findOrder);
    }

    return {
      status: 200,
      message: array,
    };
  }

  async insertToOrderDriver(orderId: number, driverId: number) {
    console.log(orderId, driverId);

    const insertToOrderDriver = await this.orderDriverRepository.create({
      orderId: orderId,
      driverId: driverId,
    });
    const code = this.generateCodeService.generateCode().message;
    const updateOrder = await this.orderRepository.update(
      { registeredPassword: code },
      { where: { id: orderId } },
    );
    if(updateOrder[0]==0){
      return {
        status:400,
        message:'not done'
      }
    }
    return {
      status: 200,
      message: 'order is registered',
    };
  }

  async deleteOrderDriverService(driverId:number,orderId:number){
    console.log(driverId,orderId);
    
  //  const createOrderDriver=this.orderDriverRepository.create({driverId:driverId,orderId:orderId})
  //   const time=Date.now()
  //  const deleteOrderDriverService=await this.orderDriverRepository.update({
  //   deletedAt:time
  //  },{
  //   where:{
  //     [Op.and]:{
  //       driverId:driverId,
  //       orderId:orderId
  //     }
  //   }
  //  });
   const updateOrder=await this.orderRepository.update({
    isDeletedByDriver:true,
    driver:driverId
   },
   {
    where:{id:orderId}
   })
   if(updateOrder[0]==0){
    return{
      status:400,
      message:'not deleted'
    }
   }else{
    return{
      status:200,
      message:'deleted'
    }
   }
  }
}
