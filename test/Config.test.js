const colors = require("colors");
const fs = require("fs");

const Config = require("../lib/Config");
const config = new Config();

const out = require("../lib/Output");

describe("config", () => {
  beforeEach(() => {
    out.println = jest.fn();
  });

  describe("get", () => {
    describe("without default", () => {
      it("returns an empty object without profiles", () => {
        expect(config.get()).toEqual({ profiles: [] });
      });
    });
  });

  describe("load config file", () => {
    describe("when there is no config file", () => {
      let callback;

      beforeEach(() => {
        fs.accessSync = jest.fn().mockImplementation(() => {
          throw new Error("Error");
        });

        callback = jest.fn();

        config.loadFile(".aux4", callback);
      });

      it('prints ".aux4 file not found"', () => {
        expect(out.println).toHaveBeenCalledWith(".aux4 file not found".red);
      });

      it("calls the callback with error", () => {
        expect(callback).toHaveBeenCalledWith(new Error(".aux4 file not found"));
      });
    });

    describe("when there is config file", () => {
      describe("with default file name", () => {
        describe("with error to read", () => {
          let callback;

          beforeEach(() => {
            fs.accessSync = jest.fn();
            fs.readFileSync = jest.fn().mockImplementation(() => {
              throw new Error("Error");
            });

            callback = jest.fn();

            config.loadFile(".aux4", callback);
          });

          it('does not print ".aux4 file not found"', () => {
            expect(out.println).not.toHaveBeenCalledWith(".aux4 file not found".red);
          });

          it('prints "error reading .aux4 file, check the permissions"', () => {
            expect(out.println).toHaveBeenCalledWith("error reading .aux4 file, check the permissions".red);
          });

          it("calls the callback with error", () => {
            expect(callback).toHaveBeenCalledWith(new Error("error reading .aux4 file, check the permissions"));
          });
        });

        describe("without error to read", () => {
          describe("with error to parse", () => {
            let configFile, callback;

            beforeEach(() => {
              configFile = "wrong json format 1";

              fs.accessSync = jest.fn();
              fs.readFileSync = jest.fn().mockReturnValue(configFile);

              callback = jest.fn();

              config.loadFile(".aux4", callback);
            });

            it('does not print ".aux4 file not found"', () => {
              expect(out.println).not.toHaveBeenCalledWith(".aux4 file not found".red);
            });

            it('does not print "error reading .aux4 file, check the permissions"', () => {
              expect(out.println).not.toHaveBeenCalledWith("error reading .aux file, check the permissions".red);
            });

            it('prints ".aux4 is not a valid json file"', () => {
              expect(out.println).toHaveBeenCalledWith(".aux4 is not a valid json file".red);
            });

            it("calls the callback with error", () => {
              expect(callback).toHaveBeenCalledWith(new Error(".aux4 is not a valid json file"));
            });
          });

          describe("without error to parse", () => {
            let configFile, callback;

            beforeEach(() => {
              configFile = {
                profiles: []
              };

              callback = jest.fn();

              fs.accessSync = jest.fn();
              fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(configFile));

              config.loadFile(undefined, callback);
            });

            it('does not print ".aux4 file not found"', () => {
              expect(out.println).not.toHaveBeenCalledWith(".aux4 file not found".red);
            });

            it('does not print "error reading .aux4 file, check the permissions"', () => {
              expect(out.println).not.toHaveBeenCalledWith("error reading .aux4 file, check the permissions".red);
            });

            it('does not print ".aux4 is not a valid json file"', () => {
              expect(out.println).not.toHaveBeenCalledWith(".aux4 is not a valid json file".red);
            });

            it("calls the callback without error", () => {
              expect(callback).toHaveBeenCalledWith(undefined);
            });

            describe("get config file", () => {
              it("returns the object parsed from json", () => {
                expect(config.get()).toEqual({ profiles: [] });
              });
            });
          });
        });
      });

      describe("with custom file name", () => {
        let fileName;

        beforeEach(() => {
          fileName = "newFile.aux4";
        });

        describe("with error to read", () => {
          let callback;

          beforeEach(() => {
            fs.accessSync = jest.fn();
            fs.readFileSync = jest.fn().mockImplementation(() => {
              throw new Error("Error");
            });

            callback = jest.fn();

            config.loadFile(fileName, callback);
          });

          it('does not print "newFile.aux4 file not found"', () => {
            expect(out.println).not.toHaveBeenCalledWith("newFile.aux4 file not found".red);
          });

          it('prints "error reading newFile.aux4 file, check the permissions"', () => {
            expect(out.println).toHaveBeenCalledWith("error reading newFile.aux4 file, check the permissions".red);
          });

          it("calls the callback with error", () => {
            expect(callback).toHaveBeenCalledWith(new Error("error reading newFile.aux4 file, check the permissions"));
          });
        });

        describe("without error to read", () => {
          describe("with error to parse", () => {
            let configFile, callback;

            beforeEach(() => {
              configFile = "wrong json format 2";

              fs.accessSync = jest.fn();
              fs.readFileSync = jest.fn().mockReturnValue(configFile);

              callback = jest.fn();

              config.loadFile(fileName, callback);
            });

            it('does not print "newFile.aux4 file not found"', () => {
              expect(out.println).not.toHaveBeenCalledWith("newFile.aux4 file not found".red);
            });

            it('does not print "error reading newFile.aux4 file, check the permissions"', () => {
              expect(out.println).not.toHaveBeenCalledWith("error reading newFile.aux file, check the permissions".red);
            });

            it('prints "newFile.aux4 is not a valid json file"', () => {
              expect(out.println).toHaveBeenCalledWith("newFile.aux4 is not a valid json file".red);
            });

            it("calls the callback with error", () => {
              expect(callback).toHaveBeenCalledWith(new Error("newFile.aux4 is not a valid json file"));
            });
          });

          describe("without error to parse", () => {
            let configFile, callback;

            beforeEach(() => {
              configFile = {
                profiles: []
              };

              callback = jest.fn();

              fs.accessSync = jest.fn();
              fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(configFile));

              config.loadFile(fileName, callback);
            });

            it('does not print "newFile.aux4 file not found"', () => {
              expect(out.println).not.toHaveBeenCalledWith("newFile.aux4 file not found".red);
            });

            it('does not print "error reading newFile.aux4 file, check the permissions"', () => {
              expect(out.println).not.toHaveBeenCalledWith(
                "error reading newFile.aux4 file, check the permissions".red
              );
            });

            it('does not print "newFile.aux4 is not a valid json file"', () => {
              expect(out.println).not.toHaveBeenCalledWith("newFile.aux4 is not a valid json file".red);
            });

            it("calls the callback without error", () => {
              expect(callback).toHaveBeenCalledWith(undefined);
            });

            describe("get config file", () => {
              it("returns the object parsed from json", () => {
                expect(config.get()).toEqual({ profiles: [] });
              });
            });
          });
        });
      });
    });
  });
});
