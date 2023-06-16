const readline = require("readline");
const out = require("../Output");
const cliSelect = require("cli-select-2");

class PromptParameterRetriever {
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

    parameters[variable.name] = value;
    return value;
  }
}

async function openPrompt(variable) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.stdoutMuted = variable.hide;

  rl._writeToOutput = function _writeToOutput(stringToWrite) {
    if (rl.stdoutMuted) {
      rl.output.write("*");
      return;
    }
    rl.output.write(stringToWrite);
  };

  const inputValue = await rl.question(displayText(variable));
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
