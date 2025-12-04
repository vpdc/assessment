import Sinon, { SinonStub, stub } from 'sinon';
import fs from "fs";
import { getEnvValue } from '../../helpers/get-env';
import * as helper from '../../helpers/get-env';

describe("getEnvValue", () => {
  describe("getEnvValue", () => {

    beforeEach(() => {});
    afterEach(() => Sinon.restore());

    it("Should return the value if it's present in env", async () => {
      stub(process, "env").value({
        ...process.env,
        test: "Hello",
      });
      expect(await getEnvValue("test", "Default")).toEqual("Hello");
    });

    it("Should return the default value if there's no env variable", async () => {
      expect(await getEnvValue("test", "Default")).toEqual("Default");
    });
  });

  describe("getEnv", () => {
    beforeEach(() => {});
    afterEach(() => Sinon.restore());
    const obj = {
      address: "localhost:7233",
      namespace: "default",
      apiKey: undefined,
    };
    it("should give values to address and namespace", () => {
      stub(process, "env").value({
        ...process.env,
        TEMPORAL_ADDRESS: "localhost:8000",
        TEMPORAL_NAMESPACE: "test"
      });
      expect(helper.getEnv()).resolves.toEqual({
        address: "localhost:8000",
        namespace: "test",
        apiKey: undefined,
      });
    });

    it("should have all the fields", async () => {
      stub(process, "env").value({
        ...process.env,
        TEMPORAL_ADDRESS: "localhost:8000",
        TEMPORAL_NAMESPACE: "test",
        TEMPORAL_API_KEY: "test-key",
      });
      return expect(helper.getEnv()).resolves.toEqual({
        address: "localhost:8000",
        namespace: "test",
        apiKey: "test-key",
      });
    });
  });
});