import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from '../graphql';
import { EnumAuthError, EnumAuthScope, IGQLContext } from '@reactor-room/itopplus-model-lib';
import { AuthError, validateContext } from '@reactor-room/itopplus-services-lib';
import { createServer } from 'http';
import { removeBearerText } from '@reactor-room/itopplus-back-end-helpers';
import { verifyToken } from '@reactor-room/itopplus-services-lib';
import { ConnectionContext } from 'subscriptions-transport-ws';
import { environment } from '../environments/environment';
import { Express } from 'express';
import { graphqlUploadExpress } from 'graphql-upload';

export const graphQLRouteRegister = (app: Express): void => {
  const uploadOption = { maxFileSize: 10000000, maxFiles: 10 };
  const server = new ApolloServer({
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
    subscriptions: {
      // TODO: Remove any by define connectionParams type
      onConnect: async (connectionParams: any, webSocket, context: ConnectionContext): Promise<IGQLContext> => {
        let access_token = '';
        if (connectionParams.access_token && connectionParams.access_token != '') {
          access_token = removeBearerText(connectionParams.access_token);
        } else if (connectionParams.accesstoken) access_token = connectionParams.accesstoken;
        if (access_token) {
          const verifyTokenResult = verifyToken(access_token);
          if (verifyTokenResult.value === EnumAuthError.INVALID_TOKEN) {
            throw new AuthError(verifyTokenResult.value);
          }
          const context: IGQLContext = {
            //TODO: We need app_module on subscription ?????
            app_module: EnumAuthScope.CMS,
            access_token: access_token as string,
            page_index: (connectionParams.pageindex || connectionParams.page_index || 0) as number,
            subscription_index: (connectionParams.subscriptionindex || connectionParams.subscription_index || 0) as number,
          };
          await validateContext(context, [EnumAuthScope.CMS]);
          return context;
        }
        throw new AuthError('Missing access token!');
      },
      onDisconnect: () => {
        console.log('websocket disconnect');
      },
    },
  });

  app.use(graphqlUploadExpress(uploadOption));

  const corsOption = {
    origin: (origin, callback) => {
      const whitelist = [environment.cms.origin, environment.cms.adminOrigin, environment.cms.backendUrl, 'http://localhost:3334'];
      if (origin == undefined) {
        callback(null, true);
        return;
      }
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not Allowed by CORS'));
      }
    },
    credentials: true,
  };
  server.applyMiddleware({ app, cors: corsOption, path: '/graphql' });
  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);
  const port = environment.CMSPort;
  const protocol = environment.production ? 'wss://' : 'ws://';
  httpServer.listen(port, () => {
    console.log(`🚀 Express/GQL Server ready at http://localhost:${port}${server.graphqlPath}`);
    console.log(`🚀 RealTime Subscriptions ready at ${protocol}localhost:${port}${server.subscriptionsPath}`);
  });
};
