const ParameterRetriever = require("./ParameterRetriever");

class DefaultParameterRetriever extends ParameterRetriever {
  async $lookup(command, parameters, name) {
    if (!command.help || !command.help.variables) {
      return undefined;
    }

    const variable = command.help.variables.find(variable => variable.name === name);
    if (!variable) {
      return undefined;
    }

    return variable.default;
  }
}

module.exports = DefaultParameterRetriever;
