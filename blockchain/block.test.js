const Block = require("./block");

describe("Block", () => {
  let data, lastBlock, block; // declare variables within scope
  beforeEach(() => {
    // function runs before each unit test
    data = "bar";
    lastBlock = Block.genesis(); // dumby default block
    block = Block.mineBlock(lastBlock, data);
  });
  // series of tests jest will execute
  it("sets the `data` to match the given input", () => {
    // code to execute test
    expect(block.data).toEqual(data); // expect it to equal inputted data input
  });
  it("sets the lastHash to match hash of last block", () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
    // expects new block last hash value should equal hash from previous block it reeived
  });

  it("generates a hash that matches the difficulty", () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual(
      "0".repeat(block.difficulty)
    );
  });

  it("lowers difficulty for slow mining block", () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(
      block.difficulty - 1
    );
  });

  it("Raises difficulty for quick mining", () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(
      block.difficulty + 1
    );
  });
});

// npm run test
