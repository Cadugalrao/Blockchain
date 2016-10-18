
//comando para executar o arquivo: loadScript("cosseg_monitor.js")

console.log(">>>>>>>>>>>> 1: Inicio do load!");

	funcao = cosseguro.autorizar_acordo;
	

    cosseguro.ret_autorizar_acordo.watch(function(_error, _result) {
        var receipt = web3.eth.getTransactionReceipt(txhash);
        if (receipt && receipt.transactionHash == txhash) {
            console.log(">>>>>>>>>>>> error: " + _error);
            console.log(">>>>>>>>>>>> result: " + _result);
            console.log(">>>>>>>>>>>> qtde_apolices: " + cosseguro.contar_apolices());
        }
    });

}
/**/

console.log(">>>>>>>>>>>> 99: Fim do load!");