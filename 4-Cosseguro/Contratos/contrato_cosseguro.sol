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
        uint8[] autorizado; //0 = Sem resposta; 1 = Autorizado; 2 = Não autorizado;
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
            apolice_aux.autorizado.push(0);

            if (_percent2 > 0) {
                apolice_aux.addr_seguradora.push(_seguradora2);
                apolice_aux.percent.push(_percent2);
                apolice_aux.autorizado.push(0);
                acordos[_seguradora2].index_apolice.push(_qtdeApolices);
            }

            if (_percent3 > 0) {
                apolice_aux.addr_seguradora.push(_seguradora3);
                apolice_aux.percent.push(_percent3);
                apolice_aux.autorizado.push(0);
                acordos[_seguradora3].index_apolice.push(_qtdeApolices);
            }

            //event ret_incluir_apolice(string codigo, uint64 premio, uint64 cobertura, uint dt_vencimento, int qtde_seguradoras, int index_array_apolice, int index_array_seguradoras, int index_array_acordo, bool sucesso, int cod_retorno, string descricao);
            ret_incluir_apolice(_codigo_apolice, _premio_apolice, _cobertura_apolice, _dt_vencimento_apolice, _seguradora1, _percent1, _seguradora2, _percent2, _seguradora3, _percent3, true, 0, "Apolice cadastrada com sucesso");

            _qtdeApolices = _qtdeApolices + 1;
        }
    }

    function consultar_apolice_seguradoras(uint _index_apolice) constant returns (address, uint, uint8, address, uint, uint8, address, uint, uint8) {
        Apolice memory apolice_aux = apolices[_index_apolice];
        
        if (apolices[_index_apolice].addr_seguradora.length == 3 && apolices[_index_apolice].owner == msg.sender) {
            return (apolice_aux.addr_seguradora[0], apolice_aux.percent[0], apolice_aux.autorizado[0], apolice_aux.addr_seguradora[1], apolice_aux.percent[1], apolice_aux.autorizado[1], apolice_aux.addr_seguradora[2], apolice_aux.percent[2], apolice_aux.autorizado[2]);    
        } else if (apolice_aux.addr_seguradora.length == 2 && apolice_aux.owner == msg.sender) {
            return (apolice_aux.addr_seguradora[0], apolice_aux.percent[0], apolice_aux.autorizado[0], apolice_aux.addr_seguradora[1], apolice_aux.percent[1], apolice_aux.autorizado[1], 0, 0, 0);    
        } else  if (apolice_aux.addr_seguradora.length == 1 && apolice_aux.owner == msg.sender) {
            return (apolice_aux.addr_seguradora[0], apolice_aux.percent[0], apolice_aux.autorizado[0], 0, 0, 0, 0, 0, 0);    
        } else if (apolice_aux.owner == msg.sender) {
            return (0, 0, 0, 0, 0, 0, 0, 0, 0);
        } else {
            for (uint iSeg = 0; iSeg < apolice_aux.addr_seguradora.length; iSeg++) {
                if (apolice_aux.addr_seguradora[iSeg] == msg.sender) {
                    break;
                }
            }

            if (iSeg < apolice_aux.addr_seguradora.length) {
                return (apolice_aux.addr_seguradora[iSeg], apolice_aux.percent[iSeg], apolice_aux.autorizado[iSeg], 0, 0, 0, 0, 0, 0);
            } else {
                return (0, 0, 0, 0, 0, 0, 0, 0, 0);
            }
        }
    }

    function consultar_apolice(uint _index_apolice) constant returns (string, uint64, uint64, uint) {

        if (apolices[_index_apolice].addr_seguradora.length == 3 && apolices[_index_apolice].owner == msg.sender) {
            return (apolices[_index_apolice].codigo, apolices[_index_apolice].premio, apolices[_index_apolice].cobertura, apolices[_index_apolice].dt_vencimento);    
        } else if (apolices[_index_apolice].addr_seguradora.length == 2 && apolices[_index_apolice].owner == msg.sender) {
            return (apolices[_index_apolice].codigo, apolices[_index_apolice].premio, apolices[_index_apolice].cobertura, apolices[_index_apolice].dt_vencimento);    
        } else  if (apolices[_index_apolice].addr_seguradora.length == 1 && apolices[_index_apolice].owner == msg.sender) {
            return (apolices[_index_apolice].codigo, apolices[_index_apolice].premio, apolices[_index_apolice].cobertura, apolices[_index_apolice].dt_vencimento);    
        } else if (apolices[_index_apolice].owner == msg.sender) {
            return (apolices[_index_apolice].codigo, apolices[_index_apolice].premio, apolices[_index_apolice].cobertura, apolices[_index_apolice].dt_vencimento);
        } else {
            for (uint iSeg = 0; iSeg < apolices[_index_apolice].addr_seguradora.length; iSeg++) {
                if (apolices[_index_apolice].addr_seguradora[iSeg] == msg.sender) {
                    break;
                }
            }

            if (iSeg < apolices[_index_apolice].addr_seguradora.length) {
                return (apolices[_index_apolice].codigo, apolices[_index_apolice].premio, apolices[_index_apolice].cobertura, apolices[_index_apolice].dt_vencimento);
            } else {
                return ("", 0, 0, 0);
            }
        }
    }

    /*
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
    */

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

    event ret_autorizar_acordo(uint index_apolice_cedido, bool sucesso, int cod_retorno, string descricao);
    function autorizar_acordo(uint _index_apolice_cedido, uint8 _autorizado) {
        if (_index_apolice_cedido >= _qtdeApolices) {
            ret_autorizar_acordo(_index_apolice_cedido, false, -90, "Index da apolice invalido");
        } else {
            Apolice memory apolice_aux = apolices[_index_apolice_cedido];
            
            for (uint iSeg = 0; iSeg < apolice_aux.addr_seguradora.length; iSeg++) {
                if (apolice_aux.addr_seguradora[iSeg] == msg.sender) {
                    break;
                }
            }

            if (iSeg < apolice_aux.addr_seguradora.length) {
                apolices[_index_apolice_cedido].autorizado[iSeg] = _autorizado;
            } else {
                ret_autorizar_acordo(_index_apolice_cedido, false, -120, "Index da apolice invalido");
            }
            
        }
    }

    function consultar_acordo(uint _index_acordo) constant returns (uint) {
        return (acordos[msg.sender].index_apolice[_index_acordo]);
    }
    
    function contar_acordos() constant returns (uint) {
        return (acordos[msg.sender].index_apolice.length);
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
}
