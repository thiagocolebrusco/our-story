export interface Photo {
  id: string
  caption: string
  rotation: number
  size: 'normal' | 'large'
}

// Add a trivia question to any year to gate the pack opening.
// The answer check is case-insensitive and trims whitespace.
// Optionally provide a `hint` shown after a wrong answer.
// Leave `trivia` undefined to open the pack without a gate.
//
// Example:
//   trivia: {
//     question: 'Qual foi o nome do restaurante do nosso primeiro encontro?',
//     answer: 'La Pasta',
//     hint: 'Começa com "La"...',
//   }
export interface TriviaQuestion {
  question: string
  answer: string
  hint?: string
}

// Attach a gift to any year. The gift button appears only after the pack is opened.
// `image` can be a URL or a path relative to /public (e.g. '/gifts/jantar.jpg').
// `title` is optional — defaults to "Um presente especial ♡".
//
// Example:
//   gift: {
//     title: 'Jantar surpresa',
//     image: '/gifts/jantar.jpg',
//     description: 'Uma noite especial só para nós dois ♡',
//   }
export interface Gift {
  title?: string
  image: string
  description: string
}

export interface YearPage {
  year: number
  token: string  // opaque unlock token — used in QR codes, doesn't reveal the year
  title: string
  subtitle?: string
  photos: Photo[]
  bgTone: 'cream' | 'blush'
  decoration?: 'stars' | 'hearts' | 'flowers' | 'none'
  trivia?: TriviaQuestion
  gift?: Gift
}

// Maps opaque token → year number for URL unlock handling (year mode)
export const tokenToYear: Record<string, number> = {}

