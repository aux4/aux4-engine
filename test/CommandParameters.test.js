const CommandParameters = require("../lib/CommandParameters");
const DefaultParameterLookup = require("../lib/retriever/DefaultParameterRetriever");

describe("CommandParameters", () => {
  let commandParameters, command, params;

  beforeEach(() => {
    command = {
      name: "command",
      help: {
        text: "command help",
        variables: [
          {
            name: "name",
            text: "enter the name",
            default: "none"
          }
        ]
      }
    };
  });

  describe("proxy", () => {
    describe("given retriever", () => {
      describe("given no parameter", () => {
        beforeEach(() => {
          params = {};

          const factory = CommandParameters.newInstance();
          factory.register(new DefaultParameterLookup());
          commandParameters = factory.create(command, params);
        });

        describe("get name", () => {
          let name;

          beforeEach(async () => {
            name = await commandParameters.name;
          });

          it("returns the default value", () => {
            expect(name).toEqual("none");
          });
        });
      });

      describe("given parameter", () => {
        beforeEach(() => {
          params = {
            name: "john"
          };

          const factory = CommandParameters.newInstance();
          factory.register(new DefaultParameterLookup());
          commandParameters = factory.create(command, params);
        });

        describe("get name", () => {
          let name;

          beforeEach(async () => {
            name = await commandParameters.name;
          });

          it("returns the name", () => {
            expect(name).toEqual("john");
          });
        });
      });
    });

    describe("given no retriever", () => {
      describe("given parameter", () => {
        beforeEach(() => {
          params = {
            name: "john"
          };

          commandParameters = CommandParameters.newInstance().create(command, params);
        });

        describe("get name", () => {
          let name;

          beforeEach(async () => {
            name = await commandParameters.name;
          });

          it("returns the name", () => {
            expect(name).toEqual("john");
          });
        });
      });
    });
  });
});
