//inicio variaveis globais
var em_espera_execucao = function() {};
var arrTransacoes = []; //guarda o transactionHash
var arrEventosRecebidos_funcao = []; //guarda os eventos recebidos
var arrEventosRecebidos_sucesso = []; //guarda os eventos recebidos
var arrEventosRecebidos_tx = []; //guarda os eventos recebidos
var arrEventosRecebidos_codRetorno = []; //guarda os eventos recebidos
var arrEventosRecebidos_obj_tipo = []; //guarda os eventos recebidos
var exibicao_em_andamento = false;
var arrEventosRecebidos_l = 0;
//var block_pend_atualizacao = true;
var blockchain;
var codigo_informado = false;
var cosseguroABI_o;
var cosseguro;
var codigo_apolice_verificada = true;
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
			mensagem = "A apolice informada consta como executada";
			break;
		case -6:
			mensagem = "A apolice informada consta como cancelada";
			break;
		case -7:
			mensagem = "A apolice informada est&aacute; em utiliza&ccedil;&atilde;o por outra institui&ccedil;&atilde;o";
			break;
		case -8:
			mensagem = "A apolice informada est&aacute; em utiliza&ccedil;&atilde;o pela sua institui&ccedil;&atilde;o";
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
			mensagem = "A apolice consta como executada";
			break;
		case -22:
			mensagem = "A apolice consta como cancelada";
			break;
		case -23:
			mensagem = "A apolice est&aacute; em utiliza&ccedil;&atilde;o por outra institui&ccedil;&atilde;o";
			break;
		case -24:
			mensagem = "A apolice consta como liberada";
			break;
		case -25:
			mensagem = "N&atilde;o &eacute; permitido alterar uma apolice que n&atilde;o est&aacute; alocada para sua institui&ccedil;&atilde;o";
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
	var situacao_exibicao;
	for (var t = 0; t < arrTransacoes.length; t++) {
		arr_aux = arrTransacoes[t].split("|");

		if (arr_aux[1] == "false") {
			situacao_exibicao = '<span style="font-size:2.5em;">&#9898;<span>';
		} else {
			if (arr_aux[3] == "true") {
				situacao_exibicao = '<span style="color:green; font-size:2.5em;">&#9899;<span>';
			} else {
				situacao_exibicao = '<span style="color:red; font-size:2.5em;">&#9899;<span>';
			}
		}

		controle_html = controle_html + '<div href="#" id="tx_pendente" index_tx="' + t + '" hash_tx="' + arr_aux[0] + '" class="ui-btn ui-corner-all ui-shadow ui-mini" style="width:85%; height:40px; margin:10px auto;"><div style="display:table; width:100%"><div style="display:table-cell; position:relative; width:85%; height:40px; vertical-align:middle;"><div style="width:100%; text-align:left; word-wrap:break-word; white-space:normal;">' + arr_aux[2] +'</div><div style="width:100%; text-align:left; word-wrap:break-word; white-space:normal; font-size:0.7em;">' + arr_aux[5] + '</div></div><div style="display:table-cell; position:relative; width:15%; height:40px; top:0px; text-align:center; vertical-align: middle;">' + situacao_exibicao + '</div></div></div></div>';
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
		sucesso = arrEventosRecebidos_sucesso[aux_id];
		codRetorno = arrEventosRecebidos_codRetorno[aux_id];
		var mensagem;
		if (sucesso) {
			mensagem = "";
			mensagem = mensagem + funcao + ": Minerada com sucesso.";

			$(".mensagem_sucesso").html(mensagem);

			$(".mensagem_sucesso").fadeToggle( "slow", function() {
				tx_marcar_como_exibida(tx);
				setTimeout(function() {
					$(".mensagem_sucesso").fadeToggle( "slow" );
					exibicao_em_andamento = false;
					//block_pend_atualizacao = true;
				}, 4000);
			});
		} else {
			mensagem = "";
			mensagem = mensagem + funcao + ": Ocorreu um erro na minera&ccedil;&atilde;o.";

			mensagem = mensagem + "<br> &nbsp;&nbsp; Mensagem: " + tratamento_mensagem_erro(codRetorno);

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

function registrarEvento(funcao, tx, sucesso, tipo, codRetorno) {
	arrEventosRecebidos_funcao[arrEventosRecebidos_l] = funcao;
	arrEventosRecebidos_tx[arrEventosRecebidos_l] = tx;
	arrEventosRecebidos_sucesso[arrEventosRecebidos_l] = sucesso;
	arrEventosRecebidos_codRetorno[arrEventosRecebidos_l] = codRetorno;
	arrEventosRecebidos_obj_tipo[arrEventosRecebidos_l] = tipo;
	arrEventosRecebidos_l++;

	if (tipo != "alerta") {
		//block_pend_atualizacao = true;

		mensagem_resposta = funcao + ": Minerada com sucesso.";

		if (!sucesso) {
			mensagem_resposta = funcao + ": Ocorreu um erro na minera&ccedil;&atilde;o.";
			mensagem_resposta = mensagem_resposta + "<br> &nbsp;&nbsp; Mensagem: " + tratamento_mensagem_erro(codRetorno);
		}
		tx_marcar_resposta(tx, sucesso, mensagem_resposta);
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
			codigo_acordo = dados_blockchain[g].acordo;
			valor_atualizado_acordo = parseInt(dados_blockchain[g].valor_atualizado);
			valor_alocado = 0;
			for (var b = 0; b < dados_blockchain[g].apolices.length; b++) {
				valor_alocado += parseInt(dados_blockchain[g].apolices[b].valor_atualizado) * parseInt(dados_blockchain[g].apolices[b].percentual_alocacao) / 100;
			}

			taxa_alocacao = valor_alocado / valor_atualizado_acordo * 100;

			if (s_ou_f == "sobra") {
				if (taxa_alocacao > limite_sobra) {
					html_sobra += "<tr><td class=\"sobra\">" + codigo_acordo + "</td><td class=\"sobra\">" + formata_valor_descida(valor_atualizado_acordo, false) + "</td><td class=\"sobra\">" + formata_valor_descida(valor_alocado, false) + "</td></tr>";
				}
			}

			if (s_ou_f == "falta") {
				if (taxa_alocacao <= limite_falta) {
					html_falta += "<tr><td class=\"falta\">" + codigo_acordo + "</td><td class=\"falta\">" + formata_valor_descida(valor_atualizado_acordo, false) + "</td><td class=\"falta\">" + formata_valor_descida(valor_alocado, false) + "</td></tr>";
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
			html_geral += "<th>Código Opera&ccedil;&atilde;o</th><th>Valor Atualizado da Opera&ccedil;&atilde;o (R$)</th><th>Valor Alocado (R$)</th>";
			html_geral += html_falta;
			html_geral += "</table>";
		} else {
			html_geral += "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o h&aacute; opera&ccedil;&otilde;es com faltas.</td></tr></table>"
		}
	}

	return html_geral.replace(/[^\x20-\x7E]+/g, '');
}
//fim sobra e falta


//inicio acordo
function inicializar_autocomplete_acordo() {
	var acordos = [];

	for (o = 0; o < blockchain.acordos.length; o++){
		acordos.push({
			index: o,
			value: blockchain.acordos[o].codigo_apolice,
			label: blockchain.acordos[o].codigo_apolice,
			desc: "R$ " + formata_valor_descida(blockchain.acordos[o].valor_atualizado)
		});
	}
}

function listarAcordos(quantidade, query_filtro) {
	// se "quantidade" == 0 mostra todos
	// se "quantidade" != 0 mostra os últimos conforme valor informado

	var pesquisa_ativada = false;
	if (query_filtro.trim().length >= 3) {
		pesquisa_ativada = true;
	} else {
		query_filtro = "";
	}

	var total_loops; // = 15;
	total_loops = blockchain.acordos.length;

	acordos_html = "<b class=\"title\">Listagem de Acordos para aprovação</b>";
	//acordos_html = acordos_html + "colocar filtro<br>";
	//acordos_html = acordos_html + "diminuir a letra na tabela";
	acordos_html = acordos_html + "<table>";
	acordos_html = acordos_html + "<tr><td>Código da Apólice</td><td><input id=\"codigo_apolice_pesquisa\" size=\"20\" value=\"" + query_filtro + "\" /></td><td><img class=\"icon_aux\" src=\"public/images/lupa.png\" alt=\"\" id=\"btn-pesquisar-acordo\" width=\"20\" height=\"20\" style=\"cursor: hand;\" /></td></tr>";
	acordos_html = acordos_html + "</table>";

	if (total_loops < 10) {
		total_limite = 0;
	} else {
		total_limite = total_loops - 10;
	}

	var valor_aux;
	var acordos_html_conteudo = "";
	var codigo_apolice_aux;
	for (var i=total_loops; i > 0; i--) {
		codigo_apolice_aux = blockchain.acordos[i - 1].codigo_apolice;

		if (pesquisa_ativada) {
			if (codigo_apolice_aux.toLowerCase().indexOf(query_filtro.toLowerCase()) >= 0) {
				exibir = true;
			} else {
				exibir = false;
			}
		} else {
			exibir = true;
		}

		acordo_autorizado = blockchain.acordos[i - 1].autorizado;
		if (exibir && !acordo_autorizado) {
			valor_cobertura_aux = formata_valor_descida(blockchain.acordos[i - 1].valor_cobertura, false);

			index_acordo = i - 1;
			acordos_html_conteudo = acordos_html_conteudo + '<div href="#" id="btn-autorizacao-acordo" index="' + index_acordo + '" class="ui-btn ui-corner-all ui-icon-carat-r ui-btn-icon-right ui-shadow ui-mini" style="width:85%; margin:10px auto;"><div style="display:inline-block; width:55%; text-align:left;">' + codigo_apolice_aux +'</div><div style="display:inline-block; width:5%; text-align:left;">R$</div><div style="display:inline-block; width:39%; padding-right:30px; text-align:right;">' + valor_cobertura_aux + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></div>';
		}

	}


	if (acordos_html_conteudo != "") {
		acordos_html = acordos_html + acordos_html_conteudo;
	} else if (pesquisa_ativada) {
		acordos_html = acordos_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o foram encontrados apólices pendentes de autorização com o c&oacute;digo informado: \"" + query_filtro + "\"</td></tr></table>";
	} else {
		acordos_html = acordos_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o h&aacute; apólices pendentes de aprovação.</td></tr></table>";
	}

	return acordos_html.replace(/[^\x20-\x7E]+/g, '');
}

function atualizar_links_acordo_pesq(titulo) {
	$("#btn-pesquisar-acordo").click(function() {
		query = $("#codigo_acordo_pesquisa").val().toString().trim();

		if (query.length >= 3) {
			html_lista_acordo = listarAcordos(0, query);
			$("#consultar_acordo").html(html_lista_acordo);

			atualizar_links_acordo();
			atualizar_links_acordo_pesq();
		} else {
			alert("Preencha o campo de pesquisa com ao menos 3 caracteres.");
		}
	});
}

function atualizar_links_acordo() {
	$( "div#btn-autorizacao-acordo" ).each(function(index) {
	//$( "img#btn-alterar-acordo" ).each(function(index) {
		$(this).click(function() {
			index_acordo = parseInt($(this).attr('index'));

			//var codigo_acordo_aux = blockchain.acordos[index_acordo].codigo_acordo;
			autorizacao_apolice_codigo = blockchain.acordos[index_acordo].codigo_apolice;
			autorizacao_apolice_valor_premio = formata_valor_descida(blockchain.acordos[index_acordo].valor_premio, false);
			autorizacao_apolice_valor_cobertura = formata_valor_descida(blockchain.acordos[index_acordo].valor_cobertura, false);
			autorizacao_apolice_dt_vencimento = blockchain.acordos[index_acordo].dt_vencimento;
			autorizacao_apolice_numero_aditivo = blockchain.acordos[index_acordo].numero_aditivo;
			autorizacao_apolice_tipo = blockchain.acordos[index_acordo].tipo;
			autorizacao_apolice_persent_comisao = blockchain.acordos[index_acordo].percent_comissao;
			autorizacao_apolice_persent_desconto = blockchain.acordos[index_acordo].percent_desconto;
			autorizacao_apolice_seg1 = blockchain.acordos[index_acordo].addr_seguradora;
			autorizacao_apolice_seg1_percent = blockchain.acordos[index_acordo].percent;
			index_apolice = blockchain.acordos[index_acordo].index_apolice;

			$("#index_apolice").val(index_apolice);
			$("#autorizacao_apolice_codigo").html(autorizacao_apolice_codigo);
			$("#autorizacao_apolice_valor_premio").html(autorizacao_apolice_valor_premio);
			$("#autorizacao_apolice_valor_cobertura").html(autorizacao_apolice_valor_cobertura);
			$("#autorizacao_apolice_dt_vencimento").html(autorizacao_apolice_dt_vencimento);
			$("#autorizacao_apolice_numero_aditivo").html(autorizacao_apolice_numero_aditivo);
			$("#autorizacao_apolice_tipo").html(autorizacao_apolice_tipo);
			$("#autorizacao_apolice_persent_comisao").html(autorizacao_apolice_persent_comisao);
			$("#autorizacao_apolice_persent_desconto").html(autorizacao_apolice_persent_desconto);
			$("#autorizacao_apolice_seg1").html(autorizacao_apolice_seg1);
			$("#autorizacao_apolice_seg1_percent").html(autorizacao_apolice_seg1_percent);

			$("#controle_lista_eventos").hide();
			$("#sub-menu-grupo-acordo").show();
			$("#sub-menu-grupo-apolice").hide();
			$("#master-container").show();
			$("#incluir_acordo").hide();
			$("#autorizacao_acordo").show();
			$("#consultar_acordo").hide();
			$("#incluir_apolice").hide();
			$("#alterar_apolice").hide();
			$("#consultar_apolice").hide();
			$("#detalhar_apolice").hide();
		});
	});
}
// fim acordos

// inicio apolices
/*
function incluir_apolice_lista_apolices(codigo_apolice) {
	var html_aux = listarapolices(0, codigo_apolice, false);
	//$("#inncluir_apolice_lista_apolices").html(html_aux);
}
*/

function listarapolices(quantidade, query_apolice, retornar_index) {
	// se "quantidade" == 0 mostra todos
	// se "quantidade" != 0 mostra os últimos conforme valor informado

	atualiza_cache_blockchain();
	
	var pesquisa_ativada_apolice = false;
	if (query_apolice.trim().length >= 3) {
		pesquisa_ativada_apolice = true;
	} else {
		query_apolice = "";
	}
	
	var total_loops_acordo; // = 15;
	var total_loops_apolice; // = 15;
	total_loops_apolice = blockchain.apolices.length;

	var apolices_html_conteudo = "";
	var apolices_html = "";
	apolices_html = "<b class=\"title\">Listagem de apolices</b>";
	//apolices_html = apolices_html + "colocar filtro<br>";
	//apolices_html = apolices_html + "diminuir a letra na tabela";

	//if (!pesquisa_ativada_apolice) {
		apolices_html = apolices_html + "<table>";
		apolices_html = apolices_html + "<tr><td>Código</td><td><input id=\"codigo_apolice_pesquisa\" value=\"" + query_apolice + "\" size=\"20\" /></td><td><img class=\"icon_aux\" src=\"public/images/lupa.png\" alt=\"\" id=\"btn-pesquisar-apolices\" width=\"20\" height=\"20\" /></td></tr>";
		apolices_html = apolices_html + "</table>";
	//}

	for (var iApolices=total_loops_apolice; iApolices > 0; iApolices--)
	{
		index_apolice = blockchain.apolices[iApolices-1].index_apolice;
		codigo_apolice = blockchain.apolices[iApolices-1].codigo_apolice;
		valor_premio = blockchain.apolices[iApolices-1].valor_premio;
		valor_cobertura = blockchain.apolices[iApolices-1].valor_cobertura;
		dt_vencimento = blockchain.apolices[iApolices-1].dt_vencimento;

		if (pesquisa_ativada_apolice) {
			if (codigo_apolice.toLowerCase().indexOf(query_apolice.toLowerCase()) >= 0) {
				exibir = true;
				if (retornar_index && codigo_apolice.toLowerCase() == query_apolice.toLowerCase()) {
					return iApolices-1;
				}
			} else {
				exibir = false;
			}
		} else {
			exibir = true;
		}

		if (exibir) {
			//total_loops_acordo = blockchain.apolices[iApolices-1].acordos.length;

			//for (var iAcordos=total_loops_acordo; iAcordos > 0; iAcordos--) {
				//addr_seguradora = blockchain.apolices[iApolices-1].acordos[iAcordos-1].addr_seguradora; 
				//percent = blockchain.apolices[iApolices-1].acordos[iAcordos-1].percent; 
				//autorizado = blockchain.apolices[iApolices-1].acordos[iAcordos-1].autorizado; 
				
				index_apolice = iApolices - 1;
				//index_acordo = iAcordos - 1;
				apolices_html_conteudo = apolices_html_conteudo + '<div href="#" id="btn-detalhar-apolice" index_apolice="' + index_apolice + '" index_acordo=" + index_acordo + " desc_acordo="' + codigo_apolice + '" class="ui-btn ui-corner-all ui-icon-carat-r ui-btn-icon-right ui-shadow ui-mini" style="width:85%; margin:10px auto; text-align:left;"><table style="margin:0px; width:90%;"><tr><td colspan="2"><div style="width:100%; text-align:left; font-size:0.7em">' + codigo_apolice +'</div></td></tr><tr><td><div style="width:100%; text-align:left; font-size:0.8em;" id="situacao_apolice_lista_' + index_apolice + '_ + index_acordo + ">Cobertura: R$' + formata_valor_descida(valor_cobertura, false) + '</div></td><td><div style="width:100%; text-align:right; font-size:0.8em;">Data Venc.: ' + dt_vencimento + '</div></td></tr></table></div>';
			//}
		}
	}

	if (apolices_html_conteudo != "") {
		//apolices_html = apolices_html + "<br /><table class=\"lista\">";
		//apolices_html = apolices_html + "<tr><th width=\"30%\">Tipo</th><th width=\"30%\">C&oacute;digo</th><th width=\"30%\">Valor (R$)</th><th width=\"10%\"></th></tr>";
		apolices_html = apolices_html + apolices_html_conteudo;
		//apolices_html = apolices_html + "</table>";
	} else if (pesquisa_ativada_apolice) {
		apolices_html = apolices_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o foram encontradas apolices com o código informado: \"" + query_apolice + "\"</td></tr></table>";
	} else {
		apolices_html = apolices_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o h&aacute; apolices cadastradas.</td></tr></table>";
	}

	if (retornar_index) {
		return -1;
	} else {
		return apolices_html.replace(/[^\x20-\x7E]+/g, '');
	}
}

function sub_menu_apolice_alterar_limpar() {
	$("#cnpj_emissor_alt").val("");
	$("#cnpj_emissor_alt").css('border', 'none');
	$("#cpf_cnpj_sacado_alt").val("");
	$("#cpf_cnpj_sacado_alt").css('border', 'none');
	$("#valor_apolice_alt").val("");
}

function atualizar_links_apolice_pesq() {
	$("#btn-pesquisar-apolices").click(function() {
		query_codigo_apolice = $("#codigo_apolice_pesquisa").val().toString().trim();

		/*if (query_codigo_apolice.length >= 3) {*/
			html_lista_apolices = listarapolices(0, query_codigo_apolice, false);
			$("#consultar_apolice").html(html_lista_apolices);

			atualizar_links_apolice();
			atualizar_links_apolice_pesq();
		/*} else {
			alert("Preencha o campo de pesquisa com ao menos 3 caracteres.");
		}
		*/
	});
}

function sub_menu_apolice_incluir_limpar() {
	$("#cad_apolice_codigo").val("");
	$("#cad_apolice_codigo").css('border', 'none');
	$("#cad_apolice_valor_premio").val("");
	$("#cad_apolice_valor_premio").css('border', 'none');
	$("#cad_apolice_valor_cobertura").val("");
	$("#cad_apolice_valor_cobertura").css('border', 'none');
	$("#cad_apolice_dt_vencimento").date({
		setDate: null, 
		altFormat: "dd/mm/yy",
		minDate: new Date()
	});
	$("#cad_apolice_dt_vencimento").css('border', 'none');

	$( "#cad_apolice_dt_vencimento" ).date("refresh");

	$("#controle_sobra").hide();
	$("#controle_falta").hide();
	$("#sub-menu-grupo-controle").hide();
	$("#controle_lista_eventos").hide();
	$("#sub-menu-grupo-acordo").hide();
	$("#sub-menu-grupo-apolice").show();
	$("#master-container").hide();
	$("#incluir_acordo").hide();
	$("#autorizacao_acordo").hide();
	$("#consultar_acordo").hide();
	$("#incluir_apolice").hide();
	$("#alterar_apolice").hide();
	$("#consultar_apolice").hide();
	$("#detalhar_apolice").hide();
}

function sub_menu_apolice_incluir_acordo_limpar() {
	$("#cad_acordo_address_seguradora_aceito").val("");
	$("#cad_acordo_address_seguradora_aceito").css('border', 'none');
	$("#cad_acordo_percentual").val("");
	$("#cad_acordo_percentual").css('border', 'none');

	$("#controle_sobra").hide();
	$("#controle_falta").hide();
	$("#sub-menu-grupo-controle").hide();
	$("#controle_lista_eventos").hide();
	$("#sub-menu-grupo-acordo").hide();
	$("#sub-menu-grupo-apolice").show();
	$("#master-container").hide();
	$("#incluir_acordo").hide();
	$("#autorizacao_acordo").hide();
	$("#consultar_acordo").hide();
	$("#incluir_apolice").hide();
	$("#alterar_apolice").hide();
	$("#consultar_apolice").hide();
	$("#detalhar_apolice").hide();
}

function atualizar_links_apolice() {
	
	$("#codigo_apolice_pesquisa").textinput();
	
	$( "div#btn-detalhar-apolice" ).each(function(index) {
		$(this).on( "swiperight", function() {
				index_apolice = $(this).attr('index_apolice');

				var codigo_apolice = blockchain.apolices[index_apolice].codigo_apolice;
				var valor_premio = blockchain.apolices[index_apolice].valor_premio;
				var valor_cobertura = blockchain.apolices[index_apolice].valor_cobertura;
				var dt_vencimento = blockchain.apolices[index_apolice].dt_vencimento;
				
				var addr_seguradora = "";
				var percent = "";
				var autorizado = "";

				var total_loops_acordo = blockchain.apolices[index_apolice].acordos.length;

				for (var iAcordos=total_loops_acordo; iAcordos > 0; iAcordos--) {
					addr_seguradora = blockchain.apolices[index_apolice].acordos[iAcordos-1].addr_seguradora;
					percent = blockchain.apolices[index_apolice].acordos[iAcordos-1].percent;
					autorizado = blockchain.apolices[index_apolice].acordos[iAcordos-1].autorizado;
				}
		});
		
		$(this).click(function() {

			index_apolice = $(this).attr('index_apolice');
			
			var codigo_apolice = blockchain.apolices[index_apolice].codigo_apolice;
			var valor_premio = blockchain.apolices[index_apolice].valor_premio;
			var valor_cobertura = blockchain.apolices[index_apolice].valor_cobertura;
			var dt_vencimento = blockchain.apolices[index_apolice].dt_vencimento;

			$("#det_apolice_codigo").html(codigo_apolice);
			$("#det_apolice_valor_premio").html("R$ " + formata_valor_descida(valor_premio, false));
			$("#det_apolice_valor_cobertura").html("R$ " + formata_valor_descida(valor_cobertura));
			$("#det_apolice_dt_vencimento").html(dt_vencimento);
			
			var addr_seguradora = "";
			var percent = "";
			var autorizado = "";

			var total_loops_acordo = blockchain.apolices[index_apolice].seguradoras.length;

			var acordo_html_conteudo = "";
			for (var iAcordos=total_loops_acordo; iAcordos > 0; iAcordos--) {
				addr_seguradora = blockchain.apolices[index_apolice].acordos[iAcordos-1].addr_seguradora;
				percent = blockchain.apolices[index_apolice].acordos[iAcordos-1].percent;
				autorizado = blockchain.apolices[index_apolice].acordos[iAcordos-1].autorizado;
				if (autorizado) {
					autorizado_situacao = "Autorizado"
				} else {
					autorizado_situacao = "Não autorizado"
				}
				acordo_html_conteudo = acordo_html_conteudo + '<div index_acordo="' + iAcordos + '" class="ui-btn ui-corner-all ui-icon-carat-r ui-shadow ui-mini" style="width:85%; margin:10px auto; text-align:left;"><table style="margin:0px; width:90%;"><tr><td colspan="2"><div style="width:100%; text-align:left; font-size:0.7em">' + addr_seguradora +'</div></td></tr><tr><td><div style="width:100%; text-align:left; font-size:0.8em;">Cossegurado com: ' + percent + '%</div></td><td><div style="width:100%; text-align:right; font-size:0.8em;">Situação: ' + autorizado_situacao + '</div></td></tr></table></div>';
			}
			
			$("#detalhar_apolice__lista_acordos").html(acordo_html_conteudo);

			$("#controle_lista_eventos").hide();
			$("#sub-menu-grupo-acordo").hide();
			$("#sub-menu-grupo-apolice").show();
			$("#master-container").show();
			$("#incluir_acordo").hide();
			$("#autorizacao_acordo").hide();
			$("#consultar_acordo").hide();
			$("#incluir_apolice").hide();
			$("#alterar_apolice").hide();
			$("#consultar_apolice").hide();
			$("#detalhar_apolice").show();

		});
	});
	
	/*
	$( "div#btn-detalhar-apolice" ).each(function(index) {
		$(this).on( "swiperight", function() {
				index_apolice = $(this).attr('index_apolice');
				index_acordo = $(this).attr('index_acordo');

				chave_aux = blockchain.acordos[index_acordo].apolices[index_apolice].chave;
				var codigo_apolice_big = new BigNumber(chave_aux, 10);
				
				var dados_apolice = 0; //cosseguro.consultar_apolice(codigo_apolice_big);
				var arr_aux_apolice = dados_apolice.toString().split(",");
				
				/*
				//cosseguro.alterar_situacao_apolice.sendTransaction(codigo_apolice_big, 1, {
				cosseguro.alterar_apolice.sendTransaction(codigo_apolice_big, 0, 0, 0, 1, {
					from: web3.eth.coinbase, gas: config[3].GAS }, function(err, txHash) {
						if (err != null) {
							//alert("Erro: " + err.message);
						} else {
							arrTransacoes.push(txHash + "|false|Altera&ccedil;&atilde;o da Situa&ccedil;&atilde;o da Duplicata|||" + chave_aux);
							alert("Em andamento a minera&ccedil;&atilde;o da nova situa&ccedil;&atilde;o da apolice");
							$("#situacao_apolice_lista_" + index_acordo + "_" + index_apolice).html('<span style="color:gray;">confirma&ccedil;&atilde;o em andamento</span>')
						}
					}
				);
				
		});
		
		$(this).click(function() {

			index_apolice = $(this).attr('index_apolice');
			index_acordo = $(this).attr('index_acordo');

			chave_aux = blockchain.acordos[index_acordo].apolices[index_apolice].chave;
			valor_aux = formata_valor_descida(blockchain.acordos[index_acordo].apolices[index_apolice].valor, true);
			dataCriacao_aux = blockchain.acordos[index_acordo].apolices[index_apolice].dataCriacao;
			cnpj_emissor_aux = blockchain.acordos[index_acordo].apolices[index_apolice].cnpj_emissor;
			cpf_cnpj_sacado_aux = blockchain.acordos[index_acordo].apolices[index_apolice].cpf_cnpj_sacado;
			
			$("#codigo_apolice_alt").html(blockchain.acordos[index_acordo].codigo_apolice);
			$("#codigo_apolice_alt").html(chave_aux);
	
			$("#cpf_cnpj_sacado_alt").val(cpf_cnpj_sacado_aux);
			MascaraCPF_CNPJ($('#cpf_cnpj_sacado_alt'));
			$("#cnpj_emissor_alt").val(cnpj_emissor_aux);
			MascaraCPF_CNPJ($('#cnpj_emissor_alt'));
			$("#valor_apolice_alt").val(valor_aux);
			
			$("#index_apolice_alt").val(index_apolice);
			$("#index_acordo_alt").val(index_acordo);
			
			$("#controle_lista_eventos").hide();
			$("#sub-menu-grupo-acordo").hide();
			$("#sub-menu-grupo-apolice").show();
			$("#master-container").show();
			$("#incluir_acordo").hide();
			$("#autorizacao_acordo").hide();
			$("#consultar_acordo").hide();
			$("#incluir_apolice").hide();
			$("#alterar_apolice").show();
			$("#consultar_apolice").hide();
			$("#detalhar_apolice").hide();

		});
	});
	*/
}
//fim apolices


//inicio funcoes de inicializacoes
function inicializar_contrato() {
	//$( "#dados_apolice" ).collapsible( "option", "disabled", true );
	//$( "#incluir_apolice_btn" ).attr('disabled','disabled');
	
	setInterval(function () {exibir_mensagem("")}, 2000);
	
	/*
	if (!NODES_LOCAL) {
        web3.setProvider(new web3.providers.HttpProvider(config[1].Nodes[numero_instituicao].URL));
    } else {
        web3.setProvider(new web3.providers.HttpProvider(config[3].Nodes_Local[numero_instituicao].URL));
    }
    cosseguroABI_o = web3.eth.contract(cosseguroABI);
    cosseguro = cosseguroABI_o.at(cosseguroAddress);
	*/

	$('#valor_acordo').number( true, 2 , ',', '.');
	$('#valor_atualizado_acordo_alt').number( true, 2 , ',', '.');
	$('#valor_apolice').number( true, 2 , ',', '.');
	$('#valor_apolice_alt').number( true, 2 , ',', '.');
	
	preenchimento_DEBUG();
	
	$('#codigo_apolice').each(function (index) {
		$(this).bind('taphold', function (event) {
			//console.log("TAP HOLD!!");
			var chave_aux = $("#codigo_apolice").val();
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

	$('#codigo_apolice').focusin(function (e) {
		$('#codigo_apolice').attr('style', 'color: #000;');
		$('#codigo_apolice').val("");
		codigo_informado = true;
	});

	$( "#menu-controle" ).click(function() {
		$("#controle_sobra_falta").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-grupo-acordo").hide();
		$("#sub-menu-grupo-apolice").hide();
		$("#sub-menu-grupo-controle").show();
		$("#master-container").hide();
		$("#incluir_acordo").hide();
		$("#autorizacao_acordo").hide();
		$("#consultar_acordo").hide();
		$("#incluir_apolice").hide();
		$("#alterar_apolice").hide();
		$("#consultar_apolice").hide();
		$("#detalhar_apolice").hide();
	});

	$( "#menu-transacoes" ).click(function() {
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-grupo-controle").hide();
		$("#controle_lista_eventos").show();
		$("#sub-menu-grupo-acordo").hide();
		$("#sub-menu-grupo-apolice").hide();
		$("#master-container").show();
		$("#incluir_acordo").hide();
		$("#autorizacao_acordo").hide();
		$("#consultar_acordo").hide();
		$("#incluir_apolice").hide();
		$("#alterar_apolice").hide();
		$("#consultar_apolice").hide();
		$("#detalhar_apolice").hide();
	});

	$( "#sub-menu-sobra" ).click(function() {

		sobra_falta_html = listar_sobra_falta("", "sobra", $("#slider-range-max-sobra").val(), 0);
		$("#controle_sobra_conteudo").html(sobra_falta_html);
		//sobra_falta_html_atualizar_links();

		$("#controle_sobra").show();
		$("#controle_falta").hide();
		$("#sub-menu-grupo-controle").show();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-grupo-acordo").hide();
		$("#sub-menu-grupo-apolice").hide();
		$("#master-container").show();
		$("#incluir_acordo").hide();
		$("#autorizacao_acordo").hide();
		$("#consultar_acordo").hide();
		$("#incluir_apolice").hide();
		$("#alterar_apolice").hide();
		$("#consultar_apolice").hide();
		$("#detalhar_apolice").hide();
	});

	$( "#sub-menu-falta" ).click(function() {

		sobra_falta_html = listar_sobra_falta("", "falta", 0, $("#slider-range-max-falta").val());
		$("#controle_falta_conteudo").html(sobra_falta_html);
		//sobra_falta_html_atualizar_links();

		$("#controle_sobra").hide();
		$("#controle_falta").show();
		$("#sub-menu-grupo-controle").show();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-grupo-acordo").hide();
		$("#sub-menu-grupo-apolice").hide();
		$("#master-container").show();
		$("#incluir_acordo").hide();
		$("#autorizacao_acordo").hide();
		$("#consultar_acordo").hide();
		$("#incluir_apolice").hide();
		$("#alterar_apolice").hide();
		$("#consultar_apolice").hide();
		$("#detalhar_apolice").hide();
	});

	$( "#menu-acordo" ).click(function() {
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-grupo-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-grupo-acordo").show();
		$("#sub-menu-grupo-apolice").hide();
		$("#master-container").hide();
		$("#incluir_acordo").hide();
		$("#autorizacao_acordo").hide();
		$("#consultar_acordo").hide();
		$("#incluir_apolice").hide();
		$("#alterar_apolice").hide();
		$("#consultar_apolice").hide();
		$("#detalhar_apolice").hide();
	});

	$( "#sub-menu-acordo-consultar" ).click(function() {
		$("#consultar_acordo").hide();
		$("#consultar_acordo").html("");

		em_espera_execucao = function() {
			html_lista_acordo = listarAcordos(0, "");
			$("#consultar_acordo").html(html_lista_acordo);
			atualizar_links_acordo();
			atualizar_links_acordo_pesq();
		};

		//if (!block_pend_atualizacao) {
			em_espera_execucao();
			em_espera_execucao = function () {};
		//} else {
		//	atualiza_cache_blockchain();
		//}

		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-grupo-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-grupo-acordo").show();
		$("#sub-menu-grupo-apolice").hide();
		$("#master-container").show();
		$("#incluir_acordo").hide();
		$("#autorizacao_acordo").hide();
		$("#consultar_acordo").show();
		$("#incluir_apolice").hide();
		$("#alterar_apolice").hide();
		$("#consultar_apolice").hide();
		$("#detalhar_apolice").hide();
	});

	$( "#sub-menu-acordo-incluir" ).click(function() {
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-grupo-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-grupo-acordo").show();
		$("#sub-menu-grupo-apolice").hide();
		$("#master-container").show();
		$("#incluir_acordo").show();
		$("#autorizacao_acordo").hide();
		$("#consultar_acordo").hide();
		$("#incluir_apolice").hide();
		$("#alterar_apolice").hide();
		$("#consultar_apolice").hide();
		$("#detalhar_apolice").hide();
	});

	$( "#incluir_acordo_btn" ).click(function() {
		var codigo_acordo = $("#codigo_acordo").val().toString();
		if (!validacao_simples($("#codigo_acordo"), "O c&oacute;digo informado &eacute; inv&aacute;lido"))
			return;
		
		var valor_acordo = $("#valor_acordo").val().toString();
		if (!validacao_simples($("#valor_acordo"), "O valor informado &eacute; inv&aacute;lido"))
			return;
		
		valor_acordo = formata_valor_subida(valor_acordo);

		$("#codigo_acordo").val("");
		$("#valor_acordo").val("");

		/*
		cosseguro.incluir_acordo.sendTransaction(codigo_acordo.toString(), parseInt(valor_acordo), {
		from: web3.eth.coinbase, gas: config[3].GAS }, function(err, txHash) {
				if (err != null) {
					//alert("Erro: " + err.message);
				} else {
					arrTransacoes.push(txHash + "|false|Inclus&atilde;o de opera&ccedil;&atilde;o|||" + codigo_acordo);
					alert("Em andamento a minera&ccedil;&atilde;o da nova opera&ccedil;&atilde;o");
				}
			}
		);
		*/
	});

	$( "#autorizar_acordo_btn" ).click(function() {
		var index_apolice_aux = parseInt($("#index_apolice").val().toString());
		var _situacao_autorizacao = 1; // Autorizar;
		autorizar_acordo(index_apolice_aux, _situacao_autorizacao);
	});

	$( "#rejeitar_acordo_btn" ).click(function() {
		var index_apolice_aux = parseInt($("#index_apolice").val().toString());
		var _situacao_autorizacao = 2; // Rejeitar;
		autorizar_acordo(index_apolice_aux, _situacao_autorizacao);
	});

	$( "#menu-apolice" ).click(function() {
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-grupo-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-grupo-acordo").hide();
		$("#sub-menu-grupo-apolice").show();
		$("#master-container").hide();
		$("#incluir_acordo").hide();
		$("#autorizacao_acordo").hide();
		$("#consultar_acordo").hide();
		$("#incluir_apolice").hide();
		$("#alterar_apolice").hide();
		$("#consultar_apolice").hide();
		$("#detalhar_apolice").hide();
	});

	$( "#sub-menu-apolice-consultar" ).click(function() {
		$("#consultar_apolice").hide();
		$("#consultar_apolice").html("");

		em_espera_execucao = function() {
			html_lista_apolice = listarapolices(0, "", false);
			$("#consultar_apolice").html(html_lista_apolice);
			atualizar_links_apolice();
			atualizar_links_apolice_pesq();
		};

		//if (!block_pend_atualizacao) {
			em_espera_execucao();
			em_espera_execucao = function () {};
		//} else {
		//	atualiza_cache_blockchain();
		//}

		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-grupo-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-grupo-acordo").hide();
		$("#sub-menu-grupo-apolice").show();
		$("#master-container").show();
		$("#incluir_acordo").hide();
		$("#autorizacao_acordo").hide();
		$("#consultar_acordo").hide();
		$("#incluir_apolice").hide();
		$("#alterar_apolice").hide();
		$("#consultar_apolice").show();
		$("#detalhar_apolice").hide();
	});

	$( "#sub-menu-apolice-incluir" ).click(function() {
		
		
		em_espera_execucao = function() {
			sub_menu_apolice_incluir_limpar();
			//inicializar_autocomplete_acordo();
			preenchimento_DEBUG();
		};

		//if (!block_pend_atualizacao) {
			em_espera_execucao();
			em_espera_execucao = function () {};
		//} else {
		//	atualiza_cache_blockchain();
		//}
		
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-grupo-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-grupo-acordo").hide();
		$("#sub-menu-grupo-apolice").show();
		$("#master-container").show();
		$("#incluir_acordo").hide();
		$("#autorizacao_acordo").hide();
		$("#consultar_acordo").hide();
		$("#incluir_apolice").show();
		$("#alterar_apolice").hide();
		$("#consultar_apolice").hide();
		$("#detalhar_apolice").hide();
	});
	
	$( "#codigo_apolice" ).blur(function() {
		//alert( "Verificando a chave da apolice" );
		var codigo_apolice = $("#codigo_apolice").val().toString();
		
		if (codigo_apolice.length < 44)
			return;
		
		
		modulo11_result = calculaDigitoMod11(codigo_apolice.substring(0, codigo_apolice.length-1), 1, 44, true);
		
		if (modulo11_result != codigo_apolice.substring(codigo_apolice.length-1, codigo_apolice.length)) {
			$("#codigo_apolice").css('border', '1px solid red');
			$("#codigo_apolice").focus();
		} else {
			$("#codigo_apolice").css('border', 'none');
		}
		
		var codigo_apolice_big = new BigNumber(codigo_apolice, 10);

		//dados_apolice = cosseguro.consultar_apolice(codigo_apolice_big);
		
		arr_aux_apolice = dados_apolice.toString().split(",");

		var dataCriacao = arr_aux_apolice[0].replace(/[^\x20-\x7E]+/g, '').trim();
		
		var cnpj_emissor = arr_aux_apolice[1].toString().replace(/[^\x20-\x7E]+/g, '').trim();
		if (cnpj_emissor == "0") cnpj_emissor = "";
		
		var cpf_cnpj_sacado = arr_aux_apolice[2].toString().replace(/[^\x20-\x7E]+/g, '').trim();
		if (cpf_cnpj_sacado == "0") cpf_cnpj_sacado = "";
		
		var valor = arr_aux_apolice[3].toString().replace(/[^\x20-\x7E]+/g, '').trim();
		valor = parseInt(valor);
		
		$("#cnpj_emissor").val(cnpj_emissor);
		MascaraCNPJ($('#cnpj_emissor')[0]);
		$("#cpf_cnpj_sacado").val(cpf_cnpj_sacado);
		MascaraCNPJ($('#cpf_cnpj_sacado')[0]);
		$("#valor_apolice").val(valor);
		$( "#dados_apolice" ).collapsible( "option", "disabled", false );
		
		//$( "#incluir_apolice_btn" ).removeAttr('disabled');
		
		//$("#dados_apolice").collapsible( "expand" );
		
		preenchimento_DEBUG();

		codigo_apolice_verificada = true;
	});
	
	$( "#codigo_apolice" ).bind('input', function(){
		if ($('#codigo_apolice').val().length == 44) {
			$('#codigo_apolice').blur(); 
		}
	});
	
	$( "#incluir_apolice_btn" ).click(function() {
		var codigo_apolice = $("#cad_apolice_codigo").val().toString();
		if (!validacao_simples($("#cad_apolice_codigo"), "Código informado da operação é inválido"))
			return;
		
		var valor_premio = formata_numero_subida($("#cad_apolice_valor_premio").val().toString());
		if (!validacao_simples($("#cad_apolice_valor_premio"), "cad_apolice_valor_premio é inválido"))
			return;
		
		var valor_cobertura = formata_numero_subida($("#cad_apolice_valor_cobertura").val().toString());
		if (!validacao_simples($("#cad_apolice_valor_cobertura"), "cad_apolice_valor_cobertura é inválido"))
			return;
		
		var dt_vencimento = $( "#cad_apolice_dt_vencimento" ).date( "getDate" );;
		if (!validacao_simples($("#cad_apolice_dt_vencimento"), "cad_apolice_dt_vencimento informado é inválido"))
			return;

		var numero_aditivo = $("#cad_apolice_numero_aditivo").val().toString();
		if (!validacao_simples($("#cad_apolice_numero_aditivo"), "cad_apolice_numero_aditivo é inválido"))
			return;
		
		var tipo = $("#cad_apolice_tipo").val().toString();
		if (!validacao_simples($("#cad_apolice_tipo"), "cad_apolice_tipo é inválido"))
			return;
	
		var persent_comisao = formata_numero_subida($("#cad_apolice_persent_comisao").val().toString());
		if (!validacao_simples($("#cad_apolice_persent_comisao"), "cad_apolice_persent_comisao é inválido"))
			return;
		
		var persent_desconto = formata_numero_subida($("#cad_apolice_persent_desconto").val().toString());
		if (!validacao_simples($("#cad_apolice_persent_desconto"), "cad_apolice_persent_desconto é inválido"))
			return;

		var seg1 = formata_numero_subida($("#cad_apolice_seg1").val().toString());
		if (!validacao_simples($("#cad_apolice_seg1"), "cad_apolice_seg1 é inválido"))
			return;

		var seg1_percent = formata_numero_subida($("#cad_apolice_seg1_percent").val().toString());
		if (!validacao_simples($("#cad_apolice_seg1_percent"), "cad_apolice_seg1_percent é inválido"))
			return;
		
		var seg2 = formata_numero_subida($("#cad_apolice_seg2").val().toString());
		var seg2_percent = formata_numero_subida($("#cad_apolice_seg2_percent").val().toString());

		if (seg2.trim().length > 0 || seg2_percent.trim().length > 0) {
			if (seg2.trim().length == 0){
				validacao_mensagem_formata_erro($("#cad_apolice_seg2"), "Seguradora 2 inválida");
				return;
			}
			if (seg2.trim().length == 0) {
				validacao_mensagem_formata_erro($("#cad_apolice_seg2"), "Percentual da Seguradora 2 inválido");
				return;
			}
		}

		
		var seg3 = formata_numero_subida($("#cad_apolice_seg3").val().toString());
		var seg3_percent = formata_numero_subida($("#cad_apolice_seg3_percent").val().toString());
		
		sub_menu_apolice_incluir_limpar();
		
		preenchimento_DEBUG();

		var _data = {};
		_data.codigo_apolice = codigo_apolice;
		_data.valor_premio = parseInt(formata_valor_subida(valor_premio));
		_data.valor_cobertura = parseInt(formata_valor_subida(valor_cobertura));
		_data.dt_vencimento = dt_vencimento.getTime();
		_data.numero_aditivo = numero_aditivo;
		_data.tipo = parseInt(tipo);
		_data.persent_comisao = parseInt(persent_comisao);
		_data.persent_desconto = parseInt(persent_desconto);

		_data.seg1_addr = parseInt(seg1);
		_data.seg1_persent = parseInt(seg1_percent);
		_data.seg2_addr = parseInt(seg2);
		_data.seg2_persent = parseInt(seg2_percent);
		_data.seg3_addr = parseInt(seg3);
		_data.seg3_persent = parseInt(seg3_percent);
		
		_data.usuario = usuario;
		
		//alert(_data + '\n' + this.id);
		postAjax("/incluir_apolice", 
			_data, 
			function(data) {
				//$("#retorno_login").html(data);
				if (data.sucesso) {
					arrTransacoes.push(data.txHash + "|false|" + data.funcao + "|||" + codigo_apolice);
					alert("Em andamento a minera&ccedil;&atilde;o da nova apolice");
				} else {
					if (data.loginError)
						location.reload();
					else
						alert(data.msg);
				}
			}, function(errMsg) {
				alert(errMsg);
			});
	});
	
	$( "#btn_apolice__incluir_acordo" ).click(function() {
		$("#cad_acordo_codigo_apolice").html($("#det_apolice_codigo").html());
		
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-grupo-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-grupo-acordo").hide();
		$("#sub-menu-grupo-apolice").show();
		$("#master-container").show();
		$("#incluir_acordo").show();
		$("#autorizacao_acordo").hide();
		$("#consultar_acordo").hide();
		$("#incluir_apolice").hide();
		$("#alterar_apolice").hide();
		$("#consultar_apolice").hide();
		$("#detalhar_apolice").hide();
	});

	$( "#btn_apolice__incluir_acordo__enviar" ).click(function() {
		var index_apolice = listarapolices(0, $("#cad_acordo_codigo_apolice").html(), true);
		if (index_apolice == -1) {
			alert("Erro: Inicie o cadastramento novamente");
			sub_menu_apolice_incluir_acordo_limpar();
			return;
		}
		
		var addr_seguradora_aceito = $("#cad_acordo_address_seguradora_aceito").val().toString();
		if (!validacao_simples($("#cad_acordo_address_seguradora_aceito"), "cad_acordo_address_seguradora_aceito é inválido"))
			return;
		
		var percent_acordo = $("#cad_acordo_percentual").val().toString();
		if (!validacao_simples($("#cad_acordo_percentual"), "cad_acordo_percentual é inválido"))
			return;
		
		preenchimento_DEBUG();
		sub_menu_apolice_incluir_acordo_limpar();

		var _data = {};
		_data.index_apolice = index_apolice;
		_data.addr_seguradora_aceito = addr_seguradora_aceito;
		_data.percent_acordo = parseInt(formata_valor_subida(percent_acordo));
		_data.usuario = usuario;
		
		//alert(_data + '\n' + this.id);
		//incluir_acordo(uint _index_apolice, uint16 _percent_acordo, address _addr_seguradora_aceito)
		postAjax("/cadastrar_acordo", 
			_data, 
			function(data) {
				//$("#retorno_login").html(data);
				if (data.sucesso) {
					arrTransacoes.push(data.txHash + "|false|" + data.funcao + "|||" + codigo_apolice);
					alert("Em andamento a minera&ccedil;&atilde;o da inclusão da seguradora na apolice");
				} else {
					if (data.loginError)
						location.reload();
					else
						alert(data.msg);
				}
			}, function(errMsg) {
				alert(errMsg);
			});
	});

	$( "#alterar_apolice_btn" ).click(function() {
		var index_apolice_alt = $("#index_apolice_alt").val().toString();
		var index_acordo_alt = $("#index_acordo_alt").val().toString();
		
		var cpf_cnpj_sacado_alt = formata_numero_subida($("#cpf_cnpj_sacado_alt").val().toString());
		if (!validacao_simples($("#cpf_cnpj_sacado_alt"), "CPF/CNPJ informado &eacute; inv&aacute;lido"))
			return;
		
		var codigo_apolice = blockchain.acordos[index_acordo_alt].apolices[index_apolice_alt].chave;
		
		var cnpj_emissor_alt = formata_numero_subida($("#cnpj_emissor_alt").val().toString());
		if (!validacao_simples($("#cnpj_emissor_alt"), "CNPJ do emissor informado &eacute; inv&aacute;lido"))
			return;
		
		var valor_apolice_alt = ($("#valor_apolice_alt").val().toString());
		if (!validacao_simples($("#valor_apolice_alt"), "Valor informado &eacute; inv&aacute;lido"))
			return;
		
		
		var codigo_apolice_big = new BigNumber(codigo_apolice, 10);
		var cnpj_emissor_big = new BigNumber(cnpj_emissor_alt, 10);
		var cpf_cnpj_sacado_big = new BigNumber(cpf_cnpj_sacado_alt, 10);

		if (valor_apolice_alt.trim().length == 0) {
			alert("O valor informado &eacute; inv&aacute;lido")
			return;
		}

		valor_apolice_alt = formata_valor_subida(valor_apolice_alt);
		valor_apolice_alt = parseInt(valor_apolice_alt);

		sub_menu_apolice_alterar_limpar();

		preenchimento_DEBUG();
		
		/*
		cosseguro.alterar_apolice.sendTransaction(codigo_apolice_big, cnpj_emissor_big, cpf_cnpj_sacado_big, valor_apolice_alt, situacao_nova_apolice, {
		from: web3.eth.coinbase, gas: config[3].GAS }, function(err, txHash) {
				if (err != null) {
					//alert("Erro: " + err.message);
				} else {
					arrTransacoes.push(txHash + "|false|Altera&ccedil;&atilde;o de apolice|||" + codigo_apolice.toString());
					alert("Em andamento a minera&ccedil;&atilde;o da altera&ccedil;&atilde;o da apolice");
				}
			}
		);
		*/
	});


	socket.on('ret_sendTr_incluir_apolice', function (data_str) {
		var data = JSON.parse(data_str);
		
		if (data.loginError)
			location.reload();
		else
			registrarEvento(data.funcao, data.txHash, data.sucesso, "", data.cod_retorno);
	});

	socket.on('ret_sendTr_incluir_acordo', function (data_str) {
		var data = JSON.parse(data_str);
		
		if (data.loginError)
			location.reload();
		else
			registrarEvento(data.funcao, data.txHash, data.sucesso, "", data.cod_retorno);
	});

	atualiza_cache_blockchain();

	//sleep(10);

	$.mobile.loading( 'hide' );

	$("#page-app").show();
}

function autorizar_acordo(index_apolice_aux, _situacao_autorizacao) {
	var _data = {};
	_data.index_apolice = parseInt(index_apolice_aux);
	_data.situacao_autorizacao = parseInt(_situacao_autorizacao);
	
	_data.usuario = usuario;
	
	//alert(_data + '\n' + this.id);
	postAjax("/autorizar_acordo", 
		_data, 
		function(data) {
			//$("#retorno_login").html(data);
			if (data.sucesso) {
				arrTransacoes.push(data.txHash + "|false|" + data.funcao + "|||" + codigo_apolice);
				alert("Em andamento a minera&ccedil;&atilde;o da autorização ou rejeição do acordo");
			} else {
				if (data.loginError)
					location.reload();
				else
					alert(data.msg);
			}
		}, function(errMsg) {
			alert(errMsg);
		});
}



function main() {
	setTimeout(inicializar_contrato,1);
}
//fim funcoes de inicializacoes

//inicio outras funcoes
Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

alert = function(txt) {
	registrarEvento(txt, "", "", "alerta", "")
	exibir_mensagem("alerta");
}

/*
function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
}
*/

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

	//return parseInt(valor_aux);
	return parseInt(valor);
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
		validacao_mensagem_formata_erro(obj, mensagem)
		return false;
	}
	obj.css('border', 'none');
	return true;
}

function validacao_mensagem_formata_erro(obj, mensagem) {
	obj.css('border', '1px solid red');
	alert(mensagem);
}

function atualiza_cache_blockchain() {
	//if (!block_pend_atualizacao)
	//	return;

	$("body").addClass("loading");
	$.mobile.loading( 'show' );

	//setTimeout(atualiza_cache_blockchain_aux,1);
	var _data = {};
	_data.usuario = usuario;
	postAjax("/consultar_blockchain", 
		_data, 
		function(data) { //Callback quando sucesso
			if (data.sucesso) {
				atualiza_cache_blockchain_aux(data.blockchain)
			} else {
				if (data.loginError)
					location.reload();

				retiraLoding();
				alert("Erro de atualização do cache. Mensagem: " + data.msg + "<br>Mensagem Téc.: " + data.msgTecnica);
			}
		}, function(errMsg) { //Callback quando erro na chamada
			alert(errMsg);
		});


	//sleep(10);
}

function atualiza_cache_blockchain_aux(_blockchain) {
	//sleep(20);

	//if (!block_pend_atualizacao)
	//	return;

	blockchain = _blockchain;
	//block_pend_atualizacao = false;

	retiraLoding();
}


function retiraLoding() {
	$("body").removeClass("loading");
	$.mobile.loading( 'hide' );

	em_espera_execucao();
	em_espera_execucao = function () {};
}


//fim outras funcoes



