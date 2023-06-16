const colors = require("colors");
const out = require("./Output");

const MAX_LINE_LENGTH = 100;

class Help {
  print(command, length) {
    if (!length) {
      length = command.name.length;
    }

    const commandName = leftPad(command.name, length, " ");
    const description = command.help ? command.help.text : "";
    out.println(commandName.yellow, " ", indentParagraphs(description, length + 3));

    if (command.help && command.help.variables) {
      command.help.variables.forEach(variable => {
        let defaultValue = "";
        if (variable.default) {
          defaultValue = `[${variable.default.italic}]`;
        }
        out.println(
          leftPad("-", length + 6, " "),
          variable.name.cyan,
          defaultValue,
          indentParagraphs(variable.text, length + 7)
        );
      });
    }
  }
}

function indentParagraphs(text = "", length) {
  let endOfLine = getEndOfLinePosition(text);
  let newText = text.substring(0, endOfLine);
  let remaining = text.substring(endOfLine + 1);

  while (remaining !== "") {
    endOfLine = getEndOfLinePosition(remaining);
    newText += `\n${leftPad("", length, " ")}${remaining.substring(0, endOfLine).trim()}`;
    remaining = remaining.substring(endOfLine + 1);
  }

  return newText;
}

function getEndOfLinePosition(text) {
  const lineBreak = text.lastIndexOf("\n");
  if (lineBreak !== -1 && lineBreak < MAX_LINE_LENGTH) {
    return lineBreak;
  }

  if (text.length <= MAX_LINE_LENGTH) {
    return text.length;
  }

  const chunk = text.substring(0, MAX_LINE_LENGTH);

  if (chunk.lastIndexOf(" ") === -1) {
    return MAX_LINE_LENGTH;
  }

  return chunk.lastIndexOf(" ");
}

function leftPad(text, length, char) {
  while (text.length < length) {
    text = char + text;
  }
  return text;
}

module.exports = Help;
