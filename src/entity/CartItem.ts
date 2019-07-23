/* import {
  BaseEntity,
  Column,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inventory } from './Inventory';
import { Order } from './Order';

export class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'uuid' })
  id: string;

  @Column()
  quantity: number;

  @Column()
  totalAmount: number;

  @OneToOne(type => Inventory)
  @JoinColumn()
  item: Inventory;

  @ManyToOne(type => Order, order => order.cartItems)
  order: Order;
}
 */