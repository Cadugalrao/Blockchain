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
web3_node1.setProvider(new web3_node1.providers.HttpProvider('http://prodnode2.no-ip.org:80'));
//web3_node1.setProvider(new web3_node1.providers.HttpProvider('http://localhost:8545'));

var cosseguroABI = [{"constant":true,"inputs":[],"name":"contar_apolices","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"},{"name":"_index_seguradora","type":"uint256"}],"name":"consultar_apolice_seguradora","outputs":[{"name":"","type":"string"},{"name":"","type":"uint64"},{"name":"","type":"uint64"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint16"},{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"compare","outputs":[{"name":"","type":"int256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"equal","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_adress_aux","type":"address"},{"name":"_index_acordo","type":"uint256"}],"name":"apagar_consultar_acordo_aux","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint64"},{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"contar_index_acordo","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"consultar_apolice","outputs":[{"name":"","type":"string"},{"name":"","type":"uint64"},{"name":"","type":"uint64"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contar_acordos","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_codigo_apolice","type":"string"},{"name":"_premio_apolice","type":"uint64"},{"name":"_cobertura_apolice","type":"uint64"},{"name":"_dt_vencimento_apolice","type":"uint256"},{"name":"_seguradora1","type":"address"},{"name":"_percent1","type":"uint16"},{"name":"_seguradora2","type":"address"},{"name":"_percent2","type":"uint16"},{"name":"_seguradora3","type":"address"},{"name":"_percent3","type":"uint16"}],"name":"incluir_apolice","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"contar_seguradoras","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"},{"name":"_index_acordo","type":"uint256"}],"name":"apagar_consultar_index_acordo","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"apagar_consultar_apolice_aux","outputs":[{"name":"","type":"string"},{"name":"","type":"uint64"},{"name":"","type":"uint64"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_acordo","type":"uint256"}],"name":"consultar_acordo","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"codigo_apolice","type":"string"},{"indexed":false,"name":"premio_apolice","type":"uint64"},{"indexed":false,"name":"cobertura_apolice","type":"uint64"},{"indexed":false,"name":"dt_vencimento_apolice","type":"uint256"},{"indexed":false,"name":"seguradora1","type":"address"},{"indexed":false,"name":"percent1","type":"uint16"},{"indexed":false,"name":"seguradora2","type":"address"},{"indexed":false,"name":"percent2","type":"uint16"},{"indexed":false,"name":"seguradora3","type":"address"},{"indexed":false,"name":"percent3","type":"uint16"},{"indexed":false,"name":"sucesso","type":"bool"},{"indexed":false,"name":"cod_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_incluir_apolice","type":"event"}];

//const cosseguroAddress = "0x83b50c2a806213d9c7c7dbcf3d197dc12b5cf549"; //localhost
//const cosseguroAddress = "0xf506a2c7971e36a46f9365514e3385ce7fb5f6fa"; //v1 produção (compilador: ligar flag de otimização)
//const cosseguroAddress = "0x80d6273ba5c5090d147c29a02ec5175686c43d2c"; //v2 produção (compilador: ligar flag de otimização)
//const cosseguroAddress = "0xd21b2b8e1cad2bc2c72f5bece353b5d22f1e9417"; //v3 produção (compilador: ligar flag de otimização)
//const cosseguroAddress = "0xba0dce655af80e4fd2139def300d9b7f3b56fc45"; //v4 produção (compilador: ligar flag de otimização)
const cosseguroAddress = ""; //v6 produção (compilador: ligar flag de otimização)

var cosseguroABI_o = web3_node1.eth.contract(cosseguroABI);
var cosseguro = cosseguroABI_o.at(cosseguroAddress);

//const PORT = 80;
const PORT = 9090;
    
