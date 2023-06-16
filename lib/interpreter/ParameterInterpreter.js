const Variable = require("../Variable");

class ParameterInterpreter {
  async interpret(command, action, args, parameters) {
    let result = action;

    const variables = Variable.list(result);
    variables.forEach(name => {
      const value = parameters[name];
      if (value) {
        result = Variable.replace(result, name, value);
      }
    });

    return result;
  }
}

module.exports = ParameterInterpreter;
