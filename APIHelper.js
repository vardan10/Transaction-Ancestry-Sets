const axios = require('axios').default;
const constants = require('./constants');

/**
 * 
 * @param {*} blockNumber - Number of the block.
 * @returns - Hash of the block.
 */
async function getBlock(blockNumber){
    try {
        let res = await axios.get(constants.bLOCKSTREAM_API_URL + "block-height/" + blockNumber);
        return res.data;
    } catch(error){
        throw new Error('Fatal error when trying GET API call: ' + error);
    }
}


/**
 * 
 * @param {*} blockHash - Hash of the block to get all transactions
 * @returns - All transactions in the block.
 */
async function getAllTransactions(blockHash){
    let startIdx = 0;
    let gotAllTransactions = false;
    let allTx = [];

    // Keep on making API calls until we get all transactions
    while(!gotAllTransactions){
        try{
            res = await axios.get(constants.bLOCKSTREAM_API_URL + "block/" + blockHash + "/txs/" + startIdx);
            allTx.push(...res.data);
            startIdx += 25;
        } catch(error){

            // If some error other than bad request which occurs when no more transtions. 
            if(error.code != "ERR_BAD_REQUEST"){
                throw new Error('Fatal error when trying GET API call: ' + error);
            }
            
            gotAllTransactions = true;
            break;
        }
    }
    
    return allTx;
}

module.exports = {
    getBlock,
    getAllTransactions
} 