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
// To add/change pack contents, edit the `packs` array below.
// Each photo ID must appear in exactly one pack.
export interface PackPhoto {
  year: number
  photoId: string
}

export interface Pack {
  id: string
  token: string   // opaque unlock token used in QR codes
  photos: PackPhoto[]
}

export const packs: Pack[] = [
  { id: 'pack-1',  token: 'a2kp7nmx', photos: [{ year: 2009, photoId: '2009-1' }, { year: 2015, photoId: '2015-1' }, { year: 2022, photoId: '2022-1' }] },
  { id: 'pack-2',  token: 'b8vr3qhc', photos: [{ year: 2009, photoId: '2009-2' }, { year: 2016, photoId: '2016-1' }, { year: 2023, photoId: '2023-1' }] },
  { id: 'pack-3',  token: 'c5tz9wjd', photos: [{ year: 2009, photoId: '2009-3' }, { year: 2017, photoId: '2017-1' }, { year: 2024, photoId: '2024-1' }] },
  { id: 'pack-4',  token: 'd7mx4bkr', photos: [{ year: 2010, photoId: '2010-1' }, { year: 2013, photoId: '2013-1' }, { year: 2021, photoId: '2021-1' }] },
  { id: 'pack-5',  token: 'e3nf8ypq', photos: [{ year: 2010, photoId: '2010-2' }, { year: 2014, photoId: '2014-1' }, { year: 2025, photoId: '2025-1' }] },
  { id: 'pack-6',  token: 'f9cs2vwt', photos: [{ year: 2011, photoId: '2011-1' }, { year: 2018, photoId: '2018-1' }, { year: 2022, photoId: '2022-2' }] },
  { id: 'pack-7',  token: 'g4hb7znk', photos: [{ year: 2011, photoId: '2011-2' }, { year: 2019, photoId: '2019-1' }, { year: 2023, photoId: '2023-2' }] },
  { id: 'pack-8',  token: 'h6qr5mcj', photos: [{ year: 2011, photoId: '2011-3' }, { year: 2020, photoId: '2020-1' }, { year: 2025, photoId: '2025-2' }] },
  { id: 'pack-9',  token: 'i2wp9tfx', photos: [{ year: 2012, photoId: '2012-1' }, { year: 2013, photoId: '2013-2' }, { year: 2017, photoId: '2017-2' }] },
  { id: 'pack-10', token: 'j8nd3kcv', photos: [{ year: 2012, photoId: '2012-2' }, { year: 2016, photoId: '2016-2' }, { year: 2021, photoId: '2021-2' }] },
  { id: 'pack-11', token: 'k5fv6rxb', photos: [{ year: 2013, photoId: '2013-3' }, { year: 2019, photoId: '2019-2' }, { year: 2024, photoId: '2024-2' }] },
  { id: 'pack-12', token: 'l7th2qnm', photos: [{ year: 2013, photoId: '2013-4' }, { year: 2015, photoId: '2015-2' }, { year: 2022, photoId: '2022-3' }] },
  { id: 'pack-13', token: 'm4jx8bpw', photos: [{ year: 2014, photoId: '2014-2' }, { year: 2018, photoId: '2018-2' }, { year: 2023, photoId: '2023-3' }] },
  { id: 'pack-14', token: 'n9kc3fzr', photos: [{ year: 2014, photoId: '2014-3' }, { year: 2020, photoId: '2020-2' }, { year: 2025, photoId: '2025-3' }] },
  { id: 'pack-15', token: 'o6mb5ytj', photos: [{ year: 2016, photoId: '2016-3' }, { year: 2021, photoId: '2021-3' }, { year: 2022, photoId: '2022-4' }] },
  { id: 'pack-16', token: 'p3qn7hxc', photos: [{ year: 2017, photoId: '2017-3' }, { year: 2019, photoId: '2019-3' }] },
  { id: 'pack-17', token: 'q8rz4vdk', photos: [{ year: 2017, photoId: '2017-4' }, { year: 2025, photoId: '2025-4' }] },
]

// Maps opaque token → pack (pack mode)
export const tokenToPack: Record<string, Pack> = {}
packs.forEach(p => { tokenToPack[p.token] = p })

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
