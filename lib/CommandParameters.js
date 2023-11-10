class CommandParameters {
  constructor(command, params) {
    this.$command = command;
    this.$params = params;
  }

  static newInstance() {
    return new CommandParametersFactory();
  }
}

class CommandParametersFactory {
  constructor() {
    this.parameterRetrivers = [];
  }

  register(parameterInterpreter) {
    this.parameterRetrivers.push(parameterInterpreter);
  }

  async getParameter(target, name, proxy) {
    for (const retriever of this.parameterRetrivers) {
      const value = await retriever.lookup(target.$command, target.$params, name, proxy);
      if (value !== undefined) {
        return value;
      }
    }
    return undefined;
  }

  create(command, params) {
    const self = this;

    const commandParameters = new CommandParameters(command, params);
    const ref = {};

    const proxy = new Proxy(commandParameters, {
      get(target, name, receiver) {
        if (name === "$command" || name === "$params" || name === "toString") {
          return Reflect.get(target, name, receiver);
        }

        const value = target.$params[name];
        if (value !== undefined) {
          return Promise.resolve(value);
        }

        if (self.parameterRetrivers.length === 0) {
          return Promise.resolve(undefined);
        }

        return new Promise(resolve =>
          self.getParameter(target, name, ref.proxy).then(value => {
            target.$params[name] = value;
            resolve(value);
          })
        );
      },

      set(target, name, value) {
        target.$params[name] = value;
        return true;
      }
    });

    ref.proxy = proxy;

    return proxy;
  }
}

module.exports = CommandParameters;
