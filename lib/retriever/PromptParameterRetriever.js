const readline = require("readline");
const out = require("../Output");
const cliSelect = require("cli-select-2");
const Command = require("../Command");
const ParameterRetriever = require("./ParameterRetriever");

class PromptParameterRetriever extends ParameterRetriever {
  constructor(transformer = value => value) {
    super();
    this.transformer = transformer;
  }

  async $lookup(command, parameters, name) {
    if (!command.help || !command.help.variables) {
      return undefined;
    }

    const variable = command.help.variables.find(variable => variable.name === name && variable.default === undefined);
    if (!variable) {
      return undefined;
    }

    let value;

    if (variable.options) {
      try {
        value = await openOptions(variable, parameters);
      } catch (e) {
        out.println(e.message.red);
        value = await openPrompt(variable);
      }
    } else {
      value = await openPrompt(variable);
    }

    if (this.transformer) {
      value = this.transformer(value, command, parameters, name);
    }

    parameters[variable.name] = value;
    return value;
  }
}

async function openPrompt(variable) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });
  rl.stdoutMuted = variable.hide;

  rl.query = displayText(variable);

  const inputValue = await new Promise(resolve => {
    rl.question(rl.query, value => {
      resolve(value);
    });

    rl._writeToOutput = function _writeToOutput(stringToWrite) {
      if (rl.stdoutMuted && stringToWrite !== "\r\n" && stringToWrite !== "\n") {
        rl.output.write("\x1B[2K\x1B[200D" + rl.query + "*".repeat(rl.line.length));
        return;
      }
      rl.output.write(stringToWrite);
    };
  });

  rl.close();

  return inputValue;
}

async function openOptions(variable, parameters) {
  out.println(displayText(variable));

  let options;

  if (Array.isArray(variable.options)) {
    options = variable.options;
  } else if (typeof variable.options === "function") {
    options = await variable.options();
  } else {
    try {
      const command = await Command.replaceVariables(variable.options, parameters);
      const { stdout } = await Command.execute(command);
      options = JSON.parse(stdout);
    } catch (e) {
      throw new Error(`Unable to retrieve options for ${variable.name}`);
    }
  }

  const response = await cliSelect({
    values: options
  });
  return response.value;
}

function displayText(variable) {
  let text = variable.name.bold;
  if (variable.text) {
    text += ` [${variable.text}]`;
  }
  return `${text}: `.cyan;
}

module.exports = PromptParameterRetriever;
