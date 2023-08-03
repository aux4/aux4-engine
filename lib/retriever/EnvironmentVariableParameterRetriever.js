class EnvironmentVariableParameterRetriever {
  async lookup(command, parameters, name) {
    if (!command.help || !command.help.variables) {
      return undefined;
    }

    const variable = command.help.variables.find(variable => variable.name === name);
    if (!variable || !variable.env) {
      return undefined;
    }

    return process.env[variable.env];
  }
}

module.exports = EnvironmentVariableParameterRetriever;
