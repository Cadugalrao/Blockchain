'use strict';

const Web3 = require('web3');
var fs = require('fs');
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var web3_node1 = new Web3();
const gestao_garantiasABI = [{"constant":false,"inputs":[{"name":"_id_garantia","type":"bytes32"},{"name":"_id_bem","type":"uint32"},{"name":"tipo","type":"int32"}],"name":"liberar_bem_e_direito","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bens","outputs":[{"name":"codigo","type":"bytes32"},{"name":"valor","type":"uint64"},{"name":"valor_atualizado","type":"uint64"},{"name":"tipo","type":"uint32"}],"type":"function"},{"constant":false,"inputs":[{"name":"id_garantia","type":"bytes32"},{"name":"id_bem","type":"uint32"},{"name":"percent","type":"uint32"}],"name":"incluir_associacao","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"entrada","type":"bytes32"},{"name":"inicial","type":"uint32"},{"name":"tamanho","type":"uint32"}],"name":"subString","outputs":[{"name":"retorno","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"index_bem","type":"uint32"},{"name":"valor_atualizado","type":"uint64"}],"name":"alterar_bem","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"},{"name":"node","type":"bytes32"}],"name":"incluir_permissao","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"b","type":"bytes32"},{"name":"char","type":"uint256"}],"name":"charAt","outputs":[{"name":"","type":"bytes1"}],"type":"function"},{"constant":false,"inputs":[{"name":"index_garantia","type":"uint32"},{"name":"valor_atualizado","type":"uint64"}],"name":"alterar_garantia","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"garantias","outputs":[{"name":"codigo","type":"bytes32"},{"name":"valor","type":"uint64"},{"name":"valor_atualizado","type":"uint64"}],"type":"function"},{"constant":true,"inputs":[],"name":"contador_associacao","outputs":[{"name":"","type":"uint32"}],"type":"function"},{"constant":true,"inputs":[],"name":"contador_bem","outputs":[{"name":"","type":"uint32"}],"type":"function"},{"constant":false,"inputs":[{"name":"codigo","type":"bytes32"},{"name":"valor","type":"uint64"}],"name":"incluir_bem","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"codigo","type":"bytes32"},{"name":"valor","type":"uint64"}],"name":"incluir_garantia","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"contador_garantia","outputs":[{"name":"","type":"uint32"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"associacoes","outputs":[{"name":"id_garantia","type":"bytes32"},{"name":"id_bem","type":"uint32"},{"name":"percentual","type":"uint32"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"codigo_item_acessado","type":"uint32"},{"indexed":false,"name":"codigo","type":"bytes32"},{"indexed":false,"name":"valor","type":"uint64"},{"indexed":false,"name":"string_com_erro","type":"bytes32"},{"indexed":false,"name":"codigo_erro","type":"int256"}],"name":"ReturnBem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"codigo_item_acessado","type":"uint32"},{"indexed":false,"name":"codigo","type":"bytes32"},{"indexed":false,"name":"valor","type":"uint64"},{"indexed":false,"name":"string_com_erro","type":"bytes32"},{"indexed":false,"name":"codigo_erro","type":"int256"}],"name":"ReturnBemAlt","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"codigo_item_acessado","type":"uint32"},{"indexed":false,"name":"codigo","type":"bytes32"},{"indexed":false,"name":"valor","type":"uint64"},{"indexed":false,"name":"string_com_erro","type":"bytes32"},{"indexed":false,"name":"codigo_erro","type":"int256"}],"name":"ReturnGarantia","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"codigo_item_acessado","type":"uint32"},{"indexed":false,"name":"codigo","type":"bytes32"},{"indexed":false,"name":"valor","type":"uint64"},{"indexed":false,"name":"string_com_erro","type":"bytes32"},{"indexed":false,"name":"codigo_erro","type":"int256"}],"name":"ReturnGarantiaAlt","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"codigo_item_acessado","type":"uint32"},{"indexed":false,"name":"id_garantia","type":"bytes32"},{"indexed":false,"name":"index_g","type":"uint256"},{"indexed":false,"name":"id_bem","type":"uint32"},{"indexed":false,"name":"percentual","type":"uint32"},{"indexed":false,"name":"total_percent_aloc_bem","type":"uint32"},{"indexed":false,"name":"string_com_erro","type":"bytes32"},{"indexed":false,"name":"valor_erro","type":"int256"}],"name":"ReturnAssociacao","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"endereco_banco","type":"address"},{"indexed":false,"name":"permissao","type":"bytes32"},{"indexed":false,"name":"string_com_erro","type":"bytes32"},{"indexed":false,"name":"valor_erro","type":"int256"}],"name":"ReturnPermissao","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"bytes32"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"id_bem","type":"uint32"},{"indexed":false,"name":"string_com_erro","type":"bytes32"},{"indexed":false,"name":"valor_erro","type":"int256"}],"name":"ReturnLiberacao","type":"event"}];
//cons gestao_garantiasAddress = "0xbbbc8275f9f355211020a52957246cd763e48484";
const gestao_garantiasAddress = "0xbbbc8275f9f355211020a52957246cd763e48484";



// Constants
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
app.use(session({secret: 'AccentureCaduePlata'}));

var server = require('http').Server(app);
var sio = require('socket.io')(server);
var io = null;
const users = {};
//var redis   = require("redis");
//var client  = redis.createClient();

//client.on('connect', function() {
//    console.log('redis connected');
//});

var socketObj;