// ── Pack mode ────────────────────────────────────────────────────────────────
// In pack mode each QR code unlocks a pack of photos from DIFFERENT years.
// A year is "complete" once all its photos are individually unlocked.
// Gifts trigger on year completion regardless of which mode is active.
//
// ── HOW TO EDIT PACKS ────────────────────────────────────────────────────────
// Photos are numbered 1–108 in album order (year by year, left to right):
//
//  #   photo      year   caption (first words)
//  1   2009-1     2009   O dia em que tudo mudou
//  2   2009-2     2009   Nossa primeira aventura
//  3   2009-3     2009   Já inseparáveis
//  4   2009-4     2009   Quando tudo começou
//  5   2009-5     2009   Nos perdendo e nos encontrando
//  6   2009-6     2009   O primeiro de muitos
//  7   2010-1     2010   Aprendendo a nos amar
//  8   2010-2     2010   Perfeitamente imperfeitos
//  9   2010-3     2010   Descobrindo cada detalhe
// 10   2010-4     2010   Sempre que eu precisei
// 11   2010-5     2010   Do seu jeito, do meu jeito
// 12   2010-6     2010   Encontrando nosso ritmo
// 13   2010-7     2010   Rindo dos erros juntos
// 14   2010-8     2010   Memórias que guardarei
// 15   2010-9     2010   Um ano de descobertas
// 16   2011-1     2011   Criando recordações
// 17   2011-2     2011   O nosso mundinho
// 18   2011-3     2011   Rindo até doer
// 19   2011-4     2011   Mais próximos a cada dia
// 20   2012-1     2012   Lar é onde você está
// 21   2012-2     2012   Nós dois contra o mundo
// 22   2012-3     2012   Construindo nossa história
// 23   2012-4     2012   Onde quer que você esteja
// 24   2012-5     2012   Cada dia diferente, cada dia seu
// 25   2012-6     2012   Compartilhando tudo
// 26   2012-7     2012   Mais fundo a cada vez
// 27   2012-8     2012   Nosso cantinho
// 28   2012-9     2012   Um capítulo fechado com amor
// 29   2013-1     2013   Tantas primeiras vezes
// 30   2013-2     2013   Minha melhor companhia de viagem
// 31   2013-3     2013   Manhãs de domingo
// 32   2013-4     2013   Nunca um momento entediante
// 33   2013-5     2013   Tudo o que eu precisava
// 34   2014-1     2014   Evoluindo lado a lado
// 35   2014-2     2014   Para onde vamos agora?
// 36   2014-3     2014   Felizes no nosso caos
// 37   2014-4     2014   Crescendo junto a você
// 38   2014-5     2014   Cada decisão, juntos
// 39   2015-1     2015   Simples e lindo assim
// 40   2015-2     2015   Só preciso de você
// 41   2015-3     2015   Encontrando beleza no cotidiano
// 42   2015-4     2015   Exatamente o que precisávamos
// 43   2016-1     2016   Ombro a ombro
// 44   2016-2     2016   Melhor juntos
// 45   2016-3     2016   Nossa diversão
// 46   2016-4     2016   Lado a lado sempre
// 47   2016-5     2016   Como eu te amo, cada dia mais
// 48   2017-1     2017   Não consigo imaginar diferente
// 49   2017-2     2017   Meu humano favorito
// 50   2017-3     2017   As coisas boas da vida
// 51   2017-4     2017   E eu escolheria de novo
// 52   2017-5     2017   Quem diria que chegaria tão longe
// 53   2017-6     2017   Dias que sempre vou guardar
// 54   2017-7     2017   De mãos dadas com você
// 55   2017-8     2017   Oito anos e tanto amor
// 56   2018-1     2018   Nós dois e o mundo
// 57   2018-2     2018   Exatamente onde quero estar
// 58   2018-3     2018   Sempre um ao lado do outro
// 59   2018-4     2018   O que nos faz tão fortes
// 60   2018-5     2018   Cada momento, um presente
// 61   2018-6     2018   Nunca me canso de você
// 62   2018-7     2018   O jeito que você me olha
// 63   2018-8     2018   Tanto tempo, tanto amor
// 64   2018-9     2018   Minha pessoa favorita no mundo
// 65   2019-1     2019   Uma última aventura
// 66   2019-2     2019   Dias que guardarei para sempre
// 67   2019-3     2019   Momentos dourados
// 68   2019-4     2019   Viajando, descobrindo, vivendo
// 69   2019-5     2019   Cada lugar fica melhor com você
// 70   2019-6     2019   Olhando o horizonte juntos
// 71   2019-7     2019   Explorando o mundo ao seu lado
// 72   2019-8     2019   De mochila, de mãos dadas
// 73   2019-9     2019   Risos perdidos pelo caminho
// 74   2019-10    2019   Cada foto, uma memória
// 75   2019-11    2019   Nosso melhor ano
// 76   2019-12    2019   Voltando sempre para casa
// 77   2019-13    2019   Onde quer que eu vá, quero você
// 78   2020-1     2020   Juntos por tudo
// 79   2020-2     2020   Encontrando alegria em casa
// 80   2020-3     2020   Só nós dois e o mundo lá fora
// 81   2020-4     2020   Reinventando o cotidiano
// 82   2020-5     2020   Amor nos tempos difíceis
// 83   2020-6     2020   Saindo da tempestade de mãos dadas
// 84   2021-1     2021   Um novo começo
// 85   2021-2     2021   Escolhendo você, sempre
// 86   2021-3     2021   De volta ao que importa
// 87   2022-1     2022   Novos começos
// 88   2022-2     2022   Ainda meu sorriso favorito
// 89   2022-3     2022   Muito mais por vir
// 90   2022-4     2022   Construindo algo bonito
// 91   2022-5     2022   Cada capítulo melhor que o anterior
// 92   2022-6     2022   O futuro nos espera
// 93   2022-7     2022   Olhando para trás com gratidão
// 94   2023-1     2023   Mais fortes a cada ano
// 95   2023-2     2023   O melhor ainda está por vir
// 96   2023-3     2023   Ainda rindo
// 97   2023-4     2023   Quatorze anos e cada vez mais amor
// 98   2024-1     2024   Mais uma volta ao sol
// 99   2024-2     2024   Você faz tudo melhor
// 100  2024-3     2024   Sempre mais um motivo para sorrir
// 101  2024-4     2024   Olhando para o futuro, de mãos dadas
// 102  2025-1     2025   17 anos ♡
// 103  2025-2     2025   E eu escolheria de novo
// 104  2025-3     2025   Nossa história continua
// 105  2025-4     2025   Para sempre seus
// 106  2025-5     2025   Cada ano, mais amor
// 107  2025-6     2025   O melhor ainda está por vir
// 108  2025-7     2025   Nossa história, para sempre
//
// ── TOKENS (QR codes) ─────────────────────────────────────────────────────────
// These are the opaque strings encoded in the QR codes you hide around the house.
// Tokens are NOT linked to specific packs — the 1st token scanned always opens
// pack 1, the 2nd token opens pack 2, etc., regardless of which token it is.
// Add/remove tokens freely; the count just needs to match the number of packs.
export const packTokens: ReadonlySet<string> = new Set([
  'a2kp7nmx',
  'b8vr3qhc',
  'c5tz9wjd',
  'd7mx4bkr',
  'e3nf8ypq',
  'f9cs2vwt',
  'g4hb7znk',
  'h6qr5mcj',
  'i2wp9tfx',
  'j8nd3kcv',
  'k5fv6rxb',
  'l7th2qnm',
  'm4jx8bpw',
  'n9kc3fzr',
  'o6mb5ytj',
  'p3qn7hxc',
  'q8rz4vdk',
])

