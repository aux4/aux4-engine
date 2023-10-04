const colors = require("colors");

const BOLD = /\B\*(\S[^*]+\S)\*\B/g;
const UNDERLINE = /\b_(\S[^_]+\S)_\b/g;
const TAG = /<\S[^>]+\S>/g;

class Printer {
  constructor(stream) {
    this.stream = stream;
  }

  static on(stream) {
    return new Printer(stream);
  }

  print() {
    const text = formatOutputText(arguments);
    this.stream.write(replaceMarkdown(text));
  }

  println() {
    let text = formatOutputText(arguments) + "\n";
    this.stream.write(replaceMarkdown(text));
  }
}

function replaceMarkdown(text) {
  let markdown = text;
  markdown = markdown.replace(BOLD, (match, capture) => capture.bold);
  markdown = markdown.replace(UNDERLINE, (match, capture) => capture.underline);
  markdown = markdown.replace(TAG, match => match.magenta);
  return markdown;
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

module.exports = Printer;
