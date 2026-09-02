export interface CelestialObject {
  id: string;
  name: string;
  type: string;
  mag: string;
  raDec: string;
  distance: string;
  desc: string;
  pos: [number, number, number];
  color: number;
}

export interface Constellation {
  id: string;
  name: string;
  english: string;
  indonesian: string;
  meaning: string;
  lore: string;
  center: [number, number, number];
  stars: [number, number, number][];
  lines: [number, number][];
}

export const CONSTELLATIONS: Constellation[] = [
  {
    id: "Ori",
    name: "Orion",
    english: "The Hunter",
    indonesian: "Rasi Waluku (Pemburu)",
    meaning: "Rasi paling gagah di langit malam dengan sabuk tiga bintang (Alnitak, Alnilam, Mintaka) dan bintang raksasa Betelgeuse & Rigel.",
    lore: "Dalam tradisi Jawa kuno, kemunculan Lintang Waluku di ufuk timur menjadi penanda dimulainya musim membajak sawah.",
    center: [0, 20, -320],
    stars: [
      [-45, 120, -320],  // 0 Betelgeuse
      [48, -110, -320],  // 1 Rigel
      [38, 115, -320],   // 2 Bellatrix
      [-40, -100, -320], // 3 Saiph
      [-12, 10, -325],   // 4 Alnitak
      [0, 15, -325],     // 5 Alnilam
      [14, 20, -325],    // 6 Mintaka
      [0, 150, -315],    // 7 Meissa
    ],
    lines: [
      [7, 0], [7, 2], [0, 4], [2, 6], [4, 5], [5, 6], [4, 3], [6, 1], [3, 1]
    ]
  },
  {
    id: "UMa",
    name: "Ursa Major",
    english: "Great Bear",
    indonesian: "Bintang Biduk (Beruang Besar)",
    meaning: "Rasi utara utama yang memuat formasi 7 bintang Biduk. Dua bintang terdepannya selalu menunjuk lurus ke arah Kutub Utara.",
    lore: "Pemandu arah utara para pelaut nusantara sejak berabad-abad silam di samudra lepas.",
    center: [-100, 260, 100],
    stars: [
      [-180, 240, 120],  // 0 Dubhe
      [-150, 230, 150],  // 1 Merak
      [-110, 250, 140],  // 2 Phecda
      [-120, 270, 110],  // 3 Megrez
      [-70, 290, 80],    // 4 Alioth
      [-30, 300, 50],    // 5 Mizar
      [10, 310, 10],     // 6 Alkaid
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]
    ]
  },
  {
    id: "Cru",
    name: "Crux",
    english: "Southern Cross",
    indonesian: "Bintang Pari (Salib Selatan)",
    meaning: "Rasi terkecil namun paling terang penunjuk arah kutub selatan sejati di belahan bumi selatan.",
    lore: "Bintang Pari adalah kompas alami langit nusantara yang meneduhkan hati pelayar malam.",
    center: [130, -280, 50],
    stars: [
      [120, -290, 40],   // 0 Acrux
      [140, -250, 60],   // 1 Gacrux
      [100, -270, 70],   // 2 Mimosa
      [150, -275, 30],   // 3 Imai
    ],
    lines: [
      [0, 1], [2, 3]
    ]
  },
  {
    id: "Cas",
    name: "Cassiopeia",
    english: "The Queen",
    indonesian: "Ratu Cassiopeia (Bentuk W)",
    meaning: "Rasi anggun berbentuk huruf 'W' emas yang melingkari poros langit utara sepanjang malam.",
    lore: "Mahkota ratu kosmik yang tak pernah tenggelam di bawah cakrawala utara.",
    center: [160, 250, -100],
    stars: [
      [220, 220, -60],  // 0 Caph
      [200, 235, -90],  // 1 Schedar
      [160, 250, -120], // 2 Navi
      [130, 260, -90],  // 3 Ruchbah
      [90, 280, -110],  // 4 Segin
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4]
    ]
  },
  {
    id: "Sco",
    name: "Scorpius",
    english: "The Scorpion",
    indonesian: "Rasi Kalajengking (Antares)",
    meaning: "Rasi megah berwujud kalajengking dengan bintang maharaksasa merah Antares di bagian jantungnya.",
    lore: "Antares yang merah membara adalah salah satu bintang terbesar di galaksi kita.",
    center: [-210, -180, -100],
    stars: [
      [-260, -120, -110], // 0 Graffias
      [-270, -140, -90],  // 1 Dschubba
      [-250, -160, -80],  // 2 Pi Sco
      [-240, -170, -120], // 3 Antares
      [-220, -200, -130], // 4 Wei
      [-190, -220, -120], // 5 Larawag
      [-160, -230, -90],  // 6 Sargas
      [-140, -220, -60],  // 7 Shaula
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7]
    ]
  },
  {
    id: "Cyg",
    name: "Cygnus",
    english: "The Swan",
    indonesian: "Rasi Angsa (Salib Utara)",
    meaning: "Rasi angsa yang terbang melintasi aliran Bimasakti dengan bintang super raksasa Deneb.",
    lore: "Deneb bersama Vega dan Altair membentuk asterisma Segitiga Musim Panas yang tersohor.",
    center: [90, 180, 260],
    stars: [
      [90, 210, 240],   // 0 Deneb
      [90, 170, 260],   // 1 Sadr
      [90, 130, 280],   // 2 Albireo
      [40, 180, 260],   // 3 Gienah
      [140, 160, 260],  // 4 Fawaris
    ],
    lines: [
      [0, 1], [1, 2], [3, 1], [1, 4]
    ]
  }
];

