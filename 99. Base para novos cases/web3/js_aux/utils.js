//inicio variaveis globais
var em_espera_execucao = function() {};
var arrTransacoes = []; //guarda o transactionHash
var arrEventosRecebidos_funcao = []; //guarda os eventos recebidos
var arrEventosRecebidos_eh_erro = []; //guarda os eventos recebidos
var arrEventosRecebidos_tx = []; //guarda os eventos recebidos
var arrEventosRecebidos_obj_ok = []; //guarda os eventos recebidos
var arrEventosRecebidos_obj_erro = []; //guarda os eventos recebidos
var arrEventosRecebidos_obj_tipo = []; //guarda os eventos recebidos
var exibicao_em_andamento = false;
var arrEventosRecebidos_l = 0;
var block_pend_atualizacao = true;
var blockchain;
var codigo_informado = false;
var gestao_duplicatasABI_o;
var gestao_duplicatas;
var chave_duplicata_verificada = true;
var pesquisa_situacao_value = 9;
//fim variaveis globais

//inicio controle de callback
function tratamento_mensagem_erro(cod_erro) {
	var mensagem = "";

	switch (parseInt(cod_erro)) {
		case -1:
			mensagem = "O CNPJ do emissor &eacute; inv&aacute;lido";
			break;
		case -2:
			mensagem = "O CNPJ/CPF do sacado &eacute; inv&aacute;lido";
			break;
		case -3:
			mensagem = "O valor informado &eacute; inv&aacute;lido";
			break;
		case -4:
			mensagem = "A situação informada &eacute; inv&aacute;lida";
			break;
		case -5:
			mensagem = "A duplicata informada consta como executada";
			break;
		case -6:
			mensagem = "A duplicata informada consta como cancelada";
			break;
		case -7:
			mensagem = "A duplicata informada est&aacute; em utiliza&ccedil;&atilde;o por outra institui&ccedil;&atilde;o";
			break;
		case -8:
			mensagem = "A duplicata informada est&aacute; em utiliza&ccedil;&atilde;o pela sua institui&ccedil;&atilde;o";
			break;
		case -9:
			mensagem = "O c&oacute;digo da opera&ccedil;&atilde;o informado &eacute; inv&aacute;lido";
			break;
		case -10:
			mensagem = "Opera&ccedil;&atilde;o n&atilde;o permitida";
			break;
		case -11:
			mensagem = "Opera&ccedil;&atilde;o n&atilde;o permitida";
			break;
		case -12:
			mensagem = "Opera&ccedil;&atilde;o n&atilde;o permitida";
			break;
		case -13:
			mensagem = "Opera&ccedil;&atilde;o n&atilde;o permitida";
			break;
		case -14:
			mensagem = "Opera&ccedil;&atilde;o n&atilde;o permitida";
			break;
		case -15:
			mensagem = "O código da operação &eacute; inv&aacute;lido";
			break;
		case -16:
			mensagem = "O valor da operação &eacute; inv&aacute;lido";
			break;
		case -17:
			mensagem = "C&oacute;digo da opera&ccedil;&atilde;o duplicado";
			break;
		case -18:
			mensagem = "O CNPJ do emissor informado na altera&ccedil;&atilde;o &eacute; inv&aacute;lido";
			break;
		case -19:
			mensagem = "O CNPJ/CPF do sacado informado na altera&ccedil;&atilde;o &eacute; inv&aacute;lido";
			break;
		case -20:
			mensagem = "O valor informado informado na altera&ccedil;&atilde;o &eacute; inv&aacute;lido";
			break;
		case -21:
			mensagem = "A duplicata consta como executada";
			break;
		case -22:
			mensagem = "A duplicata consta como cancelada";
			break;
		case -23:
			mensagem = "A duplicata est&aacute; em utiliza&ccedil;&atilde;o por outra institui&ccedil;&atilde;o";
			break;
		case -24:
			mensagem = "A duplicata consta como liberada";
			break;
		case -25:
			mensagem = "N&atilde;o &eacute; permitido alterar uma duplicata que n&atilde;o est&aacute; alocada para sua institui&ccedil;&atilde;o";
			break;
		default:
			mensagem = "Erro!";
	}

	return mensagem;
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
			arrTransacoes[i] = arr_aux[0] + "|true|" + arr_aux[2] + "|" + arr_aux[3] + "|" + arr_aux[4] + "|" + arr_aux[5];
			break;
		}
	}
}

