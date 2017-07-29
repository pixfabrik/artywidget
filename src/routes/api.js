var api = require('../api');

exports.callApi = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  api.process(req, res);
};
