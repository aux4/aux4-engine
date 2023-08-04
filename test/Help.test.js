const colors = require("colors");
const out = require("../lib/Output");

const Help = require("../lib/Help");

describe("help", () => {
  let help;

  beforeEach(() => {
    help = new Help();
  });

  describe("print", () => {
    let command;

    beforeEach(() => {
      out.println = jest.fn();

      command = {
        name: "cmd",
        help: {
          text: "this is the help description. sometimes when the description is super long it automatically breaks the line.\nSecond line."
        }
      };
    });

    describe("without help", () => {
      beforeEach(() => {
        help.print({ name: "main" });
      });

      it("prints message without description", () => {
        expect(out.println).toHaveBeenCalledWith("main".yellow, " ", "");
      });
    });

    describe("without length", () => {
      beforeEach(() => {
        help.print(command);
      });

      it("prints command help description", () => {
        expect(out.println).toHaveBeenCalledWith(
          command.name.yellow,
          " ",
          "this is the help description. sometimes when the description is super long it automatically breaks\n      the line.\n      Second line."
        );
      });
    });

    describe("with length", () => {
      beforeEach(() => {
        help.print(command, 8);
      });

      it("prints command help description", () => {
        expect(out.println).toHaveBeenCalledWith(
          ("     " + command.name).yellow,
          " ",
          "this is the help description. sometimes when the description is super long it automatically breaks\n           the line.\n           Second line."
        );
      });
    });

    describe("with variables", () => {
      beforeEach(() => {
        command.help["variables"] = [
          {
            name: "text",
            text: "Text parameter to be displayed",
            default: "echo",
            env: "TEXT"
          },
          {
            name: "test",
            text: "Test parameter to be displayed.\nSecond line.\nThird line."
          },
          {
            name: "name",
            env: "NAME"
          },
          {
            name: "size",
            text: "The size of the file",
            options: ["small", "medium", "large"]
          }
        ];

        help.print(command, 3);
      });

      it("prints the text variable", () => {
        expect(out.println.mock.calls[1][0]).toEqual("        -");
        expect(out.println.mock.calls[1][1]).toEqual(command.help.variables[0].name.cyan);
        expect(out.println.mock.calls[1][2]).toEqual(`[env: ${command.help.variables[0].env.green.italic}]`);
        expect(out.println.mock.calls[1][3]).toEqual(`[${command.help.variables[0].default.italic}]`);
        expect(out.println.mock.calls[1][4]).toEqual(command.help.variables[0].text);
      });

      it("prints the test variable", () => {
        expect(out.println.mock.calls[2][0]).toEqual("        -");
        expect(out.println.mock.calls[2][1]).toEqual(command.help.variables[1].name.cyan);
        expect(out.println.mock.calls[2][2]).toEqual("");
        expect(out.println.mock.calls[2][3]).toEqual("");
        expect(out.println.mock.calls[2][4]).toEqual(
          "Test parameter to be displayed.\n          Second line.\n          Third line."
        );
      });

      it("prints the name variable", () => {
        expect(out.println.mock.calls[3][0]).toEqual("        -");
        expect(out.println.mock.calls[3][1]).toEqual(command.help.variables[2].name.cyan);
        expect(out.println.mock.calls[3][2]).toEqual(`[env: ${command.help.variables[2].env.green.italic}]`);
        expect(out.println.mock.calls[3][3]).toEqual("");
        expect(out.println.mock.calls[3][4]).toEqual("");
      });

      it("prints the size variable", () => {
        expect(out.println.mock.calls[4][0]).toEqual("        -");
        expect(out.println.mock.calls[4][1]).toEqual(command.help.variables[3].name.cyan);
        expect(out.println.mock.calls[4][2]).toEqual("");
        expect(out.println.mock.calls[4][3]).toEqual("");
        expect(out.println.mock.calls[4][4]).toEqual(command.help.variables[3].text);
        expect(out.println.mock.calls[5][0]).toEqual(`          * ${"small".green}
          * ${"medium".green}
          * ${"large".green}`);
      });
    });
  });
});
