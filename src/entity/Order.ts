import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Customer } from './Customer';
import { Staff } from './Staff';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryGeneratedColumn('increment')
  orderNo: string;

  @Column()
  address: string;

  // Delivery Executive
  @ManyToOne(type => Staff, staff => staff.orders)
  staff: Staff;

  //Customer
  @ManyToOne(type => Customer, customer => customer.orders)
  customer: Customer;

  //Cart Items
  @Column()
  cartItems: string;

  @Column()
  status: string;

  @CreateDateColumn()
  datePlaced: string;

  @Column()
  totalPrice: number;

  @UpdateDateColumn()
  updatedDate: string;
}
