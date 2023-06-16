const DefaultParameterRetriever = require("../../lib/retriever/DefaultParameterRetriever");

describe("DefaultParameterRetriever", () => {
  let defaultParameterRetriever, command, parameters, name, value;

  beforeEach(() => {
    defaultParameterRetriever = new DefaultParameterRetriever();
  });

  describe("lookup", () => {
    describe("given no help", () => {
      beforeEach(async () => {
        command = {};
        parameters = {};
        name = "name";

        value = await defaultParameterRetriever.lookup(command, parameters, name);
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

        value = await defaultParameterRetriever.lookup(command, parameters, name);
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

        value = await defaultParameterRetriever.lookup(command, parameters, name);
      });

      it("should return undefined", () => {
        expect(value).toBeUndefined();
      });
    });

    describe("given variable", () => {
      beforeEach(async () => {
        command = { help: { variables: [{ name: "name", default: "none" }] } };
        parameters = {};
        name = "name";

        value = await defaultParameterRetriever.lookup(command, parameters, name);
      });

      it("should return the default value", () => {
        expect(value).toEqual("none");
      });
    });
  });
});
