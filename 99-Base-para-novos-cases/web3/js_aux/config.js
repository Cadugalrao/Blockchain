var VERSAO = "0.0.2";

var config = [
	{"URL_Web":"http://collateralblock.duckdns.org/"},
	{"Nodes":[
		{"name": "", "titulo": "", "URL": ""},
		{"name": "Instituição A", "titulo": "Institui&ccedil;&atilde;o A - Gest&atilde;o de Duplicatas", "tituloU": "Instituição A - Gestão de Duplicatas", "URL":"http://ec2-52-50-42-100.eu-west-1.compute.amazonaws.com:80"},
		{"name": "Instituição B", "titulo": "Institui&ccedil;&atilde;o B - Gest&atilde;o de Duplicatas", "tituloU": "Instituição B - Gestão de Duplicatas", "URL":"http://ec2-52-30-248-21.eu-west-1.compute.amazonaws.com:80"},
		{"name": "Instituição C", "titulo": "Institui&ccedil;&atilde;o C - Gest&atilde;o de Duplicatas", "tituloU": "Instituição C - Gestão de Duplicatas", "URL":"http://ec2-54-194-150-243.eu-west-1.compute.amazonaws.com:80"},
		{"name": "Instituição D", "titulo": "Institui&ccedil;&atilde;o D - Gest&atilde;o de Duplicatas", "tituloU": "Instituição D - Gestão de Duplicatas", "URL":"http://ec2-52-50-179-191.eu-west-1.compute.amazonaws.com:80"}
	]},
	{"Nodes_Local":[
		{"name": "", "titulo": "", "URL": ""},
		{"name": "n1", "titulo": "Institui&ccedil;&atilde;o A - Gest&atilde;o de Garantias", "tituloU": "Instituição A - Gestão de Garantias", "URL":"http://localhost:8545"}
	]},
	{"GAS": 3500000},
	{"DEBUG": {
		"CPF": "32506110852",
		"CNPJ": "60872504000123",
		"CHAVE_DUPLICATA": "39483948393948394839394839483939483948394567"
		}
	}
];

var gestao_duplicatasABI;
var gestao_duplicatasAddress;

if (!NODES_LOCAL) { // contrato que está no server
	gestao_duplicatasABI = [{"constant":true,"inputs":[{"name":"_posicao","type":"uint256"}],"name":"consultar_operacao","outputs":[{"name":"","type":"string"},{"name":"","type":"uint64"},{"name":"","type":"uint64"}],"type":"function"},{"constant":true,"inputs":[],"name":"contar_alocacoes","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"compare","outputs":[{"name":"","type":"int256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"equal","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"contar_operacoes","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"},{"name":"_posicao","type":"uint256"}],"name":"consultar_operacao_aux","outputs":[{"name":"","type":"string"},{"name":"","type":"uint64"}],"type":"function"},{"constant":false,"inputs":[{"name":"_haystack","type":"string"},{"name":"_needle","type":"string"}],"name":"indexOf","outputs":[{"name":"","type":"int256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_codigo_op","type":"string"},{"name":"_valor_atualizado","type":"uint64"}],"name":"alterar_operacao","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_chave","type":"uint256"},{"name":"_cnpj_emissor","type":"uint256"},{"name":"_cpf_cnpj_sacado","type":"uint256"},{"name":"_valor","type":"uint64"},{"name":"_situacao","type":"uint8"}],"name":"alterar_duplicata","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_posicao","type":"uint256"}],"name":"consultar_duplicata_liberada","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"contar_duplicatas_liberadas","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"_chave","type":"uint256"}],"name":"consultar_duplicata","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint64"},{"name":"","type":"uint8"},{"name":"","type":"string"},{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_codigo_op","type":"string"},{"name":"_valor","type":"uint64"}],"name":"incluir_operacao","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_posicao","type":"uint256"}],"name":"consultar_alocacao","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_chave","type":"uint256"},{"name":"_cnpj_emissor","type":"uint256"},{"name":"_cpf_cnpj_sacado","type":"uint256"},{"name":"_valor","type":"uint64"},{"name":"_situacao","type":"uint8"},{"name":"_codigo_op","type":"string"}],"name":"incluir_duplicata","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"chave","type":"uint256"},{"indexed":false,"name":"cnpj_emissor","type":"uint256"},{"indexed":false,"name":"cpf_cnpj_sacado","type":"uint256"},{"indexed":false,"name":"valor","type":"uint64"},{"indexed":false,"name":"situacao","type":"uint8"},{"indexed":false,"name":"codigo_op","type":"string"},{"indexed":false,"name":"index_alocacao","type":"uint256"},{"indexed":false,"name":"cod_erro","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_incluir_duplicata","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"chave","type":"uint256"},{"indexed":false,"name":"cnpj_emissor","type":"uint256"},{"indexed":false,"name":"cpf_cnpj_sacado","type":"uint256"},{"indexed":false,"name":"valor","type":"uint64"},{"indexed":false,"name":"situacao","type":"uint8"},{"indexed":false,"name":"cod_erro","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_alterar_duplicata","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"codigo_op","type":"string"},{"indexed":false,"name":"valor","type":"uint64"},{"indexed":false,"name":"cod_erro","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_incluir_operacao","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"codigo_op","type":"string"},{"indexed":false,"name":"valor_atualizado","type":"uint64"},{"indexed":false,"name":"cod_erro","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_alterar_operacao","type":"event"}];
	//gestao_duplicatasAddress = "0x4ee82504954dc1be66ab8f17978353e3be020fc9";
	gestao_duplicatasAddress = "0x6a19f81fe9a0e2f02ccc74292eb93cae11ad8160";
} else {
	//contrato com validação de alocação do bem
	gestao_duplicatasABI = [];
	gestao_duplicatasAddress = "";
}
