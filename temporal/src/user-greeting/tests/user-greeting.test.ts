import { TestWorkflowEnvironment } from '@temporalio/testing';
import { GreetingWorkflowPayload, GreetingWorkflowPayloadType, WebhookPayloadType } from 'vince-common';
import * as activities from '../activities/compose-greeting';
import * as sharedSendMailActivities from '../../shared/activities/send_mail';
import { DefaultLogger, LogLevel, Runtime, Worker } from '@temporalio/worker';
import { MailServicePayload } from '../../shared/types/mail.service.types';
import { greetingWorkflow } from '../workflows/user-greeting';
import { WorkflowCoverage } from '@temporalio/nyc-test-coverage';
import axios from 'axios';

describe('User greeting workflow', () => {
  let env: TestWorkflowEnvironment;
  const allActivities = {
    ...activities,
    ...sharedSendMailActivities,
  };

  const payload: GreetingWorkflowPayload<'users'> = {
    type: GreetingWorkflowPayloadType.BIRTHDAY,
    data: {
      type: WebhookPayloadType.INSERT,
      table: 'users',
      record: {
        id: '0de3afd6-d77f-473a-85d7-907d9b7baf6b',
        first_name: 'Melody',
        last_name: 'Raynor',
        birthday: '1971-04-13',
        timezone: 'Atlantic/St_Helena',
        created_at: '2025-12-03T12:41:18.227363+00:00',
      },
      schema: 'public',
      old_record: null,
    },
  };

  beforeAll(() => {});
  afterAll(() => {
  });
  beforeEach(async () => {
    env = await TestWorkflowEnvironment.createTimeSkipping();
  }, 10_000);
  afterEach(async () => {
    await env?.teardown();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  }, 10_000);

  it('Should successfully send out the birthday greeting', async () => {
    const { client, nativeConnection } = env;
    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue: 'test',
      workflowsPath: require.resolve('../workflows/user-greeting'),
      activities: {
        ...allActivities,
      },
    });
    jest.spyOn(axios, 'post').mockImplementation(async () => ({ data: payload.data }));
    const result = await worker.runUntil(
      client.workflow.execute(greetingWorkflow, {
        args: [payload],
        workflowId: 'test',
        taskQueue: 'test',
      }),
    );
    expect(result).toStrictEqual(payload.data);
  });

  it('Should fail to send out with invalid user payload', async () => {
    const { client, nativeConnection } = env;
    const newPayload = {
      ...payload,
      data: {
        ...payload.data,
        record: {
          id: 1,
        },
      },
    };
    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue: 'test',
      workflowsPath: require.resolve('../workflows/user-greeting'),
      activities: {
        ...allActivities,
      },
    });
    jest.spyOn(axios, 'post').mockImplementation(async () => ({ data: payload.data }));
    await expect(
      worker.runUntil(
        client.workflow.execute(greetingWorkflow, {
          args: [newPayload as any],
          workflowId: 'test',
          taskQueue: 'test',
        }),
      ),
    ).rejects.toThrow('Workflow execution failed');
  });

  it('Should fail to send out with invalid payload type', async () => {
    const { client, nativeConnection } = env;
    const newPayload = {
      ...payload,
      type: 'random'
    }
    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue: 'test',
      workflowsPath: require.resolve('../workflows/user-greeting'),
      activities: {
        ...allActivities,
      },
    });
    jest.spyOn(axios, 'post').mockImplementation(async () => ({ data: payload.data }));
    await expect(
      worker.runUntil(
        client.workflow.execute(greetingWorkflow, {
          args: [newPayload as any],
          workflowId: 'test',
          taskQueue: 'test',
        }),
      ),
    ).rejects.toThrow('Workflow execution failed');
  });
});
