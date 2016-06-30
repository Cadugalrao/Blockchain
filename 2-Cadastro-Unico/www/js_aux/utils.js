var arrTransacoes = []; //guarda o transactionHash
var arrEventosRecebidos_funcao = []; //guarda os eventos recebidos
var arrEventosRecebidos_eh_erro = []; //guarda os eventos recebidos
var arrEventosRecebidos_tx = []; //guarda os eventos recebidos
var arrEventosRecebidos_obj_ok = []; //guarda os eventos recebidos
var arrEventosRecebidos_obj_erro = []; //guarda os eventos recebidos
var arrEventosRecebidos_obj_tipo = []; //guarda os eventos recebidos
var arrEventosRecebidos_l = 0;
var exibicao_em_andamento = false;


var gestao_garantiasABI_o;
var gestao_garantias;
var eventReturnGarantia;
var eventReturnBem;
var eventReturnAssociacao;
var node;
var block_pend_atualizacao = true;
var blockchain;
var arrPermissoes = [];
	arrPermissoes.length = 255;
var listarPermissoesPrimeiraExec = true;





/************************************************************/
/** Funcoes dos eventos                                    **/
/************************************************************/
alert = function(txt) {
	registrarEvento(txt, "", "", "", "", "alerta")
	exibir_mensagem("alerta");
}

function tx_exibida(tx) {
	var retorno = false;
	var arr_aux;
	for (var i = 0; i < arrTransacoes.length; i++) {
		arr_aux = arrTransacoes[i].split("|");
		if (arr_aux[0] == tx) {
			if (arr_aux[0] == "true")
				retorno = true;
			break;
		}
	}
	return retorno;
}

function tx_tem_exibicao_pendente() {
	var retorno = false;
	var arr_aux;
	for (var i = 0; i < arrTransacoes.length; i++) {
		arr_aux = arrTransacoes[i].split("|");
		if (arr_aux[1] == "false") {
			retorno = true;
			break;
		}
	}
	return retorno;
}

function tx_marcar_como_exibida(tx) {
	var arr_aux;
	for (var i = 0; i < arrTransacoes.length; i++) {
		arr_aux = arrTransacoes[i].split("|");
		if (arr_aux[0] == tx) {
			arrTransacoes[i] = arr_aux[0] + "|true|" + arr_aux[2];
			break;
		}
	}
}

function retornaIdEventoNaoExibido() {
	var arr_aux;
	for (var i = 0; i < arrTransacoes.length; i++) {
		arr_aux = arrTransacoes[i].split("|");
		if (arr_aux[1] == "false") {
			tx = arr_aux[0];
			break;
		}
	}
	return procuraIdEventoPelaTx(tx);
}

function procuraIdEventoPelaTx(tx) {
	var encontrado = false;
	for (var i = 0; i < arrEventosRecebidos_tx.length; i++) {
		if (arrEventosRecebidos_tx[i] == tx) {
			encontrado = true;
			break;
		}
	}

	if (encontrado)
		return i;
	else
		return -1;
}


