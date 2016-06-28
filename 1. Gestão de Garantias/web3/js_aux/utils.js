
alert = function(txt) {
	registrarEvento(txt, "", "", "", "", "alerta")
	exibir_mensagem("alerta");
}


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


function tratamento_mensagem_erro(cod_erro) {
	var mensagem = "";

	switch (parseInt(cod_erro)) {
		case -1:
			mensagem = "O c&oacute;digo informado j&aacute; est&aacute; cadastrado";
			break;
		case -2:
			mensagem = "O c&oacute;digo informado j&aacute; est&aacute; cadastrado";
			break;
		case -3:
			mensagem = "Bem ou Direito j&aacute; em uso como garantia. A aloca&ccedil;&atilde;o excede o permitido";
			break;
		case -4:
			mensagem = "";
			break;
		case -5:
			mensagem = "ID da Garantia inv&aacute;lido";
			break;
		case -6:
			mensagem = "ID do Bem/Direito inv&aacute;lido";
			break;
		case -7:
			mensagem = "O c&oacute;digo informado &eacute; inv&aacute;lido";
			break;
		case -8:
			mensagem = "O valor informado &eacute; inv&aacute;lido";
			break;
		case -9:
			mensagem = "O c&oacute;digo informado &eacute; inv&aacute;lido";
			break;
		case -10:
			mensagem = "O valor informado &eacute; inv&aacute;lido";
			break;
		case -11:
			mensagem = "Operação não permitida. Verificar com o \"Owner\" do contrato";
			break;
		case -12:
			mensagem = "N&oacute; inv&aacute;lido";
			break;
		case -13:
			mensagem = "";
			break;
		case -14:
			mensagem = "";
			break;
		case -15:
			mensagem = "";
			break;
		default:
			mensagem = "";
	}

	return mensagem;
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



	/**** atualização da lista de transações pendentes *******/
	var controle_html = "";
	var situacao = "";
	for (var t = 0; t < arrTransacoes.length; t++) {
		arr_aux = arrTransacoes[t].split("|");

		if (arr_aux[1] == "false") {
			//situacao = '<img src="js_aux/load1.gif" width="20" />';
			situacao = '<img src="js_aux/images/ajax-loader.gif" width="20" />';
		} else {
			if (arr_aux[3] == "true") {
				situacao = '<img src="js_aux/images/green.png" width="20" />';
			} else {
				situacao = '<img src="js_aux/images/red.png" width="20" />';
			}
		}

		controle_html = controle_html + '<div href="#" id="tx_pendente" index_tx="' + t + '" hash_tx="' + arr_aux[0] + '" class="ui-btn ui-corner-all ui-shadow ui-mini" style="width:85%; height:40px; margin:10px auto;"><div style="display:table; width:100%"><div style="display:table-cell; position:relative; width:85%; height:40px; vertical-align:middle;"><div style="width:100%; text-align:left; word-wrap:break-word; white-space:normal;">' + arr_aux[2] +'</div><div style="width:100%; text-align:left; word-wrap:break-word; white-space:normal; font-size:0.8em;">' + arr_aux[5] + '</div></div><div style="display:table-cell; position:relative; width:15%; height:40px; top:0px; text-align:center; vertical-align: middle;">' + situacao + '</div></div></div></div>';
	}
	if (controle_html.length == 0) {
		controle_html = "<p>N&atilde;o foram enviadas transa&ccedil;&otilde;es para minera&ccedil;&atilde;o</p>"
	}
	$("#controle_lista_eventos").html(controle_html);
	/**** atualização da lista de transações pendentes *******/




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
			mensagem = mensagem + funcao; //+ ": Erro na minera&ccedil;&atilde;o.";

			var cod_erro = ""
			if (obj_ok.args.codigo_erro)
				cod_erro = obj_ok.args.codigo_erro.toString();
			else if (obj_ok.args.valor_erro)
				cod_erro = obj_ok.args.valor_erro.toString();
			else
				cod_erro = "";

			//mensagem = mensagem + "<br> &nbsp;&nbsp; Mensagem: " + tratamento_mensagem_erro(cod_erro);
			mensagem = mensagem + "<br>" + tratamento_mensagem_erro(cod_erro);

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

			var cod_erro = ""
			if (obj_ok.args.codigo_erro)
				cod_erro = obj_ok.args.codigo_erro.toString();
			else if (obj_ok.args.valor_erro)
				cod_erro = obj_ok.args.valor_erro.toString();
			else
				cod_erro = "";

			mensagem_resposta = mensagem_resposta + "<br> &nbsp;&nbsp; Mensagem: " + tratamento_mensagem_erro(cod_erro);
		}

		tx_marcar_resposta(tx, !eh_erro, mensagem_resposta);
	}


}

function listarGarantias(quantidade, query_filtro) {
	// se "quantidade" == 0 mostra todos
	// se "quantidade" != 0 mostra os últimos conforme valor informado

	var pesquisa_ativada = false;
	if (query_filtro.trim().length >= 3) {
		pesquisa_ativada = true;
	} else {
		query_filtro = "";
	}

	var total_loops; // = 15;
	total_loops = gestao_garantias.contador_garantia();

	garantias_html = "<b class=\"title\">Listagem de Garantias</b>";
	//garantias_html = garantias_html + "colocar filtro<br>";
	//garantias_html = garantias_html + "diminuir a letra na tabela";
	garantias_html = garantias_html + "<table>";
	garantias_html = garantias_html + "<tr><td>C&oacute;digo</td><td><input id=\"codigo_garantia_pesquisa\" size=\"20\" value=\"" + query_filtro + "\" /></td><td><img class=\"icon_aux\" src=\"js_aux/lupa.png\" alt=\"\" id=\"btn-pesquisar-garantia\" width=\"20\" height=\"20\" style=\"cursor: hand;\" /></td></tr>";
	garantias_html = garantias_html + "</table>";

	if (total_loops < 10) {
		total_limite = 0;
	} else {
		total_limite = total_loops - 10;
	}

	var valor_aux;
	var garantias_html_conteudo = ""
	for (var i=total_loops; i > 0; i--) { //desta forma a pesquisa percorre somente os 10 ultimo. mudar para percorrer todos os itens do array.
		txt = gestao_garantias.garantias(i - 1);
		arr = txt.toString().split(",");

		var codigo_aux = web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '') + "";
		arr_codigo = codigo_aux.toString().split(" "); //mudar para pegar as duas primeiras posicoes

		node_aux = codigo_aux.toString().substring(0,2);
		codigo_aux = codigo_aux.toString().substring(3,100);

		if (node_aux == node) {
			//codigo_aux = codigo_aux.replace(node + " ", "");

			if (pesquisa_ativada) {
				if (codigo_aux.indexOf(query_filtro) >= 0) {
					exibir = true;
				} else {
					exibir = false;
				}
			} else {
				exibir = true;
			}

			if (exibir) {
				//garantias_html = garantias_html + ">> " + i + " - codigo: " + codigo_aux + " > valor: " + arr[1] + " > ativo: " + arr[2] + "<br>";
				valor_aux = formata_valor_descida(arr[2], false);
				//valor_aux = valor_aux / 100;
				//valor_aux = valor_aux.format(2, 3, '.', ',');
				index_garantia = i - 1;
				//garantias_html_conteudo = garantias_html_conteudo + "<tr><td>" + codigo_aux + "</td><td align=\"right\">" + valor_aux + "</td><td><img class=\"icon_aux\" src=\"js_aux/change.png\" alt=\"\" id=\"btn-alterar-garantia\" index=\"" + index_garantia + "\" width=\"20\" height=\"20\" style=\"cursor: hand;\" /></td></tr>";
				garantias_html_conteudo = garantias_html_conteudo + '<div href="#" id="btn-alterar-garantia" index="' + index_garantia + '" class="ui-btn ui-corner-all ui-icon-carat-r ui-btn-icon-right ui-shadow ui-mini" style="width:85%; margin:10px auto;"><div style="display:inline-block; width:55%; text-align:left;">' + codigo_aux +'</div><div style="display:inline-block; width:5%; text-align:left;">R$</div><div style="display:inline-block; width:39%; padding-right:30px; text-align:right;">' + valor_aux + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></div>';
			}
		}
	}


	if (garantias_html_conteudo != "") {
		//garantias_html = garantias_html + "<br /><table class=\"lista\">";
		//garantias_html = garantias_html + "<tr><th width=\"40%\">C&oacute;digo</th><th width=\"40%\">Valor (R$)</th><th width=\"20%\"></th></tr>";
		garantias_html = garantias_html + garantias_html_conteudo;
		//garantias_html = garantias_html + "</table>";
	} else if (pesquisa_ativada) {
		garantias_html = garantias_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o foram encontradas garantias com o c&oacute;digo informado: \"" + query_filtro + "\"</td></tr></table>";
	} else {
		garantias_html = garantias_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o h&aacute; garantias cadastradas.</td></tr></table>";
	}

	return garantias_html.replace(/[^\x20-\x7E]+/g, '');
}

