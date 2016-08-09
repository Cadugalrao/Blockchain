'use strict';

const Web3 = require('web3');
var BigNumber = require('big-number');
var fs = require('fs');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

var web3_node1 = new Web3();
var web3_node2 = new Web3();
var web3_node3 = new Web3();
var web3_node4 = new Web3();
//web3_node1.setProvider(new web3_node1.providers.HttpProvider('http://ec2-52-50-42-100.eu-west-1.compute.amazonaws.com:80'));
web3_node1.setProvider(new web3_node1.providers.HttpProvider('http://localhost:8545'));
//web3_node2.setProvider(new web3_node1.providers.HttpProvider('http://localhost:8545'));
//web3_node3.setProvider(new web3_node1.providers.HttpProvider('http://localhost:8545'));
//web3_node4.setProvider(new web3_node1.providers.HttpProvider('http://localhost:8545'));

var cosseguroABI = [{"constant":true,"inputs":[{"name":"_adress_aux","type":"address"},{"name":"_index_acordo","type":"uint256"}],"name":"consultar_acordo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint64"},{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"contar_apolices","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"},{"name":"_index_seguradora","type":"uint256"}],"name":"consultar_apolice_seguradora","outputs":[{"name":"","type":"string"},{"name":"","type":"uint64"},{"name":"","type":"uint64"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint16"}],"type":"function"},{"constant":false,"inputs":[{"name":"_index_apolice_cedido","type":"uint256"},{"name":"_index_acordo_aceito","type":"uint256"},{"name":"_addr_cedido","type":"address"}],"name":"autorizar_acordo","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"compare","outputs":[{"name":"","type":"int256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"equal","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"consultar_apolice","outputs":[{"name":"","type":"string"},{"name":"","type":"uint64"},{"name":"","type":"uint64"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"contar_seguradoras","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_haystack","type":"string"},{"name":"_needle","type":"string"}],"name":"indexOf","outputs":[{"name":"","type":"int256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_index_apolice","type":"uint256"},{"name":"_percent_acordo","type":"uint16"},{"name":"_addr_seguradora_aceito","type":"address"}],"name":"incluir_acordo","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_codigo","type":"string"},{"name":"_premio","type":"uint64"},{"name":"_cobertura","type":"uint64"},{"name":"_dt_vencimento","type":"uint256"}],"name":"incluir_apolice","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_index_acordo","type":"uint256"}],"name":"consultar_acordo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint64"},{"name":"","type":"bool"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"codigo","type":"string"},{"indexed":false,"name":"premio","type":"uint64"},{"indexed":false,"name":"cobertura","type":"uint64"},{"indexed":false,"name":"dt_vencimento","type":"uint256"},{"indexed":false,"name":"qtde_seguradoras","type":"uint256"},{"indexed":false,"name":"index_array_apolice","type":"uint256"},{"indexed":false,"name":"index_array_seguradoras","type":"uint256"},{"indexed":false,"name":"index_array_acordo","type":"uint256"},{"indexed":false,"name":"sucesso","type":"bool"},{"indexed":false,"name":"cod_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_incluir_apolice","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"index_apolice","type":"uint256"},{"indexed":false,"name":"percent_acordo","type":"uint64"},{"indexed":false,"name":"addr_seguradora_aceito","type":"address"},{"indexed":false,"name":"index_array_acordo","type":"uint256"},{"indexed":false,"name":"sucesso","type":"bool"},{"indexed":false,"name":"cod_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_incluir_acordo","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"index_apolice_cedido","type":"uint256"},{"indexed":false,"name":"index_acordo_aceito","type":"uint256"},{"indexed":false,"name":"addr_cedido","type":"address"},{"indexed":false,"name":"sucesso","type":"bool"},{"indexed":false,"name":"cod_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_autorizar_acordo","type":"event"}];

const cosseguroAddress = "0xe3c88eeea579926792fec2e2a7ee18db4fd37f83"; //localhost

var cosseguroABI_o = web3_node1.eth.contract(cosseguroABI);
var cosseguro = cosseguroABI_o.at(cosseguroAddress);

//const PORT = 80;
const PORT = 9090;
    
var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var session = require('express-session');
app.use(session({
    secret: 'Accenture-Cadu-e-Plata', 
    saveUninitialized: true, 
    resave: false
}));

var server = require('http').Server(app);
var sio = require('socket.io')(server);
var io = null;
const users = {};
const txHashs = {};

var socketObj;

server.listen(PORT, "localhost");
console.log('Running on http://localhost:' + PORT);
//console.log('Running on http://ec2-54-171-185-229.eu-west-1.compute.amazonaws.com:' + PORT);
//console.log('Running on http://ec2-54-171-185-229.eu-west-1.compute.amazonaws.com/node');

