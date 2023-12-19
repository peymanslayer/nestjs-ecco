import { Inject, Injectable } from '@nestjs/common';
import { OrderDriver } from '../orderDriver.entity';
import { Order } from '../order,entity';
import { DriverService } from 'src/driver/services/driver.service';
import { forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';

@Injectable()
export class OrderDriverService {
  constructor(
    @Inject('ORDERDRIVER_REPOSITORY')
    private readonly orderDriverRepository: typeof OrderDriver,
    private readonly orderService:OrderService,
    @Inject(forwardRef(() => DriverService))
    private readonly driverService:DriverService
  ) {}
  async findAllOrderOfDriver(id:number) {
    const findAllOrderOfDriver=await this.driverService.findOneDriverById(id);
    if(!findAllOrderOfDriver){
    return{
        status:400,
        message:'error'
    }
    }
    return{
        status:200,
        message:findAllOrderOfDriver
    }
  }

  async insertOrderByDriver(driverId:number,orderId:number){
    let array=[];
    const insertOrderDriver=await this.orderDriverRepository.create({
        driverId:driverId,
        orderId:orderId
    });
     const findAllOrderByOrderId=await this.orderDriverRepository.findAll({
        where:{driverId:driverId}
     });
 
     for(let i=0;i<findAllOrderByOrderId.length;i++){
      const findOrder=await this.orderService.findOrderById(findAllOrderByOrderId[i].orderId)
      array.push(findOrder)
     }
     
  return{
    status:200,
    message:array
  }
  }
}