function listar_sobre_falta(query_filtro, s_ou_f, limite_sobra, limite_falta) {

	var dados_blockchain = retorna_blockchain();

	var valor_alocado = 0;
	var html_sobra = ""
	var html_falta = ""
	var html_outros = ""
	for (var g = 0; g < dados_blockchain.length; g++) {
		banco = dados_blockchain[g].banco;

		if (banco == node) {
			codigo_garantia = dados_blockchain[g].garantia;
			valor_atualizado_garantia = parseInt(dados_blockchain[g].valor_atualizado);
			valor_alocado = 0;
			for (var b = 0; b < dados_blockchain[g].bens.length; b++) {
				valor_alocado += parseInt(dados_blockchain[g].bens[b].valor_atualizado) * parseInt(dados_blockchain[g].bens[b].percentual_alocacao) / 100;
			}

			//taxa_alocacao = valor_alocado / valor_atualizado_garantia * 100;

			/*
			if (taxa_alocacao > 130) { //sobra maior que 30%
				html_sobra += "<tr><td class=\"sobra\">" + codigo_garantia + "</td><td class=\"sobra\">" + formata_valor_descida(valor_atualizado_garantia, false) + "</td><td class=\"sobra\">" + formata_valor_descida(valor_alocado, false) + "</td></tr>";
			} else if (taxa_alocacao < 100) { //falta
				html_falta += "<tr><td class=\"falta\">" + codigo_garantia + "</td><td class=\"falta\">" + formata_valor_descida(valor_atualizado_garantia, false) + "</td><td class=\"falta\">" + formata_valor_descida(valor_alocado, false) + "</td></tr>";
			} else {
				html_outros += "<tr><td class=\"outros\">" + codigo_garantia + "</td><td class=\"outros\">" + formata_valor_descida(valor_atualizado_garantia, false) + "</td><td class=\"outros\">" + formata_valor_descida(valor_alocado, false) + "</td></tr>";
			}
			*/

			if (s_ou_f == "sobra") {
				taxa_alocacao = (valor_alocado - valor_atualizado_garantia) / valor_atualizado_garantia * 100;
				if (taxa_alocacao > limite_sobra) {
					html_sobra += "<tr><td class=\"sobra\">" + codigo_garantia + "</td><td class=\"sobra\">" + formata_valor_descida(valor_atualizado_garantia, false) + "</td><td class=\"sobra\">" + formata_valor_descida(valor_alocado, false) + "</td></tr>";
				}
			}

			if (s_ou_f == "falta") {
				taxa_alocacao = valor_alocado / valor_atualizado_garantia * 100;
				if (taxa_alocacao <= limite_falta) {
					html_falta += "<tr><td class=\"falta\">" + codigo_garantia + "</td><td class=\"falta\">" + formata_valor_descida(valor_atualizado_garantia, false) + "</td><td class=\"falta\">" + formata_valor_descida(valor_alocado, false) + "</td></tr>";
				}
			}
		}
	}

	var html_geral = "";

	if (s_ou_f == "sobra") {
		if (html_sobra != "") {
			html_geral += "<br /><table class=\"sobra\">";
			html_geral += "<th>Codigo Garantia</th><th>Valor Atualizado da Garantia (R$)</th><th>Valor Alocado (R$)</th>";
			html_geral += html_sobra;
			html_geral += "</table>";
		} else {
			html_geral += "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o h&aacute; garantias com sobras.</td></tr></table>"
		}
	}

	if (s_ou_f == "falta") {
		if (html_falta != "") {
			html_geral += "<br /><table class=\"falta\">";
			html_geral += "<th>Codigo Garantia</th><th>Valor Atualizado da Garantia (R$)</th><th>Valor Alocado (R$)</th>";
			html_geral += html_falta;
			html_geral += "</table>";
		} else {
			html_geral += "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o h&aacute; garantias com faltas.</td></tr></table>"
		}
	}

	/*
	if (html_outros != "") {
		html_geral += "<br />";
		html_geral += "<br />";
		html_geral += "<b class=\"title\">Outras garantias</b>";
		html_geral += "<br /><table class=\"outros\">";
		html_geral += "<th>Codigo Garantia</th><th>Valor Atualizado da Garantia (R$)</th><th>Valor Alocado (R$)</th>";
		html_geral += html_outros;
		html_geral += "</table>";
	}
	*/

	return html_geral.replace(/[^\x20-\x7E]+/g, '');
}

function retorna_blockchain() {

	if (!block_pend_atualizacao)
		return blockchain;

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


	var json_aux = '[';
	var arr_aux_garantia = [];
	var arr_aux_associacao = [];
	var arr_aux_bem = [];

	var virgula_garantia = '';
	var virgula_bem = '';

	for (var g=0; g < arr_garantias.length; g++) {
		virgula_bem = '';
		dados_garantia = arr_garantias[g];
		arr_aux_garantia = dados_garantia.toString().split(",");

		codigo_aux = web3_node1.toAscii(arr_aux_garantia[0]).replace(/[^\x20-\x7E]+/g, '') + "";
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

				index_garantia = parseInt(web3_node1.toAscii(arr_aux_associacao[0]).substring(1, 300).replace(/[^\x20-\x7E]+/g, '').trim());
				index_bem = parseInt(arr_aux_associacao[1]);
				percentual_alocacao = arr_aux_associacao[2];

				if (index_garantia == g) {
					dados_bem = arr_bens[index_bem];
					arr_aux_bem = dados_bem.toString().split(",");

					codigo_bem = web3_node1.toAscii(arr_aux_bem[0]).substring(1, 300).replace(/[^\x20-\x7E]+/g, '').trim();
					tipo = retorna_descricao_tipo(web3_node1.toAscii(arr_aux_bem[0]).replace(/[^\x20-\x7E]+/g, '').substring(0, 1));

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

	return blockchain;
}

function listarGarantiasAssociacao(titulo, quantidade, query_filtro) {
	// se "quantidade" == 0 mostra todos
	// se "quantidade" != 0 mostra os últimos conforme valor informado

	var pesquisa_ativada = false;
	if (query_filtro.trim().length >= 3) {
		pesquisa_ativada = true;
	} else {
		query_filtro = "";
	}

	var total_loops; // = 15;
	total_loops = gestao_garantias.contador_garantia();

	var garantias_ass_html_conteudo = "";
	var garantias_ass_html = "";
	garantias_ass_html = "<b class=\"title\">"+ titulo +" - Selecionar a Garantia</b>";
	//garantias_ass_html = garantias_ass_html + "colocar filtro<br>";
	//garantias_ass_html = garantias_ass_html + "diminuir a letra na tabela";
	garantias_ass_html = garantias_ass_html + "<table>";
	garantias_ass_html = garantias_ass_html + "<tr><td>C&oacute;digo</td><td><input id=\"codigo_garantia_associacao_pesquisa\" value=\"" + query_filtro + "\" size=\"20\" /></td><td><img class=\"icon_aux\" src=\"js_aux/lupa.png\" alt=\"\" id=\"btn-pesquisar-garantia-associacao\" width=\"20\" height=\"20\" /></td></tr>";
	garantias_ass_html = garantias_ass_html + "</table>";
	if (total_loops < 10) {
		total_limite = 0;
	} else {
		total_limite = total_loops - 10;
	}

	for (var i=total_loops; i > 0; i--) {
		txt = gestao_garantias.garantias(i - 1);
		arr = txt.toString().split(",");

		var codigo_aux = web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '') + "";
		arr_codigo = codigo_aux.toString().split(" ");

		node_aux = codigo_aux.toString().substring(0,2);
		codigo_aux = codigo_aux.toString().substring(3,100);



		if (node_aux == node){
			//codigo_aux = codigo_aux.replace(node + " ", "");

			if (pesquisa_ativada) {
				if (codigo_aux.indexOf(query_filtro) >= 0) {
					exibir = true;
				} else {
					exibir = false;
				}
			} else {
				exibir = true;
			}

			if (exibir) {
				index_aux = i - 1;
				//garantias_html = garantias_html + ">> " + i + " - codigo: " + codigo_aux + " > valor: " + arr[1] + " > ativo: " + arr[2] + "<br>";
				valor_aux = formata_valor_descida(arr[2], false);
				//valor_aux = valor_aux.format(2, 3, '.', ',');
				index_aux = i - 1;
				//garantias_ass_html_conteudo = garantias_ass_html_conteudo + "<tr><td>" + codigo_aux + "</td><td align=\"right\">" + valor_aux + "</td><td><img class=\"icon_aux\" src=\"js_aux/select.png\" alt=\"\" id=\"btn-consultar-garantia-associacao\" index_garantia=\"" + index_aux + "\" codigo=\"" + codigo_aux + "\" valor=\"" + valor_aux + "\" width=\"20\" height=\"20\" style=\"cursor: hand;\" /></td></tr>";
				garantias_ass_html_conteudo = garantias_ass_html_conteudo + '<div href="#" id="btn-consultar-garantia-associacao" index_garantia="' + index_aux + '" codigo="' + codigo_aux + '" valor="' + valor_aux + '" class="ui-btn ui-corner-all ui-icon-carat-r ui-btn-icon-right ui-shadow ui-mini" style="width:85%; margin:10px auto;"><div style="display:inline-block; width:55%; text-align:left;">' + codigo_aux +'</div><div style="display:inline-block; width:5%; text-align:left;">R$</div><div style="display:inline-block; width:39%; padding-right:30px; text-align:right;">' + valor_aux + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></div>';
			}
		}
	}

	if (garantias_ass_html_conteudo != "") {
		if (!pesquisa_ativada) {
			garantias_ass_html = garantias_ass_html + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&Uacute;ltimas 10 cadastradas";
			//garantias_ass_html = garantias_ass_html + "<table class=\"lista\">";
		} else {
			//garantias_ass_html = garantias_ass_html + "<br /><table class=\"lista\">";
		}
		//garantias_ass_html = garantias_ass_html + "<tr><th width=\"40%\">C&oacute;digo</th><th width=\"40%\">Valor (R$)</th><th width=\"20%\"></th></tr>";

		garantias_ass_html = garantias_ass_html + garantias_ass_html_conteudo;
		//garantias_ass_html = garantias_ass_html + "</table>";
	} else if (pesquisa_ativada) {
		garantias_ass_html = garantias_ass_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o foram encontradas garantias com o c&oacute;digo informado: \"" + query_filtro + "\"</td></tr></table>";
	} else {
		garantias_ass_html = garantias_ass_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o h&aacute; garantias cadastradas.</td></tr></table>";
	}

	return garantias_ass_html.replace(/[^\x20-\x7E]+/g, '');
}

function listarBens(quantidade, query_filtro) {
	// se "quantidade" == 0 mostra todos
	// se "quantidade" != 0 mostra os últimos conforme valor informado

	var pesquisa_ativada = false;
	if (query_filtro.trim().length >= 3) {
		pesquisa_ativada = true;
	} else {
		query_filtro = "";
	}

	var total_loops; // = 15;
	total_loops = gestao_garantias.contador_bem();

	var bens_html_conteudo = "";
	var bens_html = "";
	bens_html = "<b class=\"title\">Listagem de Bens e Direitos</b>";
	//bens_html = bens_html + "colocar filtro<br>";
	//bens_html = bens_html + "diminuir a letra na tabela";
	bens_html = bens_html + "<table>";
	bens_html = bens_html + "<tr><td>C&oacute;digo</td><td><input id=\"codigo_bem_pesquisa\" value=\"" + query_filtro + "\" size=\"20\" /></td><td><img class=\"icon_aux\" src=\"js_aux/lupa.png\" alt=\"\" id=\"btn-pesquisar-bens\" width=\"20\" height=\"20\" /></td></tr>";
	bens_html = bens_html + "</table>";

	if (total_loops < 10) {
		total_limite = 0;
	} else {
		total_limite = total_loops - 10;
	}
	for (var i=total_loops; i > 0; i--)
	{
		txt = gestao_garantias.bens(i - 1);
		arr = txt.toString().split(",");

		codigo_aux = web3_node1.toAscii(arr[0]).substring(1, 300).replace(/[^\x20-\x7E]+/g, '')
		if (pesquisa_ativada) {
			if (codigo_aux.indexOf(query_filtro) >= 0) {
				exibir = true;
			} else {
				exibir = false;
			}
		} else {
			exibir = true;
		}

		if (exibir) {

			tipo = web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '').substring(0, 1);
			tipo_aux = retorna_descricao_tipo(tipo);

			valor_aux = formata_valor_descida(arr[2], false);// / 100;
			//valor_aux = valor_aux.format(2, 3, '.', ',');
			index_bem = i - 1;
			//bens_html_conteudo = bens_html_conteudo + "<tr><td>" + tipo_aux + "</td><td>" + codigo_aux + "</td><td align=\"right\">" + valor_aux + "</td><td><img class=\"icon_aux\" src=\"js_aux/change.png\" alt=\"\" id=\"btn-alterar-bem\" index=\"" + index_bem + "\" width=\"20\" height=\"20\" style=\"cursor: hand;\" /></td></tr>";
			//bens_html_conteudo = bens_html_conteudo + '<div href="#" id="btn-alterar-bem" index="' + index_bem + '" class="ui-btn ui-corner-all ui-icon-carat-r ui-btn-icon-right ui-shadow ui-mini" style="width:85%; margin:10px auto;"><div style="display:inline-block; width:55%; text-align:left;">' + codigo_aux +'</div><div style="display:inline-block; width:5%; text-align:left;">R$</div><div style="display:inline-block; width:39%; padding-right:30px; text-align:right;">' + valor_aux + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></div>';
			bens_html_conteudo = bens_html_conteudo + '<div href="#" id="btn-alterar-bem" index="' + index_bem + '" class="ui-btn ui-corner-all ui-icon-carat-r ui-btn-icon-right ui-shadow ui-mini" style="width:85%; margin:10px auto;"><div style="display:inline-block; width:50%; text-align:left;"><div style="width:100%; text-align:left;">' + codigo_aux +'</div><div style="width:100%; text-align:left; font-size:0.6em;">' + tipo_aux + '</div></div><div style="display:inline-block; width:5%;  text-align:left;  vertical-align:top; margin-top:5px;">R$</div><div style="display:inline-block; width:45%; text-align:right; vertical-align:top; margin-top:5px;">' + valor_aux + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></div>';
		}
	}

	if (bens_html_conteudo != "") {
		//bens_html = bens_html + "<br /><table class=\"lista\">";
		//bens_html = bens_html + "<tr><th width=\"30%\">Tipo</th><th width=\"30%\">C&oacute;digo</th><th width=\"30%\">Valor (R$)</th><th width=\"10%\"></th></tr>";
		bens_html = bens_html + bens_html_conteudo;
		//bens_html = bens_html + "</table>";
	} else if (pesquisa_ativada) {
		bens_html = bens_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o foram encontrados bens ou direitos com o c&oacute;digo informado: \"" + query_filtro + "\"</td></tr></table>";
	} else {
		bens_html = bens_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o h&aacute; bens ou direitos cadastrados.</td></tr></table>";
	}

	return bens_html.replace(/[^\x20-\x7E]+/g, '');
}

