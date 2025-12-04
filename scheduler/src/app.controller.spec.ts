import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import * as handlerWrapper from './handle-user-event/handler'

describe('AppController', () => {
  let appController: AppController
  let handlerSpy: jest.SpyInstance

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()
    handlerSpy = jest
      .spyOn(handlerWrapper, 'handler')
      .mockImplementation(async () => {})
    appController = app.get<AppController>(AppController)
  })

  it('Should return status ok', async () => {
    const payload = {} as any
    await expect(appController.handleUserEvent(payload)).resolves.toStrictEqual(
      { status: 'ok' },
    )
  })

  it('should fail if handler yields an error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    handlerSpy.mockImplementation(async () => {
      throw new Error('Something went wrong')
    })
    const payload = {} as any
    await expect(appController.handleUserEvent(payload)).rejects.toThrow(
      'Unable to schedule user',
    )
  })
})
