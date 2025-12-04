import { IanaTimezoneSchema, UserSchema } from '../../schemas/user.schema'
import crypto from 'crypto' // Node.js crypto

describe('IanaTimezoneSchema', () => {
  it('valid timezone: Asia/Manila', () => {
    expect(() => IanaTimezoneSchema.parse('Asia/Manila')).not.toThrow()
  })

  it('valid timezone: UTC', () => {
    expect(() => IanaTimezoneSchema.parse('UTC')).not.toThrow()
  })

  it('valid timezone: case-insensitive', () => {
    expect(() => IanaTimezoneSchema.parse('asia/manila')).not.toThrow()
  })

  it('invalid timezone: empty string', () => {
    expect(() => IanaTimezoneSchema.parse('')).toThrow('Invalid IANA timezone')
  })

  it('invalid timezone: random string', () => {
    expect(() => IanaTimezoneSchema.parse('Not/ARealTimezone')).toThrow(
      'Invalid IANA timezone',
    )
  })

  it('invalid timezone: numeric string', () => {
    expect(() => IanaTimezoneSchema.parse('123')).toThrow(
      'Invalid IANA timezone',
    )
  })

  it('invalid timezone: null', () => {
    expect(() => IanaTimezoneSchema.parse(null as any)).toThrow()
  })
})

describe('UserSchema', () => {
  const validUser = {
    id: crypto.randomUUID(),
    first_name: 'John',
    last_name: 'Doe',
    birthday: '1990-01-01',
    timezone: 'Asia/Manila',
    created_at: '2024-01-01T10:00:00Z',
  }

  it('valid user passes', () => {
    expect(() => UserSchema.parse(validUser)).not.toThrow()
  })

  it('first_name missing should fail', () => {
    const { first_name, ...userWithoutFirstName } = validUser
    expect(() => UserSchema.parse(userWithoutFirstName)).toThrow()
  })

  it('first_name empty should fail', () => {
    const userWithEmptyFirstName = { ...validUser, first_name: '' }
    expect(() => UserSchema.parse(userWithEmptyFirstName)).toThrow()
  })

  it('last_name missing should fail', () => {
    const { last_name, ...userWithoutLastName } = validUser
    expect(() => UserSchema.parse(userWithoutLastName)).toThrow()
  })

  it('last_name empty should fail', () => {
    const userWithEmptyLastName = { ...validUser, last_name: '' }
    expect(() => UserSchema.parse(userWithEmptyLastName)).toThrow()
  })

  it('valid ISO date passes', () => {
    const userWithValidBirthday = { ...validUser, birthday: '2000-12-31' }
    expect(() => UserSchema.parse(userWithValidBirthday)).not.toThrow()
  })

  it('valid created_at: ISO datetime with offset passes', () => {
    const user = { ...validUser, created_at: '2025-12-03T12:41:18.227363+00:00' }
    expect(() => UserSchema.parse(user)).not.toThrow()
  })

  it('invalid birthday: non-date string', () => {
    const userWithInvalidBirthday = { ...validUser, birthday: 'abc' }
    expect(() => UserSchema.parse(userWithInvalidBirthday)).toThrow()
  })

  it('invalid birthday: full ISO datetime instead of date', () => {
    const userWithFullIsoDatetime = {
      ...validUser,
      birthday: '2024-01-01T10:00:00Z',
    }
    expect(() => UserSchema.parse(userWithFullIsoDatetime)).toThrow()
  })

  it('invalid birthday: empty string', () => {
    const userWithEmptyBirthday = { ...validUser, birthday: '' }
    expect(() => UserSchema.parse(userWithEmptyBirthday)).toThrow()
  })

  it('invalid timezone should fail', () => {
    const userWithInvalidTimezone = { ...validUser, timezone: 'Fake/Zone' }
    expect(() => UserSchema.parse(userWithInvalidTimezone)).toThrow(
      'Invalid IANA timezone',
    )
  })

  it('empty timezone should fail', () => {
    const userWithEmptyTimezone = { ...validUser, timezone: '' }
    expect(() => UserSchema.parse(userWithEmptyTimezone)).toThrow(
      'Invalid IANA timezone',
    )
  })

  it('optional id: missing is OK', () => {
    const { id, ...userWithoutId } = validUser
    expect(() => UserSchema.parse(userWithoutId)).not.toThrow()
  })

  it('invalid id should fail', () => {
    const userWithInvalidId = { ...validUser, id: 'not-a-uuid' }
    expect(() => UserSchema.parse(userWithInvalidId)).toThrow()
  })

  it('created_at optional: missing is OK', () => {
    const { created_at, ...userWithoutCreatedAt } = validUser
    expect(() => UserSchema.parse(userWithoutCreatedAt)).not.toThrow()
  })

  it('created_at invalid datetime', () => {
    const userWithInvalidCreatedAt = { ...validUser, created_at: 'not-a-date' }
    expect(() => UserSchema.parse(userWithInvalidCreatedAt)).toThrow()
  })

  it('created_at must be ISO datetime', () => {
    const userWithInvalidCreatedAt = { ...validUser, created_at: '2024-01-01' }
    expect(() => UserSchema.parse(userWithInvalidCreatedAt)).toThrow()
  })

  it('extra fields should fail (strict mode)', () => {
    const userWithExtraField = { ...validUser, extra: 123 }
    expect(() => UserSchema.parse(userWithExtraField)).toThrow()
  })
})
