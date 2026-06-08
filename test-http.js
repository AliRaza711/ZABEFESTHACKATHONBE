const http = require('http');
const server = http.createServer((req, res) => res.end('ok'));
server.listen(5000, () => {
  console.log('Server bound');
  console.log('unref?', server.hasUnref ? server.hasUnref() : false);
});
