var ipAddress = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8020;
var isProd = (ipAddress !== 'localhost');
var wsPort = (ipAddress === 'localhost') ? 16433 : 8080;
var baseUrl = (isProd) ? 'http://www.artywidget.com' : 'http://' + ipAddress;

if (!isProd && port !== 80) {
  baseUrl += ':' + port;
}

var baseSecureUrl = baseUrl.replace(/^http/, 'https');

module.exports = {
  ipAddress: ipAddress,
  port: port,
  isProd: isProd,
  wsPort: wsPort,
  baseUrl: baseUrl,
  baseSecureUrl: baseSecureUrl
};
