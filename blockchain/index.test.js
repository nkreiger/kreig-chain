const Blockchain = require("./index");
const Block = require("./block");

describe("Blockchain", () => {
  let bc, bc2;

  beforeEach(() => {
    bc = new Blockchain(); // all tests start with clean slate
    bc2 = new Blockchain();
  });

  it("start with genesis block", () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it("Adds a new block to chain", () => {
    const data = "foo";
    bc.addBlock(data);

    expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
  });

  it("Validates a valid chain", () => {
    bc2.addBlock("foo");

    expect(bc.isValidChain(bc2.chain)).toBe(true);
  });

  it("invalides chain with corrupt genesis block", () => {
    bc2.chain[0].data = "Bad Data"; // now incorrect

    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it("invalides a corrupt chain in the middle not necessarily start", () => {
    bc2.addBlock("foo");
    bc2.chain[1].data = "not foo";

    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it("replaces the chain with a valid chain", () => {
    bc2.addBlock("goo");

    bc.replaceChain(bc2.chain); // should be valid

    expect(bc.chain).toEqual(bc2.chain);
  });

  it("Does not replace the chain with one of less than or equal length", () => {
    bc.addBlock("foo");
    bc.replaceChain(bc2.chain);

    expect(bc.chain).not.toEqual(bc2.chain);
  });
});
