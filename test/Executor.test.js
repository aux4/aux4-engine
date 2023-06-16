const Config = require("../lib/Config");
const ExecutorChain = require("../lib/ExecutorChain");
const Help = require("../lib/Help");
const out = require("../lib/Output");
const Suggester = require("../lib/Suggester");

const Executor = require("../lib/Executor");

const config = new Config();
const executorChain = new ExecutorChain();

describe("executor", () => {
  let executor, configProfiles, suggester, help;
  beforeEach(() => {
    suggester = new Suggester();
    help = new Help();
    out.println = jest.fn();

    configProfiles = {
      profiles: [
        {
          name: "firstProfile",
          commands: [
            {
              name: "cmd",
              execute: ["mkdir first", "cd first"]
            }
          ]
        },
        {
          name: "secondProfile",
          commands: [
            {
              name: "cmd",
              execute: ["mkdir second", "cd second"]
            },
            {
              name: "cmd2",
              execute: ["mkdir second2", "cd second2"]
            },
            {
              name: "t",
              execute: ["mkdir t", "cd t"]
            }
          ]
        }
      ]
    };

    config.get = jest.fn().mockReturnValue(configProfiles);
    executor = new Executor(config, executorChain, suggester);
  });

  describe("initialize executor", () => {
    it("calls config get", () => {
      expect(config.get).toHaveBeenCalled();
    });

    it("creates firstProfile", () => {
      expect(executor.profile("firstProfile").name()).toEqual("firstProfile");
    });

    it("creates secondProfile", () => {
      expect(executor.profile("secondProfile").name()).toEqual("secondProfile");
    });

    describe("current profile", () => {
      it('returns "main"', () => {
        expect(executor.currentProfile()).toEqual("main");
      });
    });
  });

  describe("change current profile", () => {
    describe("when profile does not exists", () => {
      it("throw an error", () => {
        expect(() => {
          executor.defineProfile("abc");
        }).toThrow(new Error("profile abc does not exists"));
      });
    });

    describe("when profile exists", () => {
      beforeEach(() => {
        executor.defineProfile("firstProfile");
      });

      describe("current profile", () => {
        it('returns "firstProfile"', () => {
          expect(executor.currentProfile()).toEqual("firstProfile");
        });
      });
    });
  });

  describe("execute", () => {
    describe("when there are no arguments", () => {
      beforeEach(async () => {
        help.print = jest.fn();
        executorChain.execute = jest.fn();

        executor = new Executor(config, executorChain, suggester, help);
        executor.defineProfile("secondProfile");
        await executor.execute([]);
      });

      it("prints help for each command", () => {
        expect(help.print).toHaveBeenCalledWith(configProfiles.profiles[1].commands[0], 6);
      });
    });

    describe("when there are arguments", () => {
      let parameters;

      beforeEach(async () => {
        executorChain.execute = jest.fn();

        parameters = { enable: "true" };

        executor = new Executor(config, executorChain, suggester);
        executor.defineProfile("firstProfile");
        await executor.execute(["cmd"], parameters);
      });

      it("calls executorChain", () => {
        expect(executorChain.execute).toHaveBeenCalledWith(configProfiles.profiles[0].commands[0], [], parameters);
      });
    });

    describe("when there are wrong arguments", () => {
      describe("with suggestion", () => {
        beforeEach(async () => {
          suggester.suggest = jest.fn();

          executor = new Executor(config, executorChain, suggester);
          executor.defineProfile("firstProfile");
          await executor.execute(["c"], {});
        });

        it("calls suggest", () => {
          expect(suggester.suggest).toBeCalledWith(executor.profile("firstProfile"), "c");
        });
      });
    });

    describe("help", () => {
      beforeEach(async () => {
        help.print = jest.fn();

        executor = new Executor(config, executorChain, suggester, help);
        executor.defineProfile("firstProfile");
        await executor.execute(["cmd"], { help: true });
      });

      it("prints the help", () => {
        expect(help.print).toHaveBeenCalledWith(configProfiles.profiles[0].commands[0], 5);
      });
    });
  });
});
