const ChainUtil = require("../chain-util");
// might have to change
const { MINING_REWARD } = require("../config");

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null; // for now
    this.outputs = []; // output data
  }

  // update transaction without creating full new
  update(senderWallet, recipient, amount) {
    // delivers more of the senders currency
    // output is the amount that the sender ends up with... so balance - sent
    // this finds output that was prev send by matching the address to the key of the sender
    const senderOutput = this.outputs.find(
      output => output.address === senderWallet.publicKey
    );

    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance. This is invalid.`);
      return;
    }
    // now we know its valid we can update the amount in their output and subtract the amount from the provided output transaction
    senderOutput.amount = senderOutput.amount - amount;
    // give new transaction new output
    this.outputs.push({
      amount,
      address: recipient
    });
    // this references current transaction instance
    Transaction.signTransaction(this, senderWallet);

    return this;
    // transaction update function handles adding a new transaction, or new output object to an existing transaction by the sender so you don't have to create a new one every time you send again
    // it adds a new output for a new recipient and resigns the transaction
  }

  static transactionWithOutputs(senderWallet, outputs) {
    // refers to own transaction class with new call
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }
  // return new instance with proper output set
  static newTransaction(senderWallet, recipientAddress, amount) {
    // can't exceed current balance
    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance, please add funds.`);
      return;
    }
    // proper output
    // ... es6 spread operator to push two objects as two different arrays, one at a time
    return Transaction.transactionWithOutputs(senderWallet, [
      {
        amount: senderWallet.balance - amount,
        address: senderWallet.publicKey
      },
      {
        amount,
        address: recipientAddress
      }
    ]);
  }

  static rewardTransaction(minerWallet, blockchainWallet) {
    return Transaction.transactionWithOutputs(blockchainWallet, [
      {
        amount: MINING_REWARD,
        address: minerWallet.publicKey
      }
    ]);
  }

  // senderWallet has balance, and signing ability
  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    };
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;
