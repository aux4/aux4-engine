const colors = require("colors");
const fs = require("fs");
const out = require("./Output");

class Config {
  constructor() {
    this.config = { profiles: [] };
  }

  setCompatibilityAdapter(adapter) {
    this.compatibilityAdapter = adapter;
  }

  get() {
    return this.config;
  }

  load(object, callback = () => {}) {
    if (this.compatibilityAdapter) {
      this.compatibilityAdapter.adapt(object);
    }

    if (object !== undefined) {
      this.config.profiles = mergeProfiles(this.config, object);
      this.config.config = mergeConfig(this.config, object);
    }

    if (Object.keys(this.config.config).length === 0) {
      delete this.config.config;
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

function mergeConfig(config, newConfig) {
  const aux4Config = config.config || {};
  const newAux4Config = newConfig.config || {};

  return mergeObject({ ...aux4Config }, { ...newAux4Config });
}

function mergeObject(object, newObject) {
  Object.keys(newObject).forEach(key => {
    if (object[key] === undefined) {
      object[key] = newObject[key];
    } else if (Array.isArray(object[key])) {
      object[key] = object[key].concat(newObject[key] || []);
    } else if (typeof object[key] === "object") {
      mergeObject(object[key], newObject[key]);
    } else {
      object[key] = newObject[key];
    }
  });
  return object;
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
      if (command.name === newCommand.name) {
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
