const colors = require("colors");
const fs = require("fs");
const out = require("./Output");

class Config {
  constructor() {
    this.config = { profiles: [] };
  }

  get() {
    return this.config;
  }

  load(object, callback = () => {}) {
    if (object !== undefined) {
      this.config.profiles = mergeProfiles(this.config, object);
    }
    callback(undefined);
  }

  loadFile(fileName, callback = () => {}) {
    try {
      fs.accessSync(fileName);
    } catch (err) {
      out.println(`${fileName} file not found`.red);
      callback(new Error(`${fileName} file not found`));
      return;
    }

    let data;

    try {
      data = fs.readFileSync(fileName).toString();
    } catch (err) {
      out.println(`error reading ${fileName} file, check the permissions`.red);
      callback(new Error(`error reading ${fileName} file, check the permissions`));
      return;
    }

    try {
      const newConfig = JSON.parse(data);
      this.load(newConfig, callback);
    } catch (e) {
      out.println(`${fileName} is not a valid json file`.red);
      callback(new Error(`${fileName} is not a valid json file`));
    }
  }
}

function mergeProfiles(config, newConfig) {
  const profiles = [].concat(config.profiles);

  profiles.forEach(profile => {
    newConfig.profiles.forEach(newProfile => {
      if (profile.name === newProfile.name) {
        profile.commands = mergeCommands(profile, newProfile);

        const index = newConfig.profiles.indexOf(newProfile);
        newConfig.profiles.splice(index, 1);
      }
    });
  });

  return profiles.concat(newConfig.profiles);
}

function mergeCommands(profile, newProfile) {
  profile.commands.forEach(command => {
    newProfile.commands.forEach(newCommand => {
      if (command.value === newCommand.value) {
        let index = profile.commands.indexOf(command);
        profile.commands[index] = newCommand;

        index = newProfile.commands.indexOf(newCommand);
        newProfile.commands.splice(index, 1);
      }
    });
  });
  return profile.commands.concat(newProfile.commands);
}

module.exports = Config;
