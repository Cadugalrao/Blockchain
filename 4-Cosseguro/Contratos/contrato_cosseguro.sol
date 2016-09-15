pragma solidity ^0.4.1;

contract Cosseguro {
    address private _owner;

    function Cosseguro() {
        // construtor
        _owner = msg.sender;
        _qtdeApolices = 0;
    }

    ///////////////////////////////////////////////////
    //início apolices
    ///////////////////////////////////////////////////
    mapping (uint => Apolice) apolices;
    struct Apolice {
        string codigo;
        uint64 premio;
        uint64 cobertura;
        uint dt_vencimento;
        address owner;
        address[] addr_seguradora;
        uint16[] percent;

    }
    uint private _qtdeApolices;

    event ret_incluir_apolice(string codigo_apolice, uint64 premio_apolice, uint64 cobertura_apolice, uint dt_vencimento_apolice, address seguradora1, uint16 percent1, address seguradora2, uint16 percent2, address seguradora3, uint16 percent3, bool sucesso, int cod_retorno, string descricao);
    function incluir_apolice(string _codigo_apolice, uint64 _premio_apolice, uint64 _cobertura_apolice, uint _dt_vencimento_apolice, address _seguradora1, uint16 _percent1, address _seguradora2, uint16 _percent2, address _seguradora3, uint16 _percent3) {
        Apolice apolice_aux = apolices[_qtdeApolices];

        if (equal(_codigo_apolice, "")) {
            ret_incluir_apolice(_codigo_apolice, _premio_apolice, _cobertura_apolice, _dt_vencimento_apolice, _seguradora1, _percent1, _seguradora2, _percent2, _seguradora3, _percent3, false, -10, "Codigo inválido");
        } else if (_premio_apolice == 0) {
            ret_incluir_apolice(_codigo_apolice, _premio_apolice, _cobertura_apolice, _dt_vencimento_apolice, _seguradora1, _percent1, _seguradora2, _percent2, _seguradora3, _percent3, false, -20, "Premio inválido");
        } else if (_cobertura_apolice == 0) {
            ret_incluir_apolice(_codigo_apolice, _premio_apolice, _cobertura_apolice, _dt_vencimento_apolice, _seguradora1, _percent1, _seguradora2, _percent2, _seguradora3, _percent3, false, -30, "Cobertura inválida");
        } else if (_dt_vencimento_apolice < block.timestamp) {
            ret_incluir_apolice(_codigo_apolice, _premio_apolice, _cobertura_apolice, _dt_vencimento_apolice, _seguradora1, _percent1, _seguradora2, _percent2, _seguradora3, _percent3, false, -40, "Data de vencimento inválida");
        } else if (_seguradora1 == 0) {
            ret_incluir_apolice(_codigo_apolice, _premio_apolice, _cobertura_apolice, _dt_vencimento_apolice, _seguradora1, _percent1, _seguradora2, _percent2, _seguradora3, _percent3, false, -41, "Endereco da primeira coseguradora invalida");
        } else if (_percent1 == 0 || _percent1 > 99) {
            ret_incluir_apolice(_codigo_apolice, _premio_apolice, _cobertura_apolice, _dt_vencimento_apolice, _seguradora1, _percent1, _seguradora2, _percent2, _seguradora3, _percent3, false, -42, "Percentual da primeira coseguradora invalido");
        } else if (_seguradora2 != 0 && (_percent2 == 0 || _percent2 > 99)) {
            ret_incluir_apolice(_codigo_apolice, _premio_apolice, _cobertura_apolice, _dt_vencimento_apolice, _seguradora1, _percent1, _seguradora2, _percent2, _seguradora3, _percent3, false, -43, "Segunda coseguradora invalida");
        } else if (_seguradora3 != 0 && (_percent3 == 0 || _percent3 > 99)) {
            ret_incluir_apolice(_codigo_apolice, _premio_apolice, _cobertura_apolice, _dt_vencimento_apolice, _seguradora1, _percent1, _seguradora2, _percent2, _seguradora3, _percent3, false, -44, "Terceira coseguradora invalida");
        } else if (_percent1 + _percent2 + _percent3 > 99) {
            ret_incluir_apolice(_codigo_apolice, _premio_apolice, _cobertura_apolice, _dt_vencimento_apolice, _seguradora1, _percent1, _seguradora2, _percent2, _seguradora3, _percent3, false, -44, "Percentual das coseguradoras maior que 99");
        } else {
            apolice_aux.codigo = _codigo_apolice;
            apolice_aux.premio = _premio_apolice;
            apolice_aux.cobertura = _cobertura_apolice;
            apolice_aux.dt_vencimento = _dt_vencimento_apolice;
            apolice_aux.owner = msg.sender;

            apolice_aux.addr_seguradora.push(_seguradora1);
            apolice_aux.percent.push(_percent1);

            apolice_aux.addr_seguradora.push(_seguradora2);
            apolice_aux.percent.push(_percent2);

            apolice_aux.addr_seguradora.push(_seguradora3);
            apolice_aux.percent.push(_percent3);
            
            //event ret_incluir_apolice(string codigo, uint64 premio, uint64 cobertura, uint dt_vencimento, int qtde_seguradoras, int index_array_apolice, int index_array_seguradoras, int index_array_acordo, bool sucesso, int cod_retorno, string descricao);
            ret_incluir_apolice(_codigo_apolice, _premio_apolice, _cobertura_apolice, _dt_vencimento_apolice, _seguradora1, _percent1, _seguradora2, _percent2, _seguradora3, _percent3, true, 0, "Apolice cadastrada com sucesso");

            _qtdeApolices = _qtdeApolices + 1;
        }
    }

    function consultar_apolice(uint _index_apolice) constant returns (string, uint64, uint64, uint, uint, address, uint, address, uint, address, uint) {
        Apolice memory apolice_aux = apolices[_index_apolice];

        uint qtde_seguradoras = apolice_aux.addr_seguradora.length;

        if (qtde_seguradoras == 3 && apolice_aux.owner == msg.sender) {
            return (apolice_aux.codigo, apolice_aux.premio, apolice_aux.cobertura, apolice_aux.dt_vencimento, qtde_seguradoras, apolice_aux.addr_seguradora[0], 0, apolice_aux.addr_seguradora[1], 0, apolice_aux.addr_seguradora[2], 0);    
        } else if (qtde_seguradoras == 2 && apolice_aux.owner == msg.sender) {
            return (apolice_aux.codigo, apolice_aux.premio, apolice_aux.cobertura, apolice_aux.dt_vencimento, qtde_seguradoras, apolice_aux.addr_seguradora[0], 0, apolice_aux.addr_seguradora[1], 0, 0, 0);    
        } else  if (qtde_seguradoras == 1 && apolice_aux.owner == msg.sender) {
            return (apolice_aux.codigo, apolice_aux.premio, apolice_aux.cobertura, apolice_aux.dt_vencimento, qtde_seguradoras, apolice_aux.addr_seguradora[0], 0, 0, 0, 0, 0);    
        } else if (apolice_aux.owner == msg.sender) {
            return (apolice_aux.codigo, apolice_aux.premio, apolice_aux.cobertura, apolice_aux.dt_vencimento, qtde_seguradoras, 0, 0, 0, 0, 0, 0);
        } else {
            return ("", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
    }

    function consultar_apolice_seguradora(uint _index_apolice, uint _index_seguradora) constant returns (string, uint64, uint64, uint, address, uint16, bool) {
        Apolice memory apolice_aux = apolices[_index_apolice];
        
        if (apolice_aux.owner != msg.sender) {
            return ("", 0, 0, 0, 0, 0, false);
        } else {
            uint qtde_seguradoras = apolice_aux.addr_seguradora.length;

            if (_index_seguradora >= apolice_aux.addr_seguradora.length) {
                return (apolice_aux.codigo, apolice_aux.premio, apolice_aux.cobertura, apolice_aux.dt_vencimento, 0, 0, false);
            } else {
                address addr_seguradora_aux = apolice_aux.addr_seguradora[_index_seguradora];
                Acordo memory acordo_aux = acordos[addr_seguradora_aux];
                uint index_acordo_aux =  0;
                return (apolice_aux.codigo, apolice_aux.premio, apolice_aux.cobertura, apolice_aux.dt_vencimento, addr_seguradora_aux, 0, false);
            }
        }
    }

	function contar_apolices() constant returns (uint) {
        return (_qtdeApolices);
    }

	function contar_seguradoras(uint _index_apolice) constant returns (uint) {
        if (apolices[_index_apolice].owner != msg.sender) {
            return (0);
        } else {
            return (apolices[_index_apolice].addr_seguradora.length);
        }
    }

	function contar_index_acordo(uint _index_apolice) constant returns (uint) {
        if (apolices[_index_apolice].owner != msg.sender) {
            return (0);
        } else {
            return (0);
        }
    }

    //apagar para a versão final do contrato
    function apagar_consultar_index_acordo(uint _index_apolice, uint _index_acordo) constant returns (uint) {
        Apolice memory apolice_aux = apolices[_index_apolice];

        return (0);
    }

    //apagar para a versão final do contrato
    function apagar_consultar_apolice_aux(uint _index_apolice) constant returns (string, uint64, uint64, uint, uint, address, uint) {
        Apolice memory apolice_aux = apolices[_index_apolice];
        /*
        string codigo;
        uint64 premio;
        uint64 cobertura;
        uint dt_vencimento;
        uint qtde_seguradoras;
        address[] addr_seguradora;
        uint[] index_acordo;
        */
        uint qtde_seguradoras = apolice_aux.addr_seguradora.length;

        return (apolice_aux.codigo, apolice_aux.premio, apolice_aux.cobertura, apolice_aux.dt_vencimento, qtde_seguradoras, apolice_aux.addr_seguradora[0], 0);
    }
    ///////////////////////////////////////////////////
    //fim apolices
    ///////////////////////////////////////////////////



    ///////////////////////////////////////////////////
    //início acordos
    ///////////////////////////////////////////////////
    mapping (address => Acordo) acordos; //addres = address da instituicao
    struct Acordo {
        uint[] index_apolice;

    }

    event ret_incluir_acordo(uint index_apolice, uint64 percent_acordo, address addr_seguradora_aceito, uint index_array_acordo, bool sucesso, int cod_retorno, string descricao);
    function incluir_acordo(uint _index_apolice, uint16 _percent_acordo, address _addr_seguradora_aceito) {
        if (_index_apolice >= _qtdeApolices) {
            ret_incluir_acordo(_index_apolice, _percent_acordo, _addr_seguradora_aceito, 0, false, -50, "Index da apolice invalido");
        } else {
            Apolice apolice_aux = apolices[_index_apolice];

            if (apolice_aux.addr_seguradora[0] != msg.sender) {
                ret_incluir_acordo(_index_apolice, _percent_acordo, _addr_seguradora_aceito, 0, false, -60, "Instituicao solicitante nao eh responsavel pela apolice");
            } else if (_percent_acordo > 99) {
                ret_incluir_acordo(_index_apolice, _percent_acordo, _addr_seguradora_aceito, 0, false, -70, "Percentual invalido");
            } else {
                uint qtde_seguradoras = contar_seguradoras(_index_apolice);

                address _addr_seguradora_apolice;
                uint _index_acordo_apolice;
                uint16 _acordo_percent_aux = 0;
                _index_acordo_apolice = 0;

                if (0 - _percent_acordo <= 0) {
                    ret_incluir_acordo(_index_apolice, _percent_acordo, _addr_seguradora_aceito, 0, false, -75, "Percentual invalido. Retira toda a participacao da seguradora principal");
                } else {
                    _acordo_percent_aux = _percent_acordo;
                    for (uint iAcordos = 1; iAcordos < qtde_seguradoras; iAcordos++) {
                        _addr_seguradora_apolice = apolice_aux.addr_seguradora[iAcordos];
                        _index_acordo_apolice = 0;

                        if (iAcordos == 0) {
                            _acordo_percent_aux =+ 0 - _percent_acordo;
                        } else {
                            _acordo_percent_aux =+ 0;
                        }
                    }

                    if (_acordo_percent_aux >= 100) {
                        ret_incluir_acordo(_index_apolice, _percent_acordo, _addr_seguradora_aceito, 0, false, -80, "Percentual invalido. Ultrapassa a soma de 100.");
                    } else {
                        uint index_array_acordo = acordos[_addr_seguradora_aceito].index_apolice.push(_index_apolice);
                        //acordos[_addr_seguradora_aceito].percent.push(_percent_acordo);
                        //acordos[_addr_seguradora_aceito].autorizado.push(false); //autorização pendente
                        
                        uint index_array_seguradoras = apolice_aux.addr_seguradora.push(_addr_seguradora_aceito);
                        //apolice_aux.index_acordo.push(index_array_acordo);

                        ret_incluir_acordo(_index_apolice, _percent_acordo, _addr_seguradora_aceito, index_array_acordo, true, 0, "Acordo cadastrado com sucesso");
                    }
                }
            }
        }
    }

    event ret_autorizar_acordo(uint index_apolice_cedido, uint index_acordo_aceito, address addr_cedido, bool sucesso, int cod_retorno, string descricao);
    function autorizar_acordo(uint _index_apolice_cedido, uint _index_acordo_aceito, address _addr_cedido) {
        if (_index_apolice_cedido >= _qtdeApolices) {
            ret_autorizar_acordo(_index_apolice_cedido, _index_acordo_aceito, _addr_cedido, false, -90, "Index da apolice invalido");
        } else {
            Apolice memory apolice_aux = apolices[_index_apolice_cedido];
            address addr_cedido_aux = apolice_aux.addr_seguradora[0];
            uint index_acordo_cedido_aux = 0;

            uint qtde_acordos = 0;
            
            if (addr_cedido_aux != _addr_cedido) {
                ret_autorizar_acordo(_index_apolice_cedido, _index_acordo_aceito, 0, false, -100, "Index da apolice invalido");
            } else if (_index_acordo_aceito <= qtde_acordos) {
                ret_autorizar_acordo(_index_apolice_cedido, _index_acordo_aceito, 0, false, -110, "Index da apolice invalido");
            } else if (0 == 0) {
                ret_autorizar_acordo(_index_apolice_cedido, _index_acordo_aceito, 0, false, -120, "Index da apolice invalido");
            } else {
                //acordos[msg.sender].autorizado[_index_acordo_aceito] = true;
                //acordos[addr_cedido_aux].percent[index_acordo_cedido_aux] =- acordos[msg.sender].percent[_index_acordo_aceito];
            }
        }
    }

    /*
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
    */

    function consultar_acordo(uint _index_acordo) constant returns (uint, uint64, bool) {
        return (acordos[msg.sender].index_apolice[_index_acordo], 0, false);
    }

    function consultar_acordo_aceito(uint _index_apolice, address _adress_aux, uint _index_acordo) constant returns (uint64, bool) {
        if (apolices[_index_apolice].owner != msg.sender) {
            return (0, false);
        } else {
            bool addr_encontrado = false;

            for (var i = 0; i < apolices[_index_apolice].addr_seguradora.length; i++) {
                if (apolices[_index_apolice].addr_seguradora[i] == _adress_aux)
                    addr_encontrado = true;
            }

            if (!addr_encontrado) {
                return (0, false);
            } else {
                return (0, false);
            }
        }
    }

    // apagar essa função para o contrato na versão final
    function apagar_consultar_acordo_aux(address _adress_aux, uint _index_acordo) constant returns (uint, uint64, bool) {
        return (acordos[_adress_aux].index_apolice[_index_acordo], 0, false);
    }
    ///////////////////////////////////////////////////
    //fim acordos
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
