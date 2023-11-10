class ParameterRetriever {
  constructor() {
    this.cache = {};
  }

  async lookup(command, parameters, name, proxy) {
    if (Object.keys(this.cache).includes(name)) {
      return this.cache[name];
    }

    const result = await this.$lookup(command, parameters, name, proxy);
    this.cache[name] = result;
    return result;
  }

  async $lookup(command, parameters, name, proxy) {
    return undefined;
  }
}

module.exports = ParameterRetriever;