import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from '../graphql';
import { EnumAuthScope, IGQLContext } from '@reactor-room/itopplus-model-lib';
import { environment } from '../environments/environment';
import { Express } from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import ws from 'ws';
const WebSocketServer = ws.Server;
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { cryptoDecode } from '@reactor-room/itopplus-back-end-helpers';

export const graphQLRouteRegister = (app: Express): void => {
  const uploadOption = { maxFileSize: 10000000, maxFiles: 10 };
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    uploads: false,
    context: ({ req, connection }): IGQLContext => {
      if (connection) {
        return connection.context;
      }

      if (environment.production === false && req?.body?.operationName) {
        console.log('Operation:', req?.body?.operationName);
      }

      const appModule = req.headers['app-module'] || '';
      const shaClient = req.headers['x-sha-key'] || '';
      const host = req.headers.origin.replace('https://', '').replace('http://', '').split(':')[0];
      const cryptoResult = cryptoDecode(shaClient.toString(), environment.pageKey);
      if (host != cryptoResult) {
        throw new Error('AUTH TO CALL API NOT ALLOW');
      }

      const token = req.headers.access_token || '';

      const page_index = req.headers.page_index || 0;
      const subscription_index = req.headers.subscription_index || req.headers.subscriptionindex || 0;

      //TODO : GET USER ApplicationScope for Assign to context
      /* DB add onemore field allowScope 
        MORE_SOCIAL,
        MORE_CMS,
        MORE_AUTODIGI
      */

      return {
        app_module: appModule as EnumAuthScope,
        access_token: token as string,
        page_index: page_index as number,
        subscription_index: subscription_index as number,
      };
    },
  });

  app.use(graphqlUploadExpress(uploadOption));

  const corsOption = {
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  };

  apolloServer.applyMiddleware({ app, cors: corsOption, path: '/graphql' });
  const port = environment.CMSAPIPort;
  // TODO: SSL
  const protocol = environment.production ? 'wss://' : 'ws://';
  const server = app.listen(port, () => {
    // create and use the websocket server
    const wsServer = new WebSocketServer({
      server,
      path: '/graphql',
    });

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });
    useServer(
      {
        schema,
        onConnect: ({ connectionParams }) => {
          console.log('websocket: connected');
        },
        onDisconnect: ({ connectionParams }) => {
          console.log('websocket: disconnect');
        },
      },
      wsServer,
    );
    console.log(`🚀 Express/GQL Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
    console.log(`🚀 RealTime Subscriptions ready at ${protocol}localhost:${port}${apolloServer.subscriptionsPath}`);
  });
  //
  // httpServer.listen(port, () => {
  //   console.log(`🚀 Express/GQL Server ready at http://localhost:${port}${server.graphqlPath}`);
  //   console.log(`🚀 RealTime Subscriptions ready at ${protocol}localhost:${port}${server.subscriptionsPath}`);
  // });
};
