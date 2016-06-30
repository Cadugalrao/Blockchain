
var ABI_2 = [{ constant: false, inputs: [{ name: 'cpf', type: 'uint256' }, { name: 'valor', type: 'uint256' }, { name: 'observacao', type: 'bytes32' }], name: 'incluirBemParaGarantia', outputs: [], type: 'function'}, { constant: false, inputs: [], name: 'countRegistros', outputs: [{ name: '', type: 'uint256' }], type: 'function'}, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'registros', outputs: [{ name:'cpf', type: 'uint256' }, { name: 'empresa', type: 'address' }, { name: 'contrato', type: 'uint256' }, { name: 'valor', type:'uint256' }, { name: 'observacao', type: 'bytes32' }], type: 'function'}, { inputs: [], type: 'constructor'}]

var Address_2 = "0x0bb133e81f56a6bd51ac7d8704c848377d5cd21c";

var garantia = eth.contract(ABI_2).at(Address_2);

//garantia.countRegistros()
//garantia.incluirBemParaGarantia(11212, 123, "plata")
//garantia.countRegistros()
