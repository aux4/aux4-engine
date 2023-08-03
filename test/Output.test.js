const colors = require("colors");
const out = require("../lib/Output");

describe("output", () => {
  beforeEach(() => {
    process.stdout.write = jest.fn();
  });

  describe("when print a text", () => {
    describe("with a single argument", () => {
      beforeEach(() => {
        out.print("text 01");
      });

      it("should call stdout.write once", () => {
        expect(process.stdout.write.mock.calls.length).toBe(1);
      });

      it("should call stdout.write with the text", () => {
        expect(process.stdout.write).toBeCalledWith("text 01");
      });
    });

    describe("with two arguments", () => {
      beforeEach(() => {
        out.print("text 01", "text 02");
      });

      it("should call stdout.write once", () => {
        expect(process.stdout.write.mock.calls.length).toBe(1);
      });

      it("should call stdout.write with the text", () => {
        expect(process.stdout.write).toBeCalledWith("text 01 text 02");
      });
    });

    describe("with an empty argument between two others", () => {
      beforeEach(() => {
        out.print("text 01", "", "text 02");
      });

      it("should call stdout.write once", () => {
        expect(process.stdout.write.mock.calls.length).toBe(1);
      });

      it("should call stdout.write with the text", () => {
        expect(process.stdout.write).toBeCalledWith("text 01 text 02");
      });
    });
  });

  describe("when print a line", () => {
    describe("with a single argument", () => {
      beforeEach(() => {
        out.println("text 01");
      });

      it("should call stdout.write once", () => {
        expect(process.stdout.write.mock.calls.length).toBe(1);
      });

      it("should call stdout.write with the text", () => {
        expect(process.stdout.write).toBeCalledWith("text 01\n");
      });
    });

    describe("with two arguments", () => {
      beforeEach(() => {
        out.println("text 01", "text 02");
      });

      it("should call stdout.write once", () => {
        expect(process.stdout.write.mock.calls.length).toBe(1);
      });

      it("should call stdout.write with the text", () => {
        expect(process.stdout.write).toBeCalledWith("text 01 text 02\n");
      });
    });

    describe("with an empty argument between two others", () => {
      beforeEach(() => {
        out.println("text 01", "", "text 02");
      });

      it("should call stdout.write once", () => {
        expect(process.stdout.write.mock.calls.length).toBe(1);
      });

      it("should call stdout.write with the text", () => {
        expect(process.stdout.write).toBeCalledWith("text 01 text 02\n");
      });
    });

    describe("with bold", () => {
      beforeEach(() => {
        out.println("this is *bold text* between the *");
      });

      it("should call stdout.write once", () => {
        expect(process.stdout.write.mock.calls.length).toBe(1);
      });

      it("should call stdout.write with the text", () => {
        expect(process.stdout.write).toBeCalledWith(`this is ${"bold text".bold} between the *\n`);
      });
    });

    describe("with bold and star between words", () => {
      beforeEach(() => {
        out.println("this is *bold text* but not the*start*text");
      });

      it("should call stdout.write once", () => {
        expect(process.stdout.write.mock.calls.length).toBe(1);
      });

      it("should call stdout.write with the text", () => {
        expect(process.stdout.write).toBeCalledWith(`this is ${"bold text".bold} but not the*start*text\n`);
      });
    });

    describe("with underline", () => {
      beforeEach(() => {
        out.println("this is _underlined text_ between the _");
      });

      it("should call stdout.write once", () => {
        expect(process.stdout.write.mock.calls.length).toBe(1);
      });

      it("should call stdout.write with the text", () => {
        expect(process.stdout.write).toBeCalledWith(`this is ${"underlined text".underline} between the _\n`);
      });
    });

    describe("with underline and environment variable name", () => {
      beforeEach(() => {
        out.println("this is _underlined text_ but not the variable AUX4_SECRET_KEY");
      });

      it("should call stdout.write once", () => {
        expect(process.stdout.write.mock.calls.length).toBe(1);
      });

      it("should call stdout.write with the text", () => {
        expect(process.stdout.write).toBeCalledWith(
          `this is ${"underlined text".underline} but not the variable AUX4_SECRET_KEY\n`
        );
      });
    });
  });
});
