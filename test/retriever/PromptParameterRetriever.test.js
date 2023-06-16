const PromptParameterRetriever = require("../../lib/retriever/PromptParameterRetriever");
const readline = require("readline");
const out = require("../../lib/Output");
const cliSelect = require("cli-select-2");

jest.mock("cli-select-2");

describe("PromptParameterRetriever", () => {
  let promptParameterRetriever, command, parameters, name, value, rl;

  beforeEach(() => {
    rl = {
      question: jest.fn((question, callback) => callback("input")),
      close: jest.fn()
    };

    jest.spyOn(readline, "createInterface").mockImplementationOnce(() => {
      return rl;
    });

    out.println = jest.fn();

    promptParameterRetriever = new PromptParameterRetriever();
  });

  describe("lookup", () => {
    describe("given no command help", () => {
      beforeEach(async () => {
        command = {};
        parameters = {};
        name = "name";
        value = await promptParameterRetriever.lookup(command, parameters, name);
      });

      it("returns undefined", () => {
        expect(value).toBeUndefined();
      });
    });

    describe("given no command variables", () => {
      beforeEach(async () => {
        command = { help: {} };
        parameters = {};
        name = "name";
        value = await promptParameterRetriever.lookup(command, parameters, name);
      });

      it("returns undefined", () => {
        expect(value).toBeUndefined();
      });
    });

    describe("given empty variables", () => {
      beforeEach(async () => {
        command = { help: { variables: [] } };
        parameters = {};
        name = "name";
        value = await promptParameterRetriever.lookup(command, parameters, name);
      });

      it("returns undefined", () => {
        expect(value).toBeUndefined();
      });
    });

    describe("given variable with default value", () => {
      beforeEach(async () => {
        command = { help: { variables: [{ name: "name", default: "none" }] } };
        parameters = {};
        name = "name";
        value = await promptParameterRetriever.lookup(command, parameters, name);
      });

      it("returns undefined", () => {
        expect(value).toBeUndefined();
      });
    });

    describe("given variable with no default", () => {
      beforeEach(async () => {
        command = { help: { variables: [{ name: "name", text: "this is the name" }] } };
        parameters = {};
        name = "name";
        value = await promptParameterRetriever.lookup(command, parameters, name);
      });

      it("should call prompt", () => {
        expect(rl.question).toHaveBeenCalledWith(("text".bold + " [enter the text]: ").cyan, expect.anything());
      });

      it("should replace variable to the input value", () => {
        expect(value).toEqual("input");
      });
    });

    describe("given variable with options", () => {
      beforeEach(async () => {
        cliSelect.mockResolvedValue(new Promise(resolve => resolve({ value: "option2" })));

        command = {
          help: { variables: [{ name: "option", text: "choose the option", options: ["option1", "option2"] }] }
        };
        parameters = {};
        name = "option";
        value = await promptParameterRetriever.lookup(command, parameters, name);
      });

      it("should output the options", () => {
        expect(out.println).toHaveBeenCalledWith(("option".bold + " [choose the option]: ").cyan);
      });

      it("should call cli-select", () => {
        expect(cliSelect).toHaveBeenCalledWith({ values: ["option1", "option2"] });
      });

      it("should replace variable to the input value", () => {
        expect(value).toEqual("option2");
      });
    });
  });
});
