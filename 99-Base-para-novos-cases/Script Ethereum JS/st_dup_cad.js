//comando para executar o arquivo: loadScript("st_dup_cad.js")

console.log(">>>>>>>>>>>> 1: Inicio do load!");

if(1==1) {
	
	//personal.unlockAccount(eth.accounts[0], "123mudar");
	
	var funcao;

	funcao = gestao_duplicatas.cadastro_duplicata;
	function exec_funcao_simples(obj_funcao) { //Utilizado para chamada de transacoes que nao precisam de parametros
		//console.log(">>>>>>>>>>>>> " + JSON.stringify(obj_funcao.toString(100)));
		
		if (!obj_funcao){
			console.log(">>>>>>>>>>>>> Erro!");
			return;
		}
		
		//{from: eth.accounts[0],gas:3141592, gasprice:50000000000, startgas:500000}, 
		
		// passando um parametro de entrada
		obj_funcao.sendTransaction("owieoiwoiei 2982398238", 32506110852, 10000000,
			{from: eth.accounts[0]}, 
			function (err, result) {
				if (err) {
					console.error(">>>>>>>>>>>> : " + err);
					return;
				}
				txhash = result;
				console.error(">>>>>>>>>>>> Aguarde a mineracao da transacao!");
				//console.error(">>>>>>>>>>>> Dados de Erro");
				//console.error(">>>>>>>>>>>>     err: " + JSON.stringify(err));
				//console.error(">>>>>>>>>>>>     err: " + err.message);
				var tx = web3.eth.getTransaction(txhash);
				console.error(">>>>>>>>>>>> Dados da Transacao");
				console.error(">>>>>>>>>>>>     Codigo: " + txhash);
				console.error(">>>>>>>>>>>>     nonce: " + tx.nonce);
				
				filter = web3.eth.filter('latest');
				filter.watch(function(error, result) {
					var receipt = web3.eth.getTransactionReceipt(txhash);
					if (receipt && receipt.transactionHash == txhash) {
						//var res = obj_funcao.call();
						//console.log(">>>>>>>>>>>> 8: " + JSON.stringify(res)); //Essa linha linha e utilizada caso o retorno esperado seja um Array
						console.log(">>>>>>>>>>>> Transacao minerada!");
						//console.log(">>>>>>>>>>>> O retorno simulado: " + res.toString(10));
						filter.stopWatching();
					}
				});
			}
		);
		
		console.log(">>>>>>>>>>>> OK!");
	}

	exec_funcao_simples(funcao);
	
	//personal.unlockAccount(eth.accounts[0]);
	
	console.log(">>>>>>>>>>>> Transacoes Pendentes de mineracao: " + web3.txpool.status.pending);

}
/**/


console.log(">>>>>>>>>>>> 99: Fim do load!");