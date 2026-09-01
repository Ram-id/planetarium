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
    size: 5.5,
    tex: "sun.jpg",
    color: 0xf4c979,
    emissive: 0xffa500,
    type: "Bintang Induk (G2V)",
    diameter: "1.392.700 km (109x Bumi)",
    distance: "Pusat Tata Surya (0 km)",
    temp: "~5.500 °C (Inti: 15 Juta °C)",
    orbitTime: "230 Juta Tahun (Orbit Galaksi)",
    scienceFact:
      "Matahari adalah bola plasma raksasa yang menyumbang 99,86% massa seluruh tata surya! Fusi nuklir di intinya mengubah 600 juta ton hidrogen menjadi helium setiap detik, memancarkan cahaya yang butuh 8 menit 20 detik sampai ke Bumi.",
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
    type: "Planet Terestrial Terkecil",
    diameter: "4.879 km",
    distance: "57,9 Juta km dari Matahari",
    temp: "-180 °C (Malam) s/d 430 °C (Siang)",
    orbitTime: "88 Hari Bumi (Revolusi Tercepat)",
    scienceFact:
      "Merkurius melesat di orbitnya dengan kecepatan 47 km/detik! Tanpa atmosfer tebal untuk menahan panas, suhu di permukaannya mengalami fluktuasi paling ekstrem di seluruh tata surya.",
    loveNote:
      "Di planet yang revolusinya tercepat ini, aku belajar bahwa waktu terasa melesat begitu kilat saat bersamamu. Setiap detik yang kita lalui adalah hadiah terbaik.",
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
    type: "Bintang Kejora / Kembaran Bumi",
    diameter: "12.104 km",
    distance: "108,2 Juta km dari Matahari",
    temp: "465 °C (Planet Terpanas)",
    orbitTime: "225 Hari (1 Hari = 243 Hari Bumi)",
    scienceFact:
      "Venus adalah objek paling terang di langit malam setelah Bulan. Uniknya, Venus berotasi mundur (dari timur ke barat) dan sangat lambat, sehingga satu hari di Venus lebih lama dari satu tahunnya!",
    loveNote:
      "Venus dijuluki planet paling berkilau di angkasa, tapi bagiku, binar mata dan senyuman tulus Nana adalah pemandangan terindah yang mengalahkan kilau jutaan bintang.",
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
    type: "Oasis Kehidupan (Habitable Zone)",
    diameter: "12.742 km",
    distance: "149,6 Juta km (1 AU)",
    temp: "15 °C (Rata-rata)",
    orbitTime: "365,25 Hari (1 Tahun)",
    scienceFact:
      "Bumi adalah satu-satunya tempat di alam semesta yang diketahui menampung kehidupan. Bersama Bulan yang setia menstabilkan poros rotasinya, Bumi memiliki air cair dan atmosfer pelindung yang sempurna.",
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
    type: "Planet Merah (Eksplorasi)",
    diameter: "6.779 km",
    distance: "227,9 Juta km dari Matahari",
    temp: "-60 °C (Rata-rata)",
    orbitTime: "687 Hari Bumi (1,88 Tahun)",
    scienceFact:
      "Mars memiliki gunung berapi tertinggi di tata surya, Olympus Mons (21,9 km, hampir 3x tinggi Everest!) dan ngarai raksasa Valles Marineris. Warna merahnya berasal dari karat besi di permukaannya.",
    loveNote:
      "Warna merah Mars melambangkan api semangat dan keteguhan hati. Di usia barumu nanti, aku akan selalu berdiri di sampingmu, mendukung setiap impian dan cita-citamu.",
    q: "Setinggi apa tekad dan doa yang kupanjatkan untuk kebahagiaan Nana di usia baru?",
    a1: "Setinggi puncak gunung Olympus Mons",
    a2: "Melampaui tingginya seluruh puncak di jagat raya",
    correct: 2,
    msg: "Doa terbaikku selalu memelukmu di setiap langkah, my beloved Nana.",
    icon: "🔴",
  },
  Yupiter: {
    size: 4.4,
    tex: "jupiter.jpg",
    color: 0xcaa87a,
    type: "Raksasa Gas & Pelindung Bumi",
    diameter: "139.820 km (11x Bumi)",
    distance: "778,5 Juta km dari Matahari",
    temp: "-110 °C",
    orbitTime: "11,86 Tahun Bumi (Rotasi: 9,9 Jam)",
    scienceFact:
      "Jupiter memiliki volume lebih besar dari gabungan semua planet lain! Gravitasi raksasanya bertindak bagai 'penyedot debu kosmik' yang melindungi planet-planet dalam dari tabrakan komet berbahaya.",
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
    size: 3.8,
    tex: "saturn.jpg",
    color: 0xd9c39a,
    ring: true,
    type: "Permata Bermahkota Cincin",
    diameter: "116.460 km",
    distance: "1,4 Miliar km dari Matahari",
    temp: "-140 °C",
    orbitTime: "29,45 Tahun Bumi",
    scienceFact:
      "Cincin spektakuler Saturnus membentang hingga 282.000 km namun tebalnya rata-rata hanya 10 meter! Terbuat dari miliaran partikel es murni dan batuan yang memantulkan sinar matahari dengan memukau.",
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
    size: 3.0,
    tex: "uranus.jpg",
    color: 0x9fd0d6,
    type: "Raksasa Es Berotasi Miring",
    diameter: "50.724 km",
    distance: "2,87 Miliar km dari Matahari",
    temp: "-224 °C (Atmosfer Terdingin)",
    orbitTime: "84 Tahun Bumi",
    scienceFact:
      "Uranus adalah satu-satunya planet yang berotasi miring 98 derajat bagai roda menggelinding! Warna toska indahnya dihasilkan oleh gas metana di atmosfer atas yang menyerap cahaya merah.",
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
    size: 2.9,
    tex: "neptune.jpg",
    color: 0x3d5ce0,
    type: "Penjaga Gerbang Biru Terluar",
    diameter: "49.244 km",
    distance: "4,5 Miliar km (30 AU)",
    temp: "-218 °C",
    orbitTime: "164,8 Tahun Bumi",
    scienceFact:
      "Neptunus adalah planet terjauh yang memiliki badai angin tercepat di tata surya — mencapai 2.100 km/jam! Ditemukan melalui prediksi matematika sebelum dilihat langsung lewat teleskop.",
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
  const [candleBlown, setCandleBlown] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = (type: "twinkle" | "correct" | "celebrate" | "blow") => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      if (type === "twinkle") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
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
          gain.gain.setValueAtTime(0.18, now + i * 0.08);
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
          gain.gain.setValueAtTime(0.2, now + i * 0.09);
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
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3500);
    camera.position.set(0, 5, 160);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 12;
    controls.maxDistance = 65;
    controls.target.set(0, 5, 0);
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.4;

    const ambient = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    keyLight.position.set(10, 12, 10);
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

    const bgGeo = new THREE.SphereGeometry(1600, 64, 64);
    const bgMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide });
    texLoader.load("/textures/milky-way.jpg", (tex) => {
      bgMat.map = tex;
      bgMat.needsUpdate = true;
    });
    const bgSphere = new THREE.Mesh(bgGeo, bgMat);
    scene.add(bgSphere);

    // STARDUST FIREWORKS SYSTEM (FOR BIRTHDAY CELEBRATION)
    const fireworkCount = 500;
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
      const speed = 0.2 + Math.random() * 0.8;
      fireworkVels.push(
        new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed
        )
      );
      const c = new THREE.Color().setHSL(Math.random(), 0.9, 0.65);
      fireworkColors[i * 3] = c.r;
      fireworkColors[i * 3 + 1] = c.g;
      fireworkColors[i * 3 + 2] = c.b;
    }
    fireworkGeo.setAttribute("position", new THREE.BufferAttribute(fireworkPos, 3));
    fireworkGeo.setAttribute("color", new THREE.BufferAttribute(fireworkColors, 3));
    const fireworkMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const fireworkPoints = new THREE.Points(fireworkGeo, fireworkMat);
    fireworkPoints.position.set(0, 5, 0);
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

    // SHOOTING STARS / METEORS
    const meteorCount = 6;
    const meteors: { mesh: THREE.Line; speed: number; reset: () => void }[] = [];
    for (let i = 0; i < meteorCount; i++) {
      const mGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-15, -6, -15),
      ]);
      const mMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
      });
      const line = new THREE.Line(mGeo, mMat);
      const reset = () => {
        line.position.set(
          (Math.random() - 0.5) * 400,
          100 + Math.random() * 150,
          (Math.random() - 0.5) * 400
        );
        mMat.opacity = 0.4 + Math.random() * 0.5;
      };
      reset();
      scene.add(line);
      meteors.push({ mesh: line, speed: 1.5 + Math.random() * 1.5, reset });
    }

    // 3D PLANETS CREATION
    const group3D: Record<string, THREE.Group> = {};
    const basePositions: Record<PlanetName, [number, number, number]> = {
      Matahari: [0, 5, 0],
      Merkurius: [18, 5, 0],
      Venus: [28, 5, 0],
      Bumi: [40, 5, 0],
      Mars: [52, 5, 0],
      Yupiter: [68, 5, 0],
      Saturnus: [86, 5, 0],
      Uranus: [104, 5, 0],
      Neptunus: [122, 5, 0],
    };

    ORDER.forEach((name) => {
      const d = DATA[name];
      const grp = new THREE.Group();
      const pos = basePositions[name];
      grp.position.set(pos[0], pos[1], pos[2]);

      const sphereGeo = new THREE.SphereGeometry(d.size, 48, 48);
      let sphereMat: THREE.Material;

      if (name === "Matahari") {
        sphereMat = new THREE.MeshBasicMaterial({ color: d.color });
        texLoader.load(`/textures/${d.tex}`, (tex) => {
          (sphereMat as THREE.MeshBasicMaterial).map = tex;
          sphereMat.needsUpdate = true;
        });
      } else {
        sphereMat = new THREE.MeshStandardMaterial({
          color: d.color,
          roughness: 0.7,
          metalness: 0.1,
        });
        texLoader.load(`/textures/${d.tex}`, (tex) => {
          (sphereMat as THREE.MeshStandardMaterial).map = tex;
          sphereMat.needsUpdate = true;
        });
      }

      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      grp.add(sphere);

      // Moon for Earth
      if (d.moon) {
        const moonGeo = new THREE.SphereGeometry(d.size * 0.27, 32, 32);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, roughness: 0.8 });
        texLoader.load("/textures/moon.jpg", (tex) => {
          moonMat.map = tex;
          moonMat.needsUpdate = true;
        });
        const moon = new THREE.Mesh(moonGeo, moonMat);
        moon.position.set(d.size + 2.6, 0, 0);
        moon.userData = { isMoon: true };
        grp.add(moon);
      }

      // Saturn Rings
      if (d.ring) {
        const ringGeo = new THREE.RingGeometry(d.size * 1.35, d.size * 2.3, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
          roughness: 0.5,
        });
        texLoader.load("/textures/saturn-ring.png", (tex) => {
          ringMat.map = tex;
          ringMat.needsUpdate = true;
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        grp.add(ringMesh);
      }

      scene.add(grp);
      group3D[name] = grp;
    });

    // STATE & NAVIGATION
    let activeKey: PlanetName = "Matahari";
    let isTransitioning = false;
    const openedState: Record<string, boolean> = {};

    function updateProgressUI() {
      const dotsContainer = document.getElementById("progress-track");
      if (dotsContainer) {
        dotsContainer.innerHTML = "";
        ORDER.forEach((name, i) => {
          const dot = document.createElement("button");
          dot.className =
            "prog-dot" +
            (openedState[name] ? " opened" : "") +
            (name === activeKey ? " current" : "");
          dot.title = `${name} (${DATA[name].type})`;
          dot.onclick = () => selectPlanet(ORDER[i]);
          dotsContainer.appendChild(dot);
        });
      }

      const caption = document.getElementById("journey-caption");
      const count = Object.keys(openedState).length;
      if (caption) caption.textContent = `${count} / ${ORDER.length} stempel bintang terkumpul ⭐`;

      const openMsgBtn = document.getElementById("open-msg-btn");
      if (openMsgBtn) {
        if (openedState[activeKey]) {
          openMsgBtn.innerHTML = `✅ Stempel ${activeKey} Terbuka`;
          openMsgBtn.classList.add("opened");
        } else {
          openMsgBtn.innerHTML = `💌 Buka Pesan & Kuis ${activeKey}`;
          openMsgBtn.classList.remove("opened");
        }
      }

      setOpenedPlanets({ ...openedState });
      setActivePlanetName(activeKey);
    }

    function selectPlanet(name: PlanetName) {
      if (isTransitioning) return;
      activeKey = name;
      playTone("twinkle");

      const grp = group3D[name];
      const pData = DATA[name];
      const targetPos = grp.position;

      const pNameEl = document.getElementById("planet-name");
      const pIdxEl = document.getElementById("planet-index");
      if (pNameEl) pNameEl.textContent = `${pData.icon} ${name}`;
      if (pIdxEl) pIdxEl.textContent = `${ORDER.indexOf(name) + 1} / ${ORDER.length} • ${pData.type}`;

      isTransitioning = true;
      const camOffset = pData.size * 4 + 10;
      gsap.to(controls.target, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.4,
        ease: "power2.inOut",
      });
      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y + 2,
        z: targetPos.z + camOffset,
        duration: 1.4,
        ease: "power2.inOut",
        onComplete: () => {
          isTransitioning = false;
        },
      });

      updateProgressUI();
    }

    // INTERACTIVE QUIZ & MODAL
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
          updateProgressUI();

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

    document.getElementById("open-msg-btn")?.addEventListener("click", openQuiz);
    document.getElementById("prev-btn")?.addEventListener("click", () => {
      const idx = ORDER.indexOf(activeKey);
      const nextIdx = (idx - 1 + ORDER.length) % ORDER.length;
      selectPlanet(ORDER[nextIdx]);
    });
    document.getElementById("next-btn")?.addEventListener("click", () => {
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

    // CANDLE BLOW INTERACTION
    const candleBox = document.getElementById("candle-trigger");
    const flameEl = document.getElementById("flame-el");
    candleBox?.addEventListener("click", () => {
      flameEl?.classList.add("blown");
      setCandleBlown(true);
      playTone("blow");
      trigger3DFireworks();
    });

    // 2D ORBIT MAP SVG
    const orbitMap = document.getElementById("orbit-map");
    if (orbitMap) {
      orbitMap.innerHTML = "";
      const w = 340;
      const step = w / (ORDER.length + 1);
      ORDER.forEach((name, i) => {
        const cx = step * (i + 1);
        const cy = 40;
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "orbit-dot");
        g.onclick = () => selectPlanet(name);

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx.toString());
        circle.setAttribute("cy", cy.toString());
        circle.setAttribute("r", "3.5");
        circle.setAttribute("class", "core");

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", cx.toString());
        text.setAttribute("y", (cy + 22).toString());
        text.setAttribute("class", "orbit-label");
        text.textContent = name.substring(0, 3);

        g.appendChild(circle);
        g.appendChild(text);
        orbitMap.appendChild(g);
      });
    }

    // ANIMATION LOOP
    let animFrameId: number;
    let clock = new THREE.Clock();

    function animate() {
      animFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Meteors update
      meteors.forEach((m) => {
        m.mesh.position.x += m.speed * 1.4;
        m.mesh.position.y -= m.speed * 0.6;
        m.mesh.position.z += m.speed * 1.4;
        if (m.mesh.position.y < -100) {
          m.reset();
        }
      });

      // Stardust fireworks expansion
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
        if (fireworkMat.opacity < 0.05) {
          fireworksActive = false;
        }
      }

      // Rotate planets & orbit moon
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
    selectPlanet("Matahari");

    return () => {
      clearTimeout(fallbackTimeout);
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  const currentPlanetData = DATA[activePlanetName];

  return (
    <>
      <audio id="bgm" loop>
        <source src="/backsound.mp3" type="audio/mpeg" />
      </audio>
      <div id="grain"></div>
      <div id="vignette"></div>

      {/* TOP CONTROLS */}
      <div className="top-controls">
        <button
          className="icon-btn"
          onClick={() => setShowPassport(true)}
          title="Buka Paspor Penjelajah Kosmik Nana"
        >
          📔
        </button>
        <button id="audio-btn" className="icon-btn" title="Musik Latar">
          🔇
        </button>
      </div>

      {/* LOADER */}
      <div id="loader">
        <div className="loader-title">Menyusun Semesta Ulang Tahun</div>
        <div className="loader-bar">
          <div className="loader-fill" id="loader-fill"></div>
        </div>
        <div className="loader-pct" id="loader-pct">
          0%
        </div>
      </div>

      {/* GATE INTRO SCREEN */}
      <div id="gate">
        <div className="gate-inner">
          <div className="gate-badge">🪐 Ekspedisi Semesta Nana — Special Birthday Edition 🎂</div>
          <h1 className="gate-title">
            Sembilan Planet,
            <br />
            <em>Satu Cerita Cinta Kita</em>
          </h1>
          <p className="gate-sub">
            Sebuah perjalanan kosmik menjelajahi tata surya, mengumpulkan ilmu astronomi, dan
            merayakan hari ulang tahun istimewa untuk <strong>my beloved Nana, my sunshine, my sweetheart</strong>.
          </p>

          {/* COUNTDOWN TIMER WIDGET */}
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

      {/* TOP HUD */}
      <div id="hud">
        <div className="hud-top-bar">
          <div className="designation">Ekspedisi Semesta Nana</div>
          <button
            className="passport-pill-btn"
            onClick={() => setShowPassport(true)}
          >
            ⭐ Paspor: {Object.keys(openedPlanets).length}/9
          </button>
        </div>

        <div id="progress-track"></div>
        <div id="journey-caption">0 / 9 stempel bintang terkumpul</div>

        {/* DUAL TAB INFO BAR */}
        <div id="info-bar">
          <div className="info-header">
            <h1 id="planet-name">{currentPlanetData.icon} {activePlanetName}</h1>
            <span id="planet-index">1 / 9 • {currentPlanetData.type}</span>
          </div>

          <div className="tab-row">
            <button
              className={`tab-btn ${activeTab === "science" ? "active" : ""}`}
              onClick={() => setActiveTab("science")}
            >
              🔭 Fakta Sains Astronomi
            </button>
            <button
              className={`tab-btn ${activeTab === "love" ? "active" : ""}`}
              onClick={() => setActiveTab("love")}
            >
              💌 Pesan Kasih & Doa
            </button>
          </div>

          {activeTab === "science" ? (
            <div>
              <div className="science-grid">
                <div className="spec-badge">
                  <div className="spec-label">Diameter</div>
                  <div className="spec-val">{currentPlanetData.diameter}</div>
                </div>
                <div className="spec-badge">
                  <div className="spec-label">Jarak Matahari</div>
                  <div className="spec-val">{currentPlanetData.distance}</div>
                </div>
                <div className="spec-badge">
                  <div className="spec-label">Suhu Rata-rata</div>
                  <div className="spec-val">{currentPlanetData.temp}</div>
                </div>
                <div className="spec-badge">
                  <div className="spec-label">Periode Orbit</div>
                  <div className="spec-val">{currentPlanetData.orbitTime}</div>
                </div>
              </div>
              <p className="tab-content">{currentPlanetData.scienceFact}</p>
            </div>
          ) : (
            <div>
              <p className="tab-content love-note">{currentPlanetData.loveNote}</p>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM PANEL & NAVIGATION */}
      <div id="panel">
        <div id="nav-row">
          <button className="nav-icon-btn" id="prev-btn" aria-label="Planet sebelumnya">
            ‹
          </button>
          <button id="open-msg-btn" aria-label="Buka pesan planet ini">
            💌 Buka Pesan & Kuis
          </button>
          <button className="nav-icon-btn" id="next-btn" aria-label="Planet selanjutnya">
            ›
          </button>
        </div>
        <div id="orbit-wrap">
          <svg
            id="orbit-map"
            viewBox="0 0 340 80"
            preserveAspectRatio="xMidYMid meet"
          ></svg>
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
          <button id="close-quiz">Lanjutkan Penjelajahan</button>
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
              id="close-quiz"
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

          {/* INTERACTIVE CANDLE & CAKE */}
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

          {/* BIRTHDAY LOVE LETTER */}
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

          {/* CERTIFICATE OF UNIVERSE */}
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