// default wallet file
// grab chain-util
const ChainUtil = require("../chain-util");
const Transaction = require("./transaction");
const { INITIAL_BALANCE } = require("../config");

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    // creates key pair object for wallet class, then we can call a method in this object to get pub key
    this.keyPair = ChainUtil.genKeyPair();
    // public key from keyPair object in hexadecimal form
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  toString() {
    return `
    Wallet - publicKey: ${this.publicKey.toString()}
    balance           : ${this.balance}
    `;
  }

  sign(dataHash) {
    // users signature on the transaction
    return this.keyPair.sign(dataHash);
  }

  calculateBalance(blockchain) {
    let balance = this.balance;
    let transactions = [];
    // loop through each block and each transaction add to array
    blockchain.chain.forEach(block =>
      block.data.forEach(transaction => {
        transactions.push(transaction);
      })
    );
    // filter to this wallet instance
    const walletInputTs = transactions.filter(
      transaction => transaction.input.address === this.publicKey
    );

    // want to know which inputs to look into
    let startTime = 0;

    if (walletInputTs.length > 0) {
      const recentInputT = walletInputTs.reduce(
        (prev, current) =>
          prev.input.timestamp > current.input.timestamp ? prev : current
      );

      balance = recentInputT.outputs.find(
        output => output.address === this.publicKey
      ).amount;
      startTime = recentInputT.input.timestamp;
    }

    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime) {
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });
    // boiled down to array transactions then boiled that down to transactions devoted to this wallets input then find the most recent one so we can change the balance to the one dedicated in that specified amount as of a result of the transaction
    // also allows us to modify start time so we only get those after the most recent transactions
    // we always want the most up to date balance so use this whenever a transacted is made
    return balance;
  }

  // capture update and replacement of transaction in a pool in the wallet
  createTransaction(recipient, amount, blockchain, transactionPool) {
    // get current balance
    this.balance = this.calculateBalance(blockchain);

    // recipient to designate to..and amount to give
    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceeds balance.`);
      // escape out
      return;
    }
    // returns to us public key if it exists or undefined if not
    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      // exists then update recipient, this references local wallet instance
      transaction.update(this, recipient, amount);
    } else {
      // create new transaction
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  // responsible for approvind awards for miners
  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = "blockchain-wallet";
    return blockchainWallet;
  }
}

module.exports = Wallet;
