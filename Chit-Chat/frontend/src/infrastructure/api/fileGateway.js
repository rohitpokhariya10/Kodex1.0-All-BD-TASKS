export class FileGateway {
  constructor({ http }) {
    this.http = http;
  }

  uploadAttachment(file) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post('/files', formData);
  }

  listSharedFiles(conversationId) {
    return this.http.get(`/conversations/${conversationId}/files`);
  }
}
