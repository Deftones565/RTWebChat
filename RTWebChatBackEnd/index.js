const app = require('./app');
const config = require('./utils/config');
const http = require('http');
const { createWebSocketServer } = require('./websocket/index')

const httpServer = http.createServer(app);
const wss = createWebSocketServer(httpServer)

httpServer.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});