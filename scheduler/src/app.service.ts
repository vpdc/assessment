import { Injectable } from '@nestjs/common'
import { SupabaseWebhookPayload } from 'vince-common'
import { handler } from './handle-user-event/handler'

@Injectable()
export class AppService {
  async handleUserEvent(payload: SupabaseWebhookPayload<'users'>) {
    await handler(payload)
  }
}
