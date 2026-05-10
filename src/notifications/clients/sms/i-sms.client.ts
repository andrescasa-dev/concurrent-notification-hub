export interface SmsSendParams {
  to: string;
  body: string;
}

export interface ISmsClient {
  send(params: SmsSendParams): Promise<{ simulatedMessageId: string }>;
}
