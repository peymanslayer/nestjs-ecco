import { Table, Column, Model,AllowNull } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';

@Table
export class Comment extends Model {
  @AllowNull(false)
  @Column({type:DataType.STRING})
  comment: string;

  @Column({type:DataType.INTEGER})
  shopId: number;

}
