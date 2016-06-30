//comando para executar o arquivo: loadScript("distribuir_ether.js")

console.log(">>>>>>>>>>>> Inicio do JS")

/*
node 1 = 0x3f6b843f2b8b6ea4ec2c18aa8fae5a92bff02079
node 2 = 0x361f832d63bf0f756161bf744aa7a4eaad5c8328
node 3 = 0x0b697fd49ad5e2a30dc1e970e8db1b9d0a1c25b4
node 4 = 0x3c513bb978ab6c4ae7c5f25b61a839332842410d
*/



amount = eth.getBalance(eth.accounts[0]) / 4;

web3.eth.sendTransaction({from: eth.accounts[0], to: '0x3f6b843f2b8b6ea4ec2c18aa8fae5a92bff02079', value: amount});
web3.eth.sendTransaction({from: eth.accounts[0], to: '0x361f832d63bf0f756161bf744aa7a4eaad5c8328', value: amount});
web3.eth.sendTransaction({from: eth.accounts[0], to: '0x0b697fd49ad5e2a30dc1e970e8db1b9d0a1c25b4', value: amount});

console.log(">>>>>>>>>>>> Transações Pendentes de mineração: " + web3.txpool.status.pending);

console.log(">>>>>>>>>>>> Fim do JS ^^^^^^^^^^^^^^^^^^^^^^^^^^^");
