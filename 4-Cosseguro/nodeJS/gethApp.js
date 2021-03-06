'use strict';

const DEBUG_OFF_LINE = false; //Pradrão = false;

const Web3 = require('web3');
var BigNumber = require('big-number');
var fs = require('fs');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

var web3_node_obj = new Web3();
var web3_node = [];

for (w = 0; w < 10; w++) {
    web3_node.push(new Web3());
}

var cosseguroABI = [{"constant":false,"inputs":[{"name":"_index_apolice_cedido","type":"uint256"},{"name":"_situacao_autorizacao","type":"uint8"}],"name":"autorizar_acordo","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contar_apolices","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"alterar_situacao_apolice_para_assinada","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"compare","outputs":[{"name":"","type":"int256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"equal","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_codigo_apolice","type":"string"},{"name":"_premio_apolice","type":"uint64"},{"name":"_valor_cobertura","type":"uint64"},{"name":"_dt_vencimento_apolice","type":"uint256"},{"name":"_numero_aditivo","type":"uint256"},{"name":"_tipo","type":"uint16"},{"name":"_percent_comissao","type":"uint16"},{"name":"_percent_desconto","type":"uint16"},{"name":"_seguradora1","type":"address"},{"name":"_percent1","type":"uint16"},{"name":"_seguradora2","type":"address"},{"name":"_percent2","type":"uint16"},{"name":"_seguradora3","type":"address"},{"name":"_percent3","type":"uint16"}],"name":"incluir_apolice","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_adress_aux","type":"address"},{"name":"_index_acordo","type":"uint256"}],"name":"apagar_consultar_acordo_aux","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint64"},{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"contar_index_acordo","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"consultar_apolice","outputs":[{"name":"","type":"string"},{"name":"","type":"uint64"},{"name":"","type":"uint64"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contar_acordos","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"contar_seguradoras","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"},{"name":"_index_acordo","type":"uint256"}],"name":"apagar_consultar_index_acordo","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"consultar_apolice_seguradoras","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint8"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint8"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"apagar_consultar_apolice_aux","outputs":[{"name":"","type":"string"},{"name":"","type":"uint64"},{"name":"","type":"uint64"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"consultar_apolice_detalhe","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint16"},{"name":"","type":"uint16"},{"name":"","type":"uint16"},{"name":"","type":"int8"},{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_index_acordo","type":"uint256"}],"name":"consultar_acordo","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"codigo_apolice","type":"string"},{"indexed":false,"name":"premio_apolice","type":"uint64"},{"indexed":false,"name":"cobertura_apolice","type":"uint64"},{"indexed":false,"name":"dt_vencimento_apolice","type":"uint256"},{"indexed":false,"name":"numero_aditivo","type":"uint256"},{"indexed":false,"name":"sucesso","type":"bool"},{"indexed":false,"name":"cod_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_incluir_apolice","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"index_apolice","type":"uint256"},{"indexed":false,"name":"codigo_apolice","type":"string"},{"indexed":false,"name":"situacao_aprovacao","type":"int8"},{"indexed":false,"name":"sucesso","type":"bool"},{"indexed":false,"name":"cod_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_alterar_situacao_apolice_para_assinada","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"index_apolice_cedido","type":"uint256"},{"indexed":false,"name":"situacao_autorizacao","type":"uint8"},{"indexed":false,"name":"sucesso","type":"bool"},{"indexed":false,"name":"cod_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_autorizar_acordo","type":"event"}];

//const cosseguroAddress = "0x83b50c2a806213d9c7c7dbcf3d197dc12b5cf549"; //localhost
//const cosseguroAddress = "0xf506a2c7971e36a46f9365514e3385ce7fb5f6fa"; //v1 produção (compilador: ligar flag de otimização)
//const cosseguroAddress = "0x80d6273ba5c5090d147c29a02ec5175686c43d2c"; //v2 produção (compilador: ligar flag de otimização)
//const cosseguroAddress = "0xd21b2b8e1cad2bc2c72f5bece353b5d22f1e9417"; //v3 produção (compilador: ligar flag de otimização)
//const cosseguroAddress = "0xba0dce655af80e4fd2139def300d9b7f3b56fc45"; //v4 produção (compilador: ligar flag de otimização)
//const cosseguroAddress = "0x9fc2ad24ab2597eb0d845e9e4812691d69ad8c43"; //v6 produção (compilador: ligar flag de otimização)
const cosseguroAddress = "0x187ae800db2889d8ded42cfcd1b61f4987990e13"; //v7 produção (compilador: ligar flag de otimização)

var cosseguroABI_o;
var cosseguro = [];
var index_node = 0;

if (!DEBUG_OFF_LINE) {
    index_node = 1;
    //web3_node[index_node] = new web3();
    web3_node[index_node].setProvider(new web3_node_obj.providers.HttpProvider('http://testenode1.no-ip.org:80'));
    console.log('>>>>>>> web3_node['+ index_node +'].isConnected(): ' + web3_node[index_node].isConnected());
    cosseguroABI_o = web3_node[index_node].eth.contract(cosseguroABI);
    cosseguro[index_node] = cosseguroABI_o.at(cosseguroAddress);

    cosseguro[0] = cosseguroABI_o.at(cosseguroAddress); //utilizado para captura de eventos

    //index_node = 2;
    //web3_node[index_node] = new web3();
    //web3_node[index_node].setProvider(new web3_node_obj.providers.HttpProvider('http://#########:80'));
    //console.log('>>>>>>> web3_node['+ index_node +'].isConnected(): ' + web3_node[index_node].isConnected());
    //cosseguroABI_o = web3_node[index_node].eth.contract(cosseguroABI);
    //cosseguro[index_node] = cosseguroABI_o.at(cosseguroAddress);

    //index_node = 3;
    //web3_node[index_node] = new web3();
    //web3_node[index_node].setProvider(new web3_node_obj.providers.HttpProvider('http://#########:80'));
    //console.log('>>>>>>> web3_node['+ index_node +'].isConnected(): ' + web3_node[index_node].isConnected());
    //cosseguroABI_o = web3_node[index_node].eth.contract(cosseguroABI);
    //cosseguro[index_node] = cosseguroABI_o.at(cosseguroAddress);

    index_node = 4;
    //web3_node[index_node] = new web3();
    web3_node[index_node].setProvider(new web3_node_obj.providers.HttpProvider('http://prodnode4.no-ip.org:80'));
    console.log('>>>>>>> web3_node['+ index_node +'].isConnected(): ' + web3_node[index_node].isConnected());
    cosseguroABI_o = web3_node[index_node].eth.contract(cosseguroABI);
    cosseguro[index_node] = cosseguroABI_o.at(cosseguroAddress);
}

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
        if (usuario == "seg4" && senha == "seg") { //incluir validação de usuario pelo MongoDB
            users[req.sessionID].userName = usuario;
            users[req.sessionID].seguradora = 4;
            blockchain_seguradoras[users[req.sessionID].seguradora] = {"dt_expiracao": 0, forcar_atualizacao: false, "blockchain": {}};

            console.log('>>>>> app.post >> /login >> usuário autenticado >> userName = ' + usuario);
            console.log('>>>>> app.post >> /login >> usuário autenticado >> req.sessionID = ' + req.sessionID);
            console.log('>>>>> app.post >> /login >> usuário autenticado >> users[' + req.sessionID + '] = ' + JSON.stringify(users[req.sessionID]));

            retorno.msg = "Sessao validada";
            retorno.sucesso = true;
        } else if (usuario == "seg2" && senha == "seg") { //incluir validação de usuario pelo MongoDB
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

app.post('/incluir_apolice', urlencodedParser, function (req, res) {
    var codigo_apolice = req.body.codigo_apolice;
    var valor_premio = formata_numero_subida(req.body.valor_premio);
    var valor_cobertura = formata_numero_subida(req.body.valor_cobertura);
    var dt_vencimento = req.body.dt_vencimento;
    var numero_aditivo = req.body.numero_aditivo;
    var tipo = req.body.tipo;
    var persent_comisao = req.body.persent_comisao;
    var persent_desconto = req.body.persent_desconto;
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
    retorno.apolice.numero_aditivo = numero_aditivo;
    retorno.apolice.tipo = tipo;
    retorno.apolice.persent_comisao = persent_comisao;
    retorno.apolice.persent_desconto = persent_desconto;
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
        retorno.msgTecnica = "/incluir_apolice >> sessionValid -> req.body.usuario = " + req.body.usuario;
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

    if (!validacao_simples(req.body.numero_aditivo)) {
        retorno.msg += "Numero do Aditivo: inválido\n";
        retorno.sucesso = false;
    }
        
    if (!validacao_simples(req.body.tipo)) {
        retorno.msg += "Tipo: inválido\n";
        retorno.sucesso = false;
    }
        
    if (!validacao_simples(req.body.persent_comisao)) {
        retorno.msg += "Persentual da Comissao: inválido\n";
        retorno.sucesso = false;
    }
        
    if (!validacao_simples(req.body.persent_desconto)) {
        retorno.msg += "Persentual do Desconto: inválido\n";
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
    
    if (!DEBUG_OFF_LINE) {
        cosseguro[users[req.sessionID].seguradora].incluir_apolice.sendTransaction(
                            codigo_apolice, 
                            valor_premio, 
                            valor_cobertura, 
                            dt_vencimento, 
                            numero_aditivo, 
                            tipo, 
                            persent_comisao, 
                            persent_desconto, 
                            req.body.seg1_addr, 
                            req.body.seg1_persent, 
                            req.body.seg2_addr, 
                            req.body.seg2_persent, 
                            req.body.seg3_addr, 
                            req.body.seg3_persent, {
            from: web3_node[users[req.sessionID].seguradora].eth.coinbase, gas: 3500000 }, function(err, txHash) {
                if (err != null) {
                    retorno.msg = "Erro ao tentar incluir uma apolice";
                    retorno.msgTecnica = "cosseguro.incluir_apolice.sendTransaction => " + err;
                    retorno.sucesso = false;
                    retorno.txHash = txHash;
                    retorno.retornoApresentado = false;
                    retorno.sucesso_alt_blockchain = "";
                    retorno.mensagem_blockchain = "";

                    res.end(JSON.stringify(retorno));
                } else {
                    retorno.msg = "Em andamento a minera&ccedil;&atilde;o da nova apólice";
                    console.log(">>>> incluir_apolice >> retorno.msg: " + retorno.msg);
                    retorno.sucesso = true;
                    retorno.txHash = txHash;
                    retorno.retornoApresentado = false;
                    retorno.sucesso_alt_blockchain = "";
                    retorno.sucesso = true;
                    retorno.mensagem_blockchain = "";

                    txHashs[txHash] = req.sessionID; //utilizado para que o evento possa dar o retorno para o client correto.
                    
                    res.end(JSON.stringify(retorno));
                }
            }
        );
    } else { //off-line
        retorno.msg = "Em andamento a minera&ccedil;&atilde;o da nova apólice";
        console.log(">>>> incluir_apolice \"DEBUG_OFF_LINE\" >> retorno.msg: " + retorno.msg);
        retorno.sucesso = true;
        retorno.txHash = 0;
        retorno.retornoApresentado = false;
        retorno.sucesso_alt_blockchain = "";
        retorno.sucesso = true;
        retorno.mensagem_blockchain = "";
        res.end(JSON.stringify(retorno));
    }

    //sio.sockets.connected[users[req.sessionID].socketId].emit('notification', mensagem);
    console.log('>>>>> app.post >> /incluir_apolice');
});

//event ret_incluir_apolice(string codigo, uint64 premio, uint64 cobertura, uint dt_vencimento, uint qtde_seguradoras, uint index_array_apolice, uint index_array_seguradoras, uint index_array_acordo, bool sucesso, int cod_retorno, string descricao);
if (!DEBUG_OFF_LINE) {
    cosseguro[0].ret_incluir_apolice(function(error, result){
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
                    retorno.apolice.numero_aditivo = result.args.numero_aditivo;

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
}


app.post('/alterar_situacao_apolice_para_assinada', urlencodedParser, function (req, res) {
    var index_apolice = req.body.index_apolice;
    
    var retorno = {};
    retorno.funcao = "Cadastro de Apolice";
    retorno.msg = "";
    retorno.msgTecnica = "";
    retorno.sucesso = true;
    retorno.txHash = "";
    retorno.retornoApresentado = false;
    retorno.sucesso_alt_blockchain = false;
    retorno.mensagem_blockchain = "";
    retorno.index_apolice = index_apolice;
    retorno.loginError = false;

    res.writeHead("200", {"Content-Type": "application/json"});
    
    if (!sessionValid(req.body.usuario, req)) {
        retorno.msg = "usuário inválido!";
        retorno.msgTecnica = "/alterar_situacao_apolice_para_assinada >> sessionValid -> req.body.usuario = " + req.body.usuario;
        retorno.loginError = true;
        console.log(">>>>> " + retorno.msgTecnica);
        res.end(JSON.stringify(retorno));
        return false;
    }

    if (!validacao_simples(index_apolice)) {
        retorno.msg += "index_apolice: inválido\n";
        retorno.sucesso = false;
    }
    
    if (!retorno.sucesso) {
        retorno.msg = "Verifique o(s) erro(s) abaixo:\n" + retorno.msg;
        res.end(JSON.stringify(retorno));
        console.log(">>>> alterar_situacao_apolice_para_assinada >> ponto 1.5 >> retorno.msg = " + retorno.msg);
        return;
    }

    console.log(">>>> alterar_situacao_apolice_para_assinada >> ponto 2");
    
    valor_premio = formata_valor_subida(valor_premio);
    valor_cobertura = formata_valor_subida(valor_cobertura);
    
    if (!DEBUG_OFF_LINE) {
        cosseguro[users[req.sessionID].seguradora].alterar_situacao_apolice_para_assinada.sendTransaction(
                            index_apolice, {
            from: web3_node[users[req.sessionID].seguradora].eth.coinbase, gas: 3500000 }, function(err, txHash) {
                if (err != null) {
                    retorno.msg = "Erro ao tentar alterar a situacao da apolice para assinada";
                    retorno.msgTecnica = "cosseguro.alterar_situacao_apolice_para_assinada.sendTransaction => " + err;
                    retorno.sucesso = false;
                    retorno.txHash = txHash;
                    retorno.retornoApresentado = false;
                    retorno.sucesso_alt_blockchain = "";
                    retorno.mensagem_blockchain = "";

                    res.end(JSON.stringify(retorno));
                } else {
                    retorno.msg = "Em andamento a minera&ccedil;&atilde;o da alteração da situacao da apolice para assinada";
                    console.log(">>>> alterar_situacao_apolice_para_assinada >> retorno.msg: " + retorno.msg);
                    retorno.sucesso = true;
                    retorno.txHash = txHash;
                    retorno.retornoApresentado = false;
                    retorno.sucesso_alt_blockchain = "";
                    retorno.sucesso = true;
                    retorno.mensagem_blockchain = "";

                    txHashs[txHash] = req.sessionID; //utilizado para que o evento possa dar o retorno para o client correto.
                    
                    res.end(JSON.stringify(retorno));
                }
            }
        );
    } else {
        retorno.msg = "Em andamento a minera&ccedil;&atilde;o da alteração da situacao da apolice para assinada";
        console.log(">>>> alterar_situacao_apolice_para_assinada \"DEBUG_OFF_LINE\" >> retorno.msg: " + retorno.msg);
        retorno.sucesso = true;
        retorno.txHash = txHash;
        retorno.retornoApresentado = false;
        retorno.sucesso_alt_blockchain = "";
        retorno.sucesso = true;
        retorno.mensagem_blockchain = "";

        res.end(JSON.stringify(retorno));
    }

    //sio.sockets.connected[users[req.sessionID].socketId].emit('notification', mensagem);
    console.log('>>>>> app.post >> /alterar_situacao_apolice_para_assinada');
});
/////////////////////////////////////////////
// fim apolice                             //
/////////////////////////////////////////////


/////////////////////////////////////////////
// inicio acordo                           //
/////////////////////////////////////////////
app.post('/autorizar_acordo', urlencodedParser, function (req, res) {
    var index_apolice = req.body.index_apolice;
    var situacao_autorizacao = req.body.situacao_autorizacao;
    
    var retorno = {};
    retorno.funcao = "Autorização do Acordo";
    retorno.msg = "";
    retorno.msgTecnica = "";
    retorno.sucesso = true;
    retorno.txHash = "";
    retorno.retornoApresentado = false;
    retorno.sucesso_alt_blockchain = false;
    retorno.mensagem_blockchain = "";
    retorno.index_apolice = index_apolice;
    retorno.situacao_autorizacao = situacao_autorizacao;
    retorno.loginError = false;
    
    res.writeHead("200", {"Content-Type": "application/json"});
    
    if (!sessionValid(req.body.usuario, req)) {
        retorno.msg = "usuário inválido!";
        retorno.msgTecnica = "/autorizar_acordo >> sessionValid -> req.body.usuario = " + req.body.usuario;
        console.log(">>>>> " + retorno.msgTecnica);
        retorno.loginError = true;
        res.end(retorno);
        return false;
    }

    if (!validacao_simples(index_apolice)) {
        retorno.msg += "Index da apolice: inválida\n";
        retorno.sucesso = false;
    }
    
    if (!validacao_simples(situacao_autorizacao)) {
        retorno.msg += "Situação da Autorização: inválida\n";
        retorno.sucesso = false;
    }

    console.log(">>>> autorizar_acordo >> ponto 2");
    
    if (!DEBUG_OFF_LINE) {
        cosseguro[users[req.sessionID].seguradora].autorizar_acordo.sendTransaction(codigo_apolice, situacao_autorizacao, {
            from: web3_node[users[req.sessionID].seguradora].eth.coinbase, gas: 3500000 }, function(err, txHash) {
                if (err != null) {
                    retorno.msg = "Erro ao tentar autorizar ou rejeitar o acordo";
                    retorno.msgTecnica = "cosseguro.autorizar_acordo.sendTransaction => " + err;
                    retorno.sucesso = false;
                    retorno.txHash = txHash;
                    retorno.retornoApresentado = false;
                    retorno.sucesso_alt_blockchain = "";
                    retorno.mensagem_blockchain = "";

                    res.end(retorno);
                } else {
                    retorno.msg = "Em andamento a minera&ccedil;&atilde;o da autorização ou rejeição do acordo";
                    console.log(">>>> autorizar_acordo >> retorno.msg: " + retorno.msg);
                    retorno.sucesso = true;
                    retorno.txHash = txHash;
                    retorno.retornoApresentado = false;
                    retorno.sucesso_alt_blockchain = "";
                    retorno.mensagem_blockchain = "";

                    txHashs[txHash] = users[req.sessionID].socketId; //utilizado para que o eventoi possa dar o retorno para o client correto.
                    
                    res.end(JSON.stringify(retorno));
                }
            }
        );
    } else { //off-line
        retorno.msg = "Em andamento a minera&ccedil;&atilde;o da autorização ou rejeição do acordo";
        console.log(">>>> autorizar_acordo >> retorno.msg: " + retorno.msg);
        retorno.sucesso = true;
        retorno.txHash = "offline offline offline offline offline offline ";
        retorno.retornoApresentado = false;
        retorno.sucesso_alt_blockchain = "";
        retorno.mensagem_blockchain = "";

        res.end(JSON.stringify(retorno));
    }

    //sio.sockets.connected[users[req.sessionID].socketId].emit('notification', mensagem);
    console.log('>>>>> app.post >> /autorizar_acordo');
});

if (!DEBUG_OFF_LINE) {
    //event ret_autorizar_acordo(uint index_apolice_cedido, uint index_acordo_aceito, address addr_cedido, bool sucesso, int cod_retorno, string descricao);
    cosseguro[0].ret_autorizar_acordo(function(error, result){
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
}
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
    var total_acordos = 0;
    var arr_captura_apolices = [];
    var arr_captura_apolices_seguradoras = [];
    var arr_captura_apolices_detalhes = [];
    var arr_captura_acordos = [];
    var arr_captura_acordos_detalhado = [];
    var arr_captura_acordos_seguradoras = [];


    if (!DEBUG_OFF_LINE) {
        total_apolices = parseInt(cosseguro[users[req.sessionID].seguradora].contar_apolices().toString());
    
        for (var iA = 0; iA < total_apolices; iA++) {
            arr_captura_apolices[iA] = cosseguro[users[req.sessionID].seguradora].consultar_apolice(iA);
            console.log('>>>>> app.post >> /consultar_blockchain >> ponto 4.1 >> arr_captura_apolices['+ iA +'] = ' + JSON.stringify(arr_captura_apolices[iA]));

            arr_captura_apolices_seguradoras[iA] = cosseguro[users[req.sessionID].seguradora].consultar_apolice_seguradoras(iA);
            console.log('>>>>> app.post >> /consultar_blockchain >> ponto 4.2 >> arr_captura_apolices_seguradoras['+ iA +'] = ' + JSON.stringify(arr_captura_apolices_seguradoras[iA]));

            arr_captura_apolices_detalhes[iA] = cosseguro[users[req.sessionID].seguradora].consultar_apolice_detalhe(iA);
            console.log('>>>>> app.post >> /consultar_blockchain >> ponto 4.3 >> arr_captura_apolices_detalhes['+ iA +'] = ' + JSON.stringify(arr_captura_apolices_detalhes[iA]));
        }
        console.log('>>>>> app.post >> /consultar_blockchain >> ponto 5');

        total_acordos = parseInt(cosseguro[users[req.sessionID].seguradora].contar_acordos().toString());
    
        var index_apolice_aux;
        for (var iAcord = 0; iAcord < total_acordos; iAcord++) {
            index_apolice_aux = cosseguro[users[req.sessionID].seguradora].consultar_acordos(iAcord);
            arr_captura_acordos[iAcord] = cosseguro[users[req.sessionID].seguradora].consultar_apolice(index_apolice_aux) + ',' + index_apolice_aux;
            arr_captura_acordos_detalhado[iAcord] = cosseguro[users[req.sessionID].seguradora].consultar_apolice_detalhe(index_apolice_aux) + ',' + index_apolice_aux;
            arr_captura_acordos_seguradoras[iAcord] = cosseguro[users[req.sessionID].seguradora].consultar_apolice_seguradoras(index_apolice_aux) + ',' + index_apolice_aux;

            console.log('>>>>> app.post >> /consultar_blockchain >> ponto 4 >> arr_captura_acordos['+ iAcord +'] = ' + JSON.stringify(arr_captura_acordos[iAcord]) + ',' +  + ',' + index_apolice_aux);
        }
        console.log('>>>>> app.post >> /consultar_blockchain >> ponto 5');

        var json_aux = '{';
        json_aux += '"apolices":[';

        var arr_quebra_dado_acordo = [];
        var arr_quebra_dado_acordo_detalhado = [];
        var arr_quebra_dado_acordo_seguradora = [];
        var arr_quebra_dado_apolice = [];
        var arr_quebra_dado_apolice_detalhe = [];
        var arr_quebra_dado_apolice_seguradora = [];
        
        var codigo_op_aux;
        var valor_premio;
        var valor_cobertura;
        var dt_vencimento;
        var numero_aditivo;
        var tipo;
        var percent_comissao;
        var percent_desconto;
        var situacao_aprovacao;
        var assinado_cliente;

        var addr_seguradora1;
        var percent1;
        var autorizado1;
        
        var addr_seguradora2;
        var percent2;
        var autorizado2;
        
        var addr_seguradora3;
        var percent3;
        var autorizado3;
        
        var todas_autorizadas;

        //var dados_apolice;
        //var dados_apolice_detalhe;
        //var dados_apolice_seguradora;

        var virgula_acordo = '';
        var virgula_apolice = '';

        for (var iApolices=0; iApolices < arr_captura_apolices.length; iApolices++) {
            console.log('>>>>> app.post >> /consultar_blockchain >> ponto de montagem 1 >> iApolices = ' + iApolices);
            //dados_apolice = arr_apolices[iApolices];
            //dados_apolice_detalhe = arr_apolices_detalhes[iApolices];

            arr_quebra_dado_apolice = arr_captura_apolices[iApolices].toString().split(",");
            arr_quebra_dado_apolice_detalhe = arr_captura_apolices_detalhes[iApolices].toString().split(",");
            arr_quebra_dado_apolice_seguradora = arr_captura_apolices_seguradoras[iApolices].toString().split(",");

            console.log('>>>>> app.post >> /consultar_blockchain >> ponto de montagem 2 >> dados_apolice = ' + JSON.stringify(arr_captura_apolices[iApolices]));

            codigo_op_aux = arr_quebra_dado_apolice[0].replace(/[^\x20-\x7E]+/g, '') + "";
            valor_premio = arr_quebra_dado_apolice[1];
            valor_cobertura = arr_quebra_dado_apolice[2];
            dt_vencimento = new Date(parseInt(arr_quebra_dado_apolice[3].toString()));
            numero_aditivo = arr_quebra_dado_apolice_detalhe[0];
            tipo = arr_quebra_dado_apolice_detalhe[1];
            percent_comissao = arr_quebra_dado_apolice_detalhe[2];
            percent_desconto = arr_quebra_dado_apolice_detalhe[3];
            situacao_aprovacao = arr_quebra_dado_apolice_detalhe[4];
            assinado_cliente = arr_quebra_dado_apolice_detalhe[5];

            json_aux += virgula_apolice;
            json_aux += '{';

            json_aux += '"index_apolice":"' + iApolices + '",';
            json_aux += '"codigo_apolice":"' + codigo_op_aux + '",';
            json_aux += '"valor_premio":"' + valor_premio + '",';
            json_aux += '"valor_cobertura":"' + valor_cobertura + '",';
            json_aux += '"dt_vencimento":"' + formataData(dt_vencimento) + '",';
            json_aux += '"numero_aditivo":"' + numero_aditivo + '",';
            json_aux += '"tipo":"' + tipo + '",';
            json_aux += '"percent_comissao":' + percent_comissao + ',';
            json_aux += '"percent_desconto":' + percent_desconto + ',';
            json_aux += '"situacao_aprovacao":' + situacao_aprovacao + ',';  //quando for maior que 0 ainda há seguradoras que não aprovaram; quando for zero todas aceitaram; quando for negativo alguma cosseguradora não aceitou;
            json_aux += '"assinado_cliente":' + assinado_cliente + ',';

            json_aux += '"seguradoras":['; // cosseguradoras da apolice (cedido)

            //var dados_apolice_detalhe_seguradoras = arr_apolices_seguradoras[iApolices];
            //arr_aux_apolices_seguradoras = arr_apolices_seguradoras[iApolices].toString().split(",");
            addr_seguradora1 = arr_quebra_dado_apolice_seguradora[0];
            percent1 = arr_quebra_dado_apolice_seguradora[1];
            autorizado1 = arr_quebra_dado_apolice_seguradora[2];
            
            addr_seguradora2 = arr_quebra_dado_apolice_seguradora[3];
            percent2 = arr_quebra_dado_apolice_seguradora[4];
            autorizado2 = arr_quebra_dado_apolice_seguradora[5];
            
            addr_seguradora3 = arr_quebra_dado_apolice_seguradora[6];
            percent3 = arr_quebra_dado_apolice_seguradora[7];
            autorizado3 = arr_quebra_dado_apolice_seguradora[8];
            
            todas_autorizadas = true;

            json_aux += '{';
            json_aux += '"index_seguradora":"' + 0 + '",';
            json_aux += '"addr_seguradora":"' + addr_seguradora1 + '",';
            json_aux += '"percent":"' + percent1 + '",';
            json_aux += '"autorizado":"' + autorizado1 + '"';
            if (!autorizado1) {
                todas_autorizadas = false;
            }
            json_aux += '}';

            if (parseInt(percent2) > 0) {
                json_aux += ',{';
                json_aux += '"index_seguradora":"' + 1 + '",';
                json_aux += '"addr_seguradora":"' + addr_seguradora2 + '",';
                json_aux += '"percent":"' + percent2 + '",';
                json_aux += '"autorizado":"' + autorizado2 + '"';
                if (!autorizado2) {
                    todas_autorizadas = false;
                }
                json_aux += '}';
            }

            if (parseInt(percent3) > 0) {
                json_aux += ',{';
                json_aux += '"index_seguradora":"' + 2 + '",';
                json_aux += '"addr_seguradora":"' + addr_seguradora3 + '",';
                json_aux += '"percent":"' + percent3 + '",';
                json_aux += '"autorizado":"' + autorizado3 + '"';
                if (!autorizado3) {
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

        json_aux += '"acordos":['; // acordos que a seguradora participa como cosseguradora (aceito)
        for (var iAcordo=0; iAcordo < total_acordos; iAcordo++) {
                arr_quebra_dado_acordo = arr_captura_acordos[iAcordo].toString().split(",");
                arr_quebra_dado_acordo_detalhado = arr_captura_acordos_detalhado[iAcordo].toString().split(",");
                arr_quebra_dado_acordo_seguradora = arr_captura_acordos_seguradoras[iAcordo].toString().split(",");

                codigo_op_aux = arr_quebra_dado_acordo[0].replace(/[^\x20-\x7E]+/g, '') + "";
                valor_premio = arr_quebra_dado_acordo[1];
                valor_cobertura = arr_quebra_dado_acordo[2];
                dt_vencimento = new Date(parseInt(arr_quebra_dado_acordo[3].toString()));
                numero_aditivo = arr_quebra_dado_acordo_detalhado[0];
                tipo = arr_quebra_dado_acordo_detalhado[1];
                percent_comissao = arr_quebra_dado_acordo_detalhado[2];
                percent_desconto = arr_quebra_dado_acordo_detalhado[3];
                assinado_cliente = arr_quebra_dado_acordo_detalhado[5];
                index_apolice = arr_quebra_dado_acordo_detalhado[6];
                
                percent = arr_quebra_dado_acordo_seguradora[1].toString();
                autorizado = arr_quebra_dado_acordo_seguradora[2];
                //////////////////////////////////////////////////////
                /////// continuar ////////////////////////////////////
                //////////////////////////////////////////////////////
                json_aux += virgula_acordo;
                json_aux += '{';

                json_aux += '"index_apolice":'+ index_apolice +',';
                json_aux += '"codigo_apolice":"' + codigo_op_aux + '",';
                json_aux += '"valor_premio":"' + valor_premio + '",';
                json_aux += '"valor_cobertura":"' + valor_cobertura + '",';
                json_aux += '"dt_vencimento":"' + formataData(dt_vencimento) + '",';
                json_aux += '"addr_seguradora":"' + addr_seguradora + '",';
                json_aux += '"percent":"' + percent + '"';
                json_aux += '"numero_aditivo":"'+ numero_aditivo +'",';
                json_aux += '"tipo":"'+ tipo +'",';
                json_aux += '"percent_comissao":'+ percent_comissao +',';
                json_aux += '"percent_desconto":'+ percent_desconto +',';
                json_aux += '"assinado_cliente":'+ assinado_cliente +',';
                json_aux += '"autorizado":"' + autorizado + '"';
                json_aux += '}';
                virgula_acordo = ',';
        }
        json_aux += ']';

        json_aux += '}';
    } else { // DEBUG_OFF_LINE = true;

        json_aux = '{';
            json_aux += '"apolices":[';
                json_aux += '{';
                    json_aux += '"index_apolice":0,';
                    json_aux += '"codigo_apolice":"AP00001",';
                    json_aux += '"valor_premio":"10000000",';
                    json_aux += '"valor_cobertura":"10000000000",';
                    json_aux += '"dt_vencimento":"31/01/2018",';
                    json_aux += '"numero_aditivo":"0000000000001",';
                    json_aux += '"tipo":"01",';
                    json_aux += '"percent_comissao":1,';
                    json_aux += '"percent_desconto":2,';
                    json_aux += '"situacao_aprovacao":1,';  //quando for maior que 0 ainda há seguradoras que não aprovaram; quando for zero todas aceitaram; quando for negativo alguma cosseguradora não aceitou;
                    json_aux += '"assinado_cliente":false,';

                    json_aux += '"seguradoras":['; // cosseguradoras da apolice (cedido)

                        json_aux += '{';
                            json_aux += '"index_seguradora":1,';
                            json_aux += '"addr_seguradora":"addr_2409234029834098234098243",';
                            json_aux += '"percent":20,';
                            json_aux += '"autorizado":true';
                        json_aux += '}';

                        json_aux += ',{';
                            json_aux += '"index_seguradora":2,';
                            json_aux += '"addr_seguradora":"addr_7089560965068705085608505",';
                            json_aux += '"percent":20,';
                            json_aux += '"autorizado":false';
                        json_aux += '}';

                        json_aux += ',{';
                            json_aux += '"index_seguradora":3,';
                            json_aux += '"addr_seguradora":"addr_1735623675362365236523652",';
                            json_aux += '"percent":20,';
                            json_aux += '"autorizado":true';
                        json_aux += '}';

                    json_aux += ']';
                json_aux += '}';

                json_aux += ',{';
                    json_aux += '"index_apolice":1,';
                    json_aux += '"codigo_apolice":"AP00002",';
                    json_aux += '"valor_premio":"20000000",';
                    json_aux += '"valor_cobertura":"20000000000",';
                    json_aux += '"dt_vencimento":"31/02/2018",';
                    json_aux += '"numero_aditivo":"0000000000002",';
                    json_aux += '"tipo":"02",';
                    json_aux += '"percent_comissao":2,';
                    json_aux += '"percent_desconto":3,';
                    json_aux += '"situacao_aprovacao":1,';  //quando for maior que 0 ainda há seguradoras que não aprovaram; quando for zero todas aceitaram; quando for negativo alguma cosseguradora não aceitou;
                    json_aux += '"assinado_cliente":false,';

                    json_aux += '"seguradoras":['; // cosseguradoras da apolice (cedido)

                        json_aux += '{';
                            json_aux += '"index_seguradora":1,';
                            json_aux += '"addr_seguradora":"addr_2409234029834098234098243",';
                            json_aux += '"percent":"20",';
                            json_aux += '"autorizado":true';
                        json_aux += '}';

                        json_aux += ',{';
                            json_aux += '"index_seguradora":2,';
                            json_aux += '"addr_seguradora":"addr_7089560965068705085608505",';
                            json_aux += '"percent":20,';
                            json_aux += '"autorizado":false';
                        json_aux += '}';

                    json_aux += ']';
                json_aux += '}';

                json_aux += ',{';
                    json_aux += '"index_apolice":2,';
                    json_aux += '"codigo_apolice":"AP00003",';
                    json_aux += '"valor_premio":"30000000",';
                    json_aux += '"valor_cobertura":"30000000000",';
                    json_aux += '"dt_vencimento":"31/03/2018",';
                    json_aux += '"numero_aditivo":"0000000000003",';
                    json_aux += '"tipo":"03",';
                    json_aux += '"percent_comissao":3,';
                    json_aux += '"percent_desconto":4,';
                    json_aux += '"situacao_aprovacao":0,';  //quando for maior que 0 ainda há seguradoras que não aprovaram; quando for zero todas aceitaram; quando for negativo alguma cosseguradora não aceitou;
                    json_aux += '"assinado_cliente":false,';

                    json_aux += '"seguradoras":['; // cosseguradoras da apolice (cedido)

                        json_aux += '{';
                            json_aux += '"index_seguradora":1,';
                            json_aux += '"addr_seguradora":"addr_2409234029834098234098243",';
                            json_aux += '"percent":20,';
                            json_aux += '"autorizado":true';
                        json_aux += '}';

                    json_aux += ']';
                json_aux += '}';

                json_aux += ',{';
                    json_aux += '"index_apolice":3,';
                    json_aux += '"codigo_apolice":"AP00004",';
                    json_aux += '"valor_premio":"40000000",';
                    json_aux += '"valor_cobertura":"40000000000",';
                    json_aux += '"dt_vencimento":"31/04/2018",';
                    json_aux += '"numero_aditivo":"0000000000004",';
                    json_aux += '"tipo":"04",';
                    json_aux += '"percent_comissao":4,';
                    json_aux += '"percent_desconto":5,';
                    json_aux += '"situacao_aprovacao":0,';  //quando for maior que 0 ainda há seguradoras que não aprovaram; quando for zero todas aceitaram; quando for negativo alguma cosseguradora não aceitou;
                    json_aux += '"assinado_cliente":true,';

                    json_aux += '"seguradoras":['; // cosseguradoras da apolice (cedido)

                        json_aux += '{';
                            json_aux += '"index_seguradora":1,';
                            json_aux += '"addr_seguradora":"addr_2409234029834098234098243",';
                            json_aux += '"percent":20,';
                            json_aux += '"autorizado":true';
                        json_aux += '}';

                    json_aux += ']';
                json_aux += '}';

            json_aux += '],';

            json_aux += '"acordos":['; // acordos que a seguradora participa como cosseguradora (aceito)
                json_aux += '{';
                    json_aux += '"index_apolice":0,';
                    json_aux += '"codigo_apolice":"AP_Cosseg1",';
                    json_aux += '"valor_premio":100000,';
                    json_aux += '"valor_cobertura":900000000,';
                    json_aux += '"dt_vencimento":"31/01/2017",';
                    json_aux += '"numero_aditivo":"0000000000001",';
                    json_aux += '"tipo":"01",';
                    json_aux += '"percent_comissao":1,';
                    json_aux += '"percent_desconto":2,';
                    json_aux += '"addr_seguradora":"addr_2928498723498723498723491",';
                    json_aux += '"percent":"10",';
                    json_aux += '"autorizado":true';
                json_aux += '}';

                json_aux += ',{';
                    json_aux += '"index_apolice":1,';
                    json_aux += '"codigo_apolice":"AP_Cosseg2",';
                    json_aux += '"valor_premio":200000,';
                    json_aux += '"valor_cobertura":800000000,';
                    json_aux += '"dt_vencimento":"31/02/2017",';
                    json_aux += '"numero_aditivo":"0000000000002",';
                    json_aux += '"tipo":"02",';
                    json_aux += '"percent_comissao":2,';
                    json_aux += '"percent_desconto":3,';
                    json_aux += '"addr_seguradora":"addr_2928498723498723498723492",';
                    json_aux += '"percent":"20",';
                    json_aux += '"autorizado":false';
                json_aux += '}';

                json_aux += ',{';
                    json_aux += '"index_apolice":2,';
                    json_aux += '"codigo_apolice":"AP_Cosseg3",';
                    json_aux += '"valor_premio":300000,';
                    json_aux += '"valor_cobertura":700000000,';
                    json_aux += '"dt_vencimento":"31/03/2017",';
                    json_aux += '"numero_aditivo":"0000000000003",';
                    json_aux += '"tipo":"03",';
                    json_aux += '"percent_comissao":3,';
                    json_aux += '"percent_desconto":4,';
                    json_aux += '"addr_seguradora":"addr_2928498723498723498723493",';
                    json_aux += '"percent":"30",';
                    json_aux += '"autorizado":true';
                json_aux += '}';
            json_aux += ']';

        json_aux += '}';
    }

    console.log('>>>>> app.post >> /consultar_blockchain >> ponto de montagem 6 >> json_aux = ' + json_aux);

    retorno.blockchain = JSON.parse(json_aux);
    
    blockchain_seguradoras[users[req.sessionID].seguradora].blockchain = retorno.blockchain;
    var minutosParaVencimentoBlockchain = 10;
    blockchain_seguradoras[users[req.sessionID].seguradora].dt_expiracao = Date.now() + minutosParaVencimentoBlockchain * 60;

    console.log('>>>>> app.post >> /consultar_blockchain >> ponto de montagem 6 >> json_aux = ' + JSON.stringify(retorno.blockchain));

    res.end(JSON.stringify(retorno));
    blockchain_seguradoras[users[req.sessionID].seguradora].forcar_atualizacao = false;
    //sio.sockets.connected[users[req.sessionID].socketId].emit('notification', JSON.stringify(retorno));
    
    console.log('>>>>> app.post >> /consultar_blockchain >> fim');
});

/*
function trata_autorizado(cod_autorizado) {
    if (cod_autorizado == 0) {
        return "sem resposta";
    } else if (cod_autorizado == 1) {
        return "Autorizado";
    } else if (cod_autorizado == 2) {
        return "Não autorizado";
    }
}
*/

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