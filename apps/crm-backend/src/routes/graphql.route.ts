import { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { environment } from '../environments/environment';
import { createServer } from 'http';
import { typeDefs, resolvers } from '../graphql';
import { IGQLContext } from '@reactor-room/crm-models-lib';

import { graphqlUploadExpress } from 'graphql-upload';

export const Graphql = (app: Express): void => {
  const uploadOption = { maxFileSize: 100000000, maxFiles: 10 };
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    uploads: false,
    context: ({ req, connection }): IGQLContext => {
      const token = req.headers.access_token || '';
      return {
        access_token: token as string,
      };
    },
  });

  app.use(graphqlUploadExpress(uploadOption));
  const httpServer = createServer(app);
  server.applyMiddleware({ app, path: '/graphql' });
  server.installSubscriptionHandlers(httpServer);
  const port = environment.port;
  httpServer.listen(port, () => {
    console.log('Environment : ', environment.production ? 'Production' : 'Development');
    console.log(`🚀 Express/GQL Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
};
