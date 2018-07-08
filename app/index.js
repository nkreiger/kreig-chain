const express = require("express");
const Blockchain = require("../blockchain/index");
const bodyParser = require("body-parser"); // to grab data from req.body
const P2pServer = require("./p2p-server");
// wallet and transactions..crypto part
const Wallet = require("../wallet");
const TransactionPool = require("../wallet/transaction-pool");
// pooling the transactions together across all users will be used through the P2P server

const Miner = require("./miner");

const app = express();
const bc = new Blockchain();

// give user individual wallet
const wallet = new Wallet();
const tp = new TransactionPool();

// p2p server
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());

// grab blocks with data
app.get("/blocks", (req, res) => {
  res.json(bc.chain);
});

// make new block from users
app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);
  // sync chain across peers whenever block is added
  p2pServer.syncChains();
  // should log replacing chain with longer
  res.redirect("/blocks"); // respond with updated chain
});

// view all the transactions
app.get("/transactions", (req, res) => {
  res.json(tp.transactions);
});

// make transaction
app.post("/transact", (req, res) => {
  // assume recipient and data are given via post request
  const { recipient, amount } = req.body;
  // create transaction with local wallet instance
  const transaction = wallet.createTransaction(recipient, amount, bc, tp);
  // broadcast new transaction across netowrk and add them to pool
  p2pServer.broadcastTransaction(transaction);
  // redirect so you can see it
  res.redirect("/transactions");
});

// get public key for sending crypto
app.get("/public-key", (req, res) => {
  res.json({
    publicKey: wallet.publicKey
  });
});

// mine transactions endpoint
app.get("/mine-transactions", (req, res) => {
  const block = miner.mine();
  console.log(`New block added: ${block.toString()}`);
  // allow us to see new mined block
  res.redirect("/blocks");
});

// if user specifies on command line, it will run that so we can run on multiple ports at the same time
const HTTP_PORT = process.env.HTTP_PORT || 3001;

app.listen(HTTP_PORT, () => console.log(`Listening on ${HTTP_PORT}`));
// start web socket server for multiple connections
p2pServer.listen();
