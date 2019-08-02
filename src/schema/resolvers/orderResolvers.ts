import { getRepository } from 'typeorm';
import { contextType } from '..';
import { Customer } from '../../entity/Customer';
import { Order } from '../../entity/Order';
import { Staff } from '../../entity/Staff';
import { addressType } from './customerResolvers';
import { ACCOUNT_TYPE, ORDER_STATUS } from '../../config/constants';
import { STATUS_CODES } from 'http';

const resolvers = {
  Query: {
    getAllOrders,
    getCustomerOrders,
    getStaffOrders: getStaffOrders,
  },
  Mutation: {
    createNewOrder,
    changeOrderStatus,
    assignStaffOrder,
  },
};

//Query
/* ----------------GET_CUSTOMER_ORDER------------------ */
async function getCustomerOrders(
  _,
  { customerId, isActive },
  { customer, staff }: contextType
) {
  if (!customer && !staff)
    return { error: { path: 'getCustomerOrders', message: 'NO_ACCESS' } };

  const customerOrder = await getRepository(Customer)
    .createQueryBuilder('customer')
    .where('customer.id = :id', { id: customerId || customer.id })
    .leftJoinAndSelect('customer.orders', 'orders')
    .leftJoinAndSelect('orders.staff', 'staff')
    .getOne();

  let orders = customerOrder.orders;
  if (isActive) orders = orders.filter(order => order.status === 'ACTIVE');

  return { orders };
}

/* --------------------GET_STAFF_ORDER------------------------- */
async function getStaffOrders(
  _,
  { staffId, isActive },
  { staff }: contextType
) {
  if (!staff)
    return { error: { path: 'getStaffOrders', message: 'NO_ACCESS' } };

  const staffOrder = await getRepository(Staff)
    .createQueryBuilder('staff')
    .where('staff.id = :id', { id: staffId || staff.id })
    .leftJoinAndSelect('staff.orders', 'orders')
    .leftJoinAndSelect('orders.customer', 'customer')
    .getOne();

  let orders = staffOrder.orders;
  if (isActive) orders = orders.filter(order => order.status === 'ACTIVE');

  return { orders };
}

/* ----------------------GET_ALL_ORDER------------------------- */
/* TODO: Filters */
async function getAllOrders(_, { isActive }, { staff }: contextType) {
  if (!staff) return { error: { path: 'getAllOrders', message: 'NO_ACCESS' } };

  let orders = await getRepository(Order)
    .createQueryBuilder('orders')
    .leftJoinAndSelect('orders.customer', 'customer')
    .leftJoinAndSelect('orders.staff', 'staff')
    .orderBy('orders.updatedDate', 'ASC')
    .getMany();

  if (isActive) orders = orders.filter(order => order.status === 'ACTIVE');
  return { orders };
}

// Mutation
/* ------------------------CHANGE_ORDER_STATUS----------------------------- */
async function changeOrderStatus(
  _,
  { status, orderId },
  { staff }: contextType
) {
  if (!staff && !(Customer && status == ORDER_STATUS.CANCELLED_BY_CUSTOMER))
    return { error: { path: 'changeOrderStatus', message: 'NO_ACCESS' } };

  const order = await Order.findOne({ id: orderId });
  order.status = status;
  await order.save();

  return { orders: [order] };
}

type createNewOrderType = {
  address: addressType;
  cartItems: {}[];
};

async function createNewOrder(
  _,
  { address, cartItems }: createNewOrderType,
  { customer }: contextType
) {
  if (!customer)
    return { error: { path: 'createNewOrder', message: 'NO_ACCESS' } };

  let totalPrice = 0;

  cartItems.forEach(item => {
    totalPrice += item['price'];
  });
  const cart = JSON.stringify(cartItems);

  const order = Order.create({
    address: JSON.stringify(address),
    cartItems: cart,
    status: ORDER_STATUS.PLACED_BY_CUSTOMER,
    totalPrice,
    customer,
  });

  await order.save();

  return { orders: [order] };
}

async function assignStaffOrder(
  _,
  { staffId, orderId },
  { staff }: contextType
) {
  if (staff.accountType != ACCOUNT_TYPE.GOD_ADMIN)
    return { error: { path: 'assignStaffOrder', message: 'NO_ACCESS' } };

  staff = await Staff.findOne({ id: staffId });
  const order = await Order.findOne({ id: orderId });
  order.staff = staff;
  order.status = ORDER_STATUS.RECEIVED_BY_STORE;
  await order.save();

  return { orders: [order] };
}

export default resolvers;
