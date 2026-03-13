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
// Photos are numbered 1–49 in album order (year by year, left to right):
//
//  #  photo     year   caption (first words)
//  1  2009-1    2009   O dia em que tudo mudou
//  2  2009-2    2009   Nossa primeira aventura
//  3  2009-3    2009   Já inseparáveis
//  4  2010-1    2010   Aprendendo a nos amar
//  5  2010-2    2010   Perfeitamente imperfeitos
//  6  2011-1    2011   Criando recordações
//  7  2011-2    2011   O nosso mundinho
//  8  2011-3    2011   Rindo até doer
//  9  2012-1    2012   Lar é onde você está
// 10  2012-2    2012   Nós dois contra o mundo
// 11  2013-1    2013   Tantas primeiras vezes
// 12  2013-2    2013   Minha melhor companhia de viagem
// 13  2013-3    2013   Manhãs de domingo
// 14  2013-4    2013   Nunca um momento entediante
// 15  2014-1    2014   Evoluindo lado a lado
// 16  2014-2    2014   Para onde vamos agora?
// 17  2014-3    2014   Felizes no nosso caos
// 18  2015-1    2015   Simples e lindo assim
// 19  2015-2    2015   Só preciso de você
// 20  2016-1    2016   Ombro a ombro
// 21  2016-2    2016   Melhor juntos
// 22  2016-3    2016   Nossa diversão
// 23  2017-1    2017   Não consigo imaginar diferente
// 24  2017-2    2017   Meu humano favorito
// 25  2017-3    2017   As coisas boas da vida
// 26  2017-4    2017   E eu escolheria de novo
// 27  2018-1    2018   Nós dois e o mundo
// 28  2018-2    2018   Exatamente onde quero estar
// 29  2019-1    2019   Uma última aventura
// 30  2019-2    2019   Dias que guardarei para sempre
// 31  2019-3    2019   Momentos dourados
// 32  2020-1    2020   Juntos por tudo
// 33  2020-2    2020   Encontrando alegria em casa
// 34  2021-1    2021   Um novo começo
// 35  2021-2    2021   Escolhendo você, sempre
// 36  2021-3    2021   De volta ao que importa
// 37  2022-1    2022   Novos começos
// 38  2022-2    2022   Ainda meu sorriso favorito
// 39  2022-3    2022   Muito mais por vir
// 40  2022-4    2022   Construindo algo bonito
// 41  2023-1    2023   Mais fortes a cada ano
// 42  2023-2    2023   O melhor ainda está por vir
// 43  2023-3    2023   Ainda rindo
// 44  2024-1    2024   Mais uma volta ao sol
// 45  2024-2    2024   Você faz tudo melhor
// 46  2025-1    2025   17 anos ♡
// 47  2025-2    2025   E eu escolheria de novo
// 48  2025-3    2025   Nossa história continua
// 49  2025-4    2025   Para sempre seus
//
// Edit the `indices` arrays below to reassign photos to packs.
// Each number must appear in exactly one pack (all 49 must be covered).
// ─────────────────────────────────────────────────────────────────────────────

export interface PackPhoto {
  year: number
  photoId: string
}

export interface Pack {
  id: string
  token: string   // opaque unlock token used in QR codes
  photos: PackPhoto[]
}

