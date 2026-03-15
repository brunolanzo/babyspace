// Lista de Presentes — Gift catalog with categories

const CATEGORIES = [
  { id: 'soninho', name: 'Hora Do Soninho', emoji: '🛏️', color: '#C3B1E1' },
  { id: 'diversos', name: 'Diversos', emoji: '🎒', color: '#A8D8B9' },
  { id: 'passeios', name: 'Para Os Passeios', emoji: '🚗', color: '#FFE5A0' },
  { id: 'brincar', name: 'Para Brincar', emoji: '🧸', color: '#FFD6CC' },
  { id: 'vestir', name: 'Para Vestir', emoji: '👗', color: '#E9D5F5' },
  { id: 'saude', name: 'Saúde / Higiene', emoji: '🏥', color: '#B8E6D0' }
];

const GIFT_CATALOG = [
  // 🛏️ Hora Do Soninho
  { id: 's01', name: 'Ninho bolinhas', price: 144, cat: 'soninho' },
  { id: 's02', name: 'Manta em tricô antialérgica - off white', price: 115, cat: 'soninho' },
  { id: 's03', name: 'Jogo de berço bordado 200 fios branco e bege', price: 155, cat: 'soninho' },
  { id: 's04', name: 'Cobertor em tricô antialérgico', price: 219, cat: 'soninho' },
  { id: 's05', name: 'Móbile musical', price: 299, cat: 'soninho' },
  { id: 's06', name: 'Móbile com projetor', price: 220, cat: 'soninho' },
  { id: 's07', name: 'Berço portátil', price: 572, cat: 'soninho' },
  { id: 's08', name: 'Berço para acoplar à cama', price: 615, cat: 'soninho' },
  { id: 's09', name: 'Babá eletrônica', price: 629, cat: 'soninho' },
  { id: 's10', name: 'Coruja musical com alça para berço', price: 88, cat: 'soninho' },
  { id: 's11', name: 'Edredom dupla face raposa', price: 88, cat: 'soninho' },
  { id: 's12', name: 'Kit 2 mantinhas fleece', price: 94, cat: 'soninho' },
  { id: 's13', name: 'Kit 4 cueiros', price: 95, cat: 'soninho' },
  { id: 's14', name: 'Cobertor fleece nuvens', price: 130, cat: 'soninho' },
  { id: 's15', name: 'Jogo de berço bordado 200 fios branco e azul', price: 135, cat: 'soninho' },
  { id: 's16', name: 'Jogo de berço bordado 200 fios branco e rosa', price: 135, cat: 'soninho' },
  { id: 's17', name: 'Ninho estrelas', price: 144, cat: 'soninho' },
  { id: 's18', name: 'Chupetas - azul', price: 33, cat: 'soninho' },
  { id: 's19', name: 'Chupetas - rosa', price: 33, cat: 'soninho' },
  { id: 's20', name: 'Naninha macaquinho', price: 54, cat: 'soninho' },
  { id: 's21', name: 'Naninha girafinha', price: 54, cat: 'soninho' },
  { id: 's22', name: 'Naninha leãozinho', price: 54, cat: 'soninho' },
  { id: 's23', name: 'Mantinha estrelinhas - azul', price: 74, cat: 'soninho' },
  { id: 's24', name: 'Mantinha estrelinhas - rosa', price: 74, cat: 'soninho' },
  { id: 's25', name: 'Bolsa térmica carneirinho', price: 70, cat: 'soninho' },

  // 🎒 Diversos
  { id: 'd01', name: 'Almofada de amamentação - rosa', price: 72, cat: 'diversos' },
  { id: 'd02', name: 'Almofada de amamentação - verde', price: 72, cat: 'diversos' },
  { id: 'd03', name: 'Almofada de amamentação - branca', price: 72, cat: 'diversos' },
  { id: 'd04', name: 'Termômetro digital com infravermelho', price: 73, cat: 'diversos' },
  { id: 'd05', name: 'Almofada para carrinho e bebê conforto', price: 102, cat: 'diversos' },
  { id: 'd06', name: 'Termômetro digital - testa e ouvido', price: 139, cat: 'diversos' },
  { id: 'd07', name: 'Lixeira antiodor e antibacteriana', price: 199, cat: 'diversos' },
  { id: 'd08', name: 'Caixinha de ruído branco, luzes e sons para bebê', price: 210, cat: 'diversos' },
  { id: 'd09', name: 'Poltrona para bebê impermeável', price: 215, cat: 'diversos' },
  { id: 'd10', name: 'Kit dosador de medicamentos', price: 46, cat: 'diversos' },
  { id: 'd11', name: 'Organizador de itens p/ banco carro', price: 62, cat: 'diversos' },
  { id: 'd12', name: 'Bolsa para hastes do carrinho', price: 65, cat: 'diversos' },
  { id: 'd13', name: 'Almofada de amamentação - estampada', price: 65, cat: 'diversos' },

  // 🚗 Para Os Passeios
  { id: 'p01', name: 'Trocador portátil olhinhos', price: 31, cat: 'passeios' },
  { id: 'p02', name: 'Trocador portátil raposa', price: 31, cat: 'passeios' },
  { id: 'p03', name: 'Kit de cueiros olhinhos', price: 46, cat: 'passeios' },
  { id: 'p04', name: 'Kit de cueiros raposa', price: 46, cat: 'passeios' },
  { id: 'p05', name: 'Kit Fórmula', price: 56, cat: 'passeios' },
  { id: 'p06', name: 'Saco para dormir branco', price: 96, cat: 'passeios' },
  { id: 'p07', name: 'Mochila baby - Gatinha', price: 159, cat: 'passeios' },
  { id: 'p08', name: 'Mochila baby - Porco espinho', price: 159, cat: 'passeios' },
  { id: 'p09', name: 'Mochila baby - Foguete', price: 159, cat: 'passeios' },
  { id: 'p10', name: 'Canguru slim', price: 175, cat: 'passeios' },
  { id: 'p11', name: 'Filtro solar e repelente para peles sensíveis', price: 130, cat: 'passeios' },
  { id: 'p12', name: 'Bolsa de maternidade preta com trocador', price: 315, cat: 'passeios' },
  { id: 'p13', name: 'Bolsa de maternidade com trocador', price: 315, cat: 'passeios' },
  { id: 'p14', name: 'Bebê conforto', price: 389, cat: 'passeios' },
  { id: 'p15', name: 'Bolsa + trocador - borboleta', price: 420, cat: 'passeios' },
  { id: 'p16', name: 'Bolsa maternidade', price: 420, cat: 'passeios' },
  { id: 'p17', name: 'Bolsa maternidade - espaço', price: 420, cat: 'passeios' },
  { id: 'p18', name: 'Malinha maternidade - cerejinha', price: 450, cat: 'passeios' },
  { id: 'p19', name: 'Malinha maternidade - verde', price: 450, cat: 'passeios' },
  { id: 'p20', name: 'Malinha maternidade - bege', price: 450, cat: 'passeios' },
  { id: 'p21', name: 'Bolsa passeio + trocador + necessaire - cinza', price: 480, cat: 'passeios' },
  { id: 'p22', name: 'Mala do bebê + Bolsa - branco e cinza', price: 645, cat: 'passeios' },
  { id: 'p23', name: 'Mala do bebê + Mochila - branco e rosa', price: 645, cat: 'passeios' },
  { id: 'p24', name: 'Carrinho de bebê guarda-chuva', price: 839, cat: 'passeios' },
  { id: 'p25', name: 'Carrinho de bebê e bebê conforto', price: 1220, cat: 'passeios' },
  { id: 'p26', name: 'Carrinho para gêmeos cinza e preto', price: 1950, cat: 'passeios' },
  { id: 'p27', name: 'Carrinho para gêmeos preto', price: 2390, cat: 'passeios' },

  // 🧸 Para Brincar
  { id: 'b01', name: 'Mordedor mãozinha vermelha', price: 21, cat: 'brincar' },
  { id: 'b02', name: 'Mordedor mãozinha verde', price: 21, cat: 'brincar' },
  { id: 'b03', name: 'Luvinha mordedor azul', price: 26, cat: 'brincar' },
  { id: 'b04', name: 'Luvinha mordedor rosa', price: 26, cat: 'brincar' },
  { id: 'b05', name: 'Massageador de gengiva cacto', price: 29, cat: 'brincar' },
  { id: 'b06', name: 'Girafinha de pelúcia com prendedor de chupeta', price: 39, cat: 'brincar' },
  { id: 'b07', name: 'Mordedor chocalho pezinho', price: 41, cat: 'brincar' },
  { id: 'b08', name: 'Bola de pelúcia', price: 43, cat: 'brincar' },
  { id: 'b09', name: 'Girafa mordedor', price: 44, cat: 'brincar' },
  { id: 'b10', name: 'Mordedor centopeia', price: 47, cat: 'brincar' },
  { id: 'b11', name: 'Mordedor mãozinhas', price: 47, cat: 'brincar' },
  { id: 'b12', name: 'Chocalhos', price: 49, cat: 'brincar' },
  { id: 'b13', name: 'Chocalho', price: 54, cat: 'brincar' },
  { id: 'b14', name: 'Quebra-cabeça animais', price: 58, cat: 'brincar' },
  { id: 'b15', name: 'Quebra-cabeça fazendinha', price: 58, cat: 'brincar' },
  { id: 'b16', name: 'Kit de areia', price: 58, cat: 'brincar' },
  { id: 'b17', name: 'Tapete de água inflável macio e divertido', price: 63, cat: 'brincar' },
  { id: 'b18', name: 'Controle remoto musical', price: 65, cat: 'brincar' },
  { id: 'b19', name: 'Jogo de dedoches animais da fazenda', price: 55, cat: 'brincar' },
  { id: 'b20', name: 'Tartaruga musical', price: 74, cat: 'brincar' },
  { id: 'b21', name: 'Maleta Kit Educativo', price: 75, cat: 'brincar' },
  { id: 'b22', name: 'Coala musical de atividades', price: 84, cat: 'brincar' },
  { id: 'b23', name: 'Cubo de encaixar em madeira', price: 85, cat: 'brincar' },
  { id: 'b24', name: 'Arco-íris em madeira para montar', price: 87, cat: 'brincar' },
  { id: 'b25', name: 'Brinquedo interativo musical', price: 92, cat: 'brincar' },
  { id: 'b26', name: 'Tablet cantando com os animais', price: 93, cat: 'brincar' },
  { id: 'b27', name: 'Jogo de martelo com bolinhas', price: 94, cat: 'brincar' },
  { id: 'b28', name: 'Trenzinho em madeira para montar', price: 108, cat: 'brincar' },
  { id: 'b29', name: 'Microfone musical canta e grava', price: 115, cat: 'brincar' },
  { id: 'b30', name: 'Torres de madeira para empilhar', price: 115, cat: 'brincar' },
  { id: 'b31', name: 'Mordedor elefante', price: 128, cat: 'brincar' },
  { id: 'b32', name: 'Mordedor raposa', price: 128, cat: 'brincar' },
  { id: 'b33', name: 'Macaco mordedor', price: 128, cat: 'brincar' },
  { id: 'b34', name: 'Mordedor unicórnio', price: 128, cat: 'brincar' },
  { id: 'b35', name: 'Tapete de atividades impermeável e dobrável', price: 135, cat: 'brincar' },
  { id: 'b36', name: 'Andador', price: 168, cat: 'brincar' },
  { id: 'b37', name: 'Cadeira de descanso', price: 210, cat: 'brincar' },
  { id: 'b38', name: 'Tapete de atividades', price: 255, cat: 'brincar' },

  // 👗 Para Vestir
  { id: 'v01', name: 'Conjunto florzinha', price: 82, cat: 'vestir' },
  { id: 'v02', name: 'Kit 2 calças', price: 54, cat: 'vestir' },
  { id: 'v03', name: '2 calças rosa', price: 84, cat: 'vestir' },
  { id: 'v04', name: '2 calças - cinza e florzinhas', price: 84, cat: 'vestir' },
  { id: 'v05', name: '2 calças - listras e ursinho', price: 84, cat: 'vestir' },
  { id: 'v06', name: '2 calças - lilás e florzinhas', price: 86, cat: 'vestir' },
  { id: 'v07', name: 'Batinha branca', price: 88, cat: 'vestir' },
  { id: 'v08', name: 'Biquíni sorvetinhos', price: 89, cat: 'vestir' },
  { id: 'v09', name: 'Biquíni marshmallow', price: 89, cat: 'vestir' },
  { id: 'v10', name: 'Moletom azul', price: 89, cat: 'vestir' },
  { id: 'v11', name: 'Blusa piscina e mar - proteção UV', price: 92, cat: 'vestir' },
  { id: 'v12', name: 'Conjuntinho verde', price: 92, cat: 'vestir' },
  { id: 'v13', name: 'Blusa preta', price: 92, cat: 'vestir' },
  { id: 'v14', name: 'Blusa piscina e mar proteção UV', price: 92, cat: 'vestir' },
  { id: 'v15', name: 'Conj. calça jeans + blusa borboletas', price: 96, cat: 'vestir' },
  { id: 'v16', name: 'Suéter rosa - babadinhos', price: 102, cat: 'vestir' },
  { id: 'v17', name: 'Suéter listrado', price: 102, cat: 'vestir' },
  { id: 'v18', name: 'Conjunto shortinho + blusa + tiara', price: 102, cat: 'vestir' },
  { id: 'v19', name: 'Conjunto body + blusa + shortinho', price: 102, cat: 'vestir' },
  { id: 'v20', name: 'Conjunto mar camisa + short', price: 102, cat: 'vestir' },
  { id: 'v21', name: 'Conjunto floral', price: 102, cat: 'vestir' },
  { id: 'v22', name: 'Kit body manga longa 3 peças M', price: 65, cat: 'vestir' },
  { id: 'v23', name: 'Conjunto florzinhas - azul', price: 116, cat: 'vestir' },
  { id: 'v24', name: 'Kit 3 body - animais', price: 116, cat: 'vestir' },
  { id: 'v25', name: 'Kit 4 calças - P', price: 116, cat: 'vestir' },
  { id: 'v26', name: 'Conjuntinho jardineira bege', price: 115, cat: 'vestir' },
  { id: 'v27', name: 'Conj. body + calça + colete - borboletas G', price: 115, cat: 'vestir' },
  { id: 'v28', name: 'Suéter ursinho', price: 118, cat: 'vestir' },
  { id: 'v29', name: 'Vestidinho rodado', price: 118, cat: 'vestir' },
  { id: 'v30', name: 'Vestidinho c/ short borboletinhas', price: 118, cat: 'vestir' },
  { id: 'v31', name: 'Vestidinho - listras', price: 118, cat: 'vestir' },
  { id: 'v32', name: 'Vestido branco', price: 118, cat: 'vestir' },
  { id: 'v33', name: 'Conjunto - gatinha', price: 120, cat: 'vestir' },
  { id: 'v34', name: 'Vestido + shortinho - florzinhas', price: 125, cat: 'vestir' },
  { id: 'v35', name: 'Blusa tricô ursinho', price: 128, cat: 'vestir' },
  { id: 'v36', name: 'Sapatinho velcro - cinza', price: 128, cat: 'vestir' },
  { id: 'v37', name: 'Sapatinho velcro - azul marinho', price: 128, cat: 'vestir' },
  { id: 'v38', name: 'Sapatinho laço - branco', price: 128, cat: 'vestir' },
  { id: 'v39', name: 'Sandália - branca', price: 132, cat: 'vestir' },
  { id: 'v40', name: 'Vestido branco com casaquinho azul', price: 134, cat: 'vestir' },
  { id: 'v41', name: 'Conj. fleece azul P', price: 80, cat: 'vestir' },
  { id: 'v42', name: 'Casaco tricô borboletas', price: 136, cat: 'vestir' },
  { id: 'v43', name: 'Suéter tricô leãozinho', price: 136, cat: 'vestir' },
  { id: 'v44', name: 'Conjunto cactus', price: 136, cat: 'vestir' },
  { id: 'v45', name: 'Conjunto 3 peças - elefante', price: 136, cat: 'vestir' },
  { id: 'v46', name: 'Conjuntinho rosa 3 peças - elefante', price: 136, cat: 'vestir' },
  { id: 'v47', name: 'Kit 2 macacões P', price: 140, cat: 'vestir' },
  { id: 'v48', name: 'Kit 2 macacões M', price: 140, cat: 'vestir' },
  { id: 'v49', name: 'Kit 5 bodies', price: 140, cat: 'vestir' },
  { id: 'v50', name: 'Kit 3 body manga comprida', price: 140, cat: 'vestir' },
  { id: 'v51', name: 'Kit 4 body manga comprida', price: 140, cat: 'vestir' },
  { id: 'v52', name: 'Kit 4 body manga comprida rosa', price: 140, cat: 'vestir' },
  { id: 'v53', name: 'Kit body 5 peças', price: 142, cat: 'vestir' },
  { id: 'v54', name: 'Vestidinho rosa + casaquinho', price: 142, cat: 'vestir' },
  { id: 'v55', name: 'Kit 5 body - lisos', price: 145, cat: 'vestir' },
  { id: 'v56', name: 'Conjunto camisa + bermuda + t-shirt', price: 145, cat: 'vestir' },
  { id: 'v57', name: 'Kit 5 body manga curta - florzinhas', price: 162, cat: 'vestir' },
  { id: 'v58', name: 'Kit 5 body florzinhas', price: 162, cat: 'vestir' },
  { id: 'v59', name: 'Kit 5 body manga curta - florzinhas', price: 162, cat: 'vestir' },
  { id: 'v60', name: 'Kit 5 body manga curta - rosinhas', price: 162, cat: 'vestir' },
  { id: 'v61', name: 'Conjunto 3 peças - carrinhos', price: 162, cat: 'vestir' },
  { id: 'v62', name: 'Conjunto 3 peças - corações', price: 162, cat: 'vestir' },
  { id: 'v63', name: 'Conjunto 3 peças - kombi', price: 162, cat: 'vestir' },
  { id: 'v64', name: 'Conjunto 3 peças - gatinha', price: 148, cat: 'vestir' },
  { id: 'v65', name: 'Conjunto 3 peças - jacaré', price: 148, cat: 'vestir' },
  { id: 'v66', name: 'Conjunto 3 peças - jeans', price: 148, cat: 'vestir' },
  { id: 'v67', name: 'Conj. casaco + body + calça M', price: 150, cat: 'vestir' },
  { id: 'v68', name: 'Kit 5 body ursinho', price: 150, cat: 'vestir' },
  { id: 'v69', name: 'Conjunto barquinhos', price: 152, cat: 'vestir' },
  { id: 'v70', name: 'Casaco orelhinhas - azul', price: 157, cat: 'vestir' },
  { id: 'v71', name: 'Conjunto 4 peças - elefante', price: 158, cat: 'vestir' },
  { id: 'v72', name: 'Conjunto animais body + short', price: 106, cat: 'vestir' },
  { id: 'v73', name: 'Conjunto body + regata + shortinho', price: 106, cat: 'vestir' },
  { id: 'v74', name: 'Conjunto florzinhas', price: 106, cat: 'vestir' },
  { id: 'v75', name: 'Vestidinho babados', price: 108, cat: 'vestir' },
  { id: 'v76', name: 'Vestidinho baby verão', price: 108, cat: 'vestir' },
  { id: 'v77', name: 'Kit 3 body', price: 108, cat: 'vestir' },
  { id: 'v78', name: 'Kit 3 body ursinho', price: 55, cat: 'vestir' },
  { id: 'v79', name: 'Suéter - branco', price: 110, cat: 'vestir' },
  { id: 'v80', name: 'Moletom - listras', price: 99, cat: 'vestir' },
  { id: 'v81', name: 'Macacão tigrinho', price: 58, cat: 'vestir' },
  { id: 'v82', name: 'Moletom - cogumelos', price: 99, cat: 'vestir' },
  { id: 'v83', name: 'Body borboletinha', price: 42, cat: 'vestir' },
  { id: 'v84', name: 'Blusa arco-íris', price: 42, cat: 'vestir' },
  { id: 'v85', name: '4 pares de meias', price: 42, cat: 'vestir' },
  { id: 'v86', name: 'Body babadinhos - azul', price: 45, cat: 'vestir' },
  { id: 'v87', name: 'Blusa babadinhos', price: 45, cat: 'vestir' },
  { id: 'v88', name: 'Blusa dino verde', price: 45, cat: 'vestir' },
  { id: 'v89', name: 'Short florzinhas', price: 50, cat: 'vestir' },
  { id: 'v90', name: 'Short azul', price: 50, cat: 'vestir' },
  { id: 'v91', name: 'Macaquinho bege', price: 55, cat: 'vestir' },
  { id: 'v92', name: 'Macaquinho urso - verde', price: 55, cat: 'vestir' },
  { id: 'v93', name: 'Blusa listrada', price: 60, cat: 'vestir' },
  { id: 'v94', name: 'Blusa listras - bege', price: 60, cat: 'vestir' },
  { id: 'v95', name: 'Camisa gola', price: 62, cat: 'vestir' },
  { id: 'v96', name: 'Camisa botões', price: 69, cat: 'vestir' },
  { id: 'v97', name: 'Sunga glub glub', price: 79, cat: 'vestir' },
  { id: 'v98', name: 'Sunguinha', price: 79, cat: 'vestir' },
  { id: 'v99', name: 'Sunga dino', price: 82, cat: 'vestir' },
  { id: 'v100', name: 'Kit 5 body manga curta', price: 162, cat: 'vestir' },

  // 🏥 Saúde / Higiene
  { id: 'h01', name: 'Kit 10 lenços umedecidos', price: 105, cat: 'saude' },
  { id: 'h02', name: 'Esterilizador de mamadeira para microondas', price: 115, cat: 'saude' },
  { id: 'h03', name: 'Nebulizador / Inalador ultrassônico', price: 142, cat: 'saude' },
  { id: 'h04', name: 'Kit com 5 pomadas para assaduras Bepantol 60g', price: 142, cat: 'saude' },
  { id: 'h05', name: 'Kit de 12 absorventes para fraldas ecológicas', price: 160, cat: 'saude' },
  { id: 'h06', name: 'Esterilizador de mamadeiras', price: 160, cat: 'saude' },
  { id: 'h07', name: 'Nebulizador / Inalador portátil', price: 180, cat: 'saude' },
  { id: 'h08', name: 'Aquecedor de lenço umedecido', price: 224, cat: 'saude' },
  { id: 'h09', name: 'Esterilizador de mamadeira a vapor', price: 320, cat: 'saude' },
  { id: 'h10', name: 'Kit com 6 paninhos de boca', price: 88, cat: 'saude' }
];