function tx_marcar_resposta(tx, sucesso, mensagem_retorno) { //se a blockchain foi alterada ou não
	var arr_aux;
	for (var i = 0; i < arrTransacoes.length; i++) {
		arr_aux = arrTransacoes[i].split("|");
		if (arr_aux[0] == tx) {
			arrTransacoes[i] = arr_aux[0] + "|" + arr_aux[1] + "|" + arr_aux[2] + "|" + sucesso + "|" + mensagem_retorno + "|" + arr_aux[5];
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

function tx_pendente_atualizar_link() {
	$('#tx_pendente').each(function (index) {
		$(this).bind('taphold', function (event) {
		   console.log("TAP HOLD!!");    
		});

		$(this).bind('tap', function () {
		  console.log("TAPPED!!");
		});
	});
}

function atualizar_exibicao_lista_tx() {
	/**** atualização da lista de transações pendentes *******/
	var controle_html = "";
	var situacao = "";
	for (var t = 0; t < arrTransacoes.length; t++) {
		arr_aux = arrTransacoes[t].split("|");

		if (arr_aux[1] == "false") {
			//situacao = '<img src="js_aux/load1.gif" width="20" />';
			situacao = '<span style="font-size:2.5em;">&#9898;<span>';

		} else {
			if (arr_aux[3] == "true") {
				//situacao = '<img src="js_aux/images/green.png" width="20" />';
				situacao = '<span style="color:green; font-size:2.5em;">&#9899;<span>';
			} else {
				//situacao = '<img src="js_aux/images/red.png" width="20" />';
				situacao = '<span style="color:red; font-size:2.5em;">&#9899;<span>';
			}
		}

		controle_html = controle_html + '<div href="#" id="tx_pendente" index_tx="' + t + '" hash_tx="' + arr_aux[0] + '" class="ui-btn ui-corner-all ui-shadow ui-mini" style="width:85%; height:40px; margin:10px auto;"><div style="display:table; width:100%"><div style="display:table-cell; position:relative; width:85%; height:40px; vertical-align:middle;"><div style="width:100%; text-align:left; word-wrap:break-word; white-space:normal;">' + arr_aux[2] +'</div><div style="width:100%; text-align:left; word-wrap:break-word; white-space:normal; font-size:0.7em;">' + arr_aux[5] + '</div></div><div style="display:table-cell; position:relative; width:15%; height:40px; top:0px; text-align:center; vertical-align: middle;">' + situacao + '</div></div></div></div>';
	}
	if (controle_html.length == 0) {
		controle_html = "<p>N&atilde;o foram enviadas transa&ccedil;&otilde;es para minera&ccedil;&atilde;o</p>"
	}
	$("#controle_lista_eventos").html(controle_html);
	/**** atualização da lista de transações pendentes *******/
}

function exibir_mensagem(tipo) {
	atualizar_exibicao_lista_tx();
	
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

			cod_erro = obj_ok.args.cod_erro.toString();

			mensagem = mensagem + "<br> &nbsp;&nbsp; Mensagem: " + tratamento_mensagem_erro(cod_erro);

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

function registrarEvento(funcao, tx, eh_erro, obj_ok, obj_erro, tipo, codigo) {
	arrEventosRecebidos_funcao[arrEventosRecebidos_l] = funcao;
	arrEventosRecebidos_tx[arrEventosRecebidos_l] = tx;
	arrEventosRecebidos_eh_erro[arrEventosRecebidos_l] = eh_erro;
	arrEventosRecebidos_obj_ok[arrEventosRecebidos_l] = obj_ok;
	arrEventosRecebidos_obj_erro[arrEventosRecebidos_l] = obj_erro;
	arrEventosRecebidos_obj_tipo[arrEventosRecebidos_l] = tipo;
	arrEventosRecebidos_l++;

	if (tipo != "alerta") {
		block_pend_atualizacao = true;

		mensagem_resposta = funcao + ": Minerada com sucesso.";

		if (eh_erro) {
			mensagem_resposta = funcao + ": Ocorreu um erro na minera&ccedil;&atilde;o.";
			mensagem_resposta = mensagem_resposta + "<br> &nbsp;&nbsp; Mensagem: " + tratamento_mensagem_erro(codigo);
		}
		tx_marcar_resposta(tx, !eh_erro, mensagem_resposta);
	}
}
//fim controle de callback

//inicio sobra e falta
function listar_sobra_falta(query_filtro, s_ou_f, limite_sobra, limite_falta) {

	atualiza_cache_blockchain();

	var dados_blockchain = blockchain;

	var valor_alocado = 0;
	var html_sobra = ""
	var html_falta = ""
	var html_outros = ""
	for (var g = 0; g < dados_blockchain.length; g++) {
		banco = dados_blockchain[g].banco;

		if (banco == node) {
			codigo_operacao = dados_blockchain[g].operacao;
			valor_atualizado_operacao = parseInt(dados_blockchain[g].valor_atualizado);
			valor_alocado = 0;
			for (var b = 0; b < dados_blockchain[g].duplicatas.length; b++) {
				valor_alocado += parseInt(dados_blockchain[g].duplicatas[b].valor_atualizado) * parseInt(dados_blockchain[g].duplicatas[b].percentual_alocacao) / 100;
			}

			taxa_alocacao = valor_alocado / valor_atualizado_operacao * 100;

			if (s_ou_f == "sobra") {
				if (taxa_alocacao > limite_sobra) {
					html_sobra += "<tr><td class=\"sobra\">" + codigo_operacao + "</td><td class=\"sobra\">" + formata_valor_descida(valor_atualizado_operacao, false) + "</td><td class=\"sobra\">" + formata_valor_descida(valor_alocado, false) + "</td></tr>";
				}
			}

			if (s_ou_f == "falta") {
				if (taxa_alocacao <= limite_falta) {
					html_falta += "<tr><td class=\"falta\">" + codigo_operacao + "</td><td class=\"falta\">" + formata_valor_descida(valor_atualizado_operacao, false) + "</td><td class=\"falta\">" + formata_valor_descida(valor_alocado, false) + "</td></tr>";
				}
			}
		}
	}

	var html_geral = "";

	if (s_ou_f == "sobra") {
		if (html_sobra != "") {
			html_geral += "<br /><table class=\"sobra\">";
			html_geral += "<th>C&oacute;digo Opera&ccedil;&atilde;o</th><th>Valor Atualizado da Opera&ccedil;&atilde;o (R$)</th><th>Valor Alocado (R$)</th>";
			html_geral += html_sobra;
			html_geral += "</table>";
		} else {
			html_geral += "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o h&aacute; opera&ccedil;&otilde;es com sobras.</td></tr></table>"
		}
	}

	if (s_ou_f == "falta") {
		if (html_falta != "") {
			html_geral += "<br /><table class=\"falta\">";
			html_geral += "<th>Codigo Opera&ccedil;&atilde;o</th><th>Valor Atualizado da Opera&ccedil;&atilde;o (R$)</th><th>Valor Alocado (R$)</th>";
			html_geral += html_falta;
			html_geral += "</table>";
		} else {
			html_geral += "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o h&aacute; opera&ccedil;&otilde;es com faltas.</td></tr></table>"
		}
	}

	return html_geral.replace(/[^\x20-\x7E]+/g, '');
}
//fim sobra e falta


//inicio operacao
function inicializar_autocomplete_operacao() {
	var operacoes = [];

	for (o = 0; o < blockchain.operacoes.length; o++){
		operacoes.push({
			index: o,
			value: blockchain.operacoes[o].codigo_op,
			label: blockchain.operacoes[o].codigo_op,
			desc: "R$ " + formata_valor_descida(blockchain.operacoes[o].valor_atualizado)
		});
	}

	$( "#codigo_op" ).autocomplete({
		minLength: 3,
		source: operacoes,
		focus: function( event, ui ) {
			$( "#codigo_op" ).val( ui.item.label );
			$("#codigo_op").blur();
			incluir_duplicata_lista_duplicatas(ui.item.label)
			return false;
		},
		select: function( event, ui ) {
			//$( "#codigo_op" ).val( ui.item.label );
			//$( "#codigo_op-id" ).val( ui.item.value );

			return false;
		}
	}).autocomplete( "instance" )._renderItem = function( ul, item ) {
		return $( "<li>" )
		//.append( "<a>" + item.label + "<br>" + item.desc + "</a>" )
		//.append( '<span style="display:table; width:100%"><span style="display:table-cell; position:relative; width:55%; vertical-align:middle; text-align:left; word-wrap:break-word; white-space:normal; font-size:0.8em;">' + item.label + '</span><span style="display:table-cell; position:relative; width:45%; text-align:center; vertical-align: middle; font-size:0.8em;">' + item.desc + '</span></span>' )
		.append( '<span style="text-align:left; word-wrap:break-word; white-space:normal; font-size:0.8em;">' + item.label + '</span><br /><span style="font-size:0.8em;">' + item.desc + '</span>' )

		.appendTo( ul );
	};
}

function listarOperacoes(quantidade, query_filtro) {
	// se "quantidade" == 0 mostra todos
	// se "quantidade" != 0 mostra os últimos conforme valor informado

	var pesquisa_ativada = false;
	if (query_filtro.trim().length >= 3) {
		pesquisa_ativada = true;
	} else {
		query_filtro = "";
	}

	var total_loops; // = 15;
	total_loops = blockchain.operacoes.length;

	operacoes_html = "<b class=\"title\">Listagem de Operações</b>";
	//operacoes_html = operacoes_html + "colocar filtro<br>";
	//operacoes_html = operacoes_html + "diminuir a letra na tabela";
	operacoes_html = operacoes_html + "<table>";
	operacoes_html = operacoes_html + "<tr><td>C&oacute;digo</td><td><input id=\"codigo_operacao_pesquisa\" size=\"20\" value=\"" + query_filtro + "\" /></td><td><img class=\"icon_aux\" src=\"js_aux/images/lupa.png\" alt=\"\" id=\"btn-pesquisar-operacao\" width=\"20\" height=\"20\" style=\"cursor: hand;\" /></td></tr>";
	operacoes_html = operacoes_html + "</table>";

	if (total_loops < 10) {
		total_limite = 0;
	} else {
		total_limite = total_loops - 10;
	}

	var valor_aux;
	var operacoes_html_conteudo = ""
	for (var i=total_loops; i > 0; i--) {
		var codigo_aux = blockchain.operacoes[i - 1].codigo_op;

		if (pesquisa_ativada) {
			if (codigo_aux.toLowerCase().indexOf(query_filtro.toLowerCase()) >= 0) {
				exibir = true;
			} else {
				exibir = false;
			}
		} else {
			exibir = true;
		}

		if (exibir) {
			//operacoes_html = operacoes_html + ">> " + i + " - codigo: " + codigo_aux + " > valor: " + arr[1] + " > ativo: " + arr[2] + "<br>";
			valor_atualizado_aux = formata_valor_descida(blockchain.operacoes[i - 1].valor_atualizado, false);

			index_operacao = i - 1;
			operacoes_html_conteudo = operacoes_html_conteudo + '<div href="#" id="btn-alterar-operacao" index="' + index_operacao + '" class="ui-btn ui-corner-all ui-icon-carat-r ui-btn-icon-right ui-shadow ui-mini" style="width:85%; margin:10px auto;"><div style="display:inline-block; width:55%; text-align:left;">' + codigo_aux +'</div><div style="display:inline-block; width:5%; text-align:left;">R$</div><div style="display:inline-block; width:39%; padding-right:30px; text-align:right;">' + valor_atualizado_aux + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></div>';
		}

	}


	if (operacoes_html_conteudo != "") {
		operacoes_html = operacoes_html + operacoes_html_conteudo;
	} else if (pesquisa_ativada) {
		operacoes_html = operacoes_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o foram encontradas opera&ccedil;&otilde;es com o c&oacute;digo informado: \"" + query_filtro + "\"</td></tr></table>";
	} else {
		operacoes_html = operacoes_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o h&aacute; opera&ccedil;&otilde;es cadastradas.</td></tr></table>";
	}

	return operacoes_html.replace(/[^\x20-\x7E]+/g, '');
}

function atualizar_links_operacao_pesq(titulo) {
	$("#btn-pesquisar-operacao").click(function() {
		query = $("#codigo_operacao_pesquisa").val().toString().trim();

		if (query.length >= 3) {
			html_lista_operacao = listarOperacoes(0, query);
			$("#consultar_operacao").html(html_lista_operacao);

			atualizar_links_operacao();
			atualizar_links_operacao_pesq();
		} else {
			alert("Preencha o campo de pesquisa com ao menos 3 caracteres.");
		}
	});
}

function atualizar_links_operacao() {
	$( "div#btn-alterar-operacao" ).each(function(index) {
	//$( "img#btn-alterar-operacao" ).each(function(index) {
		$(this).click(function() {
			index_operacao = $(this).attr('index');

			var codigo_aux = blockchain.operacoes[index_operacao].codigo_op;
			valor_aux = formata_valor_descida(blockchain.operacoes[index_operacao].valor, false) ;// + ",00");
			valor_atualizado_aux = formata_valor_descida(blockchain.operacoes[index_operacao].valor_atualizado, true) ;// + ",00");

			$("input#valor_atualizado_operacao_alt").val(valor_atualizado_aux);
			$("span#codigo_operacao_alt").html(codigo_aux);
			$("span#valor_operacao_alt").html(valor_aux);

			$("#controle_lista_eventos").hide();
			$("#sub-menu-operacao").show();
			$("#sub-menu-duplicata").hide();
			$("#master-container").show();
			$("#incluir_operacao").hide();
			$("#alterar_operacao").show();
			$("#consultar_operacao").hide();
			$("#incluir_duplicata").hide();
			$("#alterar_duplicata").hide();
			$("#consultar_duplicata").hide();
		});
	});

}
// fim operacoes

// inicio duplicatas
function incluir_duplicata_lista_duplicatas(codigo_op) {
	var html_aux = listarduplicatas(0, codigo_op, "", 9);
	$("#incluir_duplicata_lista_duplicatas").html(html_aux);
}

function listarduplicatas(quantidade, query_operacao, query_duplicata, query_situacao) {
	// se "quantidade" == 0 mostra todos
	// se "quantidade" != 0 mostra os últimos conforme valor informado

	atualiza_cache_blockchain();
	
	pesquisa_situacao_value = query_situacao;
	
	var situacao_aux = "";
	var pesquisa_ativada_op = false;
	if (query_operacao.trim().length >= 3) {
		pesquisa_ativada_op = true;
	} else {
		query_operacao = "";
	}

	var pesquisa_ativada_duplicata = false;
	if (query_duplicata.trim().length >= 3) {
		pesquisa_ativada_duplicata = true;
	} else {
		query_duplicata = "";
	}
	
	var pesquisa_ativada_duplicata_situacao = false;
	if (query_situacao >= 0 && query_situacao <= 4) {
		pesquisa_ativada_duplicata_situacao = true;
	} else {
		query_situacao = 9;
	}

	var total_loops_op; // = 15;
	var total_loops_duplicata; // = 15;
	total_loops_op = blockchain.operacoes.length;

	var duplicatas_html_conteudo = "";
	var duplicatas_html = "";
	duplicatas_html = "<b class=\"title\">Listagem de duplicatas</b>";
	//duplicatas_html = duplicatas_html + "colocar filtro<br>";
	//duplicatas_html = duplicatas_html + "diminuir a letra na tabela";

	if (!pesquisa_ativada_op) {
		duplicatas_html = duplicatas_html + "<table>";
		duplicatas_html = duplicatas_html + "<tr><td>Chave</td><td><input id=\"codigo_duplicata_pesquisa\" value=\"" + query_duplicata + "\" size=\"20\" /></td><td><img class=\"icon_aux\" src=\"js_aux/images/lupa.png\" alt=\"\" id=\"btn-pesquisar-duplicatas\" width=\"20\" height=\"20\" /></td></tr>";
		duplicatas_html = duplicatas_html + "<tr><td>Situacao</td><td><select id=\"situacao_duplicata_select_pesq\"></select></td><td>&nbsp;</td></tr>";
		duplicatas_html = duplicatas_html + "</table>";
	}

	var exibir_chave = false;
	var exibir_situacao = false;
	for (var o=total_loops_op; o > 0; o--)
	{
		codigo_op_aux = blockchain.operacoes[o-1].codigo_op
		if (pesquisa_ativada_op) {
			if (codigo_op_aux.toLowerCase().indexOf(query_operacao.toLowerCase()) >= 0) {
				exibir = true;
			} else {
				exibir = false;
			}
		} else {
			exibir = true;
		}

		if (exibir) {

			total_loops_duplicata = blockchain.operacoes[o-1].duplicatas.length;

			for (var d=total_loops_duplicata; d > 0; d--)
			{
				chave_duplicata = blockchain.operacoes[o-1].duplicatas[d-1].chave
				if (pesquisa_ativada_duplicata) {
					if (chave_duplicata.toLowerCase().indexOf(query_duplicata.toLowerCase()) >= 0) {
						exibir_chave = true;
					} else {
						exibir_chave = false;
					}
				} else {
					exibir_chave = true;
				}
				
				
				situacao_aux = (blockchain.operacoes[o-1].duplicatas[d-1].situacao);
				if (pesquisa_ativada_duplicata_situacao) {
					if (situacao_aux == query_situacao) {
						exibir_situacao = true;
					} else {
						exibir_situacao = false;
					}
				} else {
					exibir_situacao = true;
				}
				
				
				if (exibir_chave && exibir_situacao) {
					valor_aux = formata_valor_descida(blockchain.operacoes[o-1].duplicatas[d-1].valor, false);// / 100;
					if (situacao_aux == 0) { //branco ou cinza
						situacao_aux = '<span style="color: grey;">';
						situacao_aux += situacao_descricao(blockchain.operacoes[o-1].duplicatas[d-1].situacao)
						situacao_aux += '</span>';
					} else if (situacao_aux == 1) { //verde
						situacao_aux = '<span style="color: green;">';
						situacao_aux += situacao_descricao(blockchain.operacoes[o-1].duplicatas[d-1].situacao)
						situacao_aux += '</span>';
					} else if (situacao_aux == 2) { //azul
						situacao_aux = '<span style="color: blue;">';
						situacao_aux += situacao_descricao(blockchain.operacoes[o-1].duplicatas[d-1].situacao)
						situacao_aux += '</span>';
					} else if (situacao_aux == 3) { //vermelho
						situacao_aux = '<span style="color: red;">';
						situacao_aux += situacao_descricao(blockchain.operacoes[o-1].duplicatas[d-1].situacao)
						situacao_aux += '</span>';
					} else if (situacao_aux == 4) { //laranja
						situacao_aux = '<span style="color: orange;">';
						situacao_aux += situacao_descricao(blockchain.operacoes[o-1].duplicatas[d-1].situacao)
						situacao_aux += '</span>';
					}
					
					//valor_aux = valor_aux.format(2, 3, '.', ',');
					index_duplicata = d - 1;
					index_operacao = o - 1;
					duplicatas_html_conteudo = duplicatas_html_conteudo + '<div href="#" id="btn-alterar-duplicata" index_duplicata="' + index_duplicata + '" index_operacao="' + index_operacao + '" desc_operacao="' + codigo_op_aux + '" class="ui-btn ui-corner-all ui-icon-carat-r ui-btn-icon-right ui-shadow ui-mini" style="width:85%; margin:10px auto; text-align:left;"><table style="margin:0px; width:90%;"><tr><td colspan="2"><div style="width:100%; text-align:left; font-size:0.7em">' + chave_duplicata +'</div></td></tr><tr><td><div style="width:100%; text-align:left; font-size:0.8em;" id="situacao_duplicata_lista_' + index_operacao + '_' + index_duplicata + '">' + situacao_aux + '</div></td><td><div style="width:100%; text-align:right; font-size:0.8em;">R$ ' + valor_aux + '</div></td></tr></table></div>';
				}
			}
		}
	}

	if (duplicatas_html_conteudo != "") {
		//duplicatas_html = duplicatas_html + "<br /><table class=\"lista\">";
		//duplicatas_html = duplicatas_html + "<tr><th width=\"30%\">Tipo</th><th width=\"30%\">C&oacute;digo</th><th width=\"30%\">Valor (R$)</th><th width=\"10%\"></th></tr>";
		duplicatas_html = duplicatas_html + duplicatas_html_conteudo;
		//duplicatas_html = duplicatas_html + "</table>";
	} else if (pesquisa_ativada_duplicata) {
		duplicatas_html = duplicatas_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o foram encontradas duplicatas com a chave informada: \"" + query_duplicata + "\"</td></tr></table>";
	} else if (pesquisa_ativada_op) {
		duplicatas_html = duplicatas_html + "<br /><br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o foram encontradas duplicatas para essa operac&atilde;o</td></tr></table>";
	} else {
		duplicatas_html = duplicatas_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o h&aacute; duplicatas cadastrados.</td></tr></table>";
	}

	return duplicatas_html.replace(/[^\x20-\x7E]+/g, '');
}

function situacao_descricao(situacao_aux) {
	situacao_aux = parseInt(situacao_aux);
	
	if (situacao_aux == 0) {
		return "Liberada";
	} else if (situacao_aux == 1) {
		return "Confirmada";
	} else if (situacao_aux == 2) {
		return "Executada";
	} else if (situacao_aux == 3) {
		return "Cancelada";
	} else if (situacao_aux == 4) {
		return "Em an&aacute;lise";
	}
}

function sub_menu_duplicata_alterar_limpar() {
	$("#cnpj_emissor_alt").val("");
	$("#cnpj_emissor_alt").css('border', 'none');
	$("#cpf_cnpj_sacado_alt").val("");
	$("#cpf_cnpj_sacado_alt").css('border', 'none');
	$("#valor_duplicata_alt").val("");
	$('#situacao_duplicata_select_alt').find('option').remove();
	$("#situacao_duplicata_select_alt").selectmenu("refresh");
}

function atualizar_links_duplicata_pesq() {
	$("#btn-pesquisar-duplicatas").click(function() {
		query = $("#codigo_duplicata_pesquisa").val().toString().trim();

		/*if (query.length >= 3) {*/
			html_lista_duplicatas = listarduplicatas(0, "", query, $("#situacao_duplicata_select_pesq").val());
			$("#consultar_duplicata").html(html_lista_duplicatas);

			atualizar_links_duplicata();
			atualizar_links_duplicata_pesq();
		/*} else {
			alert("Preencha o campo de pesquisa com ao menos 3 caracteres.");
		}
		*/
	});
}

function sub_menu_duplicata_incluir_limpar() {
	$("#codigo_op").val("");
	$("#chave_duplicata").val("");
	$("#chave_duplicata").css('border', 'none');
	$("#cnpj_emissor").val("");
	$("#cnpj_emissor").css('border', 'none');
	$("#cpf_cnpj_sacado").val("");
	$("#cpf_cnpj_sacado").css('border', 'none');
	$("#valor_duplicata").val("");
	//$("#situacao_nova_duplicata")[0].selectedIndex = '0';
	//$("#situacao_nova_duplicata").selectmenu("refresh");
	$("input[type='checkbox']").attr("checked",false).checkboxradio("refresh");
	
	$("#dados_duplicata").collapsible( "collapse" );
	
	$( "#dados_duplicata" ).collapsible( "option", "disabled", true );
	$( "#incluir_duplicata_btn" ).attr('disabled','disabled');
	
	$("#incluir_duplicata_lista_duplicatas").html("");
}

function atualizar_links_duplicata() {
	
	$("#situacao_duplicata_select_pesq").selectmenu();
	
	$('#situacao_duplicata_select_pesq').append($('<option>', {value: 9, text : 'Todas'}));
	$('#situacao_duplicata_select_pesq').append($('<option>', {value: 0, text : 'Liberada'}));
	$('#situacao_duplicata_select_pesq').append($('<option>', {value: 1, text : 'Confirmada'}));
	$('#situacao_duplicata_select_pesq').append($('<option>', {value: 2, text : 'Executada'}));
	$('#situacao_duplicata_select_pesq').append($('<option>', {value: 3, text : 'Cancelada'}));
	$('#situacao_duplicata_select_pesq').append($('<option>', {value: 4, text : 'Em análise'}));
	
	pesquisa_situacao_value = parseInt(pesquisa_situacao_value);
	
	if (pesquisa_situacao_value == 9) {
		$("#situacao_duplicata_select_pesq")[0].selectedIndex = '0';
	} else {
		$("#situacao_duplicata_select_pesq")[0].selectedIndex = (pesquisa_situacao_value + 1).toString();
	}
	
	$('#situacao_duplicata_select_pesq').selectmenu("refresh");
	
	$('#situacao_duplicata_select_pesq').on('change', function (e) {
		situacao_pesq = this.value;
		
		var chave_duplicata = $("#codigo_duplicata_pesquisa").val().toString().trim();
		
		html_lista_duplicata = listarduplicatas(0, "", chave_duplicata, situacao_pesq);
		$("#consultar_duplicata").html(html_lista_duplicata);
		atualizar_links_duplicata();
		atualizar_links_duplicata_pesq();
		
	});
	
	$("#codigo_duplicata_pesquisa").textinput();	
	
	$( "div#btn-alterar-duplicata" ).each(function(index) {
		$(this).on( "swiperight", function() {
				index_duplicata = $(this).attr('index_duplicata');
				index_operacao = $(this).attr('index_operacao');

				chave_aux = blockchain.operacoes[index_operacao].duplicatas[index_duplicata].chave;
				var chave_duplicata_big = new BigNumber(chave_aux, 10);
				
				var dados_duplicata = gestao_duplicatas.consultar_duplicata(chave_duplicata_big);
				var arr_aux_duplicata = dados_duplicata.toString().split(",");

				var situacao = arr_aux_duplicata[4].toString().replace(/[^\x20-\x7E]+/g, '').trim();
				situacao = parseInt(situacao);
				
				if (situacao != 4 || $("#situacao_duplicata_lista_" + index_operacao + "_" + index_duplicata).html().toString().indexOf("em andamento") >=0) {
					alert("Confirma&ccedil;&atilde;o n&atilde;o permitida para essa duplicata");
					return;
				}
				
				//gestao_duplicatas.alterar_situacao_duplicata.sendTransaction(chave_duplicata_big, 1, {
				gestao_duplicatas.alterar_duplicata.sendTransaction(chave_duplicata_big, 0, 0, 0, 1, {
					from: web3.eth.coinbase, gas: config[3].GAS }, function(err, txHash) {
						if (err != null) {
							//alert("Erro: " + err.message);
						} else {
							arrTransacoes.push(txHash + "|false|Altera&ccedil;&atilde;o da Situa&ccedil;&atilde;o da Duplicata|||" + chave_aux);
							alert("Em andamento a minera&ccedil;&atilde;o da nova situa&ccedil;&atilde;o da duplicata");
							$("#situacao_duplicata_lista_" + index_operacao + "_" + index_duplicata).html('<span style="color:gray;">confirma&ccedil;&atilde;o em andamento</span>')
						}
					}
				);
		});
		
		$(this).click(function() {

			$("#situacao_duplicata_select_div_alt").hide();
			$('#situacao_duplicata_select_alt').find('option').remove();
			
			index_duplicata = $(this).attr('index_duplicata');
			index_operacao = $(this).attr('index_operacao');

			chave_aux = blockchain.operacoes[index_operacao].duplicatas[index_duplicata].chave;
			valor_aux = formata_valor_descida(blockchain.operacoes[index_operacao].duplicatas[index_duplicata].valor, true);
			dataCriacao_aux = blockchain.operacoes[index_operacao].duplicatas[index_duplicata].dataCriacao;
			cnpj_emissor_aux = blockchain.operacoes[index_operacao].duplicatas[index_duplicata].cnpj_emissor;
			cpf_cnpj_sacado_aux = blockchain.operacoes[index_operacao].duplicatas[index_duplicata].cpf_cnpj_sacado;
			situacao_aux = blockchain.operacoes[index_operacao].duplicatas[index_duplicata].situacao;
			
			
			$("#codigo_op_alt").html(blockchain.operacoes[index_operacao].codigo_op);
			$("#chave_duplicata_alt").html(chave_aux);
	
			$("#cpf_cnpj_sacado_alt").val(cpf_cnpj_sacado_aux);
			MascaraCPF_CNPJ($('#cpf_cnpj_sacado_alt'));
			$("#cnpj_emissor_alt").val(cnpj_emissor_aux);
			MascaraCPF_CNPJ($('#cnpj_emissor_alt'));
			$("#valor_duplicata_alt").val(valor_aux);
			$("#situacao_duplicata_text_alt").html(situacao_descricao(situacao_aux));
			
			if (situacao_aux == 1) {
				//return "Alocada";
				$("#situacao_duplicata_select_div_alt").show();
				
				$('#situacao_duplicata_select_alt').append($('<option>', {value: 1, text : 'Manter situação atual'}));
				$('#situacao_duplicata_select_alt').append($('<option>', {value: 0, text : 'Liberada'}));
				$('#situacao_duplicata_select_alt').append($('<option>', {value: 2, text : 'Executada'}));
				$('#situacao_duplicata_select_alt').append($('<option>', {value: 3, text : 'Cancelada'}));
				
				$('#situacao_duplicata_select_alt').selectmenu("refresh");
			} else if (situacao_aux == 2) {
				//return "Executado";
			} else if (situacao_aux == 3) {
				//return "Cancelada";
			} else if (situacao_aux == 4) {
				//return "Em análise";
				$("#situacao_duplicata_select_div_alt").show();
				
				$('#situacao_duplicata_select_alt').append($('<option>', {value: 4, text : 'Manter situação atual'}));
				$('#situacao_duplicata_select_alt').append($('<option>', {value: 0, text : 'Liberada'}));
				$('#situacao_duplicata_select_alt').append($('<option>', {value: 1, text : 'Confirmada'}));
				$('#situacao_duplicata_select_alt').append($('<option>', {value: 2, text : 'Executada'}));
				$('#situacao_duplicata_select_alt').append($('<option>', {value: 3, text : 'Cancelada'}));
				$('#situacao_duplicata_select_alt').selectmenu("refresh");
			}
			
			$("#index_duplicata_alt").val(index_duplicata);
			$("#index_operacao_alt").val(index_operacao);
			
			$("#controle_lista_eventos").hide();
			$("#sub-menu-operacao").hide();
			$("#sub-menu-duplicata").show();
			$("#master-container").show();
			$("#incluir_operacao").hide();
			$("#alterar_operacao").hide();
			$("#consultar_operacao").hide();
			$("#incluir_duplicata").hide();
			$("#alterar_duplicata").show();
			$("#consultar_duplicata").hide();

		});
	});
}
//fim duplicatas


//inicio funcoes de inicializacoes
function inicializar_contrato() {
	document.title = config[1].Nodes[numero_instituicao].tituloU + " (" + VERSAO + ")";
	$("#titulo").html(config[1].Nodes[numero_instituicao].titulo);
	
	$( "#dados_duplicata" ).collapsible( "option", "disabled", true );
	$( "#incluir_duplicata_btn" ).attr('disabled','disabled');
	
	setInterval(function () {exibir_mensagem("")}, 2000);
	
	if (!NODES_LOCAL) {
        web3.setProvider(new web3.providers.HttpProvider(config[1].Nodes[numero_instituicao].URL));
    } else {
        web3.setProvider(new web3.providers.HttpProvider(config[3].Nodes_Local[numero_instituicao].URL));
    }
    gestao_duplicatasABI_o = web3.eth.contract(gestao_duplicatasABI);
    gestao_duplicatas = gestao_duplicatasABI_o.at(gestao_duplicatasAddress);

	$('#valor_operacao').number( true, 2 , ',', '.');
	$('#valor_atualizado_operacao_alt').number( true, 2 , ',', '.');
	$('#valor_duplicata').number( true, 2 , ',', '.');
	$('#valor_duplicata_alt').number( true, 2 , ',', '.');
	
	preenchimento_DEBUG();
	
	$('#chave_duplicata').each(function (index) {
		$(this).bind('taphold', function (event) {
			//console.log("TAP HOLD!!");
			var chave_aux = $("#chave_duplicata").val();
			if (chave_aux.trim().length > 0) {
				$( "#popup_chave p" ).html(chave_aux);
				$( "#popup_chave" ).popup( "open", { 
					//x: evt.pageX, 
					//y: evt.pageY,
					//arrow: "t",
					transition: "pop"
				});
			}
		});

		$(this).bind('tap', function () {
		  //console.log("TAPPED!!");
		});
	});

	$("#div-slider-sobra").change(function() {
		var slider_value = $("#slider-range-max-sobra").val();
		$( "span#limite_sobra" ).html( slider_value + "%" );
		var sobra_html = listar_sobra_falta("", "sobra", slider_value, 0);
		$("#controle_sobra_conteudo").html(sobra_html);
	});

	$("#div-slider-falta").change(function() {
		var slider_value = $("#slider-range-max-falta").val();
		$( "span#limite_falta" ).html( slider_value + "%" );
		var falta_html = listar_sobra_falta("", "falta", 0, slider_value);
		$("#controle_falta_conteudo").html(falta_html);
	});

	$('#codigo_duplicata').focusin(function (e) {
		$('#codigo_duplicata').attr('style', 'color: #000;');
		$('#codigo_duplicata').val("");
		codigo_informado = true;
	});

	$( "#menu-controle" ).click(function() {
		$("#controle_sobra_falta").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-operacao").hide();
		$("#sub-menu-duplicata").hide();
		$("#sub-menu-controle").show();
		$("#master-container").hide();
		$("#incluir_operacao").hide();
		$("#alterar_operacao").hide();
		$("#consultar_operacao").hide();
		$("#incluir_duplicata").hide();
		$("#alterar_duplicata").hide();
		$("#consultar_duplicata").hide();
	});

	$( "#menu-transacoes" ).click(function() {
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").show();
		$("#sub-menu-operacao").hide();
		$("#sub-menu-duplicata").hide();
		$("#master-container").show();
		$("#incluir_operacao").hide();
		$("#alterar_operacao").hide();
		$("#consultar_operacao").hide();
		$("#incluir_duplicata").hide();
		$("#alterar_duplicata").hide();
		$("#consultar_duplicata").hide();
	});

	$( "#sub-menu-sobra" ).click(function() {

		sobra_falta_html = listar_sobra_falta("", "sobra", $("#slider-range-max-sobra").val(), 0);
		$("#controle_sobra_conteudo").html(sobra_falta_html);
		//sobra_falta_html_atualizar_links();

		$("#controle_sobra").show();
		$("#controle_falta").hide();
		$("#sub-menu-controle").show();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-operacao").hide();
		$("#sub-menu-duplicata").hide();
		$("#master-container").show();
		$("#incluir_operacao").hide();
		$("#alterar_operacao").hide();
		$("#consultar_operacao").hide();
		$("#incluir_duplicata").hide();
		$("#alterar_duplicata").hide();
		$("#consultar_duplicata").hide();
	});

	$( "#sub-menu-falta" ).click(function() {

		sobra_falta_html = listar_sobra_falta("", "falta", 0, $("#slider-range-max-falta").val());
		$("#controle_falta_conteudo").html(sobra_falta_html);
		//sobra_falta_html_atualizar_links();

		$("#controle_sobra").hide();
		$("#controle_falta").show();
		$("#sub-menu-controle").show();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-operacao").hide();
		$("#sub-menu-duplicata").hide();
		$("#master-container").show();
		$("#incluir_operacao").hide();
		$("#alterar_operacao").hide();
		$("#consultar_operacao").hide();
		$("#incluir_duplicata").hide();
		$("#alterar_duplicata").hide();
		$("#consultar_duplicata").hide();
	});

	$( "#menu-operacao" ).click(function() {
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-operacao").show();
		$("#sub-menu-duplicata").hide();
		$("#master-container").hide();
		$("#incluir_operacao").hide();
		$("#alterar_operacao").hide();
		$("#consultar_operacao").hide();
		$("#incluir_duplicata").hide();
		$("#alterar_duplicata").hide();
		$("#consultar_duplicata").hide();
	});

	$( "#sub-menu-operacao-consultar" ).click(function() {
		$("#consultar_operacao").hide();
		$("#consultar_operacao").html("");

		em_espera_execucao = function() {
			html_lista_operacao = listarOperacoes(0, "");
			$("#consultar_operacao").html(html_lista_operacao);
			atualizar_links_operacao();
			atualizar_links_operacao_pesq();
		};

		if (!block_pend_atualizacao) {
			em_espera_execucao();
			em_espera_execucao = function () {};
		} else {
			atualiza_cache_blockchain();
		}

		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-operacao").show();
		$("#sub-menu-duplicata").hide();
		$("#master-container").show();
		$("#incluir_operacao").hide();
		$("#alterar_operacao").hide();
		$("#consultar_operacao").show();
		$("#incluir_duplicata").hide();
		$("#alterar_duplicata").hide();
		$("#consultar_duplicata").hide();
	});

	$( "#sub-menu-operacao-incluir" ).click(function() {
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-operacao").show();
		$("#sub-menu-duplicata").hide();
		$("#master-container").show();
		$("#incluir_operacao").show();
		$("#alterar_operacao").hide();
		$("#consultar_operacao").hide();
		$("#incluir_duplicata").hide();
		$("#alterar_duplicata").hide();
		$("#consultar_duplicata").hide();
	});

	$( "#incluir_operacao_btn" ).click(function() {
		var codigo_operacao = $("#codigo_operacao").val().toString();
		if (!validacao_simples($("#codigo_operacao"), "O c&oacute;digo informado &eacute; inv&aacute;lido"))
			return;
		
		var valor_operacao = $("#valor_operacao").val().toString();
		if (!validacao_simples($("#valor_operacao"), "O valor informado &eacute; inv&aacute;lido"))
			return;
		
		valor_operacao = formata_valor_subida(valor_operacao);

		$("#codigo_operacao").val("");
		$("#valor_operacao").val("");

		gestao_duplicatas.incluir_operacao.sendTransaction(codigo_operacao.toString(), parseInt(valor_operacao), {
		from: web3.eth.coinbase, gas: config[3].GAS }, function(err, txHash) {
				if (err != null) {
					//alert("Erro: " + err.message);
				} else {
					arrTransacoes.push(txHash + "|false|Inclus&atilde;o de opera&ccedil;&atilde;o|||" + codigo_operacao);
					alert("Em andamento a minera&ccedil;&atilde;o da nova opera&ccedil;&atilde;o");
				}
			}
		);
	});

	$( "#alterar_operacao_btn" ).click(function() {

		var codigo_operacao_alt = $("#codigo_operacao_alt").html().toString();
		//var codigo_operacao = node + " " + $("#codigo_operacao_alt").val().toString();
		var valor_atualizado_operacao_alt = $("#valor_atualizado_operacao_alt").val().toString();

		//if (valor_operacao.indexOf(",") == -1)
		//	valor_operacao = valor_operacao + ",00";

		if (!validacao_simples($("#valor_atualizado_operacao_alt"), "O valor atualizado &eacute; inv&aacute;lido"))
			return;
		
		valor_atualizado_operacao_alt = formata_valor_subida(valor_atualizado_operacao_alt);

		$("#codigo_operacao_alt").html("");
		$("#valor_operacao_alt").html("");
		$("#valor_atualizado_operacao_alt").val("");

		var aux_valor = parseInt(valor_atualizado_operacao_alt)

		//gestao_duplicatas.incluir_operacao.sendTransaction('a', 0, {
		gestao_duplicatas.alterar_operacao.sendTransaction(codigo_operacao_alt, aux_valor, {
		from: web3.eth.coinbase, gas: config[3].GAS }, function(err, txHash) {
				if (err != null) {
					//alert("Erro: " + err.message);
				} else {
					arrTransacoes.push(txHash + "|false|Altera&ccedil;&atilde;o de opera&ccedil;&atilde;o|||" + codigo_operacao_alt.toString());
					alert("Em andamento a minera&ccedil;&atilde;o da altera&ccedil;&atilde;o da opera&ccedil;&atilde;o");
				}
			}
		);
	});

	$( "#menu-duplicata" ).click(function() {
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-operacao").hide();
		$("#sub-menu-duplicata").show();
		$("#master-container").hide();
		$("#incluir_operacao").hide();
		$("#alterar_operacao").hide();
		$("#consultar_operacao").hide();
		$("#incluir_duplicata").hide();
		$("#alterar_duplicata").hide();
		$("#consultar_duplicata").hide();
	});

	$( "#sub-menu-duplicata-consultar" ).click(function() {
		$("#consultar_duplicata").hide();
		$("#consultar_duplicata").html("");

		em_espera_execucao = function() {
			html_lista_duplicata = listarduplicatas(0, "", "", 9);
			$("#consultar_duplicata").html(html_lista_duplicata);
			atualizar_links_duplicata();
			atualizar_links_duplicata_pesq();
		};

		if (!block_pend_atualizacao) {
			em_espera_execucao();
			em_espera_execucao = function () {};
		} else {
			atualiza_cache_blockchain();
		}

		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-operacao").hide();
		$("#sub-menu-duplicata").show();
		$("#master-container").show();
		$("#incluir_operacao").hide();
		$("#alterar_operacao").hide();
		$("#consultar_operacao").hide();
		$("#incluir_duplicata").hide();
		$("#alterar_duplicata").hide();
		$("#consultar_duplicata").show();
	});

	$( "#sub-menu-duplicata-incluir" ).click(function() {
		
		
		em_espera_execucao = function() {
			sub_menu_duplicata_incluir_limpar();
			inicializar_autocomplete_operacao();
			preenchimento_DEBUG();
		};

		if (!block_pend_atualizacao) {
			em_espera_execucao();
			em_espera_execucao = function () {};
		} else {
			atualiza_cache_blockchain();
		}
		
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-operacao").hide();
		$("#sub-menu-duplicata").show();
		$("#master-container").show();
		$("#incluir_operacao").hide();
		$("#alterar_operacao").hide();
		$("#consultar_operacao").hide();
		$("#incluir_duplicata").show();
		$("#alterar_duplicata").hide();
		$("#consultar_duplicata").hide();
	});
	
	$( "#chave_duplicata" ).blur(function() {
		//alert( "Verificando a chave da duplicata" );
		var chave_duplicata = $("#chave_duplicata").val().toString();
		
		if (chave_duplicata.length < 44)
			return;
		
		
		modulo11_result = calculaDigitoMod11(chave_duplicata.substring(0, chave_duplicata.length-1), 1, 44, true);
		
		if (modulo11_result != chave_duplicata.substring(chave_duplicata.length-1, chave_duplicata.length)) {
			$("#chave_duplicata").css('border', '1px solid red');
			$("#chave_duplicata").focus();
		} else {
			$("#chave_duplicata").css('border', 'none');
		}
		
		var chave_duplicata_big = new BigNumber(chave_duplicata, 10);

		dados_duplicata = gestao_duplicatas.consultar_duplicata(chave_duplicata_big);
		
		arr_aux_duplicata = dados_duplicata.toString().split(",");

		var dataCriacao = arr_aux_duplicata[0].replace(/[^\x20-\x7E]+/g, '').trim();
		situacao = parseInt(dataCriacao);
		
		var cnpj_emissor = arr_aux_duplicata[1].toString().replace(/[^\x20-\x7E]+/g, '').trim();
		if (cnpj_emissor == "0") cnpj_emissor = "";
		
		var cpf_cnpj_sacado = arr_aux_duplicata[2].toString().replace(/[^\x20-\x7E]+/g, '').trim();
		if (cpf_cnpj_sacado == "0") cpf_cnpj_sacado = "";
		
		var valor = arr_aux_duplicata[3].toString().replace(/[^\x20-\x7E]+/g, '').trim();
		valor = parseInt(valor);
		
		var situacao = arr_aux_duplicata[4].toString().replace(/[^\x20-\x7E]+/g, '').trim();
		situacao = parseInt(situacao);
		
		var situacao_desc = arr_aux_duplicata[5].toString().replace(/[^\x20-\x7E]+/g, '').trim();
		
		if (situacao == 0) {
            //desc_situacao = "Liberada";
			
			$("#cnpj_emissor").val(cnpj_emissor);
			MascaraCNPJ($('#cnpj_emissor')[0]);
			$("#cpf_cnpj_sacado").val(cpf_cnpj_sacado);
			MascaraCNPJ($('#cpf_cnpj_sacado')[0]);
			$("#valor_duplicata").val(valor);
			$( "#dados_duplicata" ).collapsible( "option", "disabled", false );
			
			$( "#incluir_duplicata_btn" ).removeAttr('disabled');
			
			$("#dados_duplicata").collapsible( "expand" );
			
			preenchimento_DEBUG();

			chave_duplicata_verificada = true;
        } else if (situacao == 1) {
            //desc_situacao = "Alocada";
			alert("A duplicata informada já está alocada");
			$("#chave_duplicata").val("");
			$( "#dados_duplicata" ).collapsible( "option", "disabled", true );
			$( "#incluir_duplicata_btn" ).attr('disabled','disabled');
			return;
        } else if (situacao == 2) {
            //desc_situacao = "Quitada / Executado";
			alert("A duplicata informada foi executada");
			$("#chave_duplicata").val("");
			$( "#dados_duplicata" ).collapsible( "option", "disabled", true );
			$( "#incluir_duplicata_btn" ).attr('disabled','disabled');
			return;
        } else if (situacao == 3) {
            desc_situacao = "Cancelada";
			alert("A duplicata informada foi cancelada");
			$("#chave_duplicata").val("");
			$( "#dados_duplicata" ).collapsible( "option", "disabled", true );
			$( "#incluir_duplicata_btn" ).attr('disabled','disabled');
			return;
        } else if (situacao == 4) {
            desc_situacao = "Em análise";
			alert("A duplicata informada está em análise");
			$("#chave_duplicata").val("");
			$( "#dados_duplicata" ).collapsible( "option", "disabled", true );
			$( "#incluir_duplicata_btn" ).attr('disabled','disabled');
			return;
        } else {
			preenchimento_DEBUG();
		}
		
	});
	
	$( "#chave_duplicata" ).bind('input', function(){
		if ($('#chave_duplicata').val().length == 44) {
			$('#chave_duplicata').blur(); 
		}
	});
	
	$( "#incluir_duplicata_btn" ).click(function() {
		if (!chave_duplicata_verificada) {
			alert("Chave da Duplicata não verificada");
			return
		}
		
		
		var codigo_op = $("#codigo_op").val().toString();
		if (!validacao_simples($("#codigo_op"), "Código informado da operação é inválido"))
			return;
		
		var chave_duplicata = $("#chave_duplicata").val().toString();
		
		var cpf_cnpj_sacado = formata_numero_subida($("#cpf_cnpj_sacado").val().toString());
		if (!validacao_simples($("#cpf_cnpj_sacado"), "CPF/CNPJ informado é inválido"))
			return;
		
		var cnpj_emissor = formata_numero_subida($("#cnpj_emissor").val().toString());
		if (!validacao_simples($("#cnpj_emissor"), "CNPJ do emissor informado é inválido"))
			return;
		
		var valor_duplicata = ($("#valor_duplicata").val().toString());
		if (!validacao_simples($("#valor_duplicata"), "Valor informado é inválido"))
			return;
		
		var situacao_nova_duplicata;
		
		if ($("#situacao_nova_duplicata")[0].checked) {
			situacao_nova_duplicata = 4;
		} else {
			situacao_nova_duplicata = 1;
		}

		var chave_duplicata_big = new BigNumber(chave_duplicata, 10);
		var cnpj_emissor_big = new BigNumber(cnpj_emissor, 10);
		var cpf_cnpj_sacado_big = new BigNumber(cpf_cnpj_sacado, 10);

		valor_duplicata = formata_valor_subida(valor_duplicata);
		//valor_duplicata = valor_duplicata.replace(".","").replace(",","");

		sub_menu_duplicata_incluir_limpar();
		
		preenchimento_DEBUG();
		
		var aux_valor = parseInt(valor_duplicata);

		gestao_duplicatas.incluir_duplicata.sendTransaction(chave_duplicata_big, cnpj_emissor_big, cpf_cnpj_sacado_big, valor_duplicata, situacao_nova_duplicata, codigo_op, {
		from: web3.eth.coinbase, gas: config[3].GAS }, function(err, txHash) {
				if (err != null) {
					//alert("Erro: " + err.message);
				} else {
					arrTransacoes.push(txHash + "|false|Inclus&atilde;o de duplicata|||" + chave_duplicata);
					alert("Em andamento a minera&ccedil;&atilde;o da nova duplicata");
				}
			}
		);
	});

	$( "#alterar_duplicata_btn" ).click(function() {
		var index_duplicata_alt = $("#index_duplicata_alt").val().toString();
		var index_operacao_alt = $("#index_operacao_alt").val().toString();
		
		var cpf_cnpj_sacado_alt = formata_numero_subida($("#cpf_cnpj_sacado_alt").val().toString());
		if (!validacao_simples($("#cpf_cnpj_sacado_alt"), "CPF/CNPJ informado &eacute; inv&aacute;lido"))
			return;
		
		var chave_duplicata = blockchain.operacoes[index_operacao_alt].duplicatas[index_duplicata_alt].chave;
		
		var cnpj_emissor_alt = formata_numero_subida($("#cnpj_emissor_alt").val().toString());
		if (!validacao_simples($("#cnpj_emissor_alt"), "CNPJ do emissor informado &eacute; inv&aacute;lido"))
			return;
		
		var valor_duplicata_alt = ($("#valor_duplicata_alt").val().toString());
		if (!validacao_simples($("#valor_duplicata_alt"), "Valor informado &eacute; inv&aacute;lido"))
			return;
		
		
		var situacao_nova_duplicata = $("#situacao_duplicata_select_alt").val(); //[0].selectedIndex;

		var chave_duplicata_big = new BigNumber(chave_duplicata, 10);
		var cnpj_emissor_big = new BigNumber(cnpj_emissor_alt, 10);
		var cpf_cnpj_sacado_big = new BigNumber(cpf_cnpj_sacado_alt, 10);

		if (valor_duplicata_alt.trim().length == 0) {
			alert("O valor informado &eacute; inv&aacute;lido")
			return;
		}

		valor_duplicata_alt = formata_valor_subida(valor_duplicata_alt);
		valor_duplicata_alt = parseInt(valor_duplicata_alt);

		sub_menu_duplicata_alterar_limpar();

		preenchimento_DEBUG();
		
		gestao_duplicatas.alterar_duplicata.sendTransaction(chave_duplicata_big, cnpj_emissor_big, cpf_cnpj_sacado_big, valor_duplicata_alt, situacao_nova_duplicata, {
		from: web3.eth.coinbase, gas: config[3].GAS }, function(err, txHash) {
				if (err != null) {
					//alert("Erro: " + err.message);
				} else {
					arrTransacoes.push(txHash + "|false|Altera&ccedil;&atilde;o de duplicata|||" + chave_duplicata.toString());
					alert("Em andamento a minera&ccedil;&atilde;o da altera&ccedil;&atilde;o da duplicata");
				}
			}
		);
	});

    //event ret_incluir_duplicata(uint128 chave, uint cnpj_emissor, uint cpf_cnpj_sacado, uint64 valor, uint8 situacao, string codigo_op, uint index_alocacao, int cod_erro, string descricao);
    gestao_duplicatas.ret_incluir_duplicata(function(error, result){
		if (error != null) {
			registrarEvento("Inclus&atilde;o de Duplicata", result.transactionHash, false, result, error, "", 0);
		} else {
			var cod_erro = parseInt(result.args.cod_erro);
			registrarEvento("Inclus&atilde;o de Duplicata", result.transactionHash, ((cod_erro < 0) ? true : false), result, error, "", cod_erro);
		}
	});
    //event ret_alterar_duplicata(uint chave, uint cnpj_emissor, uint cpf_cnpj_sacado, uint64 valor, uint8 situacao, int cod_erro, string descricao);
    gestao_duplicatas.ret_alterar_duplicata(function(error, result){
		if (error != null) {
			registrarEvento("Altera&ccedil;&atilde;o de Duplicata", result.transactionHash, false, result, error, "", 0);
		} else {
			var cod_erro = parseInt(result.args.cod_erro);
			registrarEvento("Altera&ccedil;&atilde;o de Duplicata", result.transactionHash, ((cod_erro < 0) ? true : false), result, error, "", cod_erro);
		}
	});

	//event ret_incluir_operacao(string codigo_op, uint64 valor, int cod_erro, string descricao);
    gestao_duplicatas.ret_incluir_operacao(function(error, result){
		if (error != null) {
			registrarEvento("Inclus&atilde;o de Opera&ccedil;&atilde;o", result.transactionHash, false, result, error, "", 0);
		} else {
			var cod_erro = parseInt(result.args.cod_erro);
			registrarEvento("Inclus&atilde;o de Opera&ccedil;&atilde;o", result.transactionHash, ((cod_erro < 0) ? true : false), result, error, "", cod_erro);
		}
	});

	//event ret_alterar_operacao(string codigo_op, uint64 valor_atualizado, int cod_erro, string descricao);
    gestao_duplicatas.ret_alterar_operacao(function(error, result){
		if (error != null) {
			registrarEvento("Altera&ccedil;&atilde;o de Opera&ccedil;&atilde;o", result.transactionHash, false, result, error, "", 0);
		} else {
			var cod_erro = parseInt(result.args.cod_erro);
			registrarEvento("Altera&ccedil;&atilde;o de Opera&ccedil;&atilde;o", result.transactionHash, ((cod_erro < 0) ? true : false), result, error, "", cod_erro);
		}
	});

	atualiza_cache_blockchain();

	sleep(10);

	//$.mobile.loading( 'hide' );

	$("#page-app").show();
}

function main() {
	for (var b = 0;b < config[1].Nodes.length; b++) {
		$('#instituicoes').append($('<option>', {
			value: b,
			text : config[1].Nodes[b].name
		}));
	}

	$('#instituicoes').on('change', function (e) {
		numero_instituicao = this.value;

		$("#page-select").hide();

		//$.mobile.loading( 'show' );

		setTimeout(inicializar_contrato,1);
		//sleep(10);
	});
}
//fim funcoes de inicializacoes

//inicio outras funcoes
Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

alert = function(txt) {
	registrarEvento(txt, "", "", "", "", "alerta")
	exibir_mensagem("alerta");
}

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
}

function preenchimento_DEBUG() {
	if (!DEBUG)
		return;
	
	$('#cpf_cnpj_sacado').val(config[4].DEBUG.CPF);
	$('#cnpj_emissor').val(config[4].DEBUG.CNPJ);
	
}

function formata_valor_subida(valor) {
	var valor_aux = valor.toString();

	valor_aux = valor_aux.replace(".",",");

	aux_tres_ultimas = valor_aux.substring(valor_aux.length - 3, valor_aux.length);

	if (aux_tres_ultimas.indexOf(",") == -1)
		valor_aux = valor_aux + ",00";

	valor_aux = valor_aux.replace(".","").replace(",","");

	return parseInt(valor_aux);
}

function formata_numero_subida(valor) {
	var valor_aux = valor.toString();

	valor_aux = (valor_aux.replace(/\D/g,''));
	
	return valor_aux;
}

function formata_numero_decida(valor) {
	var valor_aux = valor.toString();
	valor_aux = (valor_aux.replace(/\D/g,''));
	var zeros = ""
	
	if (valor_aux.length < 11) {
		zeros = "00000000000";
		valor_aux = zeros.substring(0, zeros.length - valor_aux.length) + valor_aux
	} else {
		zeros = "00000000000000";
		valor_aux = zeros.substring(0, zeros.length - valor_aux.length) + valor_aux
	}
	
	return valor_aux;
}

function formata_valor_descida(valor, sem_ponto) {
	//valor_aux = parseFloat(arr[1] + ",00");
	//valor_aux = valor_aux / 100;
	var valor_aux = parseInt(valor);
	valor_aux = parseFloat(valor) / 100;
	valor_aux = valor_aux.format(2, 3, '.', ',');

	if (sem_ponto) {
		for (var i = 0; i < 5; i++)
			valor_aux = valor_aux.toString().replace('.','');
		//valor_aux = parseFloat(valor_aux)
	}

	return valor_aux;
}

function validacao_simples(obj, mensagem) {
	var dado = obj.val();
	if (dado.trim().length == 0 || dado.trim() == "0" || dado.trim() == "0,00") {
		$("#chave_duplicata").css('border', '1px solid red');
		alert(mensagem);
		return false;
	}
	$("#chave_duplicata").css('border', 'none');
	return true;
}

function atualiza_cache_blockchain() {
	if (!block_pend_atualizacao)
		return;

	$("body").addClass("loading");
	$.mobile.loading( 'show' );

	setTimeout(atualiza_cache_blockchain_aux,1);
	sleep(10);
}

function atualiza_cache_blockchain_aux() {
	sleep(20);

	if (!block_pend_atualizacao)
		return;

	var arr_operacoes = [];
	var total_loops = gestao_duplicatas.contar_operacoes();
	for (var i=0; i < total_loops; i++) {
		arr_operacoes[i] = gestao_duplicatas.consultar_operacao(i);
	}

	var arr_associacoes = [];
	total_loops = gestao_duplicatas.contar_alocacoes();
	for (var i=0; i < total_loops; i++) {
		arr_associacoes[i] = gestao_duplicatas.consultar_alocacao(i);
	}

	var json_aux = '{';
	json_aux += '"operacoes":[';
	var arr_aux_operacao = [];
	var arr_aux_duplicata = [];

	var virgula_operacao = '';
	var virgula_duplicata = '';

	for (var g=0; g < arr_operacoes.length; g++) {
		virgula_duplicatas = '';
		dados_operacao = arr_operacoes[g];
		arr_aux_operacao = dados_operacao.toString().split(",");

		codigo_op_aux = arr_aux_operacao[0].replace(/[^\x20-\x7E]+/g, '') + "";
		valor_op_aux = arr_aux_operacao[1];
		valor_atualizado_op_aux = arr_aux_operacao[2];

		json_aux += virgula_operacao;
		json_aux += '{';
		json_aux += '"codigo_op":"' + codigo_op_aux + '",';
		json_aux += '"valor":"' + valor_op_aux + '",';
		json_aux += '"valor_atualizado":"' + valor_atualizado_op_aux + '",';

		json_aux += '"duplicatas":[';
		for (var i=0; i < arr_associacoes.length; i++) {

			chave_ass_aux = arr_associacoes[i][0].toString(10);
			codigo_op_ass_aux = arr_associacoes[i][1].replace(/[^\x20-\x7E]+/g, '').trim();
			ativa_ass_aux = arr_associacoes[i][2];

			if (codigo_op_ass_aux == codigo_op_aux && ativa_ass_aux) {
				dados_duplicata = gestao_duplicatas.consultar_duplicata(chave_ass_aux);
				arr_aux_duplicata = dados_duplicata.toString().split(",");

				dataCriacao = arr_aux_duplicata[0].replace(/[^\x20-\x7E]+/g, '').trim();
				cnpj_emissor = formata_numero_decida(arr_aux_duplicata[1].toString().replace(/[^\x20-\x7E]+/g, '').trim());
				cpf_cnpj_sacado = formata_numero_decida(arr_aux_duplicata[2].toString().replace(/[^\x20-\x7E]+/g, '').trim());
				valor = arr_aux_duplicata[3].toString().replace(/[^\x20-\x7E]+/g, '').trim();
				situacao = arr_aux_duplicata[4].toString().replace(/[^\x20-\x7E]+/g, '').trim();
				if (situacao != "0") {
					json_aux += virgula_duplicata;
					json_aux += '{';
					json_aux += '"chave":"' + chave_ass_aux + '",';
					json_aux += '"dataCriacao":"' + dataCriacao + '",';
					json_aux += '"cnpj_emissor":"' + cnpj_emissor + '",';
					json_aux += '"cpf_cnpj_sacado":"' + cpf_cnpj_sacado + '",';
					json_aux += '"valor":"' + valor + '",';
					json_aux += '"situacao":"' + situacao + '"';
					json_aux += '}';
					virgula_duplicata = ',';
				}

			}
		}

		json_aux += ']';
		json_aux += '}';

		virgula_operacao = ',';
		virgula_duplicata = '';
	}
	json_aux += ']';
	json_aux += '}';

	blockchain = JSON.parse(json_aux);
	block_pend_atualizacao = false;

	$("body").removeClass("loading");
	$.mobile.loading( 'hide' );

	em_espera_execucao();
	em_espera_execucao = function () {};
}


//fim outras funcoes



