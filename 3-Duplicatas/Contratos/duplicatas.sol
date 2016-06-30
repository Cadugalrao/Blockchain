contract GestaoDuplicata
{
    uint32 public contador_duplicata = 0;
    uint32 public contador_contrato = 0;
    uint32 public contador_associacao = 0;
    uint16 public contador_banco = 0;

    mapping (address => uint16) banco;

    address private _owner;

    //Eventos
    event ReturnDuplicata(int id_retorno, string descricao, bool success, uint32 codigo_item_acessado, uint64 codigo, uint64 valor, string string_com_erro, int codigo_erro);
    event ReturnduplicataAlt(int id_retorno, string descricao, bool success, uint32 codigo_item_acessado, uint64 codigo, uint64 valor, string string_com_erro, int codigo_erro);
    event ReturnContrato(int id_retorno, string descricao, bool success, uint32 codigo_item_acessado, bytes32 codigo, uint64 valor, string string_com_erro, int codigo_erro);
    event ReturncontratoAlt(int id_retorno, string descricao, bool success, uint32 codigo_item_acessado, bytes32 codigo, uint64 valor, string string_com_erro, int codigo_erro);
    event ReturnAssociacao(int id_retorno, string descricao, bool success, uint32 codigo_item_acessado, bytes32 id_contrato, uint index_g, uint32 id_duplicata, uint32 percentual, uint32 total_percent_aloc_duplicata, string string_com_erro, int valor_erro);
    event ReturnPermissao(int id_retorno, string descricao, bool success, address endereco_banco, bytes32 permissao, bytes32 string_com_erro, int valor_erro);
    event ReturnLiberacao(int id_retorno, string descricao, bool success, uint32 id_duplicata, bytes32 string_com_erro, int valor_erro);

    struct Duplicata
    {
        uint64 codigo;
        uint64 valor;
        uint64 valor_atualizado;
        uint16 banco;
    }

    struct Contrato
    {
        bytes32 codigo;
        uint64 valor;
        uint64 valor_atualizado;
        uint16 banco;
    }

    struct Associacao
    {
        bytes32 id_contrato;
        uint32 id_duplicata;
        uint16 banco;
    }

    Duplicata[] public duplicatas;
    Contrato[] public contratos;
    Associacao[] public associacoes;

    function GestaoDuplicata()
    {
        duplicatas.length = 100000000;
        contratos.length = 100000000;
        associacoes.length = 100000000;

        for(uint b = 0; b < 2; b++)
            duplicatas[b].codigo = 1;

        for(uint g = 0; g < 2; g++)
            contratos[g].codigo = "iniciado";

        for(uint a = 0; a < 2; a++)
            associacoes[a].id_contrato = "2";

        _owner = msg.sender;

        banco[0x3f6b843f2b8b6ea4ec2c18aa8fae5a92bff02079] = 1;
        banco[0x361f832d63bf0f756161bf744aa7a4eaad5c8328] = 2;
        banco[0x0b697fd49ad5e2a30dc1e970e8db1b9d0a1c25b4] = 3;
        banco[0x3c513bb978ab6c4ae7c5f25b61a839332842410d] = 4;
        contador_banco = 4;

        //chamada do evento
        //event CallReturn(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 string_com_erro, int valor_erro);
        //CallReturn(0, "Construtor: sucesso", true, 0, "", 0);
    }

    function incluir_permissao(address account, bytes32 node) {
        bool erro = false;
        if (_owner != msg.sender) {
            ReturnPermissao(-1, "Permissao: erro", false, account, node, "Nao eh o owner do contrato", -11);
            erro = true;
            //throw;
        }

        if (node[2] != "") {
            ReturnPermissao(-1, "Permissao: erro", false, account, node, "noh invalido", -12);
            erro = true;
        }

        if (!erro) {
            ReturnPermissao(0, "Permissao: sucesso", true, account, node, "", 0);
            contador_banco++;
            banco[account] = contador_banco;
        }
    }

    function incluir_contrato(bytes32 codigo, uint64 valor) {
        bool erro = false;
        if (codigo == "") {
            log1("incluir_duplicata: ", "ponto 5");
            ReturnContrato(-1, "contrato: erro", false, contador_contrato, codigo , valor, "Codigo invalido", -9);
            erro = true;
        }

        if (valor == 0) {
            log1("incluir_duplicata: ", "ponto 7");
            ReturnContrato(-1, "contrato: erro", false, contador_contrato, codigo , valor, "valor invalido", -10);
            erro = true;
        }

        log1("incluir_contrato: ", "ponto 10");
        bool encontrado = false;
        for(var g = 0; g < contador_contrato; g++) {
            if (contratos[g].codigo == codigo) {
                log1("incluir_contrato: ", "ponto 10 codigo encontrado");
                encontrado = true;
                //event Returncontrato(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
                ReturnContrato(-1, "contrato: erro", false, contador_contrato, codigo , valor, "Codigo ja cadastrado", -1);
                break;
            }
        }

        log1("incluir_contrato: ", "ponto 15");

        if (!encontrado && !erro) {
            log1("incluir_contrato: ", "ponto 17");
            Contrato aux_contrato = contratos[contador_contrato];
            log2("incluir_contrato: ", "ponto 20 codigo", codigo);
            aux_contrato.codigo = codigo;
            aux_contrato.valor = valor;
            aux_contrato.valor_atualizado = valor;
            //aux_contrato.banco = msg.sender;

            contador_contrato = contador_contrato + 1;

            //chamada do evento
            //event Returncontrato(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
            ReturnContrato(0, "contrato: sucesso", true, contador_contrato - 1, codigo , valor, "null", 0);
        }
    }

    function alterar_contrato(uint32 index_contrato, uint64 valor_atualizado) {
        bool erro = false;
        //if (premissao[msg.sender][0] != contratos[index_contrato].codigo[0] || premissao[msg.sender][1] != contratos[index_contrato].codigo[1]) {
        //    log1("incluir_alocacao: ", "ponto 12");
        //    ReturncontratoAlt(-1, "contrato Alt: erro", false, index_contrato, codigo , valor_atualizado, "sem permissão", -9);
        //    erro = true;
        //}

        if (index_contrato >= contador_contrato) {
            log1("alterar_contrato: ", "ponto 5");
            //event ReturncontratoAlt(int id_retorno, bytes32 descricao, bool success, uint32 codigo_item_acessado, bytes32 codigo, uint64 valor, bytes32 string_com_erro, int codigo_erro);
            ReturncontratoAlt(-1, "contrato Alt: erro", false, index_contrato, "" , valor_atualizado, "Codigo invalido", -9);
            erro = true;
        }

        //if (codigo == "") {
        //    log1("alterar_contrato: ", "ponto 5");
        //    ReturncontratoAlt(-1, "contrato alt: erro", false, index_contrato, codigo , valor_atualizado, "Codigo invalido", -9);
        //    erro = true;
        //}

        if (valor_atualizado == 0) {
            log1("alterar_contrato: ", "ponto 7");
            ReturncontratoAlt(-1, "contrato alt: erro", false, index_contrato, contratos[index_contrato].codigo , valor_atualizado, "valor invalido", -10);
            erro = true;
        }

        log1("alterar_contrato: ", "ponto 10");
        bool encontrado = false;
        //for(var g = 0; g < contador_contrato; g++) {
        //    if (contratos[g].codigo == codigo) {
        //        log1("alterar_contrato: ", "ponto 10 codigo encontrado");
        //        encontrado = true;
                //event Returncontrato(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
        //        ReturncontratoAlt(-1, "contrato alt: erro", false, index_contrato, codigo , valor_atualizado, "Codigo ja cadastrado", -1);
        //        break;
        //    }
        //}

        log1("alterar_contrato: ", "ponto 15");

        if (!encontrado && !erro) {
            log1("alterar_contrato: ", "ponto 17");
            Contrato aux_contrato = contratos[index_contrato];
            aux_contrato.valor_atualizado = valor_atualizado;

            //log1("alterar_contrato: ", "ponto 30");
            //contador_contrato = contador_contrato + 1;
            //log1("alterar_contrato: ", "ponto 40");

            //chamada do evento
            //event Returncontrato(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
            ReturncontratoAlt(0, "contrato alt: sucesso", true, index_contrato, contratos[index_contrato].codigo , valor_atualizado, "null", 0);
            log1("alterar_contrato: ", "ponto 50");
        }
        log1("alterar_contrato: ", "ponto 60");
    }

    function incluir_duplicata(uint64 codigo, uint64 valor) //, uint tipo)
    {
        bool erro = false;
        if (codigo == 0) {
            ReturnDuplicata(-1, "duplicata: erro", false, contador_duplicata, codigo, valor, "Codigo invalido", -7);
        }

        if (valor == 0) {
            log1("incluir_duplicata: ", "ponto 7");
            ReturnDuplicata(-1, "duplicata: erro", false, contador_duplicata, codigo, valor, "valor invalido", -8);
            erro = true;
        }



        log1("incluir_duplicata: ", "ponto 10");
        bool encontrado = false;
        for(var b = 0; b < contador_duplicata; b++) {
            if (duplicatas[b].codigo == codigo) {
                encontrado = true;
                //event Returnduplicata(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
                ReturnDuplicata(-1, "duplicata: erro", false, contador_duplicata, codigo, valor, "Codigo ja cadastrado", -2);
                break;
            }
        }

        if (!encontrado && !erro) {
            Duplicata aux_duplicata = duplicatas[contador_duplicata];
            aux_duplicata.codigo = codigo;
            aux_duplicata.valor = valor;
            aux_duplicata.valor_atualizado = valor;

            contador_duplicata = contador_duplicata + 1;

            //chamada do evento
            //event Returnduplicata(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
            ReturnDuplicata(0, "duplicata: sucesso", true, contador_duplicata - 1, codigo, valor, "null", 0);
        }
    }

    function alterar_duplicata(uint32 index_duplicata, uint64 valor_atualizado) {
        bool erro = false;

        if (index_duplicata >= contador_duplicata) {
            log1("alterar_contrato: ", "ponto 5");
            //event ReturncontratoAlt(int id_retorno, bytes32 descricao, bool success, uint32 codigo_item_acessado, bytes32 codigo, uint64 valor, bytes32 string_com_erro, int codigo_erro);
            ReturnduplicataAlt(-1, "contrato Alt: erro", false, index_duplicata, 0, valor_atualizado, "Codigo invalido", -9);
            erro = true;
        }

        if (valor_atualizado == 0) {
            log1("alterar_contrato: ", "ponto 7");
            ReturnduplicataAlt(-1, "contrato alt: erro", false, index_duplicata, duplicatas[index_duplicata].codigo , valor_atualizado, "valor invalido", -10);
            erro = true;
        }

        log1("alterar_duplicata: ", "ponto 10");
        bool encontrado = false;
        //for(var g = 0; g < contador_contrato; g++) {
        //    if (contratos[g].codigo == codigo) {
        //        log1("alterar_contrato: ", "ponto 10 codigo encontrado");
        //        encontrado = true;
                //event Returncontrato(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
        //        ReturnduplicataAlt(-1, "contrato alt: erro", false, index_contrato, codigo , valor_atualizado, "Codigo ja cadastrado", -1);
        //        break;
        //    }
        //}

        log1("alterar_duplicata: ", "ponto 15");

        if (!encontrado && !erro) {
            log1("alterar_contrato: ", "ponto 17");
            Duplicata aux_duplicata = duplicatas[index_duplicata];
            aux_duplicata.valor_atualizado = valor_atualizado;

            //log1("alterar_contrato: ", "ponto 30");
            //contador_contrato = contador_contrato + 1;
            //log1("alterar_contrato: ", "ponto 40");

            //chamada do evento
            //event Returncontrato(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
            ReturnduplicataAlt(0, "duplicata alt: sucesso", true, index_duplicata, duplicatas[index_duplicata].codigo , valor_atualizado, "null", 0);
            log1("alterar_duplicata: ", "ponto 50");
        }
        log1("alterar_duplicata: ", "ponto 60");
    }

    function incluir_associacao(bytes32 id_contrato, uint32 id_duplicata, uint32 percent) { // returns (uint) {
        //uint retorno = 0;
        //início: verificação se o duplicata ou direito já está alocado 100% em contratos
        log1("incluir_alocacao: ", "ponto 10");
        bool erro_encontrado = false;
        uint32 total_percent_aloc_duplicata = 0;
        byte g_1 = "";
        byte g_2 = "";
        //byte _g_1 = id_contrato[1];

        uint index_g = 0;
        if (id_contrato[3] != "") {
            index_g = uint(charAt(id_contrato,3));
            index_g += uint(charAt(id_contrato,2)) * 10;
            index_g += uint(charAt(id_contrato,1)) * 100;
        } else if (id_contrato[2] != "") {
            index_g = uint(charAt(id_contrato, 2));
            index_g += uint(charAt(id_contrato, 1)) * 10;
        } else if (id_contrato[1] != "") {
            index_g = uint(charAt(id_contrato, 1));
        }


        if (id_contrato == "") {
            log1("incluir_alocacao: ", "ponto 11");
            ReturnAssociacao(-1, "Associacao: erro", false, 0, id_contrato, index_g, id_duplicata, percent, total_percent_aloc_duplicata, "id contrato invalido", -5);
            erro_encontrado = true;
        }

        if (id_duplicata >= contador_duplicata) {
            log1("incluir_alocacao: ", "ponto 12");
            ReturnAssociacao(-1, "Associacao: erro", false, 0, id_contrato, index_g, id_duplicata, percent, total_percent_aloc_duplicata, "id duplicata invalido", -6);
            erro_encontrado = true;
        }

        uint64 contrato_banco = duplicatas[index_g].codigo;
        //if (premissao[msg.sender][0] != contrato_banco[0] || premissao[msg.sender][1] != contrato_banco[1]) {
        //    log1("incluir_alocacao: ", "ponto 12");
        //    ReturnAssociacao(-1, "Associacao: erro", false, 0, id_contrato[1], index_g, id_duplicata, percent, total_percent_aloc_duplicata, "permissao negada", -13);
        //    erro_encontrado = true;
        //}

        for(var y = 0; y < contador_associacao; y++) {
            if (associacoes[y].id_duplicata == id_duplicata) {
                log1("incluir_alocacao: ", "ponto 15");
                //total_percent_aloc_duplicata = total_percent_aloc_duplicata + associacoes[y].percentual;

                //validacao se duplicata já está alocado para outro banco
                g_1 = associacoes[y].id_contrato[0];
                g_2 = associacoes[y].id_contrato[1];

                //if (g_1 != contrato_banco[0] || g_2 != contrato_banco[1]) {
                //    erro_encontrado = true;
                //    log1("incluir_alocacao: ", "ponto 15.5");
                //    ReturnAssociacao(-1, "Associacao: erro", false, 0, id_contrato, index_g, id_duplicata, percent, total_percent_aloc_duplicata, "duplicata alocado para outro banco", -4);
                //    break;
                //}
            }
        }

        if (total_percent_aloc_duplicata + percent > 100) {
            erro_encontrado = true;
            log1("incluir_alocacao: ", "ponto 16");
            //event ReturnAssociacao(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 id_contrato, uint id_duplicata, uint percentual, bytes32 string_com_erro, int valor_erro);
            ReturnAssociacao(-1, "Associacao: erro", false, 0, id_contrato, index_g, id_duplicata, percent, total_percent_aloc_duplicata, "percent. aloc. invalido", -3);
            //return "Erro: Não é possível alocar esse percentual para esse duplicata ou Direito.";
        }

        //Fim: verificação se o duplicata ou direito já está alocado 100% em contratos
        //retorno = 5;
        if (!erro_encontrado) {
            log1("incluir_alocacao: ", "ponto 20");

            Associacao aux_associacao = associacoes[contador_associacao];
            aux_associacao.id_contrato = id_contrato;
            aux_associacao.id_duplicata = id_duplicata;
            //aux_associacao.percentual = percent;

            log1("incluir_alocacao: ", "ponto 30");
            contador_associacao = contador_associacao + 1;
            log1("incluir_alocacao: ", "ponto 40");

            //chamada do evento
            //ReturnAssociacao(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 id_contrato, uint id_duplicata, uint percentual, bytes32 string_com_erro, int valor_erro);
            ReturnAssociacao(0, "Associacao: sucesso", true, contador_associacao - 1, id_contrato, index_g, id_duplicata, percent, total_percent_aloc_duplicata, "", 0);
            log1("incluir_alocacao: ", "ponto 50");
        //    retorno = 10;
        }
        log1("incluir_alocacao: ", "ponto 60");
        //return retorno;
    }

    	function liberar_duplicata_e_direito(
	bytes32 _id_contrato,
	uint32 _id_duplicata,
	int32 tipo // se for 0 libera todos os bens da contrato informada
	) {
		bool encontrada = false;
		//incluir validação de permissão em relação à contrato

		if (tipo == 0) {
			//se tipo for 0 inativa todas os bens da contrato
			for(var y = 0; y < contador_associacao; y++) {
				//if (associacoes[y].id_contrato == _id_contrato && associacoes[y].percentual > 0) {
				//	associacoes[y].percentual = 0;
					encontrada = true;
				//}
			}
		} else {
			for(var i = 0; i < contador_associacao; i++) {
				//if (associacoes[i].id_contrato == _id_contrato && associacoes[i].percentual > 0 && associacoes[i].id_duplicata == _id_duplicata) {
				//	associacoes[i].percentual = 0;
					encontrada = true;
				//}
			}
		}
		//event ReturnLiberacao(int id_retorno, bytes32 descricao, bool success, uint32 id_duplicata, bytes32 string_com_erro, int valor_erro);

		if (encontrada) {
		    ReturnLiberacao(0, "Liberacao: sucesso", true, _id_duplicata, "", 0);
		} else {
		    ReturnLiberacao(-1, "Liberacao: erro", false, _id_duplicata, "", 0);
		}
	}


    function subString(bytes32 entrada, uint32 inicial, uint32 tamanho) returns (bytes32 retorno) {
        //uint n = uint(byteString);
        bytes memory r = new bytes(32);
        //bytes32 r;
        byte aux = "";
        bool erro = false;
        retorno = "";
        if ((inicial + tamanho) > 32) {
            erro = true;
            return;
        }

        uint32 contadorR = 0;

        if (!erro) {
            for (uint i = inicial; i < (inicial + tamanho); i++) {
                aux = entrada[i];
                r[contadorR] = aux;

                //r[2] = "1";
                contadorR++;
            }
            //retorno = bytes32(r);
            return retorno;
        }
    }

    function charAt(bytes32 b, uint char) returns (bytes1) {
        return bytes1(uint8(uint(b) / (2**((31 - char) * 8))));
    }
}