export const DEEP_SKY_OBJECTS: CelestialObject[] = [
  {
    id: "M31",
    name: "Galaksi Andromeda (M31)",
    type: "Galaksi Spiral Raksasa",
    mag: "+3.44",
    raDec: "00h 42m 44s / +41° 16′ 09″",
    distance: "2,537 Juta Tahun Cahaya",
    desc: "Galaksi tetangga terbesar yang menampung 1 triliun bintang. Objek kosmik terjauh yang dapat dilihat mata telanjang di langit malam yang gelap.",
    pos: [190, 220, -170],
    color: 0x93c5fd,
  },
  {
    id: "M42",
    name: "Nebula Orion (M42)",
    type: "Nebula Emisi Pembibitan Bintang",
    mag: "+4.00",
    raDec: "05h 35m 17s / -05° 23′ 28″",
    distance: "1.344 Tahun Cahaya",
    desc: "Kawah kelahiran bintang paling aktif di Bimasakti dengan pendaran gas hidrogen dan gugus bintang muda Trapezium di dalamnya.",
    pos: [0, 8, -324],
    color: 0xf472b6,
  },
  {
    id: "M45",
    name: "Gugus Bintang Pleiades (M45)",
    type: "Gugus Terbuka Tujuh Bintang",
    mag: "+1.60",
    raDec: "03h 47m 24s / +24° 07′ 00″",
    distance: "444 Tahun Cahaya",
    desc: "Gugus bintang biru permata yang diselimuti kabut refleksi awan gas bercahaya dingin di rasi Taurus.",
    pos: [-90, 150, -270],
    color: 0x67e8f9,
  },
  {
    id: "MW_CENTER",
    name: "Pusat Galaksi Bimasakti (Sagittarius A*)",
    type: "Lubang Hitam Supermasif",
    mag: "--",
    raDec: "17h 45m 40s / -29° 00′ 28″",
    distance: "26.670 Tahun Cahaya",
    desc: "Pusat gravitasi dari seluruh galaksi Bimasakti yang berputar dengan massa setara 4,1 juta kali massa Matahari.",
    pos: [-240, -160, -150],
    color: 0xfbbf24,
  }
];
