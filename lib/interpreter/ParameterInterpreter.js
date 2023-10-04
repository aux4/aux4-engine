const Command = require("../Command");

class ParameterInterpreter {
  async interpret(command, action, args, parameters) {
    return Command.replaceVariables(action, parameters);
  }
}

module.exports = ParameterInterpreter;
