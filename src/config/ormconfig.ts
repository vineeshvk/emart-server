import { ConnectionOptions } from 'typeorm';
import { Customer } from '../entity/Customer';
import { Inventory } from '../entity/Inventory';
import { Order } from '../entity/Order';
import { Staff } from '../entity/Staff';
import { Image } from '../entity/Image';

const docker = {
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: '12345',
  database: 'emart',
};

const dev = {
  host: 'localhost',
  port: 5432,
  username: 'vineesh',
  password: '1234',
  database: 'emart',
};

const deploy = {
  url: process.env.DATABASE_URL,
  extra: { ssl: true },
};

const config = process.env.DATABASE_URL ? deploy : docker;

export const dbconfig: ConnectionOptions = {
  ...config,
  type: 'postgres',
  synchronize: true,
  logging: false,

  entities: [Customer, Order, Staff, Inventory, Image],
  dropSchema: false,
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: '../entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
