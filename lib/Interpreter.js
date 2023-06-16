class Interpreter {
  constructor() {
    this.interpreters = [];
  }

  add(interpreter) {
    this.interpreters.push(interpreter);
  }

  async interpret(command, action, args, parameters) {
    let result = action;

    for (const interpreter of this.interpreters) {
      result = await interpreter.interpret(command, result, args, parameters);
    }

    return result;
  }

  async param(command, param, args, parameters) {
    let result = `\${${param}}`;

    for (const interpreter of this.interpreters) {
      result = await interpreter.interpret(command, result, args, parameters);
    }

    return result;
  }
}

module.exports = Interpreter;