function retorna_descricao_tipo(tipo) {
	for (var b = 0;b < config[2].Tipo_Bens.length; b++)
		if (config[2].Tipo_Bens[b].codigo == tipo)
			return config[2].Tipo_Bens[b].descricao;
}

function listarBensAssociacao(quantidade, query_index, index_garantia, codigo, valor) {
	// se "quantidade" == 0 mostra todos
	// se "quantidade" != 0 mostra os últimos conforme valor informado

	var bens_html_conteudo = "";
	var bens_html = "";

	var total_loops; // = 15;
	total_loops = gestao_garantias.contador_bem();

	if (total_loops < 10) {
		total_limite = 0;
	} else {
		total_limite = total_loops - 10;
	}

	for (var i=total_loops; i > total_limite; i--) {
		index_aux = i - 1;
		rest_index_of = query_index.indexOf("|" + index_aux + "=");
		if (rest_index_of >= 0 || query_index == "*") {
			rest_index_of2 = query_index.indexOf("|", rest_index_of + 1)
			alocacao_do_bem_arr = query_index.substring(rest_index_of + 1, rest_index_of2).split("=");

			txt = gestao_garantias.bens(i - 1);
			arr = txt.toString().split(",");

			tipo = web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '').substring(0, 1);
			tipo_aux = retorna_descricao_tipo(tipo);

			index_aux = i - 1;
			valor_bem_aux = formata_valor_descida(arr[2], false); // / 100;
			//valor_bem_aux = valor_bem_aux.format(2, 3, '.', ',');
			//bens_html_conteudo = bens_html_conteudo + "<tr><td>" + tipo_aux + "</td><td>" + web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '').substring(1, 300) + "</td><td align=\"right\">" + valor_bem_aux + "</td>";
			//if (query_index != "*")
			//	bens_html_conteudo = bens_html_conteudo + "<td align=\"right\">" + alocacao_do_bem_arr[1] + "</td>";
			//bens_html_conteudo = bens_html_conteudo + "<td><img class=\"icon_aux\" src=\"js_aux/select.png\" alt=\"\" id=\"btn-alterar-bem\" index_bem=\"" + index_aux + "\" valor_bem=\"" + valor_bem_aux + "\" tipo_bem=\"" + tipo_aux + "\" codigo_bem=\"" + web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '').substring(1, 300) + "\" index_garantia=\"" + index_garantia + "\" valor_garantia=\"" + valor + "\" codigo_garantia=\"" + codigo + "\" width=\"20\" height=\"20\" style=\"cursor: hand;\" /></td></tr>";

			//bens_html_conteudo = bens_html_conteudo + "<tr><td>" + tipo_aux + "</td><td>" + web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '').substring(1, 300) + "</td><td align=\"right\">" + valor_bem_aux + "</td>";

			codigo_aux = web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '').substring(1, 300);


			if (query_index != "*") { //Exibe o % de alocação do bem
				//bens_html_conteudo = bens_html_conteudo + 	'<div href="#" id="btn-alterar-bem" index_bem="' + index_aux + '" valor_bem="' + valor_bem_aux + '" tipo_bem="' + tipo_aux + '" codigo_bem="' + web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '').substring(1, 300) + '" index_garantia="' + index_garantia + '" valor_garantia="' + valor + '" codigo_garantia="' + codigo + '" class="ui-btn ui-corner-all ui-icon-carat-r ui-btn-icon-right ui-shadow ui-mini" style="width:85%; margin:10px auto;">';
				bens_html_conteudo = bens_html_conteudo + 	'<div href="#" id="btn-alterar-bem" index_bem="' + index_aux + '" valor_bem="' + valor_bem_aux + '" tipo_bem="' + tipo_aux + '" codigo_bem="' + web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '').substring(1, 300) + '" index_garantia="' + index_garantia + '" valor_garantia="' + valor + '" codigo_garantia="' + codigo + '" class="ui-btn ui-corner-all ui-shadow ui-mini" style="width:85%; margin:10px auto;">';
				bens_html_conteudo = bens_html_conteudo + 		'<div style="display:inline-block; width:50%; text-align:left;">';
				bens_html_conteudo = bens_html_conteudo + 			'<div style="width:100%; text-align:left;">' + codigo_aux +'</div>';
				bens_html_conteudo = bens_html_conteudo + 			'<div style="width:100%; text-align:left; font-size:0.6em;">' + tipo_aux + '</div>';
				bens_html_conteudo = bens_html_conteudo + 		'</div>';
				bens_html_conteudo = bens_html_conteudo + 		'<div style="display:inline-block; width:5%;  text-align:left;  vertical-align:top; margin-top:5px;">R$</div>';
				bens_html_conteudo = bens_html_conteudo + 		'<div style="display:inline-block; width:45%; text-align:right; vertical-align:top; margin-top:5px;">' + valor_bem_aux + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>';
				bens_html_conteudo = bens_html_conteudo + 	'</div>';
			} else { //Exibe sem o % de alocação do bem
				bens_html_conteudo = bens_html_conteudo + '<div href="#" id="btn-alterar-bem" index_bem="' + index_aux + '" valor_bem="' + valor_bem_aux + '" tipo_bem="' + tipo_aux + '" codigo_bem="' + web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '').substring(1, 300) + '" index_garantia="' + index_garantia + '" valor_garantia="' + valor + '" codigo_garantia="' + codigo + '" class="ui-btn ui-corner-all ui-icon-carat-r ui-btn-icon-right ui-shadow ui-mini" style="width:85%; margin:10px auto;"><div style="display:inline-block; width:50%; text-align:left;"><div style="width:100%; text-align:left;">' + codigo_aux +'</div><div style="width:100%; text-align:left; font-size:0.6em;">' + tipo_aux + '</div></div><div style="display:inline-block; width:5%;  text-align:left;  vertical-align:top; margin-top:5px;">R$</div><div style="display:inline-block; width:45%; text-align:right; vertical-align:top; margin-top:5px;">' + valor_bem_aux + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></div>';
				//bens_html_conteudo = bens_html_conteudo + '<div href="#" id="btn-alterar-bem" index_bem="' + index_aux + '" valor_bem="' + valor_bem_aux + '" tipo_bem="' + tipo_aux + '" codigo_bem="' + web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '').substring(1, 300) + '" index_garantia="' + index_garantia + '" valor_garantia="' + valor + '" codigo_garantia="' + codigo + '" class="ui-btn ui-corner-all ui-shadow ui-mini" style="width:85%; margin:10px auto;"><div style="display:inline-block; width:50%; text-align:left;"><div style="width:100%; text-align:left;">' + codigo_aux +'</div><div style="width:100%; text-align:left; font-size:0.6em;">' + tipo_aux + '</div></div><div style="display:inline-block; width:5%;  text-align:left;  vertical-align:top; margin-top:5px;">R$</div><div style="display:inline-block; width:45%; text-align:right; vertical-align:top; margin-top:5px;">' + valor_bem_aux + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></div>';
			}





			//bens_html_conteudo = bens_html_conteudo + '<div href="#" id="btn-alterar-bem" index_bem="' + index_aux + '" valor_bem="' + valor_bem_aux + '" tipo_bem="' + tipo_aux + '" codigo_bem="' + web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '').substring(1, 300) + '" index_garantia="' + index_garantia + '" valor_garantia="' + valor + '" codigo_garantia="' + codigo + '" class="ui-btn ui-corner-all ui-icon-carat-r ui-btn-icon-right ui-shadow ui-mini" style="width:85%; margin:10px auto;"><div style="display:inline-block; width:35%; text-align:left;">' + tipo_aux + '</div><div style="display:inline-block; width:30%; text-align:left;">' + codigo_aux +'</div><div style="display:inline-block; width:5%; text-align:left;">R$</div><div style="display:inline-block; width:30%; padding-right:30px; text-align:right;">' + valor_bem_aux + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>';

			//if (query_index != "*")
			//	bens_html_conteudo = bens_html_conteudo + "<td align=\"right\">" + alocacao_do_bem_arr[1] + "</td>";
			//bens_html_conteudo = bens_html_conteudo + "<td><img class=\"icon_aux\" src=\"js_aux/select.png\" alt=\"\" id=\"btn-alterar-bem\" index_bem=\"" + index_aux + "\" valor_bem=\"" + valor_bem_aux + "\" tipo_bem=\"" + tipo_aux + "\" codigo_bem=\"" + web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '').substring(1, 300) + "\" index_garantia=\"" + index_garantia + "\" valor_garantia=\"" + valor + "\" codigo_garantia=\"" + codigo + "\" width=\"20\" height=\"20\" style=\"cursor: hand;\" /></td></tr>";

			bens_html_conteudo = bens_html_conteudo + '</div>';
		}
	}

	if (bens_html_conteudo != "") {
		bens_html = bens_html + "<br /><b class=\"title\">Listagem de Bens e Direitos</b>";
		//bens_html = bens_html + "colocar filtro<br>";
		//bens_html = bens_html + "diminuir a letra na tabela";
		//bens_html = bens_html + "<table class=\"lista\">";
		//bens_html = bens_html + "<tr><th width=\"15%\">Tipo</th><th width=\"30%\">C&oacute;digo</th><th width=\"30%\">Valor (R$)</th>";
		//if (query_index != "*")
		//		bens_html = bens_html + "<th width=\"30%\">Aloc. (%)</td>";
		//bens_html = bens_html + "<td width=\"25%\"></th></tr>";
		bens_html = bens_html + bens_html_conteudo;
		//bens_html = bens_html + "</table>";
	} else {
		bens_html = bens_html + "<br /><table class=\"lista\"><tr><td style=\"border: none;\">N&atilde;o foram encontrados bens ou direitos associados a essa garantia.</td></tr></table>";
	}

	return bens_html.replace(/[^\x20-\x7E]+/g, '');
}

