
//comando para executar o arquivo: loadScript("cosseg_send_tx.js")

console.log(">>>>>>>>>>>> 1: Inicio do load!");

var erro;
var result;

if(1==1) {
	var funcao;
	
	funcao = cosseguro.incluir_apolice;
	
	function exec_funcao_simples(obj_funcao) { //Utilizado para chamada de transações que não precisam de parametros
		//console.log(">>>>>>>>>>>>> " + JSON.stringify(obj_funcao.toString(100)));
		
		if (!obj_funcao){
			console.log(">>>>>>>>>>>>> Erro!");
			return;
		}
		

        var diasParaVencimento = 40;
		// passando um parametro de entrada
		/*
		incluir_apolice(
			string _codigo_apolice, 
			uint64 _premio_apolice, 
			uint64 _valor_cobertura, 
			uint _dt_vencimento_apolice, 
			string _numero_aditivo, 
			uint16 _tipo, 
			uint16 _percent_comissao, 
			uint16 _percent_desconto, 
			address _seguradora1, 
			uint16 _percent1, 
			address _seguradora2, 
			uint16 _percent2, 
			address _seguradora3, 
			uint16 _percent3
			)
		*/
		obj_funcao.sendTransaction(
			"cod 000", 
			33333, 
			4444444, 
			Date.now() + diasParaVencimento * 24 * 60 * 60,
			49584958495,
			2,
			39,
			43,
			"0x361f832d63bf0f756161bf744aa7a4eaad5c8328", 
			10, 
			"", 
			0, 
			"", 
			0,
			{from: eth.accounts[0], gas: 3500000}, 
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
				filter.watch(function(_error, _result) {
					var receipt = web3.eth.getTransactionReceipt(txhash);
					if (receipt && receipt.transactionHash == txhash) {
						console.log(">>>>>>>>>>>> error: " + _error);
						console.log(">>>>>>>>>>>> result: " + _result);
						console.log(">>>>>>>>>>>> qtde_apolices: " + cosseguro.contar_apolices());

						result = _result;
						error = _error
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