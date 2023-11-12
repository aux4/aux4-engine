const CommandLineExecutor = require("../../lib/executor/CommandLineExecutor");

const Printer = require("../../lib/Printer");
const Interpreter = require("../../lib/Interpreter");
const ParameterInterpreter = require("../../lib/interpreter/ParameterInterpreter");
const Command = require("../../lib/Command");

const interpreter = new Interpreter();

describe("commandLineExecutor", () => {
  let commandLineExecutor, spyOnInterpreter, out;

  beforeEach(() => {
    out = {
      println: jest.fn()
    };

    Printer.on = jest.fn().mockReturnValue(out);

    commandLineExecutor = new CommandLineExecutor(interpreter);
    interpreter.add(new ParameterInterpreter());
    spyOnInterpreter = jest.spyOn(interpreter, "interpret");
  });

  describe("execute", () => {
    let action, args, result;

    describe("with error", () => {
      beforeEach(() => {
        Command.execute = jest.fn().mockImplementation(() => {
          throw new Error("test");
        });

        action = "mkdir $folder";
        args = [];
        parameters = { folder: "test" };
      });

      it("throws error", async () => {
        await expect(() => commandLineExecutor.execute({}, action, args, parameters)).rejects.toThrow();
      });
    });

    describe("without error", () => {
      beforeEach(async () => {
        Command.execute = jest.fn().mockReturnValue({
          stdout: "output message"
        });

        action = "mkdir $folder";
        args = [];
        parameters = { folder: "test" };

        result = await commandLineExecutor.execute({}, action, args, parameters);
      });

      it("should call interpret", () => {
        expect(interpreter.interpret).toHaveBeenCalledWith({}, action, args, parameters);
      });

      it("calls childProcess.exec", () => {
        expect(Command.execute).toHaveBeenCalledWith("mkdir test");
      });

      it("prints output message", () => {
        expect(out.println.mock.calls.length).toEqual(1);
        expect(out.println).toHaveBeenCalledWith("output message");
      });

      it("should add output in parameters as response", () => {
        expect(parameters.response).toEqual("output message");
      });

      it("returns true", () => {
        expect(result).toBeTruthy();
      });
    });

    describe("when command prefix is json:", () => {
      describe("with error", () => {
        beforeEach(() => {
          Command.execute = jest.fn().mockReturnValue({
            stdout: "{invalid json}"
          });

          action = "json:cat person.json";
          args = [];
          parameters = {};
        });

        it("throws error", async () => {
          await expect(() => commandLineExecutor.execute({}, action, args, parameters)).rejects.toThrow();
        });
      });

      describe("without error", () => {
        beforeEach(async () => {
          Command.execute = jest.fn().mockReturnValue({
            stdout: '{"name": "John"}'
          });

          action = "json:cat person.json";
          args = [];
          parameters = {};

          result = await commandLineExecutor.execute({}, action, args, parameters);
        });

        it("prints output message", () => {
          expect(out.println.mock.calls.length).toEqual(1);
          expect(out.println).toHaveBeenCalledWith('{"name": "John"}');
        });

        it("should add object person in parameters as response", () => {
          expect(parameters.response.name).toEqual("John");
        });

        it("returns true", () => {
          expect(result).toBeTruthy();
        });
      });
    });
  });
});
