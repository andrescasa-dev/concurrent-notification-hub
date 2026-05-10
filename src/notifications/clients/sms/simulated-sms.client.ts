import { Injectable } from '@nestjs/common';
import { ISmsClient, SmsSendParams } from './i-sms.client';

let smsSimulatedSeq = 0;

@Injectable()
export class SimulatedSmsClient implements ISmsClient {
  send(params: SmsSendParams): Promise<{ simulatedMessageId: string }> {
    smsSimulatedSeq += 1;
    return Promise.resolve({
      simulatedMessageId: `sms-sim-${smsSimulatedSeq}-len${params.body.length}`,
    });
  }
}
