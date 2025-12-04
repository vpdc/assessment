import { SupabaseWebhookPayload, User } from 'vince-common'
import { Schedule } from './Schedule'

export abstract class UserGreetingSchedule extends Schedule<'users'> {
  getUserFromPayload(webhookpayload: SupabaseWebhookPayload<'users'>): User {
    return new User(super.getRecordFromPayload(webhookpayload))
  }
}
