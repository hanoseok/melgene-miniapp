/* Calcular IMC — português do Brasil. Mesma estrutura de chaves e marcadores de en.js (veja os comentários). Tratamento: você. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&display=swap',
    display: "'Outfit'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  num: { kg: '{n} kg', lb: '{n} lb', range: '{min} – {max}' },

  meta: {
    title: 'Calcular IMC – Índice de massa corporal para adultos',
    description: 'Calculadora de IMC grátis para adultos: digite sua altura e seu peso em cm/kg ou pés/libras e veja na hora seu índice de massa corporal, a classificação da OMS e seu peso ideal.',
    ogTitle: 'Calcular IMC ⚖️ Seu IMC e seu peso ideal',
    ogDescription: 'Índice de massa corporal em cm/kg ou pés/libras, faixas da OMS e asiáticas e o peso ideal para a sua altura.',
  },
  siteName: 'Calcular IMC',
  privacyLink: 'Política de Privacidade',

  hero: {
    h1Kicker: 'Calcular IMC',
    h1Html: 'Seu IMC, <em>enquanto você digita</em>',
    hook: 'Digite sua altura e seu peso para ver seu IMC em uma escala colorida e o peso ideal para a sua altura.',
  },

  ui: {
    unitsLabel: 'Unidades',
    metric: 'cm · kg',
    imperial: 'ft · lb',
    height: 'Altura',
    weight: 'Peso',
    cm: 'cm',
    kg: 'kg',
    ft: 'ft',
    inch: 'in',
    lb: 'lb',
    more: '+ Idade e sexo (opcional)',
    less: '− Ocultar idade e sexo',
    age: 'Idade',
    years: 'anos',
    sex: 'Sexo',
    sexNone: 'Não informar',
    female: 'Mulher',
    male: 'Homem',
    asiaToggle: 'Faixas asiáticas',
    yourBmi: 'Seu IMC',
    waiting: 'Digite sua altura e seu peso e seu IMC aparece aqui.',
    scaleLabel: 'Escala do IMC',
    rangeTitle: 'Peso ideal para a sua altura',
    toLose: 'Cerca de {w} acima da faixa saudável',
    toGain: 'Cerca de {w} abaixo da faixa saudável',
    inRange: 'Você está dentro da faixa saudável.',
    under18: 'Esta calculadora é para adultos a partir de 18 anos. Em crianças e adolescentes, o IMC é avaliado em curvas de crescimento por idade e sexo, então a classificação acima não vale.',
    senior: 'Depois dos 65 anos, um IMC um pouco mais alto costuma ser considerado normal. Seu médico pode dizer o que é melhor para você.',
    sexNote: 'As faixas de IMC para adultos são as mesmas para mulheres e homens, embora, com o mesmo IMC, as mulheres costumem ter mais gordura corporal.',
    disclaimerTitle: 'Antes de tirar conclusões',
    disclaimer: [
      'O IMC é só um indicador rápido, não um diagnóstico nem uma orientação médica.',
      'Ele não diferencia músculo de gordura, então atletas e pessoas musculosas podem dar alto.',
      'Não vale durante a gravidez, e esta calculadora é só para adultos a partir de 18 anos.',
    ],
    decimalHint: 'Decimais: “.” e “,” funcionam.',
    finish: 'Ver meu resumo ✓',
    needOne: 'Digite primeiro sua altura e seu peso.',
    localNote: 'Calculado no seu aparelho. Nada do que você digita é enviado ou salvo.',
    summaryTitle: 'Resumo do seu IMC',
    summaryNote: 'Este resumo existe só nesta página. Nada é salvo.',
    sumScale: 'Faixas',
    sumRange: 'Peso ideal',
    again: 'Começar de novo',
    live: 'IMC {bmi}, {cat}',
    shareTitle: 'Calcular IMC',
    shareText: 'Calcule seu IMC e seu peso ideal em segundos ⚖️',
  },

  scales: {
    who: {
      name: 'OMS',
      note: 'Classificação para adultos da Organização Mundial da Saúde, a mesma usada pelo Ministério da Saúde.',
      labels: ['Abaixo do peso', 'Peso normal', 'Sobrepeso', 'Obesidade grau I', 'Obesidade grau II', 'Obesidade grau III'],
    },
    alt: {
      name: 'Ásia-Pacífico',
      note: 'Faixas da OMS para a Ásia-Pacífico (2000): em muitas pessoas de origem asiática os riscos à saúde começam com um IMC mais baixo.',
      labels: ['Abaixo do peso', 'Peso normal', 'Sobrepeso (risco)', 'Obesidade grau I', 'Obesidade grau II'],
    },
  },

  errors: {
    badNum: 'Use só números, com “.” ou “,” para os decimais.',
    heightRange: 'Confira a altura: ela deve ficar entre 50 e 272 cm.',
    weightRange: 'Confira o peso: ele deve ficar entre 10 e 650 kg.',
    inchRange: 'As polegadas devem ser menos de 12. Coloque os pés inteiros no primeiro campo.',
    ageRange: 'A idade deve ser um número inteiro entre 2 e 120.',
  },

  og: {
    brand: '⚖️ Calcular IMC',
    kicker: 'Altura · Peso · IMC',
    title: 'Onde fica o seu IMC na escala?',
    desc: 'Com o peso ideal para a sua altura',
  },

  faq: [
    { q: 'Como se calcula o IMC?', a: 'Divida o peso em quilos pela altura em metros ao quadrado. Com 1,70 m e 65 kg, fica 65 ÷ (1,7 × 1,7) ≈ 22,5. Se você digitar pés e libras, a calculadora converte sozinha.' },
    { q: 'Qual é o IMC normal para adultos?', a: 'Pela OMS, de 18,5 a 24,9 é peso normal, de 25 a 29,9 é sobrepeso e de 30 para cima é obesidade. Para pessoas de origem asiática costumam ser indicadas faixas mais baixas, que você pode ligar no botão “Faixas asiáticas”.' },
    { q: 'Por que meu IMC dá alto se eu treino?', a: 'O IMC só olha peso e altura, então não sabe se esse peso é músculo ou gordura. Muita gente que faz musculação aparece com sobrepeso mesmo estando definida. A medida da cintura ou uma bioimpedância dizem bem mais.' },
    { q: 'Posso usar para crianças ou na gravidez?', a: 'Não. Até os 18 anos usam-se as curvas de crescimento por idade e sexo da Caderneta da Criança, e o ganho de peso na gestação tem orientações próprias. Nesses casos, fale com seu médico.' },
  ],

  privacy: {
    title: 'Política de Privacidade | Calcular IMC',
    description: 'Política de Privacidade do Calcular IMC: sua altura, peso e idade ficam no seu navegador, além de cookies, publicidade e estatísticas.',
    h1: 'Política de Privacidade',
    introHtml: 'Calcular IMC (o "Serviço") respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.',
    sections: [
      ['1. Informações coletadas', 'O Serviço funciona sem conta e sem login. A altura, o peso, a idade e o sexo que você digita são calculados só no seu navegador. Eles não são enviados ao nosso servidor, não são salvos e não entram em nenhum link. O Serviço lembra no seu aparelho apenas as unidades que você usou por último (cm·kg ou ft·lb). Quando você usa os botões de compartilhar, só o endereço da página e um texto curto sem os seus números são compartilhados, e apenas com quem você escolher.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e suas unidades, exibir anúncios e entender como é usado. Você pode recusar ou apagar nas configurações do navegador; nesse caso, alguns recursos podem não funcionar como esperado.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores próprios que guardam só totais diários por idioma (visualizações, cálculos, avaliações). Suas medidas nunca entram nesses números, e nada disso identifica você pessoalmente.'],
      ['5. Contato', 'Se tiver dúvidas sobre esta Política de Privacidade, entre em contato com o responsável pelo site.'],
      ['6. Vigência', 'Esta política vale a partir de 24 de outubro de 2026.'],
    ],
    back: '← Voltar para Calcular IMC',
  },
};
