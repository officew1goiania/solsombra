// Training tracks data
export const trilhas = [
  {
    id: 'plano-de-saude',
    titulo: 'Plano de Saúde',
    subtitulo: 'Domine o mercado de saúde complementar',
    descricao: 'Aprenda tudo sobre planos de saúde: tipos, coberturas, carências, precificação e como realizar vendas consultivas com excelência.',
    icon: '🏥',
    cor: '#32DDC9',
    nivel: 'Iniciante → Avançado',
    duracao: '8h 30min',
    modulos: 6,
    aulas: 24,
    destaque: true,
    modulos_lista: [
      {
        id: 1,
        titulo: 'Introdução ao Mercado de Saúde',
        aulas: [
          { id: 1, titulo: 'Panorama do setor de saúde no Brasil', duracao: '18min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 2, titulo: 'Regulamentação e ANS', duracao: '22min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 3, titulo: 'Tipos de operadoras', duracao: '15min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
        ]
      },
      {
        id: 2,
        titulo: 'Tipos de Planos e Coberturas',
        aulas: [
          { id: 4, titulo: 'Individual, Familiar e Coletivo', duracao: '25min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 5, titulo: 'Carências e como explicar ao cliente', duracao: '20min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 6, titulo: 'Coberturas obrigatórias pela ANS', duracao: '18min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
        ]
      },
      {
        id: 3,
        titulo: 'Precificação e Comparativos',
        aulas: [
          { id: 7, titulo: 'Como ler e comparar tabelas de preços', duracao: '30min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 8, titulo: 'Fatores que influenciam no preço', duracao: '20min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
        ]
      },
      {
        id: 4,
        titulo: 'Abordagem e Vendas Consultivas',
        aulas: [
          { id: 9, titulo: 'Diagnóstico das necessidades do cliente', duracao: '28min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 10, titulo: 'Como apresentar o produto', duracao: '22min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 11, titulo: 'Contorno de objeções', duracao: '25min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
        ]
      },
    ],
    quiz: [
      { pergunta: 'Qual órgão regulamenta os planos de saúde no Brasil?', opcoes: ['SUSEP', 'ANS', 'BACEN', 'CVM'], correta: 1 },
      { pergunta: 'O que significa carência em um plano de saúde?', opcoes: ['Valor da mensalidade', 'Período sem cobertura após contratação', 'Limite de reembolso', 'Tipo de acomodação'], correta: 1 },
      { pergunta: 'Qual tipo de plano permite livre escolha de rede?', opcoes: ['HMO', 'PPO / Referenciado', 'Plano empresarial', 'Plano popular'], correta: 1 },
    ]
  },
  {
    id: 'seguro-de-vida',
    titulo: 'Seguro de Vida',
    subtitulo: 'Proteja famílias, construa patrimônio',
    descricao: 'Entenda todas as modalidades de seguros de vida, coberturas, como calcular o capital segurado ideal e como abordar esse produto de forma consultiva.',
    icon: '🛡️',
    cor: '#73A09F',
    nivel: 'Iniciante → Intermediário',
    duracao: '6h 45min',
    modulos: 5,
    aulas: 18,
    destaque: false,
    modulos_lista: [
      {
        id: 1,
        titulo: 'Fundamentos do Seguro de Vida',
        aulas: [
          { id: 1, titulo: 'O que é e para que serve o seguro de vida', duracao: '20min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 2, titulo: 'Principais coberturas disponíveis', duracao: '25min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 3, titulo: 'Diferença entre seguro e previdência', duracao: '18min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
        ]
      },
      {
        id: 2,
        titulo: 'Cálculo e Dimensionamento',
        aulas: [
          { id: 4, titulo: 'Como calcular o capital segurado ideal', duracao: '30min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 5, titulo: 'Influência da idade e perfil do cliente', duracao: '20min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
        ]
      },
    ],
    quiz: [
      { pergunta: 'O que é capital segurado?', opcoes: ['O valor pago mensalmente', 'O valor que os beneficiários recebem', 'A franquia do seguro', 'O custo administrativo'], correta: 1 },
      { pergunta: 'Qual cobertura paga em caso de acidente com invalidez permanente?', opcoes: ['DMHO', 'IPA', 'DIT', 'Funeral'], correta: 1 },
    ]
  },
  {
    id: 'consultoria-patrimonial',
    titulo: 'Consultoria Patrimonial',
    subtitulo: 'Planejamento financeiro 360°',
    descricao: 'O produto mais premium da W1. Aprenda a realizar diagnósticos financeiros completos, apresentar soluções de investimento e construir relacionamentos de longo prazo.',
    icon: '💼',
    cor: '#305A5F',
    nivel: 'Intermediário → Avançado',
    duracao: '12h 00min',
    modulos: 8,
    aulas: 32,
    destaque: true,
    modulos_lista: [
      {
        id: 1,
        titulo: 'Diagnóstico Financeiro',
        aulas: [
          { id: 1, titulo: 'Como mapear o patrimônio do cliente', duracao: '35min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 2, titulo: 'Análise de receitas e despesas', duracao: '28min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
        ]
      },
      {
        id: 2,
        titulo: 'Investimentos e Previdência',
        aulas: [
          { id: 3, titulo: 'Fundos de investimento: conceitos básicos', duracao: '40min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 4, titulo: 'PGBL x VGBL: qual recomendar?', duracao: '30min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 5, titulo: 'Perfil do investidor e suitability', duracao: '25min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
        ]
      },
    ],
    quiz: [
      { pergunta: 'Qual é a principal vantagem fiscal do PGBL?', opcoes: ['Isenção total de IR', 'Dedução de até 12% da renda bruta no IR', 'Rendimento livre de IR', 'Resgate sem tributação'], correta: 1 },
      { pergunta: 'O que é suitability?', opcoes: ['Tipo de fundo', 'Avaliação do perfil do investidor', 'Taxa de administração', 'Prazo de carência'], correta: 1 },
    ]
  },
  {
    id: 'business',
    titulo: 'Business W1',
    subtitulo: 'Construa seu escritório de sucesso',
    descricao: 'Entenda o modelo de negócio da W1, como estruturar sua equipe, recrutar talentos e liderar com propósito para escalar seus resultados.',
    icon: '🚀',
    cor: '#32DDC9',
    nivel: 'Todos os níveis',
    duracao: '9h 15min',
    modulos: 7,
    aulas: 28,
    destaque: false,
    modulos_lista: [
      {
        id: 1,
        titulo: 'Modelo de Negócio W1',
        aulas: [
          { id: 1, titulo: 'Como funciona a W1: visão geral', duracao: '22min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 2, titulo: 'Seu papel como consultor e líder', duracao: '20min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
        ]
      },
      {
        id: 2,
        titulo: 'Recrutamento e Seleção',
        aulas: [
          { id: 3, titulo: 'Como identificar talentos', duracao: '25min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 4, titulo: 'O processo seletivo W1', duracao: '30min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
        ]
      },
    ],
    quiz: [
      { pergunta: 'Qual é a base do modelo de negócio W1?', opcoes: ['Apenas comissões', 'Consultoria financeira integrada com recorrência', 'Captação de investimentos', 'Venda de seguros apenas'], correta: 1 },
    ]
  },
  {
    id: 'treinamento-entregas',
    titulo: 'Treinamento de Entregas',
    subtitulo: 'Excelência operacional nos processos',
    descricao: 'Domine os processos internos da W1: documentação, fluxos de entrega, qualidade no atendimento e padronização dos serviços.',
    icon: '📦',
    cor: '#73A09F',
    nivel: 'Iniciante',
    duracao: '5h 30min',
    modulos: 4,
    aulas: 16,
    destaque: false,
    modulos_lista: [
      {
        id: 1,
        titulo: 'Processos Internos',
        aulas: [
          { id: 1, titulo: 'Fluxo de atendimento ao cliente', duracao: '20min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 2, titulo: 'Documentação necessária por produto', duracao: '25min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 3, titulo: 'Sistemas e ferramentas internas', duracao: '18min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
        ]
      },
    ],
    quiz: [
      { pergunta: 'Qual o prazo padrão para entrega de apólice após aprovação?', opcoes: ['1 dia', '5 dias úteis', '30 dias', '15 dias corridos'], correta: 1 },
    ]
  },
  {
    id: 'tecnicas-de-vendas',
    titulo: 'Técnicas de Vendas',
    subtitulo: 'Da prospecção ao fechamento',
    descricao: 'Desenvolva habilidades comerciais de alto nível: prospecção ativa, rapport, apresentação de valor, manejo de objeções e fechamento de contratos.',
    icon: '🎯',
    cor: '#32DDC9',
    nivel: 'Todos os níveis',
    duracao: '7h 00min',
    modulos: 5,
    aulas: 20,
    destaque: false,
    modulos_lista: [
      {
        id: 1,
        titulo: 'Prospecção e Abordagem',
        aulas: [
          { id: 1, titulo: 'Onde encontrar seus clientes', duracao: '20min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 2, titulo: 'Primeiros 30 segundos: como gerar rapport', duracao: '18min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
        ]
      },
      {
        id: 2,
        titulo: 'Apresentação e Fechamento',
        aulas: [
          { id: 3, titulo: 'Apresentação de proposta de valor', duracao: '28min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 4, titulo: 'Técnicas de fechamento eficientes', duracao: '25min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
          { id: 5, titulo: 'Pós-venda e fidelização', duracao: '20min', youtube_id: 'dQw4w9WgXcQ', concluida: false },
        ]
      },
    ],
    quiz: [
      { pergunta: 'O que é rapport em vendas?', opcoes: ['Técnica de fechamento', 'Conexão de confiança com o cliente', 'Forma de precificar', 'Estratégia de prospecção'], correta: 1 },
    ]
  },
]
