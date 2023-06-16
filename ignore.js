const colors = require("colors");
const Stream = require("stream");
const readline = require("readline");
const cliSelect = require("cli-select-2");
const PromptInterpreter = require("../../lib/interpreter/PromptInterpreter");
const out = require("./lib/Output");

jest.mock("cli-select-2");

const promptInterpreter = new PromptInterpreter();

describe("promptInterpreter", () => {
  let rl;

  beforeEach(() => {
    rl = {
      question: jest.fn(() => Promise.resolve("input")),
      close: jest.fn()
    };

    jest.spyOn(readline, "createInterface").mockImplementationOnce(() => {
      return rl;
    });
  });

  describe("interpret", () => {
    let result, command, args, parameters;

    beforeEach(() => {
      inputStream = Stream.Readable.from("");
      outputStream = new Stream.Writable();

      command = {
        value: "command",
        help: {
          variables: [
            {
              name: "name"
            },
            {
              name: "default",
              default: "the default value",
              text: "enter the default"
            },
            {
              name: "text",
              text: "enter the text"
            },
            {
              name: "emptyDefault",
              default: "",
              text: "enter the empty default"
            },
            {
              name: "option",
              text: "choose the option",
              options: ["option1", "option2"]
            }
          ]
        }
      };

      out.println = jest.fn();
    });

    describe("without command help", () => {
      beforeEach(async () => {
        args = [];
        parameters = {};
        result = await promptInterpreter.interpret({}, "mkdir ${folder}", args, parameters);
      });

      it("does not replace the variable", () => {
        expect(result).toEqual("mkdir ${folder}");
      });
    });

    describe("without command help variables", () => {
      beforeEach(async () => {
        args = [];
        parameters = {};
        result = await promptInterpreter.interpret({ help: {} }, "mkdir ${folder}", args, parameters);
      });

      it("does not replace the variable", () => {
        expect(result).toEqual("mkdir ${folder}");
      });
    });

    describe("without variables", () => {
      beforeEach(async () => {
        args = [];
        parameters = {};
        result = await promptInterpreter.interpret(command, "mkdir test", args, parameters);
      });

      it("does not replace the variable", () => {
        expect(result).toEqual("mkdir test");
      });
    });

    describe("with not expected variable", () => {
      beforeEach(async () => {
        args = [];
        parameters = {};
        result = await promptInterpreter.interpret(command, "mkdir ${folder}", args, parameters);
      });

      it("does not replace the variable", () => {
        expect(result).toEqual("mkdir ${folder}");
      });
    });

    describe("with variable without help text", () => {
      beforeEach(async () => {
        args = [];
        parameters = {};
        result = await promptInterpreter.interpret(command, "echo ${name}", args, parameters);
      });

      it("should call prompt", () => {
        expect(rl.question).toHaveBeenCalledWith(("name".bold + ": ").cyan);
      });

      it("should replace variable to the input value", () => {
        expect(result).toEqual("echo input");
      });
    });

    describe("with expected variable", () => {
      beforeEach(async () => {
        args = [];
        parameters = {};
        result = await promptInterpreter.interpret(command, "echo ${text}", args, parameters);
      });

      it("should call prompt", () => {
        expect(rl.question).toHaveBeenCalledWith(("text".bold + " [enter the text]: ").cyan);
      });

      it("should replace variable to the input value", () => {
        expect(result).toEqual("echo input");
      });

      it("should set variable in the parameters", () => {
        expect(parameters["text"]).toEqual("input");
      });
    });

    describe("with expected hidden variable", () => {
      beforeEach(async () => {
        command.help.variables[2].hide = true;

        args = [];
        parameters = {};
        result = await promptInterpreter.interpret(command, "echo ${text}", args, parameters);
      });

      it("should call prompt", () => {
        expect(rl.question).toHaveBeenCalledWith(("text".bold + " [enter the text]: ").cyan);
      });

      it("should replace variable to the input value", () => {
        expect(result).toEqual("echo input");
      });

      it("should set variable in the parameters", () => {
        expect(parameters["text"]).toEqual("input");
      });
    });

    describe("with expected variable and default value", () => {
      beforeEach(async () => {
        rl.question = jest.fn(() => Promise.resolve("input"));

        args = [];
        parameters = {};
        result = await promptInterpreter.interpret(command, "echo ${default}", args, parameters);
      });

      it("should not call prompt", () => {
        expect(rl.question).not.toHaveBeenCalled();
      });

      it("does not replace the variable", () => {
        expect(result).toEqual("echo ${default}");
      });
    });

    describe("with expected variable and default is empty", () => {
      describe("with options", () => {
        beforeEach(async () => {
          cliSelect.mockResolvedValue(new Promise(resolve => resolve({ value: "option2" })));

          args = [];
          parameters = {};
          result = await promptInterpreter.interpret(command, "echo ${option}", args, parameters);
        });

        it("should output the options", () => {
          expect(out.println).toHaveBeenCalledWith(("option".bold + " [choose the option]: ").cyan);
        });

        it("should call cli-select", () => {
          expect(cliSelect).toHaveBeenCalledWith({ values: ["option1", "option2"] });
        });

        it("should replace variable to the input value", () => {
          expect(result).toEqual("echo option2");
        });
      });

      describe("with no options", () => {
        beforeEach(async () => {
          rl.question = jest.fn(() => "input");

          args = [];
          parameters = {};
          result = await promptInterpreter.interpret(command, "echo ${emptyDefault}", args, parameters);
        });

        it("should not call prompt", () => {
          expect(rl.question).not.toHaveBeenCalled();
        });

        it("does not replace the variable", () => {
          expect(result).toEqual("echo ${emptyDefault}");
        });
      });
    });
  });
});
