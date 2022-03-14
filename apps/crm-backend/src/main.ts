import * as express from 'express';

import { Graphql } from './routes/graphql.route';
import { googleAuthRoute } from './routes/google.auth';
import { setupConnection } from './connections/setup.connection';
import * as bodyParser from 'body-parser';
import { environment } from './environments/environment';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use((req, res, next) => {
  if ([environment.urlApi, environment.url].indexOf(req.headers['origin']) !== -1) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials');
    next();
  } else {
    res.sendStatus(401);
  }
});

void setupConnection().then(() => {
  Graphql(app);
  googleAuthRoute(app);
});
