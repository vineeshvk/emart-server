import { createConnection } from 'typeorm';
import { dbconfig } from '../config/ormconfig';
import { Staff } from '../entity/Staff';
import { ACCOUNT_TYPE } from '../config/constants';
import { hash } from 'bcryptjs';

const connectDB = async () => {
  let retry = 10;
  while (retry !== 0) {
    try {
      await createConnection(dbconfig);
      console.log('🗄️ database connected 🗄️');
      await createAdmin();
      break;
    } catch (e) {
      retry--;
      console.log(e);
      console.log(`${retry} retries remaining`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

async function createAdmin() {

  const admin = await Staff.findOne({ phoneNumber: '123' });
  if (!admin || admin.accountType != ACCOUNT_TYPE.GOD_ADMIN) {
    Staff.delete({ accountType: ACCOUNT_TYPE.GOD_ADMIN });

    const newadmin = await Staff.create({
      token: 'CHICKENDINNER',
      phoneNumber: '123',
      name: 'sp',
      accountType: ACCOUNT_TYPE.GOD_ADMIN,
    }).save();
  }
}

export { connectDB };
