var VERSAO = "0.0.1"

var config = [
	{"URL_Web":"http://ec2-54-229-186-219.eu-west-1.compute.amazonaws.com/cadu/"},
	{"Nodes":[
		{"name": "", "titulo": "", "URL": ""},
		{"name": "n1", "titulo": "CadU - Cadastro &Uacute;nico", "tituloU": "CadU - Cadastro Único", "URL":"http://ec2-54-229-20-107.eu-west-1.compute.amazonaws.com:80"},
		{"name": "n2", "titulo": "CadU - Cadastro &Uacute;nico", "tituloU": "CadU - Cadastro Único", "URL":"http://ec2-54-194-204-214.eu-west-1.compute.amazonaws.com:80"},
		{"name": "n3", "titulo": "CadU - Cadastro &Uacute;nico", "tituloU": "CadU - Cadastro Único", "URL":"http://ec2-54-229-123-18.eu-west-1.compute.amazonaws.com:80"},
		{"name": "n4", "titulo": "CadU - Cadastro &Uacute;nico", "tituloU": "CadU - Cadastro Único", "URL":"http://ec2-54-171-94-124.eu-west-1.compute.amazonaws.com:80"}
	]},
	{"Nodes_Local":[
		{"name": "", "titulo": "", "URL": ""},
		{"name": "n1", "titulo": "Banco A - Gest&atilde;o de Garantias", "tituloU": "Banco A - Gestão de Garantias", "URL":"http://localhost:8545"}
	]}
];

var caduABI;
var caduAddress;

if (!NODES_LOCAL) {
	caduABI = [{"constant":false,"inputs":[{"name":"_autorizado","type":"address"},{"name":"_bloco","type":"uint8"}],"name":"bloqueio_bloco","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_autorizado","type":"address"},{"name":"_bloco","type":"uint8"}],"name":"liberacao_bloco","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"permissoes","outputs":[{"name":"pessoa","type":"address"},{"name":"autorizado","type":"address"},{"name":"bloco","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[{"name":"_nome","type":"bytes32"},{"name":"_dia_nasc","type":"uint8"},{"name":"_mes_nasc","type":"uint8"},{"name":"_ano_nasc","type":"uint8"}],"name":"cadastro_alteracao_bloco1","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"contador_permissao","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"_pessoa","type":"address"}],"name":"consulta_gerais","outputs":[{"name":"nome","type":"bytes32"},{"name":"dia_nasc","type":"uint8"},{"name":"mes_nasc","type":"uint8"},{"name":"ano_nasc","type":"uint8"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"descricao","type":"string"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"nome","type":"bytes32"},{"indexed":false,"name":"dia_nasc","type":"uint8"},{"indexed":false,"name":"mes_nasc","type":"uint8"},{"indexed":false,"name":"ano_nascimento","type":"uint8"},{"indexed":false,"name":"mensagem","type":"string"}],"name":"ReturnCadBloco1","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"descricao","type":"string"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"pessoa","type":"address"},{"indexed":false,"name":"bloco","type":"uint8"},{"indexed":false,"name":"qtde_blocos","type":"uint8"},{"indexed":false,"name":"mensagem","type":"string"}],"name":"ReturnPermissao","type":"event"}];
	caduAddress = "0xfc36bdd404054cee0ec49d6176bfd3ea4a610c6b";
} else {
	//contrato com validação de alocação do bem
	caduABI = [{"constant":false,"inputs":[{"name":"_autorizado","type":"address"},{"name":"_bloco","type":"uint8"}],"name":"bloqueio_bloco","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_autorizado","type":"address"},{"name":"_bloco","type":"uint8"}],"name":"liberacao_bloco","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"permissoes","outputs":[{"name":"pessoa","type":"address"},{"name":"autorizado","type":"address"},{"name":"bloco","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[{"name":"_nome","type":"bytes32"},{"name":"_dia_nasc","type":"uint8"},{"name":"_mes_nasc","type":"uint8"},{"name":"_ano_nasc","type":"uint8"}],"name":"cadastro_alteracao_bloco1","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"contador_permissao","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"_pessoa","type":"address"}],"name":"consulta_gerais","outputs":[{"name":"nome","type":"bytes32"},{"name":"dia_nasc","type":"uint8"},{"name":"mes_nasc","type":"uint8"},{"name":"ano_nasc","type":"uint8"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"descricao","type":"string"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"nome","type":"bytes32"},{"indexed":false,"name":"dia_nasc","type":"uint8"},{"indexed":false,"name":"mes_nasc","type":"uint8"},{"indexed":false,"name":"ano_nascimento","type":"uint8"},{"indexed":false,"name":"mensagem","type":"string"}],"name":"ReturnCadBloco1","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"descricao","type":"string"},{"indexed":false,"name":"success","type":"bool"},{"indexed":false,"name":"pessoa","type":"address"},{"indexed":false,"name":"bloco","type":"uint8"},{"indexed":false,"name":"qtde_blocos","type":"uint8"},{"indexed":false,"name":"mensagem","type":"string"}],"name":"ReturnPermissao","type":"event"}];
	caduAddress = "0xca0520024f55084b4f74cfc7f7aa71e887b21596";
}
