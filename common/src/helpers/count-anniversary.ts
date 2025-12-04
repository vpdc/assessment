import { DateTime } from 'luxon'
import { convertNumberToOrdinals } from "./convert-number-to-ordinals"

// returns the ordinal format of the anniversary
export function countAnniversary(start: string | DateTime, end: DateTime = DateTime.now()): string {
  const startDate = typeof start === 'string' ? DateTime.fromISO(start) : start
  const duration = end.diff(startDate, 'years').years
  return convertNumberToOrdinals(Math.floor(duration))
}