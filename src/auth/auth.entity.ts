import { Table, Column, Model } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';

@Table
export class Auth extends Model {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  password: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column
  token:string
}
