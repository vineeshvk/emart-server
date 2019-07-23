import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { Customer } from '../entity/Customer';
import { Staff } from '../entity/Staff';
import customerResolvers from './resolvers/customerResolvers';
import staffResolvers from './resolvers/staffResolvers';
import orderResolvers from './resolvers/orderResolvers';
import inventoryResolvers from './resolvers/inventoryResolvers';
const typeDefs = importSchema(`${__dirname}/typeDefs.graphql`);

const resolvers = {
  Query: {
    ...customerResolvers.Query,
    ...staffResolvers.Query,
    ...orderResolvers.Query,
    ...inventoryResolvers.Query,
  },
  Mutation: {
    ...customerResolvers.Mutation,
    ...staffResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...inventoryResolvers.Mutation,
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
export default schema;

export type contextType = {
  customer: Customer;
  staff: Staff;
};

export type CartItemType = {
  itemId: string;
  perUnitPrice: number;
  quantity: number;
  price: number;
};