function exibir_mensagem(tipo) {
	if (exibicao_em_andamento)
		return;

	if (tipo == "alerta") {
		var mensagem_alerta = "";
		var alerta_encontado = false;
		for (var a = arrEventosRecebidos_l; a > 0; a--) {
			if (arrEventosRecebidos_obj_tipo[a - 1] == "alerta") {
				arrEventosRecebidos_obj_tipo[a - 1] = "alerta_exibida";
				funcao = arrEventosRecebidos_funcao[a - 1];
				alerta_encontado = true;
				break;
			}
		}

		if (alerta_encontado) {
			exibicao_em_andamento = true

			mensagem_alerta = mensagem_alerta + funcao;

			$(".mensagem_alerta").html(mensagem_alerta);

			$(".mensagem_alerta").fadeToggle( "slow", function() {
				setTimeout(function() {
					$(".mensagem_alerta").fadeToggle( "slow" );
					exibicao_em_andamento = false;
				}, 3000);
			});

			return;
		}
	}




	var controle_html = "";
	for (var t = 0; t < arrTransacoes.length; t++) {
		arr_aux = arrTransacoes[t].split("|");
		controle_html += t + " - " + arr_aux[2] + " - ";
		if (arr_aux[1] == "false") {
			controle_html += "Pendente";
		} else {
			controle_html += "Processado";
		}
		controle_html += "<br />";
	}
	$("#controle_lista_eventos").html(controle_html);

	if (!tx_tem_exibicao_pendente())
		return;

	aux_id = retornaIdEventoNaoExibido();

	if (aux_id >= 0) {
		exibicao_em_andamento = true;

		funcao = arrEventosRecebidos_funcao[aux_id];
		tx = arrEventosRecebidos_tx[aux_id];
		eh_erro = arrEventosRecebidos_eh_erro[aux_id];
		obj_ok = arrEventosRecebidos_obj_ok[aux_id];
		obj_erro = arrEventosRecebidos_obj_erro[aux_id];
		obj_erro = arrEventosRecebidos_obj_tipo[aux_id];
		var mensagem;
		if (!eh_erro) {
			mensagem = "";
			mensagem = mensagem + funcao + ": Minerada com sucesso.";
			mensagem = mensagem + "<br> &nbsp;&nbsp; id_retorno: " + obj_ok.args.id_retorno;
			$(".mensagem_sucesso").html(mensagem);

			$(".mensagem_sucesso").fadeToggle( "slow", function() {
				tx_marcar_como_exibida(tx);
				setTimeout(function() {
					$(".mensagem_sucesso").fadeToggle( "slow" );
					exibicao_em_andamento = false;
					block_pend_atualizacao = true;
				}, 4000);
			});
		} else {
			mensagem = "";
			mensagem = mensagem + funcao + ": Ocorreu um erro na minera&ccedil;&atilde;o.";
			mensagem = mensagem + "<br> &nbsp;&nbsp; string_com_erro: " + web3_node1.toAscii(obj_ok.args.string_com_erro).replace(/[^\x20-\x7E]+/g, '');


			$(".mensagem_erro").html(mensagem);

			$(".mensagem_erro").fadeToggle( "slow", function() {
				tx_marcar_como_exibida(tx);
				setTimeout(function() {
					$(".mensagem_erro").fadeToggle( "slow" );
					exibicao_em_andamento = false;
				}, 4000);
			});
		}
	}
}

function registrarEvento(funcao, tx, eh_erro, obj_ok, obj_erro, tipo) {
	arrEventosRecebidos_funcao[arrEventosRecebidos_l] = funcao;
	arrEventosRecebidos_tx[arrEventosRecebidos_l] = tx;
	arrEventosRecebidos_eh_erro[arrEventosRecebidos_l] = eh_erro;
	arrEventosRecebidos_obj_ok[arrEventosRecebidos_l] = obj_ok;
	arrEventosRecebidos_obj_erro[arrEventosRecebidos_l] = obj_erro;
	arrEventosRecebidos_obj_tipo[arrEventosRecebidos_l] = tipo;
	arrEventosRecebidos_l++;
	if (tipo != "alerta") {
		block_pend_atualizacao = true;
	}
}


/************************************************************/
/** Funções gerais                                         **/
/************************************************************/
function Left(str, n){
	if (n <= 0)
	    return "";
	else if (n > String(str).length)
	    return str;
	else
	    return String(str).substring(0,n);
}
function Right(str, n){
    if (n <= 0)
       return "";
    else if (n > String(str).length)
       return str;
    else {
       var iLen = String(str).length;
       return String(str).substring(iLen, iLen - n);
    }
}

