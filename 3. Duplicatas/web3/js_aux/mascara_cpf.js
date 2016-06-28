// JavaScript Document
//adiciona mascara de cnpj
function MascaraCNPJ(cnpj){
        if(mascaraInteiro(cnpj)==false){
                event.returnValue = false;
        }
        return formataCampo(cnpj, '00.000.000/0000-00', event);
}

//adiciona mascara de cep
function MascaraCep(cep){
                if(mascaraInteiro(cep)==false){
                event.returnValue = false;
        }
        return formataCampo(cep, '00.000-000', event);
}

//adiciona mascara de data
function MascaraData(data){
        if(mascaraInteiro(data)==false){
                event.returnValue = false;
        }
        return formataCampo(data, '00/00/0000', event);
}

//adiciona mascara ao telefone
function MascaraTelefone(tel){
        if(mascaraInteiro(tel)==false){
                event.returnValue = false;
        }
        return formataCampo(tel, '(00) 0000-0000', event);
}

//adiciona mascara ao CPF
function MascaraCPF(cpf){
        if(mascaraInteiro(cpf)==false){
                event.returnValue = false;
        }
        return formataCampo(cpf, '000.000.000-00', event);
}

//valida telefone
function ValidaTelefone(tel){
        exp = /\(\d{2}\)\ \d{4}\-\d{4}/
        if(!exp.test(tel.value))
                alert('Numero de Telefone Invalido!');
}

//valida CEP
function ValidaCep(cep){
        exp = /\d{2}\.\d{3}\-\d{3}/
        if(!exp.test(cep.value))
                alert('Numero de Cep Invalido!');
}

//valida data
function ValidaData(data){
        exp = /\d{2}\/\d{2}\/\d{4}/
        if(!exp.test(data.value))
                alert('Data Invalida!');
}

//valida o CPF digitado
function ValidarCPF(Objcpf){
        var cpf = Objcpf.value;
        exp = /\.|\-/g
        cpf = cpf.toString().replace( exp, "" );
        var digitoDigitado = eval(cpf.charAt(9)+cpf.charAt(10));
        var soma1=0, soma2=0;
        var vlr =11;

        for(i=0;i<9;i++){
                soma1+=eval(cpf.charAt(i)*(vlr-1));
                soma2+=eval(cpf.charAt(i)*vlr);
                vlr--;
        }
        soma1 = (((soma1*10)%11)==10 ? 0:((soma1*10)%11));
        soma2=(((soma2+(2*soma1))*10)%11);

        var digitoGerado=(soma1*10)+soma2;
        if(digitoGerado!=digitoDigitado) {
            alert('CPF Invalido!');
            $("#" + Objcpf.id).css('border', '1px solid red');
            return;
        }

        $("#" + Objcpf.id).css('border', 'none');
}

//valida numero inteiro com mascara
function mascaraInteiro(){
        if (event.keyCode < 48 || event.keyCode > 57){
                event.returnValue = false;
                return false;
        }
        return true;
}

//valida o CNPJ digitado
function ValidarCNPJ(ObjCnpj){
        var cnpj = ObjCnpj.value;
        var valida = new Array(6,5,4,3,2,9,8,7,6,5,4,3,2);
        var dig1= new Number;
        var dig2= new Number;

        exp = /\.|\-|\//g
        cnpj = cnpj.toString().replace( exp, "" );
        var digito = new Number(eval(cnpj.charAt(12)+cnpj.charAt(13)));

        for(i = 0; i<valida.length; i++){
                dig1 += (i>0? (cnpj.charAt(i-1)*valida[i]):0);
                dig2 += cnpj.charAt(i)*valida[i];
        }
        dig1 = (((dig1%11)<2)? 0:(11-(dig1%11)));
        dig2 = (((dig2%11)<2)? 0:(11-(dig2%11)));

        if(((dig1*10)+dig2) != digito) {
            alert('CNPJ Invalido! ');
            $("#" + ObjCnpj.id).css('border', '1px solid red');
            return;
        }

        $("#" + ObjCnpj.id).css('border', 'none');
}

//formata de forma generica os campos
function formataCampo(campo, Mascara, evento) {
        var boleanoMascara;

        var Digitato = evento.keyCode;
        exp = /\-|\.|\/|\(|\)| /g
        campoSoNumeros = campo.value.toString().replace( exp, "" );

        var posicaoCampo = 0;
        var NovoValorCampo="";
        var TamanhoMascara = campoSoNumeros.length;;

        if (Digitato != 8) { // backspace
                for(i=0; i<= TamanhoMascara; i++) {
                        boleanoMascara  = ((Mascara.charAt(i) == "-") || (Mascara.charAt(i) == ".")
                                                                || (Mascara.charAt(i) == "/"))
                        boleanoMascara  = boleanoMascara || ((Mascara.charAt(i) == "(")
                                                                || (Mascara.charAt(i) == ")") || (Mascara.charAt(i) == " "))
                        if (boleanoMascara) {
                                NovoValorCampo += Mascara.charAt(i);
                                  TamanhoMascara++;
                        }else {
                                NovoValorCampo += campoSoNumeros.charAt(posicaoCampo);
                                posicaoCampo++;
                          }
                  }
                campo.value = NovoValorCampo;
                  return true;
        }else {
                return true;
        }
}

function valida_cpf_cnpj(obj) {
    var dado = obj.val().toString().trim();
    if (dado.length == 0)
        return;

    dado = formata_numero_subida(dado);
	obj.val(dado);
	
	if (dado.length <= 11) {
        MascaraCPF(obj[0]);
        ValidarCPF(obj[0]);
    } else {
        MascaraCNPJ(obj[0]);
        ValidarCNPJ(obj[0]);
    }
}

function MascaraCPF_CNPJ(obj) {
	var dado = obj.val().toString().trim();
    if (dado.length == 0)
        return;
	
	dado = formata_numero_subida(dado);
	obj.val(dado);
	
    if (dado.length <= 11) {
        MascaraCPF(obj[0]);
    } else {
        MascaraCNPJ(obj[0]);
    }
}


/**
 * Retorna o(s) numDig Dígitos de Controle Módulo 11 do
 * dado, limitando o Valor de Multiplicação em limMult,
 * multiplicando a soma por 10, se indicado:
 *
 *    Números Comuns:   numDig:   limMult:   x10:
 *      CPF                2         12      true
 *      CNPJ               2          9      true
 *      PIS,C/C,Age        1          9      true
 *      RG SSP-SP          1          9      false
 *
 * @version                V5.0 - Mai/2001~Out/2015
 * @author                 CJDinfo
 * @param  string  dado    String dado contendo o número (sem o DV)
 * @param  int     numDig  Número de dígitos a calcular
 * @param  int     limMult Limite de multiplicação 
 * @param  boolean x10     Se true multiplica soma por 10
 * @return string          Dígitos calculados
 */
function calculaDigitoMod11(dado, numDig, limMult, x10){
  
  var mult, soma, i, n, dig;
    
  if(!x10) numDig = 1;
  for(n=1; n<=numDig; n++){
    soma = 0;
    mult = 2;
    for(i=dado.length-1; i>=0; i--){
      soma += (mult * parseInt(dado.charAt(i)));
      if(++mult > limMult) mult = 2;
    }
    if(x10){
      dig = ((soma * 10) % 11) % 10;
    } else {
      dig = soma % 11;
      if(dig == 10) dig = "X";
    }
    dado += (dig);
  }
  return dado.substr(dado.length-numDig, numDig);
}