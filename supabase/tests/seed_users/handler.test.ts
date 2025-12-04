// handler.test.ts
import { assertEquals, assert, assertThrows } from "@std/assert";
import { stub, Stub, restore } from "@std/testing/mock";
import { describe, it, afterEach } from "@std/testing/bdd";
import { handler } from "../../functions/seed_users/handler.ts";

describe("seed_users", () => {
  describe("success", () => {
    afterEach(() => {
      restore();
    });

    it("should return 200 with data inserted on success", async () => {
      // Mock the supabase client
      const mockSupabase = {
        from: (_table: string) => ({
          insert: (_rows: any) => ({
            select: async () => ({ data: [], error: null }),
          }),
        }),
      };

      const response = await handler(mockSupabase as any);
      const json = await response.json();

      assertEquals(response.status, 200);
    });

    it("should create 100 users successfully", async () => {
      // Mock the supabase client
      const mockSupabase = {
        from: (_table: string) => ({
          insert: (_rows: any) => ({
            select: async () => ({ data: _rows, error: null }),
          }),
        }),
      };

      const response = await handler(mockSupabase as any);
      const json = await response.json();

      assertEquals(json.length, 100);
    });
  });
  describe("error", () => {
    afterEach(() => {
      restore();
    });

    it("should return 500 when supabase operation returns error", async () => {
      const mockSupabase = {
        from: (_table: string) => ({
          insert: (_rows: any) => ({
            select: async () => {
              throw new Error("Something weird happen");
            },
          }),
        }),
      };
      stub(console, "error", () => {});
      
      const response = await handler(mockSupabase as any);

      assertEquals(response.status, 500);
    });

    it("should return 500 when supabase operation returns non-error errors", async () => {
      const mockSupabase = {
        from: (_table: string) => ({
          insert: (_rows: any) => ({
            select: async () => {
              throw "oops";
            },
          }),
        }),
      };
      stub(console, "error", () => {});

      const response = await handler(mockSupabase as any);

      assertEquals(response.status, 500);
    });

    it("should return 500 if an exception is thrown", async () => {
      const mockSupabase = {
        from: (_table: string) => ({
          insert: (_rows: any) => {
            throw new Error("Something went down");
          },
        }),
      };
      stub(console, "error", () => {});
      const response = await handler(mockSupabase as any);

      assertEquals(response.status, 500);
    });

    it("should return 500 if an error is returned from db operation", async () => {
      const mockSupabase = {
        from: (_table: string) => ({
          insert: (_rows: any) => ({
            select: async () => ({ error: Error("something went wrong") }),
          }),
        }),
      };
      stub(console, "error", () => {});
      const response = await handler(mockSupabase as any);

      assertEquals(response.status, 500);
    });
  });
});