// ── PACKS (content queue) ─────────────────────────────────────────────────────
// Packs unlock in order: pack 1 first, pack 2 second, etc.
// Edit `indices` to control which photos each pack reveals.
// Each number must appear in exactly one pack (all 108 must be covered).
//
// Year completion schedule (non-chronological, packs 1–2 complete nothing):
//   pack-1  → no completion        (intro: 2009, 2012, 2015, 2019, 2022, 2025 firsts)
//   pack-2  → no completion        (intro: 2010, 2011, 2013, 2016, 2018, 2021 firsts)
//   pack-3  → completes 2015
//   pack-4  → completes 2021
//   pack-5  → completes 2020
//   pack-6  → completes 2011
//   pack-7  → completes 2009, 2024
//   pack-8  → completes 2013
//   pack-9  → completes 2023
//   pack-10 → completes 2010
//   pack-11 → completes 2012, 2014
//   pack-12 → completes 2016
//   pack-13 → completes 2018
//   pack-14 → completes 2019
//   pack-15 → completes 2022
//   pack-16 → completes 2017
//   pack-17 → completes 2025
export interface PackPhoto {
  year: number
  photoId: string
}

export interface Pack {
  id: string
  photos: PackPhoto[]
}

const packDefinitions: { id: string; indices: number[] }[] = [
  { id: 'pack-1',  indices: [  1,  20,  39,  65,  87, 102] },
  { id: 'pack-2',  indices: [  7,  16,  29,  43,  56,  84] },
  { id: 'pack-3',  indices: [  2,  40,  41,  42,  57,  78,  94] },
  { id: 'pack-4',  indices: [  3,  17,  58,  79,  85,  86, 103] },
  { id: 'pack-5',  indices: [ 21,  30,  59,  80,  83, 104] },
  { id: 'pack-6',  indices: [  8,  18,  19,  22,  66,  88] },
  { id: 'pack-7',  indices: [  4,   6,   9,  31,  44,  67, 101] },
  { id: 'pack-8',  indices: [  5,  23,  33,  60,  81,  95] },
  { id: 'pack-9',  indices: [ 10,  24,  48,  61,  96,  97] },
  { id: 'pack-10', indices: [ 15,  25,  34,  49,  68,  89] },
  { id: 'pack-11', indices: [ 11,  28,  35,  38,  50,  62,  82] },
  { id: 'pack-12', indices: [ 26,  36,  47,  51,  69, 105] },
  { id: 'pack-13', indices: [ 37,  45,  52,  64,  70, 106] },
  { id: 'pack-14', indices: [ 12,  27,  53,  71,  72,  77,  90] },
  { id: 'pack-15', indices: [ 14,  54,  73,  91,  93, 107] },
  { id: 'pack-16', indices: [ 46,  55,  74,  92,  98,  99] },
  { id: 'pack-17', indices: [ 13,  32,  63,  75,  76, 100, 108] },
]

export const coverData = {
  title: 'Our Story',
  names: 'Thiago & Mayara',
  years: '2009 — 2025',
  tagline: '17 anos de amor ♡',
}

