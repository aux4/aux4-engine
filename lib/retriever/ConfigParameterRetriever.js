class ConfigParameterRetriever {
  constructor(config) {
    this.aux4Config = config;
    this.init = false;
  }

  static with(config) {
    return new ConfigParameterRetriever(config);
  }

  async lookup(command, parameters, name) {
    if (!this.init) {
      this.init = true;

      const aux4ConfigModule = getModule();
      if (!aux4ConfigModule) return undefined;

      this.config = getConfig(aux4ConfigModule, this.aux4Config);
    }

    if (this.config === undefined) return undefined;

    const configPath = await parameters.config;
    const config = this.config.get(configPath);

    if (config === undefined) return undefined;

    return config[name];
  }
}

function getConfig(aux4ConfigModule, config) {
  const Config = aux4ConfigModule.Config;
  const ConfigLoader = aux4ConfigModule.ConfigLoader;

  if (config) {
    const aux4Config = config.get();
    if (aux4Config && aux4Config.config) {
      return new Config(aux4Config.config);
    }
  }

  try {
    return ConfigLoader.load();
  } catch (e) {
    return undefined;
  }
}

function getModule() {
  try {
    return require("@aux4/config");
  } catch (e) {
    return undefined;
  }
}

module.exports = ConfigParameterRetriever;
