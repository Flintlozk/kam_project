const facebookService = require('../../services/facebook/facebook.service');

const facebookPOSTWebhookHandler = async (req, res) => {
  console.log('Facebook incoming headers:', req.headers);
  const signature = req.headers['x-hub-signature'];
  const result = await facebookService.facebookPOSTWebhook(signature, req.body);
  res.headers('Content-Type', 'text/plain');
  res.code(result.status);
  res.send(result.message);
};

const facebookGETValidationHandler = async (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const result = await facebookService.facebookGETValidation(mode, token, challenge);
  res.headers('Content-Type', 'text/plain');
  res.code(result.status);
  res.send(result.message);
};

const facebookCheckServiceHandler = async (req, res) => {
  const result = facebookService.facebookCheckService();
  res.code(result.status);
  res.send(result.message);
};

module.exports = {
  facebookPOSTWebhookHandler,
  facebookGETValidationHandler,
  facebookCheckServiceHandler,
};
