import schema from '../schema';
import { connectDB } from './connectDB';
import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { sendImage } from './sendImage';
import { getUser } from './getUser';

export async function startServer(port: string) {
  const app = express();
  await connectDB();

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const token = req.headers.authorization || null;
      const { customer, staff } = await getUser(token);
      return { customer, staff };
    },
  });

  app.use(bodyParser({ limit: '10mb' }));
  server.applyMiddleware({ app, path: '/graphql' });

  await sendImage(app);

  app.listen({ port: process.env.PORT || port }, () => {
    console.log(`☁️ server connected ☁️`);
  });
}
