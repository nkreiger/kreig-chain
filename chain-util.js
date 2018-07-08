// grab ec part of elliptic module
const EC = require("elliptic").ec; // this is a class
// it takes one argument that defines what curve base cryptography implementation it should use bitcoin uses ...
const ec = new EC("secp256k1"); // standards of efficient prime 256 bits

// get unique id with this mod
const uuidV1 = require("uuid/v1");

// grab hash algorithm package
const SHA256 = require("crypto-js/sha256");

class ChainUtil {
  // generate key pair for public and private key
  static genKeyPair() {
    // returns call to ec instance we made of EC class
    return ec.genKeyPair();
    // this generated key pair object allows us to use methods to get the public and private key in this pair... also assignment for signature base for transaction validation
  }

  // get unique id
  static id() {
    return uuidV1();
  }

  // takes arbitrary data, stringify it and returns hash result
  static hash(data) {
    return SHA256(JSON.stringify(data)).toString();
  }

  // signature verification on each transaction = valid enough to mine
  // data hash is what we want to find as result as decrypting it using the key
  static verifySignature(publicKey, signature, dataHash) {
    // returns actual derived key in hex form
    return ec.keyFromPublic(publicKey, "hex").verify(dataHash, signature);
  }
}

module.exports = ChainUtil;
