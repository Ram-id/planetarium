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
  reflectionNote: string;
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
    type: "Bintang Induk // Tipe Spektral G2V",
    diameter: "1.392.700 km",
    distance: "Pusat Gravitasi Semesta",
    temp: "~5.500 °C",
    orbitTime: "230 Juta Tahun Galaksi",
    scienceFact:
      "Matahari menyumbang 99,86% dari total massa tata surya. Reaksi fusi nuklir pada intinya mengubah 600 juta ton hidrogen menjadi helium setiap detik, menghasilkan energi radiasi yang sampai ke permukaan Bumi dalam waktu 8 menit 20 detik.",
    reflectionNote:
      "Sebagaimana Matahari yang menjadi jangkar gravitasi dan sumber kehangatan bagi seluruh orbit di sekelilingnya, kehadiranmu senantiasa menghadirkan ketenangan, semangat, dan arah yang jernih dalam setiap hariku.",
    q: "Berapa lama waktu yang dibutuhkan cahaya dari pusat tata surya untuk mencapai orbit pengamat?",
    a1: "8 Menit 20 Detik Cahaya",
    a2: "Seketika sejak pertama kali kita saling mengenal",
    correct: 2,
    msg: "Observasi tepat: Kehadiranmu senantiasa memberi kehangatan dan ketenangan.",
    icon: "☀️",
  },
  Merkurius: {
    size: 1.6,
    tex: "mercury.jpg",
    color: 0x9a938c,
    type: "Planet Terestrial // Sektor 1",
    diameter: "4.879 km",
    distance: "57,9 Juta km",
    temp: "-180 °C hingga +430 °C",
    orbitTime: "88 Hari Bumi",
    scienceFact:
      "Merkurius mengorbit dengan kecepatan rata-rata 47,4 km/detik, menjadikannya planet dengan revolusi tercepat. Karena tidak memiliki atmosfer tebal untuk menahan panas, fluktuasi suhunya merupakan yang paling ekstrem.",
    reflectionNote:
      "Di planet dengan laju revolusi tercepat ini, kita tersadar betapa berharganya setiap momen. Waktu selalu terasa berlalu begitu cepat saat kita berbagi cerita dan tawa.",
    q: "Mengapa perputaran waktu terasa begitu singkat saat kita berbincang?",
    a1: "Pengaruh kecepatan revolusi orbital",
    a2: "Karena setiap percakapan bersamamu selalu terasa nyaman dan berharga",
    correct: 2,
    msg: "Catatan terverifikasi: Setiap detik yang kita lalui bersama adalah waktu yang bermakna.",
    icon: "🪨",
  },
  Venus: {
    size: 2.2,
    tex: "venus.jpg",
    color: 0xd8b98a,
    type: "Bintang Kejora // Sektor 2",
    diameter: "12.104 km",
    distance: "108,2 Juta km",
    temp: "465 °C",
    orbitTime: "225 Hari Bumi",
    scienceFact:
      "Venus merupakan objek alami paling terang di langit malam setelah Bulan. Lapisan awan tebalnya memantulkan sebagian besar sinar matahari. Venus juga berotasi secara retrograde dari timur ke barat secara perlahan.",
    reflectionNote:
      "Venus dikenal sebagai permata yang paling bercahaya di cakrawala malam. Namun bagi saya, ketulusan budi dan binar senyumanmu adalah keindahan sejati yang paling menyejukkan hati.",
    q: "Di antara fenomena visual di cakrawala malam, hal apakah yang paling menyejukkan pandangan?",
    a1: "Luminansi atmosfer Venus",
    a2: "Senyuman tulus dan ketenangan dari Nana",
    correct: 2,
    msg: "Observasi terverifikasi: Ketulusan hatimu adalah pemandangan terindah di semesta ini.",
    icon: "✨",
  },
  Bumi: {
    size: 2.4,
    tex: "earth.jpg",
    color: 0x3f6fae,
    moon: true,
    type: "Oasis Biosfer // Sektor 3",
    diameter: "12.742 km",
    distance: "149,6 Juta km (1.00 AU)",
    temp: "15 °C",
    orbitTime: "365,25 Hari",
    scienceFact:
      "Bumi adalah satu-satunya oasis kehidupan yang diketahui memiliki air cair stabil dan atmosfer kaya oksigen-nitrogen. Gravitasi Bulan menjaga kemiringan sumbu rotasi Bumi pada 23,5° sehingga iklim tetap stabil.",
    reflectionNote:
      "Di antara bentangan luas semesta dan miliaran kemungkinan di planet biru ini, dipertemukan dan berjalan beriringan denganmu adalah anugerah terindah yang selalu saya syukuri.",
    q: "Di manakah titik koordinat tempat hati merasa paling tenang dan berlabuh?",
    a1: "Pusat Observatorium Antariksa",
    a2: "Di dekat Nana, tempat di mana rasa syukur selalu hadir",
    correct: 2,
    msg: "Koordinat terkunci: Bersamamu adalah tempat di mana ketenangan selalu bermula.",
    icon: "🌍",
  },
  Mars: {
    size: 1.8,
    tex: "mars.jpg",
    color: 0xb1543a,
    type: "Planet Merah // Sektor 4",
    diameter: "6.779 km",
    distance: "227,9 Juta km",
    temp: "-60 °C",
    orbitTime: "687 Hari Bumi",
    scienceFact:
      "Mars memiliki Olympus Mons, gunung berapi perisai setinggi 21,9 km yang merupakan gunung tertinggi di tata surya. Warna kemerahannya berasal dari kandungan besi oksida di permukaannya.",
    reflectionNote:
      "Warna merah Mars melambangkan keteguhan dan daya juang. Saya akan selalu ada di sampingmu untuk mendukung setiap langkah, cita-cita, dan impian besar yang sedang kamu perjuangkan.",
    q: "Seberapa tinggi harapan dan dukungan yang senantiasa dipanjatkan untuk langkahmu ke depan?",
    a1: "Setinggi puncak gunung Olympus Mons",
    a2: "Melampaui luasnya horizon semesta",
    correct: 2,
    msg: "Catatan terverifikasi: Doa dan dukungan terbaik selalu menyertai setiap langkahmu.",
    icon: "🔴",
  },
  Yupiter: {
    size: 4.3,
    tex: "jupiter.jpg",
    color: 0xcaa87a,
    type: "Raksasa Gas // Sektor 5",
    diameter: "139.820 km",
    distance: "778,5 Juta km",
    temp: "-110 °C",
    orbitTime: "11,86 Tahun Bumi",
    scienceFact:
      "Jupiter memiliki massa lebih dari dua kali lipat gabungan seluruh planet lainnya. Medan gravitasi raksasanya berfungsi sebagai perisai alami yang menyerap dan membelokkan lintasan komet dari tata surya bagian dalam.",
    reflectionNote:
      "Sebagaimana peran Jupiter yang menjaga keseimbangan tata surya, saya berikhtiar untuk selalu menjadi pendengar yang baik, pelindung yang setia, dan ruang aman bagimu untuk bercerita apa adanya.",
    q: "Sebesar apa komitmen untuk menjaga dan mendampingi perjalanan ini?",
    a1: "Sebesar kapasitas planet Jupiter",
    a2: "Tak terhingga, melampaui batas ruang dan waktu",
    correct: 2,
    msg: "Observasi tervalidasi: Komitmen dan ketulusan ini akan selalu terjaga utuh untukmu.",
    icon: "🪐",
  },
  Saturnus: {
    size: 3.6,
    tex: "saturn.jpg",
    color: 0xd9c39a,
    ring: true,
    type: "Permata Bermahkota // Sektor 6",
    diameter: "116.460 km",
    distance: "1,43 Miliar km",
    temp: "-140 °C",
    orbitTime: "29,45 Tahun Bumi",
    scienceFact:
      "Sistem cincin spektakuler Saturnus membentang hingga 282.000 km namun ketebalannya rata-rata hanya 10 meter. Cincin ini tersusun atas miliaran partikel es murni dan batuan dengan Celah Cassini yang terbentuk secara presisi.",
    reflectionNote:
      "Cincin Saturnus yang melingkar anggun dan harmonis mencerminkan komitmen ketulusan. Keindahan sejati bukanlah hal yang dibuat-buat, melainkan lahir dari keselarasan dan kesetiaan.",
    q: "Nilai apakah yang paling utama dalam menjaga keharmonisan perjalanan kita?",
    a1: "Keteraturan gravitasi kosmik",
    a2: "Kejujuran, saling menghargai, dan ketulusan hati yang konsisten",
    correct: 2,
    msg: "Kunci orbit terverifikasi: Ketulusan dan rasa saling menghargai adalah pondasi terindah.",
    icon: "👑",
  },
  Uranus: {
    size: 2.9,
    tex: "uranus.jpg",
    color: 0x9fd0d6,
    type: "Raksasa Es // Sektor 7",
    diameter: "50.724 km",
    distance: "2,87 Miliar km",
    temp: "-224 °C",
    orbitTime: "84 Tahun Bumi",
    scienceFact:
      "Uranus memiliki keunikan poros rotasi dengan kemiringan 97,8° sehingga tampak menggelinding pada bidang orbitnya. Keberadaan gas metana pada atmosfer atasnya menyerap spektrum merah dan menghasilkan rona biru kehijauan yang tenang.",
    reflectionNote:
      "Keunikan Uranus mengingatkan kita bahwa setiap pribadi memiliki keistimewaan tersendiri. Kepribadianmu yang ceria, tulus, dan apa adanya selalu berhasil membawa keteduhan dalam hari-hari saya.",
    q: "Hal apakah yang senantiasa membawa keteduhan dan warna dalam keseharian?",
    a1: "Spektrum warna atmosfer Uranus",
    a2: "Kebaikan budi, kejernihan hati, dan tawa tulus dari Nana",
    correct: 2,
    msg: "Data terverifikasi: Kebaikan dan ketulusanmu adalah anugerah yang sangat berharga.",
    icon: "💎",
  },
  Neptunus: {
    size: 2.8,
    tex: "neptune.jpg",
    color: 0x3d5ce0,
    type: "Gerbang Azure // Sektor 8",
    diameter: "49.244 km",
    distance: "4,50 Miliar km",
    temp: "-218 °C",
    orbitTime: "164,8 Tahun Bumi",
    scienceFact:
      "Sebagai planet terjauh dalam sistem tata surya, Neptunus memiliki angin supersonik tercepat yang mencapai 2.100 km/jam. Planet ini ditemukan melalui perhitungan presisi matematika sebelum diamati secara langsung oleh teleskop.",
    reflectionNote:
      "Berada di batas terluar ekspedisi tata surya ini membuktikan bahwa sejauh apa pun bentangan jarak, niat tulus dan kepedulian yang mendalam akan selalu menemukan jalannya untuk saling terhubung.",
    q: "Hal apakah yang mampu melintasi jarak miliaran kilometer tanpa batas?",
    a1: "Gelombang radio frekuensi tinggi",
    a2: "Ketulusan doa, rasa syukur, dan penghargaan tulus dari hati",
    correct: 2,
    msg: "Seluruh 9 Sektor Planet Selesai Dipindai! Sinyal transmisi rahasia terenkripsi terdeteksi...",
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

  const audioCtxRef = useRef<AudioContext | null>(null);

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
        osc.frequency.setValueAtTime(2200, now);
        osc.frequency.setValueAtTime(1100, now + 0.05);
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
        osc.frequency.exponentialRampToValueAtTime(550, now + 0.35);
        osc.frequency.exponentialRampToValueAtTime(40, now + 1.2);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      } else if (type === "scan_sonar") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);
        gain.gain.setValueAtTime(0.1, now);
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
          gain.gain.setValueAtTime(0.14, now + i * 0.07);
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
          topic: activeTab === "telemetry" ? "Observasi Fisika & Astronomi" : "Refleksi Perjalanan & Makna Keteraturan Semesta",
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setCopilotResponse(data.reply);
        playSfx("correct");
      } else {
        setCopilotResponse(data.error || "Sinyal radio terganggu medan radiasi kosmik. Silakan ulangi sejenak lagi.");
      }
    } catch {
      setCopilotResponse("A.R.I.A: Seluruh parameter navigasi dalam kondisi optimal, Nana. Semoga perjalanan ini membawa ketenangan dan wawasan berharga.");
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
        audioBtn.textContent = "COMM: AKTIF 📡";
      } else {
        bgm.pause();
        audioBtn.textContent = "COMM: SENYAP 🔇";
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

    // STARFIELD
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

    // WARP LINES
    const warpCount = 600;
    const warpGeo = new THREE.BufferGeometry();
    const warpPositions = new Float32Array(warpCount * 6);

    for (let i = 0; i < warpCount; i++) {
      const x = (Math.random() - 0.5) * 120;
      const y = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 200;
      warpPositions[i * 6] = x;
      warpPositions[i * 6 + 1] = y;
      warpPositions[i * 6 + 2] = z;
      warpPositions[i * 6 + 3] = x;
      warpPositions[i * 6 + 4] = y;
      warpPositions[i * 6 + 5] = z - 2;
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

    // SCANNER RING
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

    // FIREWORKS
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

    // SATURN RING TEXTURE
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

    // 3D BODIES
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

      gsap.to(warpMat, { opacity: 0.8, duration: 0.3, yoyo: true, repeat: 1 });
      setWarpSpeedDisplay("WARP 8.5 AU/s ⚡");

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
          setWarpSpeedDisplay("ORBIT STABIL ⚓");
        },
      });

      setActivePlanetName(name);
    }

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
          quizResult.textContent = `✨ ${d.msg} (Stempel Observasi ${activeKey} Berhasil Disimpan!)`;
          playSfx("correct");
          openedState[activeKey] = true;
          setOpenedPlanets({ ...openedState });

          // THE GRAND SURPRISE REVEAL (Unlocked only after exploring all 9 planets)
          if (Object.keys(openedState).length === ORDER.length) {
            setTimeout(() => {
              quizModal?.classList.remove("show");
              finaleEl?.classList.add("show");
              playSfx("celebrate");
            }, 2500);
          }
        } else {
          quizResult.textContent = `Pilihan yang baik, mari kita kalibrasi observasi kembali: "${d.msg}"`;
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

      {/* ASTRONAUT HELMET VISOR HUD */}
      <div id="visor-overlay"></div>
      <div id="visor-glare"></div>

      {/* TOP STATUS BAR */}
      <div className="flight-header">
        <div className="mission-callsign">
          <div className="astronaut-badge">
            <span className="pilot-status-dot"></span>
            PENJELAJAH: NANA // EKSPEDISI TATA SURYA
          </div>
        </div>

        <div className="flight-actions">
          <button
            className="hud-btn copilot-btn"
            onClick={() => setShowCopilot(true)}
            title="Buka Komunikasi Asisten Navigasi A.R.I.A"
          >
            🎙️ ASISTEN A.R.I.A
          </button>
          <button
            className="hud-btn"
            onClick={() => setShowPassport(true)}
            title="Buka Log Catatan Penjelajahan"
          >
            ⭐ STEMPEL: {Object.keys(openedPlanets).length}/9
          </button>
          <button id="audio-btn" className="hud-btn" title="Toggle Audio Radio">
            COMM: SENYAP 🔇
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

      {/* TARGET RETICLE */}
      <div className={`target-reticle-wrap ${isScanning ? "scanning" : ""}`}>
        <div className="reticle-corner corner-tl"></div>
        <div className="reticle-corner corner-tr"></div>
        <div className="reticle-corner corner-bl"></div>
        <div className="reticle-corner corner-br"></div>
        <div className="reticle-label">
          {isScanning ? "MEMINDAI SEKTOR..." : `OBSERVASI: ${activePlanetName}`}
        </div>
      </div>

      {/* WARP SPEEDOMETER */}
      <div className="warp-gauge">
        <span className="warp-status">STATUS ORBIT:</span>
        <span className="warp-speed">{warpSpeedDisplay}</span>
      </div>

      {/* LOADER */}
      <div id="loader">
        <div style={{ color: "var(--hud-cyan)", fontSize: "11px", letterSpacing: "2px", fontWeight: 600 }}>
          MENYELARASKAN SISTEM OBSERVASI & SENSOR OPTIK...
        </div>
        <div className="loader-bar">
          <div className="loader-fill" id="loader-fill"></div>
        </div>
      </div>

      {/* INITIAL GATE SCREEN (SURPRISE KEPT SECRET: PURE ASTRONOMY DISCOVERY BRIEFING) */}
      <div id="gate">
        <div className="gate-inner">
          <div className="gate-badge">🪐 OBSERVATORIUM TATA SURYA // KHUSUS UNTUK NANA 🚀</div>
          <h1 className="gate-title">
            Ekspedisi Antariksa
            <br />
            <em>Menjelajahi Tata Surya</em>
          </h1>
          <p className="gate-sub">
            Selamat datang di simulator observasi antariksa. Kamu dapat menavigasi dan menjelajahi sembilan objek tata surya, mengamati fenomena fisika astronomi nyata, dan mengumpulkan catatan ilmiah dari setiap sektor orbit.
          </p>

          <button className="gate-btn" id="gate-btn">
            MULAI PENJELAJAHAN ANTARIKSA 🚀
          </button>
          <div className="gate-hint">🎧 Disarankan menyalakan audio untuk pengalaman observasi yang lebih imersif</div>
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
                🔭 Data Sains
              </button>
              <button
                className={`tab-btn ${activeTab === "log" ? "active" : ""}`}
                onClick={() => setActiveTab("log")}
              >
                📝 Catatan Refleksi
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
                  <div className="telemetry-label">PERIODE ORBIT</div>
                  <div className="telemetry-val">{currentPlanetData.orbitTime}</div>
                </div>
              </div>
              <p className="flight-desc">{currentPlanetData.scienceFact}</p>
            </div>
          ) : (
            <div>
              <p className="flight-desc love-log">{currentPlanetData.reflectionNote}</p>
            </div>
          )}
        </div>

        <div className="flight-controls-row">
          <button className="thruster-btn" id="prev-thruster-btn" title="Navigasi ke Planet Sebelumnya">
            ‹
          </button>
          <button
            className={`scan-action-btn ${isCurrentOpened ? "scanned" : ""}`}
            id="deep-scan-btn"
          >
            {isCurrentOpened
              ? `✓ DATA ${activePlanetName} TERVERIFIKASI • BACA LAGI`
              : `📡 JALANKAN PEMINDAIAN DATA ${activePlanetName}`}
          </button>
          <button className="thruster-btn" id="next-thruster-btn" title="Navigasi ke Planet Berikutnya">
            ›
          </button>
        </div>
      </div>

      {/* AI CO-PILOT A.R.I.A MODAL */}
      <div id="copilot-modal" className={showCopilot ? "show" : ""}>
        <div className="copilot-terminal">
          <div className="terminal-header">
            <div className="terminal-title">🎙️ ASISTEN OBSERVASI A.R.I.A</div>
            <div className="terminal-id">ASISTEN NAVIGASI & REFLEKSI SEMESTA</div>
          </div>

          <div className="copilot-chips-row">
            <button
              className="copilot-chip"
              onClick={() => askCopilot(`Bagaimana keteraturan fisika dan keunikan planet ${activePlanetName} dapat memberi refleksi yang bermakna bagi kehidupan kita?`)}
            >
              🪐 Refleksi Sains Planet {activePlanetName}
            </button>
            <button
              className="copilot-chip"
              onClick={() => askCopilot("Ceritakan pandanganmu mengenai keteraturan hukum gravitasi dan keharmonisan alam semesta ini.")}
            >
              🌌 Keteraturan & Gravitasi Kosmik
            </button>
            <button
              className="copilot-chip"
              onClick={() => askCopilot("Berikan satu pesan penutup yang menenangkan dan penuh apresiasi untuk perjalanan eksplorasi hari ini.")}
            >
              ✨ Pesan Apresiasi Perjalanan
            </button>
          </div>

          <div className="terminal-input-box">
            <input
              type="text"
              className="terminal-input"
              placeholder="Tanyakan hal seputar sains atau refleksi perjalanan kepada A.R.I.A..."
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askCopilot()}
            />
            <button
              className="terminal-send-btn"
              onClick={() => askCopilot()}
              disabled={copilotLoading}
            >
              {copilotLoading ? "..." : "KIRIM 📡"}
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
              TUTUP ASISTEN
            </button>
          </div>
        </div>
      </div>

      {/* QUIZ / SCANNER RESULT MODAL */}
      <div id="quiz-modal">
        <div className="scanner-box">
          <div className="scanner-eyebrow">📡 PEMINDAIAN DATA SEKTOR // KALIBRASI OBSERVASI</div>
          <div className="scanner-prompt" id="q-text">
            Menganalisis parameter...
          </div>
          <div>
            <button className="quiz-option-btn" id="ans-1">
              Opsi Observasi A
            </button>
            <button className="quiz-option-btn" id="ans-2">
              Opsi Observasi B
            </button>
          </div>
          <div id="quiz-result"></div>
          <button className="generic-close-btn" id="close-quiz">
            LANJUTKAN PENJELAJAHAN
          </button>
        </div>
      </div>

      {/* PASSPORT MODAL */}
      <div id="passport-modal" className={showPassport ? "show" : ""}>
        <div className="passport-card">
          <div style={{ textAlign: "center", marginBottom: "14px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--hud-gold)", letterSpacing: "1px" }}>
              📔 LOG CATATAN PENJELAJAHAN
            </h2>
            <p style={{ fontSize: "11px", color: "#94a3b8" }}>
              PENJELAJAH: NANA — 9 STEMPEL OBSERVASI SEKTOR TATA SURYA
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
              TUTUP LOG
            </button>
          </div>
        </div>
      </div>

      {/* GRAND SURPRISE FINALE (REVEALED ONLY AT THE VERY END) */}
      <div id="finale">
        <div className="finale-inner">
          <div className="finale-eyebrow">✨ TRANSMISI RAHASIA TERBUKA • SPESIAL 10 SEPTEMBER 🎂</div>
          <h2 className="finale-title">
            Selamat Ulang Tahun,
            <br />
            <span>Nana.</span>
          </h2>

          <div className="cake-wrapper">
            <div id="candle-trigger" className="candle-container" title="Klik untuk memanjatkan doa & harapan">
              <div id="flame-el" className={`flame ${candleBlown ? "blown" : ""}`}></div>
              <div className="candle-stick"></div>
            </div>
            <div className="wish-instruction">
              {candleBlown
                ? "✨ Semoga seluruh doa dan harapan baikmu senantiasa dikabulkan. ⭐"
                : "🕯️ Klik lilin ini untuk memanjatkan doa dan harapan terbaikmu"}
            </div>
          </div>

          <div className="birthday-letter-box">
            <div className="letter-heading">
              Kepada: Nana 💌
            </div>
            <div className="letter-body">
              <p>
                Selamat bertambah usia pada tanggal <strong>10 September</strong> ini.
              </p>
              <p>
                Terima kasih sudah hadir dan senantiasa membawa kehangatan, ketenangan, serta warna yang begitu berarti dalam kehidupan saya. Ekspedisi tata surya ini dibuat khusus untukmu—sebagai pengingat bahwa di antara luasnya semesta, kehadiranmu adalah anugerah yang sangat saya syukuri.
              </p>
              <p>
                Semoga di usia yang baru ini, kamu senantiasa dianugerahi kesehatan, kemudahan dalam setiap urusan, kedamaian di hati, serta tercapainya segala hal baik yang kamu cita-citakan.
              </p>
              <p>
                Sejauh apa pun kita melangkah, ketahuilah bahwa saya akan selalu siap mendampingi, mendukung, dan berjalan bersamamu di setiap fase kehidupan.
              </p>
              <div className="letter-signature">Dengan segenap rasa syukur dan ketulusan hati.</div>
            </div>
          </div>

          <div className="certificate-badge">
            🏆 <strong>Piagam Apresiasi Semesta:</strong> Diberikan kepada <strong>NANA</strong> atas keberhasilan menyelesaikan Ekspedisi 9 Sektor Tata Surya. Terima kasih telah menjadi sosok yang begitu istimewa.
          </div>

          <button className="finale-btn" id="replay-btn">
            Jelajahi Semesta Lagi 🚀
          </button>
        </div>
      </div>
    </>
  );
}
