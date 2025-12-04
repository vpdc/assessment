import { countAnniversary } from "../helpers/count-anniversary"
import { DateTime } from 'luxon'
import { Model } from './Model'
import { Tables } from '../types/database.types'

export class User extends Model<Tables<'users'>> {

  get fullName(): string {
    return `${this.record.first_name} ${this.record.last_name}`
  }

  get birthDate(): DateTime {
    return DateTime.fromISO(this.record.birthday)
  }
  
  get joiningDate(): DateTime {
    return DateTime.fromISO(this.record.created_at)
  }

  get anniversaryOrdinal(): string {
    return countAnniversary(this.record.created_at)
  }

}