function atualiza_blockchain() {

	var json_aux = "";

	if (OFFLINE) {
		json_aux = '{';
		json_aux +=	'"Geral":{"nome":"Thomaz Fagundes Netos","dia_nasc":"30","mes_nasc":"03","ano_nasc":"2001", "blocoPublico":false},';
		json_aux +=	'"Documentos":{"RG":"546576878","CPF":"24356756786", "blocoPublico":true},';
		json_aux +=	'"facebook":{"nome": "Rodrigo Plata","email": "rodrigo.s.plata@accenture.com", "blocoPublico":true},';
		json_aux +=	'"bens":[';
		json_aux +=		'{"tipo": "a","codigo": "0900 001010-3","valor": "1000000000", "dadoPublico":true},';
		json_aux +=		'{"tipo": "a","codigo": "0900 001010-3","valor": "1000000000", "dadoPublico":true}';
		json_aux +=	'],';
		json_aux +=	'"permissoes":[';
		json_aux +=		'{"autorizado": "0x292349729872342394898723948798","bloco": "1"},';
		json_aux +=		'{"autorizado": "0x292349729872329292929292929292","bloco": "1"},';
		json_aux +=		'{"autorizado": "0x292349729872342394898723948798","bloco": "2"},';
		json_aux +=		'{"autorizado": "0x292349729872342394898999999999","bloco": "1"}';
		json_aux +=	']';
		json_aux +='}';

		arrPermissoes[1] = true; //informa que tem permissoes cadastradas para o bloco 1
		arrPermissoes[2] = true; //informa que tem permissoes cadastradas para o bloco 2

		blockchain = JSON.parse(json_aux);
		block_pend_atualizacao = false;
	}

	if (!block_pend_atualizacao || OFFLINE)
		return;

	var arr_garantias = [];
	var total_loops = gestao_garantias.contador_garantia();
	for (var i=0; i < total_loops; i++) {
		arr_garantias[i] = gestao_garantias.garantias(i);
	}

	var arr_bens = [];
	total_loops = gestao_garantias.contador_bem();
	for (var i=0; i < total_loops; i++) {
		arr_bens[i] = gestao_garantias.bens(i);
	}

	var arr_associacoes = [];
	total_loops = gestao_garantias.contador_associacao();
	for (var i=0; i < total_loops; i++) {
		arr_associacoes[i] = gestao_garantias.associacoes(i);
	}


	json_aux = '[';
	var arr_aux_garantia = [];
	var arr_aux_associacao = [];
	var arr_aux_bem = [];

	var virgula_garantia = '';
	var virgula_bem = '';

	for (var g=0; g < arr_garantias.length; g++) {
		virgula_bem = '';
		dados_garantia = arr_garantias[g];
		arr_aux_garantia = dados_garantia.toString().split(",");

		codigo_aux = web3_node.toAscii(arr_aux_garantia[0]).replace(/[^\x20-\x7E]+/g, '') + "";
		banco_garantia = codigo_aux.substring(0,3).trim();
		codigo_garantia = codigo_aux.substring(3,1000).trim();

		valor_inicial = arr_aux_garantia[1];
		valor_atualizado = arr_aux_garantia[2];


		json_aux += virgula_garantia;
		json_aux += '{';
		json_aux += '"garantia":"' + codigo_garantia + '",';
		json_aux += '"banco":"' + banco_garantia + '",';
		json_aux += '"valor_inicial":"' + valor_inicial + '",';
		json_aux += '"valor_atualizado":"' + valor_atualizado + '",';

		json_aux += '"bens":[';

			for (var i=0; i < arr_associacoes.length; i++) {
				dados_associacao = arr_associacoes[i];
				arr_aux_associacao = dados_associacao.toString().split(",");

				index_garantia = parseInt(web3_node.toAscii(arr_aux_associacao[0]).substring(1, 300).replace(/[^\x20-\x7E]+/g, '').trim());
				index_bem = parseInt(arr_aux_associacao[1]);
				percentual_alocacao = arr_aux_associacao[2];

				if (index_garantia == g) {
					dados_bem = arr_bens[index_bem];
					arr_aux_bem = dados_bem.toString().split(",");

					codigo_bem = web3_node.toAscii(arr_aux_bem[0]).substring(1, 300).replace(/[^\x20-\x7E]+/g, '').trim();
					tipo = retorna_descricao_tipo(web3_node.toAscii(arr_aux_bem[0]).replace(/[^\x20-\x7E]+/g, '').substring(0, 1));

					valor_inicial = arr_aux_bem[1];
					valor_atualizado = arr_aux_bem[2];

					json_aux += virgula_bem;
					json_aux += '{';
					json_aux += '"bem":"' + codigo_bem + '",';
					json_aux += '"tipo":"' + tipo + '",';
					json_aux += '"valor_inicial":"' + valor_inicial + '",';
					json_aux += '"valor_atualizado":"' + valor_atualizado + '",';
					json_aux += '"percentual_alocacao":"' + percentual_alocacao + '"';
					json_aux += '}';
					virgula_bem = ',';
				}
			}

		json_aux += ']';
		json_aux += '}';

		virgula_garantia = ',';
	}
	json_aux += ']';

	blockchain = JSON.parse(json_aux);
	block_pend_atualizacao = false;

	return;
}

function load( type ) {
	$.mobile.loading( type );
}

