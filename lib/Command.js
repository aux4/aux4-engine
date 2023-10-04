const childProcess = require("child_process");
const Variable = require("./Variable");

class Command {
  static async replaceVariables(command, parameters) {
    let result = command;

    const variables = Variable.list(result);
    for (const name of variables) {
      const value = await parameters[name];
      if (value) {
        result = Variable.replace(result, name, value);
      }
    }

    return result;
  }

  static async execute(command, input) {
    return new Promise((resolve, reject) => {
      const child = childProcess.exec(command, { maxBuffer: Infinity }, (err, stdout, stderr) => {
        if (err) {
          reject(new ExecutorError(err.message, err, stdout, stderr));
        } else {
          resolve({ stdout, stderr });
        }
      });

      if (input) {
        const inputString = typeof input === "string" ? input : JSON.stringify(input);
        child.stdin.write(inputString);
        child.stdin.end();
      }
    });
  }
}

class ExecutorError extends Error {
  constructor(message, cause, stdout, stderr) {
    super(message);
    this.cause = cause;
    this.stdout = stdout;
    this.stderr = stderr;
  }
}

module.exports = Command;
