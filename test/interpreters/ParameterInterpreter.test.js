const ParameterInterpreter = require("../../lib/interpreter/ParameterInterpreter");
const CommandParameters = require("../../lib/CommandParameters");
const parameterInterpreter = new ParameterInterpreter();

describe("parameterInterpreter", () => {
  describe("interpret", () => {
    let result, command, args, parameters, commandParameters;

    beforeEach(() => {
      command = {};
    });

    describe("without variables", () => {
      beforeEach(async () => {
        args = [];
        parameters = {};
        commandParameters = CommandParameters.newInstance().create(command, parameters);
        result = await parameterInterpreter.interpret(command, "mkdir test", args, commandParameters);
      });

      it("does not replace the text", () => {
        expect(result).toEqual("mkdir test");
      });
    });

    describe("with variable and no parameter", () => {
      beforeEach(async () => {
        args = [];
        parameters = {};
        commandParameters = CommandParameters.newInstance().create(command, parameters);
        result = await parameterInterpreter.interpret(command, "echo ${name}", args, commandParameters);
      });

      it("does not replace the variable", () => {
        expect(result).toEqual("echo ${name}");
      });
    });

    describe("with variable and parameter", () => {
      beforeEach(async () => {
        args = [];
        parameters = { name: "John" };
        commandParameters = CommandParameters.newInstance().create(command, parameters);
        result = await parameterInterpreter.interpret(command, "echo ${name}", args, commandParameters);
      });

      it("replaces the variable", () => {
        expect(result).toEqual("echo John");
      });
    });

    describe("with multiple variables and parameters", () => {
      beforeEach(async () => {
        args = [];
        parameters = { firstName: "John", lastName: "Doe" };
        commandParameters = CommandParameters.newInstance().create(command, parameters);
        result = await parameterInterpreter.interpret(command, "echo $firstName $lastName", args, commandParameters);
      });

      it("replaces the variable", () => {
        expect(result).toEqual("echo John Doe");
      });
    });
  });
});
