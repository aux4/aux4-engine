const Executor = require("../Executor");
const PREFIX = "profile:";

class ProfileExecutor {
  constructor(config, interpreter, executorChain) {
    this.config = config;
    this.interpreter = interpreter;
    this.executorChain = executorChain;
  }

  async execute(command, action, args, parameters) {
    if (!action.startsWith(PREFIX)) {
      return false;
    }

    const executor = new Executor(this.config, this.executorChain);
    const profileExpression = action.substring(PREFIX.length);
    const profile = await this.interpreter.interpret(command, profileExpression, args, parameters);
    executor.defineProfile(profile);
    await executor.execute(args, parameters);

    return true;
  }

  static with(config) {
    return function (interpreter, executorChain) {
      return new ProfileExecutor(config, interpreter, executorChain);
    };
  }
}

module.exports = ProfileExecutor;
