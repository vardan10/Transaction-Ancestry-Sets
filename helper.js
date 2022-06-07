class TransactionAnsester {

    constructor(tx, noOfChildren)
    {
        this.tx = tx;
        this.noOfChildren = noOfChildren;
    }
}


/**
 * 
 * @param {*} allTransactionsInBlock - All transactions inside a block
 * @returns - map of transactionsIds to list of its first-level ansester transaction IDs
 */
function mapTxToInputs(allTransactionsInBlock){
    var transactionsMap = {};

    // Ignore first transaction since its the default tx
    for(let i=1; i<allTransactionsInBlock.length; i++){
        transactionsMap[allTransactionsInBlock[i].txid] = [];
        
        // Loop through all input txs
        for(let j=0; j<allTransactionsInBlock[i].vin.length; j++){
            transactionsMap[allTransactionsInBlock[i].txid].push(allTransactionsInBlock[i].vin[j].txid);
        }
    }
    
    return transactionsMap;

}

/**
 * 
 * @param {*} mapOfTxToInputs - map of transactionsIds to list of its first-level ansester transaction IDs
 * @returns - map of get all ansesters of a transaction
 */
function FindAllTXAncestries(mapOfTxToInputs){

    var resultMap = {}
    let allTx = Object.keys(mapOfTxToInputs);

    for(let i=0; i<allTx.length; i++){
        if(resultMap[allTx[i]] == undefined)
            resultMap[allTx[i]] = dfs(allTx[i], mapOfTxToInputs, [], resultMap);
    }

    return resultMap;
}

/**
 * 
 * @param {*} transaction - transaction ID of the children we need
 * @param {*} mapOfTxToInputs - map of transactionsIds to list of its first-level ansester transaction IDs
 * @param {*} res - output array to store all children - pass as empty
 * @returns - All ansesters of a transaction
 */
function dfs(transaction, mapOfTxToInputs, res, resultMap){

    let children = mapOfTxToInputs[transaction];
    
    // If children not found in this block then ignore
    if(children == undefined) return;

    // For all children get its ansester
    for(let i=0; i<children.length; i++){
        dfs(children[i], mapOfTxToInputs, res, resultMap);

        // If transaction is present in the same block then add it to result so we dont have to do dfs on it again
        if(mapOfTxToInputs[children[i]] != undefined)
            resultMap[children[i]] = clone(res);

        // Only add ansester if transaction is present
        if(mapOfTxToInputs[children[i]] != undefined)
            res.push(children[i]);
    }

    return res;

}

/**
 * 
 * @param {*} mapOfTxToAllInputs - array
 * @returns - cloned array;
 */
function clone(arr){
    return [...arr]
}

/**
 * 
 * @param {*} mapOfTxToAllInputs - map of get all ansesters of a transactions
 * @param {*} count - number of transactions required.
 * @returns - transactions with largest ancestry sets.
 */
function getlargestAnsestrySets(mapOfTxToAllInputs, count){
    var allTransactions = [];
    let res = [];

    let allTxKeys = Object.keys(mapOfTxToAllInputs);

    for(let i=0; i<allTxKeys.length; i++){
        allTransactions.push(new TransactionAnsester(allTxKeys[i], mapOfTxToAllInputs[allTxKeys[i]].length));
    }

    allTransactions.sort(function (first, second) {
        if (first.noOfChildren > second.noOfChildren) {
           return -1;
        }
        if (first.noOfChildren < second.noOfChildren) {
           return 1;
        }
        return 0;
    });

    return allTransactions.slice(0, count);;
    
}

module.exports = {
    mapTxToInputs,
    FindAllTXAncestries,
    getlargestAnsestrySets
} 