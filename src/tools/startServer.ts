import { ApolloServer } from 'apollo-server';
import { decode } from 'jsonwebtoken';
import { Customer } from '../entity/Customer';
import { Staff } from '../entity/Staff';
import schema from '../schema';
import { connectDB } from './connectDB';

export async function startServer(port: string) {
  const server = new ApolloServer({
    schema,

    context: async ({ req }) => {
      const token = req.headers.authorization || null;

      const { customer, staff } = await getUser(token);
      return { customer, staff };
    },
  });

  await connectDB();

  server.listen({ port: process.env.PORT || port }).then(({}) => {
    console.log(`☁️ server connected ☁️`);
  });
}

const getUser = async (token: string) => {
  if (!token) return { customer: null, staff: null };

  const [Bearer, jwt] = token.split(' ');

  const id = decode(jwt);
  if (!Bearer || !id) return null;
  //@ts-ignore
  const customer = await Customer.findOne({ id: id.id });
  //@ts-ignore
  const staff = await Staff.findOne({ id: id.id });

  return { customer, staff };
};
