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
    return this.profile.commands.find(command => command.name === name);
  }
}

module.exports = Profile;
