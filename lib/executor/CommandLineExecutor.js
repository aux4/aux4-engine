const colors = require("colors");

const Printer = require("../Printer");
const Command = require("../Command");
const JSON_PREFIX = "json:";

const out = Printer.on(process.stdout);
const err = Printer.on(process.stderr);

class CommandLineExecutor {
  constructor(interpreter) {
    this.interpreter = interpreter;
  }

  async execute(command, action, args, parameters) {
    const cmd = await this.interpreter.interpret(command, action, args, parameters);

    try {
      const { exitCode, stdout, stderr } = await Command.execute(cmd.replace(JSON_PREFIX, ""));
      const responseAsString = stdout.toString().trim();

      let response = responseAsString;
      if (action.startsWith(JSON_PREFIX)) {
        response = JSON.parse(response);
      }
      parameters["response"] = response;

      out.println(responseAsString);

      if (stderr) {
        err.println(stderr);
      }

      return true;
    } catch (e) {
      err.println(e.stdout);
      err.println(e.message.red);
      throw e;
    }
  }
}

module.exports = CommandLineExecutor;
