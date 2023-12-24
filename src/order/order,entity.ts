import { Table, Column, Model ,HasMany, BelongsToMany, HasOne } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import { Driver } from 'src/driver/driver.entity';
import { OrderDriver } from './orderDriver.entity';
import { Comment } from 'src/comment/comment..entity';


@Table
export class Order extends Model {
  @Column({ type: DataType.INTEGER })
  woodPallet: number;

  @Column({ type: DataType.INTEGER })
  plasticPallet: number;

  @Column({ type: DataType.INTEGER })
  basketOfPegahYogurt: number;

  @Column({ type: DataType.INTEGER })
  basketOfPegahِDough: number;

  @Column({ type: DataType.INTEGER })
  dominoBasket: number;

  @Column({ type: DataType.INTEGER })
  harazBasket: number;

  @Column({ type: DataType.INTEGER })
  kallehBasket: number;

  @Column({ type: DataType.INTEGER })
  boxBasket: number;

  @Column({ type: DataType.STRING })
  history: string;

  @Column({type:DataType.INTEGER})
  shopId:number;

  @Column({ type: DataType.INTEGER })
  orderNumber:number;

  @Column({ type: DataType.INTEGER })
  Password5Number:number;

  @HasOne(()=>Comment)
  comment:Comment;

  @BelongsToMany(()=>Driver,()=>OrderDriver)
  driverId:Driver[]

  @Column
  userId:number

  @Column({type:DataType.INTEGER})
  registeredPassword:number

  @Column({type:DataType.DATE})
  deletedAt?: Date;

  @Column({type:DataType.BOOLEAN})
  isDeletedByDriver:boolean

  @Column({type:DataType.INTEGER})
  driver:number

  @Column({type:DataType.INTEGER})
  isRegisteredByDriver:number

  @Column({type:DataType.INTEGER})
  numberOfOrder:number
  
}
