const out = require("../Output");

const PREFIX = "log:";

class LogExecutor {
  constructor(interpreter) {
    this.interpreter = interpreter;
  }

  async execute(command, action, args, parameters) {
    if (!action.startsWith(PREFIX)) {
      return false;
    }

    let text = action.substring(PREFIX.length);
    text = await this.interpreter.interpret(command, text, args, parameters);
    out.println(text);

    return true;
  }
}

module.exports = LogExecutor;
