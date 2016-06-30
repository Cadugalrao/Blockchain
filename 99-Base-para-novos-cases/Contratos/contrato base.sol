contract GestaoDuplicata
{
    function GestaoDuplicata() {
        // construtor
        _owner = msg.sender;
    }

    address private _owner;


    ///////////////////////////////////////////////////
    //início duplicatas
    ///////////////////////////////////////////////////
    mapping (uint => Duplicata) duplicatas; //uint = chave da duplicata
    struct Duplicata {
        uint dataCriacao;
        uint cnpj_emissor; //emissor/cedente da nota fiscal
        uint cpf_cnpj_sacado;
        uint64 valor;
        address instituicao_que_cadastrou;
        uint8 situacao; // 0 - Liberada
                        // 1 - Alocada
                        // 2 - Quitada / Executado
                        // 3 - Cancelada
                        // 4 - Em análise
        uint index_alocacao;
    }

    event ret_incluir_duplicata(uint chave, uint cnpj_emissor, uint cpf_cnpj_sacado, uint64 valor, uint8 situacao, string codigo_op, uint index_alocacao, int cod_erro, string descricao);
    function incluir_duplicata(uint _chave, uint _cnpj_emissor, uint _cpf_cnpj_sacado, uint64 _valor, uint8 _situacao, string _codigo_op) {
        Duplicata duplicata_aux = duplicatas[_chave];

        if (_cnpj_emissor == 0) {
            ret_incluir_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, _codigo_op, 0, -1, "O CNPJ do emissor é inválido");
        } else if (_cpf_cnpj_sacado == 0) {
            ret_incluir_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, _codigo_op, 0, -2, "O CNPJ/CPF do sacado é inválido");
        } else if (_valor == 0) {
            ret_incluir_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, _codigo_op, 0, -3, "O valor informado é inválido");
        } else if (_situacao != 1 && _situacao != 4) {
                 // 1 - Alocada     // 4 - Em análise
            ret_incluir_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, _codigo_op, 0, -4, "A situação informada é inválida");
        } else if (duplicata_aux.situacao == 2) {
                    // 2 - Quitada / Executado
            ret_incluir_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, _codigo_op, 0, -5, "A duplicata informada consta como executada");
        } else if (duplicata_aux.situacao == 3) {
                            // 3 - Cancelada
            ret_incluir_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, _codigo_op, 0, -6, "A duplicata informada consta como cancelada");
        } else if ((duplicata_aux.situacao == 1 || duplicata_aux.situacao == 4) && duplicata_aux.instituicao_que_cadastrou != msg.sender) {
                            // 1 - Alocada                   // 4 - Em análise
            ret_incluir_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, _codigo_op, 0, -7, "A duplicata informada está em utilização por outra instituição");
        } else if ((duplicata_aux.situacao == 1 || duplicata_aux.situacao == 4) && duplicata_aux.instituicao_que_cadastrou == msg.sender) {
                            // 1 - Alocada                // 4 - Em análise
            ret_incluir_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, _codigo_op, 0, -8, "A duplicata informada está em utilização pela sua instituição");
        } else {
            bool encontrado_operacao = false;
            for (uint i = 0; i < operacoes[msg.sender].codigo_op.length; i++) {
                if (equal(operacoes[msg.sender].codigo_op[i], _codigo_op)) {
                    encontrado_operacao = true;
                    break;
                }
            }

            if (!encontrado_operacao) {
                ret_incluir_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, _codigo_op, 0, -9, "O código da operação informado é inválido");
            } else {
                duplicata_aux.cnpj_emissor = _cnpj_emissor;
                duplicata_aux.cpf_cnpj_sacado = _cpf_cnpj_sacado;
                duplicata_aux.dataCriacao = block.timestamp;
                duplicata_aux.valor = _valor;
                duplicata_aux.situacao = _situacao;
                duplicata_aux.instituicao_que_cadastrou = msg.sender;

                //if (liberadaInclulida)
                //    duplicatasLiberadas[duplicata_aux.index_duplicata_liberada].chave = 0;
                uint index_alocacao = alocacoes[msg.sender].chave.push(_chave);

                duplicata_aux.index_alocacao = index_alocacao - 1;

                alocacoes[msg.sender].codigo_op.push(_codigo_op);
                alocacoes[msg.sender].ativa.push(true);

                ret_incluir_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, _codigo_op, duplicata_aux.index_alocacao, 0, "Duplicata incluída com sucesso");
            }
        }
    }

    event ret_alterar_duplicata(uint chave, uint cnpj_emissor, uint cpf_cnpj_sacado, uint64 valor, uint8 situacao, int cod_erro, string descricao);
    function alterar_duplicata(uint _chave, uint _cnpj_emissor, uint _cpf_cnpj_sacado, uint64 _valor, uint8 _situacao) {
        Duplicata duplicata_aux = duplicatas[_chave];

        if (duplicata_aux.situacao == 0) {
                    // 0 - Liberada
            ret_alterar_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, -24, "A duplicata consta como liberada");
        } else if (duplicata_aux.situacao == 2) {
                // 2 - Quitada / Executado
            ret_alterar_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, -21, "A duplicata consta como executada");
        } else if (duplicata_aux.situacao == 3) {
                            // 3 - Cancelada
            ret_alterar_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, -22, "A duplicata consta como cancelada");
        } else if ((duplicata_aux.situacao == 1 || duplicata_aux.situacao == 4) && duplicata_aux.instituicao_que_cadastrou != msg.sender) {
                            // 1 - Alocada                 // 4 - Em análise
            ret_alterar_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, -23, "A duplicata está em utilização por outra instituição");
        }  else if (duplicata_aux.instituicao_que_cadastrou != msg.sender) {
            ret_alterar_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, -25, "Não é permitido alterar uma duplicata que não está alocada para sua instituição");
        } else {
            if (_situacao == 0) {
                // 0 - Liberada
                alocacoes[msg.sender].ativa[duplicata_aux.index_alocacao] = false;

                duplicata_aux.situacao = 0;
                duplicata_aux.instituicao_que_cadastrou = 0;

                //duplicata_aux.index_alocacao = 0;

    			//incluir_duplicata_liberada(_chave);

                ret_alterar_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, 0, "Duplicata liberada com sucesso");
            } else if (_situacao == 1) {
                // 1 - Alocada
                duplicata_aux.situacao = 1;

                ret_alterar_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, 0, "Duplicata alocada com sucesso");
            } else if (_situacao == 2) {
                // 2 - Quitada / Executado
                duplicata_aux.situacao = 2;

                ret_alterar_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, 0, "Duplicata marcada como executada com sucesso");
            } else if (_situacao == 3) {
                // 3 - Cancelada
                duplicata_aux.situacao = 3;

                ret_alterar_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, 0, "Duplicata marcada como cancelada com sucesso");
            }


            if (_cnpj_emissor != 0)
                duplicata_aux.cnpj_emissor = _cnpj_emissor;
            if (_cpf_cnpj_sacado != 0)
                duplicata_aux.cpf_cnpj_sacado = _cpf_cnpj_sacado;
            if (_valor != 0)
                duplicata_aux.valor = _valor;

            ret_alterar_duplicata(_chave, _cnpj_emissor, _cpf_cnpj_sacado, _valor, _situacao, 0, "Duplicata alterada com sucesso");

        }
    }

    function consultar_duplicata(uint _chave) constant returns (uint, uint, uint, uint64, uint8, string, uint) {
        Duplicata memory duplicata_aux = duplicatas[_chave];

        uint8 situacao_aux = duplicata_aux.situacao;
        string memory desc_situacao;

        if (situacao_aux == 0) {
            desc_situacao = "Liberada";
        } else if (situacao_aux == 1) {
            desc_situacao = "Alocada";
        } else if (situacao_aux == 2) {
            desc_situacao = "Quitada / Executado";
        } else if (situacao_aux == 3) {
            desc_situacao = "Cancelada";
        } else if (situacao_aux == 4) {
            desc_situacao = "Em análise";
        }

        return (duplicata_aux.dataCriacao, duplicata_aux.cnpj_emissor, duplicata_aux.cpf_cnpj_sacado, duplicata_aux.valor, duplicata_aux.situacao, desc_situacao, duplicata_aux.index_alocacao);
    }

    uint[] duplicatasLiberadas;

	function incluir_duplicata_liberada(uint _chave) private {
		duplicatasLiberadas.push(_chave);
	}

	function consultar_duplicata_liberada(uint _posicao) constant returns (uint) {
        if (duplicatasLiberadas[_posicao] == 0) {
            return;
        } else {
            return (duplicatasLiberadas[_posicao]);
        }
    }

	function contar_duplicatas_liberadas() constant returns (uint) {
        return (duplicatasLiberadas.length);
    }
    ///////////////////////////////////////////////////
    //fim duplicatas
    ///////////////////////////////////////////////////



    ///////////////////////////////////////////////////
    //início operacoes
    ///////////////////////////////////////////////////

    mapping (address => Operacao) operacoes; //addres = address da instituicao
    struct Operacao {
        string[] codigo_op; //não é permitida a alteração do codigo
        uint64[] valor;
        uint64[] valor_atualizado;
    }

    event ret_incluir_operacao(string codigo_op, uint64 valor, int cod_erro, string descricao);
    function incluir_operacao(string _codigo_op, uint64 _valor) {
        if (equal(_codigo_op, "")) {
            ret_incluir_operacao(_codigo_op, _valor, -15, "O código da operação é inválido");
        } else if (_valor == 0) {
            ret_incluir_operacao(_codigo_op, _valor, -16, "O valor da operação é inválido");
        } else {
            bool encontrado_operacao = false;
            for (uint i = 0; i < operacoes[msg.sender].codigo_op.length; i++) {
                if (equal(operacoes[msg.sender].codigo_op[i], _codigo_op)) {
                    encontrado_operacao = true;
                    break;
                }
            }

            if (encontrado_operacao) {
                ret_incluir_operacao(_codigo_op, _valor, -17, "Código da operação duplicado");
            } else {
                operacoes[msg.sender].codigo_op.push(_codigo_op);
                operacoes[msg.sender].valor.push(_valor);
                operacoes[msg.sender].valor_atualizado.push(_valor);

                ret_incluir_operacao(_codigo_op, _valor, 0, "Operação cadastrada com sucesso");
            }
        }
    }

    event ret_alterar_operacao(string codigo_op, uint64 valor_atualizado, int cod_erro, string descricao);
    function alterar_operacao(string _codigo_op, uint64 _valor_atualizado) {
        if (equal(_codigo_op, "")) {
            ret_alterar_operacao(_codigo_op, _valor_atualizado, -26, "O código da operação é inválido");
        } else if (_valor_atualizado == 0) {
            ret_alterar_operacao(_codigo_op, _valor_atualizado, -27, "O valor da operação é inválido");
        } else {
            bool encontrado_operacao = false;
            uint index_opracao = 0;
            for (uint i = 0; i < operacoes[msg.sender].codigo_op.length; i++) {
                if (equal(operacoes[msg.sender].codigo_op[i], _codigo_op)) {
                    encontrado_operacao = true;
                    index_opracao = i;
                    break;
                }
            }

            if (!encontrado_operacao) {
                ret_alterar_operacao(_codigo_op, _valor_atualizado, -28, "Código da operação inválido");
            } else {
                operacoes[msg.sender].valor_atualizado[index_opracao] = _valor_atualizado;

                ret_alterar_operacao(_codigo_op, _valor_atualizado, 0, "Valor da operação atualizado com sucesso");
            }
        }
    }

    function consultar_operacao(uint _posicao) constant returns (string, uint64, uint64) {
        return (operacoes[msg.sender].codigo_op[_posicao], operacoes[msg.sender].valor[_posicao], operacoes[msg.sender].valor_atualizado[_posicao]);
    }

    function contar_operacoes() constant returns (uint) {
        return (operacoes[msg.sender].codigo_op.length);
    }

    // apagar essa função para o contrato na versão final
    function consultar_operacao_aux(address _address, uint _posicao) constant returns (string, uint64) {
        return (operacoes[_address].codigo_op[_posicao], operacoes[_address].valor[_posicao]);
    }
    ///////////////////////////////////////////////////
    //fim operacoes
    ///////////////////////////////////////////////////

    ///////////////////////////////////////////////////
    //início alocacoes
    ///////////////////////////////////////////////////
    mapping (address => Alocacao) alocacoes; //address = é o da instituicao
    struct Alocacao
    {
        uint[] chave;
        string[] codigo_op;
        bool[] ativa; // true = pendente análise
    }

    function consultar_alocacao(uint _posicao) constant returns (uint, string, bool) {
        string memory codigo_op_aux = alocacoes[msg.sender].codigo_op[_posicao];
        uint chave_aux = alocacoes[msg.sender].chave[_posicao];

        if (!alocacoes[msg.sender].ativa[_posicao]) {
            chave_aux = 0;
            codigo_op_aux = "";
        }

        return (chave_aux, codigo_op_aux, alocacoes[msg.sender].ativa[_posicao]);
    }

    function contar_alocacoes() constant returns (uint) {
        return (alocacoes[msg.sender].chave.length);
    }
    ///////////////////////////////////////////////////
    //início alocacoes
    ///////////////////////////////////////////////////


    /**************************************************************************/
    /// @dev Does a byte-by-byte lexicographical comparison of two strings.
    /// @return a negative number if `_a` is smaller, zero if they are equal
    /// and a positive numbe if `_b` is smaller.
    function compare(string _a, string _b) returns (int) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        //@todo unroll the loop into increments of 32 and do full 32 byte comparisons
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
    }
    /// @dev Compares two strings and returns true iff they are equal.
    function equal(string _a, string _b) returns (bool) {
        return compare(_a, _b) == 0;
    }
    /// @dev Finds the index of the first occurrence of _needle in _haystack
    function indexOf(string _haystack, string _needle) returns (int)
    {
    	bytes memory h = bytes(_haystack);
    	bytes memory n = bytes(_needle);
    	if(h.length < 1 || n.length < 1 || (n.length > h.length))
    		return -1;
    	else if(h.length > (2**128 -1)) // since we have to be able to return -1 (if the char isn't found or input error), this function must return an "int" type with a max length of (2^128 - 1)
    		return -1;
    	else
    	{
    		uint subindex = 0;
    		for (uint i = 0; i < h.length; i ++)
    		{
    			if (h[i] == n[0]) // found the first char of b
    			{
    				subindex = 1;
    				while(subindex < n.length && (i + subindex) < h.length && h[i + subindex] == n[subindex]) // search until the chars don't match or until we reach the end of a or b
    				{
    					subindex++;
    				}
    				if(subindex == n.length)
    					return int(i);
    			}
    		}
    		return -1;
    	}
    }
}
