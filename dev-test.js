// ################ blockchain test

// // const Block = require("./block");

// // // instance of object to block
// // // const blockObj = new Block("foo", "bar", "zoo", "bar");
// // // console.log(blockObj.toString());
// // // console.log(Block.genesis().toString());
// // const fooBlock = Block.mineBlock(Block.genesis(), "foo");
// // console.log(fooBlock.toString());
// const Blockchain = require("./index");

// const bc = new Blockchain();

// for (let i = 0; i < 20; i++) {
//   console.log(bc.addBlock(`foo ${i}`).toString());
// }

// ######################## wallet test
const Wallet = require("./wallet"); // grab index
const wallet = new Wallet();
console.log(wallet.toString());
