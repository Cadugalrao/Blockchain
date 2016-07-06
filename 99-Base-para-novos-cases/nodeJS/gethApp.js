'use strict';

const Web3 = require('web3');
var fs = require('fs');

// Constants
//const PORT = 9090;
const PORT = 80;


var app = require('express')();
var server = require('http').Server(app);
//var io = require('socket.io')(server});
var io = require('socket.io')(server, {v: '/node/socket.io'});

var socketObj;

// creating a new websocket to keep the content updated without any AJAX request

io.sockets.on('connection', function(socket) {

  console.log(__dirname);

  socketObj = socket;

});


// App
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client.html');
    console.log('pagina 1');
});

app.get('/app', function (req, res) {
    var web3_node1 = new Web3();

    web3_node1.setProvider(new web3_node1.providers.HttpProvider('http://ec2-52-50-42-100.eu-west-1.compute.amazonaws.com:80'));

    var gestao_garantiasABI = [{"constant":false,"inputs":[{"name":"_id_garantia","type":"bytes32"},{"name":"_id_bem","type":"uint32"},{"name":"tipo","type":"int32"}],"name":"liberar_bem_e_direito","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bens","outputs":[{"name":"codigo","type":"bytes32"},{"name":"valor","type":"uint64"},{"name":"valor_atualizado","type":"uint64"},{"name":"tipo","type":"uint32"}],"type":"function"},{"constant":false,"inputs":[{"name":"id_garantia","type":"bytes32"},{"name":"id_bem","type":"uint32"},{"name":"percent","type":"uint32"}],"name":"incluir_associacao","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"entrada","type":"bytes32"},{"name":"inicial","type":"uint32"},{"name":"tamanho","type":"uint32"}],"name":"subString","outputs":[{"name":"retorno","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"index_bem","type":"uint32"},{"name":"valor_atualizado","type":"uint64"}],"name":"alterar_bem","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"},{"name":"node","type":"bytes32"}],"name":"incluir_permissao","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"b","type":"bytes32"},{"name":"char","type":"uint256"}],"name":"charAt","outputs":[{"name":"","type":"bytes1"}],"type":"function"},{"constant":false,"inputs":[{"name":"index_garantia","type":"uint32"},{"name":"valor_atualizado","type":"uint64"}],"name":"alterar_garantia","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"garantias","outputs":[{"name":"codigo","type":"bytes32"},{"name":"valor","type":"uint64"},{"name":"valor_atualizado","type":"uint64"}],"type":"function"},{"constant":true,"inputs":[],"name":"contador_associacao","outputs":[{"name":"","type":"uint32"}],"type":"function"},{"constant":true,"inputs":[],"name":"contador_bem","outputs":[{"name":"","type":"uint32"}],"type":"function"},{"constant":false,"inputs":[{"name":"codigo","type":"bytes32"},{"name":"valor","type":"uint64"}],"name":"incluir_bem","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"codigo","type":"bytes32"},{"name":"valor","type":"uint64"}],"name":"incluir_garantia","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"contador_garantia","outputs":[{"name":"","type":"uint32"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"associacoes","outputs":[{"name":"id_garantia","type":"bytes32"},{"name":"id_bem","type":"uint32"},{"name":"percentual","type":"uint32"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"codigo_item_acessado","type":"uint32"},{"indexed":false,"name":"codigo","type":"bytes32"},{"indexed":false,"name":"valor","type":"uint64"},{"indexed":false,"name":"string_com_erro","type":"bytes32"},{"indexed":false,"name":"codigo_erro","type":"int256"}],"name":"ReturnBem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"codigo_item_acessado","type":"uint32"},{"indexed":false,"name":"codigo","type":"bytes32"},{"indexed":false,"name":"valor","type":"uint64"},{"indexed":false,"name":"string_com_erro","type":"bytes32"},{"indexed":false,"name":"codigo_erro","type":"int256"}],"name":"ReturnBemAlt","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"codigo_item_acessado","type":"uint32"},{"indexed":false,"name":"codigo","type":"bytes32"},{"indexed":false,"name":"valor","type":"uint64"},{"indexed":false,"name":"string_com_erro","type":"bytes32"},{"indexed":false,"name":"codigo_erro","type":"int256"}],"name":"ReturnGarantia","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"codigo_item_acessado","type":"uint32"},{"indexed":false,"name":"codigo","type":"bytes32"},{"indexed":false,"name":"valor","type":"uint64"},{"indexed":false,"name":"string_com_erro","type":"bytes32"},{"indexed":false,"name":"codigo_erro","type":"int256"}],"name":"ReturnGarantiaAlt","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"codigo_item_acessado","type":"uint32"},{"indexed":false,"name":"id_garantia","type":"bytes32"},{"indexed":false,"name":"index_g","type":"uint256"},{"indexed":false,"name":"id_bem","type":"uint32"},{"indexed":false,"name":"percentual","type":"uint32"},{"indexed":false,"name":"total_percent_aloc_bem","type":"uint32"},{"indexed":false,"name":"string_com_erro","type":"bytes32"},{"indexed":false,"name":"valor_erro","type":"int256"}],"name":"ReturnAssociacao","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"endereco_banco","type":"address"},{"indexed":false,"name":"permissao","type":"bytes32"},{"indexed":false,"name":"string_com_erro","type":"bytes32"},{"indexed":false,"name":"valor_erro","type":"int256"}],"name":"ReturnPermissao","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"id_bem","type":"uint32"},{"indexed":false,"name":"string_com_erro","type":"bytes32"},{"indexed":false,"name":"valor_erro","type":"int256"}],"name":"ReturnLiberacao","type":"event"}];
    var gestao_garantiasAddress = "0xbbbc8275f9f355211020a52957246cd763e48484";
    var gestao_garantiasABI_o = web3_node1.eth.contract(gestao_garantiasABI);
    var gestao_garantias = gestao_garantiasABI_o.at(gestao_garantiasAddress);

    var total_loops = gestao_garantias.contador_garantia();
    var mensagem = 'Total de registros: ' + total_loops;
    res.send(mensagem + '\n');

    //for (var i=total_loops; i > 0; i--) {

    //socketObj.volatile.emit('notification', mensagem);
    socketObj.emit('notification', mensagem);

    console.log('pagina 2');
});

//app.listen(PORT);
server.listen(PORT);
console.log('Running on http://localhost:' + PORT);
console.log('Running on http://ec2-54-171-185-229.eu-west-1.compute.amazonaws.com:' + PORT);
console.log('Running on http://ec2-54-171-185-229.eu-west-1.compute.amazonaws.com/node');
