const EnvironmentVariableParameterRetriever = require("../../lib/retriever/EnvironmentVariableParameterRetriever");

describe("EnvironmentVariableParameterRetriever", () => {
  let environmentVariableParameterRetriever, command, parameters, name, value;

  beforeEach(() => {
    environmentVariableParameterRetriever = new EnvironmentVariableParameterRetriever();
  });

  describe("lookup", () => {
    describe("given no help", () => {
      beforeEach(async () => {
        command = {};
        parameters = {};
        name = "name";

        value = await environmentVariableParameterRetriever.lookup(command, parameters, name);
      });

      it("should return undefined", () => {
        expect(value).toBeUndefined();
      });
    });

    describe("given no variables", () => {
      beforeEach(async () => {
        command = { help: {} };
        parameters = {};
        name = "name";

        value = await environmentVariableParameterRetriever.lookup(command, parameters, name);
      });

      it("should return undefined", () => {
        expect(value).toBeUndefined();
      });
    });

    describe("given missing variable", () => {
      beforeEach(async () => {
        command = { help: { variables: [{ name: "other" }] } };
        parameters = {};
        name = "name";

        value = await environmentVariableParameterRetriever.lookup(command, parameters, name);
      });

      it("should return undefined", () => {
        expect(value).toBeUndefined();
      });
    });

    describe("given variable", () => {
      beforeEach(async () => {
        command = { help: { variables: [{ name: "name", env: "ENV" }] } };
        parameters = {};
        name = "name";

        value = await environmentVariableParameterRetriever.lookup(command, parameters, name);
      });

      it("should return undefined", () => {
        expect(value).toBeUndefined();
      });
    });

    describe("given variable with environment variable", () => {
      beforeEach(async () => {
        command = { help: { variables: [{ name: "name", env: "ENV" }] } };
        parameters = {};
        name = "name";
        process.env.ENV = "value";

        value = await environmentVariableParameterRetriever.lookup(command, parameters, name);
      });

      it("should return value", () => {
        expect(value).toEqual("value");
      });
    });
  });
});
