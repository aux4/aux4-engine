const out = require("../Output");

const PREFIX = "set:";

class SetParameterExecutor {
  constructor(interpreter, executorChain) {
    this.interpreter = interpreter;
    this.executorChain = executorChain;
  }

  async execute(command, action, args, parameters) {
    if (!action.startsWith(PREFIX)) {
      return false;
    }

    const parametersDeclaration = action.substring(PREFIX.length);
    const params = parametersDeclaration.split(";");

    let lastValue;

    for (const parameterDeclaration of params) {
      const equalSignPosition = parameterDeclaration.indexOf("=");
      if (equalSignPosition === -1) {
        out.println("The set format is: set:<param-name>=<param-value>".red);
        return true;
      }

      const parameterName = parameterDeclaration.substring(0, equalSignPosition);
      let parameterValue = parameterDeclaration.substring(equalSignPosition + 1);

      parameterValue = await this.interpreter.interpret(command, parameterValue, args, parameters);

      parameters[parameterName] = parameterValue;
      lastValue = parameterValue;
    }

    parameters.response = lastValue;

    return true;
  }
}

module.exports = SetParameterExecutor;
