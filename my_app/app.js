// My SocketStream 0.3 app

var http = require('http'),
    ss = require('socketstream'),
    redis = require('redis');
    conn = redis.createClient();

// set redis
ss.session.store.use('redis');
ss.api.add('db', conn);
// redis cfg
// {host: 'localhost', port: 6379, pass: 'myOptionalPass', db: 3}
ss.publish.transport.use('redis', {});
ss.session.options.maxAge = 8640000;
// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['libs/reset.css', 'app.css'],
  code: ['libs/jquery.min.js', 'app'],
  tmpl: '*'
});

// Serve this client on the root URL
ss.http.route('/', function(req, res){
  res.serveClient('main');
});

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));

// setInterval(function () {
// 	var value = new Date();
// 	ss.api.publish.all('foo:bar', value);
// }, 100);

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();
// Start web server
var server = http.Server(ss.http.middleware);
server.listen(8080);

// Start SocketStream
ss.start(server);

process.on('uncaughtException', function (err) {
	console.error('Exception caught: ', err);
});