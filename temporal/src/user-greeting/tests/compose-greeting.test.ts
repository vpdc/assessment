import { GreetingWorkflowPayload, GreetingWorkflowPayloadType, WebhookPayloadType } from 'vince-common';
import { composeGreeting } from '../activities/compose-greeting';
import { BirthdayGreetingComposer } from '../models/BirthdayGreetingComposer';
import { AnniversaryGreetingComposer } from '../models/AnniversaryGreetingComposer';
import { MockActivityEnvironment } from '@temporalio/testing';

describe('Compose greeting activity', () => {
  const env = new MockActivityEnvironment({ attempt: 5 });
  const payload: GreetingWorkflowPayload<'users'> = {
    type: GreetingWorkflowPayloadType.BIRTHDAY,
    data: {
      type: WebhookPayloadType.INSERT,
      table: 'users',
      record: {
        id: '394dcd8e-4ad8-43c1-9b90-019d4e15bfe0',
        birthday: '1959-08-03',
        timezone: 'America/Managua',
        last_name: 'Jerde',
        created_at: '2025-12-03T06:55:21.984632+00:00',
        first_name: 'Garrison',
      },
      schema: 'public',
      old_record: null,
    },
  };

  beforeEach(() => {
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
  it('should compose a birthday greeting', async () => {
    const composer = new BirthdayGreetingComposer();
    const message = composer.compose(payload.data);
    const result = await env.run(composeGreeting, payload);
    expect(result).toBe(message);
  });

  it('should compose anniversary greeting', async () => {
    payload.type = GreetingWorkflowPayloadType.ANNIVERSARY;
    const composer = new AnniversaryGreetingComposer();
    const message = composer.compose(payload.data);
    const result = await env.run(composeGreeting, payload);
    expect(result).toBe(message);
  });

  it('should ignore unsupported greetings', async () => {
    const newPayload = {
      ...payload,
      type: 'random'
    }
    await expect(env.run(composeGreeting, newPayload as any)).rejects.toThrow(`Type (${newPayload.type}) unsupported`);
  });
});
