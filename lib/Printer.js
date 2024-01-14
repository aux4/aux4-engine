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
    const text = formatOutputText([...arguments]);
    this.stream.write(text);
  }

  println() {
    let text = formatOutputText([...arguments]) + "\n";
    this.stream.write(text);
  }
}

function replaceMarkdown(text) {
  let markdown = text;
  markdown = markdown.replace(BOLD, (match, capture) => capture.bold);
  markdown = markdown.replace(UNDERLINE, (match, capture) => capture.underline);
  markdown = markdown.replace(TAG, match => match.magenta);
  return markdown;
}

function formatJson(json) {
  return JSON.stringify(json, null, 2);
}

function formatOutputText(args) {
  return args
    .filter(arg => arg !== undefined && arg !== "")
    .map(arg => {
      if (Array.isArray(arg)) {
        return formatJson(arg);
      } else if (typeof arg === "object") {
        return formatJson(arg);
      } else if (typeof arg === "string") {
        return replaceMarkdown(arg.toString());
      }
      return arg;
    })
    .join(" ");
}

module.exports = Printer;