app.get('/', function (req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    var _userName = "";
    if (typeof users[req.sessionID] !== 'undefined' && users[req.sessionID])
        _userName = users[req.sessionID].userName;

    res.render('index', {
      sessionID: req.sessionID,
      ip: ip,
      userName: _userName,
      titulo: "Cosseguro",
      tituloHTML: "Cosseguro"
    });
    console.log('>>>>> app.get >> / || index.ejs');
});

sio.sockets.on('connection', (socket) => {
  socket.on('adduser', (sessionID) => {
    socket.username = sessionID;
    var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;

    users[sessionID] = {"ip": ip, "userName": "", "socketId": socket.id};

    console.log("Novo usuario conectado: " + sessionID);

    socket.emit(
        'servernotification', {
            connected: true,
            toSelf: true,
            sessionID: sessionID
        }
    );
  });

  socket.on('disconnect', () => {
    //delete users[socket.username];
    console.log("Usuario desconectado: " + socket.username);
    socket.broadcast.emit('servernotification', { username: socket.username });
  });
});

function sessionValid(userName, req) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(">> function sessionValid >> ponto 1 >> userName = \"" + userName + "\"");
    console.log(">> function sessionValid >> ponto 1 >> req.sessionID = \"" + req.sessionID + "\"");
    console.log(">> function sessionValid >> ponto 1 >> users[" + req.sessionID + "] = \"" + JSON.stringify(users[req.sessionID]) + "\"");
    if (typeof users[req.sessionID] !== 'undefined' && users[req.sessionID]) {
        console.log(">> function sessionValid >> ponto 2 >> users[req.sessionID] = \"" + users[req.sessionID] + "\"");
        
        var ip_aux = users[req.sessionID].ip;
        var userName_aux = users[req.sessionID].userName;
            
        if (ip_aux != "") {
            
            console.log(">> function sessionValid >> ponto 2 >> ip_aux = \"" + ip_aux + "\"");
            if (ip_aux != ip) {  
                console.log(">> function sessionValid >> ponto 3 (Usuario Invalido, pelo Ip) >> ip = \"" + ip + "\"");
                return false;
            }

            if (userName != "") {
                if (userName_aux != userName) {
                    console.log(">> function sessionValid >> ponto 4 (Usuario Invalido, pelo Username) >> userName_aux = \"" + userName_aux + "\"");
                    return false;
                }
            }

            console.log(">> function sessionValid >> ponto 5 (Usuario valido)");
            return true;

        } else {
            console.log(">> function sessionValid >> ponto 6 (Usuario Invalido, ip = \"\") >> ip_aux = \"" + ip_aux + "\"");
            return false;
        }
    } else {
        console.log(">> function sessionValid >> ponto 7 (Usuario Invalido, users[req.sessionID] = Undifined) >> users[req.sessionID] = \"" + users[req.sessionID] + "\"");
        return false;
    }
}

app.post('/login', function (req, res) {
    var usuario = req.body.usuario;
    var senha = req.body.senha;
    
    res.writeHead("200", {"Content-Type": "application/json"});

    var retorno = {};
    retorno.msg = "";
    retorno.msgTecnica = "";
    retorno.sucesso = true;
    

    if (!sessionValid("", req)) {
        retorno.msg = "Sessao não foi criada. Recarregue a página";
        retorno.msgTecnica = "app.post('/login', function (req, res) >> if (!sessionValid(\"\", req)) {";
        retorno.sucesso = false;
    } else {
        if (usuario == "rodrigo" && senha == "plata") { //incluir validação de usuario pelo MongoDB
            users[req.sessionID].userName = usuario;
            console.log('>>>>> app.post >> /login >> usuário autenticado >> userName = ' + usuario);
            console.log('>>>>> app.post >> /login >> usuário autenticado >> req.sessionID = ' + req.sessionID);
            console.log('>>>>> app.post >> /login >> usuário autenticado >> users[' + req.sessionID + '] = ' + JSON.stringify(users[req.sessionID]));

            retorno.msg = "Sessao validada";
            retorno.sucesso = true;
        } else {
            retorno.msg = "Usuário e senha inválidos";
            retorno.sucesso = false;
        }
    }

    res.end(JSON.stringify(retorno));

    console.log('>>>>> app.post >> /login');
});

/////////////////////////////////////////////
// inicio apolice                          //
/////////////////////////////////////////////

