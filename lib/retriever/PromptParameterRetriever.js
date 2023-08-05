const readline = require("readline");
const out = require("../Output");
const cliSelect = require("cli-select-2");

class PromptParameterRetriever {
  constructor(transformer = value => value) {
    this.transformer = transformer;
  }

  async lookup(command, parameters, name) {
    if (!command.help || !command.help.variables) {
      return undefined;
    }

    const variable = command.help.variables.find(variable => variable.name === name && variable.default === undefined);
    if (!variable) {
      return undefined;
    }

    let value;

    if (variable.options) {
      value = await openOptions(variable);
    } else {
      value = await openPrompt(variable);
    }

    if (this.transformer) {
      value = this.transformer(value);
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

async function openOptions(variable) {
  out.println(displayText(variable));
  const response = await cliSelect({
    values: variable.options
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
