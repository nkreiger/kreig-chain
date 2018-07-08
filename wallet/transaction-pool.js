const Transaction = require("../wallet/transaction");

class TransactionPool {
  constructor() {
    // collect transaction objects in this array
    this.transactions = [];
  }

  // default add a transaction...but if it already exists allow it update it like we did earlier with changing outputs for a same id
  updateOrAddTransaction(transaction) {
    // if transaction exists already with same id
    let transactionWithId = this.transactions.find(
      t => t.id === transaction.id
    );
    // if exists
    if (transactionWithId) {
      // changes a specific element in an array index... or updates a previous transaction
      this.transactions[this.transactions.indexOf(transactionWithId)];
    } else {
      // transaction doesnt exist in pool yet
      this.transactions.push(transaction);
    }
  }

  // public key is passed in
  existingTransaction(address) {
    // look through array to find and return certain transaction
    return this.transactions.find(t => t.input.address === address);
  }

  // total
  validTransactions() {
    // total outputs should equal how much they have in the wallet
    // verify data not corrupted
    return this.transactions.filter(transaction => {
      // reduce array of transactions amount into one value
      const outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0); // start it at 0

      if (transaction.input.amount !== outputTotal) {
        console.log(`Invalid transaction from ${transaction.input.address}`);
        // send this transaction out in the filter process, its invalid
        return;
      }

      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}`);
        return;
      }

      return transaction;
    });
  }

  // clear out transaction pool
  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;