app.post('/cadastrar_apolice', urlencodedParser, function (req, res) {
    var codigo_op = req.body.codigo_op;
    var chave_duplicata = req.body.chave_duplicata;
    var cpf_cnpj_sacado = formata_numero_subida(req.body.cpf_cnpj_sacado);
    var cnpj_emissor = formata_numero_subida(req.body.cnpj_emissor);
    var valor_duplicata = req.body.valor_duplicata;
    var situacao_nova_duplicata = req.body.situacao_nova_duplicata;
    
    var retorno = {};
    retorno.funcao = "Inclus&atilde;o de duplicata";
    retorno.msg = "";
    retorno.msgTecnica = "";
    retorno.sucesso = true;
    retorno.txHash = "";
    retorno.retornoApresentado = false;
    retorno.sucesso_alt_blockchain = false;
    retorno.mensagem_blockchain = "";
    retorno.dados_duplicata = {};
    retorno.dados_duplicata.chave = chave_duplicata;
    retorno.dados_duplicata.codigo_op = codigo_op;
    retorno.dados_duplicata.cpf_cnpj_sacado = cpf_cnpj_sacado;
    retorno.dados_duplicata.cnpj_emissor = cnpj_emissor;
    retorno.dados_duplicata.valor_duplicata = valor_duplicata;
    retorno.dados_duplicata.situacao_nova_duplicata = situacao_nova_duplicata;
    
    res.writeHead("200", {"Content-Type": "application/json"});
    
    if (!sessionValid(req.body.usuario, req)) {
        retorno.msg = "usuário inválido!";
        retorno.msgTecnica = "/cadastrar_duplicata >> sessionValid -> req.body.usuario = " + req.body.usuario;
        console.log(">>>>> " + retorno.msgTecnica);
        res.end(JSON.stringify(retorno));
        return false;
    }

    if (!validacao_simples(codigo_op)) {
        retorno.msg += "Código da opração: inválido\n";
        retorno.sucesso = false;
    }
    
    if (!validacao_simples(chave_duplicata)) {
        retorno.msg += "Chave: inválida\n";
        retorno.sucesso = false;
    }
    
    if (!validacao_simples(req.body.cpf_cnpj_sacado)) {
        retorno.msg += "CPF ou CNPJ da Sacado: inválido\n";
        retorno.sucesso = false;
    }
        
    if (!validacao_simples(req.body.cnpj_emissor)) {
        retorno.msg += "CNPJ do emissor: inválido\n";
        retorno.sucesso = false;
    }
    
    if (!validacao_simples(req.body.valor_duplicata)) {
        retorno.msg += "Valor: inválido\n";
        retorno.sucesso = false;
    }

    if (situacao_nova_duplicata.trim().length == 0) {
        retorno.msg += "Situacao da nova duplicata: inválida\n";
        retorno.sucesso = false;
    }
    
    if (!retorno.sucesso) {
        retorno.msg = "Verifique o(s) erro(s) abaixo:\n" + retorno.msg;
        res.end(JSON.stringify(retorno));
        console.log(">>>> cadastrar_duplicata >> ponto 1.5 >> retorno.msg = " + retorno.msg);
        return;
    }

    console.log(">>>> cadastrar_duplicata >> ponto 2");
    
    var chave_duplicata_big = new BigNumber(chave_duplicata, 10);
    var cnpj_emissor_big = new BigNumber(cnpj_emissor, 10);
    var cpf_cnpj_sacado_big = new BigNumber(cpf_cnpj_sacado, 10);

    valor_duplicata = formata_valor_subida(valor_duplicata);
    
    cosseguro.incluir_duplicata.sendTransaction(chave_duplicata_big, cnpj_emissor_big, cpf_cnpj_sacado_big, valor_duplicata, situacao_nova_duplicata, codigo_op, {
		from: web3_node1.eth.coinbase, gas: 3500000 }, function(err, txHash) {
            if (err != null) {
                retorno.msg = "Erro ao tentar incluir uma duplicata";
                retorno.msgTecnica = "cosseguro.incluir_duplicata.sendTransaction => " + err;
                retorno.sucesso = false;
                retorno.txHash = txHash;
                retorno.retornoApresentado = false;
                retorno.sucesso_alt_blockchain = "";
                retorno.mensagem_blockchain = "";
                retorno.dados_duplicata = {};
                retorno.dados_duplicata.chave = chave_duplicata;
                retorno.dados_duplicata.codigo_op = codigo_op;
                retorno.dados_duplicata.cpf_cnpj_sacado = cpf_cnpj_sacado;
                retorno.dados_duplicata.cnpj_emissor = cnpj_emissor;
                retorno.dados_duplicata.valor_duplicata = valor_duplicata;
                retorno.dados_duplicata.situacao_nova_duplicata = situacao_nova_duplicata;

                res.end(JSON.stringify(retorno));
            } else {
                retorno.msg = "Em andamento a minera&ccedil;&atilde;o da nova duplicata";
                console.log(">>>> cadastrar_operacao >> retorno.msg: " + retorno.msg);
                retorno.sucesso = true;
                retorno.txHash = txHash;
                retorno.retornoApresentado = false;
                retorno.sucesso_alt_blockchain = "";
                retorno.mensagem_blockchain = "";
                retorno.dados_duplicata = {};
                retorno.dados_duplicata.chave = chave_duplicata;
                retorno.dados_duplicata.codigo_op = codigo_op;
                retorno.dados_duplicata.cpf_cnpj_sacado = cpf_cnpj_sacado;
                retorno.dados_duplicata.cnpj_emissor = cnpj_emissor;
                retorno.dados_duplicata.valor_duplicata = valor_duplicata;
                retorno.dados_duplicata.situacao_nova_duplicata = situacao_nova_duplicata;

                txHashs[txHash] = users[req.sessionID].socketId; //utilizado para que o eventoi possa dar o retorno para o client correto.
                
                res.end(JSON.stringify(retorno));
            }
        }
    );

    sio.sockets.connected[users[req.sessionID].socketId].emit('notification', mensagem);
    console.log('>>>>> app.post >> /cadastrar_duplicata');
});

