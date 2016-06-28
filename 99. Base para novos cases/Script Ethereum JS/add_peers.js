
//comando para executar o arquivo: loadScript("add_peers.js")


//console.log("1");
//personal.newAccount("123mudar");
//console.log("2");
miner.setEtherbase(eth.accounts[0]);
console.log("3");
primary = eth.accounts[0];
console.log("4");
//admin.sleep(3);
console.log("5");
personal.unlockAccount(eth.accounts[0], "123mudar");
console.log("6");
//Local
admin.addPeer("enode://30a1be95dcda0bd8a47c58ffaa1f2a41e62e580b4a23cbc242ecc24b1d8839d866f0c4ab562d7d34a02c14560032382dc7c35ada2ae8a24b45187f8255af0f78@127.0.0.1:30302?discport=0");

//Server AWS
/*
admin.addPeer("enode://0e30932ba7f57dee8db7d73b8b47e4535ee8993589f9c6a98f248848bdfcac98382f61640ca96f1ee564d9f403d80d7b743ea68196d6fdd56f1107adf0b68faf@172.31.45.166:30301?discport=0");
console.log("6");
admin.addPeer("enode://5f36724baa2e2a023ec64c6f0915580ad3877f72aaba4bebf5046bb9af75155e138e73b038ceba797f11eb96a42d08757b2a7547e4e37d92cf9c7f1315ebb355@172.31.34.224:30301?discport=0");
*/

console.log("7");
//admin.peers;
