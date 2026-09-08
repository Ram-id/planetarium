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

export interface ConstellationStar {
  name: string;
  pos: [number, number, number];
  color: string;
  size: number;
  isAlpha?: boolean;
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
  starDetails: ConstellationStar[];
  lines: [number, number][];
  boundaryFaces?: [number, number, number][];
  themeColor: string;
}

export const CONSTELLATIONS: Constellation[] = [
  {
    id: "Ori",
    name: "Orion",
    english: "The Hunter",
    indonesian: "Rasi Waluku (Sang Pemburu)",
    meaning: "Rasi paling gagah di langit malam dengan sabuk tiga bintang (Alnitak, Alnilam, Mintaka) dan bintang raksasa Betelgeuse & Rigel.",
    lore: "Dalam tradisi Jawa kuno, kemunculan Lintang Waluku di ufuk timur menjadi penanda dimulainya musim membajak sawah.",
    center: [0, 20, -320],
    themeColor: "#38bdf8",
    stars: [
      [-45, 120, -320],  // 0 Betelgeuse (Red Supergiant)
      [48, -110, -320],  // 1 Rigel (Blue Supergiant)
      [38, 115, -320],   // 2 Bellatrix (Blue Giant)
      [-40, -100, -320], // 3 Saiph (Blue Supergiant)
      [-12, 10, -325],   // 4 Alnitak
      [0, 15, -325],     // 5 Alnilam
      [14, 20, -325],    // 6 Mintaka
      [0, 150, -315],    // 7 Meissa (Head)
    ],
    starDetails: [
      { name: "Betelgeuse", pos: [-45, 120, -320], color: "#ff6b4a", size: 1.6, isAlpha: true },
      { name: "Rigel", pos: [48, -110, -320], color: "#a5f3fc", size: 1.6, isAlpha: true },
      { name: "Bellatrix", pos: [38, 115, -320], color: "#bae6fd", size: 1.2 },
      { name: "Saiph", pos: [-40, -100, -320], color: "#7dd3fc", size: 1.1 },
      { name: "Alnitak", pos: [-12, 10, -325], color: "#e0f2fe", size: 1.2 },
      { name: "Alnilam", pos: [0, 15, -325], color: "#e0f2fe", size: 1.2 },
      { name: "Mintaka", pos: [14, 20, -325], color: "#e0f2fe", size: 1.2 },
      { name: "Meissa", pos: [0, 150, -315], color: "#fef08a", size: 1.0 },
    ],
    lines: [
      [7, 0], [7, 2], [0, 4], [2, 6], [4, 5], [5, 6], [4, 3], [6, 1], [3, 1], [0, 2]
    ],
    boundaryFaces: [
      [7, 0, 2],
      [0, 4, 2],
      [2, 4, 6],
      [4, 5, 3],
      [5, 6, 1],
      [3, 5, 1]
    ]
  },
  {
    id: "UMa",
    name: "Ursa Major",
    english: "Great Bear",
    indonesian: "Bintang Biduk (Beruang Besar)",
    meaning: "Rasi utara utama yang memuat formasi 7 bintang Biduk. Dua bintang terdepannya (Dubhe & Merak) selalu menunjuk lurus ke arah Bintang Kutub Utara.",
    lore: "Pemandu arah utara para pelaut nusantara sejak berabad-abad silam di samudra lepas.",
    center: [-100, 260, 100],
    themeColor: "#facc15",
    stars: [
      [-180, 240, 120],  // 0 Dubhe
      [-150, 230, 150],  // 1 Merak
      [-110, 250, 140],  // 2 Phecda
      [-120, 270, 110],  // 3 Megrez
      [-70, 290, 80],    // 4 Alioth
      [-30, 300, 50],    // 5 Mizar
      [10, 310, 10],     // 6 Alkaid
    ],
    starDetails: [
      { name: "Dubhe", pos: [-180, 240, 120], color: "#fde047", size: 1.5, isAlpha: true },
      { name: "Merak", pos: [-150, 230, 150], color: "#e0f2fe", size: 1.3 },
      { name: "Phecda", pos: [-110, 250, 140], color: "#e0f2fe", size: 1.2 },
      { name: "Megrez", pos: [-120, 270, 110], color: "#bae6fd", size: 1.1 },
      { name: "Alioth", pos: [-70, 290, 80], color: "#a5f3fc", size: 1.4 },
      { name: "Mizar", pos: [-30, 300, 50], color: "#e0f2fe", size: 1.3 },
      { name: "Alkaid", pos: [10, 310, 10], color: "#7dd3fc", size: 1.4 },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]
    ],
    boundaryFaces: [
      [0, 1, 2],
      [0, 2, 3]
    ]
  },
  {
    id: "Cru",
    name: "Crux",
    english: "Southern Cross",
    indonesian: "Bintang Pari (Salib Selatan)",
    meaning: "Rasi terkecil namun paling terang penunjuk arah kutub selatan sejati di belahan bumi selatan nusantara.",
    lore: "Bintang Pari adalah kompas alami langit nusantara yang meneduhkan hati pelayar malam.",
    center: [130, -280, 50],
    themeColor: "#60a5fa",
    stars: [
      [120, -290, 40],   // 0 Acrux
      [140, -250, 60],   // 1 Gacrux (Red Giant)
      [100, -270, 70],   // 2 Mimosa
      [150, -275, 30],   // 3 Imai
      [135, -280, 52],   // 4 Ginan (faint center)
    ],
    starDetails: [
      { name: "Acrux", pos: [120, -290, 40], color: "#93c5fd", size: 1.6, isAlpha: true },
      { name: "Gacrux", pos: [140, -250, 60], color: "#f87171", size: 1.4 },
      { name: "Mimosa", pos: [100, -270, 70], color: "#67e8f9", size: 1.4 },
      { name: "Imai", pos: [150, -275, 30], color: "#a5f3fc", size: 1.2 },
      { name: "Ginan", pos: [135, -280, 52], color: "#fed7aa", size: 0.9 },
    ],
    lines: [
      [0, 1], [2, 3], [0, 2], [1, 3], [1, 2], [0, 3]
    ],
    boundaryFaces: [
      [0, 2, 1],
      [0, 3, 1]
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
    themeColor: "#f472b6",
    stars: [
      [220, 220, -60],  // 0 Caph
      [200, 235, -90],  // 1 Schedar
      [160, 250, -120], // 2 Gamma Cas (Navi)
      [130, 260, -90],  // 3 Ruchbah
      [90, 280, -110],  // 4 Segin
    ],
    starDetails: [
      { name: "Caph", pos: [220, 220, -60], color: "#fed7aa", size: 1.3 },
      { name: "Schedar", pos: [200, 235, -90], color: "#fb923c", size: 1.5, isAlpha: true },
      { name: "Navi", pos: [160, 250, -120], color: "#a5f3fc", size: 1.4 },
      { name: "Ruchbah", pos: [130, 260, -90], color: "#e0f2fe", size: 1.2 },
      { name: "Segin", pos: [90, 280, -110], color: "#7dd3fc", size: 1.1 },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4]
    ]
  },
  {
    id: "Sco",
    name: "Scorpius",
    english: "The Scorpion",
    indonesian: "Rasi Kalajengking (Jantung Antares)",
    meaning: "Rasi megah berwujud kalajengking dengan bintang maharaksasa merah Antares di bagian jantungnya.",
    lore: "Antares yang merah membara adalah salah satu bintang terbesar di galaksi kita.",
    center: [-210, -180, -100],
    themeColor: "#ef4444",
    stars: [
      [-260, -120, -110], // 0 Graffias
      [-270, -140, -90],  // 1 Dschubba
      [-250, -160, -80],  // 2 Pi Sco
      [-240, -170, -120], // 3 Antares (Red Supergiant)
      [-220, -200, -130], // 4 Wei
      [-190, -220, -120], // 5 Larawag
      [-160, -230, -90],  // 6 Sargas
      [-140, -220, -60],  // 7 Shaula
    ],
    starDetails: [
      { name: "Graffias", pos: [-260, -120, -110], color: "#7dd3fc", size: 1.2 },
      { name: "Dschubba", pos: [-270, -140, -90], color: "#a5f3fc", size: 1.3 },
      { name: "Pi Sco", pos: [-250, -160, -80], color: "#e0f2fe", size: 1.1 },
      { name: "Antares", pos: [-240, -170, -120], color: "#ff4d4d", size: 1.8, isAlpha: true },
      { name: "Wei", pos: [-220, -200, -130], color: "#fed7aa", size: 1.2 },
      { name: "Larawag", pos: [-190, -220, -120], color: "#fed7aa", size: 1.2 },
      { name: "Sargas", pos: [-160, -230, -90], color: "#fde047", size: 1.3 },
      { name: "Shaula", pos: [-140, -220, -60], color: "#67e8f9", size: 1.4 },
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7]
    ],
    boundaryFaces: [
      [0, 1, 3],
      [1, 2, 3]
    ]
  },
  {
    id: "Cyg",
    name: "Cygnus",
    english: "The Swan",
    indonesian: "Rasi Angsa (Salib Bimasakti)",
    meaning: "Rasi angsa yang terbang melintasi aliran Bimasakti dengan bintang super raksasa Deneb.",
    lore: "Deneb bersama Vega dan Altair membentuk asterisma Segitiga Musim Panas yang tersohor.",
    center: [90, 180, 260],
    themeColor: "#38bdf8",
    stars: [
      [90, 210, 240],   // 0 Deneb
      [90, 170, 260],   // 1 Sadr
      [90, 130, 280],   // 2 Albireo (Double Star)
      [40, 180, 260],   // 3 Gienah
      [140, 160, 260],  // 4 Fawaris
    ],
    starDetails: [
      { name: "Deneb", pos: [90, 210, 240], color: "#e0f2fe", size: 1.7, isAlpha: true },
      { name: "Sadr", pos: [90, 170, 260], color: "#fef08a", size: 1.4 },
      { name: "Albireo", pos: [90, 130, 280], color: "#38bdf8", size: 1.3 },
      { name: "Gienah", pos: [40, 180, 260], color: "#fed7aa", size: 1.2 },
      { name: "Fawaris", pos: [140, 160, 260], color: "#a5f3fc", size: 1.2 },
    ],
    lines: [
      [0, 1], [1, 2], [3, 1], [1, 4]
    ],
    boundaryFaces: [
      [0, 3, 1],
      [0, 1, 4],
      [3, 2, 1],
      [4, 1, 2]
    ]
  },
  {
    id: "Tau",
    name: "Taurus",
    english: "The Bull",
    indonesian: "Rasi Banteng (Mata Aldebaran)",
    meaning: "Rasi zodiak agung bertanduk emas yang menaungi bintang merah raksasa Aldebaran dan gugus permata Pleiades (Tujuh Dara).",
    lore: "Mata merah banteng kosmik yang menatap abadi ke arah rasi pemburu Orion.",
    center: [-90, 120, -260],
    themeColor: "#f97316",
    stars: [
      [-95, 110, -260],  // 0 Aldebaran (Orange Giant)
      [-70, 140, -250],  // 1 Elnath (Tip horn 1)
      [-120, 130, -250], // 2 Tianguan (Tip horn 2)
      [-90, 120, -270],  // 3 Ain (Hyades)
      [-105, 105, -265], // 4 Gamma Tau
    ],
    starDetails: [
      { name: "Aldebaran", pos: [-95, 110, -260], color: "#fb923c", size: 1.7, isAlpha: true },
      { name: "Elnath", pos: [-70, 140, -250], color: "#bae6fd", size: 1.3 },
      { name: "Tianguan", pos: [-120, 130, -250], color: "#7dd3fc", size: 1.2 },
      { name: "Ain", pos: [-90, 120, -270], color: "#fde047", size: 1.1 },
      { name: "Hyades", pos: [-105, 105, -265], color: "#fed7aa", size: 1.0 },
    ],
    lines: [
      [0, 3], [3, 4], [4, 0], [0, 1], [3, 2]
    ],
    boundaryFaces: [
      [0, 3, 4]
    ]
  },
  {
    id: "CMa",
    name: "Canis Major",
    english: "Great Dog",
    indonesian: "Anjing Besar (Bintang Sirius)",
    meaning: "Rasi penjelajah setia yang memuat Sirius, bintang paling berkilau dan paling terang di seluruh langit malam bumi.",
    lore: "Sirius memancarkan cahaya berlian yang berkedip warna-warni mempesona saat melintasi atmosfer.",
    center: [-70, -110, -280],
    themeColor: "#c084fc",
    stars: [
      [-70, -90, -280],   // 0 Sirius (Brightest star)
      [-60, -120, -285],  // 1 Murzim
      [-80, -140, -275],  // 2 Wezen
      [-90, -160, -270],  // 3 Adhara
      [-65, -150, -280],  // 4 Aludra
    ],
    starDetails: [
      { name: "Sirius", pos: [-70, -90, -280], color: "#ffffff", size: 2.2, isAlpha: true },
      { name: "Murzim", pos: [-60, -120, -285], color: "#93c5fd", size: 1.2 },
      { name: "Wezen", pos: [-80, -140, -275], color: "#fed7aa", size: 1.3 },
      { name: "Adhara", pos: [-90, -160, -270], color: "#7dd3fc", size: 1.4 },
      { name: "Aludra", pos: [-65, -150, -280], color: "#67e8f9", size: 1.2 },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [2, 4], [0, 2]
    ],
    boundaryFaces: [
      [0, 1, 2],
      [2, 3, 4]
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