//event ret_incluir_apolice(string codigo, uint64 premio, uint64 cobertura, uint dt_vencimento, uint qtde_seguradoras, uint index_array_apolice, uint index_array_seguradoras, uint index_array_acordo, bool sucesso, int cod_retorno, string descricao);
cosseguro.ret_incluir_acordo(function(error, result){
    console.log('>>>>> event cosseguro.ret_alterar_duplicata >> evento recebido do GETH e enviado para o client >> ponto 1');
    var retorno = {};
    
    retorno.msg = "";
    retorno.txHash = result.transactionHash;
    console.log('>>>>> event cosseguro.ret_alterar_duplicata >> ponto 2 >> result.transactionHash = ' + result.transactionHash);
    console.log('>>>>> event cosseguro.ret_alterar_duplicata >> ponto 3 >> txHashs[result.transactionHash] = ' + txHashs[result.transactionHash]);
    retorno.retornoApresentado = false;
    retorno.funcao = "Inclus&atilde;o de operação";
    retorno.mensagem_blockchain = result.args.descricao;
    retorno.cod_erro = result.args.cod_erro;
    retorno.dados_duplicata = {};
    retorno.dados_duplicata.chave = result.args.chave;
    retorno.dados_duplicata.codigo_op = result.args.codigo_op;
    retorno.dados_duplicata.index_alocacao = result.args.index_alocacao;
    retorno.dados_duplicata.cpf_cnpj_sacado = result.args.cpf_cnpj_sacado;
    retorno.dados_duplicata.cnpj_emissor = result.args.cnpj_emissor;
    retorno.dados_duplicata.valor_duplicata = result.args.valor;
    retorno.dados_duplicata.situacao_nova_duplicata = result.args.situacao;
    
    if (error != null) {
        retorno.msgTecnica = "Codigo do erro: " + result.args.cod_erro + '\n descricao: ' + result.args.descricao;
        retorno.sucesso_alt_blockchain = false;
    
    } else {
        var cod_erro = parseInt(result.args.cod_erro);
        retorno.sucesso_alt_blockchain = ((cod_erro < 0) ? true : false);
    }

    sio.sockets.connected[txHashs[result.transactionHash]].emit('retorno_sendTransaction', JSON.stringify(retorno));
    console.log('>>>>> event cosseguro.ret_alterar_duplicata >> evento recebido do GETH e enviado para o client >> ponto 2');
});

app.post('/consultar_apolice', urlencodedParser, function (req, res) {
    var retorno = {};
    retorno.msg = "";
        
    res.writeHead(200, {"Content-Type": "application/json"});
    
    console.log('>>>>> app.post >> /consulta >> ponto 1 >> ' + req.body.usuario);


    if (!sessionValid(req.body.usuario, req)) {
        retorno.msg = "usuário inválido!";
        retorno.msgTecnica = "sessionValid -> req.body.usuario = " + req.body.usuario;
        retorno.sucesso = "false"; 
        res.end(JSON.stringify(retorno));
        return;
    }
    
    console.log('>>>>> app.post >> /consulta >> ponto 2 >> ' + req.body.usuario);

    retorno.sucesso = "true";
    
    var total_operacoes = cosseguro.contar_operacoes();
    retorno.msg = "Total de opreções: " + total_operacoes;

    console.log('>>>>> app.post >> /consulta >> ponto 3 >> ' + total_operacoes);

    res.end(JSON.stringify(retorno));
    sio.sockets.connected[users[req.sessionID].socketId].emit('notification', JSON.stringify(retorno));

    console.log('>>>>> app.post >> /consulta');
});

