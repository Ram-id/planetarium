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
      "Terima kasih sudah selalu menjadi sumber energi baik dan kehangatan dalam hari-hari mas. Di tengah segala rutinitas dan lelahnya beraktivitas, kabar dan senyumanmu selalu berhasil menghadirkan rasa tenang. Semoga harimu selalu dipenuhi kebaikan dan kelancaran yaa, cantikku sayang. ☀️🤍",
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
      "Di tengah dunia yang sering bergerak serba cepat dan penuh tuntutan, mas harap kamu selalu ingat untuk mengambil jeda dan bernapas lega yaa sayang. Jangan terlalu keras pada dirimu sendiri, setiap proses dan usaha yang kamu jalani sangat berharga. Mas akan selalu ada di sini mendukungmu. ✨",
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
      "Venus mungkin menjadi objek paling bercahaya di langit senja, tetapi ketulusan, kebaikan hati, dan caramu memperlakukan orang lain selalu punya tempat yang jauh lebih istimewa. Tetaplah menjadi dirimu yang apa adanya, dengan segala ketulusan yang kamu miliki, cintaku. 💖",
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
      "Dari luasnya semesta yang dingin dan tak terhingga, dipertemukan dan bisa saling menjaga denganmu adalah salah satu takdir terindah yang selalu mas syukuri setiap hari. Terima kasih sudah mau berproses, belajar, dan melangkah bersama, sayangku. 🌍🫶",
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
      "Setiap perjalanan dan impian baik selalu membutuhkan ketabahan. Apa pun tantangan atau hal berat yang sedang kamu hadapi, percayalah bahwa kamu memiliki ketangguhan hati yang luar biasa, sayang. Mas selalu bangga padamu dan siap mendampingi setiap langkahmu. 🚀",
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
      "Sebagaimana Yupiter yang hadir menjaga keseimbangan tata surya, mas ingin selalu menjadi ruang yang aman dan nyaman untukmu—tempat kamu bisa menceritakan apa saja, menaruh lelah, dan selalu merasa dimengerti tanpa perlu merasa sendirian, cintaku sayang. 🪐",
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
      "Keindahan yang menawan lahir dari keselarasan dan kesabaran. Kehadiranmu membawa keteduhan dan harmoni tersendiri dalam hidup mas. Terima kasih atas setiap perhatian tulus dan kebaikan yang selalu kamu bawa ke dalam hari-hari kita, cantikku sayang. ✨🤍",
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
      "Uranus mengajarkan bahwa memiliki poros dan cara tersendiri bukanlah kekurangan, melainkan keistimewaan. Sudut pandangmu yang unik, kehangatanmu, dan caramu menyayangi adalah hal-hal yang membuatmu begitu istimewa di mata mas, sayangku. 💙",
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
      "Bahkan di titik terjauh yang paling hening di tepian tata surya, rasa tenang dan teduh selalu hadir saat mengingatmu. Di mana pun kamu berada, semoga kamu selalu merasa dijaga dalam doa, dihargai, dan dicintai sepenuh hati, cintaku sayang. 🌌✨",
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
  const [timeMultiplier, setTimeMultiplier] = useState<number>(1);

  // Background Music state & refs (User Uploaded Soundtrack)
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  // Solar System Scope Orrery Modal state
  const [showOrreryModal, setShowOrreryModal] = useState(false);

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
  const switchLayoutModeRef = useRef<(mode: LayoutMode) => void>(() => {});
  const zoomInRef = useRef<() => void>(() => {});
  const zoomOutRef = useRef<() => void>(() => {});
  const resetViewRef = useRef<() => void>(() => {});

  const layoutModeRef = useRef<LayoutMode>("orbit");
  const timeMultiplierRef = useRef<number>(1);
  const skyDomeMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    layoutModeRef.current = layoutMode;
  }, [layoutMode]);

  useEffect(() => {
    timeMultiplierRef.current = timeMultiplier;
  }, [timeMultiplier]);

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

  const playSfx = (type: "whoosh" | "click" | "satellite" | "target") => {
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

    // 2. CENTRAL SOLAR LIGHTING (Physical Source of Illumination from Sun)
    const sunPointLight = new THREE.PointLight(0xfffaed, 4.5, 3000, 0.4);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);

    // Subtle deep-space ambient light
    const ambientLight = new THREE.AmbientLight(0x1a263e, 0.45);
    scene.add(ambientLight);

    // Keylight helper for active inspection
    const inspectLight = new THREE.DirectionalLight(0xffffff, 1.2);
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
      opacity: 0.9,
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
    // Authentic galactic plane tilt ~60 degrees relative to ecliptic
    skyDome.rotation.z = THREE.MathUtils.degToRad(60.2);
    skyDome.rotation.x = THREE.MathUtils.degToRad(27.4);
    scene.add(skyDome);
    skyDomeMeshRef.current = skyDome;

    // 4. ASTEROID BELT (Sabuk Asteroid Mars - Yupiter at 2.2 - 3.2 AU)
    const asteroidCount = 750;
    const asteroidGeo = new THREE.DodecahedronGeometry(0.7, 1);
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

    // 5. SOLAR SYSTEM ARCHITECTURE (All 8 Planets + Sun + Moon + Saturn Rings)
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

      // Draw Glowing Keplerian Orbit Ring in 3D Space
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
        const orbitPts = orbitCurve.getPoints(128);
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(
          orbitPts.map((p) => new THREE.Vector3(p.x, 0, p.y))
        );
        const orbitMat = new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.16,
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

    // 6. ACTIVE SATELLITE LAUNCHER
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
        x: camera.position.x + dir.x * 10,
        y: camera.position.y + dir.y * 10,
        z: camera.position.z + dir.z * 10,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    zoomOutRef.current = () => {
      playSfx("click");
      const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
      gsap.to(camera.position, {
        x: camera.position.x + dir.x * 20,
        y: camera.position.y + dir.y * 20,
        z: camera.position.z + dir.z * 20,
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

    // 7. RAYCASTER FOR INTERACTIVE 3D PLANET CLICKS
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
      const t = clock.getElapsedTime() * speedFactor;

      // Milky Way slow cosmic rotation
      if (skyDomeMeshRef.current) {
        skyDomeMeshRef.current.rotation.y = t * 0.0003;
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
          const spinSpeed = (24.0 / d.rotationHours) * 0.02 * speedFactor;
          sphere.rotation.y += spinSpeed;
        }

        // Moon Orbiting Earth
        if (d.moon && bodyGrp) {
          bodyGrp.children.forEach((c) => {
            if (c.userData.isMoon) {
              const moonR = d.size + 9.0;
              const moonAng = t * 1.8;
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

          u.angle += 0.02 * u.speed * speedFactor;
          sat.position.x = worldPos.x + Math.cos(u.angle) * u.radius;
          sat.position.z = worldPos.z + Math.sin(u.angle) * u.radius;
          sat.position.y = worldPos.y + Math.sin(u.angle * 2) * u.inclination * u.radius;
          sat.rotation.y = -u.angle;
        }
      });

      // Smooth tracking of active planet in orbit mode
      if (layoutModeRef.current === "orbit") {
        const activeBody = planetBodyMap[activeKey];
        if (activeBody) {
          const targetPos = new THREE.Vector3();
          activeBody.getWorldPosition(targetPos);
          controls.target.lerp(targetPos, 0.08);
        }
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
          🔭 Orrery Sandbox
        </button>

        <div className="dock-divider"></div>

        <button
          className={`dock-btn ${timeMultiplier === 1 ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setTimeMultiplier(1);
          }}
        >
          1x
        </button>
        <button
          className={`dock-btn ${timeMultiplier === 5 ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setTimeMultiplier(5);
          }}
        >
          5x
        </button>
        <button
          className={`dock-btn ${timeMultiplier === 25 ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setTimeMultiplier(25);
          }}
        >
          25x
        </button>
        <button
          className={`dock-btn ${timeMultiplier === 100 ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setTimeMultiplier(100);
          }}
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
