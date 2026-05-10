import { Injectable } from '@nestjs/common';
import { EmailSendParams, IEmailClient } from './i-email.client';

let gmailSimulatedSeq = 0;

@Injectable()
export class SimulatedGmailEmailClient implements IEmailClient {
  send(params: EmailSendParams): Promise<{ simulatedMessageId: string }> {
    gmailSimulatedSeq += 1;
    return Promise.resolve({
      simulatedMessageId: `email-gmail-sim-${gmailSimulatedSeq}-to${params.to.length}`,
    });
  }
}
