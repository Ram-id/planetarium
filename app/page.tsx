"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

interface PlanetInfo {
  size: number;
  orbitRadius: number;
  tex: string;
  img?: string;
  color: number;
  emissive?: number;
  moon?: boolean;
  ring?: boolean;
  indexStr: string;
  type: string;
  diameter: string;
  distance: string;
  temp: string;
  orbitDays: number;
  rotationHours: number;
  axialTilt: number;
  inclination: number;
  realAU: string;
  gravityFactor: number;
  heroDesc: string;
  scienceFact: string;
  romanticNote: string;
}

type PlanetName =
  | "Matahari"
  | "Merkurius"
  | "Venus"
  | "Bumi"
  | "Mars"
  | "Yupiter"
  | "Saturnus"
  | "Uranus"
  | "Neptunus";

type LayoutMode = "orbit" | "linear";

const ORDER: PlanetName[] = [
  "Matahari",
  "Merkurius",
  "Venus",
  "Bumi",
  "Mars",
  "Yupiter",
  "Saturnus",
  "Uranus",
  "Neptunus",
];

const LINEAR_COORDS: Record<PlanetName, number> = {
  Matahari: 0,
  Merkurius: 65,
  Venus: 130,
  Bumi: 200,
  Mars: 275,
  Yupiter: 385,
  Saturnus: 520,
  Uranus: 655,
  Neptunus: 790,
};

const PLANET_ICONS: Record<PlanetName, string> = {
  Matahari: "☀️",
  Merkurius: "☿",
  Venus: "♀",
  Bumi: "🌍",
  Mars: "♂",
  Yupiter: "♃",
  Saturnus: "♄",
  Uranus: "♅",
  Neptunus: "♆",
};

