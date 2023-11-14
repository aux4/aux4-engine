const ParameterRetriever = require("./ParameterRetriever");

class ArgumentParameterRetriever extends ParameterRetriever {
  async $lookup(command, parameters, name, args) {
    if (!command.help || !command.help.variables) {
      return undefined;
    }

    const variable = command.help.variables.find(variable => variable.name === name);
    if (!variable) {
      return undefined;
    }

    if (variable.arg === "true" || variable.arg === true) {
      return args.shift();
    }

    return undefined;
  }
}

module.exports = ArgumentParameterRetriever;