// SVG icons per category
const CAT_ICONS = {
  soninho: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 11h18M3 11v8a2 2 0 002 2h14a2 2 0 002-2v-8M7 11V7a5 5 0 0110 0v4"/><path d="M12 3v1m-4 1l-.7-.7M6 7H5m14 0h-1m-1.3-2.7L16 5"/></svg>',
  diversos: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>',
  passeios: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17H3v-4l2-3h6l4 3h4v4h-2M9 10V6"/></svg>',
  brincar: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 2a4 4 0 014 4v1H8V6a4 4 0 014-4zM8 7c-3 0-6 2-6 6 0 5 4 9 10 9s10-4 10-9c0-4-3-6-6-6"/><circle cx="9" cy="13" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/><path d="M10 16s1 1 2 1 2-1 2-1"/></svg>',
  vestir: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M16 3l4 4-2 1-2-2v16H8V6L6 8 4 7l4-4h2a2 2 0 104 0h2z"/></svg>',
  saude: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z"/><path d="M12 8v8M8 12h8"/></svg>'
};

// State
const selectedGifts = new Map(); // id -> { customPrice }
let saveTimeout = null;

// Load saved gifts from API
async function loadSavedGifts() {
  try {
    const res = await fetch('/api/gifts');
    const data = await res.json();
    if (data.gifts && data.gifts.length) {
      data.gifts.forEach(g => selectedGifts.set(g.productId, { customPrice: g.customPrice }));
    }
  } catch (e) { /* ignore */ }
  render();
}