/////////////////////////////////////////////
// fim apolice                             //
/////////////////////////////////////////////


/////////////////////////////////////////////
// inicio acordo                           //
/////////////////////////////////////////////

app.post('/cadastrar_acordo', urlencodedParser, function (req, res) {
    var retorno = {};
    retorno.funcao = "Inclus&atilde;o de operação";
    
    var codigo_operacao = req.body.codigo_operacao;
    var valor_operacao = req.body.valor_operacao;

    retorno.msg = "";
    retorno.msgTecnica = "";
    retorno.sucesso = true;
    retorno.txHash = "";
    retorno.retornoApresentado = "";
    retorno.sucesso_alt_blockchain = "";
    retorno.mensagem_blockchain = "";
    retorno.dados_operacao = {};
    retorno.dados_operacao.codigo_operacao = codigo_operacao;
    retorno.dados_operacao.valor_operacao = valor_operacao;

    res.writeHead(200, {"Content-Type": "application/json"});
    
    if (!sessionValid(req.body.usuario, req)) {
        retorno.msg = "usuário inválido!";
        retorno.msgTecnica = "/cadastrar_operacao >> sessionValid -> req.body.usuario = " + req.body.usuario;
        console.log(">>>>> " + retorno.msgTecnica);
        res.end(retorno);
        return;
    }

    if (!validacao_simples(codigo_operacao)) {
        retorno.msg += "Código da opração: inválido\n";
        retorno.sucesso = false;
    }
    
    if (!validacao_simples(valor_operacao)) {
        retorno.msg += "Valor: inválido\n";
        retorno.sucesso = false;
    }
    
    if (!retorno.sucesso) {
        retorno.msg = "Verifique o(s) erro(s) abaixo:\n" + retorno.msg;
        res.end(JSON.stringify(retorno));
        console.log(">>>> cadastrar_operacao >> ponto 1.5 >> retorno.msg = " + retorno.msg);
        return;
    }

    console.log(">>>> cadastrar_operacao >> ponto 2");

    valor_operacao = formata_valor_subida(valor_operacao);
    
    cosseguro.incluir_operacao.sendTransaction(codigo_operacao, parseInt(valor_operacao), {
		from: web3_node1.eth.coinbase, gas: 3500000 }, function(err, txHash) {
            if (err != null) {
                retorno.msg = "Erro ao tentar incluir uma operação";
                retorno.msgTecnica = "cosseguro.incluir_operacao.sendTransaction => " + err;
                console.log(">>>> cadastrar_operacao >> retorno.msgTecnica: " + retorno.msgTecnica);
                retorno.sucesso = false;
                retorno.txHash = txHash;
                retorno.retornoApresentado = "false";
                retorno.sucesso_alt_blockchain = "";
                retorno.mensagem_blockchain = "";
                retorno.dados_operacao = {};
                retorno.dados_operacao.codigo_operacao = codigo_operacao;
                retorno.dados_operacao.valor_operacao = valor_operacao;
                
                res.end(JSON.stringify(retorno));
            } else {
                retorno.msg = "Em andamento a minera&ccedil;&atilde;o da nova operação";
                console.log(">>>> cadastrar_operacao >> retorno.msg: " + retorno.msg);
                retorno.sucesso = true;
                retorno.txHash = txHash;
                retorno.retornoApresentado = "false";
                retorno.sucesso_alt_blockchain = "";
                retorno.mensagem_blockchain = "";
                retorno.dados_operacao = {};
                retorno.dados_operacao.codigo_operacao = codigo_operacao;
                retorno.dados_operacao.valor_operacao = valor_operacao;
                
                txHashs[txHash] = users[req.sessionID].socketId; //utilizado para que o eventoi possa dar o retorno para o client correto.
                //console.log('>>>>> app.post >> /cadastrar_operacao >> req.sessionID = ' + req.sessionID);
                //console.log('>>>>> app.post >> /cadastrar_operacao >> users[req.sessionID].socketId = ' + users[req.sessionID].socketId);
                //console.log('>>>>> app.post >> /cadastrar_operacao >> txHashs[txHash] = ' + txHashs[txHash]);

                res.end(JSON.stringify(retorno));
            }
        }
    );

    sio.sockets.connected[users[req.sessionID].socketId].emit('notification', retorno);
    console.log('>>>>> app.post >> /cadastrar_operacao');
});

