// placing this file outside the project folder cause bugs in typescript inference
import type { Database, Tables } from './database.types';

// TODO: replace RowOf with Tables<T>
// as well as others with TablesInsert<'users'>, TablesUpdate<'users'>
export type TableName = keyof Database['public']['Tables'];

export enum WebhookPayloadType {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface SupabaseInsertWebhook<T extends TableName = TableName> {
  type: WebhookPayloadType.INSERT;
  table: T;
  schema: string;
  record: Tables<T>;
  old_record: null;
}

export interface SupabaseUpdateWebhook<T extends TableName = TableName> {
  type: WebhookPayloadType.UPDATE;
  table: T;
  schema: string;
  record: Tables<T>;
  old_record: Tables<T>;
}

export interface SupabaseDeleteWebhook<T extends TableName = TableName> {
  type: WebhookPayloadType.DELETE;
  table: T;
  schema: string;
  record: null;
  old_record: Tables<T>;
}

export type SupabaseWriteWebhookPayload<T extends TableName = TableName> = 
  | SupabaseInsertWebhook<T>
  | SupabaseUpdateWebhook<T>

export type SupabaseWebhookPayload<T extends TableName = TableName> =
  | SupabaseWriteWebhookPayload<T>
  | SupabaseDeleteWebhook<T>;
