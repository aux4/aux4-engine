const Config = require("./Config");
const ExecutorChain = require("./ExecutorChain");
const Executor = require("./Executor");
const ProfileExecutor = require("./executor/ProfileExecutor");
const Parameters = require("./Parameters");
const Suggester = require("./Suggester");
const Help = require("./Help");
const Interpreter = require("./Interpreter");
const ParameterInterpreter = require("./interpreter/ParameterInterpreter");
const CommandParameters = require("./CommandParameters");
const DefaultParameterRetriever = require("./retriever/DefaultParameterRetriever");
const PromptParameterRetriever = require("./retriever/PromptParameterRetriever");
const EnvironmentVariableParameterRetriever = require("./retriever/EnvironmentVariableParameterRetriever");
const EncryptedParameterRetriever = require("./retriever/EncryptedParameterRetriever");
const ConfigParameterRetriever = require("./retriever/ConfigParameterRetriever");

function defaultOptions() {
  const config = new Config();
  const executorChain = defaultExecutorChain(config);

  return {
    config,
    executorChain,
    suggester: new Suggester(),
    help: new Help(),
    aux4: { profiles: [] }
  };
}

function defaultExecutorChain(config, options = {}) {
  const interpreter = new Interpreter();
  interpreter.add(new ParameterInterpreter());

  const commandParametersFactory = options.commandParametersFactory || defaultCommandParameterFactory(config);

  const executorChain = new ExecutorChain(interpreter, commandParametersFactory);
  executorChain.register(ProfileExecutor.with(config));
  return executorChain;
}

function defaultCommandParameterFactory(config) {
  const commandParametersFactory = CommandParameters.newInstance();
  commandParametersFactory.register(new EnvironmentVariableParameterRetriever());
  commandParametersFactory.register(ConfigParameterRetriever.with(config));
  commandParametersFactory.register(new EncryptedParameterRetriever());
  commandParametersFactory.register(new DefaultParameterRetriever());
  commandParametersFactory.register(new PromptParameterRetriever());
  return commandParametersFactory;
}

const DEFAULT_OPTIONS = defaultOptions();

class Engine {
  constructor(options = {}) {
    const config = options.config || DEFAULT_OPTIONS.config;
    const executorChain =
      options.executorChain || (options.config ? defaultExecutorChain(config, options) : DEFAULT_OPTIONS.executorChain);
    const suggester = options.suggester || DEFAULT_OPTIONS.suggester;
    const help = options.help || DEFAULT_OPTIONS.help;
    const aux4 = options.aux4 || DEFAULT_OPTIONS.aux4;

    config.load(aux4);

    this.executor = new Executor(config, executorChain, suggester, help);
  }
  async run(args) {
    const parameters = Parameters.extract(args);
    await this.executor.execute(args, parameters);
  }
}

module.exports = Engine;
