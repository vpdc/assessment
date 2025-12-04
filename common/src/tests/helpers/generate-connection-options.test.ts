import { stub, restore } from "sinon";
import * as helper from '../../helpers/get-env';
import { generateConnectionOptions } from '../../helpers/generate-connection-options';

describe("generateConnectionOptions", () => {
  afterEach(() => {
    restore()
  });

  it("should configure API key auth when apiKey is provided and no clientCert/clientKey", async () => {
    stub(helper, "getEnv").resolves({
      address: "localhost:7233",
      namespace: "test-namespace",
      apiKey: "test-api-key",
    });

    const result = await generateConnectionOptions();

    expect(result).toEqual({
      address: "localhost:7233",
      tls: true,
      apiKey: "test-api-key",
      metadata: {
        "temporal-namespace": "test-namespace",
      },
    });
  });

  it("should disable TLS when no certificates or API key are provided", async () => {
    stub(helper, "getEnv").resolves({
      address: "localhost:7233",
      namespace: "test-namespace",
      apiKey: undefined,
    });

    const result = await generateConnectionOptions();

    expect(result).toEqual({
      address: "localhost:7233",
      tls: false,
    });
  });
});
