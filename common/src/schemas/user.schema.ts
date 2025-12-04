import { z } from "zod";

// IANA timezone validation
export const IanaTimezoneSchema = z.string().refine(
  (tz) => {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  },
  {
    message: "Invalid IANA timezone",
  }
);

export const UserSchema = z.strictObject({
  id: z.uuid().optional(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  birthday: z.iso.date(),
  timezone: IanaTimezoneSchema,
  created_at: z.iso.datetime({ offset: true }).optional(),
});
