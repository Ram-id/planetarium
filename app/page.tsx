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
    type: "Bintang Induk",
    diameter: "1.392.700 km",
    distance: "Pusat Tata Surya",
    temp: "~5.500 °C",
    orbitTime: "230 Juta Thn",
    scienceFact:
      "Matahari menyumbang 99,86% massa seluruh tata surya! Fusi nuklir di intinya mengubah 600 juta ton hidrogen menjadi helium setiap detik, memancarkan cahaya yang sampai ke Bumi dalam 8 menit 20 detik.",
    loveNote:
      "Seperti Matahari yang menjadi gravitasi dan penerang tata surya, kehadiranmu adalah pusat kehangatan dan kebahagiaan dalam hidupku, my sunshine Nana.",
    q: "Berapa lama cahaya dari pusat kehangatan ini butuh untuk sampai menerangi duniaku?",
    a1: "8 Menit 20 Detik",
    a2: "Seketika sejak pertama kali kenal Nana",
    correct: 2,
    msg: "Tepat sekali! Hadirmu seketika menghangatkan seluruh hariku, my sunshine.",
    icon: "☀️",
  },
  Merkurius: {
    size: 1.6,
    tex: "mercury.jpg",
    color: 0x9a938c,
    type: "Planet Terestrial",
    diameter: "4.879 km",
    distance: "57,9 Juta km",
    temp: "-180 °C s/d 430 °C",
    orbitTime: "88 Hari",
    scienceFact:
      "Merkurius melesat di orbitnya secepat 47 km/detik! Tanpa atmosfer tebal untuk menahan panas, suhu di permukaannya mengalami fluktuasi paling ekstrem di tata surya.",
    loveNote:
      "Di planet yang revolusinya tercepat ini, aku belajar bahwa waktu terasa melesat begitu kilat saat bersamamu. Setiap detik bersamamu adalah hadiah terbaik.",
    q: "Kenapa waktu selalu terasa berputar secepat orbit Merkurius?",
    a1: "Karena kecepatan kosmik semesta",
    a2: "Karena kalau sama Nana, 24 jam nggak pernah cukup",
    correct: 2,
    msg: "Satu hari nggak pernah terasa cukup kalau lagi cerita dan tertawa sama kamu, my love.",
    icon: "🪨",
  },
  Venus: {
    size: 2.2,
    tex: "venus.jpg",
    color: 0xd8b98a,
    type: "Bintang Kejora",
    diameter: "12.104 km",
    distance: "108,2 Juta km",
    temp: "465 °C",
    orbitTime: "225 Hari",
    scienceFact:
      "Venus adalah objek paling terang di langit malam setelah Bulan. Uniknya, Venus berotasi mundur dari timur ke barat sehingga 1 hari di Venus lebih lama dari 1 tahunnya!",
    loveNote:
      "Venus dijuluki planet paling berkilau di angkasa, tapi bagiku, binar mata dan senyuman tulus Nana adalah pemandangan terindah di alam semesta.",
    q: "Apa objek paling berkilau dan mempesona di semesta ini?",
    a1: "Planet Venus di langit senja",
    a2: "Senyuman manis Nana",
    correct: 2,
    msg: "Bahkan seluruh bintang di galaksi kalah indah dari senyumanmu, my sweetheart.",
    icon: "✨",
  },
  Bumi: {
    size: 2.4,
    tex: "earth.jpg",
    color: 0x3f6fae,
    moon: true,
    type: "Oasis Kehidupan",
    diameter: "12.742 km",
    distance: "149,6 Juta km",
    temp: "15 °C",
    orbitTime: "365,25 Hari",
    scienceFact:
      "Bumi adalah satu-satunya oasis kehidupan yang dikenal. Bulan yang setia menstabilkan poros rotasinya menciptakan iklim yang harmonis untuk miliaran makhluk hidup.",
    loveNote:
      "Dari 8 miliar manusia di planet biru yang indah ini, bersyukur tak terhingga takdir mempertemukan dan menyatukan aku dengan seseorang seistimewa kamu, Nana.",
    q: "Di antara miliaran kemungkinan di planet biru ini, apa takdir terindah bagiku?",
    a1: "Menjelajahi seluruh penjuru dunia",
    a2: "Bisa menemukan, mengenal, dan mencintai Nana",
    correct: 2,
    msg: "Karena sejauh apa pun aku melangkah, rumah tempat hatiku ingin pulang adalah kamu.",
    icon: "🌍",
  },
  Mars: {
    size: 1.8,
    tex: "mars.jpg",
    color: 0xb1543a,
    type: "Planet Merah",
    diameter: "6.779 km",
    distance: "227,9 Juta km",
    temp: "-60 °C",
    orbitTime: "687 Hari",
    scienceFact:
      "Mars memiliki gunung berapi tertinggi di tata surya, Olympus Mons (21,9 km, hampir 3x Everest!). Warna merahnya berasal dari kandungan oksida besi di permukaannya.",
    loveNote:
      "Warna merah Mars melambangkan api semangat dan keteguhan hati. Di usia barumu nanti, aku akan selalu berdiri di sampingmu, mendukung seluruh cita-citamu.",
    q: "Setinggi apa tekad dan doa yang kupanjatkan untuk kebahagiaan Nana di usia baru?",
    a1: "Setinggi puncak gunung Olympus Mons",
    a2: "Melampaui tingginya seluruh puncak di jagat raya",
    correct: 2,
    msg: "Doa terbaikku selalu memelukmu di setiap langkah, my beloved Nana.",
    icon: "🔴",
  },
  Yupiter: {
    size: 4.3,
    tex: "jupiter.jpg",
    color: 0xcaa87a,
    type: "Raksasa Gas",
    diameter: "139.820 km",
    distance: "778,5 Juta km",
    temp: "-110 °C",
    orbitTime: "11,86 Tahun",
    scienceFact:
      "Jupiter memiliki massa 2,5 kali gabungan seluruh planet lainnya! Gravitasinya yang luar biasa bertindak bagai perisai pelindung Bumi dari tabrakan komet berbahaya.",
    loveNote:
      "Sebagaimana Jupiter yang setia menjadi pelindung, aku ingin selalu menjadi tempat aman bagimu untuk bersandar, bercerita, dan merasa dihargai seutuhnya.",
    q: "Sebesar apa rasa sayang dan syukurku memiliki kamu di hidupku?",
    a1: "Sebesar planet raksasa Jupiter",
    a2: "Lebih luas dari seluruh kapasitas galaksi",
    correct: 2,
    msg: "Seluruh ruang di hatiku sudah terisi penuh olehmu, my sunshine.",
    icon: "🪐",
  },
  Saturnus: {
    size: 3.6,
    tex: "saturn.jpg",
    color: 0xd9c39a,
    ring: true,
    type: "Permata Bermahkota",
    diameter: "116.460 km",
    distance: "1,4 Miliar km",
    temp: "-140 °C",
    orbitTime: "29,45 Tahun",
    scienceFact:
      "Cincin spektakuler Saturnus membentang hingga 282.000 km dengan ketebalan hanya ~10 meter! Terbuat dari miliaran kristal es murni yang memantulkan cahaya matahari dengan memukau.",
    loveNote:
      "Cincin Saturnus yang melingkar abadi melambangkan komitmen dan ketulusan. Semoga di ulang tahun 10 September nanti, cinta dan kebersamaan kita selalu terjaga indah.",
    q: "Cincin Saturnus melingkar abadi, apa janji yang ingin kujaga untuk Nana?",
    a1: "Menjaga keteraturan orbit kosmik",
    a2: "Selalu setia menemani dan membahagiakanmu",
    correct: 2,
    msg: "Janji tulus dari lubuk hati terdalam, hanya untukmu Nana tersayang.",
    icon: "👑",
  },
  Uranus: {
    size: 2.9,
    tex: "uranus.jpg",
    color: 0x9fd0d6,
    type: "Raksasa Es",
    diameter: "50.724 km",
    distance: "2,87 Miliar km",
    temp: "-224 °C",
    orbitTime: "84 Tahun",
    scienceFact:
      "Uranus adalah satu-satunya planet yang berotasi menggelinding menyamping dengan kemiringan poros 98°! Gas metana di atmosfernya menyerap cahaya merah dan menghasilkan rona toska yang menenangkan.",
    loveNote:
      "Keunikan Uranus mengingatkanku pada kepribadianmu yang ceria, tulus, dan penuh warna. Kamu selalu berhasil membuat hari-hari biasa terasa begitu istimewa dan berwarna.",
    q: "Apa yang membuat hari-hari biasa terasa begitu berwarna dan ceria?",
    a1: "Spektrum warna atmosfer metana",
    a2: "Tingkah lucu, tawa manis, dan cerita hangat dari Nana",
    correct: 2,
    msg: "Tawamu selalu jadi obat paling ampuh untuk semua lelahku, my sweetheart.",
    icon: "💎",
  },
  Neptunus: {
    size: 2.8,
    tex: "neptune.jpg",
    color: 0x3d5ce0,
    type: "Gerbang Biru Terluar",
    diameter: "49.244 km",
    distance: "4,5 Miliar km",
    temp: "-218 °C",
    orbitTime: "164,8 Tahun",
    scienceFact:
      "Neptunus adalah planet terjauh yang memiliki badai angin tercepat di tata surya — melesat hingga 2.100 km/jam! Ditemukan melalui rumus matematika sebelum terlihat teleskop.",
    loveNote:
      "Meski berada di ujung terjauh tata surya, gravitasinya tetap terikat erat. Begitu pula kita — sejauh apa pun jarak atau kesibukan, hatiku selalu tertaut padamu.",
    q: "Apa yang melampaui batas jarak 4,5 miliar kilometer di tata surya ini?",
    a1: "Gelombang radio kosmik",
    a2: "Ketulusan cinta dan doa untuk Nana di hari ulang tahunnya",
    correct: 2,
    msg: "Selamat ulang tahun Nana tersayang, penjelajahan semesta kita kini lengkap!",
    icon: "🌊",
  },
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialized = useRef(false);

  const [activeTab, setActiveTab] = useState<"science" | "love">("science");
  const [openedPlanets, setOpenedPlanets] = useState<Record<string, boolean>>({});
  const [activePlanetName, setActivePlanetName] = useState<PlanetName>("Matahari");
  const [showPassport, setShowPassport] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  const [oracleInput, setOracleInput] = useState("");
  const [oracleResponse, setOracleResponse] = useState("");
  const [oracleLoading, setOracleLoading] = useState(false);
  const [candleBlown, setCandleBlown] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const playTone = (type: "twinkle" | "correct" | "celebrate" | "blow") => {
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
      if (type === "twinkle") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "correct") {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.15, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.4);
        });
      } else if (type === "celebrate" || type === "blow") {
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

  const askCosmicOracle = async (customPrompt?: string) => {
    const query = customPrompt || oracleInput;
    if (!query) return;
    setOracleLoading(true);
    setOracleResponse("");
    playTone("twinkle");

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          planet: activePlanetName,
          topic: activeTab === "science" ? "Fakta Sains & Keajaiban Semesta" : "Cinta & Doa Ulang Tahun",
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setOracleResponse(data.reply);
        playTone("correct");
      } else {
        setOracleResponse(data.error || "Bintang-bintang sedang memancarkan frekuensinya. Coba lagi sebentar lagi.");
      }
    } catch {
      setOracleResponse("Semesta berbisik lembut bahwa kamu adalah hal paling berharga di dunia ini.");
    } finally {
      setOracleLoading(false);
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
        audioBtn.textContent = "🎵";
      } else {
        bgm.pause();
        audioBtn.textContent = "🔇";
      }
      isPlaying = play;
    }
    audioBtn?.addEventListener("click", () => setAudio(!isPlaying));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 4000);
    camera.position.set(0, 4, 150);

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
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 10;
    controls.maxDistance = 65;
    controls.target.set(0, 4, 0);
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.35;

    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambient);
    const sunLight = new THREE.PointLight(0xffeedd, 3.5, 500, 1.2);
    sunLight.position.set(0, 4, 0);
    scene.add(sunLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(20, 30, 20);
    scene.add(keyLight);

    const loaderEl = document.getElementById("loader");
    const loaderFill = document.getElementById("loader-fill");
    const loaderPct = document.getElementById("loader-pct");
    let loadingDone = false;

    const manager = new THREE.LoadingManager();
    manager.onProgress = (_url, loaded, total) => {
      const pct = total ? Math.min(100, Math.round((loaded / total) * 100)) : 100;
      if (loaderFill) loaderFill.style.width = pct + "%";
      if (loaderPct) loaderPct.textContent = pct + "%";
    };
    manager.onLoad = () => revealGate();
    const texLoader = new THREE.TextureLoader(manager);

    function revealGate() {
      if (loadingDone) return;
      loadingDone = true;
      if (loaderFill) loaderFill.style.width = "100%";
      if (loaderPct) loaderPct.textContent = "100%";
      setTimeout(() => {
        loaderEl?.classList.add("hide");
      }, 300);
    }
    const fallbackTimeout = setTimeout(revealGate, 3500);

    const createStarfield = () => {
      const starCount = 6000;
      const starGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);

      const colorPalette = [
        new THREE.Color(0xa5c4ff),
        new THREE.Color(0xf8f9fa),
        new THREE.Color(0xfff4d6),
        new THREE.Color(0xffd29d),
        new THREE.Color(0xffb8c6),
        new THREE.Color(0x99f6ff),
      ];

      for (let i = 0; i < starCount; i++) {
        const r = 400 + Math.random() * 1200;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.cos(phi);
        positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

        const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = chosenColor.r;
        colors[i * 3 + 1] = chosenColor.g;
        colors[i * 3 + 2] = chosenColor.b;

        sizes[i] = 1.0 + Math.random() * 2.5;
      }

      starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      starGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.25, "rgba(255, 255, 255, 0.8)");
        grad.addColorStop(0.6, "rgba(255, 255, 255, 0.2)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      const starTex = new THREE.CanvasTexture(canvas);

      const starMat = new THREE.PointsMaterial({
        size: 1.8,
        vertexColors: true,
        map: starTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      return new THREE.Points(starGeo, starMat);
    };

    const starfieldMesh = createStarfield();
    scene.add(starfieldMesh);

    const nebulaCount = 20;
    const nebulaGroup = new THREE.Group();
    for (let i = 0; i < nebulaCount; i++) {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        const hue = i % 2 === 0 ? "280, 70%, 60%" : "200, 80%, 55%";
        grad.addColorStop(0, `hsla(${hue}, 0.18)`);
        grad.addColorStop(0.5, `hsla(${hue}, 0.06)`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);
      }
      const nebTex = new THREE.CanvasTexture(canvas);
      const nebMat = new THREE.SpriteMaterial({
        map: nebTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.7,
      });
      const sprite = new THREE.Sprite(nebMat);
      const dist = 300 + Math.random() * 400;
      const angle = (i / nebulaCount) * Math.PI * 2;
      sprite.position.set(
        Math.cos(angle) * dist,
        (Math.random() - 0.5) * 200,
        Math.sin(angle) * dist
      );
      sprite.scale.set(180 + Math.random() * 120, 180 + Math.random() * 120, 1);
      nebulaGroup.add(sprite);
    }
    scene.add(nebulaGroup);

    const meteorCount = 8;
    const meteors: { mesh: THREE.Line; speed: number; reset: () => void }[] = [];
    for (let i = 0; i < meteorCount; i++) {
      const mGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-18, -8, -18),
      ]);
      const mMat = new THREE.LineBasicMaterial({
        color: 0xffeedd,
        transparent: true,
        opacity: 0,
      });
      const line = new THREE.Line(mGeo, mMat);
      const reset = () => {
        line.position.set(
          (Math.random() - 0.5) * 500,
          100 + Math.random() * 200,
          (Math.random() - 0.5) * 500
        );
        mMat.opacity = 0.5 + Math.random() * 0.5;
      };
      reset();
      scene.add(line);
      meteors.push({ mesh: line, speed: 1.8 + Math.random() * 1.8, reset });
    }

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
      const speed = 0.3 + Math.random() * 0.9;
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
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const fireworkPoints = new THREE.Points(fireworkGeo, fireworkMat);
    fireworkPoints.position.set(0, 4, 0);
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

    const group3D: Record<string, THREE.Group> = {};
    const basePositions: Record<PlanetName, [number, number, number]> = {
      Matahari: [0, 4, 0],
      Merkurius: [18, 4, 0],
      Venus: [28, 4, 0],
      Bumi: [40, 4, 0],
      Mars: [52, 4, 0],
      Yupiter: [68, 4, 0],
      Saturnus: [86, 4, 0],
      Uranus: [104, 4, 0],
      Neptunus: [122, 4, 0],
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

    function selectPlanet(name: PlanetName) {
      if (isTransitioning) return;
      activeKey = name;
      playTone("twinkle");

      const grp = group3D[name];
      const pData = DATA[name];
      const targetPos = grp.position;

      isTransitioning = true;
      const camOffset = pData.size * 3.8 + 9;

      gsap.to(controls.target, {
        x: targetPos.x,
        y: targetPos.y + 0.5,
        z: targetPos.z,
        duration: 1.4,
        ease: "power2.inOut",
      });
      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y + 2.2,
        z: targetPos.z + camOffset,
        duration: 1.4,
        ease: "power2.inOut",
        onComplete: () => {
          isTransitioning = false;
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

    function openQuiz() {
      const d = DATA[activeKey];
      if (qText) qText.textContent = d.q;
      if (ans1) {
        ans1.textContent = d.a1;
        ans1.style.display = "block";
        ans1.onclick = () => handleAnswer(1);
      }
      if (ans2) {
        ans2.textContent = d.a2;
        ans2.style.display = "block";
        ans2.onclick = () => handleAnswer(2);
      }
      if (quizResult) quizResult.style.display = "none";
      if (closeQuiz) closeQuiz.style.display = "none";
      quizModal?.classList.add("show");
    }

    function handleAnswer(choice: number) {
      const d = DATA[activeKey];
      if (quizResult) {
        quizResult.style.display = "block";
        if (choice === d.correct) {
          quizResult.textContent = `✨ ${d.msg} (Stempel Bintang ${activeKey} Berhasil Dikoleksi!)`;
          playTone("correct");
          openedState[activeKey] = true;
          setOpenedPlanets({ ...openedState });

          if (Object.keys(openedState).length === ORDER.length) {
            setTimeout(() => {
              quizModal?.classList.remove("show");
              finaleEl?.classList.add("show");
              playTone("celebrate");
            }, 2500);
          }
        } else {
          quizResult.textContent = `Pilihan manis, tapi coba renungkan lagi: "${d.msg}"`;
        }
      }
      if (closeQuiz) closeQuiz.style.display = "block";
    }

    closeQuiz?.addEventListener("click", () => {
      quizModal?.classList.remove("show");
    });

    document.getElementById("open-quiz-trigger")?.addEventListener("click", openQuiz);
    document.getElementById("prev-planet-btn")?.addEventListener("click", () => {
      const idx = ORDER.indexOf(activeKey);
      const nextIdx = (idx - 1 + ORDER.length) % ORDER.length;
      selectPlanet(ORDER[nextIdx]);
    });
    document.getElementById("next-planet-btn")?.addEventListener("click", () => {
      const idx = ORDER.indexOf(activeKey);
      const nextIdx = (idx + 1) % ORDER.length;
      selectPlanet(ORDER[nextIdx]);
    });

    document.getElementById("gate-btn")?.addEventListener("click", () => {
      document.getElementById("gate")?.classList.add("hide");
      setAudio(true);
      selectPlanet("Matahari");
    });

    document.getElementById("replay-btn")?.addEventListener("click", () => {
      finaleEl?.classList.remove("show");
      selectPlanet("Matahari");
    });

    const candleBox = document.getElementById("candle-trigger");
    const flameEl = document.getElementById("flame-el");
    candleBox?.addEventListener("click", () => {
      flameEl?.classList.add("blown");
      setCandleBlown(true);
      playTone("blow");
      trigger3DFireworks();
    });

    let animFrameId: number;
    const clock = new THREE.Clock();

    function animate() {
      animFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      starfieldMesh.rotation.y = t * 0.005;
      nebulaGroup.rotation.y = -t * 0.003;

      meteors.forEach((m) => {
        m.mesh.position.x += m.speed * 1.5;
        m.mesh.position.y -= m.speed * 0.7;
        m.mesh.position.z += m.speed * 1.5;
        if (m.mesh.position.y < -120) m.reset();
      });

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
      <div id="grain"></div>
      <div id="vignette"></div>

      {/* TOP NAVIGATION BAR */}
      <div className="top-nav">
        <div className="top-brand">
          <div className="brand-badge">🪐 Starlight Observatory for Nana 🎂</div>
        </div>

        <div className="top-actions">
          <button
            className="glow-btn oracle-btn"
            onClick={() => setShowOracle(true)}
            title="Tanya AI Bintang (Cosmic Oracle)"
          >
            ✨ Tanya Bintang
          </button>
          <button
            className="glow-btn"
            onClick={() => setShowPassport(true)}
            title="Buka Paspor Penjelajah Kosmik Nana"
          >
            ⭐ Paspor: {Object.keys(openedPlanets).length}/9
          </button>
          <button id="audio-btn" className="icon-circle-btn" title="Musik Latar">
            🔇
          </button>
        </div>
      </div>

      {/* TOP MINI PROGRESS DOTS */}
      <div className="planet-dots-bar">
        {ORDER.map((name) => (
          <button
            key={name}
            className={`prog-dot ${openedPlanets[name] ? "opened" : ""} ${
              name === activePlanetName ? "current" : ""
            }`}
            onClick={() => setActivePlanetName(name)}
            title={`${name} (${DATA[name].type})`}
          />
        ))}
      </div>

      {/* LOADER */}
      <div id="loader">
        <div className="loader-title">Menyusun Semesta Bintang</div>
        <div className="loader-bar">
          <div className="loader-fill" id="loader-fill"></div>
        </div>
        <div className="loader-pct" id="loader-pct">
          0%
        </div>
      </div>

      {/* GATE SCREEN */}
      <div id="gate">
        <div className="gate-inner">
          <div className="gate-badge">🪐 Ekspedisi Semesta Nana — Special Birthday Edition 🎂</div>
          <h1 className="gate-title">
            Sembilan Planet,
            <br />
            <em>Satu Cerita Cinta Kita</em>
          </h1>
          <p className="gate-sub">
            Sebuah perjalanan kosmik sinematik menjelajahi tata surya, mengumpulkan ilmu astronomi, dan
            merayakan hari ulang tahun istimewa untuk <strong>my beloved Nana, my sunshine, my sweetheart</strong>.
          </p>

          <div className="countdown-box">
            <div className="countdown-label">⏳ Menuju Hari Ulang Tahun Spesial 10 September</div>
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
            Mulai Ekspedisi Semesta 🚀
          </button>
          <div className="gate-hint">🎧 Nyalakan audio agar petualangan terasa lebih magis</div>
        </div>
      </div>

      <canvas id="webgl-canvas" ref={canvasRef}></canvas>

      {/* FLOATING OBSERVATORY BOTTOM DOCK */}
      <div id="observatory-dock">
        <div className="planet-card">
          <div className="planet-header">
            <div className="planet-title-wrap">
              <span className="planet-name-text">
                {currentPlanetData.icon} {activePlanetName}
              </span>
              <span className="planet-type-pill">{currentPlanetData.type}</span>
            </div>

            <div className="tab-toggle-row">
              <button
                className={`tab-toggle-btn ${activeTab === "science" ? "active" : ""}`}
                onClick={() => setActiveTab("science")}
              >
                🔭 Sains
              </button>
              <button
                className={`tab-toggle-btn ${activeTab === "love" ? "active" : ""}`}
                onClick={() => setActiveTab("love")}
              >
                💌 Kasih
              </button>
            </div>
          </div>

          {activeTab === "science" ? (
            <div>
              <div className="planet-metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Diameter</div>
                  <div className="metric-val">{currentPlanetData.diameter}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Jarak</div>
                  <div className="metric-val">{currentPlanetData.distance}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Suhu</div>
                  <div className="metric-val">{currentPlanetData.temp}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Orbit</div>
                  <div className="metric-val">{currentPlanetData.orbitTime}</div>
                </div>
              </div>
              <p className="planet-description">{currentPlanetData.scienceFact}</p>
            </div>
          ) : (
            <div>
              <p className="planet-description love-theme">{currentPlanetData.loveNote}</p>
            </div>
          )}
        </div>

        <div className="dock-nav-row">
          <button className="dock-arrow-btn" id="prev-planet-btn" aria-label="Sebelumnya">
            ‹
          </button>
          <button
            className={`dock-action-btn ${isCurrentOpened ? "completed" : ""}`}
            id="open-quiz-trigger"
          >
            {isCurrentOpened
              ? `✅ Stempel ${activePlanetName} Terbuka • Buka Lagi`
              : `💌 Buka Pesan & Kuis ${activePlanetName}`}
          </button>
          <button className="dock-arrow-btn" id="next-planet-btn" aria-label="Selanjutnya">
            ›
          </button>
        </div>
      </div>

      {/* AI COSMIC ORACLE MODAL */}
      <div id="oracle-modal" className={showOracle ? "show" : ""}>
        <div className="oracle-card">
          <div className="oracle-header">
            <h2 className="oracle-title">✨ AI Cosmic Oracle untuk Nana</h2>
            <p className="oracle-sub">Tanyakan apa saja kepada semesta bintang bertenaga kecerdasan kosmik</p>
          </div>

          <div className="quick-prompts-row">
            <button
              className="quick-prompt-chip"
              onClick={() => askCosmicOracle("Apa pesan khusus bintang untuk Nana di ulang tahun 10 September nanti?")}
            >
              🎂 Pesan Ulang Tahun 10 September
            </button>
            <button
              className="quick-prompt-chip"
              onClick={() => askCosmicOracle(`Ceritakan makna kehadiran Nana bagi duniaku melalui analogi planet ${activePlanetName}.`)}
            >
              🪐 Makna Nana & Planet {activePlanetName}
            </button>
            <button
              className="quick-prompt-chip"
              onClick={() => askCosmicOracle("Tuliskan doa kosmik paling indah untuk masa depan kita berdua.")}
            >
              ✨ Doa Kosmik Masa Depan
            </button>
          </div>

          <div className="oracle-input-box">
            <input
              type="text"
              className="oracle-input"
              placeholder="Ketik pertanyaanmu kepada semesta bintang..."
              value={oracleInput}
              onChange={(e) => setOracleInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askCosmicOracle()}
            />
            <button
              className="oracle-send-btn"
              onClick={() => askCosmicOracle()}
              disabled={oracleLoading}
            >
              {oracleLoading ? "..." : "Kirim ✨"}
            </button>
          </div>

          {oracleResponse && (
            <div className="oracle-response-box">
              {oracleResponse}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              className="close-btn-generic"
              onClick={() => setShowOracle(false)}
            >
              Tutup Oracle
            </button>
          </div>
        </div>
      </div>

      {/* QUIZ MODAL */}
      <div id="quiz-modal">
        <div className="quiz-box">
          <div className="quiz-title">Pesan & Kuis Kosmik untuk Nana</div>
          <div className="quiz-q" id="q-text">
            Pertanyaan memuat...
          </div>
          <div className="btn-container" id="btn-container">
            <button className="quiz-btn" id="ans-1">
              Jawaban 1
            </button>
            <button className="quiz-btn" id="ans-2">
              Jawaban 2
            </button>
          </div>
          <div id="quiz-result"></div>
          <button className="close-btn-generic" id="close-quiz">
            Lanjutkan Penjelajahan
          </button>
        </div>
      </div>

      {/* PASSPORT MODAL */}
      <div id="passport-modal" className={showPassport ? "show" : ""}>
        <div className="passport-card">
          <div className="passport-header">
            <h2 className="passport-title">📔 Paspor Penjelajah Antariksa Nana</h2>
            <p className="passport-sub">Koleksi 9 Stempel Bintang Emas untuk Membuka Kejutan Puncak</p>
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
              className="close-btn-generic"
              onClick={() => setShowPassport(false)}
            >
              Tutup Paspor
            </button>
          </div>
        </div>
      </div>

      {/* GRAND FINALE BIRTHDAY CELEBRATION */}
      <div id="finale">
        <div className="finale-inner">
          <div className="finale-eyebrow">🎉 Ekspedisi Selesai • Spesial Ulang Tahun 🎂</div>
          <h2 className="finale-title">
            Selamat Ulang Tahun,
            <br />
            <span>My Beloved Nana!</span>
          </h2>

          <div className="cake-wrapper">
            <div id="candle-trigger" className="candle-container" title="Klik untuk Make a Wish!">
              <div id="flame-el" className={`flame ${candleBlown ? "blown" : ""}`}></div>
              <div className="candle-stick"></div>
            </div>
            <div className="wish-instruction">
              {candleBlown
                ? "✨ Harapanmu telah dipanjatkan ke langit semesta! ⭐"
                : "🕯️ Klik lilin untuk 'Make a Wish' & meniupnya!"}
            </div>
          </div>

          <div className="birthday-letter-box">
            <div className="letter-heading">
              Kepada: My Beloved Nana, My Sunshine, My Sweetheart 💌
            </div>
            <div className="letter-body">
              <p>
                Selamat ulang tahun pada tanggal <strong>10 September</strong> yang begitu istimewa ini! 🎉
              </p>
              <p>
                Terima kasih sudah lahir ke dunia dan membawa begitu banyak tawa, ketenangan, dan cahaya
                di hidupku. Menjelajahi sembilan planet ini hanyalah gambaran kecil dari betapa luasnya rasa
                syukur dan cintaku untukmu.
              </p>
              <p>
                Di usiamu yang baru ini, aku mendoakan semoga setiap langkahmu selalu dipenuhi kesehatan,
                kelancaran dalam setiap urusan, kedamaian hati, dan tercapainya segala mimpi yang kamu impikan.
              </p>
              <p>
                Sejauh apa pun kita melangkah, ingatlah bahwa kamu tidak pernah sendiri. Aku akan selalu ada di sini,
                menjadi penjelajah setiarnu di setiap fase kehidupan.
              </p>
              <div className="letter-signature">Dengan segenap cinta di seluruh galaksi ❤️</div>
            </div>
          </div>

          <div className="certificate-badge">
            🏆 <strong>Piagam Kehormatan Kosmik:</strong> Diberikan kepada <strong>NANA</strong> atas keberhasilan
            menuntaskan Ekspedisi 9 Planet dan dinobatkan sebagai <em>Pemilik Hatiku Selamanya</em>.
          </div>

          <button className="finale-btn" id="replay-btn">
            Jelajahi Semesta Lagi 🚀
          </button>
        </div>
      </div>
    </>
  );
}