server.listen(PORT, "localhost");
//io = sio.listen(server)
console.log('Running on http://localhost:' + PORT);
//console.log('Running on http://ec2-54-171-185-229.eu-west-1.compute.amazonaws.com:' + PORT);
//console.log('Running on http://ec2-54-171-185-229.eu-west-1.compute.amazonaws.com/node');

app.get('/', function (req, res) {
    //req.sessionID //Id do usuário que deve ser usado para transmissão de manssagem privadas
    //req.headers['x-forwarded-for'] //Id do usuário que deve ser usado para transmissão de manssagem privadas, em conjunto com o sessionID
    //res.sendFile(__dirname + '/client.html');

    //debugger

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.render('index', {
      sessionID: req.sessionID,
      ip: ip
    });
    //console.log('sessionID: ' + req.sessionID);
    //console.log('ip: ' + req.headers['x-forwarded-for']);
});

sio.sockets.on('connection', (socket) => {
  socket.on('sendchat', (data) => {
    sio.sockets.emit('updatechat', socket.username, data);
  });

  socket.on('adduser', (sessionID) => {
    socket.username = sessionID;
    var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    
    //client.sadd('sessoes', sessionID);
    //client.hmset(sessionID, 'ip', ip, 'userName', "", 'socketId', socket.id, redis.print);

    users[sessionID] = {"ip": ip, "userName": "", "socketId": socket.id};

    socket.emit(
        'servernotification', {
            connected: true,
            toSelf: true,
            sessionID: sessionID
        }
    );

    console.log('adduser->sessionID: ' + sessionID);
    console.log('adduser->socket.id: ' + socket.id);
    console.log('adduser->connected: ' + sio.sockets.connected[socket.id].connected);
  });

  socket.on('disconnect', () => {
    delete users[socket.username];

    //sio.sockets.emit('updateusers', usernames);

    socket.broadcast.emit('servernotification', { username: socket.username });
  });
});

function addUser(userName, req) {
    if (!sessionValid(userName, req))
        return false;
    
    users[req.sessionID].userName = userName;
    return true;
    
    //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //client.sadd('sessoes', req.sessionID);
    //client.hmset("aaa", 'ip', ip, 'userName', userName);
    //client.hmset(req.sessionID, 'ip', ip, 'userName', userName);
}

function sessionValid(userName, req) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    //if (client.hexists(req.sessionID, 'ip') == 1) {
    if (users[req.sessionID].ip != "") {

        var ip_aux = users[req.sessionID].ip;
        var userName_aux = users[req.sessionID].userName;
        
        if (ip_aux != ip || userName_aux != userName) {      
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

app.post('/consultar', urlencodedParser, function (req, res) {
    if (!sessionValid("", req))
        return false;
    
    // Prepare output in JSON format
    /*
    response = {
        first_name:req.body.first_name,
        last_name:req.body.last_name
    };
    */
    
    //web3_node1.setProvider(new web3_node1.providers.HttpProvider('http://ec2-52-50-42-100.eu-west-1.compute.amazonaws.com:80'));
    web3_node1.setProvider(new web3_node1.providers.HttpProvider('http://localhost:8545'));
    
    var gestao_garantiasABI_o = web3_node1.eth.contract(gestao_garantiasABI);
    var gestao_garantias = gestao_garantiasABI_o.at(gestao_garantiasAddress);

    var total_loops = gestao_garantias.contador_garantia();
    var mensagem = 'Total de registros: ' + total_loops;
    res.send(mensagem + '\n');

    //for (var i=total_loops; i > 0; i--) {

    //socketObj.volatile.emit('notification', mensagem);
    
    var socketId = client.hget(req.sessionID, 'socketId');
    sio.sockets.connected[socketId].emit('notification', mensagem);

    console.log('consultar');
});


app.post('/cadastro', urlencodedParser, function (req, res) {
    if (!sessionValid("", req))
        return false;
    
    //web3_node1.setProvider(new web3_node1.providers.HttpProvider('http://ec2-52-50-42-100.eu-west-1.compute.amazonaws.com:80'));
    web3_node1.setProvider(new web3_node1.providers.HttpProvider('http://localhost:8545'));
    
    var gestao_garantiasABI_o = web3_node1.eth.contract(gestao_garantiasABI);
    var gestao_garantias = gestao_garantiasABI_o.at(gestao_garantiasAddress);

    var total_loops = gestao_garantias.contador_garantia();
    var mensagem = 'Total de registros: ' + total_loops;
    res.send(mensagem + '\n');

    //var socketId = client.hget(req.sessionID, "socketId");
    //console.log('>>>>>>> ' + req.sessionID );
    //console.log('>>>>>>> ' + client.hget(req.sessionID, "socketId") );
    //var ip_aux = client.hget(req.sessionID, 'ip');
    //console.log(ip_aux);
    //sio.sockets.connected[socketId].emit('notification', mensagem);
    sio.sockets.connected[users[req.sessionID].socketId].emit('notification', mensagem);

    //console.log('pagina 2');
});




function parse_cookies(_cookies) {
    var cookies = {};

    _cookies && _cookies.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });

    return cookies;
}











/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////



// creating a new websocket to keep the content updated without any AJAX request
/*
sio.sockets.on('connection', function(socket) {

  console.log(__dirname);

  socketObj = socket;

});
*/

/*
io.use(function () {
  function auth (data, fn) {
    var cookies = parse_cookies(data.headers.cookie);
    console.log('PHPSESSID: ' + cookies.PHPSESSID);

        client.sismember('sid', cookies.PHPSESSID, function (err , reply) {
            fn(null, reply);    
        });
  };

  io.set('authorization', auth);
});

io.sockets.on('connection', function (socket) {
  socket.emit('access', 'granted');
});
*/

// App