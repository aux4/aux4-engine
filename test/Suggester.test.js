const Suggester = require("../lib/Suggester");
const out = require("../lib/Output");

describe("suggester", () => {
  let suggester, profile, commands;

  beforeEach(() => {
    jest.spyOn(process, "exit").mockImplementation(() => {
      return 127;
    });

    suggester = new Suggester();

    out.println = jest.fn();
    profile = {};
    commands = [
      {
        name: "cmd"
      }
    ];
    profile.commands = jest.fn().mockReturnValue(commands);
  });

  describe("suggest", () => {
    describe("with suggestion", () => {
      beforeEach(() => {
        suggester.suggest(profile, "c");
      });

      it("prints the suggestion", () => {
        expect(out.println.mock.calls[0][0]).toEqual("What did you mean:");
        expect(out.println.mock.calls[1][0]).toEqual("  - ", "cmd".bold);
      });
    });

    describe("without suggestion", () => {
      beforeEach(() => {
        suggester.suggest(profile, "x");
      });

      it('prints "command not found"', () => {
        expect(out.println).toHaveBeenCalledWith("Command not found: x");
      });
    });
  });
});