function listarAssociacao_Index(query_index_garantia) {
	var total_loops; // = 15;
	total_loops_bens = parseInt(gestao_garantias.contador_bem());
	total_loops = parseInt(gestao_garantias.contador_associacao());

	resultado_bens = "";

	var arr_percent_bens = new Array(total_loops_bens + 10);
	for (var i=0; i < arr_percent_bens.length; i++)
		arr_percent_bens[i] = 0;


	for (var i=total_loops; i > 0; i--) {
		txt = gestao_garantias.associacoes(i - 1);
		arr = txt.toString().split(",");

		index_garantia = parseInt(web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '').substring(1, 300));
		//index_bem = parseInt(arr[1]);
		if (index_garantia == parseInt(query_index_garantia)) {
			index_bem = parseInt(arr[1]);
			arr_percent_bens[index_bem] += parseInt(arr[2]);
		}
	}

	for (var i=0; i < arr_percent_bens.length; i++) {
		if (arr_percent_bens[i] > 0) {
			resultado_bens = resultado_bens + "|" + i + "=" +  arr_percent_bens[i] + "|";
		}
	}

	return resultado_bens;
}

function atualizar_links_garantia() {
	$( "div#btn-alterar-garantia" ).each(function(index) {
	//$( "img#btn-alterar-garantia" ).each(function(index) {
		$(this).click(function() {
			index_garantia = $(this).attr('index');

			txt = gestao_garantias.garantias(index_garantia);
			arr = txt.toString().split(",");

			var codigo_aux = web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '') + "";
			arr_codigo = codigo_aux.toString().split(" ");

			codigo_aux = codigo_aux.replace(node + " ", "");

			valor_aux = formata_valor_descida(arr[1], false) ;// + ",00");
			//valor_aux = valor_aux / 100;
			//valor_aux = valor_aux.format(2, 3, '.', ',');
			//valor_aux = valor_aux.toString().replace('.','');

			valor_at_aux = formata_valor_descida(arr[2], true); // + ",00");
			//valor_at_aux = valor_at_aux / 100;
			//valor_at_aux = valor_at_aux.format(2, 3, '.', ',');
			//valor_at_aux = valor_at_aux.toString().replace('.',"");

			$("input#index_garantia_alt").val(index_garantia);
			$("span#codigo_garantia_alt").html(codigo_aux);
			$("span#valor_garantia_alt").html(valor_aux);
			$("input#valor_atualizado_garantia_alt").val(valor_at_aux);

			$("#controle_lista_eventos").hide();
			$("#sub-menu-garantia").show();
			$("#sub-menu-bem").hide();
			$("#master-container").show();
			$("#incluir_garantia").hide();
			$("#alterar_garantia").show();
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
	});

	//$("#codigo_garantia_associacao_pesquisa").val("");
}

function atualizar_links_garantia_pesq(titulo) {
	$("#btn-pesquisar-garantia").click(function() {
		query = $("#codigo_garantia_pesquisa").val().toString().trim();

		if (query.length >= 3) {
			html_lista_garantia = listarGarantiasAssociacao(titulo, 0, query);
			$("#consultar_garantia").html(html_lista_garantia);

			atualizar_links_garantia();
			atualizar_links_garantia_pesq();
		} else {
			alert("Preencha o campo de pesquisa com ao menos 3 caracteres.");
		}
	});
}

function atualizar_links_bem() {
	//$( "img#btn-alterar-bem" ).each(function(index) {
	$( "div#btn-alterar-bem" ).each(function(index) {
		$(this).click(function() {

			index_bem = $(this).attr('index');

			txt = gestao_garantias.bens(index_bem);
			arr = txt.toString().split(",");

			codigo_aux = web3_node1.toAscii(arr[0]).substring(1, 300).replace(/[^\x20-\x7E]+/g, '')

			tipo = web3_node1.toAscii(arr[0]).replace(/[^\x20-\x7E]+/g, '').substring(0, 1);

			valor_aux = formata_valor_descida(arr[1], false); // / 100;
			valor_atualizado_aux = formata_valor_descida(arr[2], true); // / 100;
			//valor_aux = valor_aux.format(2, 3, '.', ',');

			$("#tipo_bem_alt").html(retorna_descricao_tipo(tipo));
			$("#codigo_bem_alt").html(codigo_aux);
			$("#valor_bem_alt").html(valor_aux);
			$("#valor_atualizado_bem_alt").val(valor_atualizado_aux);
			$("#index_bem_alt").val(index_bem);

			$("#controle_lista_eventos").hide();
			$("#sub-menu-garantia").hide();
			$("#sub-menu-bem").show();
			$("#master-container").show();
			$("#incluir_garantia").hide();
			$("#alterar_garantia").hide();
			$("#consultar_garantia").hide();
			$("#incluir_bem").hide();
			$("#alterar_bem").show();
			$("#consultar_bem").hide();
			$("#associacao_garantia_consultar").hide();
			$("#associacao_bem_consultar").hide();
			$("#associacao_garantia_incluir").hide();
			$("#associacao_bem").hide();
			$("#associacao_confirmar").hide();

		});
	});
}

function atualizar_links_bem_pesq() {
	$("#btn-pesquisar-bens").click(function() {
		query = $("#codigo_bem_pesquisa").val().toString().trim();

		if (query.length >= 3) {
			html_lista_bens = listarBens(0, query);
			$("#consultar_bem").html(html_lista_bens);

			atualizar_links_bem();
			atualizar_links_bem_pesq();
		} else {
			alert("Preencha o campo de pesquisa com ao menos 3 caracteres.");
		}
	});
}


function atualizar_links_garantia_associacao(titulo) {
	//$( "img#btn-consultar-garantia-associacao" ).each(function(index) {
	$( "div#btn-consultar-garantia-associacao" ).each(function(index) {
		$(this).click(function() {
			$("#associacao_bem_consultar").hide();

			var valor = $(this).attr('valor');
			var codigo = $(this).attr('codigo');
			var index_garantia = $(this).attr('index_garantia');

			$( "#associacao_bem_consultar_codigo" ).html(codigo);
			$( "#valor_exibicao" ).html(valor);
			$( "#index_garantia_desalocacao" ).val(index_garantia);

			html_listarBensAssociacao = listarBensAssociacao(0, listarAssociacao_Index(index_garantia), index_garantia, codigo, valor);
			$( "#associacao_bem_consultar_conteudo" ).html(html_listarBensAssociacao);
			html_listarBensAssociacao_atualizar_link();

			//desalocar_associacao_btn

			$("#controle_lista_eventos").hide();
			$("#sub-menu-garantia").hide();
			$("#sub-menu-bem").hide();
			$("#master-container").show();
			$("#incluir_garantia").hide();
			$("#alterar_garantia").hide();
			$("#consultar_garantia").hide();
			$("#incluir_bem").hide();
			$("#alterar_bem").hide();
			$("#consultar_bem").hide();
			$("#associacao_garantia_consultar").hide();
			$("#associacao_bem_consultar").show();
			$("#associacao_garantia_incluir").hide();
			$("#associacao_bem").hide();
			$("#associacao_confirmar").hide();
		});
	});

	//atualizar_links_garantia_associacao_pesq(titulo);
}


function html_listarBensAssociacao_atualizar_link() {
	$( "#desalocar_associacao_btn" ).click(function() {
		$("#associacao_bem_consultar").hide();

		var codigo_garantia = $("#associacao_bem_consultar_codigo").html().toString();

		var index_garantia_desalocacao = "a" + $("#index_garantia_desalocacao").val().toString();

		gestao_garantias.liberar_bem_e_direito.sendTransaction(index_garantia_desalocacao, 0, 0, {
		from: web3_node1.eth.coinbase, gas: 2500000 }, function(err, txHash) {
				if (err != null) {
					//alert("Erro: " + err.message);
				} else {
					arrTransacoes.push(txHash + "|false|Liberação de Bem/Direito|||" + codigo_garantia);
					alert("Em andamento a minera&ccedil;&atilde;o da libera&ccedil;&atilde;o dos bens e direitos.");
				}
				lockAccount();
			}
		);


		$("#controle_lista_eventos").hide();
		$("#sub-menu-garantia").hide();
		$("#sub-menu-bem").hide();
		$("#sub-menu-associacao").show();
		$("#master-container").hide();
		$("#incluir_garantia").hide();
		$("#alterar_garantia").hide();
		$("#consultar_garantia").hide();
		$("#incluir_bem").hide();
		$("#alterar_bem").hide();
		$("#consultar_bem").hide();
		$("#associacao_garantia_consultar").hide();
		$("#associacao_bem_consultar").show();
		$("#associacao_garantia_incluir").hide();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	//atualizar_links_garantia_associacao_pesq(titulo);
}

function atualizar_links_garantia_associacao_pesq(titulo) {
	$("#btn-pesquisar-garantia-associacao").click(function() {
		query = $("#codigo_garantia_associacao_pesquisa").val().toString().trim();

		if (query.length >= 3) {
			html_lista_garantia_associacao = listarGarantiasAssociacao(titulo, 0, query);
			$("#associacao_garantia_consultar").html(html_lista_garantia_associacao);

			atualizar_links_garantia_associacao(titulo);
			atualizar_links_garantia_associacao_pesq(titulo);
		} else {
			alert("Preencha o campo de pesquisa com ao menos 3 caracteres.");
		}
	});
}

function atualizar_links_selecionar_garantia() {
	//$( "img#btn-consultar-garantia-associacao" ).each(function(index) {
	$( "div#btn-consultar-garantia-associacao" ).each(function(index) {
		$(this).click(function() {
			var valor = $(this).attr('valor');
			var codigo = $(this).attr('codigo');
			var index = $(this).attr('index_garantia');

			html_listarBensAssociacao = listarBensAssociacao(0, "*", index, codigo.replace(/[^\x20-\x7E]+/g, ''), valor.replace(/[^\x20-\x7E]+/g, ''));
			$( "#associacao_bem" ).html(html_listarBensAssociacao);
			atualizar_links_selecionar_bem();

			$("#controle_lista_eventos").hide();
			$("#sub-menu-garantia").hide();
			$("#sub-menu-bem").hide();
			$("#master-container").show();
			$("#incluir_garantia").hide();
			$("#alterar_garantia").hide();
			$("#consultar_garantia").hide();
			$("#incluir_bem").hide();
			$("#alterar_bem").hide();
			$("#consultar_bem").hide();
			$("#associacao_garantia_consultar").hide();
			$("#associacao_bem_consultar").hide();
			$("#associacao_garantia_incluir").hide();
			$("#associacao_bem").show();
			$("#associacao_confirmar").hide();
		});
	});
}

function atualizar_links_selecionar_garantia_pesq(titulo) {
	$("#btn-pesquisar-garantia-associacao").click(function() {
		query = $("#codigo_garantia_associacao_pesquisa").val().toString().trim();

		if (query.length >= 3) {
			html_lista_garantia_associacao = listarGarantiasAssociacao(titulo, 0, query);
			$("#associacao_garantia_incluir").html(html_lista_garantia_associacao);

			atualizar_links_selecionar_garantia(titulo);
			atualizar_links_selecionar_garantia_pesq(titulo);
		} else {
			alert("Preencha o campo de pesquisa com ao menos 3 caracteres.");
		}
	});
}

function atualizar_links_selecionar_bem() {
	//$( "img#btn-alterar-bem" ).each(function(index) {
	$( "div#btn-alterar-bem" ).each(function(index) {
		$(this).click(function() {
			var index_bem = $(this).attr('index_bem');
			$("#index_h_bem").val(index_bem);

			var valor_bem = $(this).attr('valor_bem');
			$("#associacao-confirmar-bem-valor").html(valor_bem);

			var tipo_bem = $(this).attr('tipo_bem');
			$("#associacao-confirmar-bem-tipo").html(tipo_bem);

			var codigo_bem = $(this).attr('codigo_bem');
			$("#associacao-confirmar-bem-codigo").html(codigo_bem);

			var index_garantia = $(this).attr('index_garantia');
			$("#index_h_garantia").val(index_garantia);

			var valor_garantia = $(this).attr('valor_garantia');
			$("#associacao-confirmar-garantia-valor").html(valor_garantia);

			var codigo_garantia = $(this).attr('codigo_garantia');
			$("#associacao-confirmar-garantia-codigo").html(codigo_garantia);

			$("#controle_lista_eventos").hide();
			$("#sub-menu-garantia").hide();
			$("#sub-menu-bem").hide();
			$("#master-container").show();
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
			$("#associacao_confirmar").show();
		});
	});
}

function unlockAccount() {
	//web3_node1.personal.unlockAccount(web3_node1.eth.accounts[0], "123mudar");
}

function lockAccount() {
	//web3_node1.personal.lockAccount(web3_node1.eth.accounts[0]);
}

function entrar() {
	usuario = $("#usuario").val();
	senha = $("#senha").val();
	
	if (usuario != "" && senha != "") {
		if (usuario == "Accenture" && senha == "ceg99455") {
			$("#login").hide();
			$("#master-container").show();
		}
	}
}

function main() {
	document.title = config[1].Nodes[numero_banco].tituloU + " (" + VERSAO + ")";
	$("#titulo").html(config[1].Nodes[numero_banco].titulo);

	setInterval(function () {exibir_mensagem("")}, 2000);


	//web3_node1.filter.watch(function(error, result){
	//if (!error)
	//	result = result;
	//});

	//web3_node1.eth.watch().changed(function(){
	//	var eee = 0;
	//	eee = 1;
	//});


	$('#valor_garantia').number( true, 2 , ',', '.');
	//$('#valor_garantia_alt').number( true, 2 , ',', '.');
	$('#valor_atualizado_garantia_alt').number( true, 2 , ',', '.');
	$('#valor_bem').number( true, 2 , ',', '.');
	//$('#valor_bem_alt').number( true, 2 , ',', '.');
	$('#valor_atualizado_bem_alt').number( true, 2 , ',', '.');
	$('#percent_bem').number( true, 0 );

	$("#div-slider-sobra").change(function() {
		var slider_value = $("#slider-range-max-sobra").val();
		$( "span#limite_sobra" ).html( slider_value + "%" );
		var sobra_html = listar_sobre_falta("", "sobra", slider_value, 0);
		$("#controle_sobra_conteudo").html(sobra_html);
	});

	$("#div-slider-falta").change(function() {
		var slider_value = $("#slider-range-max-falta").val();
		$( "span#limite_falta" ).html( slider_value + "%" );
		var falta_html = listar_sobre_falta("", "falta", 0, slider_value);
		$("#controle_falta_conteudo").html(falta_html);
	});


	for (var b = 0;b < config[2].Tipo_Bens.length; b++) {
		if (config[2].Tipo_Bens[b].codigo != "z")
			$('#tipo_bem').append($('<option>', {
				value: config[2].Tipo_Bens[b].codigo,
				text : config[2].Tipo_Bens[b].descricaoU
			}));
	}

	$('#tipo_bem').on('change', function (e) {
		//var optionSelected = $("option:selected", this);
		var valueSelected = this.value;

		for (var b = 0;b < config[2].Tipo_Bens.length; b++) {
			if (config[2].Tipo_Bens[b].codigo == valueSelected) {
				$('#codigo_bem').attr('style', 'color: #CCC;')
				$('#codigo_bem').val(config[2].Tipo_Bens[b].label);
				codigo_informado = false;
			}
		}

	});

	$('#codigo_bem').focusin(function (e) {
		$('#codigo_bem').attr('style', 'color: #000;');
		$('#codigo_bem').val("");
		codigo_informado = true;
	});

	$( "#menu-controle" ).click(function() {
		$("#controle_sobra_falta").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-garantia").hide();
		$("#sub-menu-bem").hide();
		$("#sub-menu-controle").show();
		$("#master-container").hide();
		$("#incluir_garantia").hide();
		$("#alterar_garantia").hide();
		$("#consultar_garantia").hide();
		$("#incluir_bem").hide();
		$("#alterar_bem").hide();
		$("#consultar_bem").hide();
		$("#sub-menu-associacao").hide();
		$("#associacao_garantia_consultar").hide();
		$("#associacao_bem_consultar").hide();
		$("#associacao_garantia_incluir").hide();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	$( "#sub-menu-transacoes" ).click(function() {
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").show();
		$("#controle_lista_eventos").show();
		$("#sub-menu-garantia").hide();
		$("#sub-menu-bem").hide();
		$("#master-container").show();
		$("#incluir_garantia").hide();
		$("#alterar_garantia").hide();
		$("#consultar_garantia").hide();
		$("#incluir_bem").hide();
		$("#alterar_bem").hide();
		$("#consultar_bem").hide();
		$("#sub-menu-associacao").hide();
		$("#associacao_garantia_consultar").hide();
		$("#associacao_bem_consultar").hide();
		$("#associacao_garantia_incluir").hide();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	$( "#sub-menu-sobra" ).click(function() {

		sobra_falta_html = listar_sobre_falta("", "sobra", $("#slider-range-max-sobra").val(), 0);
		$("#controle_sobra_conteudo").html(sobra_falta_html);
		//sobra_falta_html_atualizar_links();

		$("#controle_sobra").show();
		$("#controle_falta").hide();
		$("#sub-menu-controle").show();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-garantia").hide();
		$("#sub-menu-bem").hide();
		$("#master-container").show();
		$("#incluir_garantia").hide();
		$("#alterar_garantia").hide();
		$("#consultar_garantia").hide();
		$("#incluir_bem").hide();
		$("#alterar_bem").hide();
		$("#consultar_bem").hide();
		$("#sub-menu-associacao").hide();
		$("#associacao_garantia_consultar").hide();
		$("#associacao_bem_consultar").hide();
		$("#associacao_garantia_incluir").hide();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	$( "#sub-menu-falta" ).click(function() {

		sobra_falta_html = listar_sobre_falta("", "falta", 0, $("#slider-range-max-falta").val());
		$("#controle_falta_conteudo").html(sobra_falta_html);
		//sobra_falta_html_atualizar_links();

		$("#controle_sobra").hide();
		$("#controle_falta").show();
		$("#sub-menu-controle").show();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-garantia").hide();
		$("#sub-menu-bem").hide();
		$("#master-container").show();
		$("#incluir_garantia").hide();
		$("#alterar_garantia").hide();
		$("#consultar_garantia").hide();
		$("#incluir_bem").hide();
		$("#alterar_bem").hide();
		$("#consultar_bem").hide();
		$("#sub-menu-associacao").hide();
		$("#associacao_garantia_consultar").hide();
		$("#associacao_bem_consultar").hide();
		$("#associacao_garantia_incluir").hide();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	$( "#menu-garantia" ).click(function() {
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-garantia").show();
		$("#sub-menu-bem").hide();
		$("#master-container").hide();
		$("#incluir_garantia").hide();
		$("#alterar_garantia").hide();
		$("#consultar_garantia").hide();
		$("#incluir_bem").hide();
		$("#alterar_bem").hide();
		$("#consultar_bem").hide();
		$("#sub-menu-associacao").hide();
		$("#associacao_garantia_consultar").hide();
		$("#associacao_bem_consultar").hide();
		$("#associacao_garantia_incluir").hide();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	$( "#sub-menu-garantia-consultar" ).click(function() {
		$("#consultar_garantia").hide();
		$("#consultar_garantia").html("");

		html_lista_garantia = listarGarantias(0, "");
		$("#consultar_garantia").html(html_lista_garantia);
		atualizar_links_garantia();
		atualizar_links_garantia_pesq();

		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-garantia").show();
		$("#sub-menu-bem").hide();
		$("#master-container").show();
		$("#incluir_garantia").hide();
		$("#alterar_garantia").hide();
		$("#consultar_garantia").show();
		$("#incluir_bem").hide();
		$("#alterar_bem").hide();
		$("#consultar_bem").hide();
		$("#sub-menu-associacao").hide();
		$("#associacao_garantia_consultar").hide();
		$("#associacao_bem_consultar").hide();
		$("#associacao_garantia_incluir").hide();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	$( "#sub-menu-garantia-incluir" ).click(function() {
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-garantia").show();
		$("#sub-menu-bem").hide();
		$("#master-container").show();
		$("#incluir_garantia").show();
		$("#alterar_garantia").hide();
		$("#consultar_garantia").hide();
		$("#incluir_bem").hide();
		$("#alterar_bem").hide();
		$("#consultar_bem").hide();
		$("#sub-menu-associacao").hide();
		$("#associacao_garantia_consultar").hide();
		$("#associacao_bem_consultar").hide();
		$("#associacao_garantia_incluir").hide();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	$( "#incluir_garantia_btn" ).click(function() {
		var codigo_digitado = $("#codigo_garantia").val().toString()
		var codigo_garantia = node + " " + codigo_digitado;
		var valor_garantia = $("#valor_garantia").val().toString();

		if (valor_garantia.trim().length == 0) {
			alert("O valor informado &eacute; inv&aacute;lido")
			return;
		}

		valor_garantia = formata_valor_subida(valor_garantia);
		//valor_garantia = valor_garantia.replace(".","").replace(",","");

		if (codigo_digitado.trim().length == 0) {
			alert("O c&oacute;digo informado &eacute; inv&aacute;lido")
			return;
		}

		$("#codigo_garantia").val("");
		$("#valor_garantia").val("");

		var aux_valor = parseInt(valor_garantia)

		//for (var i = 0; i < 60; i++) {
			//aux_valor = parseInt(aux_valor) + i

			unlockAccount();

			//gestao_garantias.incluir_garantia.sendTransaction('a', 0, {
			gestao_garantias.incluir_garantia.sendTransaction(codigo_garantia.toString(), aux_valor, {
			from: web3_node1.eth.coinbase, gas: 2500000 }, function(err, txHash) {
					if (err != null) {
						//alert("Erro: " + err.message);
					} else {
						arrTransacoes.push(txHash + "|false|Inclus&atilde;o de Garantia|||" + codigo_digitado);
						alert("Em andamento a minera&ccedil;&atilde;o da nova Garantia");
					}
					lockAccount();
				}
			);
		//}
	});

	$( "#alterar_garantia_btn" ).click(function() {

		var index_garantia_alt = $("#index_garantia_alt").val().toString();
		//var codigo_garantia = node + " " + $("#codigo_garantia_alt").val().toString();
		var valor_atualizado_garantia_alt = $("#valor_atualizado_garantia_alt").val().toString();

		//if (valor_garantia.indexOf(",") == -1)
		//	valor_garantia = valor_garantia + ",00";

		if (valor_atualizado_garantia_alt.trim().length == 0) {
			alert("O valor atualizado &eacute; inv&aacute;lido");
			return;
		}

		valor_atualizado_garantia_alt = formata_valor_subida(valor_atualizado_garantia_alt);

		$("#codigo_garantia_alt").val("");
		$("#valor_garantia_alt").val("");
		$("#valor_atualizado_garantia_alt").val("");

		var aux_valor = parseInt(valor_atualizado_garantia_alt)

		unlockAccount();

		//gestao_garantias.incluir_garantia.sendTransaction('a', 0, {
		gestao_garantias.alterar_garantia.sendTransaction(parseInt(index_garantia_alt), aux_valor, {
		from: web3_node1.eth.coinbase, gas: 2500000 }, function(err, txHash) {
				if (err != null) {
					//alert("Erro: " + err.message);
				} else {
					arrTransacoes.push(txHash + "|false|Altera&ccedil;&atilde;o de Garantia|||" + codigo_garantia.toString());
					alert("Em andamento a minera&ccedil;&atilde;o da altera&ccedil;&atilde;o da Garantia");
				}
				lockAccount();
			}
		);
	});

	$( "#menu-bem" ).click(function() {
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-garantia").hide();
		$("#sub-menu-bem").show();
		$("#master-container").hide();
		$("#incluir_garantia").hide();
		$("#alterar_garantia").hide();
		$("#consultar_garantia").hide();
		$("#incluir_bem").hide();
		$("#alterar_bem").hide();
		$("#consultar_bem").hide();
		$("#sub-menu-associacao").hide();
		$("#associacao_garantia_consultar").hide();
		$("#associacao_bem_consultar").hide();
		$("#associacao_garantia_incluir").hide();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	$( "#sub-menu-bem-consultar" ).click(function() {
		$("#consultar_bem").hide();
		$("#consultar_bem").html("");

		html_lista_bem = listarBens(0, "");
		$("#consultar_bem").html(html_lista_bem);
		atualizar_links_bem();
		atualizar_links_bem_pesq();

		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-garantia").hide();
		$("#sub-menu-bem").show();
		$("#master-container").show();
		$("#incluir_garantia").hide();
		$("#alterar_garantia").hide();
		$("#consultar_garantia").hide();
		$("#incluir_bem").hide();
		$("#alterar_bem").hide();
		$("#consultar_bem").show();
		$("#sub-menu-associacao").hide();
		$("#associacao_garantia_consultar").hide();
		$("#associacao_bem_consultar").hide();
		$("#associacao_garantia_incluir").hide();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	$( "#sub-menu-bem-incluir" ).click(function() {
		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-garantia").hide();
		$("#sub-menu-bem").show();
		$("#master-container").show();
		$("#incluir_garantia").hide();
		$("#alterar_garantia").hide();
		$("#consultar_garantia").hide();
		$("#incluir_bem").show();
		$("#alterar_bem").hide();
		$("#consultar_bem").hide();
		$("#sub-menu-associacao").hide();
		$("#associacao_garantia_consultar").hide();
		$("#associacao_bem_consultar").hide();
		$("#associacao_garantia_incluir").hide();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	$( "#incluir_bem_btn" ).click(function() {
		var tipo_bem = $("#tipo_bem").val().toString() + "";
		tipo_bem = tipo_bem.toString().substring(0,1);
		var codigo_digitado = $("#codigo_bem").val().toString();
		var codigo_bem = tipo_bem + " " + codigo_digitado + "";
		//var valor_bem = $("#valor_bem").val().toString().replace(".","").replace(",","");

		var valor_bem = $("#valor_bem").val().toString();

		if (tipo_bem.length == 0) {
			alert("Favor selecionar o tipo do Bem/Direito");
			return;
		}

		if (codigo_digitado.trim().length == 0 || !codigo_informado) {
			alert("O c&oacute;digo informado &eacute; inv&aacute;lido");
			return;
		}

		if (valor_bem.trim().length == 0) {
			alert("O valor informado &eacute; inv&aacute;lido")
			return;
		}

		//if (valor_bem.indexOf(",") == -1)
		//	valor_bem = valor_bem + ",00";

		valor_bem = formata_valor_subida(valor_bem);
		//valor_bem = valor_bem.replace(".","").replace(",","");

		$("#codigo_bem").val("");
		$("#valor_bem").val("");
		$("#tipo_bem").val("");
		$("#tipo_bem")[0].selectedIndex = '0';
		$("#tipo_bem").selectmenu("refresh");
		codigo_informado = false;

		var aux_valor = parseInt(valor_bem);

		//for (var i = 0; i < 60; i++) {
		//	aux_valor = parseInt(valor_bem) + i
		//	tipo_bem = Math.floor((Math.random() * 5) + 0);
			//aux_valor = aux_valor * 100;

			unlockAccount();

			gestao_garantias.incluir_bem.sendTransaction(codigo_bem.toString(), aux_valor, parseInt(tipo_bem.toString()), {
			from: web3_node1.eth.coinbase, gas: 2500000 }, function(err, txHash) {
					if (err != null) {
						//alert("Erro: " + err.message);
					} else {
						arrTransacoes.push(txHash + "|false|Inclus&atilde;o de Bem/Direito|||" + codigo_digitado);
						alert("Em andamento a minera&ccedil;&atilde;o do novo Bem ou Direito");
					}
					lockAccount();
				}
			);
		//}
	});

	$( "#alterar_bem_btn" ).click(function() {
		var index_bem_alt = $("#index_bem_alt").val().toString();
		var valor_atualizado_bem_alt = $("#valor_atualizado_bem_alt").val().toString();

		if (valor_atualizado_bem_alt.trim().length == 0) {
			alert("O valor informado &eacute; inv&aacute;lido")
			return;
		}

		if (valor_atualizado_bem_alt <= 0) {
			alert("O valor atualizado informado &eacute; inv&aacute;lido");
			return;
		}

		valor_atualizado_bem_alt = formata_valor_subida(valor_atualizado_bem_alt);

		$("#valor_atualizado_bem_alt").val("");

		var aux_valor = parseInt(valor_atualizado_bem_alt);

		unlockAccount();

		codigo_bem_alt_aux = $("#codigo_bem_alt").html().toString();
		
		gestao_garantias.alterar_bem.sendTransaction(parseInt(index_bem_alt), aux_valor, {
		from: web3_node1.eth.coinbase, gas: 2500000 }, function(err, txHash) {
				if (err != null) {
					//alert("Erro: " + err.message);
				} else {
					arrTransacoes.push(txHash + "|false|Altera&ccedil;&atilde;o de Bem/Direito|||" + codigo_bem_alt_aux.trim());
					alert("Em andamento a minera&ccedil;&atilde;o da altera&ccedil;&atilde;o do Bem ou Direito");
				}
				lockAccount();
			}
		);
	});

	$( "#menu-associacao" ).click(function() {
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
		$("#sub-menu-associacao").show();
		$("#associacao_garantia_consultar").hide();
		$("#associacao_bem_consultar").hide();
		$("#associacao_garantia_incluir").hide();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	$( "#sub-menu-associacao-consultar" ).click(function() {
		$("#associacao_garantia_consultar").hide();
		$("#associacao_garantia_consultar").html("");

		var titulo = "Consulta";
		html_lista_garantia = listarGarantiasAssociacao(titulo, 0, "");
		$("#associacao_garantia_consultar").html(html_lista_garantia);
		atualizar_links_garantia_associacao(titulo);
		atualizar_links_garantia_associacao_pesq(titulo);

		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-garantia").hide();
		$("#sub-menu-bem").hide();
		$("#master-container").show();
		$("#incluir_garantia").hide();
		$("#alterar_garantia").hide();
		$("#consultar_garantia").hide();
		$("#incluir_bem").hide();
		$("#alterar_bem").hide();
		$("#consultar_bem").hide();
		$("#associacao_garantia_consultar").show();
		$("#associacao_bem_consultar").hide();
		$("#associacao_garantia_incluir").hide();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	//function atualizar_

	$( "#sub-menu-associacao-incluir" ).click(function() {
		var titulo = "Inclus&atilde;o"
		html_listarGarantiasAssociacao = listarGarantiasAssociacao(titulo, 0 , "")
		$("#associacao_garantia_incluir").html(html_listarGarantiasAssociacao);
		atualizar_links_selecionar_garantia();
		atualizar_links_selecionar_garantia_pesq(titulo);

		$("#percent_bem").val("100");

		/*
		$("btn-pesquisar-bens").click(function() {
			alert("btn-pesquisar-bens");
		});
		*/

		$("#controle_sobra").hide();
		$("#controle_falta").hide();
		$("#sub-menu-controle").hide();
		$("#controle_lista_eventos").hide();
		$("#sub-menu-garantia").hide();
		$("#sub-menu-bem").hide();
		$("#master-container").show();
		$("#incluir_garantia").hide();
		$("#alterar_garantia").hide();
		$("#consultar_garantia").hide();
		$("#incluir_bem").hide();
		$("#alterar_bem").hide();
		$("#consultar_bem").hide();
		$("#associacao_garantia_consultar").hide();
		$("#associacao_bem_consultar").hide();
		$("#associacao_garantia_incluir").show();
		$("#associacao_bem").hide();
		$("#associacao_confirmar").hide();
	});

	$("#incluir_associacao_btn").click(function() {
		index_garantia = "a" + $("#index_h_garantia").val().toString();
		index_bem = $("#index_h_bem").val().toString();
		percent_bem = $("#percent_bem").val().toString();
		cod_garantia = $("#associacao-confirmar-garantia-codigo").html().toString();

		if (parseInt(percent_bem) <= 0 || parseInt(percent_bem) > 100) {
			alert("O percentual de aloca&ccedil;&atilde;o deve est&aacute; entre 1% e 100%");
			return;
		}

		unlockAccount();

		gestao_garantias.incluir_associacao.sendTransaction(index_garantia.toString(), parseInt(index_bem), parseInt(percent_bem), {
		from: web3_node1.eth.coinbase, gas: 2500000 }, function(err, txHash) {
				if (err != null){
					//alert("Erro: " + err.message);
				} else {
					arrTransacoes.push(txHash + "|false|Inclus&atilde;o de Associa&ccedil;&atilde;o de Bem/Direito|||Garantia: " + cod_garantia.toString());
					alert("Em andamento a minera&ccedil;&atilde;o da nova aloca&ccedil;&atilde;o de Bem ou Direito");
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

	web3_node1.eth.filter({'max': 100, 'address': gestao_garantias.address});

	//event ReturnGarantia(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
	eventReturnGarantia = gestao_garantias.ReturnGarantia(function(error, result){
		if (!DEBUG) {
			//if (tx_tem_exibicao_pendente())
			//{
				if (error != null)
					registrarEvento("Inclus&atilde;o de Garantia", result.transactionHash, true, result, error, "", web3_node1.toAscii(result.args.codigo).replace(/[^\x20-\x7E]+/g, ''));
				else
					registrarEvento("Inclus&atilde;o de Garantia", result.transactionHash, !result.args.success, result, error, "", web3_node1.toAscii(result.args.codigo).replace(/[^\x20-\x7E]+/g, ''));
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
						mensagem = mensagem + "\n   descricao: " + web3_node1.toAscii(result.args.descricao).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   codigo_item_acessado: " + result.args.codigo_item_acessado;
						mensagem = mensagem + "\n   codigo: " + web3_node1.toAscii(result.args.codigo).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   valor: " + parseInt(result.args.valor) / 100;
						mensagem = mensagem + "\n";
						mensagem = mensagem + "\n   blockHash: " + result.blockHash;
						mensagem = mensagem + "\n   transactionHash: " + result.transactionHash;
					} else {
						mensagem = "";
						mensagem = mensagem + "Erro ao tentar incluir a garantia.";
						mensagem = mensagem + "\n   codigo_erro: " + result.args.codigo_erro;
						mensagem = mensagem + "\n   string_com_erro: " + web3_node1.toAscii(result.args.string_com_erro).replace(/[^\x20-\x7E]+/g, '');
					}

					alert(mensagem);
					tx_marcar_como_exibida(result.transactionHash);
				}
			}
		}
	});

	//event ReturnGarantiaAlt(int id_retorno, bytes32 descricao, bool success, uint32 codigo_item_acessado, bytes32 codigo, uint64 valor, bytes32 string_com_erro, int codigo_erro);
	eventReturnGarantia = gestao_garantias.ReturnGarantiaAlt(function(error, result){
		if (!DEBUG) {
			//if (tx_tem_exibicao_pendente())
			//{
				if (error != null)
					registrarEvento("Altera&ccedil;&atilde;o de Garantia", result.transactionHash, true, result, error, "", web3_node1.toAscii(result.args.codigo).replace(/[^\x20-\x7E]+/g, ''));
				else
					registrarEvento("Altera&ccedil;&atilde;o de Garantia", result.transactionHash, !result.args.success, result, error, "", web3_node1.toAscii(result.args.codigo).replace(/[^\x20-\x7E]+/g, ''));
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
						mensagem = mensagem + "\n   descricao: " + web3_node1.toAscii(result.args.descricao).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   codigo_item_acessado: " + result.args.codigo_item_acessado;
						mensagem = mensagem + "\n   codigo: " + web3_node1.toAscii(result.args.codigo).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   valor: " + parseInt(result.args.valor) / 100;
						mensagem = mensagem + "\n";
						mensagem = mensagem + "\n   blockHash: " + result.blockHash;
						mensagem = mensagem + "\n   transactionHash: " + result.transactionHash;
					} else {
						mensagem = "";
						mensagem = mensagem + "Erro ao tentar incluir a garantia.";
						mensagem = mensagem + "\n   codigo_erro: " + result.args.codigo_erro;
						mensagem = mensagem + "\n   string_com_erro: " + web3_node1.toAscii(result.args.string_com_erro).replace(/[^\x20-\x7E]+/g, '');
					}

					alert(mensagem);
					tx_marcar_como_exibida(result.transactionHash);
				}
			}
		}
	});

	//event ReturnBem(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
	eventReturnBem = gestao_garantias.ReturnBem(function(error, result){
		if (!DEBUG) {
			//if (tx_tem_exibicao_pendente())
			//{
				if (error != null)
					registrarEvento("Inclus&atilde;o de Bem / Direito", result.transactionHash, true, result, error, "", web3_node1.toAscii(result.args.codigo).replace(/[^\x20-\x7E]+/g, ''));
				else
					registrarEvento("Inclus&atilde;o de Bem / Direito", result.transactionHash, !result.args.success, result, error, "", web3_node1.toAscii(result.args.codigo).replace(/[^\x20-\x7E]+/g, ''));
			//}
		} else {
			if (error != null && tx_tem_exibicao_pendente() && DEBUG) {
				alert(error + " - " + result);
			} else {
				if (!tx_exibida(result.transactionHash) && tx_tem_exibicao_pendente()) {
					if (result.args.success) {
						mensagem = "";
						mensagem = mensagem + "Bem/Direito minerado com sucesso.";
						mensagem = mensagem + "\n   id_retorno: " + result.args.id_retorno;
						mensagem = mensagem + "\n   descricao: " + web3_node1.toAscii(result.args.descricao).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   codigo_item_acessado: " + result.args.codigo_item_acessado;
						mensagem = mensagem + "\n   codigo: " + web3_node1.toAscii(result.args.codigo).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   valor: " + parseInt(result.args.valor) / 100;
						mensagem = mensagem + "\n";
						mensagem = mensagem + "\n   blockHash: " + result.blockHash;
						mensagem = mensagem + "\n   transactionHash: " + result.transactionHash;
					} else {
						mensagem = "";
						mensagem = mensagem + "Erro ao tentar incluir o Bem/Direito.";
						mensagem = mensagem + "\n   codigo_erro: " + result.args.codigo_erro;
						mensagem = mensagem + "\n   string_com_erro: " + web3_node1.toAscii(result.args.string_com_erro).replace(/[^\x20-\x7E]+/g, '');
					}

					alert(mensagem);
					tx_marcar_como_exibida(result.transactionHash);
				}
			}
		}
	});


	//event ReturnBemAlt(int id_retorno, bytes32 descricao, bool success, uint32 codigo_item_acessado, bytes32 codigo, uint64 valor, bytes32 string_com_erro, int codigo_erro);
	eventReturnBem = gestao_garantias.ReturnBemAlt(function(error, result){
		if (!DEBUG) {
			//if (tx_tem_exibicao_pendente())
			//{
				if (error != null)
					registrarEvento("Altera&ccedil;&atilde;o de Bem / Direito", result.transactionHash, true, result, error, "", web3_node1.toAscii(result.args.codigo).replace(/[^\x20-\x7E]+/g, ''));
				else
					registrarEvento("Altera&ccedil;&atilde;o de Bem / Direito", result.transactionHash, !result.args.success, result, error, "", web3_node1.toAscii(result.args.codigo).replace(/[^\x20-\x7E]+/g, ''));
			//}
		} else {
			if (error != null && tx_tem_exibicao_pendente() && DEBUG) {
				alert(error + " - " + result);
			} else {
				if (!tx_exibida(result.transactionHash) && tx_tem_exibicao_pendente()) {
					if (result.args.success) {
						mensagem = "";
						mensagem = mensagem + "Bem/Direito minerado com sucesso.";
						mensagem = mensagem + "\n   id_retorno: " + result.args.id_retorno;
						mensagem = mensagem + "\n   descricao: " + web3_node1.toAscii(result.args.descricao).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   codigo_item_acessado: " + result.args.codigo_item_acessado;
						mensagem = mensagem + "\n   codigo: " + web3_node1.toAscii(result.args.codigo).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   valor: " + parseInt(result.args.valor) / 100;
						mensagem = mensagem + "\n";
						mensagem = mensagem + "\n   blockHash: " + result.blockHash;
						mensagem = mensagem + "\n   transactionHash: " + result.transactionHash;
					} else {
						mensagem = "";
						mensagem = mensagem + "Erro ao tentar incluir o Bem/Direito.";
						mensagem = mensagem + "\n   codigo_erro: " + result.args.codigo_erro;
						mensagem = mensagem + "\n   string_com_erro: " + web3_node1.toAscii(result.args.string_com_erro).replace(/[^\x20-\x7E]+/g, '');
					}

					alert(mensagem);
					tx_marcar_como_exibida(result.transactionHash);
				}
			}
		}
	});


	//event ReturnAssociacao(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 id_garantia, uint id_bem, uint percentual, bytes32 string_com_erro, int valor_erro);
	eventReturnAssociacao = gestao_garantias.ReturnAssociacao(function(error, result){
		if (!DEBUG) {
			//if (tx_tem_exibicao_pendente())
			//{
				if (error != null) {
					registrarEvento("Associa&ccedil;&atilde;o de Bem/Direito", result.transactionHash, true, result, error, "", "");
				} else {
					registrarEvento("Associa&ccedil;&atilde;o de Bem/Direito", result.transactionHash, !result.args.success, result, error, "", "");
				}
			//}
		} else {
			if (error != null && tx_tem_exibicao_pendente() && DEBUG) {
				alert(error + " - " + result);
			} else {
				if (!tx_exibida(result.transactionHash) && tx_tem_exibicao_pendente()) {
					if (result.args.success) {
						mensagem = "";
						mensagem = mensagem + "Associação minerada com sucesso.";
						mensagem = mensagem + "\n   id_retorno: " + result.args.id_retorno;
						mensagem = mensagem + "\n   descricao: " + web3_node1.toAscii(result.args.descricao).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   codigo_item_acessado: " + result.args.codigo_item_acessado;
						mensagem = mensagem + "\n   id_garantia: " + web3_node1.toAscii(result.args.id_garantia).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   id_bem: " + result.args.id_bem;
						mensagem = mensagem + "\n   percentual: " + result.args.percentual;
						mensagem = mensagem + "\n   total_percent_aloc_bem: " + result.args.total_percent_aloc_bem;
						mensagem = mensagem + "\n";
						mensagem = mensagem + "\n   blockHash: " + result.blockHash;
						mensagem = mensagem + "\n   transactionHash: " + result.transactionHash;
					} else {
						mensagem = "";
						mensagem = mensagem + "Erro ao tentar incluir a Associação.";
						mensagem = mensagem + "\n   codigo_erro: " + result.args.valor_erro;
						mensagem = mensagem + "\n   string_com_erro: " + web3_node1.toAscii(result.args.string_com_erro).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   percentual: " + result.args.percentual;
						//mensagem = mensagem + "\n   total_percent_aloc_bem: " + result.args.total_percent_aloc_bem;

						aux_total_percent = 100 - parseInt(result.args.total_percent_aloc_bem);
						mensagem = mensagem + "\n   Total disponível para alocação: " + aux_total_percent;
					}

					alert(mensagem);
					tx_marcar_como_exibida(result.transactionHash);
				}
			}
		}
	});


	//event ReturnLiberacao(int id_retorno, bytes32 descricao, bool success, uint32 id_bem, bytes32 string_com_erro, int valor_erro);
	eventReturnAssociacao = gestao_garantias.ReturnLiberacao(function(error, result){
		if (!DEBUG) {
			//if (tx_tem_exibicao_pendente())
			//{
				if (error != null) {
					registrarEvento("Libera&ccedil;&atilde;o dos bens e direitos", result.transactionHash, true, result, error, "", "");
				} else {
					registrarEvento("Libera&ccedil;&atilde;o dos bens e direitos", result.transactionHash, !result.args.success, result, error, "", "");
				}
			//}
		} else {
			if (error != null && tx_tem_exibicao_pendente() && DEBUG) {
				alert(error + " - " + result);
			} else {
				if (!tx_exibida(result.transactionHash) && tx_tem_exibicao_pendente()) {
					if (result.args.success) {
						mensagem = "";
						mensagem = mensagem + "liberacao dos bens e direitos.";
						mensagem = mensagem + "\n   id_retorno: " + result.args.id_retorno;
						mensagem = mensagem + "\n   descricao: " + web3_node1.toAscii(result.args.descricao).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   codigo_item_acessado: " + result.args.codigo_item_acessado;
						mensagem = mensagem + "\n   id_garantia: " + web3_node1.toAscii(result.args.id_garantia).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   id_bem: " + result.args.id_bem;
						mensagem = mensagem + "\n   percentual: " + result.args.percentual;
						mensagem = mensagem + "\n   total_percent_aloc_bem: " + result.args.total_percent_aloc_bem;
						mensagem = mensagem + "\n";
						mensagem = mensagem + "\n   blockHash: " + result.blockHash;
						mensagem = mensagem + "\n   transactionHash: " + result.transactionHash;
					} else {
						mensagem = "";
						mensagem = mensagem + "Erro ao tentar liberar os bens e direitos.";
						mensagem = mensagem + "\n   codigo_erro: " + result.args.valor_erro;
						mensagem = mensagem + "\n   string_com_erro: " + web3_node1.toAscii(result.args.string_com_erro).replace(/[^\x20-\x7E]+/g, '');
						mensagem = mensagem + "\n   percentual: " + result.args.percentual;
						//mensagem = mensagem + "\n   total_percent_aloc_bem: " + result.args.total_percent_aloc_bem;

						aux_total_percent = 100 - parseInt(result.args.total_percent_aloc_bem);
						mensagem = mensagem + "\n   Total disponível para alocação: " + aux_total_percent;
					}

					alert(mensagem);
					tx_marcar_como_exibida(result.transactionHash);
				}
			}
		}
	});
}


Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
