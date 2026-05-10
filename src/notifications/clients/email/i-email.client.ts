export interface EmailSendParams {
  to: string;
  subject: string;
  htmlBody: string;
}

export interface IEmailClient {
  send(params: EmailSendParams): Promise<{ simulatedMessageId: string }>;
}
