import { SupabaseClient } from "@supabase/supabase-js";
import { TablesInsert } from "vince-common";
import { faker } from "@faker-js/faker";

type UserInput = TablesInsert<"users">;

export async function handler(supabase: SupabaseClient) {
  try {
    const seed_count = 100;
    const users: UserInput[] = [];
    for (let i = 0; i < seed_count; i++) {
      const user: UserInput = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        birthday: faker.date
          .birthdate({ min: 18, max: 70, mode: "age" })
          .toISOString()
          .substring(0, 10), // YYYY-MM-DD
        timezone: faker.date.timeZone(), // global IANA TZ
      };
      users.push(user);
    }

    const { data, error } = await supabase.from("users").insert(users).select();

    if (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Function error:", error);

    // TODO: Handle errors later
    const message = error instanceof Error ? error.message : "Unknown error";

    return new Response(JSON.stringify({ error: message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
