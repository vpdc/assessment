import { GreetingWorkflowPayload, GreetingWorkflowPayloadType } from 'vince-common';
import { BirthdayGreetingComposer } from '../models/BirthdayGreetingComposer';
import { AnniversaryGreetingComposer } from '../models/AnniversaryGreetingComposer';
import { ApplicationFailure } from '@temporalio/activity';

const birthdayGreetingComposer = new BirthdayGreetingComposer();
const anniversaryGreetingComposer = new AnniversaryGreetingComposer();

export async function composeGreeting(workflowPayload: GreetingWorkflowPayload<'users'>): Promise<string> {
  const { type, data } = workflowPayload;
  switch (type) {
    case GreetingWorkflowPayloadType.ANNIVERSARY: {
      return anniversaryGreetingComposer.compose(data);
    }
    case GreetingWorkflowPayloadType.BIRTHDAY: {
      return birthdayGreetingComposer.compose(data);
    }
    default: {
      throw new ApplicationFailure(`Type (${type}) unsupported`, 'UnknownGreetingWorkflowPayloadType', true);
    }
  }
}
