class Profile {
  constructor(config, name) {
    const profile = config.get().profiles.find(profile => profile.name === name);
    if (profile === undefined) {
      throw new Error(`profile ${name} not found in the configuration file`);
    }
    this.profile = profile;
  }

  name() {
    return this.profile.name;
  }

  commands() {
    return this.profile.commands;
  }

  command(name) {
    let selected = undefined;
    this.profile.commands.forEach(command => {
      if (name === command.name) {
        selected = command;
      }
    });
    return selected;
  }
}

module.exports = Profile;
