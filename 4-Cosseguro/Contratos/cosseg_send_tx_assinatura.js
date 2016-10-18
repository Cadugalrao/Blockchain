
//comando para executar o arquivo: loadScript("cosseg_send_tx_assinatura.js")

console.log(">>>>>>>>>>>> 1: Inicio do load!");

var erro;
var result;

if(1==1) {
	var funcao;
	
	funcao = cosseguro.alterar_situacao_apolice_para_assinada;
	
	function exec_funcao_simples(obj_funcao) { //Utilizado para chamada de transações que não precisam de parametros
		//console.log(">>>>>>>>>>>>> " + JSON.stringify(obj_funcao.toString(100)));
		
		if (!obj_funcao){
			console.log(">>>>>>>>>>>>> Erro!");
			return;
		}
		

        var diasParaVencimento = 40;
		// passando um parametro de entrada
		obj_funcao.sendTransaction(
			0,
			{from: eth.accounts[0], gas: 4700000}, 
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
                        /*
                        console.log(">>>>>>>>>>>ret_autorizar_acordo > args: " + JSON.stringify(_result.args));
                        console.log(">>>>>>>>>>>ret_autorizar_acordo > index_apolice_cedido: " + _result.args.index_apolice_cedido);
                        console.log(">>>>>>>>>>>ret_autorizar_acordo > situacao_autorizacao: " + _result.args.situacao_autorizacao);
                        console.log(">>>>>>>>>>>ret_autorizar_acordo > sucesso: " + _result.args.sucesso);
                        console.log(">>>>>>>>>>>ret_autorizar_acordo > cod_retorno: " + _result.args.cod_retorno);
                        console.log(">>>>>>>>>>>ret_autorizar_acordo > descricao: " + _result.args.descricao);
                        */
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

                cosseguro.ret_autorizar_acordo.watch(function(_error, _result) {
                    var receipt_ret = web3.eth.getTransactionReceipt(txhash);
                    if (receipt_ret && receipt_ret.transactionHash == txhash) {
                        console.log(">>>>>>>>>>>ret_autorizar_acordo > error: " + _error);
                        console.log(">>>>>>>>>>>ret_autorizar_acordo > result: " + _result);
                        console.log(">>>>>>>>>>>ret_autorizar_acordo > index_apolice_cedido: " + _result.index_apolice_cedido);
                        console.log(">>>>>>>>>>>ret_autorizar_acordo > situacao_autorizacao: " + _result.situacao_autorizacao);
                        console.log(">>>>>>>>>>>ret_autorizar_acordo > sucesso: " + _result.sucesso);
                        console.log(">>>>>>>>>>>ret_autorizar_acordo > cod_retorno: " + _result.cod_retorno);
                        console.log(">>>>>>>>>>>ret_autorizar_acordo > descricao: " + _result.descricao);

                        cosseguro.ret_autorizar_acordo.stopWatching();
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