// Pack definitions — edit `indices` to control which photos each pack unlocks
const packDefinitions: { id: string; token: string; indices: number[] }[] = [
  { id: 'pack-1',  token: 'a2kp7nmx', indices: [ 1, 18, 37] },
  { id: 'pack-2',  token: 'b8vr3qhc', indices: [ 2, 20, 41] },
  { id: 'pack-3',  token: 'c5tz9wjd', indices: [ 3, 23, 44] },
  { id: 'pack-4',  token: 'd7mx4bkr', indices: [ 4, 11, 34] },
  { id: 'pack-5',  token: 'e3nf8ypq', indices: [ 5, 15, 46] },
  { id: 'pack-6',  token: 'f9cs2vwt', indices: [ 6, 27, 38] },
  { id: 'pack-7',  token: 'g4hb7znk', indices: [ 7, 29, 42] },
  { id: 'pack-8',  token: 'h6qr5mcj', indices: [ 8, 32, 47] },
  { id: 'pack-9',  token: 'i2wp9tfx', indices: [ 9, 12, 24] },
  { id: 'pack-10', token: 'j8nd3kcv', indices: [10, 21, 35] },
  { id: 'pack-11', token: 'k5fv6rxb', indices: [13, 30, 45] },
  { id: 'pack-12', token: 'l7th2qnm', indices: [14, 19, 39] },
  { id: 'pack-13', token: 'm4jx8bpw', indices: [16, 28, 43] },
  { id: 'pack-14', token: 'n9kc3fzr', indices: [17, 33, 48] },
  { id: 'pack-15', token: 'o6mb5ytj', indices: [22, 36, 40] },
  { id: 'pack-16', token: 'p3qn7hxc', indices: [25, 31] },
  { id: 'pack-17', token: 'q8rz4vdk', indices: [26, 49] },
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
      { id: '2009-1', caption: 'O dia em que tudo mudou ♡', rotation: -3, size: 'normal' },
      { id: '2009-2', caption: 'Nossa primeira aventura', rotation: 2.5, size: 'normal' },
      { id: '2009-3', caption: 'Já inseparáveis', rotation: -1.5, size: 'normal' },
    ],
  },
  {
    year: 2010,
    token: 'v4nq8bzt',
    title: 'Descobrindo um ao outro',
    bgTone: 'blush',
    decoration: 'none',
    photos: [
      { id: '2010-1', caption: 'Aprendendo a nos amar', rotation: -2, size: 'normal' },
      { id: '2010-2', caption: 'Perfeitamente imperfeitos', rotation: 3, size: 'normal' },
    ],
  },
  {
    year: 2011,
    token: 'h3wf6ycd',
    title: 'Mil memórias',
    bgTone: 'cream',
    decoration: 'stars',
    photos: [
      { id: '2011-1', caption: 'Criando recordações', rotation: -1, size: 'normal' },
      { id: '2011-2', caption: 'O nosso mundinho', rotation: 3.5, size: 'normal' },
      { id: '2011-3', caption: 'Rindo até doer', rotation: -2.5, size: 'normal' },
    ],
  },
  {
    year: 2012,
    token: 'j9xs2mpl',
    title: 'Nosso lar',
    bgTone: 'blush',
    decoration: 'hearts',
    photos: [
      { id: '2012-1', caption: 'Lar é onde você está', rotation: 2, size: 'normal' },
      { id: '2012-2', caption: 'Nós dois contra o mundo', rotation: -3, size: 'normal' },
    ],
  },
  {
    year: 2013,
    token: 'r5bt7nqk',
    title: 'Um ano inesquecível',
    bgTone: 'cream',
    decoration: 'flowers',
    photos: [
      { id: '2013-1', caption: 'Tantas primeiras vezes', rotation: -2, size: 'normal' },
      { id: '2013-2', caption: 'Minha melhor companhia de viagem', rotation: 3, size: 'normal' },
      { id: '2013-3', caption: 'Manhãs de domingo', rotation: -1, size: 'normal' },
      { id: '2013-4', caption: 'Nunca um momento entediante', rotation: 2.5, size: 'normal' },
    ],
  },
  {
    year: 2014,
    token: 'g8vz4wcf',
    title: 'Crescendo juntos',
    bgTone: 'blush',
    decoration: 'none',
    photos: [
      { id: '2014-1', caption: 'Evoluindo lado a lado', rotation: -3, size: 'normal' },
      { id: '2014-2', caption: 'Para onde vamos agora?', rotation: 1.5, size: 'normal' },
      { id: '2014-3', caption: 'Felizes no nosso caos', rotation: -2, size: 'normal' },
    ],
  },
  {
    year: 2015,
    token: 'd2hn9kxr',
    title: 'Simplicidade',
    bgTone: 'cream',
    decoration: 'stars',
    photos: [
      { id: '2015-1', caption: 'Simples e lindo assim', rotation: 2, size: 'normal' },
      { id: '2015-2', caption: 'Só preciso de você', rotation: -3.5, size: 'normal' },
    ],
  },
  {
    year: 2016,
    token: 'p6mf3ybz',
    title: 'Sempre do lado',
    bgTone: 'blush',
    decoration: 'hearts',
    photos: [
      { id: '2016-1', caption: 'Ombro a ombro', rotation: -1.5, size: 'normal' },
      { id: '2016-2', caption: 'Melhor juntos', rotation: 3, size: 'normal' },
      { id: '2016-3', caption: 'Nossa diversão', rotation: -2.5, size: 'normal' },
    ],
  },
  {
    year: 2017,
    token: 'w4cs8tqn',
    title: 'Cada vez melhor',
    bgTone: 'cream',
    decoration: 'flowers',
    photos: [
      { id: '2017-1', caption: 'Não consigo imaginar diferente', rotation: -2, size: 'normal' },
      { id: '2017-2', caption: 'Meu humano favorito', rotation: 3.5, size: 'normal' },
      { id: '2017-3', caption: 'As coisas boas da vida', rotation: -1, size: 'normal' },
      { id: '2017-4', caption: 'E eu escolheria de novo', rotation: 2, size: 'normal' },
    ],
  },
  {
    year: 2018,
    token: 'k7rx2hjv',
    title: 'Só nós dois',
    bgTone: 'blush',
    decoration: 'none',
    photos: [
      { id: '2018-1', caption: 'Nós dois e o mundo', rotation: -3, size: 'normal' },
      { id: '2018-2', caption: 'Exatamente onde quero estar', rotation: 2.5, size: 'normal' },
    ],
  },
  {
    year: 2019,
    token: 'f9qb5znm',
    title: 'Dias dourados',
    bgTone: 'cream',
    decoration: 'stars',
    photos: [
      { id: '2019-1', caption: 'Uma última aventura', rotation: 1.5, size: 'normal' },
      { id: '2019-2', caption: 'Dias que guardarei para sempre', rotation: -2.5, size: 'normal' },
      { id: '2019-3', caption: 'Momentos dourados', rotation: 3, size: 'normal' },
    ],
  },
  {
    year: 2020,
    token: 't3wy6pkd',
    title: 'Juntos por tudo',
    bgTone: 'blush',
    decoration: 'hearts',
    photos: [
      { id: '2020-1', caption: 'Juntos por tudo', rotation: -2, size: 'normal' },
      { id: '2020-2', caption: 'Encontrando alegria em casa', rotation: 3, size: 'normal' },
    ],
  },
  {
    year: 2021,
    token: 'x8nv4bcr',
    title: 'Recomeçando',
    bgTone: 'cream',
    decoration: 'flowers',
    photos: [
      { id: '2021-1', caption: 'Um novo começo', rotation: -3, size: 'normal' },
      { id: '2021-2', caption: 'Escolhendo você, sempre', rotation: 2, size: 'normal' },
      { id: '2021-3', caption: 'De volta ao que importa', rotation: -1.5, size: 'normal' },
    ],
  },
  {
    year: 2022,
    token: 'q2km9fzt',
    title: 'Novos capítulos',
    bgTone: 'blush',
    decoration: 'stars',
    photos: [
      { id: '2022-1', caption: 'Novos começos', rotation: -2, size: 'normal' },
      { id: '2022-2', caption: 'Ainda meu sorriso favorito', rotation: 3.5, size: 'normal' },
      { id: '2022-3', caption: 'Muito mais por vir', rotation: -1, size: 'normal' },
      { id: '2022-4', caption: 'Construindo algo bonito', rotation: 2.5, size: 'normal' },
    ],
  },
  {
    year: 2023,
    token: 'b6ph3wxs',
    title: 'Mais fortes',
    bgTone: 'cream',
    decoration: 'hearts',
    photos: [
      { id: '2023-1', caption: 'Mais fortes a cada ano', rotation: 2, size: 'normal' },
      { id: '2023-2', caption: 'O melhor ainda está por vir', rotation: -3, size: 'normal' },
      { id: '2023-3', caption: 'Ainda rindo', rotation: 1.5, size: 'normal' },
    ],
  },
  {
    year: 2024,
    token: 'c5fj7qnr',
    title: 'Mais uma volta ao sol',
    bgTone: 'blush',
    decoration: 'none',
    photos: [
      { id: '2024-1', caption: 'Mais uma volta ao sol', rotation: -2.5, size: 'normal' },
      { id: '2024-2', caption: 'Você faz tudo melhor', rotation: 3, size: 'normal' },
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
      { id: '2025-1', caption: '17 anos ♡', rotation: -2, size: 'normal' },
      { id: '2025-2', caption: 'E eu escolheria de novo', rotation: 3, size: 'normal' },
      { id: '2025-3', caption: 'Nossa história continua', rotation: -1.5, size: 'normal' },
      { id: '2025-4', caption: 'Para sempre seus', rotation: 2.5, size: 'normal' },
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

export const packs: Pack[] = packDefinitions.map(def => ({
  id: def.id,
  token: def.token,
  photos: def.indices.map(i => allPhotos[i - 1]!),
}))

// Maps opaque token → pack (pack mode)
export const tokenToPack: Record<string, Pack> = {}
packs.forEach(p => { tokenToPack[p.token] = p })
