const fastify = require('fastify')({
  logger: false,
});

const facebook = require('./routes/facebook.route');
const line = require('./routes/line.route');
const loadTest = require('./routes/loadtest.route');
const PORT = process.env.PORT || 3000;

fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
  try {
    done(null, body);
  } catch (err) {
    err.statusCode = 400;
    done(err, undefined);
  }
});

if (process.env.FACEBOOK == 'true') facebook.setup(fastify);
if (process.env.LINE == 'true') line.setup(fastify);
if (process.env.NODE_ENV === 'development') loadTest.setupLoadTest(fastify);

fastify.listen(PORT, '0.0.0.0', (err, address) => {
  if (err) throw err;
  console.log('PORTNUMBER:', PORT);
  fastify.log.info(`server listening on ${address}`);
});
