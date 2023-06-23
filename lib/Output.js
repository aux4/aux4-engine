const colors = require("colors");

const BOLD = /\*(\S[^*]+\S)\*/g;
const UNDERLINE = /_(\S[^_]+\S)_/g;

class Output {
  static print() {
    const text = formatOutputText(arguments);
    process.stdout.write(text);
  }

  static println() {
    let text = formatOutputText(arguments) + "\n";
    text = text.replace(BOLD, (match, capture) => capture.bold);
    text = text.replace(UNDERLINE, (match, capture) => capture.underline);
    process.stdout.write(text);
  }
}

function formatOutputText(args) {
  let text = "";
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === undefined || arg === "") {
      continue;
    }
    if (i > 0 && text.length > 0) {
      text += " ";
    }
    text += arg;
  }
  return text;
}

module.exports = Output;