export const pages: YearPage[] = [
  {
    year: 2009,
    token: 'm7k2pxr9',
    title: 'O começo de tudo',
    subtitle: 'Onde nossa história começou',
    bgTone: 'cream',
    decoration: 'hearts',
    trivia: {
      question: 'Em que ano nos conhecemos?',
      answer: '2009',
      hint: 'É o ano desta página 😄',
    },
    photos: [
      { id: '2009-1', caption: 'O dia em que tudo mudou ♡',         rotation: -2,   size: 'normal' },
      { id: '2009-2', caption: 'Nossa primeira aventura',             rotation:  3,   size: 'normal' },
      { id: '2009-3', caption: 'Já inseparáveis',                     rotation: -1.5, size: 'normal' },
      { id: '2009-4', caption: 'Quando tudo começou',                 rotation:  2.5, size: 'normal' },
      { id: '2009-5', caption: 'Nos perdendo e nos encontrando',      rotation: -3,   size: 'normal' },
      { id: '2009-6', caption: 'O primeiro de muitos',                rotation:  1,   size: 'normal' },
    ],
  },
  {
    year: 2010,
    token: 'v4nq8bzt',
    title: 'Descobrindo um ao outro',
    bgTone: 'blush',
    decoration: 'none',
    photos: [
      { id: '2010-1', caption: 'Aprendendo a nos amar',               rotation: -2.5, size: 'normal' },
      { id: '2010-2', caption: 'Perfeitamente imperfeitos',            rotation:  3.5, size: 'normal' },
      { id: '2010-3', caption: 'Descobrindo cada detalhe',             rotation: -1,   size: 'normal' },
      { id: '2010-4', caption: 'Sempre que eu precisei',               rotation:  2,   size: 'normal' },
      { id: '2010-5', caption: 'Do seu jeito, do meu jeito',           rotation: -3.5, size: 'normal' },
      { id: '2010-6', caption: 'Encontrando nosso ritmo',              rotation:  1.5, size: 'normal' },
      { id: '2010-7', caption: 'Rindo dos erros juntos',               rotation: -2,   size: 'normal' },
      { id: '2010-8', caption: 'Memórias que guardarei',               rotation:  3,   size: 'normal' },
      { id: '2010-9', caption: 'Um ano de descobertas',                rotation: -1.5, size: 'normal' },
    ],
  },
  {
    year: 2011,
    token: 'h3wf6ycd',
    title: 'Mil memórias',
    bgTone: 'cream',
    decoration: 'stars',
    photos: [
      { id: '2011-1', caption: 'Criando recordações',                  rotation:  2.5, size: 'normal' },
      { id: '2011-2', caption: 'O nosso mundinho',                     rotation: -3,   size: 'normal' },
      { id: '2011-3', caption: 'Rindo até doer',                       rotation:  1,   size: 'normal' },
      { id: '2011-4', caption: 'Mais próximos a cada dia',             rotation: -2.5, size: 'normal' },
    ],
  },
  {
    year: 2012,
    token: 'j9xs2mpl',
    title: 'Nosso lar',
    bgTone: 'blush',
    decoration: 'hearts',
    photos: [
      { id: '2012-1', caption: 'Lar é onde você está',                 rotation:  3.5, size: 'normal' },
      { id: '2012-2', caption: 'Nós dois contra o mundo',              rotation: -1,   size: 'normal' },
      { id: '2012-3', caption: 'Construindo nossa história',           rotation:  2,   size: 'normal' },
      { id: '2012-4', caption: 'Onde quer que você esteja',            rotation: -3.5, size: 'normal' },
      { id: '2012-5', caption: 'Cada dia diferente, cada dia seu',     rotation:  1.5, size: 'normal' },
      { id: '2012-6', caption: 'Compartilhando tudo',                  rotation: -2,   size: 'normal' },
      { id: '2012-7', caption: 'Mais fundo a cada vez',                rotation:  3,   size: 'normal' },
      { id: '2012-8', caption: 'Nosso cantinho',                       rotation: -1.5, size: 'normal' },
      { id: '2012-9', caption: 'Um capítulo fechado com amor',         rotation:  2.5, size: 'normal' },
    ],
  },
  {
    year: 2013,
    token: 'r5bt7nqk',
    title: 'Um ano inesquecível',
    bgTone: 'cream',
    decoration: 'flowers',
    photos: [
      { id: '2013-1', caption: 'Tantas primeiras vezes',               rotation: -3,   size: 'normal' },
      { id: '2013-2', caption: 'Minha melhor companhia de viagem',     rotation:  1,   size: 'normal' },
      { id: '2013-3', caption: 'Manhãs de domingo',                    rotation: -2.5, size: 'normal' },
      { id: '2013-4', caption: 'Nunca um momento entediante',          rotation:  3.5, size: 'normal' },
      { id: '2013-5', caption: 'Tudo o que eu precisava',              rotation: -1,   size: 'normal' },
    ],
  },
  {
    year: 2014,
    token: 'g8vz4wcf',
    title: 'Crescendo juntos',
    bgTone: 'blush',
    decoration: 'none',
    photos: [
      { id: '2014-1', caption: 'Evoluindo lado a lado',                rotation:  2,   size: 'normal' },
      { id: '2014-2', caption: 'Para onde vamos agora?',               rotation: -3.5, size: 'normal' },
      { id: '2014-3', caption: 'Felizes no nosso caos',                rotation:  1.5, size: 'normal' },
      { id: '2014-4', caption: 'Crescendo junto a você',               rotation: -2,   size: 'normal' },
      { id: '2014-5', caption: 'Cada decisão, juntos',                 rotation:  3,   size: 'normal' },
    ],
  },
  {
    year: 2015,
    token: 'd2hn9kxr',
    title: 'Simplicidade',
    bgTone: 'cream',
    decoration: 'stars',
    photos: [
      { id: '2015-1', caption: 'Simples e lindo assim',                rotation: -1.5, size: 'normal' },
      { id: '2015-2', caption: 'Só preciso de você',                   rotation:  2.5, size: 'normal' },
      { id: '2015-3', caption: 'Encontrando beleza no cotidiano',      rotation: -3,   size: 'normal' },
      { id: '2015-4', caption: 'Exatamente o que precisávamos',        rotation:  1,   size: 'normal' },
    ],
  },
  {
    year: 2016,
    token: 'p6mf3ybz',
    title: 'Sempre do lado',
    bgTone: 'blush',
    decoration: 'hearts',
    photos: [
      { id: '2016-1', caption: 'Ombro a ombro',                        rotation: -2.5, size: 'normal' },
      { id: '2016-2', caption: 'Melhor juntos',                        rotation:  3.5, size: 'normal' },
      { id: '2016-3', caption: 'Nossa diversão',                       rotation: -1,   size: 'normal' },
      { id: '2016-4', caption: 'Lado a lado sempre',                   rotation:  2,   size: 'normal' },
      { id: '2016-5', caption: 'Como eu te amo, cada dia mais',        rotation: -3.5, size: 'normal' },
    ],
  },
  {
    year: 2017,
    token: 'w4cs8tqn',
    title: 'Cada vez melhor',
    bgTone: 'cream',
    decoration: 'flowers',
    photos: [
      { id: '2017-1', caption: 'Não consigo imaginar diferente',       rotation:  1.5, size: 'normal' },
      { id: '2017-2', caption: 'Meu humano favorito',                  rotation: -2,   size: 'normal' },
      { id: '2017-3', caption: 'As coisas boas da vida',               rotation:  3,   size: 'normal' },
      { id: '2017-4', caption: 'E eu escolheria de novo',              rotation: -1.5, size: 'normal' },
      { id: '2017-5', caption: 'Quem diria que chegaria tão longe',    rotation:  2.5, size: 'normal' },
      { id: '2017-6', caption: 'Dias que sempre vou guardar',          rotation: -3,   size: 'normal' },
      { id: '2017-7', caption: 'De mãos dadas com você',               rotation:  1,   size: 'normal' },
      { id: '2017-8', caption: 'Oito anos e tanto amor',               rotation: -2.5, size: 'normal' },
    ],
  },
  {
    year: 2018,
    token: 'k7rx2hjv',
    title: 'Só nós dois',
    bgTone: 'blush',
    decoration: 'none',
    photos: [
      { id: '2018-1', caption: 'Nós dois e o mundo',                   rotation:  3.5, size: 'normal' },
      { id: '2018-2', caption: 'Exatamente onde quero estar',          rotation: -1,   size: 'normal' },
      { id: '2018-3', caption: 'Sempre um ao lado do outro',           rotation:  2,   size: 'normal' },
      { id: '2018-4', caption: 'O que nos faz tão fortes',             rotation: -3.5, size: 'normal' },
      { id: '2018-5', caption: 'Cada momento, um presente',            rotation:  1.5, size: 'normal' },
      { id: '2018-6', caption: 'Nunca me canso de você',               rotation: -2,   size: 'normal' },
      { id: '2018-7', caption: 'O jeito que você me olha',             rotation:  3,   size: 'normal' },
      { id: '2018-8', caption: 'Tanto tempo, tanto amor',              rotation: -1.5, size: 'normal' },
      { id: '2018-9', caption: 'Minha pessoa favorita no mundo',       rotation:  2.5, size: 'normal' },
    ],
  },
  {
    year: 2019,
    token: 'f9qb5znm',
    title: 'Dias dourados',
    bgTone: 'cream',
    decoration: 'stars',
    photos: [
      { id: '2019-1',  caption: 'Uma última aventura',                 rotation: -3,   size: 'normal' },
      { id: '2019-2',  caption: 'Dias que guardarei para sempre',      rotation:  1,   size: 'normal' },
      { id: '2019-3',  caption: 'Momentos dourados',                   rotation: -2.5, size: 'normal' },
      { id: '2019-4',  caption: 'Viajando, descobrindo, vivendo',      rotation:  3.5, size: 'normal' },
      { id: '2019-5',  caption: 'Cada lugar fica melhor com você',     rotation: -1,   size: 'normal' },
      { id: '2019-6',  caption: 'Olhando o horizonte juntos',          rotation:  2,   size: 'normal' },
      { id: '2019-7',  caption: 'Explorando o mundo ao seu lado',      rotation: -3.5, size: 'normal' },
      { id: '2019-8',  caption: 'De mochila, de mãos dadas',           rotation:  1.5, size: 'normal' },
      { id: '2019-9',  caption: 'Risos perdidos pelo caminho',         rotation: -2,   size: 'normal' },
      { id: '2019-10', caption: 'Cada foto, uma memória',              rotation:  3,   size: 'normal' },
      { id: '2019-11', caption: 'Nosso melhor ano',                    rotation: -1.5, size: 'normal' },
      { id: '2019-12', caption: 'Voltando sempre para casa',           rotation:  2.5, size: 'normal' },
      { id: '2019-13', caption: 'Onde quer que eu vá, quero você',     rotation: -3,   size: 'normal' },
    ],
  },
  {
    year: 2020,
    token: 't3wy6pkd',
    title: 'Juntos por tudo',
    bgTone: 'blush',
    decoration: 'hearts',
    photos: [
      { id: '2020-1', caption: 'Juntos por tudo',                      rotation:  1,   size: 'normal' },
      { id: '2020-2', caption: 'Encontrando alegria em casa',          rotation: -2.5, size: 'normal' },
      { id: '2020-3', caption: 'Só nós dois e o mundo lá fora',        rotation:  3.5, size: 'normal' },
      { id: '2020-4', caption: 'Reinventando o cotidiano',             rotation: -1,   size: 'normal' },
      { id: '2020-5', caption: 'Amor nos tempos difíceis',             rotation:  2,   size: 'normal' },
      { id: '2020-6', caption: 'Saindo da tempestade de mãos dadas',   rotation: -3.5, size: 'normal' },
    ],
  },
  {
    year: 2021,
    token: 'x8nv4bcr',
    title: 'Recomeçando',
    bgTone: 'cream',
    decoration: 'flowers',
    photos: [
      { id: '2021-1', caption: 'Um novo começo',                       rotation:  1.5, size: 'normal' },
      { id: '2021-2', caption: 'Escolhendo você, sempre',              rotation: -2,   size: 'normal' },
      { id: '2021-3', caption: 'De volta ao que importa',              rotation:  3,   size: 'normal' },
    ],
  },
  {
    year: 2022,
    token: 'q2km9fzt',
    title: 'Novos capítulos',
    bgTone: 'blush',
    decoration: 'stars',
    photos: [
      { id: '2022-1', caption: 'Novos começos',                        rotation: -1.5, size: 'normal' },
      { id: '2022-2', caption: 'Ainda meu sorriso favorito',           rotation:  2.5, size: 'normal' },
      { id: '2022-3', caption: 'Muito mais por vir',                   rotation: -3,   size: 'normal' },
      { id: '2022-4', caption: 'Construindo algo bonito',              rotation:  1,   size: 'normal' },
      { id: '2022-5', caption: 'Cada capítulo melhor que o anterior',  rotation: -2.5, size: 'normal' },
      { id: '2022-6', caption: 'O futuro nos espera',                  rotation:  3.5, size: 'normal' },
      { id: '2022-7', caption: 'Olhando para trás com gratidão',       rotation: -1,   size: 'normal' },
    ],
  },
  {
    year: 2023,
    token: 'b6ph3wxs',
    title: 'Mais fortes',
    bgTone: 'cream',
    decoration: 'hearts',
    photos: [
      { id: '2023-1', caption: 'Mais fortes a cada ano',               rotation:  2,   size: 'normal' },
      { id: '2023-2', caption: 'O melhor ainda está por vir',          rotation: -3.5, size: 'normal' },
      { id: '2023-3', caption: 'Ainda rindo',                          rotation:  1.5, size: 'normal' },
      { id: '2023-4', caption: 'Quatorze anos e cada vez mais amor',   rotation: -2,   size: 'normal' },
    ],
  },
  {
    year: 2024,
    token: 'c5fj7qnr',
    title: 'Mais uma volta ao sol',
    bgTone: 'blush',
    decoration: 'none',
    photos: [
      { id: '2024-1', caption: 'Mais uma volta ao sol',                rotation:  3,   size: 'normal' },
      { id: '2024-2', caption: 'Você faz tudo melhor',                 rotation: -1.5, size: 'normal' },
      { id: '2024-3', caption: 'Sempre mais um motivo para sorrir',    rotation:  2.5, size: 'normal' },
      { id: '2024-4', caption: 'Olhando para o futuro, de mãos dadas', rotation: -3,   size: 'normal' },
    ],
  },
  {
    year: 2025,
    token: 'z9dr4mkb',
    title: '17 anos de amor',
    subtitle: 'E eu escolheria de novo ♡',
    bgTone: 'cream',
    decoration: 'flowers',
    gift: {
      title: 'Um presente especial ♡',
      image: 'https://picsum.photos/seed/gift2025/600/400',
      description: 'Substitua isso com a descrição do seu presente aqui. Pode ser um jantar, uma viagem, qualquer coisa especial que você tenha preparado para ela.',
    },
    photos: [
      { id: '2025-1', caption: '17 anos ♡',                            rotation:  1,   size: 'normal' },
      { id: '2025-2', caption: 'E eu escolheria de novo',              rotation: -2.5, size: 'normal' },
      { id: '2025-3', caption: 'Nossa história continua',              rotation:  3.5, size: 'normal' },
      { id: '2025-4', caption: 'Para sempre seus',                     rotation: -1,   size: 'normal' },
      { id: '2025-5', caption: 'Cada ano, mais amor',                  rotation:  2,   size: 'normal' },
      { id: '2025-6', caption: 'O melhor ainda está por vir',          rotation: -3.5, size: 'normal' },
      { id: '2025-7', caption: 'Nossa história, para sempre',          rotation:  1.5, size: 'normal' },
    ],
  },
]

// Build token → year lookup from the pages array
pages.forEach(p => { tokenToYear[p.token] = p.year })

// ── Build packs from index-based definitions ──────────────────────────────
// Flat list of every photo in album order (index 1 = first photo of 2009)
const allPhotos: PackPhoto[] = pages.flatMap(p =>
  p.photos.map(ph => ({ year: p.year, photoId: ph.id }))
)

// Photos always reveal in ascending story order regardless of how indices are listed.
export const packs: Pack[] = packDefinitions.map(def => ({
  id: def.id,
  photos: [...def.indices].sort((a, b) => a - b).map(i => allPhotos[i - 1]!),
}))
