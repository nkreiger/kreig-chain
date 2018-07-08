## HOw to use this on postman...cryptocurrency in action

#1. Launch multiple servers...npm run dev ... new one then HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev... and so on

#2. Postman get request to localhost:3002/public-key and copy that key

#3. POST localhost:3001/transact and put this in...
{
"recipient": "address you copied",
"amount": 50
}

#4. GET localhost:3001/transactions to make sure it worked and they exist

#5. GET localhost:3002/transactions same thing

#6. GET localhost:3001/mine-transactions to mine them and broadcast

#7. POST localhost:3001/transact make sure wallet has + reward amount (so currently 50)

#EXTENDing

# GET /balance endpoint allow user to see their balance

# Add transaction fee and include it with miner reward

#frontend
#Route the blockchain-approved reward transactions through its own dedicated server. That way, not everyone can create transactions through the special blockchain wallet.
#An implementation where the Miner’s mine() function only grabs a group of the transactions, and not the entire pool. When the subset of transactions from the pool is included in the chain, they would need to be cleared from the pool, and synchronized across all miners.
