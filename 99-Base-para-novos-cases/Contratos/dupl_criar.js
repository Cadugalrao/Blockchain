//comando para executar o arquivo: loadScript("dupl_criar.js")

console.log(">>>>>>>>>>>> Inicio do JS")

//contract address do localhost: 0xc2e27ecef57119d00598f784c5ec6f796702a517

var gestaoduplicataContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"_posicao","type":"uint256"}],"name":"consultar_operacao","outputs":[{"name":"","type":"string"},{"name":"","type":"uint64"},{"name":"","type":"uint64"}],"type":"function"},{"constant":true,"inputs":[],"name":"contar_alocacoes","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"compare","outputs":[{"name":"","type":"int256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"equal","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"contar_operacoes","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"},{"name":"_posicao","type":"uint256"}],"name":"consultar_operacao_aux","outputs":[{"name":"","type":"string"},{"name":"","type":"uint64"}],"type":"function"},{"constant":false,"inputs":[{"name":"_haystack","type":"string"},{"name":"_needle","type":"string"}],"name":"indexOf","outputs":[{"name":"","type":"int256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_codigo_op","type":"string"},{"name":"_valor_atualizado","type":"uint64"}],"name":"alterar_operacao","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_chave","type":"uint256"},{"name":"_cnpj_emissor","type":"uint256"},{"name":"_cpf_cnpj_sacado","type":"uint256"},{"name":"_valor","type":"uint64"},{"name":"_situacao","type":"uint8"}],"name":"alterar_duplicata","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_posicao","type":"uint256"}],"name":"consultar_duplicata_liberada","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"contar_duplicatas_liberadas","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"_chave","type":"uint256"}],"name":"consultar_duplicata","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint64"},{"name":"","type":"uint8"},{"name":"","type":"string"},{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_codigo_op","type":"string"},{"name":"_valor","type":"uint64"}],"name":"incluir_operacao","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_posicao","type":"uint256"}],"name":"consultar_alocacao","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_chave","type":"uint256"},{"name":"_cnpj_emissor","type":"uint256"},{"name":"_cpf_cnpj_sacado","type":"uint256"},{"name":"_valor","type":"uint64"},{"name":"_situacao","type":"uint8"},{"name":"_codigo_op","type":"string"}],"name":"incluir_duplicata","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"chave","type":"uint256"},{"indexed":false,"name":"cnpj_emissor","type":"uint256"},{"indexed":false,"name":"cpf_cnpj_sacado","type":"uint256"},{"indexed":false,"name":"valor","type":"uint64"},{"indexed":false,"name":"situacao","type":"uint8"},{"indexed":false,"name":"codigo_op","type":"string"},{"indexed":false,"name":"index_alocacao","type":"uint256"},{"indexed":false,"name":"cod_erro","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_incluir_duplicata","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"chave","type":"uint256"},{"indexed":false,"name":"cnpj_emissor","type":"uint256"},{"indexed":false,"name":"cpf_cnpj_sacado","type":"uint256"},{"indexed":false,"name":"valor","type":"uint64"},{"indexed":false,"name":"situacao","type":"uint8"},{"indexed":false,"name":"cod_erro","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_alterar_duplicata","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"codigo_op","type":"string"},{"indexed":false,"name":"valor","type":"uint64"},{"indexed":false,"name":"cod_erro","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_incluir_operacao","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"codigo_op","type":"string"},{"indexed":false,"name":"valor_atualizado","type":"uint64"},{"indexed":false,"name":"cod_erro","type":"int256"},{"indexed":false,"name":"descricao","type":"string"}],"name":"ret_alterar_operacao","type":"event"}]);
var gestaoduplicata = gestaoduplicataContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '606060405260008054600160a060020a03191633179055613508806100246000396000f3606060405236156100b95760e060020a60003504632a828e1d81146100bb57806335d22d80146101ef5780633a96fdd71461020f57806346bdca9a1461032f57806363ef9362146103bf5780637102488b146103e05780638a0807b7146104c257806395cde33c14610597578063a43c1c5114610601578063a853a397146106c1578063b676f53f1461070b578063c61c49f814610716578063cc8aaa2c14610836578063d0615b4d1461089e578063ed0680c314610944575b005b610ab460043560408051602081810183526000808352600160a060020a033316815260039091529182208054919291829190859081101561000257508082526020822033600160a060020a0316835260019190910180549186019186908110156100025790600052602060002090600491828204019190066008029054600160a060020a033316600090815260036020526040902060020180546101009390930a9091046001604060020a0316918790811015610002575083526040805160208086206004808b0491909101548654600260018216156101009081026000190190921604601f8101859004850286018501909652858552918b0660080290910a90046001604060020a0316928591830182828015610d325780601f10610d0757610100808354040283529160200191610d32565b610b42600160a060020a0333166000908152600460205260409020545b90565b6040805160206004803580820135601f8101849004840285018401909552848452610b42949193602493909291840191908190840183828082843750506040805160208835808b0135601f81018390048302840183019094528383529799986044989297509190910194509092508291508401838280828437509496505050505050505b604080516020818101835260009182905282519081019092529081905282518251849184918490829010156102c757825191505b5060005b81811015610d4657828181518110156100025790602001015160f860020a900460f860020a02600160f860020a0319168482815181101561000257016020015160f860020a9081900402600160f860020a0319161015610d5a576000199450610dd5565b6040805160206004803580820135601f8101849004840285018401909552848452610b54949193602493909291840191908190840183828082843750506040805160208835808b0135601f81018390048302840183019094528383529799986044989297509190910194509092508291508401838280828437509496505050505050505b6000610ddf8383610293565b610b42600160a060020a03331660009081526003602052604090205461020c565b610b6860043560243560408051602081810183526000808352600160a060020a0386168152600390915291822080549192918490811015610002575080825260208220600160a060020a03861683526001919091018054918501918590811015610002575082526020808320604080516004808904909301548554600260018216156101009081026000190190921604601f810187900487028401870190945283835293890660080290930a9092046001604060020a031692849190830182828015610e145780601f10610de957610100808354040283529160200191610e14565b6040805160206004803580820135601f8101849004840285018401909552848452610b42949193602493909291840191908190840183828082843750506040805160208835808b0135601f8101839004830284018301909452838352979998604498929750919091019450909250829150840183828082843750949650505050505050604080516020818101835260009182905282519081019092529081905282518390839083908190600190108061057c575060018351105b80610588575083518351115b15610e26576000199450610dd5565b6040805160206004803580820135601f81018490048402850184019095528484526100b99491936024939092918401919081908401838280828437509496505093359350505050600060006000610f4e8560206040519081016040528060008152602001506103b3565b6100b960043560243560443560643560843560008581526001602052604081206003810154909160e060020a90910460ff161415611463576040805187815260208181018890528183018790526001604060020a038616606083015260ff8516608083015260171960a083015260e060c083018190528201527f41206475706c696361746120636f6e73746120636f6d6f206c6962657261646161010082015290516000805160206134c8833981519152918190036101200190a1611a83565b610b4260043560006002600050828154811015610002575081527f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace820154811415611c0f57611c46565b610b4260025461020c565b610be660043560408051602081810183526000808352835160e081810186528282528184018390528186018390526060828101849052608083810185905260a084810186905260c094850186905288518088018a528681528a875260018089528a88208b519687018c5280548752908101549886019890985260028801549985019990995260038701546001604060020a03811693850193909352604060020a8304600160a060020a03169184019190915260e060020a90910460ff1690820181905260049490940154918101919091529093849384938493849384929081841415611c4b575060408051808201909152600881527f4c696265726164610000000000000000000000000000000000000000000000006020820152611d5f565b6040805160206004803580820135601f81018490048402850184019095528484526100b9949193602493909291840191908190840183828082843750949650509335935050505060006000611d958460206040519081016040528060008152602001506103b3565b610c8a6004356040805160208181018352600080835283518083018552818152600160a060020a0333168252600490925292832060010180548492918391879081101561000257508152602080822060408051918901805460026001821615610100026000190190911604601f810185900485028401850190925281835291928301828280156124cc5780601f106124a1576101008083540402835291602001916124cc565b604080516020601f60a4356004818101359283018490048402850184019095528184526100b99480359460248035956044359560643595608435959460c49490939101919081908401838280828437509496505050505050506000868152600160205260408120908080888114156125be576000805160206134888339815191528a8a8a8a8a8a600060001960405180898152602001888152602001878152602001866001604060020a031681526020018560ff16815260200180602001848152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015610a6a5780820380516001836020036101000a031916815260200191505b50928303905250601e81527f4f20434e504a20646f20656d6973736f7220c3a920696e76c3a16c69646f0000602082015260408051918290030198509650505050505050a16132c8565b6040518080602001846001604060020a03168152602001836001604060020a031681526020018281038252858181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015610b325780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b60408051918252519081900360200190f35b604080519115158252519081900360200190f35b6040518080602001836001604060020a031681526020018281038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015610bd75780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b60405180888152602001878152602001868152602001856001604060020a031681526020018460ff168152602001806020018381526020018281038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015610c765780820380516001836020036101000a031916815260200191505b509850505050505050505060405180910390f35b604051808481526020018060200183151581526020018281038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015610b325780820380516001836020036101000a031916815260200191505094505050505060405180910390f35b820191906000526020600020905b815481529060010190602001808311610d1557829003601f168201915b505050505092509250925092509193909250565b825184511015610dbd576000199450610dd5565b828181518110156100025790602001015160f860020a900460f860020a02600160f860020a0319168482815181101561000257016020015160f860020a9081900402600160f860020a0319161115610db55760019450610dd5565b6001016102cb565b825184511115610dd05760019450610dd5565b600094505b5050505092915050565b6000149392505050565b820191906000526020600020905b815481529060010190602001808311610df757829003601f168201915b50505050509150915091509250929050565b6fffffffffffffffffffffffffffffffff84511115610e49576000199450610dd5565b5060009050805b8351811015610f2b5782600081518110156100025790602001015160f860020a900460f860020a02600160f860020a0319168482815181101561000257016020015160f860020a9081900402600160f860020a0319161415610f4657600191505b825182108015610ec357508351828201105b8015610f1a5750828281518110156100025790602001015160f860020a900460f860020a02600160f860020a03191684838301815181101561000257016020015160f860020a9081900402600160f860020a031916145b15610f355760019190910190610eb1565b6000199450610dd5565b8251821415610f4657809450610dd5565b600101610e50565b15611038576000805160206134e883398151915285856019196040518080602001846001604060020a03168152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015610fe05780820380516001836020036101000a031916815260200191505b50928303905250602481527f4f2063c3b36469676f206461206f70657261c3a7c3a36f20c3a920696e76c3a1602082015260e060020a636c69646f0260408281019190915251908190036060019350915050a161145c565b836001604060020a03166000141561112d576000805160206134e88339815191528585601a196040518080602001846001604060020a03168152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156110d75780820380516001836020036101000a031916815260200191505b50928303905250602281527f4f2076616c6f72206461206f70657261c3a7c3a36f20c3a920696e76c3a16c69602082015260f060020a61646f0260408281019190915251908190036060019350915050a161145c565b5060009150819050805b600160a060020a0333166000908152600360205260409020548110156111f65760406000908120600160a060020a033316909152600360205280546111e991908390811015610002579060005260206000209001600050604080518254602060026001831615610100026000190190921691909104601f8101829004820283018201909352828252909291908301828280156112fa5780601f106112cf576101008083540402835291602001916112fa565b1561130557600192509050805b82151561130d576000805160206134e88339815191528585601b196040518080602001846001604060020a03168152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561128a5780820380516001836020036101000a031916815260200191505b50928303905250601f81527f43c3b36469676f206461206f70657261c3a7c3a36f20696e76c3a16c69646f0060208201526040805191829003019350915050a161145c565b820191906000526020600020905b8154815290600101906020018083116112dd57829003601f168201915b5050505050866103b3565b600101611137565b600160a060020a0333166000908152600360205260409020600201805485919084908110156100025790600052602060002090600491828204019190066008026101000a8154816001604060020a03021916908302179055506000805160206134e8833981519152858560006040518080602001846001604060020a03168152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156113f25780820380516001836020036101000a031916815260200191505b50928303905250602a81527f56616c6f72206461206f70657261c3a7c3a36f20617475616c697a61646f206360208201527f6f6d207375636573736f0000000000000000000000000000000000000000000060408281019190915251908190036060019350915050a15b5050505050565b600381015460e060020a900460ff16600214156115125760408051878152602081018790528082018690526001604060020a038516606082015260ff8416608082015260141960a082015260e060c082018190526021908201527f41206475706c696361746120636f6e73746120636f6d6f20657865637574616461010082015260f860020a60610261012082015290516000805160206134c8833981519152918190036101400190a1611a83565b60038181015460e060020a900460ff1614156115c05760408051878152602081018790528082018690526001604060020a038516606082015260ff8416608082015260151960a082015260e060c082018190526021908201527f41206475706c696361746120636f6e73746120636f6d6f2063616e63656c616461010082015260f860020a60610261012082015290516000805160206134c8833981519152918190036101400190a1611a83565b600381015460e060020a900460ff16600114806115eb5750600381015460e060020a900460ff166004145b801561161057506003810154604060020a9004600160a060020a039081163390911614155b156116c65760408051878152602081018790528082018690526001604060020a038516606082015260ff8416608082015260161960a082015260e060c082018190526039908201527f41206475706c696361746120657374c3a120656d207574696c697a61c3a7c3a36101008201527f6f20706f72206f7574726120696e737469747569c3a7c3a36f0000000000000061012082015290516000805160206134c8833981519152918190036101400190a1611a83565b6003810154604060020a9004600160a060020a0390811633909116146117be5760408051878152602081018790528082018690526001604060020a038516606082015260ff8416608082015260181960a082015260e060c082018190526055908201527f4ec3a36f20c3a9207065726d697469646f20616c746572617220756d612064756101008201527f706c696361746120717565206ec3a36f20657374c3a120616c6f6361646120706101208201527f6172612073756120696e737469747569c3a7c3a36f000000000000000000000061014082015290516000805160206134c8833981519152918190036101600190a1611a83565b8160ff1660001415611a8b57600160a060020a033316600090815260046020819052604082206002018054918401549091811015610002579082526020808320818304019106815461010091820a93840260ff94850219909116179091556003830180547fffffff000000000000000000000000000000000000000000ffffffffffffffff16905560408051898152602081018990528082018890526001604060020a03871660608201529285166080840152600060a084015260e060c08401819052601e908401527f4475706c6963617461206c6962657261646120636f6d207375636573736f000091830191909152516000805160206134c8833981519152918190036101200190a16119b7565b8160ff16600314156119b75760038101805460e060020a60ff0219167c030000000000000000000000000000000000000000000000000000000017905560408051878152602081018790528082018690526001604060020a038516606082015260ff84166080820152600060a082015260e060c08201819052602c908201527f4475706c6963617461206d61726361646120636f6d6f2063616e63656c6164616101008201527f20636f6d207375636573736f000000000000000000000000000000000000000061012082015290516000805160206134c8833981519152918190036101400190a15b600085146119c757600181018590555b600084146119d757600281018490555b6001604060020a0383166000146119fe5760038101805467ffffffffffffffff1916841790555b60408051878152602081018790528082018690526001604060020a038516606082015260ff84166080820152600060a082015260e060c08201819052601e908201527f4475706c696361746120616c74657261646120636f6d207375636573736f000061010082015290516000805160206134c8833981519152918190036101200190a15b505050505050565b8160ff1660011415611b385760038101805460e060020a60ff02191660e060020a17905560408051878152602081018790528082018690526001604060020a038516606082015260ff84166080820152600060a082015260e060c08201819052601d908201527f4475706c696361746120616c6f6361646120636f6d207375636573736f00000061010082015290516000805160206134c8833981519152918190036101200190a16119b7565b8160ff16600214156118ce5760038101805460e160020a60e060020a60ff02199190911617905560408051878152602081018790528082018690526001604060020a038516606082015260ff84166080820152600060a082015260e060c08201819052602c908201527f4475706c6963617461206d61726361646120636f6d6f206578656375746164616101008201527f20636f6d207375636573736f000000000000000000000000000000000000000061012082015290516000805160206134c8833981519152918190036101400190a16119b7565b6002805483908110156100025750600052507f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace8101545b919050565b8160ff1660011415611c91575060408051808201909152600781527f416c6f63616461000000000000000000000000000000000000000000000000006020820152611d5f565b8160ff1660021415611cd7575060408051808201909152601381527f51756974616461202f2045786563757461646f000000000000000000000000006020820152611d5f565b8160ff1660031415611d1d575060408051808201909152600981527f43616e63656c61646100000000000000000000000000000000000000000000006020820152611d5f565b8160ff1660041415611d5f575060408051808201909152600b81527f456d20616ec3a16c69736500000000000000000000000000000000000000000060208201525b825160208401516040850151606086015160a087015160c09790970151939f929e50909c509a5093985090965094509092505050565b15611e7f576000805160206134a88339815191528484600e196040518080602001846001604060020a03168152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015611e275780820380516001836020036101000a031916815260200191505b50928303905250602481527f4f2063c3b36469676f206461206f70657261c3a7c3a36f20c3a920696e76c3a1602082015260e060020a636c69646f0260408281019190915251908190036060019350915050a16122a9565b826001604060020a031660001415611f74576000805160206134a88339815191528484600f196040518080602001846001604060020a03168152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015611f1e5780820380516001836020036101000a031916815260200191505b50928303905250602281527f4f2076616c6f72206461206f70657261c3a7c3a36f20c3a920696e76c3a16c69602082015260f060020a61646f0260408281019190915251908190036060019350915050a16122a9565b5060009050805b600160a060020a0333166000908152600360205260409020548110156120375760406000908120600160a060020a0333169091526003602052805461202d91908390811015610002579060005260206000209001600050604080518254602060026001831615610100026000190190921691909104601f81018290048202830182019093528282529092919083018282801561213a5780601f1061210f5761010080835404028352916020019161213a565b1561214557600191505b811561214d576000805160206134a883398151915284846010196040518080602001846001604060020a03168152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156120ca5780820380516001836020036101000a031916815260200191505b50928303905250601f81527f43c3b36469676f206461206f70657261c3a7c3a36f206475706c696361646f0060208201526040805191829003019350915050a16122a9565b820191906000526020600020905b81548152906001019060200180831161211d57829003601f168201915b5050505050856103b3565b600101611f7b565b600160a060020a033316600090815260036020526040902080546001810180835582818380158290116122af578183600052602060002091820191016122af919061231e565b505050600092835260209092206004808304909101910660080285909190916101000a8154816001604060020a0302191690830217905550506000805160206134a8833981519152848460006040518080602001846001604060020a03168152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156122585780820380516001836020036101000a031916815260200191505b50928303905250602181527f4f70657261c3a7c3a36f206361646173747261646120636f6d20737563657373602082015260f860020a606f0260408281019190915251908190036060019350915050a15b50505050565b5050509190906000526020600020900160008690919091509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061238257805160ff19168380011785555b506123b292915061236a565b50506001015b8082111561237e576000818150805460018160011615610100020316600290046000825580601f106123505750612318565b601f01602090049060005260206000209081019061231891905b8082111561237e576000815560010161236a565b5090565b8280016001018555821561230c579182015b8281111561230c578251826000505591602001919060010190612394565b505050600160a060020a0333166000908152600360205260409020600190810180549182018082559091908281838015829011612410576003016004900481600301600490048360005260206000209182019101612410919061236a565b505050600092835260209092206004808304909101910660080281546101009190910a8681026001604060020a03919091021990911617905550600160a060020a03331660009081526003602052604090206002018054600181018083558281838015829011612193576003016004900481600301600490048360005260206000209182019101612193919061236a565b820191906000526020600020905b8154815290600101906020018083116124af57829003601f168201915b505050600160a060020a0333166000908152600460205260409020805493955092899250821015905061000257906000526020600020900160005054600160a060020a033316600090815260046020526040902060020180549192509087908110156100025790600052602060002090602091828204019190069054906101000a900460ff16151561256b575050604080516020810190915260008082525b600160a060020a0333166000908152600460205260409020600201805482918491899081101561000257506000908152602090819020818a04015492999198066101000a90910460ff1695509350505050565b87600014156126d5576000805160206134888339815191528a8a8a8a8a8a600060011960405180898152602001888152602001878152602001866001604060020a031681526020018560ff16815260200180602001848152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561267b5780820380516001836020036101000a031916815260200191505b50928303905250602181527f4f20434e504a2f43504620646f2073616361646f20c3a920696e76c3a16c6964602082015260f860020a606f02604082810191909152519081900360600198509650505050505050a16132c8565b866001604060020a0316600014156127e5576000805160206134888339815191528a8a8a8a8a8a600060021960405180898152602001888152602001878152602001866001604060020a031681526020018560ff16815260200180602001848152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561279b5780820380516001836020036101000a031916815260200191505b50928303905250601e81527f4f2076616c6f7220696e666f726d61646f20c3a920696e76c3a16c69646f0000602082015260408051918290030198509650505050505050a16132c8565b8560ff166001141580156127fd57508560ff16600414155b15612929576000805160206134888339815191528a8a8a8a8a8a600060031960405180898152602001888152602001878152602001866001604060020a031681526020018560ff16815260200180602001848152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156128b65780820380516001836020036101000a031916815260200191505b50928303905250602381527f41207369747561c3a7c3a36f20696e666f726d61646120c3a920696e76c3a16c60208201527f6964610000000000000000000000000000000000000000000000000000000000604082810191909152519081900360600198509650505050505050a16132c8565b600384015460e060020a900460ff1660021415612a67576000805160206134888339815191528a8a8a8a8a8a600060041960405180898152602001888152602001878152602001866001604060020a031681526020018560ff16815260200180602001848152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156129f45780820380516001836020036101000a031916815260200191505b50928303905250602b81527f41206475706c696361746120696e666f726d61646120636f6e73746120636f6d60208201527f6f20657865637574616461000000000000000000000000000000000000000000604082810191909152519081900360600198509650505050505050a16132c8565b60038481015460e060020a900460ff161415612ba4576000805160206134888339815191528a8a8a8a8a8a600060051960405180898152602001888152602001878152602001866001604060020a031681526020018560ff16815260200180602001848152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015612b315780820380516001836020036101000a031916815260200191505b50928303905250602b81527f41206475706c696361746120696e666f726d61646120636f6e73746120636f6d60208201527f6f2063616e63656c616461000000000000000000000000000000000000000000604082810191909152519081900360600198509650505050505050a16132c8565b600384015460e060020a900460ff1660011480612bcf5750600384015460e060020a900460ff166004145b8015612bf457506003840154604060020a9004600160a060020a039081163390911614155b15612d46576000805160206134888339815191528a8a8a8a8a8a600060061960405180898152602001888152602001878152602001866001604060020a031681526020018560ff16815260200180602001848152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015612cad5780820380516001836020036101000a031916815260200191505b50928303905250604381527f41206475706c696361746120696e666f726d61646120657374c3a120656d207560208201527f74696c697a61c3a7c3a36f20706f72206f7574726120696e737469747569c3a76040828101919091527fc3a36f00000000000000000000000000000000000000000000000000000000006060830152519081900360800198509650505050505050a16132c8565b600384015460e060020a900460ff1660011480612d715750600384015460e060020a900460ff166004145b8015612d9557506003840154604060020a9004600160a060020a0390811633909116145b15612ee7576000805160206134888339815191528a8a8a8a8a8a600060071960405180898152602001888152602001878152602001866001604060020a031681526020018560ff16815260200180602001848152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015612e4e5780820380516001836020036101000a031916815260200191505b50928303905250604281527f41206475706c696361746120696e666f726d61646120657374c3a120656d207560208201527f74696c697a61c3a7c3a36f2070656c612073756120696e737469747569c3a7c36040828101919091527fa36f0000000000000000000000000000000000000000000000000000000000006060830152519081900360800198509650505050505050a16132c8565b60009250600091505b600160a060020a033316600090815260036020526040902054821015612fac5760406000908120600160a060020a03331690915260036020528054612fa291908490811015610002579060005260206000209001600050604080518254602060026001831615610100026000190190921691909104601f8101829004820283018201909352828252909291908301828280156112fa5780601f106112cf576101008083540402835291602001916112fa565b156130da57600192505b8215156130e6576000805160206134888339815191528a8a8a8a8a8a600060081960405180898152602001888152602001878152602001866001604060020a031681526020018560ff16815260200180602001848152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156130675780820380516001836020036101000a031916815260200191505b50928303905250602e81527f4f2063c3b36469676f206461206f70657261c3a7c3a36f20696e666f726d616460208201527f6f20c3a920696e76c3a16c69646f000000000000000000000000000000000000604082810191909152519081900360600198509650505050505050a16132c8565b60019190910190612ef0565b60018481018a90556002850189905542855560038501805467ffffffffffffffff1916891760e060020a60ff02191660e060020a8902177fffffffff0000000000000000000000000000000000000000ffffffffffffffff16604060020a3390810291909117909155600160a060020a03166000908152600460205260409020805491820180825590919082818380158290116132d4578183600052602060002091820191016132d4919061236a565b505050919090600052602060002090602091828204019190066001909190916101000a81548160ff02191690830217905550506000805160206134888339815191528a8a8a8a8a8a8a60040160005054600060405180898152602001888152602001878152602001866001604060020a031681526020018560ff16815260200180602001848152602001838152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156132825780820380516001836020036101000a031916815260200191505b50928303905250601f81527f4475706c696361746120696e636c75c3ad646120636f6d207375636573736f00602082015260408051918290030198509650505050505050a15b50505050505050505050565b505050600092835260208084209092018d9055600019810160048881019190915533600160a060020a0316845290915260409091206001908101805491820180825592935091828183801582901161333f5781836000526020600020918201910161333f91906133ae565b5050509190906000526020600020900160008790919091509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106133fe57805160ff19168380011785555b5061342e92915061236a565b50506001015b8082111561237e576000818150805460018160011615610100020316600290046000825580601f106133e057506133a8565b601f0160209004906000526020600020908101906133a8919061236a565b8280016001018555821561339c579182015b8281111561339c578251826000505591602001919060010190613410565b505050600160a060020a0333166000908152600460205260409020600201805460018101808355828183801582901161319657601f016020900481601f01602090048360005260206000209182019101613196919061236a56ea86d215d20475326ec873f95c2a8cf5f79bbbcf5131d503130cbd3b3b9baa700607a34a06a812fe579d84a94f221366bbe1ec8ec00a21ebc6109f436b4bd51d4e99aa51e5f247a7e64a0cf503ec713c73725812cd1d5d63ab9eaf37ac71311f674285124c48ca9eb6bf7553699cab576315651cf901209b6c750f9c5ed6de2b', 
     gas: 4700000
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })

console.log(">>>>>>>>>>>> Transações Pendentes de mineração: " + web3.txpool.status.pending);

console.log(">>>>>>>>>>>> Fim do JS")