//event ret_incluir_acordo(uint index_apolice, uint64 percent_acordo, address addr_seguradora_aceito, uint index_array_acordo, bool sucesso, int cod_retorno, string descricao);
cosseguro.ret_incluir_acordo(function(error, result){
    console.log('>>>>> event cosseguro.ret_alterar_duplicata >> evento recebido do GETH e enviado para o client >> ponto 1');
    var retorno = {};
    
    retorno.msg = "";
    retorno.txHash = result.transactionHash;
    console.log('>>>>> event cosseguro.ret_alterar_duplicata >> ponto 2 >> result.transactionHash = ' + result.transactionHash);
    console.log('>>>>> event cosseguro.ret_alterar_duplicata >> ponto 3 >> txHashs[result.transactionHash] = ' + txHashs[result.transactionHash]);
    retorno.retornoApresentado = false;
    retorno.funcao = "Inclus&atilde;o de operação";
    retorno.mensagem_blockchain = result.args.descricao;
    retorno.cod_erro = result.args.cod_erro;
    retorno.dados_duplicata = {};
    retorno.dados_duplicata.chave = result.args.chave;
    retorno.dados_duplicata.codigo_op = result.args.codigo_op;
    retorno.dados_duplicata.index_alocacao = result.args.index_alocacao;
    retorno.dados_duplicata.cpf_cnpj_sacado = result.args.cpf_cnpj_sacado;
    retorno.dados_duplicata.cnpj_emissor = result.args.cnpj_emissor;
    retorno.dados_duplicata.valor_duplicata = result.args.valor;
    retorno.dados_duplicata.situacao_nova_duplicata = result.args.situacao;
    
    if (error != null) {
        retorno.msgTecnica = "Codigo do erro: " + result.args.cod_erro + '\n descricao: ' + result.args.descricao;
        retorno.sucesso_alt_blockchain = false;
    
    } else {
        var cod_erro = parseInt(result.args.cod_erro);
        retorno.sucesso_alt_blockchain = ((cod_erro < 0) ? true : false);
    }

    sio.sockets.connected[txHashs[result.transactionHash]].emit('retorno_sendTransaction', JSON.stringify(retorno));
    console.log('>>>>> event cosseguro.ret_alterar_duplicata >> evento recebido do GETH e enviado para o client >> ponto 2');
});

