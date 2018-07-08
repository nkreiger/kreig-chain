// OOP style to create classes for objects and instances of those objecst, and build programs based on how those objects interact with each other
const ChainUtil = require("../chain-util");

const { DIFFICULTY, MINE_RATE } = require("../config");

class Block {
  // attach unique attributes and assign them in constructor
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    // set variables equal to input
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce; // included in calculation of hash values
    // give it regular system unless specified difficulty
    this.difficulty = difficulty || DIFFICULTY;
  }

  // used for debugging, returns what specific instance of the class actually looks like
  toString() {
    return `
    Block -
    Timestamp:  ${this.timestamp}
    Last Hash:  ${this.lastHash.substring(0, 10)}
    Hash:       ${this.hash.substring(0, 10)}
    Nonce:      ${this.nonce}
    Difficulty: ${this.difficulty}
    Data:       ${this.data}
    `;
  }

  // static enables you to call function without having to make a new block class object instance...so you can just call it
  // genesis function is to create starting block
  static genesis() {
    return new this(
      "Genesis Time",
      "-------------",
      "firstS7-h45h",
      [],
      0,
      DIFFICULTY
    );
  }

  static mineBlock(lastBlock, data) {
    let hash, timestamp;
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let nonce = 0;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  // ES6 string template... all together
  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return ChainUtil.hash(
      `${timestamp}${lastHash}${data}${nonce}${difficulty}`
    ).toString();
  }

  // wrapping around regular hash function providing blockchain class to generate hash with only the block as input
  static blockHash(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  // adjust difficulty based on time of last mined block
  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    difficulty =
      lastBlock.timestamp + MINE_RATE > currentTime
        ? difficulty + 1
        : difficulty - 1;
    return difficulty;
  }
}

module.exports = Block;