function preencheFormularios() {
	var conta_index = 0;
	var autorizado = '';
	$("#cad_Geral input#nome").val(blockchain.Geral.nome);
	$("#cad_Geral input#d_niver").val(blockchain.Geral.ano_nasc +"-"+ blockchain.Geral.mes_nasc +"-"+ blockchain.Geral.dia_nasc);
	if (blockchain.Geral.blocoPublico) {
		$('#switch_garal').prop("selectedIndex", 1);
	} else {
		$('#switch_garal').prop("selectedIndex", 0);
	}
}

function listarPermissoes() {
	var html_permissoes = '';
	if (blockchain.permissoes.length > 0) {

		for (var bloco = 1 ; bloco < arrPermissoes.length; bloco++) {
			if (arrPermissoes[bloco]) { //há permissoes cadastradas para o bloco 1?
				$("div#list_remove_permissoes_" + bloco).remove();
				html_permissoes = '<div id="list_remove_permissoes_"' + bloco + '><table width="100%">';
				for (var p = 0; p < blockchain.permissoes.length; p++) {
					if (parseInt(blockchain.permissoes[p].bloco) == bloco) {
						conta_index = (p + 1);// * Math.random();
						autorizado = blockchain.permissoes[p].autorizado;
						//html_permissoes += '<div class="ui-grid-a">';
						//html_permissoes += 		'<div class="ui-block-a">';
						html_permissoes += 		'<tr><td style="font-size:0.7em;">';
						//html_permissoes += 			'<span id="conta_autorizada">' + autorizado + '</span>';
						html_permissoes += 			autorizado;
						html_permissoes += 		'</td><td>';
						//html_permissoes += 		'</div>';
						//html_permissoes += 		'<div class="ui-block-b">';
						html_permissoes += 			'<select name="switch_conta" id="switch_conta" data-role="flipswitch" data-mini="true"><option value="false">N&atilde;o</option><option selected="selected" value="true">Sim</option></select>';
						html_permissoes += 		'</td></tr>';
						//html_permissoes += 		'</div>';
						//html_permissoes += '</div>';
					}
				}
				html_permissoes += '</table></div>';
				$("#permissao_" + bloco).html(html_permissoes);
			}
		}

		if (listarPermissoesPrimeiraExec) {
			listarPermissoesPrimeiraExec = false;
		} else {
			$('select#switch_conta').each(function (index) {
				$(this).flipswitch({mini:true});
			});
		}
	}
}

/************************************************************/
/** Funções do Bloco Geral                                 **/
/************************************************************/
function cad_alt_geral(nome, dia_nasc, mes_nasc, ano_nasc, eh_publico) {
	//cadu.cadastro_alteracao_bloco1.sendTransaction(nome, parseInt(dia_nasc), parseInt(mes_nasc), parseInt(ano_nasc), {
	//from: web3_node.eth.coinbase }, function(err, txHash) {
	//		if (err != null){
				//alert("Erro: " + err.message);
	//		} else {
	//			arrTransacoes.push(txHash + "|false|cad_alt_geral");
				alert("Em andamento a mineração dos dados do Bloco Geral");
	//		}

	//	}
	//);
}