app.post('/autorizar_acordo', urlencodedParser, function (req, res) {
    var codigo_op = req.body.codigo_op;
    var chave_duplicata = req.body.chave_duplicata;
    var cpf_cnpj_sacado = formata_numero_subida(req.body.cpf_cnpj_sacado);
    var cnpj_emissor = formata_numero_subida(req.body.cnpj_emissor);
    var valor_duplicata = req.body.valor_duplicata;
    var situacao_nova_duplicata = req.body.situacao_nova_duplicata;
    
    var retorno = {};
    retorno.funcao = "Inclus&atilde;o de duplicata";
    retorno.msg = "";
    retorno.msgTecnica = "";
    retorno.sucesso = true;
    retorno.txHash = "";
    retorno.retornoApresentado = false;
    retorno.sucesso_alt_blockchain = false;
    retorno.mensagem_blockchain = "";
    retorno.dados_duplicata = {};
    retorno.dados_duplicata.chave = chave_duplicata;
    retorno.dados_duplicata.codigo_op = codigo_op;
    retorno.dados_duplicata.cpf_cnpj_sacado = cpf_cnpj_sacado;
    retorno.dados_duplicata.cnpj_emissor = cnpj_emissor;
    retorno.dados_duplicata.valor_duplicata = valor_duplicata;
    retorno.dados_duplicata.situacao_nova_duplicata = situacao_nova_duplicata;
    
    res.writeHead("200", {"Content-Type": "application/json"});
    
    if (!sessionValid(req.body.usuario, req)) {
        retorno.msg = "usuário inválido!";
        retorno.msgTecnica = "/cadastrar_duplicata >> sessionValid -> req.body.usuario = " + req.body.usuario;
        console.log(">>>>> " + retorno.msgTecnica);
        res.end(retorno);
        return false;
    }

    if (!validacao_simples(codigo_op)) {
        retorno.msg += "Código da opração: inválido\n";
        retorno.sucesso = false;
    }
    
    if (!validacao_simples(chave_duplicata)) {
        retorno.msg += "Chave: inválida\n";
        retorno.sucesso = false;
    }
    
    if (!validacao_simples(req.body.cpf_cnpj_sacado)) {
        retorno.msg += "CPF ou CNPJ da Sacado: inválido\n";
        retorno.sucesso = false;
    }
        
    if (!validacao_simples(req.body.cnpj_emissor)) {
        retorno.msg += "CNPJ do emissor: inválido\n";
        retorno.sucesso = false;
    }
    
    if (!validacao_simples(req.body.valor_duplicata)) {
        retorno.msg += "Valor: inválido\n";
        retorno.sucesso = false;
    }

    if (situacao_nova_duplicata.trim().length == 0) {
        retorno.msg += "Situacao da nova duplicata: inválida\n";
        retorno.sucesso = false;
    }
    
    if (!retorno.sucesso) {
        retorno.msg = "Verifique o(s) erro(s) abaixo:\n" + retorno.msg;
        res.end(JSON.stringify(retorno));
        console.log(">>>> cadastrar_duplicata >> ponto 1.5 >> retorno.msg = " + retorno.msg);
        return;
    }

    console.log(">>>> cadastrar_duplicata >> ponto 2");
    
    var chave_duplicata_big = new BigNumber(chave_duplicata, 10);
    var cnpj_emissor_big = new BigNumber(cnpj_emissor, 10);
    var cpf_cnpj_sacado_big = new BigNumber(cpf_cnpj_sacado, 10);

    valor_duplicata = formata_valor_subida(valor_duplicata);
    
    cosseguro.incluir_duplicata.sendTransaction(chave_duplicata_big, cnpj_emissor_big, cpf_cnpj_sacado_big, valor_duplicata, situacao_nova_duplicata, codigo_op, {
		from: web3_node1.eth.coinbase, gas: 3500000 }, function(err, txHash) {
            if (err != null) {
                retorno.msg = "Erro ao tentar incluir uma duplicata";
                retorno.msgTecnica = "cosseguro.incluir_duplicata.sendTransaction => " + err;
                retorno.sucesso = false;
                retorno.txHash = txHash;
                retorno.retornoApresentado = false;
                retorno.sucesso_alt_blockchain = "";
                retorno.mensagem_blockchain = "";
                retorno.dados_duplicata = {};
                retorno.dados_duplicata.chave = chave_duplicata;
                retorno.dados_duplicata.codigo_op = codigo_op;
                retorno.dados_duplicata.cpf_cnpj_sacado = cpf_cnpj_sacado;
                retorno.dados_duplicata.cnpj_emissor = cnpj_emissor;
                retorno.dados_duplicata.valor_duplicata = valor_duplicata;
                retorno.dados_duplicata.situacao_nova_duplicata = situacao_nova_duplicata;

                res.end(retorno);
            } else {
                retorno.msg = "Em andamento a minera&ccedil;&atilde;o da nova duplicata";
                console.log(">>>> cadastrar_operacao >> retorno.msg: " + retorno.msg);
                retorno.sucesso = true;
                retorno.txHash = txHash;
                retorno.retornoApresentado = false;
                retorno.sucesso_alt_blockchain = "";
                retorno.mensagem_blockchain = "";
                retorno.dados_duplicata = {};
                retorno.dados_duplicata.chave = chave_duplicata;
                retorno.dados_duplicata.codigo_op = codigo_op;
                retorno.dados_duplicata.cpf_cnpj_sacado = cpf_cnpj_sacado;
                retorno.dados_duplicata.cnpj_emissor = cnpj_emissor;
                retorno.dados_duplicata.valor_duplicata = valor_duplicata;
                retorno.dados_duplicata.situacao_nova_duplicata = situacao_nova_duplicata;

                txHashs[txHash] = users[req.sessionID].socketId; //utilizado para que o eventoi possa dar o retorno para o client correto.
                
                res.end(JSON.stringify(retorno));
            }
        }
    );

    sio.sockets.connected[users[req.sessionID].socketId].emit('notification', mensagem);
    console.log('>>>>> app.post >> /cadastrar_duplicata');
});

//event ret_autorizar_acordo(uint index_apolice_cedido, uint index_acordo_aceito, address addr_cedido, bool sucesso, int cod_retorno, string descricao);
cosseguro.ret_autorizar_acordo(function(error, result){
    console.log('>>>>> event cosseguro.ret_alterar_duplicata >> evento recebido do GETH e enviado para o client >> ponto 1');
    var retorno = {};
    
    retorno.msg = "";
    retorno.txHash = result.transactionHash;
    console.log('>>>>> event cosseguro.ret_alterar_duplicata >> ponto 2 >> result.transactionHash = ' + result.transactionHash);
    console.log('>>>>> event cosseguro.ret_alterar_duplicata >> ponto 3 >> txHashs[result.transactionHash] = ' + txHashs[result.transactionHash]);
    retorno.retornoApresentado = false;
    retorno.funcao = "Inclus&atilde;o de operação";
    retorno.mensagem_blockchain = result.args.descricao;
    retorno.cod_erro = result.args.cod_erro;
    retorno.dados_duplicata = {};
    retorno.dados_duplicata.chave = result.args.chave;
    retorno.dados_duplicata.codigo_op = result.args.codigo_op;
    retorno.dados_duplicata.index_alocacao = result.args.index_alocacao;
    retorno.dados_duplicata.cpf_cnpj_sacado = result.args.cpf_cnpj_sacado;
    retorno.dados_duplicata.cnpj_emissor = result.args.cnpj_emissor;
    retorno.dados_duplicata.valor_duplicata = result.args.valor;
    retorno.dados_duplicata.situacao_nova_duplicata = result.args.situacao;
    
    if (error != null) {
        retorno.msgTecnica = "Codigo do erro: " + result.args.cod_erro + '\n descricao: ' + result.args.descricao;
        retorno.sucesso_alt_blockchain = false;
    
    } else {
        var cod_erro = parseInt(result.args.cod_erro);
        retorno.sucesso_alt_blockchain = ((cod_erro < 0) ? true : false);
    }

    sio.sockets.connected[txHashs[result.transactionHash]].emit('retorno_sendTransaction', JSON.stringify(retorno));
    console.log('>>>>> event cosseguro.ret_alterar_duplicata >> evento recebido do GETH e enviado para o client >> ponto 2');
});

