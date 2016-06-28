
//comando para executar o arquivo: loadScript("st_cadu_add.js")

console.log(">>>>>>>>>>>> 1: Inicio do load!");




if(1==1) {
	var funcao;

	//funcao = cadu.add_contador;
	funcao = cadu.liberacao_bloco;
	//funcao = gestaogarantia.incluir_garantia;
	
	function exec_funcao_simples(obj_funcao) { //Utilizado para chamada de transacoes que nao precisam de parametros
		//console.log(">>>>>>>>>>>>> " + JSON.stringify(obj_funcao.toString(100)));
		
		if (!obj_funcao){
			console.log(">>>>>>>>>>>>> Erro!");
			return;
		}
		
		// passando um parametro de entrada
		obj_funcao.sendTransaction("0x361f832d63bf0f756161bf744aa7a4eaad5c8328", 1,
		//obj_funcao.sendTransaction(	
			{from: eth.accounts[0]}, 
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