const APIHelper = require('./APIHelper');
const helper = require('./helper');
const constants = require('./constants');

async function main(){

    let blockHash;
    let allTransactions;
    try{
        // Get block hash of 680000th bitcoin block
        blockHash = await APIHelper.getBlock(constants.BLOCK_HEIGHT);

        // Get all transactions using block hash
        allTransactions = await APIHelper.getAllTransactions(blockHash);

    } catch (error){
        throw new Error('Fatal error when trying API calls: ' + error);
    }

    // Filter unwanted data from transactions - create a map of transactionsIds to list of its first-level ansester transaction IDs
    let mapOfTxToInputs = helper.mapTxToInputs(allTransactions);

    // use DFS to get all ansesters of a transaction
    let txAncestries = helper.FindAllTXAncestries(mapOfTxToInputs);

    // Get 10 transactions with largest ancestry sets.
    let largestAnsestrySets = helper.getlargestAnsestrySets(txAncestries, 10);

    // Print 10 transactions with largest ancestry sets.
    console.log(largestAnsestrySets);
    
}



main();