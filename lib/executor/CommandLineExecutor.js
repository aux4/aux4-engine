const colors = require("colors");
const Input = require("@aux4/input");

const Printer = require("../Printer");
const Command = require("../Command");
const JSON_PREFIX = "json:";

let input;
class CommandLineExecutor {
  constructor(interpreter) {
    this.interpreter = interpreter;
    this.out = Printer.on(process.stdout);
    this.err = Printer.on(process.stderr);
  }

  async execute(command, action, args, parameters) {
    let cmd = await this.interpreter.interpret(command, action, args, parameters);

    let noOutput = false;
    if (cmd.startsWith("nout:")) {
      cmd = cmd.replace("nout:", "");
      noOutput = true;
    }

    if (cmd.startsWith("stdin:")) {
      cmd = cmd.replace("stdin:", "");
      input = process.openStdin();
    }

    try {
      const { stdout, stderr } = await Command.execute(cmd.replace(JSON_PREFIX, ""), input);
      const responseAsString = stdout.toString().trim();

      let response = responseAsString;
      if (action.startsWith(JSON_PREFIX)) {
        response = JSON.parse(response);
      }
      parameters["response"] = response;

      if (!noOutput) {
        this.out.println(responseAsString);
      }

      if (!noOutput && stderr) {
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
