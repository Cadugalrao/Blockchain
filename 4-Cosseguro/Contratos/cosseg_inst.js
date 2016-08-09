
//comando para executar o arquivo: loadScript("cosseg_inst.js")

console.log(">>>>>>>>>>>> 1: Inicio do load!");

if(1==1) {
 
    var cosseguroABI = [{"constant":true,"inputs":[{"name":"_adress_aux","type":"address"},{"name":"_index_acordo","type":"uint256"}],"name":"consultar_acordo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint64"},{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"contar_apolices","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"},{"name":"_index_seguradora","type":"uint256"}],"name":"consultar_apolice_seguradora","outputs":[{"name":"","type":"string"},{"name":"","type":"uint64"},{"name":"","type":"uint64"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint16"}],"type":"function"},{"constant":false,"inputs":[{"name":"_index_apolice_cedido","type":"uint256"},{"name":"_index_acordo_aceito","type":"uint256"},{"name":"_addr_cedido","type":"address"}],"name":"autorizar_acordo","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"compare","outputs":[{"name":"","type":"int256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"equal","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"consultar_apolice","outputs":[{"name":"","type":"string"},{"name":"","type":"uint64"},{"name":"","type":"uint64"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"_index_apolice","type":"uint256"}],"name":"contar_seguradoras","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_haystack","type":"string"},{"name":"_needle","type":"string"}],"name":"indexOf","outputs":[{"name":"","type":"int256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_index_apolice","type":"uint256"},{"name":"_percent_acordo","type":"uint16"},{"name":"_addr_seguradora_aceito","type":"address"}],"name":"incluir_acordo","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_codigo","type":"string"},{"name":"_premio","type":"uint64"},{"name":"_cobertura","type":"uint64"},{"name":"_dt_vencimento","type":"uint256"}],"name":"incluir_apolice","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_index_acordo","type":"uint256"}],"name":"consultar_acordo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint64"},{"name":"","type":"bool"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"codigo","type":"string"},{"indexed":false,"name":"premio","type":"uint64"},{"indexed":false,"name":"cobertura","type":"uint64"},{"indexed":false,"name":"dt_vencimento","type":"uint256"},{"indexed":false,"name":"qtde_seguradoras","type":"uint256"},{"indexed":false,"name":"index_array_apolice","type":"uint256"},{"indexed":false,"name":"index_array_seguradoras","type":"uint256"},{"indexed":false,"name":"index_array_acordo","type":"uint256"},{"indexed":false,"name":"sucesso","type":"bool"},{"indexed":false,"name":"cod_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_incluir_apolice","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"index_apolice","type":"uint256"},{"indexed":false,"name":"percent_acordo","type":"uint64"},{"indexed":false,"name":"addr_seguradora_aceito","type":"address"},{"indexed":false,"name":"index_array_acordo","type":"uint256"},{"indexed":false,"name":"sucesso","type":"bool"},{"indexed":false,"name":"cod_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_incluir_acordo","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"index_apolice_cedido","type":"uint256"},{"indexed":false,"name":"index_acordo_aceito","type":"uint256"},{"indexed":false,"name":"addr_cedido","type":"address"},{"indexed":false,"name":"sucesso","type":"bool"},{"indexed":false,"name":"cod_retorno","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_autorizar_acordo","type":"event"}];

    var cosseguro = eth.contract(cosseguroABI).at("0xe3c88eeea579926792fec2e2a7ee18db4fd37f83");
}
/**/

console.log(">>>>>>>>>>>> 99: Fim do load!");