'use strict';

const express = require('express');
const Web3 = require('web3');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://172.31.34.239:8545"));

var gestao_garantiasABI = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bens","outputs":[{"name":"codigo","type":"bytes32"},{"name":"valor","type":"uint256"},{"name":"tipo","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"id_garantia","type":"uint256"},{"name":"id_bem","type":"uint256"}],"name":"incluir_associacao","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"codigo","type":"bytes32"},{"name":"valor","type":"uint256"}],"name":"incluir_garantia","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"garantias","outputs":[{"name":"codigo","type":"bytes32"},{"name":"valor","type":"uint256"},{"name":"ativo","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"contador_associacao","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"codigo","type":"bytes32"},{"name":"valor","type":"uint256"},{"name":"tipo","type":"uint256"}],"name":"incluir_bem","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"contador_bem","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"contador_garantia","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"associacoes","outputs":[{"name":"idx_garantia","type":"uint256"},{"name":"idx_bem","type":"uint256"}],"type":"function"},{"inputs":[],"type":"constructor"}]);
var gestao_garantias = gestao_garantiasABI.at("0x1cd65f3374ff7b7fc50ad04d7ac30fe6fc6177fb");


// App


// Teste de conexao
const app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.get('/conection_test', function (req, res) {
	res.send( "/conection_test" + web3.isConnected());
});

app.get('/', function (req, res) {
	res.send( "/" + web3.isConnected());
});

app.get('/incluir_garantia/:codigo/:valor', function (req, res) {
    var codigo = req.query.codigo;
	var valor = req.query.valor;
	
	var resposta = gestao_garantias.incluir_garantia.sendTransaction(codigo, valor, { from: web3.eth.coinbase });
	
	res.send( "/incluir_garantia" + resposta);
});

app.get('/listar_garantia', function (req, res) {
    
	//

});

app.get('/incluir_bem/:codigo/:valor/:tipo', function (req, res) {
    var codigo = req.query.codigo;
	var valor = req.query.valor;
	var tipo = req.query.tipo;
	
	var resposta = gestao_garantias.incluir_bem.sendTransaction(codigo, valor, tipo, { from: web3.eth.coinbase });
	
	res.send( "/incluir_bem" + resposta);
});

app.get('/listar_bem', function (req, res) {
    
	//

});

app.get('/incluir_associacao/:id_garantia/:id_bem', function (req, res) {
    var id_garantia = req.query.id_garantia;
	var id_bem = req.query.id_bem;    
	
	var resposta = gestao_garantias.incluir_associacao.sendTransaction(id_garantia, id_bem, { from: web3.eth.coinbase });
	
	res.send( "/incluir_associacao" + resposta);
});

app.get('/listar_associacao', function (req, res) {
    
	//

});

// Constants
const PORT = 8080;

app.listen(PORT);
//console.log('Running on http://localhost:' + PORT);