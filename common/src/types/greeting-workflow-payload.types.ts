import type { SupabaseWriteWebhookPayload, TableName } from "../types/supabase-webhook-payload.types"

export enum GreetingWorkflowPayloadType {
  BIRTHDAY = 'Birthday',
  ANNIVERSARY = 'Anniversary'
}

export interface GreetingWorkflowPayload<T extends TableName> {
  type: GreetingWorkflowPayloadType
  data: SupabaseWriteWebhookPayload<T>
}