import {
  SupabaseWebhookPayload,
  GreetingWorkflowPayload,
  GreetingWorkflowPayloadType,
  SupabaseWriteWebhookPayload,
} from 'vince-common'
import { ScheduleOptions, ScheduleOverlapPolicy } from '@temporalio/client'
import { UserGreetingSchedule } from './UserGreetingSchedule'

export class UserBirthdayGreetingSchedule extends UserGreetingSchedule {
  override getScheduleId(webhookpayload: SupabaseWebhookPayload<'users'>) {
    const user = this.getUserFromPayload(webhookpayload)

    return `/greet/birthday/user/${user.record.id}`
  }

  override generateScheduleOptions(
    webhookpayload: SupabaseWriteWebhookPayload<'users'>,
  ) {
    const user = this.getUserFromPayload(webhookpayload)
    const { birthDate } = user
    const payload: GreetingWorkflowPayload<'users'> = {
      type: GreetingWorkflowPayloadType.BIRTHDAY,
      data: webhookpayload,
    }

    return {
      action: {
        type: 'startWorkflow',
        workflowType: 'greetingWorkflow',
        args: [payload],
        taskQueue: 'birthday-greetings',
      },
      scheduleId: this.getScheduleId(webhookpayload),
      policies: {
        catchupWindow: '1 day',
        overlap: ScheduleOverlapPolicy.ALLOW_ALL,
      },
      spec: {
        calendars: [
          {
            month: birthDate.toFormat('LLLL').toUpperCase(),
            dayOfMonth: birthDate.day,
            hour: 9,
            minute: 0,
          },
        ],
        timezone: user.record.timezone,
      },
    } as ScheduleOptions
  }
}
