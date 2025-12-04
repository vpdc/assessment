import {
  SupabaseDeleteWebhook,
  SupabaseInsertWebhook,
  SupabaseUpdateWebhook,
  WebhookPayloadType,
} from 'vince-common'
import { handler } from '../../src/handle-user-event/handler'
import { TestWorkflowEnvironment } from '@temporalio/testing'
import { UserBirthdayGreetingSchedule } from '../../src/handle-user-event/models/UserBirthdayGreetingSchedule'
import { Client, Connection } from '@temporalio/client'
import { UserAnniversaryGreetingSchedule } from '../../src/handle-user-event/models/UserAnniversaryGreetingSchedule'

describe('handle_user_event', () => {
  let testEnv: TestWorkflowEnvironment
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
  const data = [insertData, updateData, deleteData]
  beforeEach(async () => {
    testEnv = await TestWorkflowEnvironment.createLocal()
    jest
      .spyOn(Connection, 'connect')
      .mockResolvedValue(testEnv.nativeConnection as any)
    jest
      .spyOn(Client.prototype, 'constructor' as any)
      .mockReturnValue(testEnv.client)
  }, 10_000)
  afterEach(async () => {
    await testEnv?.teardown()
    jest.restoreAllMocks()
    jest.clearAllMocks()
  }, 10_000)

  it('Should call the the functions for birthday schedule', async () => {
    const createSpy = jest.spyOn(
      UserBirthdayGreetingSchedule.prototype,
      'create',
    )
    const updateSpy = jest.spyOn(
      UserBirthdayGreetingSchedule.prototype,
      'update',
    )
    const deleteSpy = jest.spyOn(
      UserBirthdayGreetingSchedule.prototype,
      'delete',
    )
    for (const payload of data) {
      await handler(payload)
    }

    expect(createSpy).toHaveBeenCalledTimes(1)
    expect(createSpy).toHaveBeenCalledWith(insertData)
    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(updateSpy).toHaveBeenCalledWith(updateData)
    expect(deleteSpy).toHaveBeenCalledTimes(1)
    expect(deleteSpy).toHaveBeenCalledWith(deleteData)
  })

  it('Should call the the functions for anniversary schedule', async () => {
    const createSpy = jest.spyOn(
      UserAnniversaryGreetingSchedule.prototype,
      'create',
    )
    const updateSpy = jest.spyOn(
      UserAnniversaryGreetingSchedule.prototype,
      'update',
    )
    const deleteSpy = jest.spyOn(
      UserAnniversaryGreetingSchedule.prototype,
      'delete',
    )
    for (const payload of data) {
      await handler(payload)
    }

    expect(createSpy).toHaveBeenCalledTimes(1)
    expect(createSpy).toHaveBeenCalledWith(insertData)
    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(updateSpy).toHaveBeenCalledWith(updateData)
    expect(deleteSpy).toHaveBeenCalledTimes(1)
    expect(deleteSpy).toHaveBeenCalledWith(deleteData)
  })

  it('Should fail to schedule if payload type is not supported - birthday', async () => {
    console.error = jest.fn().mockResolvedValue(null)

    const createSpy = jest.spyOn(
      UserBirthdayGreetingSchedule.prototype,
      'create',
    )
    const updateSpy = jest.spyOn(
      UserBirthdayGreetingSchedule.prototype,
      'update',
    )
    const deleteSpy = jest.spyOn(
      UserBirthdayGreetingSchedule.prototype,
      'delete',
    )
    for (const payload of data) {
      const newPayload = {
        ...payload,
        type: 'Something else',
      } as any
      await handler(newPayload)
    }

    expect(createSpy).toHaveBeenCalledTimes(0)
    expect(updateSpy).toHaveBeenCalledTimes(0)
    expect(deleteSpy).toHaveBeenCalledTimes(0)
  })

  it('Should fail to schedule if payload type is not supported - anniversary', async () => {
    console.error = jest.fn().mockResolvedValue(null)
    const createSpy = jest.spyOn(
      UserAnniversaryGreetingSchedule.prototype,
      'create',
    )
    const updateSpy = jest.spyOn(
      UserAnniversaryGreetingSchedule.prototype,
      'update',
    )
    const deleteSpy = jest.spyOn(
      UserAnniversaryGreetingSchedule.prototype,
      'delete',
    )
    for (const payload of data) {
      const newPayload = {
        ...payload,
        type: 'Something else',
      } as any
      await handler(newPayload)
    }

    expect(createSpy).toHaveBeenCalledTimes(0)
    expect(updateSpy).toHaveBeenCalledTimes(0)
    expect(deleteSpy).toHaveBeenCalledTimes(0)
  })
})
