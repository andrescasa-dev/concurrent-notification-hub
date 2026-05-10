export interface PushSendParams {
  deviceToken: string;
  title: string;
  body: string;
}

/** Formats provider-specific payload internally; simulation only. */
export interface IPushClient {
  send(params: PushSendParams): Promise<{ simulatedMessageId: string }>;
}
