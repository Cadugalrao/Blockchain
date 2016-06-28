contract GestaoGarantia
{
    uint32 public contador_bem = 0;
    uint32 public contador_garantia = 0;
    uint32 public contador_associacao = 0;
    //bytes32 storage retorno;

    mapping (address => bytes32) permissao;

    address private _owner;

    //Eventos
    event ReturnBem(int id_retorno, bytes32 descricao, bool success, uint32 codigo_item_acessado, bytes32 codigo, uint64 valor, bytes32 string_com_erro, int codigo_erro);
    event ReturnBemAlt(int id_retorno, bytes32 descricao, bool success, uint32 codigo_item_acessado, bytes32 codigo, uint64 valor, bytes32 string_com_erro, int codigo_erro);
    event ReturnGarantia(int id_retorno, bytes32 descricao, bool success, uint32 codigo_item_acessado, bytes32 codigo, uint64 valor, bytes32 string_com_erro, int codigo_erro);
    event ReturnGarantiaAlt(int id_retorno, bytes32 descricao, bool success, uint32 codigo_item_acessado, bytes32 codigo, uint64 valor, bytes32 string_com_erro, int codigo_erro);
    event ReturnAssociacao(int id_retorno, bytes32 descricao, bool success, uint32 codigo_item_acessado, bytes32 id_garantia, uint index_g, uint32 id_bem, uint32 percentual, uint32 total_percent_aloc_bem, bytes32 string_com_erro, int valor_erro);
    event ReturnPermissao(int id_retorno, bytes32 descricao, bool success, address endereco_banco, bytes32 permissao, bytes32 string_com_erro, int valor_erro);
    event ReturnLiberacao(int id_retorno, bytes32 descricao, bool success, uint32 id_bem, bytes32 string_com_erro, int valor_erro);

    struct Bem
    {
        bytes32 codigo;
        uint64 valor;
        uint64 valor_atualizado;
        uint32 tipo;
    }

    struct Garantia
    {
        bytes32 codigo;
        uint64 valor;
        uint64 valor_atualizado;
    }

    struct Associacao
    {
        bytes32 id_garantia;
        uint32 id_bem;
        uint32 percentual;
    }

    Bem[] public bens;
    Garantia[] public garantias;
    Associacao[] public associacoes;

    function GestaoGarantia()
    {
        bens.length = 100000000;
        garantias.length = 100000000;
        associacoes.length = 100000000;

        for(uint b = 0; b < 2; b++)
            bens[b].codigo = "iniciado";

        for(uint g = 0; g < 2; g++)
            garantias[g].codigo = "iniciado";

        for(uint a = 0; a < 2; a++)
            associacoes[a].id_garantia = "2";

        _owner = msg.sender;

        permissao[0x3f6b843f2b8b6ea4ec2c18aa8fae5a92bff02079] = "n1";
        permissao[0x361f832d63bf0f756161bf744aa7a4eaad5c8328] = "n2";
        permissao[0x0b697fd49ad5e2a30dc1e970e8db1b9d0a1c25b4] = "n3";
        permissao[0x3c513bb978ab6c4ae7c5f25b61a839332842410d] = "n4";

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
            //throw;
        }

        if (!erro) {
            ReturnPermissao(0, "Permissao: sucesso", true, account, node, "", 0);
            permissao[account] = node;
        }
    }

    function incluir_garantia(bytes32 codigo, uint64 valor) {
        bool erro = false;
        if (codigo == "") {
            log1("incluir_bem: ", "ponto 5");
            ReturnGarantia(-1, "Garantia: erro", false, contador_garantia, codigo , valor, "Codigo invalido", -9);
            erro = true;
        }

        if (valor == 0) {
            log1("incluir_bem: ", "ponto 7");
            ReturnGarantia(-1, "Garantia: erro", false, contador_garantia, codigo , valor, "valor invalido", -10);
            erro = true;
        }

        log1("incluir_garantia: ", "ponto 10");
        bool encontrado = false;
        for(var g = 0; g < contador_garantia; g++) {
            if (garantias[g].codigo == codigo) {
                log1("incluir_garantia: ", "ponto 10 codigo encontrado");
                encontrado = true;
                //event ReturnGarantia(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
                ReturnGarantia(-1, "Garantia: erro", false, contador_garantia, codigo , valor, "Codigo ja cadastrado", -1);
                break;
            }
        }

        log1("incluir_garantia: ", "ponto 15");

        if (!encontrado && !erro) {
            log1("incluir_garantia: ", "ponto 17");
            Garantia aux_garantia = garantias[contador_garantia];
            log2("incluir_garantia: ", "ponto 20 codigo", codigo);
            aux_garantia.codigo = codigo;
            aux_garantia.valor = valor;
            aux_garantia.valor_atualizado = valor;
            //aux_garantia.banco = msg.sender;

            log1("incluir_garantia: ", "ponto 30");
            contador_garantia = contador_garantia + 1;
            log1("incluir_garantia: ", "ponto 40");

            //chamada do evento
            //event ReturnGarantia(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
            ReturnGarantia(0, "Garantia: sucesso", true, contador_garantia - 1, codigo , valor, "null", 0);
            log1("incluir_garantia: ", "ponto 50");
        }
        log1("incluir_garantia: ", "ponto 60");
    }

    function alterar_garantia(uint32 index_garantia, uint64 valor_atualizado) {
        bool erro = false;
        //if (premissao[msg.sender][0] != garantias[index_garantia].codigo[0] || premissao[msg.sender][1] != garantias[index_garantia].codigo[1]) {
        //    log1("incluir_alocacao: ", "ponto 12");
        //    ReturnGarantiaAlt(-1, "Garantia Alt: erro", false, index_garantia, codigo , valor_atualizado, "sem permissão", -9);
        //    erro = true;
        //}

        if (index_garantia >= contador_garantia) {
            log1("alterar_garantia: ", "ponto 5");
            //event ReturnGarantiaAlt(int id_retorno, bytes32 descricao, bool success, uint32 codigo_item_acessado, bytes32 codigo, uint64 valor, bytes32 string_com_erro, int codigo_erro);
            ReturnGarantiaAlt(-1, "Garantia Alt: erro", false, index_garantia, "" , valor_atualizado, "Codigo invalido", -9);
            erro = true;
        }

        //if (codigo == "") {
        //    log1("alterar_garantia: ", "ponto 5");
        //    ReturnGarantiaAlt(-1, "Garantia alt: erro", false, index_garantia, codigo , valor_atualizado, "Codigo invalido", -9);
        //    erro = true;
        //}

        if (valor_atualizado == 0) {
            log1("alterar_garantia: ", "ponto 7");
            ReturnGarantiaAlt(-1, "Garantia alt: erro", false, index_garantia, garantias[index_garantia].codigo , valor_atualizado, "valor invalido", -10);
            erro = true;
        }

        log1("alterar_garantia: ", "ponto 10");
        bool encontrado = false;
        //for(var g = 0; g < contador_garantia; g++) {
        //    if (garantias[g].codigo == codigo) {
        //        log1("alterar_garantia: ", "ponto 10 codigo encontrado");
        //        encontrado = true;
                //event ReturnGarantia(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
        //        ReturnGarantiaAlt(-1, "Garantia alt: erro", false, index_garantia, codigo , valor_atualizado, "Codigo ja cadastrado", -1);
        //        break;
        //    }
        //}

        log1("alterar_garantia: ", "ponto 15");

        if (!encontrado && !erro) {
            log1("alterar_garantia: ", "ponto 17");
            Garantia aux_garantia = garantias[index_garantia];
            log2("alterar_garantia: ", "ponto 20 codigo", garantias[index_garantia].codigo);
            //aux_garantia.codigo = codigo;
            //aux_garantia.valor = valor;
            aux_garantia.valor_atualizado = valor_atualizado;

            //log1("alterar_garantia: ", "ponto 30");
            //contador_garantia = contador_garantia + 1;
            //log1("alterar_garantia: ", "ponto 40");

            //chamada do evento
            //event ReturnGarantia(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
            ReturnGarantiaAlt(0, "Garantia alt: sucesso", true, index_garantia, garantias[index_garantia].codigo , valor_atualizado, "null", 0);
            log1("alterar_garantia: ", "ponto 50");
        }
        log1("alterar_garantia: ", "ponto 60");
    }

    function incluir_bem(bytes32 codigo, uint64 valor) //, uint tipo)
    {
        bool erro = false;
        if (codigo == "") {
            log1("incluir_bem: ", "ponto 5");
            ReturnBem(-1, "Bem: erro", false, contador_bem, codigo, valor, "Codigo invalido", -7);
            erro = true;
        }

        if (valor == 0) {
            log1("incluir_bem: ", "ponto 7");
            ReturnBem(-1, "Bem: erro", false, contador_bem, codigo, valor, "valor invalido", -8);
            erro = true;
        }



        log1("incluir_bem: ", "ponto 10");
        bool encontrado = false;
        for(var b = 0; b < contador_bem; b++) {
            if (bens[b].codigo == codigo) {
                log1("incluir_bem: ", "ponto 10 codigo encontrado");
                encontrado = true;
                //event ReturnBem(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
                ReturnBem(-1, "Bem: erro", false, contador_bem, codigo, valor, "Codigo ja cadastrado", -2);
                break;
            }
        }

        if (!encontrado && !erro) {
            Bem aux_bem = bens[contador_bem];
            log2("incluir_bem: ", "ponto 20 codigo", codigo);
            aux_bem.codigo = codigo;
            aux_bem.valor = valor;
            aux_bem.valor_atualizado = valor;
            //aux_bem.tipo = tipo;

            log1("incluir_bem: ", "ponto 30");
            contador_bem = contador_bem + 1;
            log1("incluir_bem: ", "ponto 40");

            //chamada do evento
            //event ReturnBem(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
            ReturnBem(0, "Bem: sucesso", true, contador_bem - 1, codigo, valor, "null", 0);
            log1("incluir_bem: ", "ponto 50");
        }
        log1("incluir_bem: ", "ponto 60");
    }

    function alterar_bem(uint32 index_bem, uint64 valor_atualizado) {
        bool erro = false;
        //if (premissao[msg.sender][0] != garantias[index_garantia].codigo[0] || premissao[msg.sender][1] != garantias[index_garantia].codigo[1]) {
        //    log1("incluir_alocacao: ", "ponto 12");
        //    ReturnBemAlt(-1, "Garantia Alt: erro", false, index_garantia, codigo , valor_atualizado, "sem permissão", -9);
        //    erro = true;
        //}

        if (index_bem >= contador_bem) {
            log1("alterar_garantia: ", "ponto 5");
            //event ReturnGarantiaAlt(int id_retorno, bytes32 descricao, bool success, uint32 codigo_item_acessado, bytes32 codigo, uint64 valor, bytes32 string_com_erro, int codigo_erro);
            ReturnBemAlt(-1, "Garantia Alt: erro", false, index_bem, "" , valor_atualizado, "Codigo invalido", -9);
            erro = true;
        }

        //if (codigo == "") {
        //    log1("alterar_garantia: ", "ponto 5");
        //    ReturnBemAlt(-1, "Garantia alt: erro", false, index_garantia, codigo , valor_atualizado, "Codigo invalido", -9);
        //    erro = true;
        //}

        if (valor_atualizado == 0) {
            log1("alterar_garantia: ", "ponto 7");
            ReturnBemAlt(-1, "Garantia alt: erro", false, index_bem, bens[index_bem].codigo , valor_atualizado, "valor invalido", -10);
            erro = true;
        }

        log1("alterar_bem: ", "ponto 10");
        bool encontrado = false;
        //for(var g = 0; g < contador_garantia; g++) {
        //    if (garantias[g].codigo == codigo) {
        //        log1("alterar_garantia: ", "ponto 10 codigo encontrado");
        //        encontrado = true;
                //event ReturnGarantia(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
        //        ReturnBemAlt(-1, "Garantia alt: erro", false, index_garantia, codigo , valor_atualizado, "Codigo ja cadastrado", -1);
        //        break;
        //    }
        //}

        log1("alterar_bem: ", "ponto 15");

        if (!encontrado && !erro) {
            log1("alterar_garantia: ", "ponto 17");
            Bem aux_bem = bens[index_bem];
            log2("alterar_garantia: ", "ponto 20 codigo", bens[index_bem].codigo);
            //aux_garantia.codigo = codigo;
            //aux_garantia.valor = valor;
            aux_bem.valor_atualizado = valor_atualizado;

            //log1("alterar_garantia: ", "ponto 30");
            //contador_garantia = contador_garantia + 1;
            //log1("alterar_garantia: ", "ponto 40");

            //chamada do evento
            //event ReturnGarantia(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
            ReturnBemAlt(0, "Bem alt: sucesso", true, index_bem, bens[index_bem].codigo , valor_atualizado, "null", 0);
            log1("alterar_bem: ", "ponto 50");
        }
        log1("alterar_bem: ", "ponto 60");
    }

    function incluir_associacao(bytes32 id_garantia, uint32 id_bem, uint32 percent) { // returns (uint) {
        //uint retorno = 0;
        //início: verificação se o bem ou direito já está alocado 100% em garantias
        log1("incluir_alocacao: ", "ponto 10");
        bool erro_encontrado = false;
        uint32 total_percent_aloc_bem = 0;
        byte g_1 = "";
        byte g_2 = "";
        //byte _g_1 = id_garantia[1];

        uint index_g = 0;
        if (id_garantia[3] != "") {
            index_g = uint(charAt(id_garantia,3));
            index_g += uint(charAt(id_garantia,2)) * 10;
            index_g += uint(charAt(id_garantia,1)) * 100;
        } else if (id_garantia[2] != "") {
            index_g = uint(charAt(id_garantia, 2));
            index_g += uint(charAt(id_garantia, 1)) * 10;
        } else if (id_garantia[1] != "") {
            index_g = uint(charAt(id_garantia, 1));
        }


        if (id_garantia == "") {
            log1("incluir_alocacao: ", "ponto 11");
            ReturnAssociacao(-1, "Associacao: erro", false, 0, id_garantia, index_g, id_bem, percent, total_percent_aloc_bem, "id garantia invalido", -5);
            erro_encontrado = true;
        }

        if (id_bem >= contador_bem) {
            log1("incluir_alocacao: ", "ponto 12");
            ReturnAssociacao(-1, "Associacao: erro", false, 0, id_garantia, index_g, id_bem, percent, total_percent_aloc_bem, "id bem invalido", -6);
            erro_encontrado = true;
        }

        bytes32 garantia_banco = garantias[index_g].codigo;
        //if (premissao[msg.sender][0] != garantia_banco[0] || premissao[msg.sender][1] != garantia_banco[1]) {
        //    log1("incluir_alocacao: ", "ponto 12");
        //    ReturnAssociacao(-1, "Associacao: erro", false, 0, id_garantia[1], index_g, id_bem, percent, total_percent_aloc_bem, "permissao negada", -13);
        //    erro_encontrado = true;
        //}

        for(var y = 0; y < contador_associacao; y++) {
            if (associacoes[y].id_bem == id_bem) {
                log1("incluir_alocacao: ", "ponto 15");
                total_percent_aloc_bem = total_percent_aloc_bem + associacoes[y].percentual;

                //validacao se bem já está alocado para outro banco
                g_1 = associacoes[y].id_garantia[0];
                g_2 = associacoes[y].id_garantia[1];

                //if (g_1 != garantia_banco[0] || g_2 != garantia_banco[1]) {
                //    erro_encontrado = true;
                //    log1("incluir_alocacao: ", "ponto 15.5");
                //    ReturnAssociacao(-1, "Associacao: erro", false, 0, id_garantia, index_g, id_bem, percent, total_percent_aloc_bem, "bem alocado para outro banco", -4);
                //    break;
                //}
            }
        }

        if (total_percent_aloc_bem + percent > 100) {
            erro_encontrado = true;
            log1("incluir_alocacao: ", "ponto 16");
            //event ReturnAssociacao(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 id_garantia, uint id_bem, uint percentual, bytes32 string_com_erro, int valor_erro);
            ReturnAssociacao(-1, "Associacao: erro", false, 0, id_garantia, index_g, id_bem, percent, total_percent_aloc_bem, "percent. aloc. invalido", -3);
            //return "Erro: Não é possível alocar esse percentual para esse Bem ou Direito.";
        }

        //Fim: verificação se o bem ou direito já está alocado 100% em garantias
        //retorno = 5;
        if (!erro_encontrado) {
            log1("incluir_alocacao: ", "ponto 20");

            Associacao aux_associacao = associacoes[contador_associacao];
            aux_associacao.id_garantia = id_garantia;
            aux_associacao.id_bem = id_bem;
            aux_associacao.percentual = percent;

            log1("incluir_alocacao: ", "ponto 30");
            contador_associacao = contador_associacao + 1;
            log1("incluir_alocacao: ", "ponto 40");

            //chamada do evento
            //ReturnAssociacao(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 id_garantia, uint id_bem, uint percentual, bytes32 string_com_erro, int valor_erro);
            ReturnAssociacao(0, "Associacao: sucesso", true, contador_associacao - 1, id_garantia, index_g, id_bem, percent, total_percent_aloc_bem, "", 0);
            log1("incluir_alocacao: ", "ponto 50");
        //    retorno = 10;
        }
        log1("incluir_alocacao: ", "ponto 60");
        //return retorno;
    }

    	function liberar_bem_e_direito(
	bytes32 _id_garantia,
	uint32 _id_bem,
	int32 tipo // se for 0 libera todos os bens da garantia informada
	) {
		bool encontrada = false;
		//incluir validação de permissão em relação à garantia

		if (tipo == 0) {
			//se tipo for 0 inativa todas os bens da garantia
			for(var y = 0; y < contador_associacao; y++) {
				if (associacoes[y].id_garantia == _id_garantia && associacoes[y].percentual > 0) {
					associacoes[y].percentual = 0;
					encontrada = true;
				}
			}
		} else {
			for(var i = 0; i < contador_associacao; i++) {
				if (associacoes[i].id_garantia == _id_garantia && associacoes[i].percentual > 0 && associacoes[i].id_bem == _id_bem) {
					associacoes[i].percentual = 0;
					encontrada = true;
				}
			}
		}
		//event ReturnLiberacao(int id_retorno, bytes32 descricao, bool success, uint32 id_bem, bytes32 string_com_erro, int valor_erro);

		if (encontrada) {
		    ReturnLiberacao(0, "Liberacao: sucesso", true, _id_bem, "", 0);
		} else {
		    ReturnLiberacao(-1, "Liberacao: erro", false, _id_bem, "", 0);
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