function main() {

	$("#cadastrar_geral").on("tap",function(){
		var nome = $("div#cad_Geral input#nome").val();
		var data_niver = $("div#cad_Geral input#d_niver").val().toString();
		var arr_niver = data_niver.split("-");
		var dia_nasc = arr_niver[2];
		var mes_nasc = arr_niver[1];
		var ano_nasc = Right(arr_niver[0], 2);

		var publico = $("div#cad_Geral select#switch_garal")[0].selectedIndex;

		cad_alt_geral(nome, dia_nasc, mes_nasc, ano_nasc, publico);
	});


	$("a#btn_meus_dados").each(function(index) {
		$(this).on("tap",function(){
			atualiza_blockchain();
			preencheFormularios();
		});
	});

	$("a#btn_permissoes").each(function(index) {
		$(this).on("tap",function(){
			atualiza_blockchain();
			listarPermissoes();
		});
	});

	$("a#btn_consultas").each(function(index) {
		$(this).on("tap",function(){
			atualiza_blockchain();
		});
	});

	$( "#entrar_conta" ).click(function() {
		load("show");
		conta = $("#conta").val().toString() + "";

		arr_conta = conta.split("|");
		numero_banco = parseInt(arr_conta[0]);
		conta = arr_conta[1];

		document.title = config[1].Nodes[numero_banco].tituloU + " (" + VERSAO + ")";
		$("#titulo").html(config[1].Nodes[numero_banco].titulo);

		web3_node = new Web3();

		if (!NODES_LOCAL) {
			web3_node.setProvider(new web3_node.providers.HttpProvider(config[1].Nodes[numero_banco].URL));
		} else {
			web3_node.setProvider(new web3_node.providers.HttpProvider(config[3].Nodes_Local[numero_banco].URL));
		}
		caduABI_o = web3_node.eth.contract(caduABI);
		cadu = caduABI_o.at(caduAddress);

		atualiza_blockchain()
		preencheFormularios();

		load("hide");

		$.mobile.changePage( "#meus_dados", { transition: "fade", changeHash: false });
	});

	/*
	$("p").on("tap",function() {
	  $(this).hide();
	});
	*/

	$( "#switch_garal" ).bind( "change", function(event, ui) {
		situacao = $( "#switch_garal" )[0].selectedIndex;
		if (situacao == 1) {
			$("#permissao_geral").show();
		} else {
			$("#permissao_geral").hide();
		}
	});

/*

	$("#incluir_associacao_btn").click(function() {
		index_garantia = "a" + $("#index_h_garantia").val().toString();
		index_bem = $("#index_h_bem").val().toString();
		percent_bem = $("#percent_bem").val().toString();

		if (parseInt(percent_bem) <= 0 || parseInt(percent_bem) > 100) {
			alert("Erro: percentual deve estar entre 1% e 100%");
			return;
		}

		unlockAccount();

		gestao_garantias.incluir_associacao.sendTransaction(index_garantia.toString(), parseInt(index_bem), parseInt(percent_bem), {
		from: web3_node.eth.coinbase }, function(err, txHash) {
				if (err != null){
					//alert("Erro: " + err.message);
				} else {
					arrTransacoes.push(txHash + "|false|associacao");
					alert("Em andamento a mineração da nova Alocação de Bem ou Direito");
				}
				lockAccount();
			}
		);

		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-garantia").hide();
		$("#sub-menu-bem").hide();
		$("#master-container").hide();
		$("#incluir_garantia").hide();
		$("#alterar_garantia").hide();
		$("#consultar_garantia").hide();
		$("#incluir_bem").hide();
		$("#alterar_bem").hide();
		$("#consultar_bem").hide();
		$("#associacao_garantia_consultar").hide();
		$("#associacao_bem_consultar").hide();
		$("#associacao_garantia_incluir").hide();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	//event ReturnGarantia(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
	eventReturnGarantia = gestao_garantias.ReturnGarantia(function(error, result){
		if (!DEBUG) {
			//if (tx_tem_exibicao_pendente())
			//{
				if (error != null)
					registrarEvento("garantia", result.transactionHash, true, result, error, "");
				else
					registrarEvento("garantia", result.transactionHash, !result.args.success, result, error, "");
			//}
		} else {
			if (error != null && tx_tem_exibicao_pendente() && DEBUG) {
				alert(error + " - " + result);
			} else {
				if (!tx_exibida(result.transactionHash) && tx_tem_exibicao_pendente()) {
					if (result.args.success) {
						mensagem = "";
						mensagem = mensagem + "Garantia minerada com sucesso.";
						mensagem = mensagem + "\n   id_retorno: " + result.args.id_retorno;
						mensagem = mensagem + "\n   descricao: " + web3_node.toAscii(result.args.descricao).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   codigo_item_acessado: " + result.args.codigo_item_acessado;
						mensagem = mensagem + "\n   codigo: " + web3_node.toAscii(result.args.codigo).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   valor: " + parseInt(result.args.valor) / 100;
						mensagem = mensagem + "\n";
						mensagem = mensagem + "\n   blockHash: " + result.blockHash;
						mensagem = mensagem + "\n   transactionHash: " + result.transactionHash;
					} else {
						mensagem = "";
						mensagem = mensagem + "Erro ao tentar incluir a garantia.";
						mensagem = mensagem + "\n   codigo_erro: " + result.args.codigo_erro;
						mensagem = mensagem + "\n   string_com_erro: " + web3_node.toAscii(result.args.string_com_erro).replace(/[^\x20-\x7E]+/g, '');
					}

					alert(mensagem);
					tx_marcar_como_exibida(result.transactionHash);
				}
			}
		}
	});
	*/
}
