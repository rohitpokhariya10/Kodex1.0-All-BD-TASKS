import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env, validateEnv } from './config/env.js';

async function startServer() {
  validateEnv();
  await connectDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Backend listening on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
