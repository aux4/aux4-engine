const colors = require("colors");

const Printer = require("../Printer");
const Command = require("../Command");
const JSON_PREFIX = "json:";

class CommandLineExecutor {
  constructor(interpreter) {
    this.interpreter = interpreter;
    this.out = Printer.on(process.stdout);
    this.err = Printer.on(process.stderr);
  }

  async execute(command, action, args, parameters) {
    const cmd = await this.interpreter.interpret(command, action, args, parameters);

    try {
      const { stdout, stderr } = await Command.execute(cmd.replace(JSON_PREFIX, ""));
      const responseAsString = stdout.toString().trim();

      let response = responseAsString;
      if (action.startsWith(JSON_PREFIX)) {
        response = JSON.parse(response);
      }
      parameters["response"] = response;

      this.out.println(responseAsString);

      if (stderr) {
        this.err.println(stderr);
      }

      return true;
    } catch (e) {
      this.err.println(e.message.red);
      this.out.println(e.stdout);
      this.err.println(e.stderr);
      throw e;
    }
  }
}

module.exports = CommandLineExecutor;
