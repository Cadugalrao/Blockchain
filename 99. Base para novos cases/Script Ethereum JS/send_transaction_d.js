
//comando para executar o arquivo: loadScript("send_transaction_d.js")

console.log(">>>>>>>>>>>> 1: Inicio do load!");



// forma para disparar funcos sem parametros de um contrato
// associe a variavel funcao o metodo do contrato que você quer disparar
// Atenção: Sempre disparar uma transação e ESPERAR que ela seja minerada para depois disparar outra!
var funcao = doubler.enter;

function exec_funcao_simples(obj_funcao) { //Utilizado para chamada de transações que não precisam de parametros
	//console.log(">>>>>>>>>>>>> " + JSON.stringify(obj_funcao.toString(100)));
	
	if (!obj_funcao){
		console.log(">>>>>>>>>>>>> Erro!");
		return;
	}
	
	obj_funcao.sendTransaction( 
		{from: eth.accounts[0]}, 
		function (err, result) {
			if (err) {
				console.error(">>>>>>>>>>>> : " + err);
				return;
			}
			txhash = result;
			console.error(">>>>>>>>>>>> Aguarde a mineração da transação!");
			console.error(">>>>>>>>>>>> Codigo da Transação: " + txhash);
			
			filter = web3.eth.filter('latest');
			filter.watch(function(error, result) {
				var receipt = web3.eth.getTransactionReceipt(txhash);
				if (receipt && receipt.transactionHash == txhash) {
					var res = obj_funcao.call();
					//console.log(">>>>>>>>>>>> 8: " + JSON.stringify(res)); //Essa linha linha é utilizada caso o retorno esperado seja um Array
					console.log(">>>>>>>>>>>> Transação minerada!");
					console.log(">>>>>>>>>>>> O retorno simulado: " + res.toString(10));
					filter.stopWatching();
				}
			});
		}
	);
	
	console.log(">>>>>>>>>>>> OK!");
}

exec_funcao_simples(funcao);

console.log(">>>>>>>>>>>> Transações Pendentes de mineração: " + web3.txpool.status.pending);



//////////////////////////////////////////////////////////////////


console.log(">>>>>>>>>>>> 99: Fim do load!");

