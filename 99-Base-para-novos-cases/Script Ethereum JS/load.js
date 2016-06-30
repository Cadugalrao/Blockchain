
/*
console.log("0");
personal.unlockAccount(eth.accounts[0], "123mudar")
console.log("1");
var tx = web3.eth.sendTransaction({from: web3.eth.accounts[0], to: web3.eth.accounts[1], value: web3.toWei(3, "ether")});
console.log("2 " + JSON.stringify(tx));
web3.eth.getTransaction(tx);
console.log("3");
*/


//var ABI_Aux = [{"constant":false,"inputs":[{"name":"cpf_a","type":"uint256"},{"name":"valor_a","type":"uint256"},{"name":"observacao_a","type":"bytes32"}],"name":"incluirBemParaGarantia","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"countRegistros","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"registros","outputs":[{"name":"cpf","type":"uint256"},{"name":"empresa","type":"address"},{"name":"contrato","type":"uint256"},{"name":"valor","type":"uint256"},{"name":"observacao","type":"bytes32"}],"type":"function"},{"inputs":[],"type":"constructor"}];

//var garantiaR = eth.contract(ABI_Aux).at("-------");


/*
var garantiaRContract = web3.eth.contract(ABI_Aux);
var garantiaR = garantiaRContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '60606040525b5b6102db806100146000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063319630961461004f5780639bf058a714610079578063ded39a5d1461009c5761004d565b005b61007760048080359060200190919080359060200190919080359060200190919050506100fa565b005b6100866004805050610254565b6040518082815260200191505060405180910390f35b6100b26004808035906020019091905050610269565b604051808681526020018573ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018381526020018281526020019550505050505060405180910390f35b6000600050805480600101828181548183558181151161019e5760050281600502836000526020600020918201910161019d9190610133565b8082111561019957600060008201600050600090556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600050600090556003820160005060009055600482016000506000905550600101610133565b5090565b5b5050509190906000526020600020906005020160005b60a06040519081016040528087815260200160008152602001600081526020018681526020018581526020015090919091506000820151816000016000505560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506040820151816002016000505560608201518160030160005055608082015181600401600050555050505b505050565b60006000600050805490509050610266565b90565b600060005081815481101561000257906000526020600020906005020160005b915090508060000160005054908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806002016000505490806003016000505490806004016000505490508556', 
     gas: 30000000
   }, function(e, contract){
    console.log("e: " + e + ", contract: " + JSON.stringify(contract));
    if (typeof contract.address != 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 });
*/



var ABI_Aux2 = [{"constant":true,"inputs":[],"name":"countRegistros","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"incluirContador","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}];

var garantia = eth.contract(ABI_Aux2).at("0xf8110de8f71683aeac507ad7921635222c47a379");


/*
var garantiaContract = web3.eth.contract(ABI_Aux2);

var garantia = garantiaContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '606060405260006000600050555b5b609580601a6000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480639bf058a7146041578063dceb53ae14606257603f565b005b604c6004805050606f565b6040518082815260200191505060405180910390f35b606d60048050506080565b005b60006000600050549050607d565b90565b6001600060005054016000600050819055505b56',  
     gas: 30000000
   }, function(e, contract)
   {
    console.log("e: " + e + ", contract: " + JSON.stringify(contract));
    if (typeof contract.address != 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
   }
);


*/