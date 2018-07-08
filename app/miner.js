const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");

class Miner {
  // ties in transactions and blockchain
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  // ties together all engineering to grab transactions, takes them and creates a block with their data, tells p2p to sync and include new block with those transactions and lastly, tells pool to clear itself of everything because now they are in the blockchain
  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    // include a reward for the miner
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );
    // create a block consisting of the valid transactions
    const block = this.blockchain.addBlock(validTransactions);
    // synchronize chains in the peer to peer server
    this.p2pServer.syncChains();
    // clear transaction pool local to miner
    this.transactionPool.clear();
    // broadcast to every miner to clear their
    this.p2pServer.broadcastClearTransactions();
    // transaction pools so its not posted twice

    return block;
  }
}

module.exports = Miner;
