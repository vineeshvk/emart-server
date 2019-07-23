import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Inventory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  perUnit: number;

  @Column()
  unit: string;

  @Column()
  category: string;

  @Column()
  inStock: number;

  @Column({ nullable: true })
  photoUrl: string;
}
