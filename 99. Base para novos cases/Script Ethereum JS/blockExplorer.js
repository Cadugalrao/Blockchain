console.log(">>>>>>>>>>>> Inicio do JS");

//loadScript("blockExplorer.js")

var blocoInicial = 384;
var totalBlocos = 385;
for (var b = blocoInicial; b < totalBlocos; b++) {
	var j = eth.getBlock(b, true)
	if (j.transactions.length > 0) {
		console.log("> Bloco: " + b);
		for (var t = 0; t < j.transactions.length; t++) {
			console.log(">>>> Transação: " + t);
			console.log(">>>> " + web3.toAscii(j.transactions[t].input));
		}
	}
}


//for (var i=0; i<100; i++)
//	console.log(i + " - |" + web3.toAscii(web3.eth.getStorageAt("0x35824b61af345542b4c1561b69ee6ed3e4ae00fc", i)) + "|");

console.log(">>>>>>>>>>>> Fim do JS ^^^^^^^^^^^^^^^^^^^^^^^^^^^");