const out = require("./Output");

class Suggester {
  suggest(profile, value) {
    const suggestions = [];

    profile.commands().forEach(cmd => {
      if (cmd.value.startsWith(value)) {
        suggestions.push(cmd.value);
      }
    });

    if (suggestions.length === 0) {
      out.println(`Command not found: ${value}`);
    } else {
      out.println("What did you mean:");
      suggestions.forEach(suggestion => {
        out.println("  - ", suggestion.bold);
      });
    }
  }
}

module.exports = Suggester;
