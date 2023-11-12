const out = require("./Output");

class Suggester {
  suggest(profile, name) {
    const suggestions = [];

    profile.commands().forEach(cmd => {
      if (cmd.name.startsWith(name)) {
        suggestions.push(cmd.name);
      }
    });

    if (suggestions.length === 0) {
      out.println(`Command not found: ${name}`);
    } else {
      out.println("What did you mean:");
      suggestions.forEach(suggestion => {
        out.println("  - ", suggestion.bold);
      });
    }

    process.exit(127);
  }
}

module.exports = Suggester;
