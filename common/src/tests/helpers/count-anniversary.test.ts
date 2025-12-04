import { DateTime } from 'luxon';
import { countAnniversary } from '../../helpers/count-anniversary';

describe("countAnniversary", () => {
  describe("Correct", () => {
    const outcomes = new Map([
      [
        {
          start: DateTime.fromISO("2024-01-01"),
          end: DateTime.fromISO("2025-03-01"),
        },
        "1st",
      ],
      [
        {
          start: DateTime.fromISO("2024-01-01"),
          end: DateTime.fromISO("2026-01-01"),
        },
        "2nd",
      ],
      [
        {
          start: DateTime.fromISO("2024-01-01"),
          end: DateTime.fromISO("2027-01-01"),
        },
        "3rd",
      ],
      [
        {
          start: DateTime.fromISO("2024-01-01"),
          end: DateTime.fromISO("2124-01-01"),
        },
        "100th",
      ],
      [
        {
          start: "2024-01-01", // works with string inputs
          end: DateTime.fromISO("2124-01-01"),
        },
        "100th",
      ],
      [
        {
          // also ensured as integer
          start: DateTime.now().minus({ years: 1.2 }), // end date defaults to now
        },
        "1st",
      ],
    ]);

    for (const [config, ordinal] of outcomes) {
      it(`Should count as ${ordinal} anniversary`, () => {
        expect(countAnniversary(config.start, config.end)).toEqual(ordinal);
      });
    }
  });

  describe("Wrong", () => {
    const outcomes = new Map([
      [
        {
          start: DateTime.fromISO("2024-01-01"),
          end: DateTime.fromISO("2025-10-01"),
        },
        "2nd",
      ],
      [
        {
          start: DateTime.now().minus({ years: 11.99 }),
        },
        "2nd",
      ],
    ]);

    for (const [config, ordinal] of outcomes) {
      it(`Should not count as ${ordinal} anniversary`, () => {
        expect(countAnniversary(config.start, config.end)).not.toEqual(ordinal);
      });
    }
  });
});
