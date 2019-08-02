import { contextType } from '..';
import { Staff } from '../../entity/Staff';
import { ACCOUNT_TYPE } from '../../config/constants';
import { sign } from 'jsonwebtoken';

const resolvers = {
  Query: {
    getStaffInfo,
    getAllStaffs,
  },
  Mutation: {
    createStaff,
    staffLogin,
    updateStaffAccount,
    disableAccount,
  },
};

//Query
/* ------------------------GET_STAFFS_INFO--------------------------- */

async function getStaffInfo(_, { staffId }, { staff }: contextType) {
  if (!staff) return { error: { path: 'getStaffInfo', message: 'NO_ACCESS' } };

  if (staffId) staff = await Staff.findOne({ id: staffId });

  return { user: staff };
}

/* ------------------------GET_ALL_STAFFS--------------------------- */
async function getAllStaffs(_, {}, {}) {
  const staff = await Staff.find({});
  return staff;
}

//Mutation
/* ----------------------CREATE_STAFF--------------------------- */
type createStaffType = {
  name: string;
  phoneNumber: string;
  token: string;
  accountType: string;
};
async function createStaff(
  _,
  { name, phoneNumber, token, accountType }: createStaffType,
  { staff }
) {
  //TODO: clarify the doubt of account type
  if (staff.accountType != ACCOUNT_TYPE.GOD_ADMIN)
    return { error: { path: 'createStaff', message: 'NO_ACCESS' } };

  //TODO: generate all the elements
  const isActive = true;
  const status = 'ON SITE';
  const newStaff = Staff.create({
    name,
    phoneNumber,
    accountType,
    isActive,
    status,
    token,
  });
  await newStaff.save();

  const jwtToken = sign({ id: staff.id }, 'process.env.JWT_SECRET_TOKEN');

  return { user: newStaff, jwtToken };
}

/* ----------------------STAFF_LOGIN--------------------------- */

async function staffLogin(_, { token }) {
  const staff = await Staff.findOne({ token });
  if (!staff) return { error: { path: 'staffLogin', message: 'NO_ACCOUNT' } };

  const jwtToken = sign({ id: staff.id }, 'process.env.JWT_SECRET_TOKEN');

  return { user: staff, jwtToken };
}

/* -------------------------UPDATE_STAFF_ACCOUNT----------------------------------- */

async function updateStaffAccount(
  _,
  { name, phoneNumber, token, accountType, isActive, status, staffId },
  { staff }: contextType
) {
  if (staff.accountType != ACCOUNT_TYPE.GOD_ADMIN && staffId)
    return { error: { path: 'updateStaffAccount', message: 'NO ACCESS' } };

  if (staffId) {
    staff = await Staff.findOne({ id: staffId });
  }

  if (name) staff.name = name;
  if (phoneNumber) staff.phoneNumber = phoneNumber;
  if (token) staff.token = token;
  if (accountType) staff.accountType = accountType;
  if (isActive) staff.isActive = isActive;
  if (status) staff.status = status;

  await staff.save();

  return { user: staff };
}

async function disableAccount(_, { staffId }, { staff }: contextType) {
  if (staff.accountType != ACCOUNT_TYPE.GOD_ADMIN)
    return { error: { path: 'disableStaffAccount', message: 'NO ACCESS' } };

  staff = await Staff.findOne({ id: staffId });

  staff.isActive = false;
  await staff.save();

  return { user: staff };
}

export default resolvers;