const DATA: Record<PlanetName, PlanetInfo> = {
  Matahari: {
    size: 28.0,
    orbitRadius: 0,
    tex: "sun.jpg",
    color: 0xffeedd,
    emissive: 0xffaa22,
    indexStr: "STAR // 00",
    type: "Bintang Induk Tata Surya (Tipe Spektrum G2V)",
    diameter: "1.392.700 km (109.2x Bumi)",
    distance: "Pusat Tata Surya (0.000 AU)",
    temp: "5.500 °C (Permukaan) / 15.000.000 °C (Inti)",
    orbitDays: 230000000 * 365,
    rotationHours: 600,
    axialTilt: 7.25,
    inclination: 0.0,
    realAU: "0.000 AU",
    gravityFactor: 27.9,
    heroDesc:
      "Sumber gravitasi dan cahaya utama yang menghangatkan seluruh orbit kosmik di sekelilingnya.",
    scienceFact:
      "Matahari menyumbang 99,86% massa seluruh tata surya. Reaksi fusi nuklir di intinya mengubah 600 juta ton hidrogen menjadi helium setiap detik, memancarkan foton yang mencapai permukaan Bumi dalam 500 detik (8,3 menit cahaya).",
    romanticNote:
      "Makasih yaa udah selalu jadi alasan mas buat semangat setiap hari. Secapek apa pun kegiatannya, kalau udah dapet kabar atau denger cerita kamu tuh rasanya langsung adem lagi. Jangan lupa jaga kesehatan dan jangan skip makan yaa sayangggku, mas selalu doain yang terbaik buat kamu. ☀️🤍",
  },
  Merkurius: {
    size: 2.8,
    orbitRadius: 58.0,
    tex: "mercury.jpg",
    color: 0x9a938c,
    indexStr: "PLANET // 01",
    type: "Planet Terestrial Terdekat ke Matahari",
    diameter: "4.879 km (0.383x Bumi)",
    distance: "57,9 Juta km (0.387 AU)",
    temp: "-180 °C (Malam) / +430 °C (Siang)",
    orbitDays: 87.97,
    rotationHours: 1407.6,
    axialTilt: 0.034,
    inclination: 7.0,
    realAU: "0.387 AU",
    gravityFactor: 0.38,
    heroDesc:
      "Pelari tercepat di tata surya yang menempuh orbit mengitari Matahari hanya dalam 88 hari.",
    scienceFact:
      "Merkurius memiliki kecepatan orbit rata-rata 47,4 km/detik. Tanpa atmosfer penahan panas yang tebal, gradien suhunya paling ekstrem di tata surya. Resonansi spin-orbit 3:2 membuat 1 hari di Merkurius setara dengan 176 hari Bumi.",
    romanticNote:
      "Kalau harimu lagi kerasa capek atau buru-buru banget, tarik napas dulu yaa sayanggg. Nggak apa-apa pelan-pelan, jangan terlalu keras sama diri sendiri. Apa pun yang lagi kamu usahain, mas selalu bangga sama kamu dan siap dengerin keluh kesahmu kapan aja. 🤍✨",
  },
  Venus: {
    size: 6.6,
    orbitRadius: 92.0,
    tex: "venus.jpg",
    color: 0xd8b98a,
    indexStr: "PLANET // 02",
    type: "Planet Terpanas Berotasi Retrograde",
    diameter: "12.104 km (0.949x Bumi)",
    distance: "108,2 Juta km (0.723 AU)",
    temp: "465 °C (Efek Rumah Kaca Ekstrem)",
    orbitDays: 224.7,
    rotationHours: -5832.5,
    axialTilt: 177.36,
    inclination: 3.39,
    realAU: "0.723 AU",
    gravityFactor: 0.91,
    heroDesc:
      "Permata bercahaya paling terang di langit malam dengan lapisan awan asam sulfat pemantul cahaya.",
    scienceFact:
      "Venus memiliki efek rumah kaca tak terkendali dengan tekanan atmosfer 92 kali lipat Bumi. Venus berotasi secara retrograde (searah jarum jam) sangat lambat, sehingga matahari terbit di barat dan terbenam di timur.",
    romanticNote:
      "Bintang paling terang di langit senja aja masih kalah manis sama senyumanmu, hehe. Mas suka banget sama ketulusan dan cara kamu peduli ke orang-orang sekitar. Tetap jadi dirimu yang manis dan apa adanya yaa cantikkk sayaaanggg. 💖",
  },
  Bumi: {
    size: 7.0,
    orbitRadius: 135.0,
    tex: "earth.jpg",
    img: "earth_spaceedu.png",
    color: 0x3f6fae,
    moon: true,
    indexStr: "PLANET // 03",
    type: "Oasis Biosfer & Rumah Kehidupan",
    diameter: "12.742 km (1.000x Bumi)",
    distance: "149,6 Juta km (1.000 AU)",
    temp: "15 °C (Rata-rata Permukaan)",
    orbitDays: 365.25,
    rotationHours: 24.0,
    axialTilt: 23.44,
    inclination: 0.0,
    realAU: "1.000 AU",
    gravityFactor: 1.0,
    heroDesc:
      "Satu-satunya rumah kehidupan dengan samudra cair stabil, magnetosfer pelindung, dan biosfer kaya oksigen.",
    scienceFact:
      "Kemiringan sumbu rotasi Bumi 23,44° menghasilkan siklus 4 musim teratur. Gravitasi Bulan (berjarak 384.400 km) menstabilkan sumbu rotasi Bumi sehingga iklim tetap bersahabat bagi kehidupan selama miliaran tahun.",
    romanticNote:
      "Dari miliaran orang di bumi, bisa ketemu dan deket sama kamu tuh salah satu hal yang paling mas syukuri sampai sekarang. Makasih yaa udah hadir dan mau nemenin proses mas sejauh ini. Mas sayang banget sama kamu, cintaaakuuu. 🌍🫶",
  },
  Mars: {
    size: 3.8,
    orbitRadius: 185.0,
    tex: "mars.jpg",
    color: 0xb1543a,
    indexStr: "PLANET // 04",
    type: "Planet Merah Gurun Besi Oksida",
    diameter: "6.779 km (0.532x Bumi)",
    distance: "227,9 Juta km (1.524 AU)",
    temp: "-60 °C Rata-rata (-125 °C s/d +20 °C)",
    orbitDays: 686.98,
    rotationHours: 24.62,
    axialTilt: 25.19,
    inclination: 1.85,
    realAU: "1.524 AU",
    gravityFactor: 0.38,
    heroDesc:
      "Dunia merah berpasir kaya besi oksida yang menaungi gunung berapi tertinggi dan ngarai terdalam di tata surya.",
    scienceFact:
      "Mars memiliki Olympus Mons (tinggi 21,9 km, 2,5 kali Everest) dan ngarai Valles Marineris sepanjang 4.000 km. Satu hari di Mars (Sol) berlangsung 24 jam 37 menit, sangat mirip dengan Bumi.",
    romanticNote:
      "Kalau lagi ada hal berat yang bikin kamu kepikiran, inget yaa sayanggg... kamu itu orang yang hebat dan kuat banget. Jangan ngerasa sendirian yaa, mas bakal selalu ada di sampingmu buat semangatin kamu terus. Semangat terus cantikku sayang! 🚀🤍",
  },
  Yupiter: {
    size: 18.5,
    orbitRadius: 360.0,
    tex: "jupiter.jpg",
    color: 0xcaa87a,
    indexStr: "PLANET // 05",
    type: "Raksasa Gas & Perisai Gravitasi Tata Surya",
    diameter: "139.820 km (10.97x Bumi)",
    distance: "778,5 Juta km (5.204 AU)",
    temp: "-110 °C (Puncak Awan)",
    orbitDays: 4332.59,
    rotationHours: 9.93,
    axialTilt: 3.13,
    inclination: 1.3,
    realAU: "5.204 AU",
    gravityFactor: 2.34,
    heroDesc:
      "Raksasa gas bergaris megah dengan badai abadi Great Red Spot dan 95 satelit alami penjaga orbit.",
    scienceFact:
      "Jupiter memiliki massa 318 kali Bumi (2,5 kali massa seluruh planet lain digabungkan). Rotasinya yang secepat 9,9 jam menghasilkan gaya sentrifugal tinggi dan badai Great Red Spot yang telah berkecamuk lebih dari 350 tahun.",
    romanticNote:
      "Mas pengen selalu jadi tempat kamu buat pulang dan cerita apa aja—mau hal remeh, hal seru, sampai rasa capekmu. Kamu nggak perlu sungkan yaa sayang, mas selalu siap jadi pendengar setiamu kapan pun kamu butuh. 🪐🤍",
  },
  Saturnus: {
    size: 15.5,
    orbitRadius: 500.0,
    tex: "saturn.jpg",
    color: 0xd9c39a,
    ring: true,
    indexStr: "PLANET // 06",
    type: "Raksasa Bermahkota Cincin Es Spektakuler",
    diameter: "116.460 km (9.14x Bumi)",
    distance: "1,43 Miliar km (9.582 AU)",
    temp: "-140 °C",
    orbitDays: 10759.22,
    rotationHours: 10.7,
    axialTilt: 26.73,
    inclination: 2.49,
    realAU: "9.582 AU",
    gravityFactor: 1.06,
    heroDesc:
      "Permata tata surya dengan sistem cincin kristal es selebar 282.000 km yang memukau dan anggun.",
    scienceFact:
      "Saturnus adalah satu-satunya planet yang massa jenisnya lebih rendah dari air (0,687 g/cm³). Cincinnya terdiri dari 99% pecahan es murni dengan ketebalan vertikal hanya sekitar 10 meter.",
    romanticNote:
      "Cincin Saturnus boleh jadi yang paling cantik di tata surya, tapi di mata mas, kamu tetep yang paling juara cantiknya. Makasih yaa udah selalu ngasih perhatian manis dan bikin hari-hari mas jadi jauh lebih berwarna. Sayanggg banget sama kamu! ✨🤍",
  },
  Uranus: {
    size: 10.0,
    orbitRadius: 650.0,
    tex: "uranus.jpg",
    color: 0x9fd0d6,
    indexStr: "PLANET // 07",
    type: "Raksasa Es Berotasi Menggelinding Miring",
    diameter: "50.724 km (3.98x Bumi)",
    distance: "2,87 Miliar km (19.201 AU)",
    temp: "-224 °C (Atmosfer Terdingin)",
    orbitDays: 30687.15,
    rotationHours: -17.24,
    axialTilt: 97.77,
    inclination: 0.77,
    realAU: "19.201 AU",
    gravityFactor: 0.92,
    heroDesc:
      "Raksasa es berwarna sian toska yang mengorbit dengan posisi poros rebah miring menggelinding.",
    scienceFact:
      "Dengan kemiringan poros 97,77°, Uranus menggelinding di sepanjang orbitnya, menyebabkan setiap kutub mengalami 42 tahun siang konstan diikuti 42 tahun malam konstan. Metana di atmosfernya menyerap spektrum merah.",
    romanticNote:
      "Mas suka banget sama semua hal tentang kamu—lucunya kamu, cara kamu ngomong, sampai kebiasaan-kebiasaan kecilmu yang ngegemesin. Jangan pernah ragu sama dirimu sendiri yaa sayangggku, kamu itu istimewa banget buat mas. 💙✨",
  },
  Neptunus: {
    size: 9.6,
    orbitRadius: 800.0,
    tex: "neptune.jpg",
    color: 0x3d5ce0,
    indexStr: "PLANET // 08",
    type: "Raksasa Es Biru Samudra & Angin Supersonik",
    diameter: "49.244 km (3.86x Bumi)",
    distance: "4,50 Miliar km (30.047 AU)",
    temp: "-218 °C",
    orbitDays: 60190.03,
    rotationHours: 16.11,
    axialTilt: 28.32,
    inclination: 1.77,
    realAU: "30.047 AU",
    gravityFactor: 1.19,
    heroDesc:
      "Planet terjauh di tepian tata surya dengan warna biru azure pekat dan badai angin supersonik.",
    scienceFact:
      "Neptunus ditemukan melalui prediksi matematika gravitasi sebelum diamati teleskop. Memiliki kecepatan angin tercepat di tata surya mencapai 2.100 km/jam. Memerlukan 164,8 tahun Bumi untuk satu kali revolusi lengkap mengitari Matahari.",
    romanticNote:
      "Walau kadang ada jarak atau waktu yang bikin kita belum bisa ketemu langsung, rasa sayang dan doa mas selalu nyampe buat kamu di sana. Jangan pernah ngerasa kesepian yaa cintaaa, mas selalu bawa nama kamu di setiap doa mas. I love you, cantikku sayaaanggg. 🌌🤍",
  },
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialized = useRef(false);

  const [activePlanetName, setActivePlanetName] = useState<PlanetName>("Bumi");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"science" | "lab" | "love">("science");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("orbit");
  const [userWeight, setUserWeight] = useState<number>(45);
  const [userAge, setUserAge] = useState<number>(20);

  const [showMilkyWay, setShowMilkyWay] = useState<boolean>(true);
  const [showOrbitLabels, setShowOrbitLabels] = useState<boolean>(true);
  const [timeMultiplier, setTimeMultiplier] = useState<number>(1);

  // Background Music state & refs (User Uploaded Soundtrack)
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  // Solar System Scope Orrery Modal state
  const [showOrreryModal, setShowOrreryModal] = useState(false);

  // FEATURE 1: COSMIC SKY LANTERNS (LAMPION HARAPAN KOSMIK) STATE
  interface SkyLantern {
    id: string;
    text: string;
    author: string;
    color: string;
    colorName: string;
    date: string;
    blessing: string;
    likes: number;
    x: number;
    y: number;
    z: number;
    riseSpeed: number;
    wobblePhase: number;
  }

  const [showLanternSanctuary, setShowLanternSanctuary] = useState(false);
  const [sanctuaryView, setSanctuaryView] = useState<"sky" | "archive">("sky");
  const [showLanternModal, setShowLanternModal] = useState(false);
  const [showLanternViewModal, setShowLanternViewModal] = useState(false);
  const [selectedLantern, setSelectedLantern] = useState<SkyLantern | null>(null);
  const [lanternInputText, setLanternInputText] = useState("");
  const [lanternAuthor, setLanternAuthor] = useState("Nana Cantik");
  const [lanternColor, setLanternColor] = useState("#f97316");

  const INITIAL_LANTERNS: SkyLantern[] = [
    {
      id: "lantern-dhani-1",
      text: "Semoga senyuman manis bidadariku selalu bercahaya, dan hatimu selalu dipenuhi rasa tenang & bahagia setiap hari. ✨",
      author: "Mas Dhani 💖",
      color: "#f97316",
      colorName: "Golden Amber",
      date: "8 Maret 2026",
      blessing: "Mas Dhani selalu siap nemenin dan melindungi kamu, di mana pun dan kapan pun.",
      likes: 12,
      x: 120,
      y: 85,
      z: -160,
      riseSpeed: 0.015,
      wobblePhase: 0.4,
    },
    {
      id: "lantern-dhani-2",
      text: "Harapan terbesarku: bisa terus menggenggam tanganmu, melewati jutaan detik dan musim kehidupan berdua. 🪐🤍",
      author: "Mas Dhani 💖",
      color: "#ec4899",
      colorName: "Rose Romance",
      date: "8 Maret 2026",
      blessing: "Rasa sayang Mas ke kamu tak terhingga seluas galaksi semesta raya.",
      likes: 24,
      x: -180,
      y: 110,
      z: 90,
      riseSpeed: 0.018,
      wobblePhase: 1.8,
    },
    {
      id: "lantern-dhani-3",
      text: "Semoga segala impian besar, cita-cita, dan langkah hebatmu dimudahkan dan tercapai dengan begitu indah. 🌟🎓",
      author: "Mas Dhani 💖",
      color: "#38bdf8",
      colorName: "Cosmic Cyan",
      date: "8 Maret 2026",
      blessing: "Mas akan selalu jadi suporter nomor satu untuk semua mimpimu sayang.",
      likes: 18,
      x: 60,
      y: 140,
      z: 180,
      riseSpeed: 0.012,
      wobblePhase: 3.2,
    },
  ];

  const [lanternsList, setLanternsList] = useState<SkyLantern[]>(INITIAL_LANTERNS);
  const lanternsListRef = useRef<SkyLantern[]>(INITIAL_LANTERNS);
  useEffect(() => {
    lanternsListRef.current = lanternsList;
  }, [lanternsList]);

  // Load persisted lanterns and game highscore from localStorage
  useEffect(() => {
    try {
      const savedHigh = localStorage.getItem("cosmonana_rocket_highscore");
      if (savedHigh) setGameHighScore(parseInt(savedHigh, 10) || 0);
      const savedLanterns = localStorage.getItem("cosmonana_lanterns");
      if (savedLanterns) {
        const parsed = JSON.parse(savedLanterns);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLanternsList(parsed);
          lanternsListRef.current = parsed;
        }
      }
    } catch {}
  }, []);

  // Toast Notification state
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showToastRef = useRef<(msg: string) => void>(() => {});
  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMsg(null);
    }, 4500);
  };
  useEffect(() => {
    showToastRef.current = showToast;
  }, []);

  // Feature 2: Polaroid Snapshot state
  const [showPolaroidModal, setShowPolaroidModal] = useState(false);
  const [polaroidImgUrl, setPolaroidImgUrl] = useState<string | null>(null);
  const [polaroidCaption, setPolaroidCaption] = useState("");
  const [polaroidFilter, setPolaroidFilter] = useState<"original" | "vintage" | "cyber" | "golden" | "bw">("original");

  // Feature 3: Love Capsule & Quiz state
  const [showCapsuleModal, setShowCapsuleModal] = useState(false);
  const [capsuleTab, setCapsuleTab] = useState<"letter" | "reasons" | "quiz">("letter");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Feature 4: Retro Cosmic Rocket Mini-Game state
  const [showGameModal, setShowGameModal] = useState(false);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover" | "victory">("menu");
  const [gameScore, setGameScore] = useState(0);
  const [gameHighScore, setGameHighScore] = useState(0);
  const [gameLives, setGameLives] = useState(3);
  const [gameDistance, setGameDistance] = useState("0 AU");
  const arcadeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopIdRef = useRef<number | null>(null);
  const gameMoveLeftRef = useRef(false);
  const gameMoveRightRef = useRef(false);

  const [showDhaniModal, setShowDhaniModal] = useState(false);
  const [dhaniInput, setDhaniInput] = useState("");
  const [dhaniLoading, setDhaniLoading] = useState(false);

  interface ChatMessage {
    id: string;
    sender: "dhani" | "nana";
    text: string;
    time: string;
  }

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "initial-1",
      sender: "dhani",
      text: "Halo cantikku sayang! ✨ Lagi ingin tahu atau eksplorasi apa hari ini seputar keajaiban semesta dan planet-planet kita? Mau tanya sains atau cerita apa saja, Mas siap temani yaa. 🪐🤍",
      time: "Sekarang",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showDhaniModal && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, showDhaniModal, dhaniLoading]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const navigateToPlanetRef = useRef<(name: PlanetName) => void>(() => {});
  const triggerSatelliteLaunchRef = useRef<() => void>(() => {});
  const triggerShootingStarRef = useRef<() => void>(() => {});
  const switchLayoutModeRef = useRef<(mode: LayoutMode) => void>(() => {});
  const viewSolarOverviewRef = useRef<() => void>(() => {});
  const zoomInRef = useRef<() => void>(() => {});
  const zoomOutRef = useRef<() => void>(() => {});
  const resetViewRef = useRef<() => void>(() => {});

  const layoutModeRef = useRef<LayoutMode>("orbit");
  const timeMultiplierRef = useRef<number>(1);
  const showOrbitLabelsRef = useRef<boolean>(true);
  const skyDomeMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    layoutModeRef.current = layoutMode;
  }, [layoutMode]);

  useEffect(() => {
    timeMultiplierRef.current = timeMultiplier;
  }, [timeMultiplier]);

  useEffect(() => {
    showOrbitLabelsRef.current = showOrbitLabels;
  }, [showOrbitLabels]);

  useEffect(() => {
    if (skyDomeMeshRef.current) skyDomeMeshRef.current.visible = showMilkyWay;
  }, [showMilkyWay]);

  // BGM CONTROLS (User Uploaded Soundtrack)
  const startAmbientSoundscape = () => {
    try {
      if (!bgmAudioRef.current) {
        const audio = new Audio("/audio/bgm.mp3");
        audio.loop = true;
        audio.volume = 0.55;
        audio.addEventListener("ended", () => {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        });
        bgmAudioRef.current = audio;
      }
      bgmAudioRef.current
        .play()
        .then(() => {
          setIsAudioPlaying(true);
        })
        .catch(() => {
          setIsAudioPlaying(false);
        });
    } catch {
      setIsAudioPlaying(false);
    }
  };

  const stopAmbientSoundscape = () => {
    try {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
      }
      setIsAudioPlaying(false);
    } catch {}
  };

  const toggleAmbientAudio = () => {
    playSfx("click");
    if (isAudioPlaying) {
      stopAmbientSoundscape();
    } else {
      startAmbientSoundscape();
    }
  };

  // Auto-play BGM on first user interaction
  useEffect(() => {
    const handleFirstUserGesture = () => {
      if (!isAudioPlaying && !bgmAudioRef.current) {
        startAmbientSoundscape();
      }
      window.removeEventListener("click", handleFirstUserGesture);
      window.removeEventListener("keydown", handleFirstUserGesture);
      window.removeEventListener("touchstart", handleFirstUserGesture);
    };
    window.addEventListener("click", handleFirstUserGesture);
    window.addEventListener("keydown", handleFirstUserGesture);
    window.addEventListener("touchstart", handleFirstUserGesture);
    return () => {
      window.removeEventListener("click", handleFirstUserGesture);
      window.removeEventListener("keydown", handleFirstUserGesture);
      window.removeEventListener("touchstart", handleFirstUserGesture);
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
      }
    };
  }, []);

  const playSfx = (
    type:
      | "whoosh"
      | "click"
      | "satellite"
      | "target"
      | "wish"
      | "polaroid"
      | "quiz_correct"
      | "quiz_wrong"
      | "star_collect"
      | "heart"
      | "game_over"
  ) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;

      if (type === "whoosh") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.35);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "target") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "satellite") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.4);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "wish") {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.07, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.4);
        });
      } else if (type === "polaroid") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(200, now + 0.04);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === "quiz_correct") {
        [659.25, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.08, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.25);
        });
      } else if (type === "quiz_wrong") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === "star_collect") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.06);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === "heart") {
        [587.33, 880, 1174.66].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.07, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.3);
        });
      } else if (type === "game_over") {
        [440, 392, 349.23, 261.63].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.08, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.3);
        });
      }
    } catch {}
  };

  // SEND MESSAGE TO TANYA MAS DHANI
  const askDhani = async (presetText?: string) => {
    const textToSend = (presetText || dhaniInput).trim();
    if (!textToSend || dhaniLoading) return;

    playSfx("click");
    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "nana",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!presetText) setDhaniInput("");
    setDhaniLoading(true);

    try {
      const historyPayload = chatMessages
        .concat(userMsg)
        .slice(-10)
        .map((m) => ({
          role: m.sender === "nana" ? "user" : "model",
          text: m.text,
        }));

      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          planetName: activePlanetName,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      const botReply =
        data.reply ||
        data.answer ||
        "Halo cantikku sayang, Mas Dhani selalu ada di sini nemenin kamu. Tanyakan apa saja lagi yaa, Mas siap temani eksplorasi semesta bareng kamu! ✨🪐";

      const botMsg: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        sender: "dhani",
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        sender: "dhani",
        text: "Koneksi ke orbit mas sempat terputus sebentar sayang, tapi rasa sayang mas tetap utuh. Coba kirim lagi yaa cantik! 💖",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, errMsg]);
    } finally {
      setDhaniLoading(false);
    }
  };

  // FEATURE 1 HANDLERS: COSMIC SKY LANTERNS (LAMPION HARAPAN)
  const handleLaunchLantern = () => {
    if (!lanternInputText.trim()) return;
    playSfx("wish");

    const colorNames: Record<string, string> = {
      "#f97316": "Golden Amber",
      "#ec4899": "Rose Romance",
      "#38bdf8": "Cosmic Cyan",
      "#a855f7": "Starlight Violet",
    };

    const blessings = [
      "Lampionmu telah membumbung tinggi membawa doa suci ke langit semesta sayang. Mas Dhani selalu mendoakan dan mendampingi setiap langkahmu. ✨💖",
      "Cahaya hangat lentera ini menjadi saksi betapa tulusnya impianmu. Mas selalu ada di sampingmu untuk mewujudkannya satu per satu! 🌟🤍",
      "Semesta tersenyum melihat lampion harapanmu malam ini. Semoga kebahagiaan selalu memeluk harimu, bidadariku tercinta. 🪐🌸",
    ];
    const pickedBlessing = blessings[Math.floor(Math.random() * blessings.length)];

    const newLantern: SkyLantern = {
      id: "lantern-" + Date.now(),
      text: lanternInputText.trim(),
      author: lanternAuthor.trim() || "Nana Cantik",
      color: lanternColor,
      colorName: colorNames[lanternColor] || "Golden Amber",
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      blessing: pickedBlessing,
      likes: 1,
      x: (Math.random() - 0.5) * 320,
      y: 90 + Math.random() * 90,
      z: (Math.random() - 0.5) * 320,
      riseSpeed: 0.015 + Math.random() * 0.012,
      wobblePhase: Math.random() * Math.PI * 2,
    };

    const updated = [newLantern, ...lanternsList];
    setLanternsList(updated);
    try {
      localStorage.setItem("cosmonana_lanterns", JSON.stringify(updated));
    } catch {}

    setLanternInputText("");
    setShowLanternModal(false);
    showToast("🏮 Lampion harapanmu telah melayang di Ruang Lampion Kosmik! Klik lampion di langit untuk membaca isinya ✨");
  };

  const handleLikeLantern = (id: string) => {
    playSfx("heart");
    setLanternsList((prev) =>
      prev.map((l) => (l.id === id ? { ...l, likes: l.likes + 1 } : l))
    );
    if (selectedLantern && selectedLantern.id === id) {
      setSelectedLantern((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
    }
    showToast("💖 Cahaya cinta dikirimkan ke lampion harapan!");
  };

  const handleDeleteLantern = (id: string) => {
    playSfx("click");
    const filtered = lanternsList.filter((l) => l.id !== id);
    setLanternsList(filtered);
    try {
      localStorage.setItem("cosmonana_lanterns", JSON.stringify(filtered));
    } catch {}
    setShowLanternViewModal(false);
    showToast("Lampion harapan telah diturunkan dari langit.");
  };

  // FEATURE 2 HANDLERS: POLAROID SNAPSHOT
  const capturePolaroidSnapshot = () => {
    if (!canvasRef.current) return;
    playSfx("polaroid");
    try {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      setPolaroidImgUrl(dataUrl);
      setPolaroidCaption(`Bersama ${activePlanetName} — Di Bawah Langit Semesta ✨`);
      setShowPolaroidModal(true);
      showToast(`📸 Mengabadikan momen kosmik di orbit ${activePlanetName}...`);
    } catch {
      showToast("Gagal mengambil snapshot canvas.");
    }
  };

  const downloadPolaroidPng = () => {
    if (!polaroidImgUrl) return;
    playSfx("click");
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = 900;
    offscreenCanvas.height = 1100;
    const ctx = offscreenCanvas.getContext("2d");
    if (!ctx) return;

    // 1. Polaroid White Card Background
    ctx.fillStyle = "#fcfbf9";
    ctx.fillRect(0, 0, 900, 1100);

    // Border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 896, 1096);

    const img = new Image();
    img.src = polaroidImgUrl;
    img.onload = () => {
      // Photo frame backing
      ctx.fillStyle = "#030611";
      ctx.fillRect(50, 50, 800, 800);

      if (polaroidFilter === "vintage") {
        ctx.filter = "sepia(0.35) contrast(1.1) brightness(0.95) saturate(1.2)";
      } else if (polaroidFilter === "cyber") {
        ctx.filter = "hue-rotate(25deg) contrast(1.25) saturate(1.4)";
      } else if (polaroidFilter === "golden") {
        ctx.filter = "sepia(0.2) saturate(1.5) brightness(1.05)";
      } else if (polaroidFilter === "bw") {
        ctx.filter = "grayscale(1) contrast(1.2)";
      } else {
        ctx.filter = "none";
      }

      ctx.drawImage(img, 50, 50, 800, 800);
      ctx.filter = "none";

      // Badge Stamp on Photo Top-Right
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(580, 70, 250, 44, 8);
        ctx.fill();
      } else {
        ctx.fillRect(580, 70, 250, 44);
      }
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 17px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`🪐 ${activePlanetName} • ${DATA[activePlanetName].realAU}`, 705, 98);

      // Handwritten Caption
      ctx.fillStyle = "#1e293b";
      ctx.font = "italic bold 32px Georgia, 'Playfair Display', serif";
      ctx.textAlign = "center";
      ctx.fillText(polaroidCaption || `Bersama ${activePlanetName} ✨`, 450, 930);

      // Date stamp
      ctx.fillStyle = "#64748b";
      ctx.font = "18px monospace";
      const nowStr = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      ctx.fillText(`${nowStr} • Cosmonana Stellarium`, 450, 980);

      // Signature note
      ctx.fillStyle = "#ec4899";
      ctx.font = "bold 22px cursive, sans-serif";
      ctx.fillText("✨ with Mas Dhani 🤍", 450, 1035);

      const link = document.createElement("a");
      link.download = `cosmonana-polaroid-${activePlanetName.toLowerCase()}-${Date.now()}.png`;
      link.href = offscreenCanvas.toDataURL("image/png");
      link.click();

      showToast("📸 Foto Polaroid berhasil diunduh ke perangkatmu!");
    };
  };

  // FEATURE 3 CONSTANTS & QUIZ LOGIC
  const QUIZ_QUESTIONS = [
    {
      question: "Kalau Mas Dhani lagi kangen banget sama kamu, apa hal yang paling sering Mas rasain?",
      options: [
        "Pengen cepat-cepat telepon atau dengar suaramu yang manis",
        "Buka galeri foto kamu sambil senyum-senyum sendiri",
        "Nulis pesan manis penuh perhatian buat kamu",
        "Semua hal di atas benar banget! 💖",
      ],
      correct: 3,
      explanation: "Tepat sekali sayang! Mas selalu kangen setiap momen bareng kamu, dari suara hingga senyuman manismu.",
    },
    {
      question: "Menurut Mas Dhani, benda langit apa yang paling melambangkan senyuman dan kehangatan kamu?",
      options: [
        "Matahari — Karena selalu jadi sumber kehangatan dan semangat",
        "Venus — Karena kecantikanmu paling bersinar di langit malam",
        "Bumi — Karena kamu adalah rumah ternyaman di seluruh semesta",
        "Semua benda langit kalah indah dibanding kamu! ✨",
      ],
      correct: 3,
      explanation: "Benar sekali! Seluruh semesta tahu kalau keindahan kamu selalu jadi yang nomor satu di hati Mas.",
    },
    {
      question: "Apa hal yang paling bikin Mas Dhani gemas saat ngobrol atau bercanda sama kamu?",
      options: [
        "Waktu kamu cerita hal-hal kecil di harimu dengan penuh antusias",
        "Suara manjamu saat lagi capek atau minta disemangatin",
        "Ketawa lepasmu yang selalu nular dan bikin bahagia",
        "Semuanya, dari ujung kepala sampai sifat lucumu bikin Mas luluh! 🤍",
      ],
      correct: 3,
      explanation: "Pasti! Setiap detail kecil dari kamu selalu punya tempat paling spesial di hati Mas Dhani.",
    },
    {
      question: "Kalau kita bisa berpetualang ke luar angkasa berdua, tempat mana yang wajib kita kunjungi?",
      options: [
        "Cincin es Saturnus yang berkilauan indah",
        "Melihat aurora hijau menari di kutub utara Bumi dari orbit",
        "Puncak bukit di Mars sambil menikmati langit kosmik",
        "Ke mana saja semesta membawa kita, asalkan selalu bergandengan tangan sama kamu 🚀",
      ],
      correct: 3,
      explanation: "Di mana pun kita berada di alam semesta ini, selama ada kamu di samping Mas, itu sudah jadi tempat terindah.",
    },
    {
      question: "Berapa besar rasa sayang dan cinta Mas Dhani buat kamu?",
      options: [
        "100%",
        "1000%",
        "Seluas jarak dari Merkurius ke Neptunus",
        "Tak terhingga melampaui batas seluruh galaksi di semesta raya! 🌌",
      ],
      correct: 3,
      explanation: "Jawaban paling sempurna! Rasa sayang Mas ke kamu nggak akan pernah ada ujungnya, cantikku sayang.",
    },
  ];

  const SWEET_REASONS = [
    "Senyuman manis kamu yang selalu bikin semua rasa lelah Mas hilang seketika.",
    "Cara kamu tertawa lepas dan gemas saat menceritakan hal seru di harimu.",
    "Perhatian dan kebaikan hatimu yang selalu tulus dan menenangkan.",
    "Mata indahmu yang selalu berbinar teduh setiap kali kita saling memandang.",
    "Ketulusanmu yang selalu sabar dan pengertian menemani langkah Mas.",
    "Suara lembut kamu di telepon yang selalu jadi obat rindu terbaik.",
    "Semangat dan dedikasi kamu dalam mengejar impian-impian hebatmu.",
    "Tingkah lucu dan manjamu yang cuma Mas yang beruntung bisa melihatnya.",
    "Momen ngobrol berdua berjam-jam tanpa rasa bosan sedikit pun.",
    "Fakta bahwa kamu adalah rumah ternyaman dan terhangat bagi hati Mas Dhani.",
  ];

  const handleAnswerQuiz = (optionIdx: number) => {
    if (quizSelected !== null) return;
    setQuizSelected(optionIdx);
    const q = QUIZ_QUESTIONS[quizIndex];
    if (optionIdx === q.correct) {
      playSfx("quiz_correct");
      setQuizScore((prev) => prev + 20);
    } else {
      playSfx("quiz_wrong");
    }
  };

  const handleNextQuiz = () => {
    playSfx("click");
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setQuizSelected(null);
    } else {
      setQuizCompleted(true);
      playSfx("wish");
    }
  };

  const resetQuiz = () => {
    playSfx("click");
    setQuizIndex(0);
    setQuizSelected(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  // FEATURE 4: RETRO COSMIC ROCKET MINI-GAME ENGINE
  const startArcadeGame = () => {
    playSfx("click");
    setGameState("playing");
    setGameScore(0);
    setGameLives(3);
    setGameDistance("0.00 AU");
  };

  useEffect(() => {
    if (!showGameModal || gameState !== "playing") {
      if (gameLoopIdRef.current) cancelAnimationFrame(gameLoopIdRef.current);
      return;
    }

    const canvas = arcadeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 440;
    canvas.height = 380;

    let shipX = canvas.width / 2;
    const shipY = canvas.height - 45;
    const shipW = 28;
    const shipH = 34;

    interface GameItem {
      x: number;
      y: number;
      type: "star" | "heart" | "asteroid" | "shield";
      speed: number;
      radius: number;
      symbol: string;
    }

    interface GameParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      size: number;
    }

    let items: GameItem[] = [];
    let particles: GameParticle[] = [];
    let bgStars: { x: number; y: number; s: number; speed: number }[] = [];
    for (let i = 0; i < 40; i++) {
      bgStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: 1 + Math.random() * 2,
        speed: 0.5 + Math.random() * 1.5,
      });
    }

    let frameCount = 0;
    let currentScore = 0;
    let currentLives = 3;
    let shieldTime = 0;
    let isRunning = true;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") gameMoveLeftRef.current = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") gameMoveRightRef.current = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") gameMoveLeftRef.current = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") gameMoveRightRef.current = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const spawnParticles = (x: number, y: number, color: string, count = 12) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 1 + Math.random() * 3.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          color,
          alpha: 1.0,
          size: 2 + Math.random() * 3,
        });
      }
    };

    const loop = () => {
      if (!isRunning) return;
      frameCount++;

      // Player Movement
      if (gameMoveLeftRef.current && shipX > shipW) shipX -= 6;
      if (gameMoveRightRef.current && shipX < canvas.width - shipW) shipX += 6;

      // Spawn items
      if (frameCount % 30 === 0) {
        items.push({
          x: 20 + Math.random() * (canvas.width - 40),
          y: -20,
          type: "star",
          speed: 2.2 + Math.random() * 1.2,
          radius: 12,
          symbol: "⭐",
        });
      }
      if (frameCount % 45 === 0) {
        items.push({
          x: 20 + Math.random() * (canvas.width - 40),
          y: -20,
          type: "asteroid",
          speed: 2.8 + Math.random() * 1.6,
          radius: 14,
          symbol: "🪨",
        });
      }
      if (frameCount % 240 === 0) {
        items.push({
          x: 30 + Math.random() * (canvas.width - 60),
          y: -20,
          type: "heart",
          speed: 2.0,
          radius: 13,
          symbol: "💖",
        });
      }
      if (frameCount % 380 === 0) {
        items.push({
          x: 30 + Math.random() * (canvas.width - 60),
          y: -20,
          type: "shield",
          speed: 2.5,
          radius: 13,
          symbol: "🛡️",
        });
      }

      if (shieldTime > 0) shieldTime--;

      // Clear & Draw Background
      ctx.fillStyle = "#040816";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield parallax
      ctx.fillStyle = "#ffffff";
      bgStars.forEach((st) => {
        st.y += st.speed;
        if (st.y > canvas.height) st.y = 0;
        ctx.globalAlpha = Math.min(1, st.s * 0.4);
        ctx.fillRect(st.x, st.y, st.s, st.s);
      });
      ctx.globalAlpha = 1.0;

      // Thruster flame particles
      if (frameCount % 2 === 0) {
        particles.push({
          x: shipX + (Math.random() - 0.5) * 6,
          y: shipY + shipH / 2,
          vx: (Math.random() - 0.5) * 0.8,
          vy: 2.5 + Math.random() * 2,
          color: Math.random() > 0.4 ? "#f43f5e" : "#fbbf24",
          alpha: 0.9,
          size: 3 + Math.random() * 3,
        });
      }

      // Update & Draw Items
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += it.speed;

        // Draw symbol
        ctx.font = `${it.radius * 1.5}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(it.symbol, it.x, it.y);

        // Check Collision with ship
        const dx = it.x - shipX;
        const dy = it.y - shipY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < it.radius + shipW * 0.6) {
          if (it.type === "star") {
            currentScore += 10;
            spawnParticles(it.x, it.y, "#fbbf24", 12);
            playSfx("star_collect");
          } else if (it.type === "heart") {
            currentScore += 25;
            if (currentLives < 3) currentLives++;
            spawnParticles(it.x, it.y, "#f43f5e", 16);
            playSfx("heart");
          } else if (it.type === "shield") {
            shieldTime = 300; // 5s
            spawnParticles(it.x, it.y, "#38bdf8", 16);
            playSfx("satellite");
          } else if (it.type === "asteroid") {
            if (shieldTime <= 0) {
              currentLives--;
              spawnParticles(it.x, it.y, "#94a3b8", 18);
              playSfx("quiz_wrong");
              if (currentLives <= 0) {
                isRunning = false;
                setGameState("gameover");
                playSfx("game_over");
                try {
                  const high = Math.max(currentScore, gameHighScore);
                  localStorage.setItem("cosmonana_rocket_highscore", high.toString());
                  setGameHighScore(high);
                } catch {}
                break;
              }
            } else {
              spawnParticles(it.x, it.y, "#38bdf8", 10);
              playSfx("target");
            }
          }
          items.splice(i, 1);
          continue;
        }

        if (it.y > canvas.height + 30) {
          items.splice(i, 1);
        }
      }

      // Update state for HUD
      setGameScore(currentScore);
      setGameLives(currentLives);
      setGameDistance((currentScore * 0.04).toFixed(2) + " AU");

      // Milestone Victory Check
      if (currentScore >= 200 && gameState === "playing") {
        isRunning = false;
        setGameState("victory");
        playSfx("wish");
        try {
          const high = Math.max(currentScore, gameHighScore);
          localStorage.setItem("cosmonana_rocket_highscore", high.toString());
          setGameHighScore(high);
        } catch {}
      }

      // Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.035;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Draw Rocket Ship
      ctx.font = "32px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🚀", shipX, shipY);

      // Shield Bubble
      if (shieldTime > 0) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 + 0.4 * Math.sin(frameCount * 0.2)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(shipX, shipY, 26, 0, Math.PI * 2);
        ctx.stroke();
      }

      gameLoopIdRef.current = requestAnimationFrame(loop);
    };

    gameLoopIdRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (gameLoopIdRef.current) cancelAnimationFrame(gameLoopIdRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [showGameModal, gameState]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!canvasRef.current) return;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      8000
    );

    const earthR = DATA["Bumi"].size;
    const earthOrbitR = DATA["Bumi"].orbitRadius;

    // Camera starts focused on Earth in its authentic orbit
    camera.position.set(earthOrbitR, earthR * 0.45, earthR * 2.2);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.2;
    controls.rotateSpeed = 0.8;
    controls.minDistance = 2.0;
    controls.maxDistance = 3500;
    controls.target.set(earthOrbitR, 0, 0);

    // 2. CENTRAL SOLAR LIGHTING (Physical Radiant Light from the Sun)
    const sunPointLight = new THREE.PointLight(0xfffaed, 5.0, 3500, 0.4);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);

    // Subtle deep-space ambient light
    const ambientLight = new THREE.AmbientLight(0x1a263e, 0.5);
    scene.add(ambientLight);

    // Keylight helper for active inspection
    const inspectLight = new THREE.DirectionalLight(0xffffff, 1.3);
    inspectLight.position.set(earthOrbitR + 20, 20, 30);
    scene.add(inspectLight);

    const loaderEl = document.getElementById("loader");
    const loaderFill = document.getElementById("loader-fill");
    let loadingDone = false;

    const manager = new THREE.LoadingManager();
    manager.onProgress = (_url, loaded, total) => {
      const pct = total ? Math.min(100, Math.round((loaded / total) * 100)) : 100;
      if (loaderFill) loaderFill.style.width = pct + "%";
    };
    manager.onLoad = () => revealGate();
    const texLoader = new THREE.TextureLoader(manager);

    function revealGate() {
      if (loadingDone) return;
      loadingDone = true;
      if (loaderFill) loaderFill.style.width = "100%";
      setTimeout(() => {
        loaderEl?.classList.add("hide");
      }, 250);
    }
    const fallbackTimeout = setTimeout(revealGate, 3000);

    // 3. AUTHENTIC 360° MILKY WAY & CELESTIAL SKY DOME
    const skyDomeGeo = new THREE.SphereGeometry(3600, 64, 64);
    const skyDomeMat = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.92,
    });
    texLoader.load("/textures/milkyway_stellarium.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      skyDomeMat.map = tex;
      skyDomeMat.needsUpdate = true;
    });
    const skyDome = new THREE.Mesh(skyDomeGeo, skyDomeMat);
    skyDome.rotation.z = THREE.MathUtils.degToRad(60.2);
    skyDome.rotation.x = THREE.MathUtils.degToRad(27.4);
    scene.add(skyDome);
    skyDomeMeshRef.current = skyDome;

    // 4. COSMIC STARDUST & ECLIPTIC AMBIENT PARTICLES
    const dustCount = 1200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const r = 50 + Math.random() * 2500;
      const th = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 55;
      dustPositions[i * 3] = Math.cos(th) * r;
      dustPositions[i * 3 + 1] = y;
      dustPositions[i * 3 + 2] = Math.sin(th) * r;

      const colorChoice = Math.random();
      if (colorChoice > 0.6) {
        dustColors[i * 3] = 0.35;
        dustColors[i * 3 + 1] = 0.75;
        dustColors[i * 3 + 2] = 1.0;
      } else if (colorChoice > 0.3) {
        dustColors[i * 3] = 1.0;
        dustColors[i * 3 + 1] = 0.85;
        dustColors[i * 3 + 2] = 0.45;
      } else {
        dustColors[i * 3] = 0.9;
        dustColors[i * 3 + 1] = 0.95;
        dustColors[i * 3 + 2] = 1.0;
      }
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 5. ASTEROID BELT (Sabuk Asteroid Mars - Yupiter at 2.2 - 3.2 AU)
    const asteroidCount = 800;
    const asteroidGeo = new THREE.DodecahedronGeometry(0.75, 1);
    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x8c827a,
      roughness: 0.85,
      metalness: 0.15,
    });
    const asteroidInstanced = new THREE.InstancedMesh(asteroidGeo, asteroidMat, asteroidCount);
    const dummyObj = new THREE.Object3D();
    const asteroidData: { radius: number; angle: number; speed: number; yOffset: number }[] = [];

    for (let i = 0; i < asteroidCount; i++) {
      const radius = 230 + Math.random() * 60; // Between Mars (185) and Jupiter (360)
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.6 + Math.random() * 0.4) * 0.007;
      const yOffset = (Math.random() - 0.5) * 9.0;
      const scale = 0.35 + Math.random() * 0.9;

      asteroidData.push({ radius, angle, speed, yOffset });
      dummyObj.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);
      dummyObj.scale.set(scale, scale, scale);
      dummyObj.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummyObj.updateMatrix();
      asteroidInstanced.setMatrixAt(i, dummyObj.matrix);
    }
    asteroidInstanced.instanceMatrix.needsUpdate = true;
    scene.add(asteroidInstanced);

    // 5.5 SHOOTING STAR TRAIL SYSTEM
    const shootingStarPointsCount = 20;
    const shootingStarGeo = new THREE.BufferGeometry();
    const starTrailArr = new Float32Array(shootingStarPointsCount * 3);
    shootingStarGeo.setAttribute("position", new THREE.BufferAttribute(starTrailArr, 3));
    const shootingStarMat = new THREE.LineBasicMaterial({
      color: 0xffedd5,
      transparent: true,
      opacity: 0,
      linewidth: 3,
      blending: THREE.AdditiveBlending,
    });
    const shootingStarMesh = new THREE.Line(shootingStarGeo, shootingStarMat);
    scene.add(shootingStarMesh);

    let shootingStarActive = false;
    let shootingStarProgress = 0;
    const starStartPos = new THREE.Vector3();
    const starEndPos = new THREE.Vector3();
    let lastStarTriggerTime = Date.now();

    const spawnShootingStar = () => {
      if (shootingStarActive) return;
      const targetPos = controls.target.clone();
      const angle = Math.random() * Math.PI * 2;
      const elevation = 0.2 + Math.random() * 0.7;
      const dist = 350 + Math.random() * 300;

      starStartPos.set(
        targetPos.x + Math.sin(elevation) * Math.cos(angle) * dist,
        targetPos.y + Math.cos(elevation) * dist + 120,
        targetPos.z + Math.sin(elevation) * Math.sin(angle) * dist
      );

      const deltaVec = new THREE.Vector3(
        (Math.random() - 0.5) * 250 - 180,
        -160 - Math.random() * 120,
        (Math.random() - 0.5) * 250 - 180
      );
      starEndPos.copy(starStartPos).add(deltaVec);

      shootingStarProgress = 0;
      shootingStarActive = true;
    };
    triggerShootingStarRef.current = spawnShootingStar;

    // 6. SOLAR SYSTEM ARCHITECTURE (All 8 Planets + Sun + Moon + Saturn Rings)
    const planetGroupMap: Record<string, THREE.Group> = {};
    const planetBodyMap: Record<string, THREE.Group> = {};
    const planetSphereMap: Record<string, THREE.Mesh> = {};
    const orbitLineMap: Record<string, THREE.Line> = {};
    const clickablePlanetMeshes: THREE.Object3D[] = [];
    const planetAngles: Record<string, number> = {};

    ORDER.forEach((name) => {
      const d = DATA[name];

      // Orbit plane pivot group (tilted by real orbital inclination)
      const pivotGrp = new THREE.Group();
      pivotGrp.rotation.x = THREE.MathUtils.degToRad(d.inclination);
      scene.add(pivotGrp);
      planetGroupMap[name] = pivotGrp;

      // Draw Clean Keplerian Orbit Ring in 3D Space
      if (d.orbitRadius > 0) {
        const orbitCurve = new THREE.EllipseCurve(
          0,
          0,
          d.orbitRadius,
          d.orbitRadius,
          0,
          2 * Math.PI,
          false,
          0
        );
        const orbitPts = orbitCurve.getPoints(256);
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(
          orbitPts.map((p) => new THREE.Vector3(p.x, 0, p.y))
        );
        const orbitMat = new THREE.LineBasicMaterial({
          color: name === "Bumi" ? 0x60a5fa : 0x38bdf8,
          transparent: true,
          opacity: name === "Bumi" ? 0.65 : 0.22,
        });
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        pivotGrp.add(orbitLine);
        orbitLineMap[name] = orbitLine;
      }

      // Planet Body Group (Translates along orbit or linear position)
      const bodyGrp = new THREE.Group();
      const initAngle = (ORDER.indexOf(name) * Math.PI * 2) / 9;
      planetAngles[name] = initAngle;
      bodyGrp.position.set(
        Math.cos(initAngle) * d.orbitRadius,
        0,
        Math.sin(initAngle) * d.orbitRadius
      );
      pivotGrp.add(bodyGrp);
      planetBodyMap[name] = bodyGrp;

      // Planet Sphere Geometry
      const sphereGeo = new THREE.SphereGeometry(d.size, 64, 64);
      let sphereMat: THREE.Material;

      if (name === "Matahari") {
        sphereMat = new THREE.MeshStandardMaterial({
          color: 0xffeedd,
          emissive: 0xffaa22,
          emissiveIntensity: 1.8,
          roughness: 0.15,
        });
        texLoader.load(`/textures/${d.tex}`, (tex) => {
          (sphereMat as THREE.MeshStandardMaterial).map = tex;
          (sphereMat as THREE.MeshStandardMaterial).emissiveMap = tex;
          sphereMat.needsUpdate = true;
        });
      } else {
        sphereMat = new THREE.MeshStandardMaterial({
          color: d.color,
          roughness: 0.6,
          metalness: 0.08,
        });
        texLoader.load(`/textures/${d.tex}`, (tex) => {
          (sphereMat as THREE.MeshStandardMaterial).map = tex;
          sphereMat.needsUpdate = true;
        });
      }

      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.userData = { planetName: name };

      // Apply authentic real-world axial tilt (obliquity)
      sphere.rotation.z = THREE.MathUtils.degToRad(-d.axialTilt);

      bodyGrp.add(sphere);
      planetSphereMap[name] = sphere;
      clickablePlanetMeshes.push(sphere);

      // Moon for Earth
      if (d.moon) {
        const moonGeo = new THREE.SphereGeometry(1.9, 32, 32);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d4, roughness: 0.85 });
        texLoader.load("/textures/moon.jpg", (tex) => {
          moonMat.map = tex;
          moonMat.needsUpdate = true;
        });
        const moon = new THREE.Mesh(moonGeo, moonMat);
        moon.position.set(d.size + 9.0, 1.5, 0);
        moon.userData = { planetName: name, isMoon: true };
        bodyGrp.add(moon);
        clickablePlanetMeshes.push(moon);
      }

      // Majestic Ring System for Saturn
      if (d.ring) {
        const innerR = d.size * 1.25;
        const outerR = d.size * 2.45;
        const ringGeo = new THREE.RingGeometry(innerR, outerR, 128, 16);

        const posAttr = ringGeo.attributes.position;
        const uvAttr = ringGeo.attributes.uv;
        for (let i = 0; i < posAttr.count; i++) {
          const x = posAttr.getX(i);
          const y = posAttr.getY(i);
          const r = Math.sqrt(x * x + y * y);
          const u = (r - innerR) / (outerR - innerR);
          uvAttr.setXY(i, u, 0.5);
        }
        uvAttr.needsUpdate = true;
        ringGeo.rotateX(Math.PI / 2);

        const ringTex = texLoader.load("/textures/saturn-ring.png");
        ringTex.colorSpace = THREE.SRGBColorSpace;
        ringTex.generateMipmaps = true;
        ringTex.minFilter = THREE.LinearMipmapLinearFilter;
        ringTex.magFilter = THREE.LinearFilter;

        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          side: THREE.DoubleSide,
          transparent: true,
          roughness: 0.65,
          metalness: 0.05,
          alphaTest: 0.02,
          depthWrite: true,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.userData = { planetName: name, isRing: true };

        // Saturn rings tilt matched to axial tilt of 26.73°
        ringMesh.rotation.z = THREE.MathUtils.degToRad(-d.axialTilt);
        bodyGrp.add(ringMesh);
        clickablePlanetMeshes.push(ringMesh);
      }
    });

    // 7. ACTIVE SATELLITE LAUNCHER
    const activeSatellites: THREE.Group[] = [];
    const launchSatellite = () => {
      const pData = DATA[activeKey];
      const sat = new THREE.Group();

      const satBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.7, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 })
      );
      const wings = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.05, 0.45),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.1 })
      );
      sat.add(satBody);
      sat.add(wings);

      const targetBody = planetBodyMap[activeKey];
      const worldPos = new THREE.Vector3();
      targetBody.getWorldPosition(worldPos);

      sat.position.copy(worldPos);
      sat.userData = {
        targetPlanet: activeKey,
        radius: pData.size + 4.0 + Math.random() * 1.5,
        speed: 1.2 + Math.random() * 0.8,
        angle: Math.random() * Math.PI * 2,
        inclination: (Math.random() - 0.5) * 0.6,
      };

      scene.add(sat);
      activeSatellites.push(sat);
      playSfx("satellite");
    };
    triggerSatelliteLaunchRef.current = launchSatellite;

    let activeKey: PlanetName = "Bumi";

    function navigateToPlanet(name: PlanetName) {
      activeKey = name;
      playSfx("whoosh");

      const d = DATA[name];

      // Highlight active planet orbit line with its distinct color
      ORDER.forEach((pName) => {
        const oLine = orbitLineMap[pName];
        if (oLine) {
          const mat = oLine.material as THREE.LineBasicMaterial;
          if (pName === name) {
            mat.opacity = 0.65;
            mat.color.setHex(DATA[pName].color || 0x38bdf8);
          } else {
            mat.opacity = 0.22;
            mat.color.setHex(0x38bdf8);
          }
        }
      });

      if (layoutModeRef.current === "linear") {
        const posX = LINEAR_COORDS[name];
        inspectLight.position.set(posX + 25, 25, 30);

        gsap.to(controls.target, {
          x: posX,
          y: 0,
          z: 0,
          duration: 1.3,
          ease: "power3.inOut",
        });

        gsap.to(camera.position, {
          x: posX,
          y: d.size * 0.45,
          z: d.size * 2.2,
          duration: 1.3,
          ease: "power3.inOut",
        });
      } else {
        const targetBody = planetBodyMap[name];
        const worldPos = new THREE.Vector3();
        targetBody.getWorldPosition(worldPos);

        inspectLight.position.set(worldPos.x + 25, worldPos.y + 25, worldPos.z + 30);

        gsap.to(controls.target, {
          x: worldPos.x,
          y: worldPos.y,
          z: worldPos.z,
          duration: 1.3,
          ease: "power3.inOut",
        });

        gsap.to(camera.position, {
          x: worldPos.x,
          y: worldPos.y + d.size * 0.45,
          z: worldPos.z + d.size * 2.2,
          duration: 1.3,
          ease: "power3.inOut",
        });
      }

      setActivePlanetName(name);
    }
    navigateToPlanetRef.current = navigateToPlanet;

    // SOLAR OVERVIEW CAMERA PRESET (Pandangan Semesta Penuh)
    const viewSolarOverview = () => {
      playSfx("whoosh");
      gsap.to(controls.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.6,
        ease: "power3.inOut",
      });
      gsap.to(camera.position, {
        x: 0,
        y: 580,
        z: 1100,
        duration: 1.6,
        ease: "power3.inOut",
      });
    };
    viewSolarOverviewRef.current = viewSolarOverview;

    // DUAL MODE SWITCHER (Orbit 3D vs Berjajar Linear)
    const switchLayoutMode = (mode: LayoutMode) => {
      playSfx("whoosh");
      layoutModeRef.current = mode;
      setLayoutMode(mode);

      if (mode === "linear") {
        // Hide orbital rings and asteroid belt
        Object.values(orbitLineMap).forEach((line) => {
          line.visible = false;
        });
        if (asteroidInstanced) asteroidInstanced.visible = false;

        // Animate all planets to linear position along X-axis
        ORDER.forEach((name) => {
          const pivot = planetGroupMap[name];
          if (pivot) {
            gsap.to(pivot.rotation, { x: 0, duration: 1.0, ease: "power2.inOut" });
          }
          const body = planetBodyMap[name];
          if (body) {
            const targetX = LINEAR_COORDS[name];
            gsap.to(body.position, {
              x: targetX,
              y: 0,
              z: 0,
              duration: 1.2,
              ease: "power3.inOut",
            });
          }
        });

        // Reposition camera and controls to active planet in linear layout
        const activeX = LINEAR_COORDS[activeKey];
        const d = DATA[activeKey];
        inspectLight.position.set(activeX + 25, 25, 30);
        gsap.to(controls.target, { x: activeX, y: 0, z: 0, duration: 1.2, ease: "power3.inOut" });
        gsap.to(camera.position, {
          x: activeX,
          y: d.size * 0.45,
          z: d.size * 2.2,
          duration: 1.2,
          ease: "power3.inOut",
        });
      } else {
        // Orbit mode: restore orbital lines and asteroid belt
        Object.values(orbitLineMap).forEach((line) => {
          line.visible = true;
        });
        if (asteroidInstanced) asteroidInstanced.visible = true;

        // Restore pivot inclination and orbital positions
        ORDER.forEach((name) => {
          const d = DATA[name];
          const pivot = planetGroupMap[name];
          if (pivot) {
            gsap.to(pivot.rotation, {
              x: THREE.MathUtils.degToRad(d.inclination),
              duration: 1.0,
              ease: "power2.inOut",
            });
          }
          const body = planetBodyMap[name];
          if (body && d.orbitRadius > 0) {
            const curAng = planetAngles[name];
            gsap.to(body.position, {
              x: Math.cos(curAng) * d.orbitRadius,
              y: 0,
              z: Math.sin(curAng) * d.orbitRadius,
              duration: 1.2,
              ease: "power3.inOut",
            });
          }
        });

        // Reposition camera and controls to active planet in orbit layout
        setTimeout(() => {
          const targetBody = planetBodyMap[activeKey];
          if (targetBody) {
            const worldPos = new THREE.Vector3();
            targetBody.getWorldPosition(worldPos);
            const d = DATA[activeKey];
            inspectLight.position.set(worldPos.x + 25, worldPos.y + 25, worldPos.z + 30);
            gsap.to(controls.target, {
              x: worldPos.x,
              y: worldPos.y,
              z: worldPos.z,
              duration: 1.2,
              ease: "power3.inOut",
            });
            gsap.to(camera.position, {
              x: worldPos.x,
              y: worldPos.y + d.size * 0.45,
              z: worldPos.z + d.size * 2.2,
              duration: 1.2,
              ease: "power3.inOut",
            });
          }
        }, 120);
      }
    };
    switchLayoutModeRef.current = switchLayoutMode;

    zoomInRef.current = () => {
      playSfx("click");
      const dir = new THREE.Vector3().subVectors(controls.target, camera.position).normalize();
      gsap.to(camera.position, {
        x: camera.position.x + dir.x * 12,
        y: camera.position.y + dir.y * 12,
        z: camera.position.z + dir.z * 12,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    zoomOutRef.current = () => {
      playSfx("click");
      const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
      gsap.to(camera.position, {
        x: camera.position.x + dir.x * 24,
        y: camera.position.y + dir.y * 24,
        z: camera.position.z + dir.z * 24,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    resetViewRef.current = () => {
      playSfx("whoosh");
      const d = DATA[activeKey];

      if (layoutModeRef.current === "linear") {
        const posX = LINEAR_COORDS[activeKey];
        gsap.to(controls.target, {
          x: posX,
          y: 0,
          z: 0,
          duration: 1.0,
          ease: "power3.inOut",
        });
        gsap.to(camera.position, {
          x: posX,
          y: d.size * 0.45,
          z: d.size * 2.2,
          duration: 1.0,
          ease: "power3.inOut",
        });
      } else {
        const targetBody = planetBodyMap[activeKey];
        const worldPos = new THREE.Vector3();
        targetBody.getWorldPosition(worldPos);

        gsap.to(controls.target, {
          x: worldPos.x,
          y: worldPos.y,
          z: worldPos.z,
          duration: 1.0,
          ease: "power3.inOut",
        });
        gsap.to(camera.position, {
          x: worldPos.x,
          y: worldPos.y + d.size * 0.45,
          z: worldPos.z + d.size * 2.2,
          duration: 1.0,
          ease: "power3.inOut",
        });
      }
    };

    // 8. RAYCASTER FOR INTERACTIVE 3D PLANET CLICKS
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = false;
      startX = e.clientX;
      startY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - startX, e.clientY - startY) > 6) {
        isDragging = true;
      }

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickablePlanetMeshes, false);
      if (intersects.length > 0) {
        if (canvasRef.current) canvasRef.current.style.cursor = "pointer";
      } else {
        if (canvasRef.current) canvasRef.current.style.cursor = "default";
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isDragging || Math.hypot(e.clientX - startX, e.clientY - startY) > 8) {
        return;
      }

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickablePlanetMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const targetName = hit.userData.planetName as PlanetName;
        if (targetName) {
          playSfx("target");
          navigateToPlanet(targetName);
        }
      }
    };

    const canvasEl = canvasRef.current;
    if (canvasEl) {
      canvasEl.addEventListener("pointerdown", handlePointerDown);
      canvasEl.addEventListener("pointermove", handlePointerMove);
      canvasEl.addEventListener("pointerup", handlePointerUp);
    }

    let animFrameId: number;
    const clock = new THREE.Clock();

    function animate() {
      animFrameId = requestAnimationFrame(animate);
      const speedFactor = timeMultiplierRef.current;
      const t = clock.getElapsedTime();

      // Milky Way slow cosmic rotation
      if (skyDomeMeshRef.current) {
        skyDomeMeshRef.current.rotation.y = t * 0.0003;
      }

      // Cosmic dust particles gentle drift
      if (dustParticles) {
        dustParticles.rotation.y = t * 0.0006;
      }

      // Shooting Star Trail Animation
      if (shootingStarActive) {
        shootingStarProgress += 0.038;
        if (shootingStarProgress >= 1.0) {
          shootingStarActive = false;
          shootingStarMat.opacity = 0;
        } else {
          shootingStarMat.opacity = Math.sin(shootingStarProgress * Math.PI) * 0.95;
          const currentHead = new THREE.Vector3().lerpVectors(starStartPos, starEndPos, shootingStarProgress);
          const currentTail = new THREE.Vector3().lerpVectors(
            starStartPos,
            starEndPos,
            Math.max(0, shootingStarProgress - 0.22)
          );
          const posArr = shootingStarGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < shootingStarPointsCount; i++) {
            const fraction = i / (shootingStarPointsCount - 1);
            const p = new THREE.Vector3().lerpVectors(currentTail, currentHead, fraction);
            posArr[i * 3] = p.x;
            posArr[i * 3 + 1] = p.y;
            posArr[i * 3 + 2] = p.z;
          }
          shootingStarGeo.attributes.position.needsUpdate = true;
        }
      } else {
        // Auto trigger shooting star streak every 16 seconds
        if (Date.now() - lastStarTriggerTime > 16000) {
          lastStarTriggerTime = Date.now();
          spawnShootingStar();
          if (Math.random() > 0.45) {
            showToastRef.current?.("🌠 Bintang jatuh melintas di langit! Nyalakan lampion harapanmu ✨");
          }
        }
      }

      // Asteroid belt orbital motion (only in orbit mode)
      if (layoutModeRef.current === "orbit" && asteroidInstanced.visible) {
        for (let i = 0; i < asteroidCount; i++) {
          const a = asteroidData[i];
          a.angle += a.speed * speedFactor;
          dummyObj.position.set(Math.cos(a.angle) * a.radius, a.yOffset, Math.sin(a.angle) * a.radius);
          dummyObj.updateMatrix();
          asteroidInstanced.setMatrixAt(i, dummyObj.matrix);
        }
        asteroidInstanced.instanceMatrix.needsUpdate = true;
      }

      // Planetary Motions & Rotations
      ORDER.forEach((name) => {
        const d = DATA[name];
        const bodyGrp = planetBodyMap[name];
        const sphere = planetSphereMap[name];

        // Orbit motion only in orbit layout mode
        if (layoutModeRef.current === "orbit" && d.orbitRadius > 0 && bodyGrp) {
          const orbitSpeed = (365.25 / d.orbitDays) * 0.012 * speedFactor;
          planetAngles[name] += orbitSpeed;
          const curAng = planetAngles[name];
          bodyGrp.position.set(
            Math.cos(curAng) * d.orbitRadius,
            0,
            Math.sin(curAng) * d.orbitRadius
          );
        }

        // Axial Spin (Rotasi pada poros)
        if (sphere) {
          const spinSpeed = (24.0 / d.rotationHours) * 0.02 * (speedFactor === 0 ? 0.005 : speedFactor);
          sphere.rotation.y += spinSpeed;
        }

        // Moon Orbiting Earth
        if (d.moon && bodyGrp) {
          bodyGrp.children.forEach((c) => {
            if (c.userData.isMoon) {
              const moonR = d.size + 9.0;
              const moonAng = t * 1.8 * (speedFactor === 0 ? 0.1 : speedFactor);
              c.position.set(
                Math.cos(moonAng) * moonR,
                Math.sin(moonAng) * 1.5,
                Math.sin(moonAng) * moonR
              );
            }
          });
        }
      });

      // Active Satellites
      activeSatellites.forEach((sat) => {
        const u = sat.userData;
        const targetBody = planetBodyMap[u.targetPlanet];
        if (targetBody) {
          const worldPos = new THREE.Vector3();
          targetBody.getWorldPosition(worldPos);

          u.angle += 0.02 * u.speed * (speedFactor === 0 ? 0.1 : speedFactor);
          sat.position.x = worldPos.x + Math.cos(u.angle) * u.radius;
          sat.position.z = worldPos.z + Math.sin(u.angle) * u.radius;
          sat.position.y = worldPos.y + Math.sin(u.angle * 2) * u.inclination * u.radius;
          sat.rotation.y = -u.angle;
        }
      });

      // Ultra-smooth zero-jitter camera tracking of active planet in orbit mode
      if (layoutModeRef.current === "orbit" && activeKey) {
        const activeBody = planetBodyMap[activeKey];
        if (activeBody) {
          const targetPos = new THREE.Vector3();
          activeBody.getWorldPosition(targetPos);
          const prevTarget = controls.target.clone();
          controls.target.lerp(targetPos, 0.08);
          const delta = new THREE.Vector3().subVectors(controls.target, prevTarget);
          camera.position.add(delta);
        }
      }

      // Update 3D Floating Planet Badges screen positions
      if (layoutModeRef.current === "orbit" && showOrbitLabelsRef.current) {
        ORDER.forEach((name) => {
          const el = document.getElementById(`planet-badge-${name}`);
          const body = planetBodyMap[name];
          if (el && body) {
            const p3d = new THREE.Vector3();
            body.getWorldPosition(p3d);
            const d = DATA[name];
            p3d.y += d.size * 1.35 + 2.5;
            p3d.project(camera);
            const isVisible = p3d.z < 1.0;
            if (isVisible) {
              const sx = (p3d.x * 0.5 + 0.5) * window.innerWidth;
              const sy = (-(p3d.y * 0.5) + 0.5) * window.innerHeight;
              el.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
              el.style.display = "flex";
            } else {
              el.style.display = "none";
            }
          }
        });
      } else {
        ORDER.forEach((name) => {
          const el = document.getElementById(`planet-badge-${name}`);
          if (el) el.style.display = "none";
        });
      }

      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (canvasEl) {
        canvasEl.removeEventListener("pointerdown", handlePointerDown);
        canvasEl.removeEventListener("pointermove", handlePointerMove);
        canvasEl.removeEventListener("pointerup", handlePointerUp);
      }
      clearTimeout(fallbackTimeout);
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  const currentPlanet = DATA[activePlanetName];
  const currentIdx = ORDER.indexOf(activePlanetName);

  const prevPlanetName = ORDER[(currentIdx - 1 + ORDER.length) % ORDER.length];
  const nextPlanetName = ORDER[(currentIdx + 1) % ORDER.length];

  const calculatedWeight = Math.round(userWeight * currentPlanet.gravityFactor * 10) / 10;
  const calculatedAge = Math.round(((userAge * 365.25) / currentPlanet.orbitDays) * 10) / 10;

  const goToPrev = () => {
    navigateToPlanetRef.current(prevPlanetName);
  };

  const goToNext = () => {
    navigateToPlanetRef.current(nextPlanetName);
  };

  return (
    <>
      {/* TOP NAVIGATION BAR */}
      <nav className="spaceedu-nav">
        <div className="brand-logo">
          cosmonana<span>.</span>
          <span className="brand-badge">ASTRONOMICAL OBSERVATORY</span>
        </div>

        <div className="nav-links-wrap">
          <button
            className={`nav-link-btn ${!drawerOpen ? "active" : ""}`}
            onClick={() => {
              playSfx("click");
              setDrawerOpen(false);
            }}
          >
            Planets
          </button>
          <button
            className={`nav-link-btn ${drawerOpen && activeTab === "science" ? "active" : ""}`}
            onClick={() => {
              playSfx("click");
              setActiveTab("science");
              setDrawerOpen(true);
            }}
          >
            Fakta Sains
          </button>
          <button
            className={`nav-link-btn ${drawerOpen && activeTab === "lab" ? "active" : ""}`}
            onClick={() => {
              playSfx("click");
              setActiveTab("lab");
              setDrawerOpen(true);
            }}
          >
            Lab & Gravitasi
          </button>
          <button
            className={`nav-link-btn ${drawerOpen && activeTab === "love" ? "active" : ""}`}
            onClick={() => {
              playSfx("click");
              setActiveTab("love");
              setDrawerOpen(true);
            }}
          >
            💖 Pesan untuk Sayang
          </button>
          <button
            className={`nav-link-btn ${showLanternSanctuary ? "active" : ""}`}
            onClick={() => {
              playSfx("click");
              setShowLanternSanctuary(true);
            }}
          >
            🏮 Ruang Lampion
          </button>
          <button
            className="nav-link-btn"
            onClick={capturePolaroidSnapshot}
          >
            📸 Foto Polaroid
          </button>
          <button
            className="nav-link-btn"
            onClick={() => {
              playSfx("click");
              setShowCapsuleModal(true);
            }}
          >
            🎁 Kapsul Cinta
          </button>
          <button
            className="nav-link-btn"
            onClick={() => {
              playSfx("click");
              setShowGameModal(true);
            }}
          >
            🚀 Mini-Game
          </button>
        </div>

        <div className="nav-right-cluster">
          {/* LAYOUT MODE TOGGLE (Orbit 3D vs Berjajar) */}
          <button
            className={`view-mode-pill ${layoutMode === "linear" ? "active" : ""}`}
            onClick={() => {
              const nextMode = layoutMode === "orbit" ? "linear" : "orbit";
              switchLayoutModeRef.current(nextMode);
            }}
            title="Ganti Mode Tampilan (Orbit 3D / Berjajar Sejajar)"
          >
            {layoutMode === "orbit" ? "🪐 Mode: Orbit 3D" : "📏 Mode: Berjajar"}
          </button>

          {/* BACKGROUND MUSIC TOGGLE */}
          <button
            className={`audio-toggle-btn ${isAudioPlaying ? "playing" : ""}`}
            onClick={toggleAmbientAudio}
            title={isAudioPlaying ? "Jeda Musik Latar" : "Putar Musik Latar"}
          >
            <span className="audio-icon">{isAudioPlaying ? "🎵" : "🔇"}</span>
            <span className="audio-label">{isAudioPlaying ? "Musik Semesta ✨" : "Putar Musik"}</span>
            {isAudioPlaying && (
              <span className="soundwave-anim">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </span>
            )}
          </button>

          {/* SOLAR SYSTEM SCOPE LIVE ORRERY BUTTON */}
          <button
            className="view-mode-pill"
            onClick={() => {
              playSfx("click");
              setShowOrreryModal(true);
            }}
            title="Buka Simulasi Orbit Real-Time Solar System Scope"
          >
            🔭 Live Orrery 3D
          </button>

          <button
            className="nav-cta-btn"
            onClick={() => {
              playSfx("click");
              setShowDhaniModal(true);
            }}
          >
            💬 Tanya Mas Dhani
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className={`hero-container ${drawerOpen ? "faded" : ""}`}>
        <div className="hero-eyebrow">{currentPlanet.indexStr}</div>
        <h1 className="hero-title">{activePlanetName}</h1>
        <p className="hero-desc">{currentPlanet.heroDesc}</p>
        <button
          className="hero-cta-btn"
          onClick={() => {
            playSfx("click");
            setDrawerOpen(true);
          }}
        >
          Explore Planet
        </button>
      </div>

      {/* SIDE PEEK NAVIGATION */}
      <button
        className="side-peek-btn side-peek-left"
        onClick={goToPrev}
        title={`Pindah ke ${prevPlanetName}`}
      >
        <div
          className="side-peek-preview"
          style={{
            backgroundImage: `url('${DATA[prevPlanetName].img ? `/images/${DATA[prevPlanetName].img}` : `/textures/${DATA[prevPlanetName].tex}`}')`,
          }}
        />
        <span>{prevPlanetName}</span>
      </button>

      <button
        className="side-peek-btn side-peek-right"
        onClick={goToNext}
        title={`Pindah ke ${nextPlanetName}`}
      >
        <div
          className="side-peek-preview"
          style={{
            backgroundImage: `url('${DATA[nextPlanetName].img ? `/images/${DATA[nextPlanetName].img}` : `/textures/${DATA[nextPlanetName].tex}`}')`,
          }}
        />
        <span>{nextPlanetName}</span>
      </button>

      {/* FLOATING CHAT LAUNCHER WIDGET */}
      <div
        className="floating-dhani-launcher"
        onClick={() => {
          playSfx("click");
          setShowDhaniModal(true);
        }}
        title="Buka Chat Tanya Mas Dhani"
      >
        <div className="floating-dhani-avatar">🪐</div>
        <div className="floating-dhani-text">
          <div className="floating-dhani-title">Tanya Mas Dhani ✨</div>
          <div className="floating-dhani-sub">Klik untuk mengobrol</div>
        </div>
      </div>

      {/* FLOATING ZOOM & CAMERA CONTROLS */}
      <div className="camera-hud-controls">
        <button
          className="cam-tool-btn"
          onClick={() => zoomInRef.current()}
          title="Zoom In (Dekat)"
        >
          +
        </button>
        <button
          className="cam-tool-btn"
          onClick={() => zoomOutRef.current()}
          title="Zoom Out (Jauh)"
        >
          −
        </button>
        <button
          className="cam-tool-btn"
          onClick={() => resetViewRef.current()}
          title="Reset Sudut Pandang"
          style={{ fontSize: "14px" }}
        >
          ⟲
        </button>
        <button
          className="cam-tool-btn"
          onClick={() => viewSolarOverviewRef.current()}
          title="Pandangan Semesta Penuh (Solar System Overview)"
          style={{ fontSize: "13px" }}
        >
          🔭
        </button>
      </div>

      {/* 3D ORBIT FLOATING PLANET BADGES LAYER */}
      <div className="orbit-labels-layer">
        {ORDER.map((name) => {
          const d = DATA[name];
          const icon = PLANET_ICONS[name] || "🪐";
          return (
            <div
              key={name}
              id={`planet-badge-${name}`}
              className={`planet-orbit-badge ${activePlanetName === name ? "active" : ""}`}
              onClick={() => {
                playSfx("target");
                navigateToPlanetRef.current(name);
              }}
              title={`Fokus ke ${name} (${d.realAU})`}
            >
              <span className="badge-icon">{icon}</span>
              <div className="badge-text-wrap">
                <span className="badge-name">{name}</span>
                <span className="badge-dist">{d.realAU}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* STELLARIUM DOCK */}
      <div className={`stellarium-dock ${drawerOpen ? "hidden-dock" : ""}`}>
        {/* Layout Mode Selector in Dock */}
        <button
          className={`dock-btn ${layoutMode === "orbit" ? "active" : ""}`}
          onClick={() => switchLayoutModeRef.current("orbit")}
          title="Mode Orbit Heliosentris 3D Realistis"
        >
          🪐 Orbit 3D
        </button>

        <button
          className={`dock-btn ${layoutMode === "linear" ? "active" : ""}`}
          onClick={() => switchLayoutModeRef.current("linear")}
          title="Mode Berjajar Sejajar (Perbandingan Planet)"
        >
          📏 Berjajar
        </button>

        <div className="dock-divider"></div>

        {/* Solar System Full Overview Button */}
        <button
          className="dock-btn"
          onClick={() => viewSolarOverviewRef.current()}
          title="Lihat Seluruh Tata Surya dari Sudut Orbit Kosmik"
        >
          🔭 Pandangan Semesta
        </button>

        {/* Orbit Labels Toggle */}
        <button
          className={`dock-btn ${showOrbitLabels ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setShowOrbitLabels(!showOrbitLabels);
          }}
          title="Tampilkan / Sembunyikan Label Nama & Jarak Orbit Planet"
        >
          🏷️ Label Orbit
        </button>

        <button
          className={`dock-btn ${showMilkyWay ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setShowMilkyWay(!showMilkyWay);
          }}
          title="Toggle Panorama Galaksi Bimasakti"
        >
          🌌 Milky Way
        </button>

        <button
          className="dock-btn"
          onClick={() => {
            playSfx("click");
            setShowOrreryModal(true);
          }}
          title="Buka Simulasi Orbit Heliosentris Solar System Scope"
        >
          🪐 Orrery Sandbox
        </button>

        <div className="dock-divider"></div>

        {/* Feature 1: Cosmic Sky Lanterns Button */}
        <button
          className={`dock-btn ${showLanternSanctuary ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setShowLanternSanctuary(true);
          }}
          title="Masuk ke Ruang Lampion Harapan Kosmik"
        >
          🏮 Lampion
        </button>

        {/* Feature 2: Polaroid Snapshot Button */}
        <button
          className="dock-btn"
          onClick={capturePolaroidSnapshot}
          title="Ambil Foto Polaroid Kosmik Bersama Planet Ini"
        >
          📸 Polaroid
        </button>

        {/* Feature 3: Love Capsule Button */}
        <button
          className="dock-btn"
          onClick={() => {
            playSfx("click");
            setShowCapsuleModal(true);
          }}
          title="Buka Kapsul Rahasia & Kuis Cinta Mas Dhani"
        >
          🎁 Kapsul Cinta
        </button>

        {/* Feature 4: Retro Rocket Mini-Game Button */}
        <button
          className="dock-btn"
          onClick={() => {
            playSfx("click");
            setShowGameModal(true);
          }}
          title="Mainkan Mini-Game Jelajah Bintang Antariksa"
        >
          🚀 Mini-Game
        </button>

        <div className="dock-divider"></div>

        {/* Play/Pause Orbit Time Multiplier */}
        <button
          className={`dock-btn ${timeMultiplier === 0 ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setTimeMultiplier(timeMultiplier === 0 ? 1 : 0);
          }}
          title={timeMultiplier === 0 ? "Lanjutkan Gerakan Orbit" : "Jeda Gerakan Orbit"}
        >
          {timeMultiplier === 0 ? "▶️ Lanjut" : "⏸️ Jeda"}
        </button>

        <button
          className={`dock-btn ${timeMultiplier === 1 ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setTimeMultiplier(1);
          }}
          title="Kecepatan Orbit Realistis 1x"
        >
          1x
        </button>
        <button
          className={`dock-btn ${timeMultiplier === 5 ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setTimeMultiplier(5);
          }}
          title="Kecepatan Orbit 5x"
        >
          5x
        </button>
        <button
          className={`dock-btn ${timeMultiplier === 25 ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setTimeMultiplier(25);
          }}
          title="Kecepatan Orbit 25x"
        >
          25x
        </button>
        <button
          className={`dock-btn ${timeMultiplier === 100 ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setTimeMultiplier(100);
          }}
          title="Kecepatan Orbit 100x"
        >
          100x
        </button>
      </div>

      {/* 3D WEBGL CANVAS */}
      <canvas id="webgl-canvas" ref={canvasRef}></canvas>

      {/* SOLAR SYSTEM SCOPE LIVE ORRERY MODAL */}
      <div className={`orrery-modal-backdrop ${showOrreryModal ? "show" : ""}`}>
        <div className="orrery-modal-window">
          <div className="orrery-modal-header">
            <div className="orrery-modal-title">
              <span>🪐 Solar System Scope — Live 3D Orrery Sandbox</span>
              <span className="orrery-badge">REAL-TIME EPHEMERIS</span>
            </div>
            <button
              className="orrery-close-btn"
              onClick={() => {
                playSfx("click");
                setShowOrreryModal(false);
              }}
              title="Tutup Simulator"
            >
              ✕
            </button>
          </div>
          <div className="orrery-frame-container">
            {showOrreryModal && (
              <iframe
                src="https://www.solarsystemscope.com/iframe"
                className="orrery-iframe"
                allowFullScreen
                title="Solar System Scope Live Orrery"
              />
            )}
          </div>
        </div>
      </div>

      {/* TANYA MAS DHANI CHAT MODAL (WHATSAPP/MESSENGER BUBBLE STYLE) */}
      <div className={`chat-modal-backdrop ${showDhaniModal ? "show" : ""}`}>
        <div className="chat-messenger-window">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-user-info">
              <div className="chat-avatar-wrap">
                🪐
                <div className="chat-online-dot"></div>
              </div>
              <div className="chat-name-col">
                <div className="chat-name-title">Mas Dhani 💖</div>
                <div className="chat-status-subtitle">
                  <span>●</span> Online • Selalu ada buat kamu
                </div>
              </div>
            </div>
            <div className="chat-header-actions">
              <button
                className="chat-close-btn"
                onClick={() => {
                  playSfx("click");
                  setShowDhaniModal(false);
                }}
                title="Tutup Chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Chat Body / Message Feed */}
          <div className="chat-body-feed">
            <div className="chat-date-pill">HARI INI</div>

            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-msg-row ${msg.sender === "nana" ? "outgoing" : "incoming"}`}
              >
                <div
                  className={`chat-bubble ${msg.sender === "nana" ? "outgoing-bubble" : "incoming-bubble"}`}
                >
                  <p style={{ margin: 0 }}>{msg.text}</p>
                  <div className="chat-bubble-footer">
                    <span>{msg.time}</span>
                    {msg.sender === "nana" && <span>✓✓</span>}
                  </div>
                </div>
              </div>
            ))}

            {dhaniLoading && (
              <div className="chat-msg-row incoming">
                <div className="chat-typing-bubble">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick FAQ Chips */}
          <div className="chat-faq-container">
            <div className="chat-faq-title">Pertanyaan Cepat untuk Mas Dhani:</div>
            <div className="chat-faq-scroll">
              <button
                className="chat-faq-chip"
                onClick={() =>
                  askDhani(
                    `Mas Dhani, ceritain hal paling menarik dan menakjubkan tentang planet ${activePlanetName} dong! ✨`
                  )
                }
              >
                🪐 Rahasia Planet {activePlanetName}
              </button>
              <button
                className="chat-faq-chip"
                onClick={() =>
                  askDhani("Mas Dhani, kenapa kamu selalu sabar dan perhatian nemenin aku?")
                }
              >
                💖 Ruang Cerita
              </button>
              <button
                className="chat-faq-chip"
                onClick={() =>
                  askDhani(
                    `Mas, apa pemandangan paling indah kalau kita mengamati ${activePlanetName} dari dekat? ✨`
                  )
                }
              >
                🌌 Keindahan {activePlanetName}
              </button>
              <button
                className="chat-faq-chip"
                onClick={() =>
                  askDhani(
                    `Mas Dhani, kalau kita menjelajah semesta ke ${activePlanetName}, apa hal pertama yang bakal kita pelajari? 🚀`
                  )
                }
              >
                🚀 Eksplorasi {activePlanetName}
              </button>
            </div>
          </div>

          {/* Chat Input Bar */}
          <form
            className="chat-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              askDhani();
            }}
          >
            <input
              type="text"
              className="chat-input-box"
              placeholder="Tulis pesan atau tanya apa aja ke Mas Dhani..."
              value={dhaniInput}
              onChange={(e) => setDhaniInput(e.target.value)}
              disabled={dhaniLoading}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={dhaniLoading || !dhaniInput.trim()}
              title="Kirim Pesan"
            >
              ➤
            </button>
          </form>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DEDICATED LANTERN SANCTUARY ROOM (RUANG LAMPION HARAPAN) */}
      {/* ======================================================== */}
      <div className={`sanctuary-modal-backdrop ${showLanternSanctuary ? "show" : ""}`}>
        <div className="sanctuary-room-window">
          {/* Sanctuary Header */}
          <div className="sanctuary-header">
            <div className="sanctuary-brand">
              <div className="sanctuary-icon-glow">🏮</div>
              <div>
                <h2 className="sanctuary-title">Ruang Lampion Harapan Kosmik</h2>
                <p className="sanctuary-subtitle">
                  Suaka doa & harapan indah yang melayang damai di bawah cahaya bintang semesta ✨
                </p>
              </div>
            </div>

            <div className="sanctuary-header-actions">
              <div className="sanctuary-nav-tabs">
                <button
                  className={`sanctuary-tab-btn ${sanctuaryView === "sky" ? "active" : ""}`}
                  onClick={() => {
                    playSfx("click");
                    setSanctuaryView("sky");
                  }}
                >
                  ✨ Langit Lampion ({lanternsList.length})
                </button>
                <button
                  className={`sanctuary-tab-btn ${sanctuaryView === "archive" ? "active" : ""}`}
                  onClick={() => {
                    playSfx("click");
                    setSanctuaryView("archive");
                  }}
                >
                  📜 Arsip Doa ({lanternsList.length})
                </button>
              </div>

              <button
                className="sanctuary-ignite-btn"
                onClick={() => {
                  playSfx("click");
                  setShowLanternModal(true);
                }}
              >
                <span>🔥</span>
                <span>Nyalakan Lampion</span>
              </button>

              <button
                className="sanctuary-close-btn"
                onClick={() => {
                  playSfx("click");
                  setShowLanternSanctuary(false);
                }}
                title="Kembali ke Semesta"
              >
                ✕ Kembali
              </button>
            </div>
          </div>

          {/* Sanctuary Content Body */}
          <div className="sanctuary-body">
            {sanctuaryView === "sky" ? (
              <div className="sanctuary-sky-view">
                {/* Night Sky Atmospheric Floating Lanterns Area */}
                <div className="sanctuary-sky-canvas">
                  <div className="sanctuary-stars-bg"></div>
                  <div className="sanctuary-aurora-glow"></div>
                  <div className="sanctuary-sky-prompt-bar">
                    <span>✨ Sentuh atau klik lampion mana saja di langit untuk membuka gulungan doa & harapan di dalamnya 🤍</span>
                  </div>

                  {/* Dynamic Floating Lanterns in Sky */}
                  <div className="sanctuary-lanterns-field">
                    {lanternsList.map((lantern, idx) => {
                      const leftPos = ((idx * 23 + 14) % 78) + 11; // 11% to 89%
                      const topPos = ((idx * 31 + 18) % 62) + 16; // 16% to 78%
                      const animDelay = (idx * 0.6) % 3.5;
                      const floatDuration = 5 + (idx % 3);

                      return (
                        <div
                          key={lantern.id}
                          className="sanctuary-floating-lantern"
                          style={{
                            left: `${leftPos}%`,
                            top: `${topPos}%`,
                            animationDelay: `${animDelay}s`,
                            animationDuration: `${floatDuration}s`,
                          }}
                          onClick={() => {
                            playSfx("wish");
                            setSelectedLantern(lantern);
                            setShowLanternViewModal(true);
                          }}
                          title={`Klik untuk membuka doa dari ${lantern.author}`}
                        >
                          <div
                            className="lantern-bulb"
                            style={{
                              backgroundColor: lantern.color,
                              boxShadow: `0 0 20px ${lantern.color}, 0 0 40px ${lantern.color}88`,
                            }}
                          >
                            <span className="lantern-emoji">🏮</span>
                            <div className="lantern-sparkle-halo" style={{ borderColor: lantern.color }}></div>
                          </div>
                          <div className="lantern-floating-tag">
                            <span className="lantern-tag-author">{lantern.author}</span>
                            <span className="lantern-tag-snippet">
                              {lantern.text.length > 32 ? lantern.text.slice(0, 32) + "..." : lantern.text}
                            </span>
                            <span className="lantern-tag-likes">💖 {lantern.likes}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Empty / Add More CTA inside sky */}
                  <div className="sanctuary-bottom-cta">
                    <button
                      className="sanctuary-floating-ignite-cta"
                      onClick={() => {
                        playSfx("click");
                        setShowLanternModal(true);
                      }}
                    >
                      <span>🔥 Nyalakan & Terbangkan Lampion Baru ke Langit</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Archive Grid View */
              <div className="sanctuary-archive-view">
                <div className="sanctuary-archive-header">
                  <h3>📜 Daftar Seluruh Doa & Harapan Lampion</h3>
                  <p>Semua harapan yang pernah diterbangkan tersimpan abadi di bawah naungan cahaya kosmik.</p>
                </div>
                <div className="sanctuary-archive-grid">
                  {lanternsList.map((lantern) => (
                    <div
                      key={lantern.id}
                      className="sanctuary-archive-card"
                      onClick={() => {
                        playSfx("wish");
                        setSelectedLantern(lantern);
                        setShowLanternViewModal(true);
                      }}
                    >
                      <div className="archive-card-top">
                        <div className="archive-badge" style={{ color: lantern.color, borderColor: `${lantern.color}44` }}>
                          <span>🏮</span>
                          <span>{lantern.colorName}</span>
                        </div>
                        <span className="archive-date">{lantern.date}</span>
                      </div>

                      <div className="archive-quote">&ldquo;{lantern.text}&rdquo;</div>

                      {lantern.blessing && (
                        <div className="archive-blessing">
                          <span className="blessing-author">🤍 Doa Mas Dhani:</span>
                          <span className="blessing-text">{lantern.blessing}</span>
                        </div>
                      )}

                      <div className="archive-card-footer">
                        <span className="archive-author">Oleh: <strong>{lantern.author}</strong></span>
                        <button
                          className="archive-like-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeLantern(lantern.id);
                          }}
                        >
                          💖 {lantern.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FEATURE 1: COSMIC SKY LANTERNS MODAL (TULIS & TERBANGKAN LAMPION) */}
      <div className={`lantern-modal-backdrop ${showLanternModal ? "show" : ""}`}>
        <div className="lantern-modal-window">
          <div className="lantern-modal-header">
            <div className="lantern-modal-title">
              <span>🏮 Terbangkan Lampion Harapan Kosmik</span>
            </div>
            <button
              className="orrery-close-btn"
              onClick={() => {
                playSfx("click");
                setShowLanternModal(false);
              }}
              title="Tutup"
            >
              ✕
            </button>
          </div>

          <div className="lantern-modal-body">
            <div className="lantern-prompt-card">
              <p className="lantern-prompt-text">
                Tuliskan permohonan, doa tulus, atau impian indahmu. Masukkan ke dalam lampion bercahaya hangat dan terbangkan melayang menembus langit malam semesta. ✨
              </p>
            </div>

            {/* Lantern Light Color Palette Selection */}
            <div className="lantern-color-picker-wrap">
              <div className="lantern-picker-lbl">Pilih Cahaya Lampion:</div>
              <div className="lantern-color-row">
                {[
                  { color: "#f97316", name: "Golden Amber" },
                  { color: "#ec4899", name: "Rose Romance" },
                  { color: "#38bdf8", name: "Cosmic Cyan" },
                  { color: "#a855f7", name: "Starlight Violet" },
                ].map((c) => (
                  <button
                    key={c.color}
                    className={`lantern-color-btn ${lanternColor === c.color ? "active" : ""}`}
                    onClick={() => {
                      playSfx("click");
                      setLanternColor(c.color);
                    }}
                  >
                    <span className="color-dot" style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Author input */}
            <div>
              <div className="lantern-picker-lbl" style={{ marginBottom: "6px" }}>Nama Pengirim Doa:</div>
              <input
                type="text"
                className="lantern-author-input"
                value={lanternAuthor}
                onChange={(e) => setLanternAuthor(e.target.value)}
                placeholder="Nama kamu (misal: Nana Cantik)"
              />
            </div>

            {/* Wish Textarea */}
            <div>
              <div className="lantern-picker-lbl" style={{ marginBottom: "6px" }}>Isi Harapan / Permohonan:</div>
              <textarea
                className="lantern-textarea"
                placeholder="Tuliskan harapan indahmu untuk kita, kesehatan, kebahagiaan, atau masa depan di sini..."
                value={lanternInputText}
                onChange={(e) => setLanternInputText(e.target.value)}
              />
            </div>

            <button
              className="lantern-launch-btn"
              onClick={handleLaunchLantern}
              disabled={!lanternInputText.trim()}
            >
              <span>🔥</span>
              <span>Nyalakan & Terbangkan Lampion ke Langit Semesta</span>
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE 1: VIEW A FLOATING SKY LANTERN MODAL */}
      <div className={`lantern-view-modal-backdrop ${showLanternViewModal && selectedLantern ? "show" : ""}`}>
        {selectedLantern && (
          <div className="lantern-view-card">
            <div className="lantern-glow-badge-row">
              <div className="lantern-visual-glow">
                <span>🏮</span>
                <span style={{ fontSize: "14px", fontWeight: 800, color: selectedLantern.color }}>
                  Lampion {selectedLantern.colorName}
                </span>
              </div>
              <button
                className="orrery-close-btn"
                onClick={() => {
                  playSfx("click");
                  setShowLanternViewModal(false);
                }}
                title="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="lantern-scroll-paper">
              <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
                <span>✨ Harapan Tertulis:</span>
                <span>{selectedLantern.date}</span>
              </div>
              <div className="lantern-paper-quote">
                &ldquo;{selectedLantern.text}&rdquo;
              </div>
              <div className="lantern-paper-footer">
                <span>Oleh: <strong style={{ color: "#ffffff" }}>{selectedLantern.author}</strong></span>
                <span>💖 {selectedLantern.likes} Cahaya Cinta</span>
              </div>
            </div>

            {selectedLantern.blessing && (
              <div className="lantern-blessing-box">
                <div style={{ fontWeight: 700, color: "#f472b6", marginBottom: "4px" }}>
                  🤍 Doa Pendamping Mas Dhani:
                </div>
                <div>&ldquo;{selectedLantern.blessing}&rdquo;</div>
              </div>
            )}

            <div className="lantern-actions-row">
              <button
                className="lantern-heart-btn"
                onClick={() => handleLikeLantern(selectedLantern.id)}
              >
                <span>💖</span>
                <span>Beri Cahaya Cinta ({selectedLantern.likes})</span>
              </button>
              <button
                className="orrery-close-btn"
                style={{ width: "auto", padding: "0 14px", borderRadius: "999px", fontSize: "12px", color: "#ef4444" }}
                onClick={() => handleDeleteLantern(selectedLantern.id)}
                title="Turunkan Lampion"
              >
                ✕ Turunkan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FEATURE 2: COSMIC POLAROID SNAPSHOT STUDIO */}
      <div className={`polaroid-modal-backdrop ${showPolaroidModal ? "show" : ""}`}>
        <div className="polaroid-modal-window">
          <div className="wish-modal-header">
            <div className="wish-modal-title">
              <span>📸 Foto Polaroid Kosmik</span>
            </div>
            <button
              className="orrery-close-btn"
              onClick={() => {
                playSfx("click");
                setShowPolaroidModal(false);
              }}
              title="Tutup"
            >
              ✕
            </button>
          </div>

          <div className="polaroid-preview-area">
            <div className="polaroid-card">
              <div className="polaroid-image-frame">
                {polaroidImgUrl && (
                  <img
                    src={polaroidImgUrl}
                    alt="Cosmic Polaroid"
                    className={`polaroid-img filter-${polaroidFilter}`}
                  />
                )}
                <div className="polaroid-badge-stamp">
                  🪐 {activePlanetName} • {DATA[activePlanetName].realAU}
                </div>
              </div>
              <div className="polaroid-caption-wrap">
                <div className="polaroid-caption-text">
                  {polaroidCaption || `Bersama ${activePlanetName} ✨`}
                </div>
                <div className="polaroid-date-stamp">
                  {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} • with Mas Dhani 🤍
                </div>
              </div>
            </div>
          </div>

          <div className="polaroid-controls-box">
            {/* Filter Selector */}
            <div className="polaroid-filter-row">
              {(["original", "vintage", "cyber", "golden", "bw"] as const).map((f) => (
                <button
                  key={f}
                  className={`filter-chip-btn ${polaroidFilter === f ? "active" : ""}`}
                  onClick={() => {
                    playSfx("click");
                    setPolaroidFilter(f);
                  }}
                >
                  {f === "original" ? "Glow" : f === "vintage" ? "Vintage" : f === "cyber" ? "Cyber" : f === "golden" ? "Golden" : "B&W"}
                </button>
              ))}
            </div>

            {/* Custom Caption Input */}
            <input
              type="text"
              className="polaroid-caption-input"
              value={polaroidCaption}
              onChange={(e) => setPolaroidCaption(e.target.value)}
              placeholder="Tulis pesan/caption foto di sini..."
            />

            {/* Actions */}
            <div className="polaroid-actions-row">
              <button
                className="polaroid-download-btn"
                onClick={downloadPolaroidPng}
              >
                📥 Unduh Foto Polaroid (PNG)
              </button>
              <button
                className="polaroid-download-btn"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)" }}
                onClick={() => {
                  capturePolaroidSnapshot();
                }}
              >
                🔄 Ambil Ulang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 3: TIME CAPSULE & LOVE QUIZ */}
      <div className={`capsule-modal-backdrop ${showCapsuleModal ? "show" : ""}`}>
        <div className="capsule-modal-window">
          <div className="wish-modal-header">
            <div className="wish-modal-title">
              <span>🎁 Kapsul Rahasia & Kuis Cinta Mas Dhani</span>
            </div>
            <button
              className="orrery-close-btn"
              onClick={() => {
                playSfx("click");
                setShowCapsuleModal(false);
              }}
              title="Tutup"
            >
              ✕
            </button>
          </div>

          <div className="capsule-tab-bar">
            <button
              className={`capsule-tab-btn ${capsuleTab === "letter" ? "active" : ""}`}
              onClick={() => {
                playSfx("click");
                setCapsuleTab("letter");
              }}
            >
              📜 Surat Cinta Mas Dhani
            </button>
            <button
              className={`capsule-tab-btn ${capsuleTab === "reasons" ? "active" : ""}`}
              onClick={() => {
                playSfx("click");
                setCapsuleTab("reasons");
              }}
            >
              💖 10 Hal yang Bikin Jatuh Cinta
            </button>
            <button
              className={`capsule-tab-btn ${capsuleTab === "quiz" ? "active" : ""}`}
              onClick={() => {
                playSfx("click");
                setCapsuleTab("quiz");
              }}
            >
              🎯 Kuis Seberapa Kenal Mas Dhani
            </button>
          </div>

          <div className="capsule-content-body">
            {capsuleTab === "letter" && (
              <div className="love-letter-paper">
                <div className="wax-seal">💌</div>
                <h3 className="letter-heading">
                  Untuk Bidadariku yang Paling Cantik dan Berharga ✨
                </h3>
                <div className="letter-paragraphs">
                  <p>
                    Dari miliaran bintang di bentangan galaksi Bimasakti yang luas ini, Mas Dhani selalu merasa bersyukur semesta menuntun langkah Mas untuk bertemu dan mencintaimu.
                  </p>
                  <p>
                    Planetarium ini Mas buat khusus sebagai ruang kosmik kecil kita berdua. Kapan pun kamu merasa lelah, rindu, atau butuh ketenangan, kamu bisa datang ke sini untuk memandang indahnya orbit bintang-bintang sambil mengingat bahwa ada seseorang di sini yang sayangnya ke kamu nggak pernah pudar.
                  </p>
                  <p>
                    Terima kasih yaa sayang sudah selalu jadi cahaya terindah dalam hidup Mas. Semoga semesta selalu melindungi setiap langkah manismu dan menjaga cinta kita tetap hangat selamanya.
                  </p>
                </div>
                <div className="letter-sign-off">
                  Dengan segenap cinta tulus,<br />
                  <strong>— Mas Dhani yang selalu sayang kamu 🪐🤍</strong>
                </div>
              </div>
            )}

            {capsuleTab === "reasons" && (
              <div>
                <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "14px", textAlign: "center" }}>
                  10 hal manis tentang kamu yang selalu membuat hati Mas Dhani jatuh cinta berulang kali:
                </p>
                <div className="reasons-grid">
                  {SWEET_REASONS.map((reason, idx) => (
                    <div key={idx} className="reason-card">
                      <span className="reason-num">#{idx + 1}</span>
                      <span className="reason-text">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {capsuleTab === "quiz" && (
              <div className="quiz-container">
                {!quizCompleted ? (
                  <>
                    <div className="quiz-progress-bar">
                      <div
                        className="quiz-progress-fill"
                        style={{ width: `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                      />
                    </div>

                    <div className="quiz-question-box">
                      <div className="quiz-q-num">
                        Pertanyaan {quizIndex + 1} dari {QUIZ_QUESTIONS.length} • Skor: {quizScore}
                      </div>
                      <div className="quiz-q-text">
                        {QUIZ_QUESTIONS[quizIndex].question}
                      </div>

                      <div className="quiz-options-list">
                        {QUIZ_QUESTIONS[quizIndex].options.map((opt, oIdx) => {
                          const isCorrect = oIdx === QUIZ_QUESTIONS[quizIndex].correct;
                          const isSelected = quizSelected === oIdx;
                          let btnClass = "quiz-option-btn";
                          if (quizSelected !== null) {
                            if (isCorrect) btnClass += " selected-correct";
                            else if (isSelected) btnClass += " selected-wrong";
                          }
                          return (
                            <button
                              key={oIdx}
                              className={btnClass}
                              onClick={() => handleAnswerQuiz(oIdx)}
                              disabled={quizSelected !== null}
                            >
                              <span>{opt}</span>
                              {quizSelected !== null && isCorrect && <span>✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {quizSelected !== null && (
                      <div className="quiz-feedback-box">
                        <p style={{ margin: 0, fontWeight: 600 }}>
                          {QUIZ_QUESTIONS[quizIndex].explanation}
                        </p>
                      </div>
                    )}

                    {quizSelected !== null && (
                      <button className="quiz-next-btn" onClick={handleNextQuiz}>
                        {quizIndex < QUIZ_QUESTIONS.length - 1 ? "Lanjut ke Pertanyaan Berikutnya ➔" : "Lihat Hasil Kuis Cinta 🏆"}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="quiz-trophy-card">
                    <div className="trophy-emoji">🏆</div>
                    <h3 style={{ fontSize: "20px", color: "#ffffff", fontWeight: 800 }}>
                      Kecocokan Cinta: 100% (True Soulmate) ✨
                    </h3>
                    <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.7, maxWidth: "440px" }}>
                      Selamat cantikku sayang! Kamu mengenal Mas Dhani dan isi hatinya dengan begitu sempurna. Mas Dhani menghadiahkan piala penjelajah semesta tercantik ini khusus untuk bidadari Mas yang paling berharga! 💖🪐
                    </p>
                    <button className="quiz-next-btn" onClick={resetQuiz}>
                      🔄 Ulangi Kuis
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FEATURE 4: RETRO COSMIC ROCKET MINI-GAME */}
      <div className={`game-modal-backdrop ${showGameModal ? "show" : ""}`}>
        <div className="game-modal-window">
          <div className="game-hud-bar">
            <div className="game-stat">
              <span>🚀 Skor:</span>
              <span style={{ color: "#ffffff", fontWeight: 800 }}>{gameScore}</span>
            </div>
            <div className="game-stat">
              <span>Jarak:</span>
              <span style={{ color: "#ffffff" }}>{gameDistance}</span>
            </div>
            <div className="game-stat">
              <span>Nyawa:</span>
              <span>{"💖".repeat(Math.max(0, gameLives))}</span>
            </div>
            <button
              className="orrery-close-btn"
              onClick={() => {
                playSfx("click");
                setShowGameModal(false);
              }}
              title="Tutup Game"
            >
              ✕
            </button>
          </div>

          <div className="game-canvas-wrap">
            <canvas id="arcade-canvas" ref={arcadeCanvasRef} />

            {gameState === "menu" && (
              <div className="game-overlay-screen">
                <div style={{ fontSize: "40px" }}>🚀✨</div>
                <div className="game-overlay-title">Cosmic Rocket Explorer</div>
                <p className="game-overlay-sub">
                  Kendalikan roket cintamu! Kumpulkan bintang (⭐) dan hati (💖), hindari asteroid (🪨). Capai jarak sejauh mungkin di antariksa!
                </p>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                  🏆 Rekor Tertinggi: {gameHighScore} Poin
                </div>
                <button className="game-start-btn" onClick={startArcadeGame}>
                  🎮 Mulai Jelajah Antariksa
                </button>
              </div>
            )}

            {gameState === "gameover" && (
              <div className="game-overlay-screen">
                <div style={{ fontSize: "36px" }}>💥🪐</div>
                <div className="game-overlay-title">Misi Antariksa Selesai</div>
                <p className="game-overlay-sub">
                  Kamu berhasil menjelajah sejauh {gameDistance} dengan total skor <strong>{gameScore}</strong>! Mas Dhani tetap bangga banget sama keberanianmu sayang. 🤍
                </p>
                <div style={{ fontSize: "12px", color: "#38bdf8" }}>
                  🏆 Rekor Terbaik: {Math.max(gameScore, gameHighScore)} Poin
                </div>
                <button className="game-start-btn" onClick={startArcadeGame}>
                  🔄 Main Lagi
                </button>
              </div>
            )}

            {gameState === "victory" && (
              <div className="game-overlay-screen">
                <div style={{ fontSize: "40px" }}>🏆🌟</div>
                <div className="game-overlay-title" style={{ color: "#f472b6" }}>
                  Penjelajah Kosmik Sejati!
                </div>
                <p className="game-overlay-sub">
                  Luar biasa sayang! Kamu berhasil melampaui 200+ poin ({gameDistance}) menembus batas antariksa! Mas Dhani kirim peluk paling hangat buat kapten tercantik semesta! 🪐💖
                </p>
                <button className="game-start-btn" onClick={startArcadeGame}>
                  🚀 Lanjutkan Petualangan
                </button>
              </div>
            )}
          </div>

          {/* Touch control pad for mobile & desktop click */}
          <div className="game-touch-controls">
            <button
              className="game-touch-btn"
              onPointerDown={() => (gameMoveLeftRef.current = true)}
              onPointerUp={() => (gameMoveLeftRef.current = false)}
              onPointerLeave={() => (gameMoveLeftRef.current = false)}
            >
              ◀ Kiri
            </button>
            <button
              className="game-touch-btn"
              onPointerDown={() => (gameMoveRightRef.current = true)}
              onPointerUp={() => (gameMoveRightRef.current = false)}
              onPointerLeave={() => (gameMoveRightRef.current = false)}
            >
              Kanan ▶
            </button>
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <div
        className={`cosmic-toast ${toastMsg ? "show" : ""}`}
        onClick={() => {
          if (toastMsg?.includes("Bintang jatuh") || toastMsg?.includes("Lampion")) {
            playSfx("click");
            setShowLanternModal(true);
          }
        }}
        style={{ cursor: toastMsg?.includes("Bintang jatuh") || toastMsg?.includes("Lampion") ? "pointer" : "default" }}
      >
        <span>{toastMsg}</span>
      </div>

      {/* INTERACTIVE LEARNING DRAWER */}
      <div id="info-drawer" className={drawerOpen ? "open" : ""}>
        <div
          className="drawer-close-bar"
          onClick={() => setDrawerOpen(false)}
          title="Tutup Panel"
        ></div>

        <div className="drawer-header">
          <h2 className="drawer-planet-name">
            {activePlanetName} — {currentPlanet.type}
          </h2>

          <div className="drawer-tab-selector">
            <button
              className={`drawer-tab-btn ${activeTab === "science" ? "active" : ""}`}
              onClick={() => {
                playSfx("click");
                setActiveTab("science");
              }}
            >
              Fakta Sains
            </button>
            <button
              className={`drawer-tab-btn ${activeTab === "lab" ? "active" : ""}`}
              onClick={() => {
                playSfx("click");
                setActiveTab("lab");
              }}
            >
              Lab & Gravitasi
            </button>
            <button
              className={`drawer-tab-btn ${activeTab === "love" ? "active" : ""}`}
              onClick={() => {
                playSfx("click");
                setActiveTab("love");
              }}
            >
              💖 Pesan untuk Sayang
            </button>
          </div>
        </div>

        {activeTab === "science" && (
          <div>
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-lbl">DIAMETER EKUATOR</div>
                <div className="metric-val">{currentPlanet.diameter}</div>
              </div>
              <div className="metric-item">
                <div className="metric-lbl">JARAK KE MATAHARI</div>
                <div className="metric-val">{currentPlanet.distance}</div>
              </div>
              <div className="metric-item">
                <div className="metric-lbl">PERIODE REVOLUSI</div>
                <div className="metric-val">
                  {currentPlanet.orbitDays >= 365
                    ? `${(currentPlanet.orbitDays / 365.25).toFixed(2)} Tahun Bumi`
                    : `${currentPlanet.orbitDays} Hari Bumi`}
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-lbl">PERIODE ROTASI</div>
                <div className="metric-val">
                  {Math.abs(currentPlanet.rotationHours) >= 24
                    ? `${(Math.abs(currentPlanet.rotationHours) / 24).toFixed(1)} Hari ${currentPlanet.rotationHours < 0 ? "(Retrograde)" : ""}`
                    : `${Math.abs(currentPlanet.rotationHours)} Jam`}
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-lbl">KEMIRINGAN POROS</div>
                <div className="metric-val">{currentPlanet.axialTilt}°</div>
              </div>
              <div className="metric-item">
                <div className="metric-lbl">INKLINASI ORBIT</div>
                <div className="metric-val">{currentPlanet.inclination}°</div>
              </div>
              <div className="metric-item">
                <div className="metric-lbl">SUHU RATA-RATA</div>
                <div className="metric-val">{currentPlanet.temp}</div>
              </div>
              <div className="metric-item">
                <div className="metric-lbl">FAKTOR GRAVITASI</div>
                <div className="metric-val">{currentPlanet.gravityFactor}x Bumi</div>
              </div>
            </div>

            <div className="drawer-desc-box">{currentPlanet.scienceFact}</div>
          </div>
        )}

        {activeTab === "lab" && (
          <div>
            <div className="lab-grid">
              <div className="lab-card">
                <div className="lab-card-title">⚖️ Kalkulator Berat Badan di {activePlanetName}</div>
                <div className="lab-input-row">
                  <input
                    type="number"
                    className="lab-input"
                    value={userWeight}
                    onChange={(e) => setUserWeight(Number(e.target.value) || 0)}
                  />
                  <div className="lab-res">
                    kg ➔ Jadi: <span>{calculatedWeight} kg</span>
                  </div>
                </div>
              </div>

              <div className="lab-card">
                <div className="lab-card-title">⏳ Kalkulator Usia Orbit di {activePlanetName}</div>
                <div className="lab-input-row">
                  <input
                    type="number"
                    className="lab-input"
                    value={userAge}
                    onChange={(e) => setUserAge(Number(e.target.value) || 0)}
                  />
                  <div className="lab-res">
                    tahun ➔ Jadi: <span>{calculatedAge} tahun</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "love" && (
          <div className="nana-note-wrapper">
            <div className="nana-note-card">
              <div className="nana-note-header">
                <span className="nana-note-badge">💖 Pesan untuk Sayang</span>
                <span className="nana-note-tag">🪐 {activePlanetName}</span>
              </div>
              <div className="nana-note-quote">&ldquo;{currentPlanet.romanticNote}&rdquo;</div>
              <div className="nana-note-footer">
                <span className="nana-note-sign">— Mas Dhani</span>
                <span className="nana-note-date">✨ Di Bawah Langit Semesta</span>
              </div>
            </div>
          </div>
        )}

        <div className="drawer-actions-row">
          <button
            className="action-btn-primary"
            onClick={() => {
              triggerSatelliteLaunchRef.current();
            }}
          >
            🚀 Luncurkan Satelit Mini ke Orbit {activePlanetName}
          </button>
          <button
            className="action-btn-secondary"
            onClick={() => {
              setDrawerOpen(false);
            }}
          >
            Kembali ke Pemandangan Penuh
          </button>
        </div>
      </div>

      {/* LOADER */}
      <div id="loader">
        <div
          style={{
            color: "#ffffff",
            fontSize: "12px",
            letterSpacing: "2px",
            fontWeight: 600,
          }}
        >
          COSMONANA // INITIALIZING STELLARIUM OBSERVATORY...
        </div>
        <div className="loader-bar">
          <div className="loader-fill" id="loader-fill"></div>
        </div>
      </div>
    </>
  );
}
