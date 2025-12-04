import type { ConnectionOptions } from "@temporalio/client";
import { getEnv } from "./get-env";

export async function generateConnectionOptions(): Promise<ConnectionOptions> {
  const { address, namespace, apiKey } = await getEnv();

  const connectionOptions: ConnectionOptions = {
    address,
  };

  // Configure mTLS authentication if certificates are provided
  if (apiKey) {
    // Configure API key authentication
    connectionOptions.tls = true;
    connectionOptions.apiKey = apiKey;
    connectionOptions.metadata = {
      "temporal-namespace": namespace,
    };
  } else {
    // No authentication
    connectionOptions.tls = false;
  }

  return connectionOptions;
}
