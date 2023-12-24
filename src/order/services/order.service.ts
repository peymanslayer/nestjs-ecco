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
import { Op } from 'sequelize';
import { Comment } from 'src/comment/comment..entity';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_REPOSITORY') private readonly orderRepository: typeof Order,
    @Inject('ORDERDRIVER_REPOSITORY')
    private readonly orderDriverrRepository: typeof OrderDriver,
    @Inject(forwardRef(() => DriverService))
    private readonly driverSerice: DriverService,
    private readonly commentService: CommentService,
    private readonly generateService: GenerateCode,
  ) {}

  async insertOrder(body: InsertOrderDto) {
    const insertOrder = await this.orderRepository.create<Order>({ ...body });
    const findOrderByUser = await this.orderRepository.findAll({
      where: { userId: body.userId },
    }
    );
    for(let i=0;i<findOrderByUser.length;i++){
      console.log(findOrderByUser[i].id,i);
      
      await this.orderRepository.update({
        numberOfOrder:100+i+1
      },
      {
        where:{id:findOrderByUser[i].id}
      }
      )
    }
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
    let findAll=[];
    const findOrder = await this.orderRepository.findAll({
      where: { shopId: body.shopId },
    });
    const findOrderDriverById=await this.orderDriverrRepository.findAll({where:{driverId:body.userId}});
    for(let i=0;i<findOrder.length;i++){
     for(let j=0;j<findOrderDriverById.length;j++){
      if(findOrder[i].id!==findOrderDriverById[j].orderId){
        findAll.push(findOrder[i])
      }
     }
    }
    const removeDuplicate=[...new Set(findAll)]
    if (findOrder) {
      return {
        status: 200,
        message: removeDuplicate,
      };
    } else {
      return {
        status: 400,
        message: 'order not founded',
      };
    }
  }

  async findRegisteredOrderByDriver(body: FindOrderDto){
    let findAll=[];
    const findOrder = await this.orderRepository.findAll({
      where: {
        [Op.and]:{
          shopId: body.shopId,
          isDeletedByDriver:{
            [Op.eq]:null
          }
        }
      },
    });
    const findOrderDriverById=await this.orderDriverrRepository.findAll({where:{driverId:body.userId}});
    for(let i=0;i<findOrder.length;i++){
     for(let j=0;j<findOrderDriverById.length;j++){ 
        if (findOrder[i].id === findOrderDriverById[j].orderId) {
        findAll.push(findOrder[i])
      }
     }
    }
    return await this.findRegisteredOrderByDriverMessage(findAll,findOrder)
  }

  async findRegisteredOrderByDriverMessage(findAll:Array<InsertOrderDto>,findOrder:Order[]){
    const removeDuplicate = [...new Set(findAll)];
    if (findOrder) {
      return {
        status: 200,
        message: removeDuplicate,
      };
    } else {
      return {
        status: 400,
        message: 'order not founded',
      };
    }
  }

  async findOrderByShopId(body: FindOrderDto){
    const findOrder = await this.orderRepository.findAll({
      where: { 
        [Op.and]:{
          shopId: body.shopId,
          // isDeletedByDriver:null,
          // registeredPassword:null,
          deletedAt:null,
          isRegisteredByDriver:null
       },
    }});
    return{
      status:200,
      message:findOrder
    }
  }

  async findOrderByUserId(userId: number) {
    const findOrderByUserId = await this.orderRepository.findAndCountAll({
      where: { 
        [Op.and]:{
          userId: userId ,
          isDeletedByDriver:null,
          deletedAt:null
        }
      },
    });
    return {
      status: 200,
      message: findOrderByUserId,
    };
  }
  async deleteOrderAndUpdateComment(body: DeleteOrderDto) {
    console.log(body);

    const insertComment = await this.commentService.insertComment(
      body.comment,
      body.id,
    );
    if (insertComment.status == 400) {
      return {
        status: 400,
        message: 'comment not inserted',
      };
    } else {
      return await this.deleteOrderProcess(body.id, body.userId);
    }
  }

  async deleteOrderProcess(id: number, userId: number) {
    const time= Date.now()
    const deleteOrder = await this.orderRepository.update({
     deletedAt:time
    },{
     where: { id: id }
    });
    const findAllOrder = await this.orderRepository.findAndCountAll({
      where: { 
       [Op.and]:{
        userId: userId,
        deletedAt:null
       }

       },
    });
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
    let array = [];
    await this.orderDriverrRepository.create({
      driverId: driverId,
      orderId: orderId,
    });
    // const findDriver = await this.driverSerice.findDriver(driverId);
    const updateOrder = await this.orderDriverrRepository.findAll({
      where: { orderId: orderId },
    });
    for (let i = 0; i < updateOrder.length; i++) {
      let driver = await this.driverSerice.findDriver(updateOrder[i].driverId);
      array.push(driver);
    }
    return {
      status: 200,
      message: array,
    };
  }

  async findOrderById(id: number) {
    const findOrderById = await this.orderRepository.findByPk(id);
    return findOrderById;
  }

  async updateOrderByPassword(password: number, shopId: number) {
    let generateCode: number;
    const findOneOrder = await this.orderRepository.findByPk(shopId);
    let passwords = findOneOrder.Password5Number;
    if (passwords == null) {
      generateCode = this.generateService.generateCode().message;
    } else {
      generateCode = passwords;
    }
    const updateOrder = await this.orderRepository.update(
      {
        Password5Number: generateCode,
      },
      {
        where: { id: shopId },
      },
    );

    if (updateOrder[0] == 0) {
      return {
        status: 400,
        message: 'order not update',
      };
    } else {
      return {
        status: 200,
        message: findOneOrder,
      };
    }
  }
  async updateOrder(id: number, body: InsertOrderDto) {
    const updateOrder = await this.orderRepository.update(
      { ...body },
      {
        where: { id: id },
      },
    );
    if (updateOrder[0] == 0) {
      return {
        status: 400,
        message: 'order not updated',
      };
    } else {
      const findOrderById = await this.orderRepository.findByPk(id);
      return {
        status: 200,
        message: findOrderById,
      };
    }
  }

  async getOrderById(id: number) {
    const findOrderById = await this.orderRepository.findByPk(id);
    if (!findOrderById) {
      return {
        status: 400,
        message: 'order not found',
      };
    }
    return {
      status: 200,
      message: findOrderById,
    };
  }

  async findAllDeletedOrderByShopId(userId:number,shopId:number,body:FindOrderDto){
   let comments=[];
   let findAllDeletedOrderByShopId:Array<Order>
   if(body.afterHistory&&body.afterHistory){
    findAllDeletedOrderByShopId=await this.orderRepository.findAll({
      where:{
        [Op.and]:{
          userId:userId,
          shopId:shopId,
          deletedAt:{
            [Op.ne]:null
          },
          history:{
            [Op.between]:[body.beforeHistory,body.afterHistory]
          }
        }
      },
     });
   }else{
    findAllDeletedOrderByShopId=await this.orderRepository.findAll({
    where:{
      [Op.and]:{
        userId:userId,
        shopId:shopId,
        deletedAt:{
          [Op.ne]:null
        }
      }
    },
   });
  }

   for(let i=0;i<findAllDeletedOrderByShopId.length;i++){
    console.log(findAllDeletedOrderByShopId[i].id,i);
    
      const findComments = await this.commentService.findCommentByShopId(
        findAllDeletedOrderByShopId[i].id,
      );
    if(findComments){
     comments.push(findComments)
    }
   };

   return {
    message:{
      findAllDeletedOrderByShopId,
      comments
    }
   }

    
   }
  
  async findDeletedOrderByDriver(shopId:number,body:FindOrderDto){
    let drivers=[];
    let findDeletedOrderByDriver:Array<Order>
    if(body.afterHistory&&body.beforeHistory){
     findDeletedOrderByDriver=await this.orderRepository.findAll({
      where:{
        shopId:shopId,
        isDeletedByDriver:{
          [Op.ne]:null
        },
        history:{
          [Op.between]:[body.beforeHistory,body.afterHistory]
        }
      
        }
      })
    }else{
       findDeletedOrderByDriver=await this.orderRepository.findAll({
        where:{
          shopId:shopId,
          isDeletedByDriver:{
            [Op.ne]:null
          }
        
          }
        })
    }
      for(let i=0;i<findDeletedOrderByDriver.length;i++){
        const findInformaionDriver=await this.driverSerice.findDriver(findDeletedOrderByDriver[i].driver);
        if(findInformaionDriver){
        drivers.push(findInformaionDriver)
        }
      }
        return{
          message:{
            findDeletedOrderByDriver,
            drivers
          }
        }
      }



    async findAllRegisteredOrderByUser(shopId:number,body:FindOrderDto){
      let findAllDeletedOrderByShopId:Array<Order>;
      if(body.afterHistory&&body.beforeHistory){
       findAllDeletedOrderByShopId=await this.orderRepository.findAll({
        where:{
          [Op.and]:{
            shopId:shopId,
            deletedAt:{
              [Op.eq]:null
            },
            history:{
              [Op.between]:[body.beforeHistory,body.afterHistory]
            }
          }
        }
      });
    }else{
      findAllDeletedOrderByShopId=await this.orderRepository.findAll({
        where:{
          [Op.and]:{
            shopId:shopId,
            deletedAt:{
              [Op.eq]:null
            }
          }
        }
      });
    }
      return findAllDeletedOrderByShopId;
    }

    async findOrderList(shopId:number,userId:number,body:FindOrderDto){
      const findAllDeletedOrderByShopId=await this.findAllDeletedOrderByShopId(userId,shopId,body);
      const findAllRegisteredOrderByUser=await this.findAllRegisteredOrderByUser(shopId,body);
      const findDeletedOrderByDriver=await this.findDeletedOrderByDriver(shopId,body);
      return{
        status:200,
        message:{
          findAllDeletedOrderByShopId:findAllDeletedOrderByShopId.message,
          findAllRegisteredOrderByUser,
          findDeletedOrderByDriver
        }
      }
    }
    
  }