// Save to API (debounced)
function saveGifts() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    const gifts = [];
    selectedGifts.forEach((val, id) => {
      gifts.push({ productId: id, customPrice: val.customPrice });
    });
    try {
      await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gifts })
      });
    } catch (e) { /* ignore */ }
  }, 800);
}

// Update stats bar
function updateStats() {
  let count = selectedGifts.size;
  let total = 0;
  selectedGifts.forEach((val, id) => {
    const product = GIFT_CATALOG.find(p => p.id === id);
    total += val.customPrice != null ? val.customPrice : (product ? product.price : 0);
  });
  document.getElementById('statCount').textContent = count;
  document.getElementById('statValue').textContent = 'R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

// Toggle gift
function toggleGift(id) {
  if (selectedGifts.has(id)) {
    selectedGifts.delete(id);
  } else {
    const product = GIFT_CATALOG.find(p => p.id === id);
    selectedGifts.set(id, { customPrice: product.price });
  }
  updateCard(id);
  updateStats();
  saveGifts();
}

// Update single card UI
function updateCard(id) {
  const card = document.querySelector(`[data-gift-id="${id}"]`);
  if (!card) return;
  const isAdded = selectedGifts.has(id);
  card.classList.toggle('gift-card--added', isAdded);
  const btn = card.querySelector('.gift-btn');
  if (isAdded) {
    btn.className = 'gift-btn gift-btn--remove';
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg> Remover';
  } else {
    btn.className = 'gift-btn gift-btn--add';
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg> Adicionar';
  }
}

// Handle price edit
function onPriceChange(id, value) {
  const num = parseFloat(value.replace(',', '.'));
  if (isNaN(num) || num < 0) return;
  if (selectedGifts.has(id)) {
    selectedGifts.get(id).customPrice = num;
  }
  updateStats();
  saveGifts();
}

// Scroll a row left/right
function scrollRow(catId, direction) {
  const row = document.getElementById('scroll-' + catId);
  if (!row) return;
  const amount = 340;
  row.scrollBy({ left: direction * amount, behavior: 'smooth' });
}

// Render full catalog
function render() {
  const container = document.getElementById('catalogContainer');
  container.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const products = GIFT_CATALOG.filter(p => p.cat === cat.id);
    if (!products.length) return;

    const section = document.createElement('div');
    section.className = 'category-section';

    // Header with title and info icon
    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
      <h2 class="category-title">
        <span class="category-emoji">${cat.emoji}</span> ${cat.name}
        <span class="category-info" title="${products.length} itens disponíveis">i</span>
      </h2>
    `;
    section.appendChild(header);

    // Scroll wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'gifts-scroll-wrapper';

    // Left scroll button
    const btnLeft = document.createElement('button');
    btnLeft.className = 'scroll-btn scroll-btn--left';
    btnLeft.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>';
    btnLeft.onclick = () => scrollRow(cat.id, -1);
    wrapper.appendChild(btnLeft);

    // Right scroll button
    const btnRight = document.createElement('button');
    btnRight.className = 'scroll-btn scroll-btn--right';
    btnRight.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>';
    btnRight.onclick = () => scrollRow(cat.id, 1);
    wrapper.appendChild(btnRight);

    const scrollRow_ = document.createElement('div');
    scrollRow_.className = 'gifts-scroll';
    scrollRow_.id = 'scroll-' + cat.id;

    products.forEach(product => {
      const isAdded = selectedGifts.has(product.id);
      const customPrice = isAdded ? selectedGifts.get(product.id).customPrice : product.price;

      const card = document.createElement('div');
      card.className = 'gift-card' + (isAdded ? ' gift-card--added' : '');
      card.dataset.giftId = product.id;

      card.innerHTML = `
        <div class="gift-thumb" style="background:${cat.color}30">
          <div class="gift-icon" style="color:${cat.color}">${CAT_ICONS[cat.id]}</div>
          ${isAdded ? '<div class="gift-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg></div>' : ''}
        </div>
        <div class="gift-body">
          <div class="gift-name">${product.name}</div>
          <div class="gift-price-row">
            <span class="gift-currency">R$</span>
            <input type="text" class="gift-price-input" value="${customPrice.toFixed(2).replace('.', ',')}"
              onchange="onPriceChange('${product.id}', this.value)"
              onfocus="this.select()">
          </div>
          <button class="gift-btn ${isAdded ? 'gift-btn--remove' : 'gift-btn--add'}" onclick="toggleGift('${product.id}')">
            ${isAdded
              ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg> Remover'
              : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg> Adicionar'}
          </button>
        </div>
      `;
      scrollRow_.appendChild(card);
    });

    wrapper.appendChild(scrollRow_);
    section.appendChild(wrapper);
    container.appendChild(section);
  });

  updateStats();
}

// Init
loadSavedGifts();
