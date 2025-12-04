import { TestWorkflowEnvironment } from '@temporalio/testing'
import {
  GreetingWorkflowPayload,
  GreetingWorkflowPayloadType,
  SupabaseDeleteWebhook,
  SupabaseInsertWebhook,
  SupabaseUpdateWebhook,
  User,
  WebhookPayloadType,
} from 'vince-common'
import {
  Client,
  ScheduleOptions,
  ScheduleOverlapPolicy,
} from '@temporalio/client'
import { Schedule } from '../../../src/handle-user-event/models/Schedule'
import { UserAnniversaryGreetingSchedule } from '../../../src/handle-user-event/models/UserAnniversaryGreetingSchedule'

describe('UserAnniversaryGreetingSchedule', () => {
  const insertData: SupabaseInsertWebhook<'users'> = {
    type: WebhookPayloadType.INSERT,
    table: 'users',
    record: {
      id: 'ece14da6-e541-40fe-9201-4ee85acaa8d8',
      first_name: 'Velva',
      last_name: 'Rau',
      birthday: '1987-02-28',
      timezone: 'Asia/Vientiane',
      created_at: '2025-12-01T14:22:42.155115+00:00',
    },
    schema: 'public',
    old_record: null,
  }
  const updateData: SupabaseUpdateWebhook<'users'> = {
    type: WebhookPayloadType.UPDATE,
    table: 'users',
    record: {
      id: 'ece14da6-e541-40fe-9201-4ee85acaa8d8',
      first_name: 'Velvasdasdasdas',
      last_name: 'Rau',
      birthday: '1987-02-28',
      timezone: 'Asia/Vientiane',
      created_at: '2025-12-01T14:22:42.155115+00:00',
    },
    schema: 'public',
    old_record: {
      id: 'ece14da6-e541-40fe-9201-4ee85acaa8d8',
      first_name: 'Velva',
      last_name: 'Rau',
      birthday: '1987-02-28',
      timezone: 'Asia/Vientiane',
      created_at: '2025-12-01T14:22:42.155115+00:00',
    },
  }
  const deleteData: SupabaseDeleteWebhook<'users'> = {
    type: WebhookPayloadType.DELETE,
    table: 'users',
    record: null,
    schema: 'public',
    old_record: {
      id: 'ece14da6-e541-40fe-9201-4ee85acaa8d8',
      first_name: 'Velvasdasdasdas',
      last_name: 'Rau',
      birthday: '1987-02-28',
      timezone: 'Asia/Vientiane',
      created_at: '2025-12-01T14:22:42.155115+00:00',
    },
  }

  let testEnv: TestWorkflowEnvironment

  beforeEach(async () => {
    testEnv = await TestWorkflowEnvironment.createLocal()
  }, 10_000)
  afterEach(async () => {
    await testEnv?.teardown()
    jest.restoreAllMocks()
    jest.clearAllMocks()
  }, 10_000)

  it('should create schedule with the right arguments passed', () => {
    const webhookpayload: SupabaseInsertWebhook<'users'> = {
      type: WebhookPayloadType.INSERT,
      table: 'users',
      record: {
        id: 'ece14da6-e541-40fe-9201-4ee85acaa8d8',
        first_name: 'Velva',
        last_name: 'Rau',
        birthday: '1987-02-28',
        timezone: 'Asia/Vientiane',
        created_at: '2025-12-01T14:22:42.155115+00:00',
      },
      schema: 'public',
      old_record: null,
    }
    const user = new User(webhookpayload.record)
    const mockClient = {
      schedule: {
        create: jest.fn((_) => {}),
      },
    }
    const schedule = new UserAnniversaryGreetingSchedule(mockClient as any)
    schedule.create(webhookpayload)

    const payload: GreetingWorkflowPayload<'users'> = {
      type: GreetingWorkflowPayloadType.ANNIVERSARY,
      data: webhookpayload,
    }

    const option: ScheduleOptions = {
      action: {
        type: 'startWorkflow',
        workflowType: 'greetingWorkflow',
        args: [payload],
        taskQueue: 'anniversary-greetings',
      },
      scheduleId: schedule.getScheduleId(webhookpayload),
      policies: {
        catchupWindow: '1 day',
        overlap: ScheduleOverlapPolicy.ALLOW_ALL,
      },
      spec: {
        calendars: [
          {
            month: 'DECEMBER',
            dayOfMonth: 1,
            hour: 9,
            minute: 0,
          },
        ],
        timezone: user.record.timezone,
      },
    }

    expect(mockClient.schedule.create).toHaveBeenCalledWith(option)
  })

  it('should create a schedule', async () => {
    const client: Client = testEnv.client
    const schedule: Schedule = new UserAnniversaryGreetingSchedule(client)
    const handle = await schedule.create(insertData)
    const description = await handle.describe()

    // creates a perpetual schedule
    expect(description.info.nextActionTimes.length).toBe(10)
  })

  it('should update a schedule', async () => {
    const client: Client = testEnv.client
    const schedule: Schedule = new UserAnniversaryGreetingSchedule(client)
    await schedule.create(insertData)
    const handle = await schedule.update(updateData)
    const description = await handle.describe()
    const payload: GreetingWorkflowPayload<'users'> = {
      type: GreetingWorkflowPayloadType.ANNIVERSARY,
      data: updateData,
    }
    expect(description.action.args).toStrictEqual([payload])
  })

  it('should delete a schedule', async () => {
    const client: Client = testEnv.client
    const schedule: Schedule = new UserAnniversaryGreetingSchedule(client)
    await schedule.create(insertData)
    await schedule.update(updateData)
    await schedule.delete(deleteData)
    const handle = client.schedule.getHandle(schedule.getScheduleId(deleteData))

    await expect(async () => handle.describe()).rejects.toThrow()
  })
})
