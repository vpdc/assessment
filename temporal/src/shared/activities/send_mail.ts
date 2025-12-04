import { MailService } from '../services/mail.service';
import { MailServicePayload } from '../types/mail.service.types';
import { SupabaseWriteWebhookPayload } from 'vince-common';

const mailService = new MailService(process.env.MAIL_SERVICE_ENDPOINT!);

export async function sendMail(payload: MailServicePayload): Promise<SupabaseWriteWebhookPayload<'users'>> {
  const response = await mailService.send(payload);
  return response.data
}
