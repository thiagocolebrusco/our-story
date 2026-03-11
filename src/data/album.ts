export interface Photo {
  id: string
  caption: string
  rotation: number
  size: 'normal' | 'large'
}

export interface YearPage {
  year: number
  title: string
  subtitle?: string
  photos: Photo[]
  bgTone: 'cream' | 'blush'
  decoration?: 'stars' | 'hearts' | 'flowers' | 'none'
}

export const coverData = {
  title: 'Our Story',
  names: 'Thiago & Mayara',
  years: '2009 — 2025',
  tagline: '17 anos de amor ♡',
}

export const pages: YearPage[] = [
  {
    year: 2009,
    title: 'O começo de tudo',
    subtitle: 'Onde nossa história começou',
    bgTone: 'cream',
    decoration: 'hearts',
    photos: [
      { id: '2009-1', caption: 'O dia em que tudo mudou ♡', rotation: -3, size: 'normal' },
      { id: '2009-2', caption: 'Nossa primeira aventura', rotation: 2.5, size: 'normal' },
      { id: '2009-3', caption: 'Já inseparáveis', rotation: -1.5, size: 'normal' },
    ],
  },
  {
    year: 2010,
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
    title: '17 anos de amor',
    subtitle: 'E eu escolheria de novo ♡',
    bgTone: 'cream',
    decoration: 'flowers',
    photos: [
      { id: '2025-1', caption: '17 anos ♡', rotation: -2, size: 'normal' },
      { id: '2025-2', caption: 'E eu escolheria de novo', rotation: 3, size: 'normal' },
      { id: '2025-3', caption: 'Nossa história continua', rotation: -1.5, size: 'normal' },
      { id: '2025-4', caption: 'Para sempre seus', rotation: 2.5, size: 'normal' },
    ],
  },
]
