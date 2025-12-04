import { proxyActivities, log, ActivityOptions, ApplicationFailure } from '@temporalio/workflow';
import type * as activities from '../activities/compose-greeting';
import type * as sharedSendMailActivities from '../../shared/activities/send_mail';
import { GreetingWorkflowPayload, SupabaseWriteWebhookPayload, Tables, UserSchema, WebhookPayloadType } from 'vince-common';
import { MailServicePayload } from '../../shared/types/mail.service.types';
import z from 'zod';

const defaultConfig: ActivityOptions = {
  startToCloseTimeout: '10 seconds',
  retry: {
    maximumInterval: '300 seconds',
  },
};
const { composeGreeting } = proxyActivities<typeof activities>(defaultConfig);
const { sendMail } = proxyActivities<typeof sharedSendMailActivities>(defaultConfig);

export async function greetingWorkflow(payload: GreetingWorkflowPayload<'users'>): Promise<SupabaseWriteWebhookPayload<'users'>> {
  const result = UserSchema.safeParse(payload.data.record);

  if (!result.success) {
    log.error('Error occured while validating user from GreetingWorkflowPayload', {
      error: z.treeifyError(result.error),
    });
    // Don't need to retry if it's an invalid input
    throw new ApplicationFailure('Input validation failed', 'InputValidationError', true);
  }

  const message = await composeGreeting(payload);

  const mailServicePayload: MailServicePayload = {
    type: payload.type,
    message,
  };
  const response = await sendMail(mailServicePayload);
  log.info('Successfully sent greeting');

  log.debug('Mail service json response', { response });

  return payload.data;
}
