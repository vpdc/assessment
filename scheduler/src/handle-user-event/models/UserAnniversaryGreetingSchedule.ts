import {
  GreetingWorkflowPayload,
  GreetingWorkflowPayloadType,
  SupabaseWebhookPayload,
  SupabaseWriteWebhookPayload,
} from 'vince-common'
import { ScheduleOptions, ScheduleOverlapPolicy } from '@temporalio/client'
import { UserGreetingSchedule } from './UserGreetingSchedule'

export class UserAnniversaryGreetingSchedule extends UserGreetingSchedule {
  override getScheduleId(webhookpayload: SupabaseWebhookPayload<'users'>) {
    const user = this.getUserFromPayload(webhookpayload)

    return `/greet/anniversary/user/${user.record.id}`
  }

  override generateScheduleOptions(
    webhookpayload: SupabaseWriteWebhookPayload<'users'>,
  ) {
    const user = this.getUserFromPayload(webhookpayload)
    const { joiningDate } = user
    const payload: GreetingWorkflowPayload<'users'> = {
      type: GreetingWorkflowPayloadType.ANNIVERSARY,
      data: webhookpayload,
    }

    return {
      action: {
        type: 'startWorkflow',
        workflowType: 'greetingWorkflow',
        args: [payload],
        taskQueue: 'anniversary-greetings',
      },
      scheduleId: this.getScheduleId(webhookpayload),
      policies: {
        catchupWindow: '1 day',
        overlap: ScheduleOverlapPolicy.ALLOW_ALL,
      },
      spec: {
        calendars: [
          {
            month: joiningDate.toFormat('LLLL').toUpperCase(),
            dayOfMonth: joiningDate.day,
            hour: 9,
            minute: 0,
          },
        ],
        timezone: user.record.timezone,
      },
    } as ScheduleOptions
  }
}
