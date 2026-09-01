"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

interface PlanetInfo {
  size: number;
  tex: string;
  color: number;
  emissive?: number;
  moon?: boolean;
  ring?: boolean;
  type: string;
  diameter: string;
  distance: string;
  temp: string;
  orbitTime: string;
  scienceFact: string;
  loveNote: string;
  q: string;
  a1: string;
  a2: string;
  correct: number;
  msg: string;
  icon: string;
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

const DATA: Record<PlanetName, PlanetInfo> = {
  Matahari: {
    size: 5.2,
    tex: "sun.jpg",
    color: 0xf4c979,
    emissive: 0xffaa22,
    type: "Star // Class G2V",
    diameter: "1.392.700 km",
    distance: "0.00 AU // Origin",
    temp: "5.500 °C",
    orbitTime: "230 Milyar Thn",
    scienceFact:
      "SENSOR LAPORAN: Inti fusi termonuklir mengubah 600 juta ton hidrogen menjadi helium per detik. Gravitasi Matahari mengikat seluruh tata surya dan memancarkan foton yang menempuh 150 juta km ke Bumi dalam 500 detik.",
    loveNote:
      "LOG ASTRONOT 10.09: Sebagaimana Matahari yang menjadi gravitasi utama tata surya, hadirmu adalah pusat gravitasi yang memberi arah, kehangatan, dan energi bagi hidupku, Commander Nana.",
    q: "Berapa lama transmisi foton dari pusat energi kosmik ini tiba menerangi duniaku?",
    a1: "500 Detik Cahaya",
    a2: "Instan sejak pertama kali mengenal Nana",
    correct: 2,
    msg: "TELEMETRI AKURAT: Senyumanmu memancarkan kehangatan seketika, my sunshine Nana!",
    icon: "☀️",
  },
  Merkurius: {
    size: 1.6,
    tex: "mercury.jpg",
    color: 0x9a938c,
    type: "Terrestrial // Orbit 1",
    diameter: "4.879 km",
    distance: "0.39 AU",
    temp: "-180°C / +430°C",
    orbitTime: "88 Hari Bumi",
    scienceFact:
      "SENSOR LAPORAN: Planet terestrial terpadat kedua. Mengorbit dengan kecepatan 47,4 km/detik. Tanpa atmosfer penahan panas, gradien suhu permukaannya adalah yang paling ekstrem di galaksi ini.",
    loveNote:
      "LOG ASTRONOT 10.09: Di planet dengan revolusi tercepat ini, aku menyadari bahwa waktu selalu melesat begitu cepat saat bersamamu. Setiap detik obrolan kita terasa seperti berlian berharga.",
    q: "Mengapa waktu di dekat Commander Nana selalu terasa secepat revolusi orbit Merkurius?",
    a1: "Efek dilatasi waktu relativitas",
    a2: "Karena 24 jam bersama Nana selalu terasa kurang",
    correct: 2,
    msg: "TRANSMISI DITERIMA: Detik demi detik bersamamu adalah momen terbaik, my love!",
    icon: "🪨",
  },
  Venus: {
    size: 2.2,
    tex: "venus.jpg",
    color: 0xd8b98a,
    type: "Atmospheric // Orbit 2",
    diameter: "12.104 km",
    distance: "0.72 AU",
    temp: "465 °C",
    orbitTime: "225 Hari Bumi",
    scienceFact:
      "SENSOR LAPORAN: Albedo tertinggi di tata surya akibat lapisan awan asam sulfat yang memantulkan 75% sinar matahari. Venus berotasi retrograde (searah jarum jam) sehingga Matahari terbit dari barat.",
    loveNote:
      "LOG ASTRONOT 10.09: Venus dijuluki objek paling berkilau di langit malam, namun tak ada benda langit mana pun yang mampu menandingi binar ketulusan di matamu saat tersenyum.",
    q: "Apa pemandangan dengan luminans cahaya paling mempesona di seluruh sektor semesta ini?",
    a1: "Refleksi awan Venus",
    a2: "Senyuman manis Nana",
    correct: 2,
    msg: "TELEMETRI COCOK: Binar senyumanmu mengalahkan seluruh gemerlap bintang galaksi!",
    icon: "✨",
  },
  Bumi: {
    size: 2.4,
    tex: "earth.jpg",
    color: 0x3f6fae,
    moon: true,
    type: "Bio-Oasis // Orbit 3",
    diameter: "12.742 km",
    distance: "1.00 AU",
    temp: "15 °C",
    orbitTime: "365,25 Hari",
    scienceFact:
      "SENSOR LAPORAN: Satu-satunya dunia biosfer dengan air cair stabil di permukaan dan magnetosfer pelindung. Bulan bertindak sebagai penstabil sumbu rotasi aksial Bumi sebesar 23,5°.",
    loveNote:
      "LOG ASTRONOT 10.09: Dari 8 miliar jiwa di planet biru ini, probabilitas takdir yang mempertemukan kita adalah keajaiban kosmik terindah yang selalu kusyukuri setiap hari.",
    q: "Di antara triliunan koordinat di biosfer Bumi, di manakah titik koordinat rumah hatiku?",
    a1: "Observatorium Pusat Galaksi",
    a2: "Di samping Commander Nana",
    correct: 2,
    msg: "KUNCI ORBIT: Di mana pun kamu berada, di situlah rumah tempat hatiku selalu ingin berlabuh.",
    icon: "🌍",
  },
  Mars: {
    size: 1.8,
    tex: "mars.jpg",
    color: 0xb1543a,
    type: "Red Planet // Orbit 4",
    diameter: "6.779 km",
    distance: "1.52 AU",
    temp: "-60 °C",
    orbitTime: "687 Hari Bumi",
    scienceFact:
      "SENSOR LAPORAN: Menampung Olympus Mons (gunung setinggi 21,9 km) dan Valles Marineris (lembah sepanjang 4.000 km). Permukaannya kaya oksida besi yang memberikan warna merah membara.",
    loveNote:
      "LOG ASTRONOT 10.09: Warna merah Mars melambangkan api semangat dan keteguhan. Di usiamu yang baru ini, aku berjanji akan selalu mendukung dan mendampingi seluruh mimpimu.",
    q: "Setinggi apa tekad dan doa yang kupanjatkan untuk kebahagiaan Nana di hari ulang tahun 10 September?",
    a1: "Setinggi puncak gunung Olympus Mons",
    a2: "Melampaui seluruh horizon kosmik",
    correct: 2,
    msg: "KOMUNIKASI TERVERIFIKASI: Doa tulusku selalu memelukmu di setiap langkah, Nana!",
    icon: "🔴",
  },
  Yupiter: {
    size: 4.3,
    tex: "jupiter.jpg",
    color: 0xcaa87a,
    type: "Gas Giant // Orbit 5",
    diameter: "139.820 km",
    distance: "5.20 AU",
    temp: "-110 °C",
    orbitTime: "11,86 Tahun",
    scienceFact:
      "SENSOR LAPORAN: Massa 318 kali lipat massa Bumi dengan badai Great Red Spot yang telah berputar selama ratusan tahun. Gravitasi raksasanya berfungsi sebagai vacuum cleaner komet berbahaya.",
    loveNote:
      "LOG ASTRONOT 10.09: Sebagaimana Jupiter yang setia melindungi planet bagian dalam, aku ingin selalu menjadi sosok yang melindungimu, menjagamu, dan membuatmu merasa aman seutuhnya.",
    q: "Sebesar apa rasa sayang, cinta, dan perlindungan yang ingin kuberikan untuk Nana?",
    a1: "Sebesar diameter planet Jupiter",
    a2: "Lebih luas dari seluruh kapasitas galaksi",
    correct: 2,
    msg: "SENSOR MAKSIMAL: Hatiku sudah terisi penuh dan sepenuhnya untukmu, Nana!",
    icon: "🪐",
  },
  Saturnus: {
    size: 3.6,
    tex: "saturn.jpg",
    color: 0xd9c39a,
    ring: true,
    type: "Ringed World // Orbit 6",
    diameter: "116.460 km",
    distance: "9.58 AU",
    temp: "-140 °C",
    orbitTime: "29,45 Tahun",
    scienceFact:
      "SENSOR LAPORAN: Memiliki sistem cincin fotorealistis selebar 282.000 km dengan ketebalan 10 meter, terdiri dari 99% partikel es murni dan Celah Cassini yang terbentuk akibat resonansi gravitasi bulan Mimas.",
    loveNote:
      "LOG ASTRONOT 10.09: Cincin Saturnus yang melingkar anggun dan abadi adalah simbol dari kesetiaan dan komitmenku padamu di setiap fase perjalanan hidup kita.",
    q: "Cincin Saturnus melingkar abadi, janji penerbangan apa yang ingin kujaga untuk Nana?",
    a1: "Menjaga keteraturan orbit kosmik",
    a2: "Selalu setia menemani, mencintai, dan membahagiakan Nana",
    correct: 2,
    msg: "KUNCI MISI: Janji setia seumur hidup, tulus dari lubuk hati terdalam!",
    icon: "👑",
  },
  Uranus: {
    size: 2.9,
    tex: "uranus.jpg",
    color: 0x9fd0d6,
    type: "Ice Giant // Orbit 7",
    diameter: "50.724 km",
    distance: "19.2 AU",
    temp: "-224 °C",
    orbitTime: "84 Tahun",
    scienceFact:
      "SENSOR LAPORAN: Kemiringan sumbu rotasi unik 97,8° membuat planet ini berotasi menggelinding pada bidang orbitnya. Metana di atmosfer atas menyerap gelombang merah menghasilkan rona cyan kosmik.",
    loveNote:
      "LOG ASTRONOT 10.09: Keunikan Uranus mengingatkanku pada pribadimu yang selalu membawa keceriaan, tawa manis, dan warna-warni indah di hidupku yang terkadang monoton.",
    q: "Apa yang membuat hari-hari biasa terasa begitu ceria dan berwarna bagi astronot ini?",
    a1: "Spektrum metana Uranus",
    a2: "Tawa ceria, canda, dan cerita hangat dari Nana",
    correct: 2,
    msg: "LAPORAN MISI: Tawamu adalah bahan bakar terbaik untuk semangatku setiap hari!",
    icon: "💎",
  },
  Neptunus: {
    size: 2.8,
    tex: "neptune.jpg",
    color: 0x3d5ce0,
    type: "Deep Azure // Orbit 8",
    diameter: "49.244 km",
    distance: "30.1 AU",
    temp: "-218 °C",
    orbitTime: "164,8 Tahun",
    scienceFact:
      "SENSOR LAPORAN: Planet terjauh di tata surya dengan kecepatan angin supersonik 2.100 km/jam. Memancarkan energi termal 2,6 kali lebih banyak daripada yang diterimanya dari Matahari.",
    loveNote:
      "LOG ASTRONOT 10.09: Berada di tepi terjauh tata surya ini membuktikan bahwa sejauh apa pun jarak dan waktu, frekuensi cintaku untukmu tak akan pernah pudar.",
    q: "Apa yang mampu melintasi jarak 4,5 miliar kilometer menembus batas gravitasi semesta?",
    a1: "Gelombang radio frekuensi tinggi",
    a2: "Ketulusan cinta dan doa untuk Nana di hari ulang tahun 10 September",
    correct: 2,
    msg: "MISI SELESAI: Selamat Ulang Tahun Commander Nana, seluruh semesta ini milikmu!",
    icon: "🌊",
  },
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialized = useRef(false);

  const [activeTab, setActiveTab] = useState<"telemetry" | "log">("telemetry");
  const [openedPlanets, setOpenedPlanets] = useState<Record<string, boolean>>({});
  const [activePlanetName, setActivePlanetName] = useState<PlanetName>("Matahari");
  const [showPassport, setShowPassport] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotResponse, setCopilotResponse] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [warpSpeedDisplay, setWarpSpeedDisplay] = useState("0.0 AU/s");
  const [candleBlown, setCandleBlown] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Realistic Astronaut Sound Synthesizer
  const playSfx = (type: "radio_beep" | "warp_boom" | "scan_sonar" | "correct" | "celebrate") => {
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

      if (type === "radio_beep") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(2400, now);
        osc.frequency.setValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === "warp_boom") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.4);
        osc.frequency.exponentialRampToValueAtTime(40, now + 1.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      } else if (type === "scan_sonar") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1480, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "correct") {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.15, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.35);
        });
      } else if (type === "celebrate") {
        [440, 554.37, 659.25, 880, 1108.73, 1318.51].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.09);
          gain.gain.setValueAtTime(0.18, now + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.8);
        });
      }
    } catch {}
  };

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      let target = new Date(now.getFullYear(), 8, 10, 0, 0, 0);
      if (now.getTime() > target.getTime()) {
        target = new Date(now.getFullYear() + 1, 8, 10, 0, 0, 0);
      }
      const diff = Math.max(0, target.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown({ days, hours, minutes, seconds });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const askCopilot = async (customPrompt?: string) => {
    const query = customPrompt || copilotInput;
    if (!query) return;
    setCopilotLoading(true);
    setCopilotResponse("");
    playSfx("radio_beep");

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          planet: activePlanetName,
          topic: activeTab === "telemetry" ? "Laporan Sensor & Telemetri Kosmik" : "Log Cinta & Doa Ulang Tahun 10 September",
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setCopilotResponse(data.reply);
        playSfx("correct");
      } else {
        setCopilotResponse(data.error || "Sinyal radio terganggu medan magnet kosmik. Coba lagi.");
      }
    } catch {
      setCopilotResponse("A.R.I.A: Telemetri stabil, Commander Nana. Seluruh galaksi tersenyum untukmu hari ini.");
    } finally {
      setCopilotLoading(false);
    }
  };

  useEffect(() => {
    if (initialized.current || !canvasRef.current) return;
    initialized.current = true;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const bgm = document.getElementById("bgm") as HTMLAudioElement | null;
    const audioBtn = document.getElementById("audio-btn") as HTMLButtonElement | null;
    let isPlaying = false;
    function setAudio(play: boolean) {
      if (!bgm || !audioBtn) return;
      if (play) {
        bgm.play().catch(() => {});
        audioBtn.textContent = "COMM: ON 📡";
      } else {
        bgm.pause();
        audioBtn.textContent = "COMM: OFF 🔇";
      }
      isPlaying = play;
    }
    audioBtn?.addEventListener("click", () => setAudio(!isPlaying));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 4500);
    camera.position.set(0, 3, 140);

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
    controls.enablePan = false;
    controls.minDistance = 9;
    controls.maxDistance = 55;
    controls.target.set(0, 3.5, 0);
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.25;

    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambient);
    const sunLight = new THREE.PointLight(0xffeedd, 3.8, 600, 1.2);
    sunLight.position.set(0, 4, 0);
    scene.add(sunLight);

    const keyLight = new THREE.DirectionalLight(0xdbeafe, 2.0);
    keyLight.position.set(25, 35, 25);
    scene.add(keyLight);

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

    // 1. PROCEDURAL ULTRA-HD MULTI-LAYER STARFIELD
    const starCount = 6500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color(0x93c5fd),
      new THREE.Color(0xffffff),
      new THREE.Color(0xfde68a),
      new THREE.Color(0xfbcfe8),
      new THREE.Color(0x67e8f9),
    ];

    for (let i = 0; i < starCount; i++) {
      const r = 350 + Math.random() * 1400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const starfieldMesh = new THREE.Points(starGeo, starMat);
    scene.add(starfieldMesh);

    // 2. HYPERDRIVE WARP SPEED STREAK LINES SYSTEM
    const warpCount = 600;
    const warpGeo = new THREE.BufferGeometry();
    const warpPositions = new Float32Array(warpCount * 6); // 2 vertices per line

    for (let i = 0; i < warpCount; i++) {
      const x = (Math.random() - 0.5) * 120;
      const y = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 200;
      warpPositions[i * 6] = x;
      warpPositions[i * 6 + 1] = y;
      warpPositions[i * 6 + 2] = z;
      warpPositions[i * 6 + 3] = x;
      warpPositions[i * 6 + 4] = y;
      warpPositions[i * 6 + 5] = z - 2; // length
    }

    warpGeo.setAttribute("position", new THREE.BufferAttribute(warpPositions, 3));
    const warpMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const warpLines = new THREE.LineSegments(warpGeo, warpMat);
    scene.add(warpLines);

    // 3. HOLOGRAPHIC 3D PLANET WIREFRAME SCANNER RING
    const scanRingGeo = new THREE.TorusGeometry(5.5, 0.05, 16, 64);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const scanRingMesh = new THREE.Mesh(scanRingGeo, scanRingMat);
    scene.add(scanRingMesh);

    // 4. CELEBRATION STARDUST FIREWORKS
    const fireworkCount = 600;
    const fireworkGeo = new THREE.BufferGeometry();
    const fireworkPos = new Float32Array(fireworkCount * 3);
    const fireworkVels: THREE.Vector3[] = [];
    const fireworkColors = new Float32Array(fireworkCount * 3);

    for (let i = 0; i < fireworkCount; i++) {
      fireworkPos[i * 3] = 0;
      fireworkPos[i * 3 + 1] = 0;
      fireworkPos[i * 3 + 2] = 0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 0.4 + Math.random() * 0.9;
      fireworkVels.push(
        new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed
        )
      );
      const c = new THREE.Color().setHSL(Math.random(), 0.95, 0.7);
      fireworkColors[i * 3] = c.r;
      fireworkColors[i * 3 + 1] = c.g;
      fireworkColors[i * 3 + 2] = c.b;
    }
    fireworkGeo.setAttribute("position", new THREE.BufferAttribute(fireworkPos, 3));
    fireworkGeo.setAttribute("color", new THREE.BufferAttribute(fireworkColors, 3));
    const fireworkMat = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const fireworkPoints = new THREE.Points(fireworkGeo, fireworkMat);
    fireworkPoints.position.set(0, 3.5, 0);
    scene.add(fireworkPoints);

    let fireworksActive = false;
    function trigger3DFireworks() {
      fireworksActive = true;
      fireworkMat.opacity = 1;
      const posAttr = fireworkGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < fireworkCount; i++) {
        posAttr.setXYZ(i, 0, 0, 0);
      }
      posAttr.needsUpdate = true;
    }

    // 5. PHOTOREALISTIC SATURN RING PROCEDURAL CANVAS
    const createSaturnRingTexture = () => {
      const size = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.Texture();

      const cx = size / 2;
      const cy = size / 2;
      const rInner = size * 0.34;
      const rOuter = size * 0.49;

      const grad = ctx.createRadialGradient(cx, cy, rInner, cx, cy, rOuter);
      grad.addColorStop(0.0, "rgba(224, 199, 150, 0.0)");
      grad.addColorStop(0.04, "rgba(180, 160, 120, 0.5)");
      grad.addColorStop(0.22, "rgba(215, 190, 145, 0.85)");
      grad.addColorStop(0.55, "rgba(235, 210, 165, 0.95)");
      grad.addColorStop(0.58, "rgba(20, 20, 20, 0.05)");
      grad.addColorStop(0.64, "rgba(20, 20, 20, 0.05)");
      grad.addColorStop(0.68, "rgba(200, 175, 135, 0.75)");
      grad.addColorStop(0.92, "rgba(210, 185, 140, 0.65)");
      grad.addColorStop(0.96, "rgba(180, 155, 115, 0.2)");
      grad.addColorStop(1.0, "rgba(180, 155, 115, 0.0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    };

    // 6. 3D PLANETS SYSTEM
    const group3D: Record<string, THREE.Group> = {};
    const basePositions: Record<PlanetName, [number, number, number]> = {
      Matahari: [0, 3.5, 0],
      Merkurius: [18, 3.5, 0],
      Venus: [28, 3.5, 0],
      Bumi: [40, 3.5, 0],
      Mars: [52, 3.5, 0],
      Yupiter: [68, 3.5, 0],
      Saturnus: [86, 3.5, 0],
      Uranus: [104, 3.5, 0],
      Neptunus: [122, 3.5, 0],
    };

    ORDER.forEach((name) => {
      const d = DATA[name];
      const grp = new THREE.Group();
      const pos = basePositions[name];
      grp.position.set(pos[0], pos[1], pos[2]);

      const sphereGeo = new THREE.SphereGeometry(d.size, 64, 64);
      let sphereMat: THREE.Material;

      if (name === "Matahari") {
        sphereMat = new THREE.MeshBasicMaterial({ color: d.color });
        texLoader.load(`/textures/${d.tex}`, (tex) => {
          (sphereMat as THREE.MeshBasicMaterial).map = tex;
          sphereMat.needsUpdate = true;
        });

        const canvasGlow = document.createElement("canvas");
        canvasGlow.width = 128;
        canvasGlow.height = 128;
        const gCtx = canvasGlow.getContext("2d");
        if (gCtx) {
          const grad = gCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
          grad.addColorStop(0, "rgba(255, 200, 100, 0.9)");
          grad.addColorStop(0.35, "rgba(255, 140, 40, 0.4)");
          grad.addColorStop(1, "rgba(255, 100, 0, 0)");
          gCtx.fillStyle = grad;
          gCtx.fillRect(0, 0, 128, 128);
        }
        const glowTex = new THREE.CanvasTexture(canvasGlow);
        const glowSprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: glowTex,
            transparent: true,
            blending: THREE.AdditiveBlending,
          })
        );
        glowSprite.scale.set(d.size * 3.2, d.size * 3.2, 1);
        grp.add(glowSprite);
      } else {
        sphereMat = new THREE.MeshStandardMaterial({
          color: d.color,
          roughness: 0.65,
          metalness: 0.1,
        });
        texLoader.load(`/textures/${d.tex}`, (tex) => {
          (sphereMat as THREE.MeshStandardMaterial).map = tex;
          sphereMat.needsUpdate = true;
        });
      }

      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      grp.add(sphere);

      if (d.moon) {
        const moonGeo = new THREE.SphereGeometry(d.size * 0.27, 32, 32);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xc8c8c8, roughness: 0.85 });
        texLoader.load("/textures/moon.jpg", (tex) => {
          moonMat.map = tex;
          moonMat.needsUpdate = true;
        });
        const moon = new THREE.Mesh(moonGeo, moonMat);
        moon.position.set(d.size + 2.8, 0, 0);
        moon.userData = { isMoon: true };
        grp.add(moon);
      }

      if (d.ring) {
        const ringGeo = new THREE.PlaneGeometry(d.size * 5.2, d.size * 5.2);
        const ringMat = new THREE.MeshBasicMaterial({
          map: createSaturnRingTexture(),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.92,
          depthWrite: false,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        grp.add(ringMesh);
      }

      scene.add(grp);
      group3D[name] = grp;
    });

    let activeKey: PlanetName = "Matahari";
    let isTransitioning = false;
    const openedState: Record<string, boolean> = {};

    // 7. HYPERDRIVE WARP SPEED JUMP CONTROLLER
    function warpToPlanet(name: PlanetName) {
      if (isTransitioning) return;
      activeKey = name;
      isTransitioning = true;

      playSfx("warp_boom");
      playSfx("radio_beep");

      const grp = group3D[name];
      const pData = DATA[name];
      const targetPos = grp.position;
      const camOffset = pData.size * 3.6 + 8;

      // Engage warp drive visually
      gsap.to(warpMat, { opacity: 0.8, duration: 0.3, yoyo: true, repeat: 1 });
      setWarpSpeedDisplay("WARP 8.5 AU/s ⚡");

      // Camera vibration & rapid warp travel
      gsap.to(controls.target, {
        x: targetPos.x,
        y: targetPos.y + 0.3,
        z: targetPos.z,
        duration: 1.5,
        ease: "power3.inOut",
      });
      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y + 1.8,
        z: targetPos.z + camOffset,
        duration: 1.5,
        ease: "power3.inOut",
        onComplete: () => {
          isTransitioning = false;
          setWarpSpeedDisplay("ORBIT LOCKED ⚓");
        },
      });

      setActivePlanetName(name);
    }

    // 8. HOLOGRAPHIC DEEP-SCAN TRIGGER
    const quizModal = document.getElementById("quiz-modal");
    const qText = document.getElementById("q-text");
    const ans1 = document.getElementById("ans-1");
    const ans2 = document.getElementById("ans-2");
    const quizResult = document.getElementById("quiz-result");
    const closeQuiz = document.getElementById("close-quiz");
    const finaleEl = document.getElementById("finale");

    function executeDeepScan() {
      const d = DATA[activeKey];
      setIsScanning(true);
      playSfx("scan_sonar");

      // Position 3D wireframe scanner around target planet
      const grp = group3D[activeKey];
      scanRingMesh.position.copy(grp.position);
      scanRingMesh.scale.setScalar(d.size * 0.28);
      gsap.to(scanRingMat, { opacity: 0.85, duration: 0.4 });
      gsap.to(scanRingMesh.rotation, { x: Math.PI * 2, y: Math.PI, duration: 1.5 });

      setTimeout(() => {
        setIsScanning(false);
        gsap.to(scanRingMat, { opacity: 0, duration: 0.3 });

        if (qText) qText.textContent = d.q;
        if (ans1) {
          ans1.textContent = d.a1;
          ans1.style.display = "block";
          ans1.onclick = () => handleScanAnswer(1);
        }
        if (ans2) {
          ans2.textContent = d.a2;
          ans2.style.display = "block";
          ans2.onclick = () => handleScanAnswer(2);
        }
        if (quizResult) quizResult.style.display = "none";
        if (closeQuiz) closeQuiz.style.display = "none";
        quizModal?.classList.add("show");
      }, 1100);
    }

    function handleScanAnswer(choice: number) {
      const d = DATA[activeKey];
      if (quizResult) {
        quizResult.style.display = "block";
        if (choice === d.correct) {
          quizResult.textContent = `✨ ${d.msg} (Stempel Bintang ${activeKey} Berhasil Disimpan!)`;
          playSfx("correct");
          openedState[activeKey] = true;
          setOpenedPlanets({ ...openedState });

          if (Object.keys(openedState).length === ORDER.length) {
            setTimeout(() => {
              quizModal?.classList.remove("show");
              finaleEl?.classList.add("show");
              playSfx("celebrate");
            }, 2500);
          }
        } else {
          quizResult.textContent = `Pilihan manis, tapi mari kita kalibrasi sensor kembali: "${d.msg}"`;
        }
      }
      if (closeQuiz) closeQuiz.style.display = "block";
    }

    closeQuiz?.addEventListener("click", () => {
      quizModal?.classList.remove("show");
    });

    document.getElementById("deep-scan-btn")?.addEventListener("click", executeDeepScan);
    document.getElementById("prev-thruster-btn")?.addEventListener("click", () => {
      const idx = ORDER.indexOf(activeKey);
      const nextIdx = (idx - 1 + ORDER.length) % ORDER.length;
      warpToPlanet(ORDER[nextIdx]);
    });
    document.getElementById("next-thruster-btn")?.addEventListener("click", () => {
      const idx = ORDER.indexOf(activeKey);
      const nextIdx = (idx + 1) % ORDER.length;
      warpToPlanet(ORDER[nextIdx]);
    });

    document.getElementById("gate-btn")?.addEventListener("click", () => {
      document.getElementById("gate")?.classList.add("hide");
      setAudio(true);
      warpToPlanet("Matahari");
    });

    document.getElementById("replay-btn")?.addEventListener("click", () => {
      finaleEl?.classList.remove("show");
      warpToPlanet("Matahari");
    });

    const candleBox = document.getElementById("candle-trigger");
    const flameEl = document.getElementById("flame-el");
    candleBox?.addEventListener("click", () => {
      flameEl?.classList.add("blown");
      setCandleBlown(true);
      playSfx("celebrate");
      trigger3DFireworks();
    });

    let animFrameId: number;
    const clock = new THREE.Clock();

    function animate() {
      animFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      starfieldMesh.rotation.y = t * 0.003;

      if (isTransitioning) {
        warpLines.position.z += 8;
        if (warpLines.position.z > 100) warpLines.position.z = -100;
      }

      if (fireworksActive) {
        const posAttr = fireworkGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < fireworkCount; i++) {
          const v = fireworkVels[i];
          posAttr.setXYZ(
            i,
            posAttr.getX(i) + v.x,
            posAttr.getY(i) + v.y,
            posAttr.getZ(i) + v.z
          );
        }
        posAttr.needsUpdate = true;
        fireworkMat.opacity *= 0.985;
        if (fireworkMat.opacity < 0.05) fireworksActive = false;
      }

      if (activeKey) {
        const grp = group3D[activeKey];
        if (grp) {
          grp.children.forEach((c) => {
            if (c.userData.isMoon) {
              const currentKey = activeKey as PlanetName;
              const R = DATA[currentKey].size + 2.8;
              c.position.x = Math.cos(t * 0.7) * R;
              c.position.z = Math.sin(t * 0.7) * R;
            } else if (c instanceof THREE.Mesh && c.geometry instanceof THREE.SphereGeometry) {
              c.rotation.y += 0.003;
            }
          });
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
      clearTimeout(fallbackTimeout);
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  const currentPlanetData = DATA[activePlanetName];
  const isCurrentOpened = !!openedPlanets[activePlanetName];

  return (
    <>
      <audio id="bgm" loop>
        <source src="/backsound.mp3" type="audio/mpeg" />
      </audio>

      {/* ASTRONAUT HELMET VISOR HUD OVERLAY */}
      <div id="visor-overlay"></div>
      <div id="visor-glare"></div>

      {/* TOP FLIGHT TELEMETRY BAR */}
      <div className="flight-header">
        <div className="mission-callsign">
          <div className="astronaut-badge">
            <span className="pilot-status-dot"></span>
            COMMANDER NANA // EXPEDITION 10.09
          </div>
        </div>

        <div className="flight-actions">
          <button
            className="hud-btn copilot-btn"
            onClick={() => setShowCopilot(true)}
            title="Buka Komunikasi AI Co-Pilot A.R.I.A"
          >
            🎙️ AI CO-PILOT
          </button>
          <button
            className="hud-btn"
            onClick={() => setShowPassport(true)}
            title="Buka Log Stempel Paspor Misi"
          >
            ⭐ PASPOR: {Object.keys(openedPlanets).length}/9
          </button>
          <button id="audio-btn" className="hud-btn" title="Toggle Audio Radio">
            COMM: OFF 🔇
          </button>
        </div>
      </div>

      {/* ORBIT TRACKER NODES */}
      <div className="orbit-tracker-bar">
        {ORDER.map((name) => (
          <button
            key={name}
            className={`orbit-node ${openedPlanets[name] ? "stamped" : ""} ${
              name === activePlanetName ? "active" : ""
            }`}
            onClick={() => setActivePlanetName(name)}
            title={`${name} (${DATA[name].type})`}
          />
        ))}
      </div>

      {/* TARGET LOCK RETICLE */}
      <div className={`target-reticle-wrap ${isScanning ? "scanning" : ""}`}>
        <div className="reticle-corner corner-tl"></div>
        <div className="reticle-corner corner-tr"></div>
        <div className="reticle-corner corner-bl"></div>
        <div className="reticle-corner corner-br"></div>
        <div className="reticle-label">
          {isScanning ? "SCANNING TARGET..." : `LOCK: ${activePlanetName}`}
        </div>
      </div>

      {/* WARP SPEEDOMETER GAUGE */}
      <div className="warp-gauge">
        <span className="warp-status">WARP DRIVE:</span>
        <span className="warp-speed">{warpSpeedDisplay}</span>
      </div>

      {/* LOADER */}
      <div id="loader">
        <div style={{ color: "var(--hud-cyan)", fontSize: "11px", letterSpacing: "2px", fontWeight: 700 }}>
          INITIALIZING ASTRONAUT HELMET HUD & LIFE SUPPORT...
        </div>
        <div className="loader-bar">
          <div className="loader-fill" id="loader-fill"></div>
        </div>
      </div>

      {/* MISSION GATE / LAUNCH SCREEN */}
      <div id="gate">
        <div className="gate-inner">
          <div className="gate-badge">🚀 NASA / COSMIC EXPEDITION 10.09 👨‍🚀</div>
          <h1 className="gate-title">
            Deep Space Exploration
            <br />
            <em>Commander Nana</em>
          </h1>
          <p className="gate-sub">
            Selamat datang di kokpit penerbangan antariksa. Kamu ditugaskan menjelajahi 9 sektor planet di tata surya
            untuk mengumpulkan data ilmiah dan membuka kejutan spesial hari ulang tahunmu pada <strong>10 September</strong>.
          </p>

          <div className="countdown-box">
            <div className="countdown-label">⏳ HITUNG MUNDUR MENUJU ORBIT 10 SEPTEMBER</div>
            <div className="countdown-grid">
              <div className="countdown-item">
                <span className="countdown-num">{countdown.days}</span>
                <span className="countdown-unit">Hari</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-num">{countdown.hours}</span>
                <span className="countdown-unit">Jam</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-num">{countdown.minutes}</span>
                <span className="countdown-unit">Menit</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-num">{countdown.seconds}</span>
                <span className="countdown-unit">Detik</span>
              </div>
            </div>
          </div>

          <button className="gate-btn" id="gate-btn">
            LUNCURKAN MISI SEKARANG 🚀
          </button>
          <div className="gate-hint">🎧 Nyalakan headphone untuk audio radio kokpit & warp drive</div>
        </div>
      </div>

      <canvas id="webgl-canvas" ref={canvasRef}></canvas>

      {/* FLIGHT DECK (BOTTOM DOCK) */}
      <div id="flight-deck">
        <div className="cockpit-console">
          <div className="planet-header-row">
            <div className="target-designation">
              <span className="target-name-text">
                {currentPlanetData.icon} {activePlanetName}
              </span>
              <span className="target-type-pill">{currentPlanetData.type}</span>
            </div>

            <div className="tab-selector">
              <button
                className={`tab-btn ${activeTab === "telemetry" ? "active" : ""}`}
                onClick={() => setActiveTab("telemetry")}
              >
                📡 Sensor Data
              </button>
              <button
                className={`tab-btn ${activeTab === "log" ? "active" : ""}`}
                onClick={() => setActiveTab("log")}
              >
                💌 Log Misi
              </button>
            </div>
          </div>

          {activeTab === "telemetry" ? (
            <div>
              <div className="telemetry-grid">
                <div className="telemetry-box">
                  <div className="telemetry-label">DIAMETER</div>
                  <div className="telemetry-val">{currentPlanetData.diameter}</div>
                </div>
                <div className="telemetry-box">
                  <div className="telemetry-label">JARAK</div>
                  <div className="telemetry-val">{currentPlanetData.distance}</div>
                </div>
                <div className="telemetry-box">
                  <div className="telemetry-label">SUHU</div>
                  <div className="telemetry-val">{currentPlanetData.temp}</div>
                </div>
                <div className="telemetry-box">
                  <div className="telemetry-label">ORBIT</div>
                  <div className="telemetry-val">{currentPlanetData.orbitTime}</div>
                </div>
              </div>
              <p className="flight-desc">{currentPlanetData.scienceFact}</p>
            </div>
          ) : (
            <div>
              <p className="flight-desc love-log">{currentPlanetData.loveNote}</p>
            </div>
          )}
        </div>

        <div className="flight-controls-row">
          <button className="thruster-btn" id="prev-thruster-btn" title="Thruster ke Planet Sebelumnya">
            ‹
          </button>
          <button
            className={`scan-action-btn ${isCurrentOpened ? "scanned" : ""}`}
            id="deep-scan-btn"
          >
            {isCurrentOpened
              ? `✅ DATA ${activePlanetName} TERVERIFIKASI • SCAN LAGI`
              : `📡 JALANKAN DEEP-SCAN ${activePlanetName}`}
          </button>
          <button className="thruster-btn" id="next-thruster-btn" title="Thruster ke Planet Berikutnya">
            ›
          </button>
        </div>
      </div>

      {/* AI CO-PILOT A.R.I.A MODAL */}
      <div id="copilot-modal" className={showCopilot ? "show" : ""}>
        <div className="copilot-terminal">
          <div className="terminal-header">
            <div className="terminal-title">🎙️ AI CO-PILOT A.R.I.A</div>
            <div className="terminal-id">ASTRONAUT RECON & INTEL ASSISTANT</div>
          </div>

          <div className="copilot-chips-row">
            <button
              className="copilot-chip"
              onClick={() => askCopilot("A.R.I.A, laporkan status misi dan pesan semesta untuk ulang tahun Nana di 10 September.")}
            >
              🎂 Laporan Misi 10 September
            </button>
            <button
              className="copilot-chip"
              onClick={() => askCopilot(`A.R.I.A, bagaimana kaitan orbit planet ${activePlanetName} dengan keindahan sosok Nana?`)}
            >
              🪐 Analisis Planet {activePlanetName} & Nana
            </button>
            <button
              className="copilot-chip"
              onClick={() => askCopilot("A.R.I.A, sampaikan doa kosmik paling menyentuh dari pusat komando untuk perjalanan kita.")}
            >
              ✨ Doa Kosmik Masa Depan
            </button>
          </div>

          <div className="terminal-input-box">
            <input
              type="text"
              className="terminal-input"
              placeholder="Ketik instruksi atau pertanyaan ke AI Co-Pilot A.R.I.A..."
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askCopilot()}
            />
            <button
              className="terminal-send-btn"
              onClick={() => askCopilot()}
              disabled={copilotLoading}
            >
              {copilotLoading ? "..." : "TRANSMIT 📡"}
            </button>
          </div>

          {copilotResponse && (
            <div className="copilot-response-feed">
              {copilotResponse}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              className="generic-close-btn"
              onClick={() => setShowCopilot(false)}
            >
              TUTUP TERMINAL
            </button>
          </div>
        </div>
      </div>

      {/* QUIZ / SCANNER RESULT MODAL */}
      <div id="quiz-modal">
        <div className="scanner-box">
          <div className="scanner-eyebrow">📡 SENSOR DEEP-SCAN // KALIBRASI DATA</div>
          <div className="scanner-prompt" id="q-text">
            Menganalisis anomali...
          </div>
          <div>
            <button className="quiz-option-btn" id="ans-1">
              Opsi Data A
            </button>
            <button className="quiz-option-btn" id="ans-2">
              Opsi Data B
            </button>
          </div>
          <div id="quiz-result"></div>
          <button className="generic-close-btn" id="close-quiz">
            LANJUTKAN PENJELAJAHAN ORBIT
          </button>
        </div>
      </div>

      {/* PASSPORT MODAL */}
      <div id="passport-modal" className={showPassport ? "show" : ""}>
        <div className="passport-card">
          <div style={{ textAlign: "center", marginBottom: "14px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--hud-gold)", letterSpacing: "1.5px" }}>
              📔 FLIGHT PASSPORT & MISSION LOG
            </h2>
            <p style={{ fontSize: "11px", color: "#94a3b8" }}>
              COMMANDER NANA — 9 PLANETARY FLIGHT BADGES
            </p>
          </div>

          <div className="stamp-grid">
            {ORDER.map((name) => {
              const isStamped = !!openedPlanets[name];
              const pInfo = DATA[name];
              return (
                <div
                  key={name}
                  className={`stamp-slot ${isStamped ? "stamped" : ""}`}
                >
                  <span className="stamp-icon">{isStamped ? "⭐" : pInfo.icon}</span>
                  <span className="stamp-name">{name}</span>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              className="generic-close-btn"
              onClick={() => setShowPassport(false)}
            >
              TUTUP LOG PASPOR
            </button>
          </div>
        </div>
      </div>

      {/* GRAND FINALE ASTRONAUT EVA BIRTHDAY CELEBRATION */}
      <div id="finale">
        <div className="finale-inner">
          <div className="finale-eyebrow">🚀 MISSION ACCOMPLISHED // EVA SPACEWALK 10.09 🎂</div>
          <h2 className="finale-title">
            Selamat Ulang Tahun,
            <br />
            <span>Commander Nana!</span>
          </h2>

          <div className="cake-wrapper">
            <div id="candle-trigger" className="candle-container" title="Klik untuk Make a Wish!">
              <div id="flame-el" className={`flame ${candleBlown ? "blown" : ""}`}></div>
              <div className="candle-stick"></div>
            </div>
            <div className="wish-instruction">
              {candleBlown
                ? "✨ Harapan kosmikmu telah mengangkasa ke seluruh galaksi! ⭐"
                : "🕯️ Klik lilin untuk 'Make a Wish' & meniupnya!"}
            </div>
          </div>

          <div className="birthday-letter-box">
            <div className="letter-heading">
              TRANSMISI KHUSUS: Untuk My Beloved Nana, My Sunshine, My Sweetheart 💌
            </div>
            <div className="letter-body">
              <p>
                Selamat ulang tahun pada tanggal <strong>10 September</strong> yang begitu istimewa ini! 🎉
              </p>
              <p>
                Terima kasih sudah hadir di semesta ini dan menjadi cahaya paling terang dalam hidupku. Menjelajahi sembilan planet ini hanyalah sebagian kecil dari betapa luasnya rasa syukur dan cintaku padamu.
              </p>
              <p>
                Di usiamu yang baru, aku mendoakan semoga setiap langkahmu selalu dipenuhi kesehatan, kemudahan dalam segala urusan, kedamaian hati, dan tercapainya setiap impian terbesarmu.
              </p>
              <p>
                Sejauh apa pun kita melangkah melintasi waktu dan galaksi, ingatlah bahwa kamu tidak pernah sendiri. Aku akan selalu menjadi co-pilot dan penjelajah setia yang mendampingimu.
              </p>
              <div className="letter-signature">Dengan segenap cinta di seluruh galaksi ❤️</div>
            </div>
          </div>

          <div className="certificate-badge">
            🏆 <strong>OFFICIAL FLIGHT CERTIFICATION:</strong> Diberikan kepada <strong>COMMANDER NANA</strong> atas keberhasilan menyelesaikan Ekspedisi 9 Sektor Tata Surya dan dinobatkan sebagai <em>Pemilik Hatiku Selamanya</em>.
          </div>

          <button className="finale-btn" id="replay-btn">
            JELAJAHI ORBIT LAGI 🚀
          </button>
        </div>
      </div>
    </>
  );
}
