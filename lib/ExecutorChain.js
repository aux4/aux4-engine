const colors = require("colors");
const out = require("./Output");
const Interpreter = require("../lib/Interpreter");
const CommandParameters = require("./CommandParameters");

class ExecutorChain {
  constructor(interpreter = new Interpreter(), commandParametersFactory = CommandParameters.newInstance()) {
    this.executors = [];
    this.interpreter = interpreter;
    this.commandParametersFactory = commandParametersFactory;
  }

  register(executor) {
    this.executors.push(new executor(this.interpreter, this));
  }

  async execute(command, args, parameters) {
    if (command.execute === undefined) {
      out.println("execute is not defined".red);
      return;
    }

    const commandParameters = this.commandParametersFactory.create(command, parameters);

    if (typeof command.execute === "function") {
      await command.execute(commandParameters, args, command, this.interpreter);
      return;
    }

    const actions = command.execute;

    for (const action of actions) {
      for (const executor of this.executors) {
        let response;

        try {
          response = await executor.execute(command, action, args, commandParameters);
        } catch (e) {
          throw e;
        }

        if (response) {
          break;
        }
      }
    }
  }
}

module.exports = ExecutorChain;
