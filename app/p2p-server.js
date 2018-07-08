const webSocket = require("ws");

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];
// return backs an array of all those localhost addresses, and if it isn't present sets it to empty array
// $ HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://localhost:5001, ws://localhost:5002...

const MESSAGE_TYPES = {
  chain: "CHAIN",
  transaction: "TRANSACTION",
  clear_transactions: "CLEAR_TRANSACTIONS"
};

class P2pServer {
  constructor(blockchain, transactionPool) {
    // give each peer 2 peer server a blockchain and an array of connecteed web socket servers
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  listen() {
    // start up server and create ws
    const server = new webSocket.Server({
      port: P2P_PORT
    });
    // event listener for messages
    // fire a new socket on connection events
    server.on("connection", socket => this.connectSocket(socket));

    this.connectToPeers();

    console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
  }

  connectToPeers() {
    peers.forEach(peer => {
      // ws://localhost:5001 what peer looks like
      // make new websocket module or object
      const socket = new webSocket(peer);
      // now open another event listener with this socket
      socket.on("open", () => this.connectSocket(socket));
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log("Socket connected");
    this.messageHandler(socket);

    //send blockchain to each connected peer server
    this.sendChain(socket);
  }

  messageHandler(socket) {
    // chain on function, first parameter is what your receiving, second is response
    socket.on("message", message => {
      // change to JSON form
      const data = JSON.parse(message);

      // need to handle based on data type now
      switch (data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        case MESSAGE_TYPES.clear_transactions:
          this.transactionPool.clear();
          break;
      }
    });
  }

  sendChain(socket) {
    // send the chain
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.chain,
        chain: this.blockchain.chain
      })
    );
  }

  // send updated blockchain of current instance to all peeers... each socket or node represents a user on your chain
  syncChains() {
    // cycle through each connected socket and run this
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  //send transaction
  sendTransaction(socket, transaction) {
    // send it
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.transaction,
        transaction
      })
    );
  }

  // sync transaction pool across users
  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

  // clear transactions across users
  broadcastClearTransactions() {
    this.sockets.forEach(socket =>
      socket.send(
        JSON.stringify({
          type: MESSAGE_TYPES.clear_transactions
        })
      )
    );
  }
}

module.exports = P2pServer;
