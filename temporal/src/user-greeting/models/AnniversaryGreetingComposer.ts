import { SupabaseWriteWebhookPayload, User } from 'vince-common';
import { Composer } from './Composer';

export class AnniversaryGreetingComposer extends Composer<SupabaseWriteWebhookPayload> {
  compose(payload: SupabaseWriteWebhookPayload): string {
    const user = new User(payload.record);
    return `Hey, ${user.fullName} it’s your ${user.anniversaryOrdinal} anniversary with us`;
  }
}
