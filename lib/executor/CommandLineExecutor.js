const colors = require("colors");

const out = require("../Output");
const Command = require("../Command");
const JSON_PREFIX = "json:";

class CommandLineExecutor {
  constructor(interpreter) {
    this.interpreter = interpreter;
  }

  async execute(command, action, args, parameters) {
    const cmd = await this.interpreter.interpret(command, action, args, parameters);

    try {
      const { stdout } = await Command.execute(cmd.replace(JSON_PREFIX, ""));
      const responseAsString = stdout.toString().trim();

      let response = responseAsString;
      if (action.startsWith(JSON_PREFIX)) {
        response = JSON.parse(response);
      }
      parameters["response"] = response;

      out.println(responseAsString);
      return true;
    } catch (err) {
      out.println(err.stdout);
      out.println(err.message.red);
      throw err;
    }
  }
}

module.exports = CommandLineExecutor;
