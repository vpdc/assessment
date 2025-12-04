import axios, { AxiosResponse } from 'axios';
import { MailServicePayload } from '../types/mail.service.types';

export class MailService {
  constructor(protected endpoint: string) {}

  async send(payload: MailServicePayload): Promise<AxiosResponse> {
    return axios.post(this.endpoint, payload);
  }
}
