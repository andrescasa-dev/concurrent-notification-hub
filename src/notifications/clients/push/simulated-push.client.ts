import { Injectable } from '@nestjs/common';
import { IPushClient, PushSendParams } from './i-push.client';

let pushSimulatedSeq = 0;

@Injectable()
export class SimulatedPushClient implements IPushClient {
  send(params: PushSendParams): Promise<{ simulatedMessageId: string }> {
    pushSimulatedSeq += 1;
    const formattedPayload = {
      message: {
        token: params.deviceToken,
        notification: { title: params.title, body: params.body },
      },
    };
    return Promise.resolve({
      simulatedMessageId: `push-sim-${pushSimulatedSeq}-tok${formattedPayload.message.token.length}`,
    });
  }
}
