const lineService = require('../../services/line/line.service');

const lineWebhookHandler = async (req, res) => {
  //Not Await For Line Hook Reason
  if (lineService.lineWebhook(req.params.uuid, req.headers['x-line-signature'], req.body)) res.send(200, 'SUCCESS');
  else res.send(500);
  // ERROR WHEN SECRET NOT FOUND
};

const lineSubscriptionMessageHandler = async (req, res) => {
  lineService.lineSubscriptionMessage();
};

const lineCheckServiceHandler = async (req, res) => {
  const result = lineService.lineCheckService();
  res.code(result.status);
  res.send(result.message);
};

module.exports = {
  lineWebhookHandler,
  lineSubscriptionMessageHandler,
  lineCheckServiceHandler,
};
