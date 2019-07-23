import {
  BaseEntity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  Entity,
} from 'typeorm';
import { Order } from './Order';

@Entity()
export class Staff extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  token: string;

  @Column()
  accountType: string;

  @Column({ nullable: true })
  isActive: boolean;

  @Column({ nullable: true })
  status: string;

  @OneToMany(type => Order, order => order.staff)
  orders: Order[];
}
