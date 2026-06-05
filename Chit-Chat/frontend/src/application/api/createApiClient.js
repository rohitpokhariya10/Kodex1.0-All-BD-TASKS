import { AuthGateway } from '../../infrastructure/api/authGateway.js';
import { ChatGateway } from '../../infrastructure/api/chatGateway.js';
import { FileGateway } from '../../infrastructure/api/fileGateway.js';
import { HttpClient } from '../../infrastructure/api/httpClient.js';
import { RealtimeGateway } from '../../infrastructure/api/realtimeGateway.js';

export function createApiClient({ baseUrl = '/api', getToken, socketFactory } = {}) {
  const http = new HttpClient({
    baseUrl,
    getToken,
  });

  return {
    auth: new AuthGateway({ http }),
    chat: new ChatGateway({ http }),
    files: new FileGateway({ http }),
    realtime: new RealtimeGateway({
      socketFactory,
      url: baseUrl,
    }),
  };
}
