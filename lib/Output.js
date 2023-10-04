const Printer = require("./Printer");

const out = Printer.on(process.stdout);

class Output {
  static print() {
    out.print(...arguments);
  }

  static println() {
    out.println(...arguments);
  }
}

module.exports = Output;
