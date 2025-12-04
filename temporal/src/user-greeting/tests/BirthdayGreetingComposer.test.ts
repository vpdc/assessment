import { User } from 'vince-common';
import { BirthdayGreetingComposer } from '../models/BirthdayGreetingComposer';

describe('BirthdayGreetingComposer', () => {
  it('Should greet the user properly', () => {
    const composer = new BirthdayGreetingComposer();
    const input = {
      first_name: 'Jake',
      last_name: 'Paul',
    };
    const user = new User(input as any);
    const message = composer.compose({ record: input } as any);
    expect(message).toBe(`Hey, ${user.fullName} it’s your birthday`);
  });
});
