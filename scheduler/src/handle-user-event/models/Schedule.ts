import { Client, ScheduleHandle, ScheduleOptions } from '@temporalio/client'
import { Tables, WebhookPayloadType } from 'vince-common'
import {
  SupabaseDeleteWebhook,
  SupabaseInsertWebhook,
  SupabaseUpdateWebhook,
  SupabaseWebhookPayload,
  TableName,
} from 'vince-common'

export abstract class Schedule<T extends TableName = TableName> {
  constructor(protected client: Client) {}

  abstract getScheduleId(webhookpayload: SupabaseWebhookPayload<T>): string

  abstract generateScheduleOptions(
    webhookpayload: SupabaseWebhookPayload<T>,
  ): ScheduleOptions

  getRecordFromPayload(webhookpayload: SupabaseWebhookPayload<T>): Tables<T> {
    switch (webhookpayload.type) {
      case WebhookPayloadType.INSERT: {
        return webhookpayload.record
      }
      case WebhookPayloadType.UPDATE: {
        return webhookpayload.record
      }
      case WebhookPayloadType.DELETE: {
        return webhookpayload.old_record
      }
    }
  }

  async create(
    webhookpayload: SupabaseInsertWebhook<T>,
  ): Promise<ScheduleHandle> {
    return this.client.schedule.create(
      this.generateScheduleOptions(webhookpayload),
    )
  }

  async update(
    webhookpayload: SupabaseUpdateWebhook<T>,
  ): Promise<ScheduleHandle> {
    const handle = this.client.schedule.getHandle(
      this.getScheduleId(webhookpayload),
    )
    const options = this.generateScheduleOptions(webhookpayload)
    await handle.update((previous) => Object.assign({}, previous, options))
    return handle
  }

  async delete(
    webhookpayload: SupabaseDeleteWebhook<T>,
  ): Promise<ScheduleHandle> {
    const handle = this.client.schedule.getHandle(
      this.getScheduleId(webhookpayload),
    )
    await handle.delete()

    return handle
  }
}
