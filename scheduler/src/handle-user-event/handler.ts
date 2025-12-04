import {
  generateConnectionOptions,
  getEnv,
  SupabaseWebhookPayload,
  WebhookPayloadType,
} from 'vince-common'
import { Client, Connection } from '@temporalio/client'
import { Schedule } from './models/Schedule'
import { UserBirthdayGreetingSchedule } from './models/UserBirthdayGreetingSchedule'
import { UserAnniversaryGreetingSchedule } from './models/UserAnniversaryGreetingSchedule'

type UsersWebhookPayload = SupabaseWebhookPayload<'users'>

export async function handler(payload: UsersWebhookPayload): Promise<void> {
  const { namespace } = await getEnv()
  const connectionOptions = await generateConnectionOptions()

  const connection = await Connection.connect(connectionOptions)
  const client = new Client({ connection, namespace })

  const schedules: Schedule[] = [
    new UserBirthdayGreetingSchedule(client),
    new UserAnniversaryGreetingSchedule(client),
  ]

  for (const schedule of schedules) {
    switch (payload.type) {
      case WebhookPayloadType.INSERT: {
        await schedule.create(payload)
        break
      }
      case WebhookPayloadType.UPDATE: {
        await schedule.update(payload)
        break
      }
      case WebhookPayloadType.DELETE: {
        await schedule.delete(payload)
        break
      }
      default: {
        console.error(
          `Unrecognized schedule payload.type (${(payload as UsersWebhookPayload).type})`,
        )
      }
    }
  }
}
