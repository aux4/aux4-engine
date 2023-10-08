const fs = require("fs");
const childProcess = require("child_process");
const Variable = require("./Variable");
const Printer = require("./Printer");

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

  static async execute(command, input, options = {}) {
    if (options.mock) {
      const mockedValue = mockCommand(command, options.mock);

      if (mockedValue) {
        if (mockedValue.error) {
          return Promise.reject(
            new ExecutorError(
              mockedValue.error.message,
              new Error(mockedValue.error.message),
              mockedValue.stdout,
              mockedValue.stderr
            )
          );
        }
        return Promise.resolve({ stdout: mockedValue.stdout, stderr: mockedValue.stderr });
      }

      delete options.mock;
    }

    return new Promise((resolve, reject) => {
      const child = childProcess.exec(command, { maxBuffer: Infinity, ...options }, (err, stdout, stderr) => {
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

function mockCommand(command, mockFilePath) {
  if (!fs.existsSync(mockFilePath)) {
    const err = new Printer(process.stderr);
    err.println(`Mock file ${mockFilePath} does not exist.`);
    return;
  }

  try {
    const mockFile = fs.readFileSync(mockFilePath, { encoding: "utf8" });
    const mock = JSON.parse(mockFile);

    return mock[command];
  } catch (e) {
    throw new Error(`Error parsing mock file ${mockFilePath}: ${e.message}`);
  }
}

module.exports = Command;
