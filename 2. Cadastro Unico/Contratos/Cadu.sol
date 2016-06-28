//contract mortal {
    /* Define variable owner of the type address*/
//    address owner;
    /* this function is executed at initialization and sets the owner of the contract */
//    function mortal() { owner = msg.sender; }
    /* Function to recover the funds on the contract */
//    function kill() { if (msg.sender == owner) suicide(owner); }
//}


//contract CadU is mortal {
contract CadU {
    /**********************************************/
    /**     Declarações gerais                   **/
    /**********************************************/
    uint public contador_permissao = 0;
    uint8 internal qtde_blocos = 4;

    address private _owner;

    /**********************************************/
    /**     Construtor                           **/
    /**********************************************/
    function CadU() {
        _owner = msg.sender;
    }


    /**********************************************/
    /**     Bloco 1 - Dados gerais               **/
    /**********************************************/
    struct Geral {
        bytes32 nome;
        uint8 dia_nasc;
        uint8 mes_nasc;
        uint8 ano_nasc; //só os dois ultimos caracteres
    }

    mapping (address => Geral) gerais;

    event ReturnCadBloco1(string descricao, bool success, bytes32 nome, uint8 dia_nasc, uint8 mes_nasc, uint8 ano_nascimento, string mensagem);

    function cadastro_alteracao_bloco1(bytes32 _nome,
                             uint8 _dia_nasc,
                             uint8 _mes_nasc,
                             uint8 _ano_nasc) { //só os dois ultimos caracteres
        bool erro = false;
        if (_nome == "") {
            ReturnCadBloco1("Cadastro Bloco 1", false, _nome, _dia_nasc, _mes_nasc, _ano_nasc, "Nome inválido");
            erro = true;
        } else if ((_dia_nasc == 0 || _dia_nasc > 31) ||
            (_dia_nasc > 31 &&
                ( _mes_nasc == 1 || _mes_nasc == 3 || _mes_nasc == 5 || _mes_nasc == 7 || _mes_nasc == 8 || _mes_nasc == 10 || _mes_nasc == 12 )
            ) ||
            (_dia_nasc > 30 &&
                ( _mes_nasc == 4 || _mes_nasc == 6 || _mes_nasc == 9 || _mes_nasc == 11 )
            ) ||
            (_dia_nasc > 29 && _mes_nasc == 2)
        ) {
            ReturnCadBloco1("Cadastro Bloco 1", false, _nome, _dia_nasc, _mes_nasc, _ano_nasc, "Dia do nascimento inválido");
            erro = true;
        } else if (_mes_nasc == 0 || _mes_nasc > 12) {
            ReturnCadBloco1("Cadastro Bloco 1", false, _nome, _dia_nasc, _mes_nasc, _ano_nasc, "Dia do nascimento inválido");
            erro = true;
        } else if (_ano_nasc == 0) {
            ReturnCadBloco1("Cadastro Bloco 1", false, _nome, _dia_nasc, _mes_nasc, _ano_nasc, "Dia do nascimento inválido");
            erro = true;
        } else {
            Geral geral = gerais[msg.sender];
            geral.nome = _nome;
            geral.dia_nasc = _dia_nasc;
            geral.mes_nasc = _mes_nasc;
            geral.ano_nasc = _ano_nasc;

            //event ReturnGarantia(int id_retorno, bytes32 descricao, bool success, uint codigo_item_acessado, bytes32 codigo, uint valor, bytes32 string_com_erro, int codigo_erro);
            ReturnCadBloco1("Cadastro Bloco 1", true, _nome, _dia_nasc, _mes_nasc, _ano_nasc, "Processamento realizado com sucesso");
        }
    }

    function consulta_gerais(address _pessoa) constant returns(bytes32 nome, uint8 dia_nasc, uint8 mes_nasc, uint8 ano_nasc) {
        uint8 _bloco = 1; //Sempre verificar se o número do bloco está correto
        address add_aux = 0;
        if (msg.sender != _pessoa) {
            for (var i = 0; i < contador_permissao; i++) {
                if (permissoes[i].pessoa == _pessoa && permissoes[i].autorizado == msg.sender && permissoes[i].bloco == _bloco) {
                    add_aux = _pessoa;
                    break;
                }
            }
        } else {
            add_aux = msg.sender;
        }

        if (add_aux != 0) {
            Geral g = gerais[add_aux];

            nome = g.nome;
            dia_nasc = g.dia_nasc;
            mes_nasc = g.mes_nasc;
            ano_nasc = g.ano_nasc;
        }
    }

    /**********************************************/
    /**     Bloco 2 - Dados dos documentos       **/
    /**********************************************/
    struct Documento {
        bytes32 cpf_cnpj;
        bytes32 RG;
    }

    mapping (address => Documento) documentos;

    /**********************************************/
    /**     Bloco 3 - Dados dos bens             **/
    /**********************************************/
    struct Bem {
        bytes2 tipo;
        bytes32 codigo;
    }

    mapping (address => Bem) bens;

    /**********************************************/
    /**     Bloco 4 - Dados do Facebook          **/
    /**********************************************/
    struct Facebook {
        bytes2 nome;
        bytes32 email;
    }

    mapping (address => Facebook) facebook;

    /**********************************************/
    /**     Permissao                            **/
    /**********************************************/
    struct Permissao {
        address pessoa;
        address autorizado;
        uint8 bloco;
    }

    mapping(uint => Permissao) public permissoes;

    event ReturnPermissao(string descricao, bool success, address pessoa, uint8 bloco, uint8 qtde_blocos, string mensagem);

    function liberacao_bloco(address _autorizado, uint8 _bloco) {
        bool erro = false;
        //validação address
        //if (_pessoa == "") {
        //    erro = true;
        //    ReturnPermissao("Inclusão de Permissao", false, _pessoa, _bloco, qtde_blocos, "Pessoa Inválida");
        //}

        if (msg.sender == _autorizado) { //validação autorizado
            erro = true;
            ReturnPermissao("Inclusão de Permissao", false, _autorizado, _bloco, qtde_blocos, "Não é necessário incluir permissão para você mesmo");
        } else if (_bloco > qtde_blocos || _bloco < 1) { //validação bloco
            erro = true;
            ReturnPermissao("Inclusão de Permissao", false, _autorizado, _bloco, qtde_blocos, "Bloco de Dados Inválido");
        } else { //caso não tenha erros
            permissoes[contador_permissao] = Permissao( msg.sender, _autorizado, _bloco );
            contador_permissao++;

            ReturnPermissao("Inclusão de Permissao", true, _autorizado, _bloco, qtde_blocos, "Cadastro realizado com sucesso");
        }
    }

    function bloqueio_bloco(address _autorizado, uint8 _bloco) {
        bool erro = false;
        //validação address
        //if (_autorizado == "") {
        //    erro = true;
        //    ReturnPermissao("Inclusão de Permissao", false, _pessoa, _bloco, qtde_blocos, "Pessoa Inválida");
        //}

        if (msg.sender == _autorizado) { //validação autorizado
            erro = true;
            ReturnPermissao("Bloqueio de Permissao", false, _autorizado, _bloco, qtde_blocos, "Não é há permissão para você mesmo");
        } else if (contador_permissao <= 0) { //validação contador
            erro = true;
            ReturnPermissao("Bloqueio de Permissao", false, _autorizado, _bloco, qtde_blocos, "Não há permissões cadastradas");
        } else if (_bloco > qtde_blocos || _bloco < 1) { //validação bloco
            erro = true;
            ReturnPermissao("Bloqueio de Permissao", false, _autorizado, _bloco, qtde_blocos, "Bloco de Dados Inválido");
        } else { //caso não tenha erros
            bool encontrado = false;
            for (uint c = 0; c < contador_permissao - 1; c++) {
                if (
                    permissoes[c].pessoa == msg.sender &&
                    permissoes[c].autorizado == _autorizado &&
                    permissoes[c].bloco == _bloco &&
                    permissoes[c].bloco > 0
                   ) {
                    permissoes[c].pessoa = 0;
                    permissoes[c].autorizado = 0;
                    permissoes[c].bloco = 0;
                    encontrado = true;
                    break;
                }
            }

            if (encontrado) {
                ReturnPermissao("Bloqueio de Permissao", true, _autorizado, _bloco, qtde_blocos, "Cadastro realizado com sucesso");
            } else {
                ReturnPermissao("Bloqueio de Permissao", false, _autorizado, _bloco, qtde_blocos, "O bloco informado não estava liberado para essa pessoa");
            }
        }
    }
}
