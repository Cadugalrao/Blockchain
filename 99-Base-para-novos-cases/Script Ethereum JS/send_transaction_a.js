
//comando para executar o arquivo: loadScript("send_transaction_a.js")

console.log(">>>>>>>>>>>> 1: Inicio do load!");




if(1==1) {
	var funcao;

	funcao = gestaoduplicata.incluir_duplicata;
	//funcao = gestaogarantia.incluir_garantia;
	
	function exec_funcao_simples(obj_funcao) { //Utilizado para chamada de transacoes que nao precisam de parametros
		//console.log(">>>>>>>>>>>>> " + JSON.stringify(obj_funcao.toString(100)));
		
		if (!obj_funcao){
			console.log(">>>>>>>>>>>>> Erro!");
			return;
		}
		
		// passando um parametro de entrada
		//obj_funcao.sendTransaction("garantia 3", 3211, 0,
		obj_funcao.sendTransaction(new BigNumber('11111111111111', 10), new BigNumber('11111111111111', 10), new BigNumber('11111111111111', 10), 12312313, 4, "1234",
			{from: eth.accounts[0], gas: 99999999}, 
			function (err, result) {
				if (err) {
					console.error(">>>>>>>>>>>> : " + err);
					return;
				}
				txhash = result;
				console.error(">>>>>>>>>>>> Aguarde a mineracao da transacao!");
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
						//console.log(">>>>>>>>>>>> " + result.args.descricao);
						//console.log(">>>>>>>>>>>> O retorno simulado: " + res.toString(10));
						filter.stopWatching();
					}
				});
			}
		);
		
		console.log(">>>>>>>>>>>> OK!");
	}

	exec_funcao_simples(funcao);

	console.log(">>>>>>>>>>>> Transacoes Pendentes de mineracao: " + web3.txpool.status.pending);

}
/**/


console.log(">>>>>>>>>>>> 99: Fim do load!");