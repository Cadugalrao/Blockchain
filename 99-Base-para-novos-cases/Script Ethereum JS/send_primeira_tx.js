
//comando para executar o arquivo: loadScript("send_primeira_tx.js")

console.log(">>>>>>>>>>>> 1: Inicio do load!");




if(1==1) {
	var funcao;
	
	funcao = gestaogarantia.primeira_tx;
	
	function exec_funcao_simples(obj_funcao) { //Utilizado para chamada de transações que não precisam de parametros
		//console.log(">>>>>>>>>>>>> " + JSON.stringify(obj_funcao.toString(100)));
		
		if (!obj_funcao){
			console.log(">>>>>>>>>>>>> Erro!");
			return;
		}
		
		// passando um parametro de entrada
		obj_funcao.sendTransaction(    //primeira_tx
			{from: eth.accounts[0]}, 
			function (err, result) {
				if (err) {
					console.error(">>>>>>>>>>>> : " + err);
					return;
				}
				txhash = result;
				console.error(">>>>>>>>>>>> Aguarde a mineração da transação!");
				var tx = web3.eth.getTransaction(txhash);
				console.error(">>>>>>>>>>>> Dados da Transação");
				console.error(">>>>>>>>>>>>     Codigo: " + txhash);
				console.error(">>>>>>>>>>>>     nonce: " + tx.nonce);
				
				filter = web3.eth.filter('latest');
				filter.watch(function(error, result) {
					var receipt = web3.eth.getTransactionReceipt(txhash);
					if (receipt && receipt.transactionHash == txhash) {
						//var res = obj_funcao.call();
						//console.log(">>>>>>>>>>>> 8: " + JSON.stringify(res)); //Essa linha linha é utilizada caso o retorno esperado seja um Array
						console.log(">>>>>>>>>>>> Transação minerada!");
						//console.log(">>>>>>>>>>>> O retorno simulado: " + res.toString(10));
						filter.stopWatching();
					}
				});
			}
		);
		
		console.log(">>>>>>>>>>>> OK!");
	}

	exec_funcao_simples(funcao);

	console.log(">>>>>>>>>>>> Transações Pendentes de mineração: " + web3.txpool.status.pending);

}
/**/


console.log(">>>>>>>>>>>> 99: Fim do load!");