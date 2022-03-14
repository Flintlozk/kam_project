import * as express from 'express';
import path from 'path';

export const cssRoute = (app: express.Express): void => {
  app.use(
    '/style',
    (req, res, next) => {
      next();
    },
    express.static(path.join(__dirname, './assets/css')),
  );
};

export const imageRoute = (app: express.Express): void => {
  app.use(
    '/images',
    (req, res, next) => {
      next();
    },
    express.static(path.join(__dirname, './assets/images')),
  );

  app.get('/image', (req, res) => {
    const path = String(req?.query?.path);

    if (!path) {
      res.sendStatus(400);
    }

    const directory = getDirectory();

    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
      Expires: new Date(Date.now() + 86400000).toUTCString(),
    });

    res.status(200).sendFile(path, { root: directory });
  });
};

export const jsLoaderRoute = (app: express.Express): void => {
  app.use(
    '/javascript',
    (req, res, next) => {
      next();
    },
    express.static(path.join(__dirname, './assets/static')),
  );
};

export const getDirectory = (): string => {
  try {
    const directory: string[] | string = __dirname.split('/');
    // Remove dist folder
    const index = directory.findIndex((d) => d === 'dist');
    delete directory[Number(index)];
    // Delete last element (plusmar-back-end)
    delete directory[Number(directory?.length - 1)];
    directory.push('plusmar-front-end', 'src');
    return directory.join('/');
  } catch (err) {
    console.log('Get directory error ', err);
  }
};