/////////////////////////////////////////////
// fim acordo                              //
/////////////////////////////////////////////


app.post('/consultar_blockchain', urlencodedParser, function (req, res) {
    var retorno = {};
    retorno.msg = "";
    retorno.sucesso = true;
    retorno.blockchain = {};
    //retorno.blockchain.apolices = {};
    //retorno.blockchain.apolices[0].acordos = {};

    res.writeHead(200, {"Content-Type": "application/json"});
    
    console.log('>>>>> app.post >> /consultar_blockchain >> ponto 1 >> ' + req.body.usuario);


    if (!sessionValid(req.body.usuario, req)) {
        retorno.msg = "usuário inválido!";
        retorno.msgTecnica = "sessionValid -> req.body.usuario = " + req.body.usuario;
        retorno.sucesso = false; 
        res.end(JSON.stringify(retorno));
        return;
    }

    console.log('>>>>> app.post >> /consultar_blockchain >> ponto 2');

    var total_apolices = cosseguro.contar_apolices();
    console.log('>>>>> app.post >> /consultar_blockchain >> ponto 3 >> total_apolices = ' + total_apolices);

    var total_acordos = 0;//cosseguro.contar_apolices();
    for (var iA = 0; iA < total_apolices; iA++) {
        var apolice = cosseguro.consultar_apolice(iA);
        console.log('>>>>> app.post >> /consultar_blockchain >> ponto 4 >> apolice['+ iA +'] = ' + JSON.stringify(apolice));
        //total_acordos = cosseguro.contar
    }
    console.log('>>>>> app.post >> /consultar_blockchain >> ponto 5');
    
    /*
    console.log('>>>>> app.post >> /consultar_blockchain >> ponto 2 >> ' + req.body.usuario);

    var total_operacoes = cosseguro.contar_operacoes();
    retorno.msg = "Total de opreções: " + total_operacoes;

    console.log('>>>>> app.post >> /consultar_blockchain >> ponto 3 >> ' + total_operacoes);
    */
    res.end(JSON.stringify(retorno));
    //sio.sockets.connected[users[req.sessionID].socketId].emit('notification', JSON.stringify(retorno));
    
    console.log('>>>>> app.post >> /consultar_blockchain');
});

function validacao_simples(dado) {
    console.log(">>>> validacao_simples >> ponto 1 >> " + dado);
    if (typeof dado !== 'undefined' && dado) {
        console.log(">>>> validacao_simples >> ponto 2");
        if (dado.trim().length == 0 || dado.trim() == "0" || dado.trim() == "0,00") {
            console.log(">>>> validacao_simples >> ponto 3");
            return false;
        }
    } else {
        console.log(">>>> validacao_simples >> ponto 4");
        return false;
    }
    console.log(">>>> validacao_simples >> ponto 5");
    return true;
}

function formata_numero_subida(valor) {
	var valor_aux = valor.toString();

	valor_aux = (valor_aux.replace(/\D/g,''));
	
	return valor_aux;
}

function formata_valor_subida(valor) {
	if (typeof valor !== 'undefined' && valor) {
        var valor_aux = valor.toString();

        valor_aux = valor_aux.replace(".",",");

        var aux_tres_ultimas = valor_aux.substring(valor_aux.length - 3, valor_aux.length);

        if (aux_tres_ultimas.indexOf(",") == -1)
            valor_aux = valor_aux + ",00";

        valor_aux = valor_aux.replace(".","").replace(",","");

        return parseInt(valor_aux);
    }
}



////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////



function parse_cookies(_cookies) {
    var cookies = {};

    _cookies && _cookies.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });

    return cookies;
}