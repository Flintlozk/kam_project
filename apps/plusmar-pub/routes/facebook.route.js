const facebookCtrl = require('../controller/facebook/facebook.controller');

const setup = (app) => {
  app.post('/', facebookCtrl.facebookPOSTWebhookHandler);
  app.get('/', facebookCtrl.facebookGETValidationHandler);
  app.get('/facebook', facebookCtrl.facebookCheckServiceHandler);
};

module.exports = {
  setup,
};
