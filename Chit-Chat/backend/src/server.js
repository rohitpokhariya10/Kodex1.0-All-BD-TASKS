import http from 'node:http';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env, validateEnv } from './config/env.js';
import { createSocketServer } from './realtime/socketServer.js';

async function startServer() {
  validateEnv();
  await connectDatabase();

  const app = createApp();
  const httpServer = http.createServer(app);
  createSocketServer(httpServer, { corsOrigin: env.clientOrigin });

  httpServer.listen(env.port, () => {
    console.log(`Backend listening on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
