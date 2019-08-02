import { decode } from 'jsonwebtoken';
import { Customer } from '../entity/Customer';
import { Staff } from '../entity/Staff';

export const getUser = async (token: string) => {
  try {
    if (!token) return { customer: null, staff: null };

    const [Bearer, jwt] = token.split(' ');

    const id: { id?: string } | string = decode(jwt);
    if (!Bearer || !id) return { customer: null, staff: null };
    var customer = await Customer.findOne({ id: id['id'] });
    var staff = await Staff.findOne({ id: id['id'] });

    return { customer, staff };
  } catch (e) {
    console.log('ERROR' + e);

    return { customer, staff };
  }
};
