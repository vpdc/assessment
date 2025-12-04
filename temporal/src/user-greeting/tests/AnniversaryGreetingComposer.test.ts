import { User } from 'vince-common';
import { AnniversaryGreetingComposer } from '../models/AnniversaryGreetingComposer';
import { DateTime } from 'luxon';

describe('AnniversaryGreetingComposer', () => {
  it('Should greet the user properly', () => {
    const composer = new AnniversaryGreetingComposer();
    const input = {
      first_name: 'Jake',
      last_name: 'Paul',
      created_at: DateTime.now().minus({ years: 5 })
    };

    const user = new User(input as any);
    const message = composer.compose({ record: input } as any);
    expect(message).toBe(`Hey, ${user.fullName} it’s your ${user.anniversaryOrdinal} anniversary with us`);
  });
});
