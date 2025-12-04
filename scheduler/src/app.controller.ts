import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { AppService } from './app.service'
import type { SupabaseWebhookPayload } from 'vince-common'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async handleUserEvent(@Body() payload: SupabaseWebhookPayload<'users'>) {
    try {
      await this.appService.handleUserEvent(payload)
      return { status: 'ok' }
    } catch (error) {
      console.error(error)
      throw new BadRequestException({
        message: 'Unable to schedule user',
        errorCode: 'SCHEDULE_FAILED',
        payload,
      })
    }
  }
}
