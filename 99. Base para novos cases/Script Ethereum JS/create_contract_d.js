//comando para executar o arquivo: loadScript("create_contract_d.js")


console.log(">>>>>>>>>>>> Inicio do JS")

//address_criado: 
/*
Constantes
	
Funcões que são percistentes

*/

var doublerContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"participants","outputs":[{"name":"etherAddress","type":"address"},{"name":"amount","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"collectedFees","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"payoutIdx","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"balance","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"enter","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}]);
var doubler = doublerContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '6060604052600060016000505560006003600050555b5b6102db806100246000396000f360606040523615610069576000357c01000000000000000000000000000000000000000000000000000000009004806335c1d3491461007a5780639003adfe146100c3578063a60f3588146100e6578063b69ef8a814610109578063e97dcb621461012c57610069565b6100785b61007561013b565b5b565b005b6100906004808035906020019091905050610269565b604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b6100d060048050506102c9565b6040518082815260200191505060405180910390f35b6100f360048050506102c0565b6040518082815260200191505060405180910390f35b61011660048050506102d2565b6040518082815260200191505060405180910390f35b610139600480505061013b565b005b60006000600a9150600060005080549050905060016000600050818180549050019150818154818355818115116101d5576002028160020283600052602060002091820191016101d4919061018b565b808211156101d05760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560018201600050600090555060010161018b565b5090565b5b5050505033600060005082815481101561000257906000526020600020906002020160005b5060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555081600060005082815481101561000257906000526020600020906002020160005b50600101600050819055508160036000828282505401925050819055505b5050565b600060005081815481101561000257906000526020600020906002020160005b915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010160005054905082565b60016000505481565b60026000505481565b6003600050548156', 
     gas: 3000000
   }, function(e, contract){
   console.log(e, JSON.stringify(contract));
    if (typeof contract.address != 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 });

console.log(">>>>>>>>>>>> Transações Pendentes de mineração: " + web3.txpool.status.pending);


console.log(">>>>>>>>>>>> Fim do JS ^^^^^^^^^^^^^^^^^^^^^^^^^^^")