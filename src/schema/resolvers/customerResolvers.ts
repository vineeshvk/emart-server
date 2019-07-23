import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { contextType } from '..';
import { PASSWORD_INVALID } from '../../config/Errors';
import { Customer } from '../../entity/Customer';
import { ACCOUNT_TYPE } from '../../config/constants';

const resolvers = {
  Query: { getCustomerInfo },
  Mutation: { customerLogin, customerRegister, updateCustomerAccount },
};

//Query

/* -------------------GET_CUSTOMER_ORDER--------------------- */
async function getCustomerInfo(
  _,
  { customerId },
  { staff, customer }: contextType
) {
  if (!customer && staff && staff.accountType == ACCOUNT_TYPE.DELIVERY)
    return { error: { path: 'getCustomerInfo', message: 'NO_ACCESS' } };

  if (customer) return { user: customer };

  const cust = await Customer.findOne({ id: customerId });
  return { user: cust };
}

//Mutation

/* -------------------LOGIN---------------- */
type loginArgs = {
  phoneNumber: string;
  password: string;
};
async function customerLogin(_, { phoneNumber, password }: loginArgs) {
  const user = await Customer.findOne({ phoneNumber });
  if (!user)
    return { error: { path: 'customerLogin', message: "User doesn't exist" } };

  const validPassword = await compare(password, user.password);
  if (!validPassword) return { errors: [PASSWORD_INVALID] };

  const jwtToken = sign({ id: user.id }, 'process.env.JWT_SECRET_TOKEN');

  return { user, jwtToken };
}

/* -----------------REGISTER----------------- */
type registerArgs = {
  phoneNumber: string;
  name: string;
  password: string;
};
export type addressType = {
  name: string;
  addressLine: string;
  landmark: string;
  phoneNumber: string;
};
async function customerRegister(
  _,
  { phoneNumber, name, password }: registerArgs
) {
  const userExist = await Customer.findOne({ phoneNumber });
  if (userExist)
    return { error: { path: 'customerRegister', message: 'User exist' } };

  const hashedPassword = await hash(password, 10);

  const user = Customer.create({
    phoneNumber,
    name,
    password: hashedPassword,
  });
  await user.save();

  const jwtToken = sign({ id: user.id }, 'process.env.JWT_SECRET_TOKEN');

  return { user, jwtToken };
}

async function updateCustomerAccount(
  _,
  { name, phoneNumber, address },
  { customer }: contextType
) {
  if (!customer) {
    return { error: { path: 'updateCustomerAccount', message: 'NO_ACCESS' } };
  }

  if (name) customer.name = name;
  if (phoneNumber) customer.phoneNumber = phoneNumber;
  if (address) customer.address = JSON.stringify(address);

  await customer.save();
  return { user: customer };
}

export default resolvers;
