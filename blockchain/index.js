const Block = require("./block");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
    // first el will be genesis block then based on input...
  }

  addBlock(data) {
    // need last block along with data
    // get current last el in the chain array with this.chain...
    const block = Block.mineBlock(this.chain[this.chain.length - 1], data); // last block and new data for next block
    this.chain.push(block); // add  to chain

    return block;
  }

  // validating incoming chain changes
  isValidChain(chain) {
    // check if first element matches genesis block
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];
      // last hash must match hash of before block
      // and second condition checks its not tampered with so the hash is the same if the data is inputted
      if (
        block.lastHash !== lastBlock.hash ||
        block.hash !== Block.blockHash(block)
      ) {
        return false;
      } else {
        return true;
      }
    }
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log("Received chain is not longer than the current chain");
      return; // escape out of function
      // chains must be longer
    } else if (!this.isValidChain(newChain)) {
      console.log("The received chain is not valid.");
      return; // escape
    } else {
      // chain is valid
      console.log("Replacing blockchain with the new chain.");
      this.chain = newChain;
    }
  }
}

module.exports = Blockchain;
