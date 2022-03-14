import { environment } from '../environments/environment';
import * as morgan from 'morgan';
export const setupAppServerConnection = (app): Promise<void> => {
  return new Promise((resolve, reject) => {
    const port = process.env.PORT || 3001;
    if (port) {
      const server = app.listen(port, '0.0.0.0', (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(`Listening at http://0.0.0.0:${port}/`);
          if (!environment.production) {
            app.use(morgan('tiny'));
          }
          resolve();
        }
      });
      server.on('error', console.error);
    } else {
      process.exit();
    }
  });
};
