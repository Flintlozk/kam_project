const { publishMessage } = require('../domain/pubsub.domain');

const setupLoadTest = (app) => {
  console.log('setupLoadTest init');
  app.post('/loadtest', async (req, res) => {
    const payload = JSON.parse(req.body);
    await publishMessage(req.body, 'plusmar-line-staging3');
    res.send(200);
  });
};

module.exports = {
  setupLoadTest,
};
