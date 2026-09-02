export interface Constellation {
  id: string;
  name: string;
  english: string;
  indonesian: string;
  meaning: string;
  lore: string;
  stars: [number, number, number][]; // 3D coordinates on celestial sphere
  lines: [number, number][]; // pairs of indices in stars array
}

export interface DeepSkyObject {
  id: string;
  name: string;
  type: string;
  distance: string;
  pos: [number, number, number];
  description: string;
  color: number;
}

// Top iconic constellations from Stellarium with precise 3D celestial sphere positions (radius ~ 320)
export const CONSTELLATIONS: Constellation[] = [
  {
    id: "Ori",
    name: "Orion",
    english: "The Hunter",
    indonesian: "Rasi Pemburu (Waluku)",
    meaning: "Rasi paling terkenal di langit malam dengan Sabuk Tiga Bintang (Alnitak, Alnilam, Mintaka) dan bintang raksasa merah Betelgeuse serta Rigel.",
    lore: "Dalam tradisi Jawa kuno, rasi Orion disebut 'Lintang Waluku' yang menjadi penanda musim bercocok tanam. Cahayanya yang gagah dan teratur melambangkan keteguhan.",
    stars: [
      [-45, 120, -290],  // 0 Betelgeuse (Alpha Ori)
      [48, -110, -290],  // 1 Rigel (Beta Ori)
      [38, 115, -290],   // 2 Bellatrix (Gamma Ori)
      [-40, -100, -290], // 3 Saiph (Kappa Ori)
      [-12, 10, -295],   // 4 Alnitak (Belt 1)
      [0, 15, -295],     // 5 Alnilam (Belt 2)
      [14, 20, -295],    // 6 Mintaka (Belt 3)
      [0, 150, -285],    // 7 Meissa (Head)
    ],
    lines: [
      [7, 0], [7, 2], [0, 4], [2, 6], [4, 5], [5, 6], [4, 3], [6, 1], [3, 1]
    ]
  },
  {
    id: "UMa",
    name: "Ursa Major",
    english: "The Great Bear",
    indonesian: "Beruang Besar (Bintang Biduk / Gubuk Penceng)",
    meaning: "Rasi utara utama yang memuat asterisma 'Big Dipper'. Dua bintang terdepannya (Dubhe dan Merak) selalu menunjuk lurus ke arah Bintang Kutub Utara (Polaris).",
    lore: "Bintang Biduk adalah pemandu navigasi para pelaut dan musafir sejak ribuan tahun lalu. Di manapun kita berada, ia selalu memberi petunjuk arah utara yang pasti.",
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
    indonesian: "Rasi Salib Selatan (Bintang Pari / Gubug Penceng)",
    meaning: "Rasi bintang terkecil namun paling terang di belahan langit selatan. Digunakan untuk menentukan arah kutub selatan sejati.",
    lore: "Bintang Pari adalah mahkota langit selatan nusantara. Menatap formasi empat bintangnya menghadirkan rasa tenang dan kepastian arah di tengah malam gelap.",
    stars: [
      [120, -290, 40],   // 0 Acrux (Alpha Cru)
      [140, -250, 60],   // 1 Gacrux (Gamma Cru)
      [100, -270, 70],   // 2 Mimosa (Beta Cru)
      [150, -275, 30],   // 3 Imai (Delta Cru)
    ],
    lines: [
      [0, 1], [2, 3]
    ]
  },
  {
    id: "Cas",
    name: "Cassiopeia",
    english: "The Queen",
    indonesian: "Rasi Ratu Cassiopeia (Bentuk W)",
    meaning: "Rasi bintang berjarak dekat dengan kutub utara yang membentuk huruf 'W' atau 'M' anggun di langit malam.",
    lore: "Cassiopeia melingkar abadi mengitari poros langit. Lima bintang utamanya bersinar cemerlang bak mahkota permata yang menghiasi gelapnya galaksi.",
    stars: [
      [220, 220, -60],  // 0 Caph (Beta Cas)
      [200, 235, -90],  // 1 Schedar (Alpha Cas)
      [160, 250, -120], // 2 Gamma Cas (Navi)
      [130, 260, -90],  // 3 Ruchbah (Delta Cas)
      [90, 280, -110],  // 4 Segin (Epsilon Cas)
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4]
    ]
  },
  {
    id: "Sco",
    name: "Scorpius",
    english: "The Scorpion",
    indonesian: "Rasi Kalajengking (Bintang Kelapa / Antares)",
    meaning: "Rasi megah berbentuk lengkungan kalajengking dengan jantung raksasa merah Antares yang menyala terang.",
    lore: "Antares dijuluki sebagai 'Rival of Mars' karena warnanya yang merah membara. Bentuk ekor lengkungnya merupakan salah satu formasi rasi paling anggun di semesta.",
    stars: [
      [-260, -120, -110], // 0 Graffias
      [-270, -140, -90],  // 1 Dschubba
      [-250, -160, -80],  // 2 Pi Sco
      [-240, -170, -120], // 3 Antares (Heart)
      [-220, -200, -130], // 4 Wei
      [-190, -220, -120], // 5 Larawag
      [-160, -230, -90],  // 6 Sargas
      [-140, -220, -60],  // 7 Shaula (Stinger)
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7]
    ]
  }
];

// Deep-Sky Objects from Stellarium's Messier Catalog
export const DEEP_SKY_OBJECTS: DeepSkyObject[] = [
  {
    id: "M31",
    name: "Galaksi Andromeda (M31)",
    type: "Galaksi Spiral Raksasa",
    distance: "2,5 Juta Tahun Cahaya",
    pos: [180, 210, -160],
    description: "Galaksi spiral terdekat dengan Bimasakti yang menampung lebih dari 1 triliun bintang. Objek terjauh yang dapat dilihat mata telanjang manusia.",
    color: 0x93c5fd,
  },
  {
    id: "M42",
    name: "Nebula Orion (M42)",
    type: "Nebula Emisi Pembibitan Bintang",
    distance: "1.344 Tahun Cahaya",
    pos: [2, 10, -288],
    description: "Kawah kelahiran bintang paling aktif di galaksi kita. Gas hidrogen bercahaya ungu-merah muda yang memicu terciptanya tata surya baru.",
    color: 0xf472b6,
  },
  {
    id: "M45",
    name: "Gugus Bintang Pleiades (M45)",
    type: "Gugus Bintang Terbuka (Tujuh Bintang)",
    distance: "444 Tahun Cahaya",
    pos: [-80, 140, -260],
    description: "Gugus bintang biru cemerlang berbalut awan debu refleksi yang berkilau bak permata di rasi Taurus.",
    color: 0x67e8f9,
  }
];