var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use('/public', express.static('public'));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(urlencodedParser);
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
const blockchain_seguradoras = {};

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

    if (typeof users[sessionID] !== 'undefined' && users[sessionID]) {
        //Não fazer nada, pois sessao já está criada.
        users[sessionID].socketId = socket.id;
        console.log("Usuario re-conectado: " + sessionID + ' >> socket.id: ' + socket.id);
    } else {
        users[sessionID] = {"ip": ip, "userName": "", "socketId": socket.id, "blockchain": {}, "seguradora": 0};
        console.log("Novo usuario conectado: " + sessionID + ' >> socket.id: ' + socket.id);
    }

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
    retorno.loginError = false;
    retorno.msgTecnica = "";
    retorno.sucesso = true;
    

    if (!sessionValid("", req)) {
        retorno.msg = "Sessao não foi criada. Recarregue a página";
        retorno.msgTecnica = "app.post('/login', function (req, res) >> if (!sessionValid(\"\", req)) {";
        retorno.sucesso = false;
        retorno.loginError = true;
    } else {
        if (usuario == "rodrigo" && senha == "plata") { //incluir validação de usuario pelo MongoDB
            users[req.sessionID].userName = usuario;
            users[req.sessionID].seguradora = 1;
            blockchain_seguradoras[users[req.sessionID].seguradora] = {"dt_expiracao": 0, forcar_atualizacao: false, "blockchain": {}};

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

function recuperaBlockchainSeguradora(id_seguradora) {
    if (typeof blockchain_seguradoras[id_seguradora].blockchain.apolices !== 'undefined' && blockchain_seguradoras[id_seguradora].blockchain.apolices) {
        var dt_expiracao_blockchain = blockchain_seguradoras[id_seguradora].dt_expiracao;
        var forcar_atualizacao = blockchain_seguradoras[id_seguradora].forcar_atualizacao;

        if (!forcar_atualizacao)
            return blockchain_seguradoras[id_seguradora].blockchain;
    }

    return {};   
}

/////////////////////////////////////////////
// inicio apolice                          //
/////////////////////////////////////////////

app.post('/cadastrar_apolice', urlencodedParser, function (req, res) {
    var codigo_apolice = req.body.codigo_apolice;
    var valor_premio = formata_numero_subida(req.body.valor_premio);
    var valor_cobertura = formata_numero_subida(req.body.valor_cobertura);
    var dt_vencimento = req.body.dt_vencimento;
    var seg1_addr = req.body.seg1_addr;
    var seg1_persent = req.body.seg1_persent;
    var seg2_addr = req.body.seg2_addr;
    var seg2_persent = req.body.seg2_persent;
    var seg3_addr = req.body.seg3_addr;
    var seg3_persent = req.body.seg3_persent;
    
    var retorno = {};
    retorno.funcao = "Cadastro de Apolice";
    retorno.msg = "";
    retorno.msgTecnica = "";
    retorno.sucesso = true;
    retorno.txHash = "";
    retorno.retornoApresentado = false;
    retorno.sucesso_alt_blockchain = false;
    retorno.mensagem_blockchain = "";
    retorno.apolice = {};
    retorno.apolice.codigo_apolice = codigo_apolice;
    retorno.apolice.valor_premio = valor_premio;
    retorno.apolice.valor_cobertura = valor_cobertura;
    retorno.apolice.dt_vencimento = dt_vencimento;
    retorno.apolice.seg1_addr = seg1_addr;
    retorno.apolice.seg1_persent = seg1_persent;
    retorno.apolice.seg2_addr = seg2_addr;
    retorno.apolice.seg2_persent = seg2_persent;
    retorno.apolice.seg3_addr = seg3_addr;
    retorno.apolice.seg3_persent = seg3_persent;
    retorno.loginError = false;

    res.writeHead("200", {"Content-Type": "application/json"});
    
    if (!sessionValid(req.body.usuario, req)) {
        retorno.msg = "usuário inválido!";
        retorno.msgTecnica = "/cadastrar_apolice >> sessionValid -> req.body.usuario = " + req.body.usuario;
        retorno.loginError = true;
        console.log(">>>>> " + retorno.msgTecnica);
        res.end(JSON.stringify(retorno));
        return false;
    }

    if (!validacao_simples(codigo_apolice)) {
        retorno.msg += "Código da apolice: inválido\n";
        retorno.sucesso = false;
    }
    
    if (!validacao_simples(valor_premio)) {
        retorno.msg += "Valor do premio: inválida\n";
        retorno.sucesso = false;
    }
    
    if (!validacao_simples(req.body.valor_cobertura)) {
        retorno.msg += "Valor da cobertura: inválido\n";
        retorno.sucesso = false;
    }
        
    if (!validacao_simples(req.body.dt_vencimento)) {
        retorno.msg += "Data de Vencimento: inválido\n";
        retorno.sucesso = false;
    }
        
    if (!validacao_simples(req.body.seg1_addr)) {
        retorno.msg += "Address da primeira seguradora: inválido\n";
        retorno.sucesso = false;
    }
        
    if (!validacao_simples(req.body.seg1_persent) || req.body.seg1_persent == 0 || req.body.seg1_persent > 99) {
        retorno.msg += "Percentual da primeira seguradora: inválido\n";
        retorno.sucesso = false;
    }

    if (validacao_simples(req.body.seg2_addr) && (req.body.seg2_persent == 0 || req.body.seg2_persent > 99)) {
        retorno.msg += "Percentual da segunda seguradora: inválido\n";
        retorno.sucesso = false;
    }

    if (validacao_simples(req.body.seg3_addr) && (req.body.seg3_persent == 0 || req.body.seg3_persent > 99)) {
        retorno.msg += "Percentual da segunda seguradora: inválido\n";
        retorno.sucesso = false;
    }
    
    if (req.body.seg1_persent + req.body.seg2_persent + req.body.seg3_persent > 99) {
        retorno.msg += "Soma do percentual das seguradoras: inválida\n";
        retorno.sucesso = false;
    }
    
    if (!retorno.sucesso) {
        retorno.msg = "Verifique o(s) erro(s) abaixo:\n" + retorno.msg;
        res.end(JSON.stringify(retorno));
        console.log(">>>> cadastrar_apolice >> ponto 1.5 >> retorno.msg = " + retorno.msg);
        return;
    }

    console.log(">>>> cadastrar_apolice >> ponto 2");
    
    valor_premio = formata_valor_subida(valor_premio);
    valor_cobertura = formata_valor_subida(valor_cobertura);
    
    cosseguro.incluir_apolice.sendTransaction(codigo_apolice, valor_premio, valor_cobertura, dt_vencimento, req.body.seg1_addr, req.body.seg1_persent, req.body.seg2_addr, req.body.seg2_persent, req.body.seg3_addr, req.body.seg3_persent, {
		from: web3_node1.eth.coinbase, gas: 3500000 }, function(err, txHash) {
            if (err != null) {
                retorno.msg = "Erro ao tentar incluir uma apolice";
                retorno.msgTecnica = "cosseguro.incluir_apolice.sendTransaction => " + err;
                retorno.sucesso = false;
                retorno.txHash = txHash;
                retorno.retornoApresentado = false;
                retorno.sucesso_alt_blockchain = "";
                retorno.mensagem_blockchain = "";
                retorno.apolice = {};
                retorno.apolice.codigo_apolice = codigo_apolice;
                retorno.apolice.valor_premio = valor_premio;
                retorno.apolice.valor_cobertura = valor_cobertura;
                retorno.apolice.dt_vencimento = dt_vencimento;

                res.end(JSON.stringify(retorno));
            } else {
                retorno.msg = "Em andamento a minera&ccedil;&atilde;o da nova duplicata";
                console.log(">>>> cadastrar_apolice >> retorno.msg: " + retorno.msg);
                retorno.sucesso = true;
                retorno.txHash = txHash;
                retorno.retornoApresentado = false;
                retorno.sucesso_alt_blockchain = "";
                retorno.sucesso = true;
                retorno.mensagem_blockchain = "";
                retorno.apolice = {};
                retorno.apolice.codigo_apolice = codigo_apolice;
                retorno.apolice.valor_premio = valor_premio;
                retorno.apolice.valor_cobertura = valor_cobertura;
                retorno.apolice.dt_vencimento = dt_vencimento;

                txHashs[txHash] = req.sessionID; //utilizado para que o evento possa dar o retorno para o client correto.
                
                res.end(JSON.stringify(retorno));
            }
        }
    );

    //sio.sockets.connected[users[req.sessionID].socketId].emit('notification', mensagem);
    console.log('>>>>> app.post >> /cadastrar_apolice');
});

//event ret_incluir_apolice(string codigo, uint64 premio, uint64 cobertura, uint dt_vencimento, uint qtde_seguradoras, uint index_array_apolice, uint index_array_seguradoras, uint index_array_acordo, bool sucesso, int cod_retorno, string descricao);
cosseguro.ret_incluir_apolice(function(error, result){
    var _sessionID = txHashs[result.transactionHash]; 
    if (typeof _sessionID !== 'undefined' && _sessionID) {
        var _user = users[_sessionID]; 
        if (typeof _user !== 'undefined' && _user) {
            var _socketId = _user.socketId;
            var _socket = sio.sockets.connected[_socketId]; 
            if (typeof _socket !== 'undefined' && _socket) {
                console.log('>>>>> event cosseguro.ret_incluir_apolice >> evento recebido do GETH e enviado para o client >> ponto 1');
                var retorno = {};
                
                retorno.msg = "";
                retorno.txHash = result.transactionHash;
                console.log('>>>>> event cosseguro.ret_incluir_apolice >> ponto 2 >> result.transactionHash = ' + result.transactionHash);
                console.log('>>>>> event cosseguro.ret_incluir_apolice >> ponto 3 >> _sessionID = ' + _sessionID);
                retorno.retornoApresentado = false;
                retorno.sucesso = false;
                retorno.funcao = "Cadastro de apolice";
                retorno.mensagem_blockchain = result.args.descricao;
                retorno.cod_retorno = result.args.cod_retorno;
                retorno.apolice = {};
                retorno.apolice.codigo_apolice = result.args.codigo;
                retorno.apolice.valor_premio = result.args.premio;
                retorno.apolice.valor_cobertura = result.args.cobertura;
                retorno.apolice.dt_vencimento = result.args.dt_vencimento;
                
                retorno.apolice.seguradora1 = result.args.seguradora1;
                retorno.apolice.persent1 = result.args.persent1;
                retorno.apolice.seguradora2 = result.args.seguradora2;
                retorno.apolice.persent2 = result.args.persent2;
                retorno.apolice.seguradora3 = result.args.seguradora3;
                retorno.apolice.persent3 = result.args.persent3;
                
                var cod_retorno = parseInt(result.args.cod_retorno.toString());

                if (error != null || cod_retorno < 0) {
                    retorno.msgTecnica = "Codigo do erro: " + cod_retorno + '\n descricao: ' + result.args.descricao;
                    retorno.sucesso_alt_blockchain = false;
                    retorno.sucesso = false;
                } else {
                    retorno.sucesso_alt_blockchain = result.args.sucesso;
                    retorno.sucesso = true;

                    blockchain_seguradoras[_user.seguradora].forcar_atualizacao = true;
                }

                _socket.emit('ret_sendTr_incluir_apolice', JSON.stringify(retorno));
                console.log('>>>>> event cosseguro.ret_incluir_apolice >> evento recebido do GETH e enviado para o client >> ponto 2');
            } else {
                console.log('>>>>> event cosseguro.ret_incluir_apolice >> evento regeitado (err 1)');
            }
        } else {
            console.log('>>>>> event cosseguro.ret_incluir_apolice >> evento regeitado (err 2)');
        }
    } else {
        console.log('>>>>> event cosseguro.ret_incluir_apolice >> evento regeitado (err 3)');
    }
});

app.post('/consultar_apolice', urlencodedParser, function (req, res) {
    var retorno = {};
    retorno.msg = "";
    retorno.loginError = false;
        
    res.writeHead(200, {"Content-Type": "application/json"});
    
    console.log('>>>>> app.post >> /consulta >> ponto 1 >> ' + req.body.usuario);


    if (!sessionValid(req.body.usuario, req)) {
        retorno.msg = "usuário inválido!";
        retorno.msgTecnica = "sessionValid -> req.body.usuario = " + req.body.usuario;
        retorno.sucesso = false; 
        retorno.loginError = true;
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
    var index_apolice = req.body.index_apolice;
    var addr_seguradora_aceito = req.body.addr_seguradora_aceito;
    var percent_acordo = req.body.percent_acordo;
    
    var retorno = {};
    retorno.funcao = "Cadastro de Seguradora";
    retorno.msg = "";
    retorno.msgTecnica = "";
    retorno.sucesso = true;
    retorno.txHash = "";
    retorno.retornoApresentado = false;
    retorno.sucesso_alt_blockchain = false;
    retorno.mensagem_blockchain = "";
    retorno.acordo = {};
    retorno.acordo.index_apolice = index_apolice;
    retorno.acordo.addr_seguradora_aceito = addr_seguradora_aceito;
    retorno.acordo.percent_acordo = percent_acordo;
    retorno.loginError = false;
    
    res.writeHead("200", {"Content-Type": "application/json"});
    
    if (!sessionValid(req.body.usuario, req)) {
        retorno.msg = "usuário inválido!";
        retorno.msgTecnica = "/cadastrar_acordo >> sessionValid -> req.body.usuario = " + req.body.usuario;
        console.log(">>>>> " + retorno.msgTecnica);
        retorno.loginError = true;
        res.end(JSON.stringify(retorno));
        return false;
    }

    if (index_apolice < 0) {
        retorno.msg += "Apólice: inválido\n";
        retorno.sucesso = false;
    }
    
    if (!validacao_simples(addr_seguradora_aceito)) {
        retorno.msg += "Address da Seguradora: inválida\n";
        retorno.sucesso = false;
    }
    
    if (!validacao_simples(percent_acordo)) {
        retorno.msg += "Percentual: inválido\n";
        retorno.sucesso = false;
    }
        
    if (!retorno.sucesso) {
        retorno.msg = "Verifique o(s) erro(s) abaixo:\n" + retorno.msg;
        res.end(JSON.stringify(retorno));
        console.log(">>>> cadastrar_acordo >> ponto 1.5 >> retorno.msg = " + retorno.msg);
        return;
    }

    console.log(">>>> cadastrar_acordo >> ponto 2");
    
    //incluir_acordo(uint _index_apolice, uint16 _percent_acordo, address _addr_seguradora_aceito)
    cosseguro.incluir_acordo.sendTransaction(index_apolice, parseInt(percent_acordo), addr_seguradora_aceito, {
		from: web3_node1.eth.coinbase, gas: 3500000 }, function(err, txHash) {
            if (err != null) {
                retorno.msg = "Erro ao tentar incluir uma seguradora";
                retorno.msgTecnica = "cosseguro.incluir_acordo.sendTransaction => " + err;
                retorno.sucesso = false;
                retorno.txHash = txHash;
                retorno.retornoApresentado = false;
                retorno.sucesso_alt_blockchain = "";
                retorno.mensagem_blockchain = "";
                retorno.acordo = {};
                retorno.acordo.index_apolice = index_apolice;
                retorno.acordo.addr_seguradora_aceito = addr_seguradora_aceito;
                retorno.acordo.percent_acordo = percent_acordo;

                res.end(JSON.stringify(retorno));
            } else {
                retorno.msg = "Em andamento a minera&ccedil;&atilde;o da inclusão da seguradora na apolice";
                console.log(">>>> cadastrar_acordo >> retorno.msg: " + retorno.msg);
                retorno.sucesso = true;
                retorno.txHash = txHash;
                retorno.retornoApresentado = false;
                retorno.sucesso_alt_blockchain = "";
                retorno.sucesso = true;
                retorno.mensagem_blockchain = "";
                retorno.acordo = {};
                retorno.acordo.index_apolice = index_apolice;
                retorno.acordo.addr_seguradora_aceito = addr_seguradora_aceito;
                retorno.acordo.percent_acordo = percent_acordo;

                txHashs[txHash] = req.sessionID; //utilizado para que o evento possa dar o retorno para o client correto.
                
                res.end(JSON.stringify(retorno));
            }
        }
    );

    //sio.sockets.connected[users[req.sessionID].socketId].emit('notification', mensagem);
    console.log('>>>>> app.post >> /cadastrar_acordo');
});

//event ret_incluir_acordo(uint index_apolice, uint64 percent_acordo, address addr_seguradora_aceito, uint index_array_acordo, bool sucesso, int cod_retorno, string descricao);
cosseguro.ret_incluir_acordo(function(error, result){
    var _sessionID = txHashs[result.transactionHash]; 
    if (typeof _sessionID !== 'undefined' && _sessionID) {
        var _user = users[_sessionID]; 
        if (typeof _user !== 'undefined' && _user) {
            var _socketId = _user.socketId;
            var _socket = sio.sockets.connected[_socketId]; 
            if (typeof _socket !== 'undefined' && _socket) {
                console.log('>>>>> event cosseguro.ret_incluir_acordo >> evento recebido do GETH e enviado para o client >> ponto 1');
                var retorno = {};
                
                retorno.msg = "";
                retorno.txHash = result.transactionHash;
                console.log('>>>>> event cosseguro.ret_incluir_acordo >> ponto 2 >> result.transactionHash = ' + result.transactionHash);
                console.log('>>>>> event cosseguro.ret_incluir_acordo >> ponto 3 >> txHashs[result.transactionHash] = ' + txHashs[result.transactionHash]);
                retorno.retornoApresentado = false;
                retorno.sucesso = false;
                retorno.funcao = "Cadastro de apolice";
                retorno.mensagem_blockchain = result.args.descricao;
                retorno.cod_retorno = result.args.cod_retorno;
                retorno.acordo = {};
                retorno.acordo.index_apolice = result.args.index_apolice;
                retorno.acordo.addr_seguradora_aceito = result.args.addr_seguradora_aceito;
                retorno.acordo.percent_acordo = result.args.percent_acordo;
                
                var cod_retorno = parseInt(result.args.cod_retorno.toString());

                if (error != null || cod_retorno < 0) {
                    retorno.msgTecnica = "Codigo do erro: " + cod_retorno + '\n descricao: ' + result.args.descricao;
                    retorno.sucesso_alt_blockchain = false;
                    retorno.sucesso = false;
                } else {
                    retorno.sucesso_alt_blockchain = result.args.sucesso;
                    retorno.sucesso = true;
                    
                    blockchain_seguradoras[_user.seguradora].forcar_atualizacao = true;
                }

                sio.sockets.connected[_socketId].emit('ret_sendTr_incluir_acordo', JSON.stringify(retorno));
                console.log('>>>>> event cosseguro.ret_incluir_acordo >> evento recebido do GETH e enviado para o client >> ponto 2');
            } else {
                console.log('>>>>> event cosseguro.ret_incluir_acordo >> evento regeitado (err 1)');
            }
        } else {
            console.log('>>>>> event cosseguro.ret_incluir_acordo >> evento regeitado (err 2)');
        }
    } else {
        console.log('>>>>> event cosseguro.ret_incluir_acordo >> evento regeitado (err 3)');
    }
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
    retorno.loginError = false;
    
    res.writeHead("200", {"Content-Type": "application/json"});
    
    if (!sessionValid(req.body.usuario, req)) {
        retorno.msg = "usuário inválido!";
        retorno.msgTecnica = "/cadastrar_duplicata >> sessionValid -> req.body.usuario = " + req.body.usuario;
        console.log(">>>>> " + retorno.msgTecnica);
        retorno.loginError = true;
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
    retorno.loginError = false;
    retorno.blockchain = {};
    //retorno.blockchain.apolices = {};
    //retorno.blockchain.apolices[0].acordos = {};

    res.writeHead(200, {"Content-Type": "application/json"});
    
    console.log('>>>>> app.post >> /consultar_blockchain >> ponto 1 >> ' + req.body.usuario);

    if (!sessionValid(req.body.usuario, req)) {
        retorno.msg = "usuário inválido!";
        retorno.msgTecnica = "sessionValid -> req.body.usuario = " + req.body.usuario;
        retorno.sucesso = false; 
        retorno.loginError = true;
        res.end(JSON.stringify(retorno));
        console.log('>>>>> app.post >> /consultar_blockchain >> ponto 1.5 >> retorno.msgTecnica = ' + retorno.msgTecnica);
        return;
    }

    retorno.blockchain = recuperaBlockchainSeguradora(users[req.sessionID].seguradora);
    
    if (typeof retorno.blockchain.apolices !== 'undefined' && retorno.blockchain.apolices) {
        res.end(JSON.stringify(retorno));
        console.log('>>>>> app.post >> /consultar_blockchain >> ponto 1.7 >> Cache enviado para o cliente');
        return;        
    }

    console.log('>>>>> app.post >> /consultar_blockchain >> ponto 2');

    var total_apolices = 0;
    total_apolices = parseInt(cosseguro.contar_apolices().toString());
    
    var arr_apolices = [];
    for (var iA = 0; iA < total_apolices; iA++) {
        arr_apolices[iA] = cosseguro.consultar_apolice(iA);
        console.log('>>>>> app.post >> /consultar_blockchain >> ponto 4 >> apolices['+ iA +'] = ' + JSON.stringify(arr_apolices[iA]));
    }

    var arr_apolices_seguradoras = [];
    for (var iA = 0; iA < total_apolices; iA++) {
        arr_apolices_seguradoras[iA] = cosseguro.consultar_apolice_seguradoras(iA);
        console.log('>>>>> app.post >> /consultar_blockchain >> ponto 4 >> apolices['+ iA +'] = ' + JSON.stringify(arr_apolices_seguradoras[iA]));
    }
    console.log('>>>>> app.post >> /consultar_blockchain >> ponto 5');

    var total_acordos = 0;
    total_acordos = parseInt(cosseguro.contar_acordos().toString());
    
    var arr_acordos = [];
    for (var iAcord = 0; iAcord < total_acordos; iAcord++) {
        var index_apolice_aux = cosseguro.consultar_acordos(iAcord);
        arr_acordos[iAcord] = cosseguro.consultar_apolice(index_apolice_aux);
        console.log('>>>>> app.post >> /consultar_blockchain >> ponto 4 >> acordos['+ iAcord +'] = ' + JSON.stringify(arr_acordos[iAcord]));
    }

    var arr_acordos_seguradoras = [];
    for (var iAcord = 0; iAcord < total_acordos; iAcord++) {
        var index_apolice_aux = cosseguro.consultar_acordos(iAcord);
        arr_acordos_seguradoras[iAcord] = cosseguro.consultar_apolice_seguradoras(index_apolice_aux);
        console.log('>>>>> app.post >> /consultar_blockchain >> ponto 4 >> acordos['+ iAcord +'] = ' + JSON.stringify(arr_acordos_seguradoras[iAcord]));
    }
    console.log('>>>>> app.post >> /consultar_blockchain >> ponto 5');

    var json_aux = '{';
	json_aux += '"apolices":[';
	var arr_aux_acordo = [];
	var arr_aux_apolice = [];

	var virgula_acordo = '';
	var virgula_apolice = '';

	for (var iApolices=0; iApolices < arr_apolices.length; iApolices++) {
        console.log('>>>>> app.post >> /consultar_blockchain >> ponto de montagem 1 >> iApolices = ' + iApolices);
		var dados_apolice = arr_apolices[iApolices];
		arr_aux_apolice = dados_apolice.toString().split(",");

        console.log('>>>>> app.post >> /consultar_blockchain >> ponto de montagem 2 >> dados_apolice = ' + JSON.stringify(dados_apolice));

		var codigo_op_aux = arr_aux_apolice[0].replace(/[^\x20-\x7E]+/g, '') + "";
		var valor_premio = arr_aux_apolice[1];
		var valor_cobertura = arr_aux_apolice[2];
		var dt_vencimento = new Date(parseInt(arr_aux_apolice[3].toString()));

		json_aux += virgula_apolice;
		json_aux += '{';
		json_aux += '"index_apolice":"' + iApolices + '",';
		json_aux += '"codigo_apolice":"' + codigo_op_aux + '",';
		json_aux += '"valor_premio":"' + valor_premio + '",';
		json_aux += '"valor_cobertura":"' + valor_cobertura + '",';
		json_aux += '"dt_vencimento":"' + formataData(dt_vencimento) + '",';

		json_aux += '"seguradoras":['; // cosseguradoras da apolice (cedido)

        var addr_seguradora = arr_apolices_seguradoras[0];
        var percent = arr_apolices_seguradoras[1];
        var autorizado = trata_autorizado(parseInt(arr_apolices_seguradoras[2]));
        
        var todas_autorizadas = true;

        json_aux += '{';
        json_aux += '"index_seguradora":"' + 1 + '",';
        json_aux += '"addr_seguradora":"' + addr_seguradora + '",';
        json_aux += '"percent":"' + percent + '"';
        json_aux += '"autorizado":"' + autorizado + '"';
        if (autorizado != "Autorizado") {
            todas_autorizadas = false;
        }
        json_aux += '}';

        addr_seguradora = arr_aux_apolice[3];
        percent = arr_aux_apolice[4];
        autorizado = trata_autorizado(parseInt(arr_apolices_seguradoras[5]));


        if (addr_seguradora.trim().length > 0 && percent.trim().length > 0) {
            json_aux += ',{';
            json_aux += '"index_seguradora":"' + 2 + '",';
            json_aux += '"addr_seguradora":"' + addr_seguradora + '",';
            json_aux += '"autorizado":"' + autorizado + '"';
            if (autorizado != "Autorizado") {
                todas_autorizadas = false;
            }
            json_aux += '}';
        }
        
        addr_seguradora = arr_aux_apolice[6];
        percent = arr_aux_apolice[7];
        autorizado = trata_autorizado(parseInt(arr_aux_apolice[8]));

        if (addr_seguradora.trim().length > 0 && percent.trim().length > 0) {
            json_aux += ',{';
            json_aux += '"index_seguradora":"' + 3 + '",';
            json_aux += '"addr_seguradora":"' + addr_seguradora + '",';
            json_aux += '"percent":"' + percent + '"';
            json_aux += '"autorizado":"' + autorizado + '"';
            if (autorizado != "Autorizado") {
                todas_autorizadas = false;
            }
            json_aux += '}';
        }
        
		json_aux += ']';

        if (todas_autorizadas == true) {
            ////////////////////////////////////////////////
            //     Enviar mensagem push via socket para pessoas autenticadas para as seguradoras participantes
            ////////////////////////////////////////////////
        }

		json_aux += '}';

		virgula_apolice = ',';
		virgula_acordo = '';
	}
	json_aux += '],';

	json_aux += 'acordos:['; // acordos que a seguradora participa como cosseguradora (aceito)
    for (var iAcordo=0; iAcordo < total_acordos; iAcordo++) {
            var dados_acordo = arr_acordos[iApolices];
		    arr_aux_acordo = dados_acordo.toString().split(",");

            codigo_op_aux = arr_aux_acordo[0].replace(/[^\x20-\x7E]+/g, '') + "";
            valor_premio = arr_aux_acordo[1];
            valor_cobertura = arr_aux_acordo[2];
            dt_vencimento = new Date(parseInt(arr_aux_acordo[3].toString()));
            addr_seguradora = arr_aux_acordo[4].toString();
            percent = arr_aux_acordo[5].toString();
            autorizado = trata_autorizado(parseInt(arr_aux_acordo[6].toString()));
            //////////////////////////////////////////////////////
            /////// continuar ////////////////////////////////////
            //////////////////////////////////////////////////////
            json_aux += virgula_acordo;
            json_aux += '{';
            json_aux += '"codigo_apolice":"' + codigo_op_aux + '",';
            json_aux += '"valor_premio":"' + valor_premio + '",';
            json_aux += '"valor_cobertura":"' + valor_cobertura + '",';
            json_aux += '"dt_vencimento":"' + formataData(dt_vencimento) + '",';
            json_aux += '"addr_seguradora":"' + addr_seguradora + '",';
            json_aux += '"percent":"' + percent + '"';
            json_aux += '"autorizado":"' + autorizado + '"';
            json_aux += '}';
            virgula_acordo = ',';
    }
    json_aux += ']';

	json_aux += '}';
    
    console.log('>>>>> app.post >> /consultar_blockchain >> ponto de montagem 6 >> json_aux = ' + json_aux);

    retorno.blockchain = JSON.parse(json_aux);
    
    blockchain_seguradoras[users[req.sessionID].seguradora].blockchain = retorno.blockchain;
    var minutosParaVencimentoBlockchain = 10;
    blockchain_seguradoras[users[req.sessionID].seguradora].dt_expiracao = Date.now() + minutosParaVencimentoBlockchain * 60;

    console.log('>>>>> app.post >> /consultar_blockchain >> ponto de montagem 6 >> json_aux = ' + JSON.stringify(retorno.blockchain));

    res.end(JSON.stringify(retorno));
    //sio.sockets.connected[users[req.sessionID].socketId].emit('notification', JSON.stringify(retorno));
    
    console.log('>>>>> app.post >> /consultar_blockchain >> fim');
});

function trata_autorizado(cod_autorizado) {
    if (cod_autorizado == 0) {
        return "sem resposta";
    } else if (cod_autorizado == 1) {
        return "Autorizado";
    } else if (cod_autorizado == 2) {
        return "Não autorizado";
    }
}

function formataData(_dataObj) {
    var dia = _dataObj.getDate();
    if (_dataObj.toString().length == 1)
        dia = "0"+dia;

    var mes = _dataObj.getMonth()+1;
    if (mes.toString().length == 1)
        mes = "0"+mes;

    var ano = _dataObj.getFullYear();

    return dia+"/"+mes+"/"+ano;
}

function validacao_simples(dado) {
    console.log(">>>> validacao_simples >> ponto 1 >> " + dado);
    if (typeof dado !== 'undefined' && dado) {
        console.log(">>>> validacao_simples >> ponto 2");
        if (dado.toString().length == 0 || dado.toString() == "0" || dado.toString() == "0,00") {
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