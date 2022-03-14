import * as express from 'express';
import { graphQLRouteRegister } from './routes/graphql.route';
import { setupAppServerConnection } from './connections/app.connection';

const app = express();
app.use(express.json());
setupAppServerConnection(app);
graphQLRouteRegister(app);
