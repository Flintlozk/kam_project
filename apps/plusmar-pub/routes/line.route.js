const lineCtrl = require('../controller/line/line.controller');

const setup = (app) => {
  app.post('/linewebhook/:pageid/:uuid', lineCtrl.lineWebhookHandler);

  //WATING FOR SUBSCRIPTION BECAUSE we don't need to connect to database
  lineCtrl.lineSubscriptionMessageHandler();

  app.get('/line', lineCtrl.lineCheckServiceHandler);
};

module.exports = {
  setup,
};
