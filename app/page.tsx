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
  orbitDays: number;
  gravityFactor: number;
  scienceFact: string;
  funFact: string;
  romanticNote: string;
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
    type: "Bintang Induk // Tipe G2V",
    diameter: "1.392.700 km",
    distance: "Pusat Gravitasi",
    temp: "~5.500 °C",
    orbitDays: 230000000 * 365,
    gravityFactor: 27.9,
    scienceFact:
      "Matahari mengandung 99,86% dari seluruh massa tata surya kita! Reaksi fusi nuklir di intinya mengubah 600 juta ton hidrogen menjadi helium setiap detik untuk memancarkan cahaya hangat ke seluruh penjuru angkasa.",
    funFact: "Cahaya hangat Matahari butuh waktu 8 menit 20 detik untuk sampai ke pipimu di Bumi!",
    romanticNote:
      "Sebagaimana Matahari yang menjadi jangkar gravitasi bagi seluruh semesta, kehadiranmu senantiasa memberi kehangatan, keceriaan, dan arah yang jernih dalam setiap hariku.",
    icon: "☀️",
  },
  Merkurius: {
    size: 1.6,
    tex: "mercury.jpg",
    color: 0x9a938c,
    type: "Planet Terestrial Terdekat",
    diameter: "4.879 km",
    distance: "57,9 Juta km",
    temp: "-180 °C s/d +430 °C",
    orbitDays: 88,
    gravityFactor: 0.38,
    scienceFact:
      "Merkurius adalah pelari tercepat di tata surya dengan kecepatan orbit 47,4 km/detik. Karena hampir tidak memiliki atmosfer penahan panas, suhunya bisa sangat panas di siang hari dan sangat dingin membeku di malam hari.",
    funFact: "Satu tahun di Merkurius hanya berlangsung selama 88 hari Bumi!",
    romanticNote:
      "Di planet dengan laju waktu tercepat ini, aku tersadar betapa berharganya setiap detik yang kita lalui bersama. Setiap obrolan denganmu selalu terasa menyenangkan dan berlalu begitu cepat.",
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
    orbitDays: 225,
    gravityFactor: 0.91,
    scienceFact:
      "Venus merupakan objek alami paling berkilau di langit malam setelah Bulan. Atmosfer tebalnya memantulkan 75% sinar matahari, dan Venus berotasi secara unik terbalik (dari timur ke barat).",
    funFact: "Di Venus, Matahari terbit dari arah barat dan tenggelam di arah timur!",
    romanticNote:
      "Venus dijuluki sebagai permata yang paling bercahaya di langit malam. Namun bagiku, senyuman tulus dan binar ceriamu adalah pemandangan paling indah di semesta ini.",
    icon: "✨",
  },
  Bumi: {
    size: 2.4,
    tex: "earth.jpg",
    color: 0x3f6fae,
    moon: true,
    type: "Oasis Kehidupan Biosfer",
    diameter: "12.742 km",
    distance: "149,6 Juta km (1 AU)",
    temp: "15 °C Rata-rata",
    orbitDays: 365.25,
    gravityFactor: 1.0,
    scienceFact:
      "Bumi adalah satu-satunya dunia tempat tinggal kita yang kaya air cair dan oksigen. Gravitasi Bulan setia menjaga kemiringan sumbu rotasi Bumi pada 23,5° sehingga iklim tetap stabil dan nyaman.",
    funFact: "Bumi melaju mengitari Matahari dengan kecepatan sekitar 107.000 km/jam!",
    romanticNote:
      "Di antara miliaran kemungkinan di planet biru yang indah ini, dipertemukan dan berjalan beriringan denganmu adalah keajaiban terindah yang selalu kusyukuri.",
    icon: "🌍",
  },
  Mars: {
    size: 1.8,
    tex: "mars.jpg",
    color: 0xb1543a,
    type: "Planet Merah",
    diameter: "6.779 km",
    distance: "227,9 Juta km",
    temp: "-60 °C Rata-rata",
    orbitDays: 687,
    gravityFactor: 0.38,
    scienceFact:
      "Mars memiliki Olympus Mons, gunung berapi perisai setinggi 21,9 km (hampir 3 kali lipat tinggi Everest!). Warna merah khasnya berasal dari kandungan besi oksida alami di tanahnya.",
    funFact: "Di Mars, kamu bisa melompat hampir 3 kali lebih tinggi daripada di Bumi!",
    romanticNote:
      "Warna merah Mars melambangkan keteguhan dan semangat. Aku akan selalu ada di sampingmu untuk mendukung seluruh mimpi dan hal-hal hebat yang ingin kamu raih.",
    icon: "🔴",
  },
  Yupiter: {
    size: 4.3,
    tex: "jupiter.jpg",
    color: 0xcaa87a,
    type: "Raksasa Gas Terbesar",
    diameter: "139.820 km",
    distance: "778,5 Juta km",
    temp: "-110 °C",
    orbitDays: 4333,
    gravityFactor: 2.34,
    scienceFact:
      "Jupiter memiliki massa lebih dari dua kali lipat gabungan seluruh planet lainnya. Medan gravitasinya yang raksasa bertindak sebagai pelindung kosmik yang menangkal komet berbahaya dari planet dalam.",
    funFact: "Badai raksasa 'Great Red Spot' di Jupiter sudah berputar selama ratusan tahun dan lebih besar dari ukuran Bumi!",
    romanticNote:
      "Sebagaimana Jupiter yang setia melindungi orbit sekitarnya, aku ingin selalu menjadi sosok yang menjaga, mendengarkan ceritamu, dan membuatmu merasa aman seutuhnya.",
    icon: "🪐",
  },
  Saturnus: {
    size: 3.6,
    tex: "saturn.jpg",
    color: 0xd9c39a,
    ring: true,
    type: "Permata Bermahkota Cincin",
    diameter: "116.460 km",
    distance: "1,43 Miliar km",
    temp: "-140 °C",
    orbitDays: 10759,
    gravityFactor: 1.06,
    scienceFact:
      "Sistem cincin Saturnus yang menakjubkan membentang selebar 282.000 km namun ketebalannya rata-rata hanya 10 meter! Cincin ini tersusun atas miliaran partikel kristal es murni yang berkilau.",
    funFact: "Kepadatan Saturnus sangat ringan—jika ada kolam air raksasa yang cukup besar, Saturnus akan mengapung di atas air!",
    romanticNote:
      "Cincin Saturnus yang melingkar anggun adalah simbol keselarasan dan keharmonisan. Bersamamu, hal-hal sederhana selalu terasa begitu indah dan bermakna.",
    icon: "👑",
  },
  Uranus: {
    size: 2.9,
    tex: "uranus.jpg",
    color: 0x9fd0d6,
    type: "Raksasa Es Berotasi Miring",
    diameter: "50.724 km",
    distance: "2,87 Miliar km",
    temp: "-224 °C",
    orbitDays: 30687,
    gravityFactor: 0.92,
    scienceFact:
      "Uranus adalah planet unik yang berotasi menggelinding miring dengan sudut kemiringan poros 97,8°. Gas metana di atmosfernya menyerap cahaya merah dan memantulkan warna toska pastel yang menenangkan.",
    funFact: "Karena kemiringan rotasinya, satu kutub di Uranus mengalami 42 tahun siang hari terus-menerus dan 42 tahun malam hari!",
    romanticNote:
      "Keunikan Uranus mengingatkanku pada pribadimu yang selalu membawa keceriaan, tawa manis, dan warna-warni menyenangkan dalam hidupku.",
    icon: "💎",
  },
  Neptunus: {
    size: 2.8,
    tex: "neptune.jpg",
    color: 0x3d5ce0,
    type: "Dunia Azure Angin Supersonik",
    diameter: "49.244 km",
    distance: "4,50 Miliar km",
    temp: "-218 °C",
    orbitDays: 60190,
    gravityFactor: 1.19,
    scienceFact:
      "Neptunus adalah planet terjauh dalam tata surya dengan kecepatan badai angin supersonik tercepat yang mencapai 2.100 km/jam. Memiliki rona biru samudra kosmik yang begitu mempesona.",
    funFact: "Neptunus membutuhkan waktu hampir 165 tahun Bumi hanya untuk menyelesaikan satu kali putaran mengitari Matahari!",
    romanticNote:
      "Berada di batas terjauh tata surya ini membuktikan bahwa sejauh apa pun jarak dan waktu, doa baik dan rasa sayangku untukmu tak akan pernah pudar.",
    icon: "🌊",
  },
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialized = useRef(false);

  const [activePlanetName, setActivePlanetName] = useState<PlanetName>("Bumi");
  const [activeTab, setActiveTab] = useState<"science" | "lab" | "love">("science");
  const [userWeight, setUserWeight] = useState<number>(45);
  const [userAge, setUserAge] = useState<number>(20);
  const [showCosmoModal, setShowCosmoModal] = useState(false);
  const [cosmoInput, setCosmoInput] = useState("");
  const [cosmoReply, setCosmoReply] = useState("");
  const [cosmoLoading, setCosmoLoading] = useState(false);
  const [showWishModal, setShowWishModal] = useState(false);
  const [wishText, setWishText] = useState("");
  const [wishCount, setWishCount] = useState(3);
  const [mascotTip, setMascotTip] = useState("Hai Nana! Klik aku untuk mengobrol atau bertanya apa saja tentang semesta! ✨");

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSfx = (type: "pop" | "sparkle" | "whoosh" | "chime") => {
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

      if (type === "pop") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "sparkle") {
        [659.25, 830.61, 987.77, 1318.51].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.1, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.3);
        });
      } else if (type === "chime") {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.15, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.45);
        });
      } else if (type === "whoosh") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.25);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch {}
  };

  const askCosmo = async (customPrompt?: string) => {
    const query = customPrompt || cosmoInput;
    if (!query) return;
    setCosmoLoading(true);
    setCosmoReply("");
    playSfx("sparkle");

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          planet: activePlanetName,
          topic: activeTab === "science" ? "Fakta Sains & Anatomi Planet" : "Refleksi Manis & Keajaiban Semesta",
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setCosmoReply(data.reply);
        playSfx("chime");
      } else {
        setCosmoReply(data.error || "Cosmo sedang membetulkan antena radio bintangnya! Coba sebentar lagi ya ✨");
      }
    } catch {
      setCosmoReply("Cosmo: Langit antariksa sangat cerah hari ini, Nana! Seluruh bintang tersenyum untukmu!");
    } finally {
      setCosmoLoading(false);
    }
  };

  const triggerSatelliteLaunchRef = useRef<() => void>(() => {});
  const triggerWishParticleRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (initialized.current || !canvasRef.current) return;
    initialized.current = true;

    const bgm = document.getElementById("bgm") as HTMLAudioElement | null;
    const audioBtn = document.getElementById("audio-btn") as HTMLButtonElement | null;
    let isPlaying = false;
    function setAudio(play: boolean) {
      if (!bgm || !audioBtn) return;
      if (play) {
        bgm.play().catch(() => {});
        audioBtn.textContent = "MUSIK: ON 🎵";
      } else {
        bgm.pause();
        audioBtn.textContent = "MUSIK: OFF 🔇";
      }
      isPlaying = play;
    }
    audioBtn?.addEventListener("click", () => setAudio(!isPlaying));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 4500);
    camera.position.set(40, 5, 20);

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
    controls.minDistance = 6;
    controls.maxDistance = 65;
    controls.target.set(40, 3.5, 0); // Start at Earth
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;

    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
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

    // 1. STARFIELD
    const starCount = 6500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color(0x93c5fd),
      new THREE.Color(0xffffff),
      new THREE.Color(0xfde68a),
      new THREE.Color(0xfbcfe8),
      new THREE.Color(0xc084fc),
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

    // 2. 3D ASTEROID BELT
    const asteroidCount = 350;
    const asteroidGeo = new THREE.DodecahedronGeometry(0.35, 1);
    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x8c827a,
      roughness: 0.9,
      metalness: 0.2,
    });
    const asteroidInstanced = new THREE.InstancedMesh(asteroidGeo, asteroidMat, asteroidCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < asteroidCount; i++) {
      const angle = (i / asteroidCount) * Math.PI * 2 + Math.random() * 0.05;
      const radius = 59 + (Math.random() - 0.5) * 7.5;
      dummy.position.set(
        Math.cos(angle) * radius,
        3.5 + (Math.random() - 0.5) * 3,
        Math.sin(angle) * radius
      );
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const scale = 0.4 + Math.random() * 0.8;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      asteroidInstanced.setMatrixAt(i, dummy.matrix);
    }
    asteroidInstanced.instanceMatrix.needsUpdate = true;
    scene.add(asteroidInstanced);

    // 3. GLOWING ORBIT LINES
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

    ORDER.slice(1).forEach((name) => {
      const r = basePositions[name][0];
      const segments = 128;
      const orbitPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(Math.cos(theta) * r, 3.5, Math.sin(theta) * r));
      }
      const orbGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.2,
      });
      const orbLine = new THREE.Line(orbGeo, orbMat);
      scene.add(orbLine);
    });

    // 4. SATURN RING
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

    // 5. 3D PLANETS
    const group3D: Record<string, THREE.Group> = {};

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

    // 6. DYNAMIC MINI SATELLITE SYSTEM
    const activeSatellites: THREE.Group[] = [];
    const launchSatellite = () => {
      const currentGrp = group3D[activeKey];
      const pData = DATA[activeKey];
      const sat = new THREE.Group();

      const satBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.5, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 })
      );
      const wings = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.04, 0.35),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.1 })
      );
      sat.add(satBody);
      sat.add(wings);

      sat.position.copy(currentGrp.position);
      sat.userData = {
        center: currentGrp.position,
        radius: pData.size + 2.5 + Math.random() * 1.5,
        speed: 1.2 + Math.random() * 0.8,
        angle: Math.random() * Math.PI * 2,
        inclination: (Math.random() - 0.5) * 0.8,
      };

      scene.add(sat);
      activeSatellites.push(sat);
      playSfx("sparkle");
      setMascotTip(`Wah, satelit eksplorasi baru berhasil mengorbit ${activeKey}! 🛰️✨`);
    };
    triggerSatelliteLaunchRef.current = launchSatellite;

    // 7. WISH STAR PARTICLE BURST
    const wishStarCount = 80;
    const wishGeo = new THREE.BufferGeometry();
    const wishPos = new Float32Array(wishStarCount * 3);
    const wishVels: THREE.Vector3[] = [];

    for (let i = 0; i < wishStarCount; i++) {
      wishPos[i * 3] = 0;
      wishPos[i * 3 + 1] = 0;
      wishPos[i * 3 + 2] = 0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 0.3 + Math.random() * 0.6;
      wishVels.push(
        new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed + 0.2,
          Math.cos(phi) * speed
        )
      );
    }
    wishGeo.setAttribute("position", new THREE.BufferAttribute(wishPos, 3));
    const wishMat = new THREE.PointsMaterial({
      size: 2.2,
      color: 0xfde047,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const wishPoints = new THREE.Points(wishGeo, wishMat);
    scene.add(wishPoints);

    let wishActive = false;
    const triggerWishBurst = () => {
      const currentGrp = group3D[activeKey];
      wishPoints.position.copy(currentGrp.position);
      wishActive = true;
      wishMat.opacity = 1;
      const posAttr = wishGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < wishStarCount; i++) {
        posAttr.setXYZ(i, 0, 0, 0);
      }
      posAttr.needsUpdate = true;
    };
    triggerWishParticleRef.current = triggerWishBurst;

    let activeKey: PlanetName = "Bumi";

    function navigateToPlanet(name: PlanetName) {
      activeKey = name;
      playSfx("whoosh");

      const grp = group3D[name];
      const pData = DATA[name];
      const targetPos = grp.position;
      const camOffset = pData.size * 3.5 + 8;

      gsap.to(controls.target, {
        x: targetPos.x,
        y: targetPos.y + 0.2,
        z: targetPos.z,
        duration: 1.4,
        ease: "power2.inOut",
      });
      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y + 1.6,
        z: targetPos.z + camOffset,
        duration: 1.4,
        ease: "power2.inOut",
      });

      setActivePlanetName(name);
      setMascotTip(`Kita sekarang sedang mengamati ${name}! Ada banyak fakta seru di sini ✨`);
    }

    document.getElementById("gate-btn")?.addEventListener("click", () => {
      document.getElementById("gate")?.classList.add("hide");
      setAudio(true);
      navigateToPlanet("Bumi");
    });

    let animFrameId: number;
    const clock = new THREE.Clock();

    function animate() {
      animFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      starfieldMesh.rotation.y = t * 0.002;
      asteroidInstanced.rotation.y = t * 0.012;

      // Animate active satellites
      activeSatellites.forEach((sat) => {
        const u = sat.userData;
        u.angle += 0.02 * u.speed;
        sat.position.x = u.center.x + Math.cos(u.angle) * u.radius;
        sat.position.z = u.center.z + Math.sin(u.angle) * u.radius;
        sat.position.y = u.center.y + Math.sin(u.angle * 2) * u.inclination * u.radius;
        sat.rotation.y = -u.angle;
      });

      // Animate wish particles
      if (wishActive) {
        const posAttr = wishGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < wishStarCount; i++) {
          const v = wishVels[i];
          posAttr.setXYZ(
            i,
            posAttr.getX(i) + v.x,
            posAttr.getY(i) + v.y,
            posAttr.getZ(i) + v.z
          );
        }
        posAttr.needsUpdate = true;
        wishMat.opacity *= 0.975;
        if (wishMat.opacity < 0.05) wishActive = false;
      }

      // Rotate planets
      ORDER.forEach((name) => {
        const grp = group3D[name];
        if (grp) {
          grp.children.forEach((c) => {
            if (c.userData.isMoon) {
              const R = DATA[name].size + 2.8;
              c.position.x = Math.cos(t * 0.7) * R;
              c.position.z = Math.sin(t * 0.7) * R;
            } else if (c instanceof THREE.Mesh && c.geometry instanceof THREE.SphereGeometry) {
              c.rotation.y += 0.004;
            }
          });
        }
      });

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

  const currentPlanet = DATA[activePlanetName];
  const currentIdx = ORDER.indexOf(activePlanetName);

  const calculatedWeight = Math.round(userWeight * currentPlanet.gravityFactor * 10) / 10;
  const calculatedAge = Math.round((userAge * 365.25 / currentPlanet.orbitDays) * 10) / 10;

  const handleLaunchSatellite = () => {
    triggerSatelliteLaunchRef.current();
  };

  const handleSendWish = () => {
    if (!wishText) return;
    triggerWishParticleRef.current();
    playSfx("sparkle");
    setWishCount((prev) => prev + 1);
    setShowWishModal(false);
    setWishText("");
    setMascotTip("Bintang harapanmu telah meluncur dan bersinar indah di galaksi! ⭐💖");
  };

  return (
    <>
      <audio id="bgm" loop>
        <source src="/backsound.mp3" type="audio/mpeg" />
      </audio>

      {/* TOP NAVIGATION BAR */}
      <div className="top-nav">
        <div className="brand-badge">
          <span className="sparkle">✨</span>
          CosmoNana // Observatorium Semesta
        </div>

        <div className="nav-tools">
          <button
            className="cute-btn cosmo-btn"
            onClick={() => {
              playSfx("pop");
              setShowCosmoModal(true);
            }}
            title="Tanya Cosmo si Asisten Imut"
          >
            🤖 Sahabat Cosmo
          </button>
          <button
            className="cute-btn"
            id="audio-btn"
            title="Nyalakan / Matikan Musik"
          >
            MUSIK: OFF 🔇
          </button>
        </div>
      </div>

      {/* ORBIT SELECTION CAROUSEL DOCK */}
      <div className="orbit-dock">
        {ORDER.map((name) => (
          <button
            key={name}
            className={`planet-pill ${name === activePlanetName ? "active" : ""}`}
            onClick={() => {
              playSfx("pop");
              setActivePlanetName(name);
              // Trigger orbit navigation
              const btn = document.getElementById(`nav-${name}`);
              btn?.click();
            }}
          >
            <span>{DATA[name].icon}</span>
            {name}
          </button>
        ))}
      </div>

      {/* HIDDEN NAV TRIGGERS FOR THREE.JS */}
      <div style={{ display: "none" }}>
        {ORDER.map((name) => (
          <button
            key={name}
            id={`nav-${name}`}
            onClick={() => {
              // Internal navigation handled inside Three.js
            }}
          />
        ))}
      </div>

      {/* FLOATING MASCOT COMPANION (COSMO & ASTRO-NANA) */}
      <div id="mascot-companion">
        <div
          className="mascot-bubble"
          onClick={() => {
            playSfx("pop");
            setShowCosmoModal(true);
          }}
        >
          {mascotTip}
        </div>
        <div
          className="mascot-avatar-wrap"
          onClick={() => {
            playSfx("sparkle");
            setShowCosmoModal(true);
          }}
          title="Klik Cosmo untuk mengobrol!"
        >
          👨‍🚀
        </div>
      </div>

      {/* LOADER */}
      <div id="loader">
        <div style={{ color: "var(--pastel-pink)", fontSize: "12px", fontWeight: 700, letterSpacing: "1px" }}>
          MEMBUKA OBSERVATORIUM ANTARIKSA NANA... ✨
        </div>
        <div className="loader-bar">
          <div className="loader-fill" id="loader-fill"></div>
        </div>
      </div>

      {/* INTRO GATE SCREEN */}
      <div id="gate">
        <div className="gate-card">
          <div className="gate-badge">🪐 OBSERVATORIUM EDUKASI SEMESTA ✨</div>
          <h1 className="gate-title">
            Jelajahi Tata Surya
            <br />
            <span>Bersama Nana</span>
          </h1>
          <p className="gate-desc">
            Selamat datang di media pembelajaran astronomi interaktif! Yuk pelajari keajaiban 9 objek tata surya, coba kalkulator gravitasi & umur kosmik, terbangkan satelit mini, dan temukan fakta-fakta sains yang menakjubkan.
          </p>
          <button className="gate-start-btn" id="gate-btn">
            Mulai Menjelajah Sekarang 🚀
          </button>
        </div>
      </div>

      <canvas id="webgl-canvas" ref={canvasRef}></canvas>

      {/* MAIN INTERACTIVE LEARNING DECK (BOTTOM DOCK) */}
      <div id="learning-deck">
        <div className="cozy-card">
          <div className="card-header-row">
            <div className="planet-title-group">
              <span className="planet-name-text">
                {currentPlanet.icon} {activePlanetName}
              </span>
              <span className="planet-type-badge">{currentPlanet.type}</span>
            </div>

            <div className="mode-tabs">
              <button
                className={`tab-btn ${activeTab === "science" ? "active" : ""}`}
                onClick={() => {
                  playSfx("pop");
                  setActiveTab("science");
                }}
              >
                🔭 Fakta Sains
              </button>
              <button
                className={`tab-btn ${activeTab === "lab" ? "active" : ""}`}
                onClick={() => {
                  playSfx("pop");
                  setActiveTab("lab");
                }}
              >
                ⚖️ Lab Kosmik
              </button>
              <button
                className={`tab-btn ${activeTab === "love" ? "active" : ""}`}
                onClick={() => {
                  playSfx("pop");
                  setActiveTab("love");
                }}
              >
                💌 Catatan Manis
              </button>
            </div>
          </div>

          {activeTab === "science" && (
            <div>
              <div className="fact-grid">
                <div className="fact-box">
                  <div className="fact-label">DIAMETER</div>
                  <div className="fact-val">{currentPlanet.diameter}</div>
                </div>
                <div className="fact-box">
                  <div className="fact-label">JARAK ORBIT</div>
                  <div className="fact-val">{currentPlanet.distance}</div>
                </div>
                <div className="fact-box">
                  <div className="fact-label">SUHU RATA-RATA</div>
                  <div className="fact-val">{currentPlanet.temp}</div>
                </div>
                <div className="fact-box">
                  <div className="fact-label">GRAVITASI</div>
                  <div className="fact-val">{currentPlanet.gravityFactor}x Bumi</div>
                </div>
              </div>
              <p className="science-summary-box">{currentPlanet.scienceFact}</p>
            </div>
          )}

          {activeTab === "lab" && (
            <div className="lab-container">
              <div className="calc-row">
                <div className="calc-box">
                  <div className="calc-title">⚖️ Berat Badanmu di {activePlanetName}:</div>
                  <div className="calc-input-wrap">
                    <input
                      type="number"
                      className="calc-input"
                      value={userWeight}
                      onChange={(e) => setUserWeight(Number(e.target.value) || 0)}
                    />
                    <div className="calc-res-text">
                      kg ➔ Jadi: <span>{calculatedWeight} kg</span>
                    </div>
                  </div>
                </div>

                <div className="calc-box">
                  <div className="calc-title">⏳ Usiamu di {activePlanetName}:</div>
                  <div className="calc-input-wrap">
                    <input
                      type="number"
                      className="calc-input"
                      value={userAge}
                      onChange={(e) => setUserAge(Number(e.target.value) || 0)}
                    />
                    <div className="calc-res-text">
                      thn ➔ Jadi: <span>{calculatedAge} tahun</span>
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "12px", color: "var(--pastel-yellow)", fontStyle: "italic" }}>
                💡 <strong>Tahukah Kamu?</strong> {currentPlanet.funFact}
              </p>
            </div>
          )}

          {activeTab === "love" && (
            <div>
              <p className="romantic-note-box">{currentPlanet.romanticNote}</p>
            </div>
          )}
        </div>

        {/* INTERACTIVE TOY BUTTONS */}
        <div className="action-toy-row">
          <button
            className="nav-arrow-btn"
            onClick={() => {
              playSfx("pop");
              const prevIdx = (currentIdx - 1 + ORDER.length) % ORDER.length;
              setActivePlanetName(ORDER[prevIdx]);
            }}
            title="Ke Planet Sebelumnya"
          >
            ‹
          </button>
          <button className="launch-satellite-btn" onClick={handleLaunchSatellite}>
            🚀 Luncurkan Satelit Mini ke {activePlanetName}
          </button>
          <button
            className="wish-star-btn"
            onClick={() => {
              playSfx("pop");
              setShowWishModal(true);
            }}
          >
            ⭐ Bintang Harapan ({wishCount})
          </button>
          <button
            className="nav-arrow-btn"
            onClick={() => {
              playSfx("pop");
              const nextIdx = (currentIdx + 1) % ORDER.length;
              setActivePlanetName(ORDER[nextIdx]);
            }}
            title="Ke Planet Berikutnya"
          >
            ›
          </button>
        </div>
      </div>

      {/* AI COSMO CHAT MODAL */}
      <div id="cosmo-modal" className={showCosmoModal ? "show" : ""}>
        <div className="cosmo-window">
          <div className="cosmo-header">
            <span className="cosmo-avatar">🤖</span>
            <div>
              <div className="cosmo-title-text">Sahabat Antariksa Cosmo</div>
              <div className="cosmo-sub">Tanyakan apa saja seputar sains atau keindahan semesta!</div>
            </div>
          </div>

          <div className="cosmo-chips-grid">
            <button
              className="cosmo-chip-btn"
              onClick={() => askCosmo(`Ceritakan fakta paling lucu dan unik tentang planet ${activePlanetName}!`)}
            >
              🪐 Fakta Lucu {activePlanetName}
            </button>
            <button
              className="cosmo-chip-btn"
              onClick={() => askCosmo("Bagaimana bintang dan galaksi terbentuk di alam semesta kita?")}
            >
              ✨ Kelahiran Bintang
            </button>
            <button
              className="cosmo-chip-btn"
              onClick={() => askCosmo("Berikan pesan sains yang manis dan menenangkan untuk hariku!")}
            >
              💖 Pesan Semesta Manis
            </button>
          </div>

          <div className="cosmo-input-row">
            <input
              type="text"
              className="cosmo-input-field"
              placeholder="Ketik pertanyaan antariksa untuk Cosmo..."
              value={cosmoInput}
              onChange={(e) => setCosmoInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askCosmo()}
            />
            <button
              className="cosmo-send-btn"
              onClick={() => askCosmo()}
              disabled={cosmoLoading}
            >
              {cosmoLoading ? "..." : "Kirim 🚀"}
            </button>
          </div>

          {cosmoReply && (
            <div className="cosmo-chat-bubble">
              {cosmoReply}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "6px" }}>
            <button
              className="cute-btn"
              style={{ margin: "auto" }}
              onClick={() => setShowCosmoModal(false)}
            >
              Tutup Obrolan
            </button>
          </div>
        </div>
      </div>

      {/* STARLIGHT WISH MODAL */}
      <div id="wish-modal" className={showWishModal ? "show" : ""}>
        <div className="wish-window">
          <div style={{ fontSize: "1.8rem" }}>⭐✨</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--pastel-pink)" }}>
            Terbangkan Bintang Harapan
          </h3>
          <p style={{ fontSize: "12px", color: "#cbd5e1" }}>
            Tuliskan harapan, impian, atau pesan manismu. Pesan ini akan diluncurkan menjadi bintang emas bercahaya di galaksi 3D!
          </p>

          <textarea
            className="wish-textarea"
            placeholder="Tuliskan harapan indahmu di sini..."
            value={wishText}
            onChange={(e) => setWishText(e.target.value)}
          />

          <button className="wish-submit-btn" onClick={handleSendWish}>
            Terbangkan ke Langit Bintang ⭐
          </button>

          <button
            className="cute-btn"
            style={{ margin: "auto" }}
            onClick={() => setShowWishModal(false)}
          >
            Batal
          </button>
        </div>
      </div>
    </>
  );
}
