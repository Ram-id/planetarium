"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { CONSTELLATIONS, DEEP_SKY_OBJECTS, CelestialObject } from "../data/stellarium_data";

interface PlanetInfo {
  size: number;
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
    size: 9.0,
    tex: "sun.jpg",
    color: 0xf4c979,
    emissive: 0xffaa22,
    indexStr: "STAR // 00",
    type: "Bintang Induk Tata Surya",
    diameter: "1.392.700 km",
    distance: "Pusat Tata Surya",
    temp: "5.500 °C",
    orbitDays: 230000000 * 365,
    gravityFactor: 27.9,
    heroDesc:
      "Sumber gravitasi dan cahaya utama yang menghangatkan seluruh orbit kosmik di sekelilingnya.",
    scienceFact:
      "Matahari menyumbang 99,86% massa seluruh tata surya. Reaksi fusi nuklir di intinya mengubah 600 juta ton hidrogen menjadi helium setiap detik, memancarkan foton yang mencapai permukaan Bumi dalam 500 detik.",
    romanticNote:
      "Sebagaimana Matahari yang menjadi jangkar bagi seluruh semesta, hadirmu senantiasa memberi kehangatan, semangat, dan arah yang jernih di setiap hariku.",
  },
  Merkurius: {
    size: 5.2,
    tex: "mercury.jpg",
    color: 0x9a938c,
    indexStr: "PLANET // 01",
    type: "Planet Terestrial Terdekat",
    diameter: "4.879 km",
    distance: "57,9 Juta km",
    temp: "-180°C / +430°C",
    orbitDays: 88,
    gravityFactor: 0.38,
    heroDesc:
      "Pelari tercepat di tata surya yang menempuh orbit mengitari Matahari hanya dalam 88 hari.",
    scienceFact:
      "Merkurius memiliki kecepatan orbit 47,4 km/detik. Tanpa atmosfer penahan panas yang tebal, planet ini memiliki gradien fluktuasi suhu permukaan paling ekstrem.",
    romanticNote:
      "Di planet dengan laju waktu tercepat ini, aku tersadar betapa berharganya setiap momen. Waktu selalu berlalu begitu cepat saat kita berbagi cerita dan tawa.",
  },
  Venus: {
    size: 6.8,
    tex: "venus.jpg",
    color: 0xd8b98a,
    indexStr: "PLANET // 02",
    type: "Bintang Kejora Bercahaya",
    diameter: "12.104 km",
    distance: "108,2 Juta km",
    temp: "465 °C",
    orbitDays: 225,
    gravityFactor: 0.91,
    heroDesc:
      "Permata bercahaya paling terang di langit malam dengan lapisan awan atmosfer pemantul cahaya.",
    scienceFact:
      "Venus memantulkan 75% sinar matahari karena lapisan awan asam sulfatnya. Venus juga berotasi secara retrograde dari timur ke barat secara perlahan.",
    romanticNote:
      "Venus dijuluki sebagai objek paling berkilau di langit malam. Namun bagiku, senyuman tulus dan binar ceriamu adalah pemandangan paling indah di semesta ini.",
  },
  Bumi: {
    size: 7.2,
    tex: "earth.jpg",
    img: "earth_spaceedu.png",
    color: 0x3f6fae,
    moon: true,
    indexStr: "PLANET // 03",
    type: "Oasis Biosfer & Kehidupan",
    diameter: "12.742 km",
    distance: "149,6 Juta km (1.0 AU)",
    temp: "15 °C Rata-rata",
    orbitDays: 365.25,
    gravityFactor: 1.0,
    heroDesc:
      "Satu-satunya rumah kehidupan dengan samudra biru cair stabil dan atmosfer pelindung yang sempurna.",
    scienceFact:
      "Bumi memiliki magnetosfer pelindung radiasi dan air cair di permukaan. Gravitasi Bulan setia menjaga kemiringan sumbu rotasi Bumi pada 23,5° agar iklim tetap stabil.",
    romanticNote:
      "Di antara miliaran kemungkinan di planet biru yang indah ini, dipertemukan dan berjalan beriringan denganmu adalah keajaiban terindah yang selalu kusyukuri.",
  },
  Mars: {
    size: 5.6,
    tex: "mars.jpg",
    color: 0xb1543a,
    indexStr: "PLANET // 04",
    type: "Planet Merah Penjelajah",
    diameter: "6.779 km",
    distance: "227,9 Juta km",
    temp: "-60 °C Rata-rata",
    orbitDays: 687,
    gravityFactor: 0.38,
    heroDesc:
      "Dunia merah berpasir kaya besi oksida yang menaungi gunung berapi tertinggi di tata surya.",
    scienceFact:
      "Mars memiliki Olympus Mons (21,9 km), gunung tertinggi di tata surya. Jejak geologis menunjukkan Mars pernah memiliki aliran sungai dan danau purba.",
    romanticNote:
      "Warna merah Mars melambangkan keteguhan dan daya juang. Aku akan selalu ada di sampingmu untuk mendukung setiap mimpi dan langkah baik yang kamu perjuangkan.",
  },
  Yupiter: {
    size: 10.5,
    tex: "jupiter.jpg",
    color: 0xcaa87a,
    indexStr: "PLANET // 05",
    type: "Raksasa Gas Terbesar",
    diameter: "139.820 km",
    distance: "778,5 Juta km",
    temp: "-110 °C",
    orbitDays: 4333,
    gravityFactor: 2.34,
    heroDesc:
      "Raksasa pelindung tata surya dengan badai Great Red Spot dan gravitasi perisai komet yang megah.",
    scienceFact:
      "Jupiter memiliki massa lebih dari dua kali lipat gabungan seluruh planet lainnya. Medan gravitasinya yang kuat menyerap tabrakan komet berbahaya dari luar.",
    romanticNote:
      "Sebagaimana Jupiter yang setia melindungi orbit sekelilingnya, aku ingin selalu menjadi sosok yang menjaga, mendengarkan, dan membuatmu merasa aman seutuhnya.",
  },
  Saturnus: {
    size: 9.0,
    tex: "saturn.jpg",
    color: 0xd9c39a,
    ring: true,
    indexStr: "PLANET // 06",
    type: "Permata Bermahkota Cincin",
    diameter: "116.460 km",
    distance: "1,43 Miliar km",
    temp: "-140 °C",
    orbitDays: 10759,
    gravityFactor: 1.06,
    heroDesc:
      "Objek paling menawan dengan sistem cincin es spektakuler yang membentang ratusan ribu kilometer.",
    scienceFact:
      "Cincin Saturnus membentang selebar 282.000 km namun tebalnya rata-rata hanya 10 meter. Tersusun atas 99% miliaran kristal es murni dengan Celah Cassini.",
    romanticNote:
      "Cincin Saturnus yang melingkar anggun adalah simbol keselarasan dan keharmonisan. Bersamamu, hal-hal sederhana selalu terasa begitu indah dan bermakna.",
  },
  Uranus: {
    size: 7.8,
    tex: "uranus.jpg",
    color: 0x9fd0d6,
    indexStr: "PLANET // 07",
    type: "Raksasa Es Berotasi Miring",
    diameter: "50.724 km",
    distance: "2,87 Miliar km",
    temp: "-224 °C",
    orbitDays: 30687,
    gravityFactor: 0.92,
    heroDesc:
      "Raksasa es toska unik yang berotasi menggelinding miring pada bidang orbitnya.",
    scienceFact:
      "Uranus memiliki kemiringan poros rotasi ekstrem 97,8°. Metana di atmosfer atasnya menyerap cahaya merah dan menghasilkan rona biru kehijauan yang tenang.",
    romanticNote:
      "Keunikan Uranus mengingatkanku pada pribadimu yang selalu membawa keceriaan, tawa manis, dan warna-warni menyenangkan dalam hidupku.",
  },
  Neptunus: {
    size: 7.5,
    tex: "neptune.jpg",
    color: 0x3d5ce0,
    indexStr: "PLANET // 08",
    type: "Dunia Azure Angin Supersonik",
    diameter: "49.244 km",
    distance: "4,50 Miliar km",
    temp: "-218 °C",
    orbitDays: 60190,
    gravityFactor: 1.19,
    heroDesc:
      "Planet terjauh di tepian tata surya dengan warna biru samudra kosmik dan badai angin supersonik.",
    scienceFact:
      "Neptunus memiliki kecepatan angin tercepat di tata surya yang mencapai 2.100 km/jam. Membutuhkan waktu 165 tahun Bumi untuk satu kali revolusi mengitari Matahari.",
    romanticNote:
      "Berada di batas terjauh tata surya ini membuktikan bahwa sejauh apa pun jarak dan waktu, doa baik dan rasa sayangku untukmu tak akan pernah pudar.",
  },
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialized = useRef(false);

  const [activePlanetName, setActivePlanetName] = useState<PlanetName>("Bumi");
  const [viewMode, setViewMode] = useState<"orbit" | "dome">("orbit");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"science" | "lab" | "constellations" | "love">("science");
  const [userWeight, setUserWeight] = useState<number>(45);
  const [userAge, setUserAge] = useState<number>(20);
  
  // Stellarium Toggles
  const [showConstellations, setShowConstellations] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showMilkyWayDome, setShowMilkyWayDome] = useState<boolean>(true);
  const [timeMultiplier, setTimeMultiplier] = useState<number>(1);
  const [selectedCelestial, setSelectedCelestial] = useState<CelestialObject | null>(null);

  const [showCosmoModal, setShowCosmoModal] = useState(false);
  const [cosmoInput, setCosmoInput] = useState("");
  const [cosmoReply, setCosmoReply] = useState("");
  const [cosmoLoading, setCosmoLoading] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const navigateToPlanetRef = useRef<(name: PlanetName) => void>(() => {});
  const switchViewModeRef = useRef<(mode: "orbit" | "dome") => void>(() => {});
  const focusCelestialRef = useRef<(obj: CelestialObject) => void>(() => {});
  const triggerSatelliteLaunchRef = useRef<() => void>(() => {});

  const timeMultiplierRef = useRef<number>(1);
  const constellationGroupRef = useRef<THREE.Group | null>(null);
  const gridGroupRef = useRef<THREE.Group | null>(null);
  const skyDomeMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    timeMultiplierRef.current = timeMultiplier;
  }, [timeMultiplier]);

  useEffect(() => {
    if (constellationGroupRef.current) constellationGroupRef.current.visible = showConstellations;
  }, [showConstellations]);

  useEffect(() => {
    if (gridGroupRef.current) gridGroupRef.current.visible = showGrid;
  }, [showGrid]);

  useEffect(() => {
    if (skyDomeMeshRef.current) skyDomeMeshRef.current.visible = showMilkyWayDome;
  }, [showMilkyWayDome]);

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
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "satellite") {
        [659.25, 830.61, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.09, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.3);
        });
      }
    } catch {}
  };

  const askCosmo = async (customPrompt?: string) => {
    const query = customPrompt || cosmoInput;
    if (!query) return;
    setCosmoLoading(true);
    setCosmoReply("");
    playSfx("click");

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
      } else {
        setCosmoReply(data.error || "Sinyal radio terganggu medan magnet kosmik.");
      }
    } catch {
      setCosmoReply("Cosmo: Langit antariksa sangat cerah hari ini, Nana!");
    } finally {
      setCosmoLoading(false);
    }
  };

  useEffect(() => {
    if (initialized.current || !canvasRef.current) return;
    initialized.current = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 4500);

    // Initial camera position for Bumi (Giant Cinematic Bottom Arc)
    const initialPos = [180, -4.2, 0];
    const initialSize = DATA["Bumi"].size;
    camera.position.set(initialPos[0], initialPos[1] + initialSize * 0.45, initialPos[2] + initialSize * 1.62);

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
    controls.minDistance = 3;
    controls.maxDistance = 550;
    controls.target.set(initialPos[0], initialPos[1] - initialSize * 0.65, initialPos[2]);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;

    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(180, 25, 30);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    rimLight.position.set(180, -10, -20);
    scene.add(rimLight);

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

    // HELPER: CREATE SMOOTH CIRCULAR STAR TEXTURE
    const createCircularStarTexture = (colorStr: string = "#ffffff", glowStr: string = "rgba(56, 189, 248, 0.6)") => {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext("2d");
      if (!ctx) return new THREE.Texture();
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, colorStr);
      grad.addColorStop(0.2, glowStr);
      grad.addColorStop(0.6, "rgba(56, 189, 248, 0.15)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    };

    const starSpriteTex = createCircularStarTexture("#ffffff", "rgba(255, 255, 255, 0.7)");
    const nodeStarSpriteTex = createCircularStarTexture("#fef08a", "rgba(250, 204, 21, 0.8)");

    // 1. UNSPLASH 360° SKY DOME PANORAMA (Photorealistic Milky Way & Deep Space Cosmos)
    const skyGeo = new THREE.SphereGeometry(2200, 64, 64);
    const skyMat = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.65,
    });
    texLoader.load("/textures/milkyway_skydome.jpg", (tex) => {
      skyMat.map = tex;
      skyMat.needsUpdate = true;
    });
    const skyDomeMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDomeMesh);
    skyDomeMeshRef.current = skyDomeMesh;

    // 2. PROCEDURAL PINPOINT STAR PARTICLES
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
      const r = 600 + Math.random() * 1400;
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
      size: 2.0,
      map: starSpriteTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starfieldMesh = new THREE.Points(starGeo, starMat);
    scene.add(starfieldMesh);

    // 3. STELLARIUM CELESTIAL GRID (Subtle Lines)
    const gridGroup = new THREE.Group();
    for (let lat = -60; lat <= 60; lat += 30) {
      const r = 520 * Math.cos((lat * Math.PI) / 180);
      const y = 520 * Math.sin((lat * Math.PI) / 180);
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      for (let a = 0; a <= 64; a++) {
        const theta = (a / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r));
      }
      ringGeo.setFromPoints(points);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: lat === 0 ? 0.18 : 0.06,
      });
      gridGroup.add(new THREE.Line(ringGeo, ringMat));
    }
    for (let lon = 0; lon < 360; lon += 45) {
      const rad = (lon * Math.PI) / 180;
      const points: THREE.Vector3[] = [];
      for (let lat = -85; lat <= 85; lat += 5) {
        const theta = (lat * Math.PI) / 180;
        points.push(
          new THREE.Vector3(
            520 * Math.cos(theta) * Math.cos(rad),
            520 * Math.sin(theta),
            520 * Math.cos(theta) * Math.sin(rad)
          )
        );
      }
      const lonGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lonMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.06,
      });
      gridGroup.add(new THREE.Line(lonGeo, lonMat));
    }
    gridGroup.visible = false;
    scene.add(gridGroup);
    gridGroupRef.current = gridGroup;

    // 4. STELLARIUM 3D CONSTELLATIONS LAYER (DELICATE GLOWING LINES & ROUND NODES)
    const constGroup = new THREE.Group();
    CONSTELLATIONS.forEach((c) => {
      const linePoints: THREE.Vector3[] = [];
      c.lines.forEach(([i1, i2]) => {
        const s1 = c.stars[i1];
        const s2 = c.stars[i2];
        linePoints.push(new THREE.Vector3(s1[0] * 1.6, s1[1] * 1.6, s1[2] * 1.6));
        linePoints.push(new THREE.Vector3(s2[0] * 1.6, s2[1] * 1.6, s2[2] * 1.6));
      });

      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
      });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      constGroup.add(lines);

      const starNodeGeo = new THREE.BufferGeometry();
      const nodePositions = new Float32Array(c.stars.length * 3);
      c.stars.forEach((s, idx) => {
        nodePositions[idx * 3] = s[0] * 1.6;
        nodePositions[idx * 3 + 1] = s[1] * 1.6;
        nodePositions[idx * 3 + 2] = s[2] * 1.6;
      });
      starNodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
      const starNodeMat = new THREE.PointsMaterial({
        size: 5.0,
        map: nodeStarSpriteTex,
        color: 0xfef08a,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const starNodes = new THREE.Points(starNodeGeo, starNodeMat);
      constGroup.add(starNodes);
    });
    scene.add(constGroup);
    constellationGroupRef.current = constGroup;

    // 5. STELLARIUM DEEP-SKY OBJECTS
    DEEP_SKY_OBJECTS.forEach((dso) => {
      const dsoGeo = new THREE.SphereGeometry(5.0, 16, 16);
      const dsoMat = new THREE.MeshBasicMaterial({
        color: dso.color,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const dsoMesh = new THREE.Mesh(dsoGeo, dsoMat);
      dsoMesh.position.set(dso.pos[0] * 1.6, dso.pos[1] * 1.6, dso.pos[2] * 1.6);
      constGroup.add(dsoMesh);
    });

    // 6. SATURN RING TEXTURE
    const createSaturnRingTexture = () => {
      const size = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.Texture();

      const cx = size / 2;
      const cy = size / 2;
      const rInner = size * 0.32;
      const rOuter = size * 0.48;

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

    // 7. 3D PLANETS SYSTEM (Widely spaced coordinates)
    const group3D: Record<string, THREE.Group> = {};
    const basePositions: Record<PlanetName, [number, number, number]> = {
      Matahari: [0, -4.2, 0],
      Merkurius: [60, -4.2, 0],
      Venus: [120, -4.2, 0],
      Bumi: [180, -4.2, 0],
      Mars: [240, -4.2, 0],
      Yupiter: [330, -4.2, 0],
      Saturnus: [440, -4.2, 0],
      Uranus: [550, -4.2, 0],
      Neptunus: [650, -4.2, 0],
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
          roughness: 0.55,
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
        const moonGeo = new THREE.SphereGeometry(d.size * 0.25, 32, 32);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xc8c8c8, roughness: 0.85 });
        texLoader.load("/textures/moon.jpg", (tex) => {
          moonMat.map = tex;
          moonMat.needsUpdate = true;
        });
        const moon = new THREE.Mesh(moonGeo, moonMat);
        moon.position.set(d.size + 3.8, 0, 0);
        moon.userData = { isMoon: true };
        grp.add(moon);
      }

      if (d.ring) {
        const ringGeo = new THREE.PlaneGeometry(d.size * 2.8, d.size * 2.8);
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

    // 8. ACTIVE SATELLITE ORBITERS
    const activeSatellites: THREE.Group[] = [];
    const launchSatellite = () => {
      const currentGrp = group3D[activeKey];
      const pData = DATA[activeKey];
      const sat = new THREE.Group();

      const satBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.6, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 })
      );
      const wings = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.04, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.1 })
      );
      sat.add(satBody);
      sat.add(wings);

      sat.position.copy(currentGrp.position);
      sat.userData = {
        center: currentGrp.position,
        radius: pData.size + 3.2 + Math.random() * 1.5,
        speed: 1.2 + Math.random() * 0.8,
        angle: Math.random() * Math.PI * 2,
        inclination: (Math.random() - 0.5) * 0.8,
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

      const grp = group3D[name];
      const pData = DATA[name];
      const targetPos = grp.position;
      const R = pData.size;

      keyLight.position.set(targetPos.x, targetPos.y + 25, targetPos.z + 30);
      rimLight.position.set(targetPos.x, targetPos.y - 10, targetPos.z - 20);

      gsap.to(controls.target, {
        x: targetPos.x,
        y: targetPos.y - R * 0.65,
        z: targetPos.z,
        duration: 1.4,
        ease: "power3.inOut",
      });
      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y + R * 0.45,
        z: targetPos.z + R * 1.62,
        duration: 1.4,
        ease: "power3.inOut",
      });

      setActivePlanetName(name);
    }
    navigateToPlanetRef.current = navigateToPlanet;

    function switchViewMode(mode: "orbit" | "dome") {
      playSfx("whoosh");
      if (mode === "dome") {
        gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: 1.6, ease: "power3.inOut" });
        gsap.to(camera.position, { x: 0, y: 20, z: 60, duration: 1.6, ease: "power3.inOut" });
        controls.minDistance = 2;
        controls.maxDistance = 500;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.4;
      } else {
        const grp = group3D[activeKey];
        const pData = DATA[activeKey];
        const targetPos = grp.position;
        const R = pData.size;
        gsap.to(controls.target, {
          x: targetPos.x,
          y: targetPos.y - R * 0.65,
          z: targetPos.z,
          duration: 1.5,
          ease: "power3.inOut",
        });
        gsap.to(camera.position, {
          x: targetPos.x,
          y: targetPos.y + R * 0.45,
          z: targetPos.z + R * 1.62,
          duration: 1.5,
          ease: "power3.inOut",
        });
        controls.minDistance = 3;
        controls.maxDistance = 100;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.2;
      }
      setViewMode(mode);
    }
    switchViewModeRef.current = switchViewMode;

    function focusCelestial(obj: CelestialObject) {
      playSfx("target");
      setSelectedCelestial(obj);
      gsap.to(controls.target, {
        x: obj.pos[0] * 1.6,
        y: obj.pos[1] * 1.6,
        z: obj.pos[2] * 1.6,
        duration: 1.4,
        ease: "power3.inOut",
      });
      gsap.to(camera.position, {
        x: obj.pos[0] * 0.7,
        y: obj.pos[1] * 0.7 + 10,
        z: obj.pos[2] * 0.7,
        duration: 1.4,
        ease: "power3.inOut",
      });
    }
    focusCelestialRef.current = focusCelestial;

    let animFrameId: number;
    const clock = new THREE.Clock();

    function animate() {
      animFrameId = requestAnimationFrame(animate);
      const speedFactor = timeMultiplierRef.current;
      const t = clock.getElapsedTime() * speedFactor;

      starfieldMesh.rotation.y = t * 0.002;
      constGroup.rotation.y = t * 0.001;
      gridGroup.rotation.y = t * 0.001;
      if (skyDomeMeshRef.current) {
        skyDomeMeshRef.current.rotation.y = t * 0.0006;
      }

      activeSatellites.forEach((sat) => {
        const u = sat.userData;
        u.angle += 0.02 * u.speed * speedFactor;
        sat.position.x = u.center.x + Math.cos(u.angle) * u.radius;
        sat.position.z = u.center.z + Math.sin(u.angle) * u.radius;
        sat.position.y = u.center.y + Math.sin(u.angle * 2) * u.inclination * u.radius;
        sat.rotation.y = -u.angle;
      });

      ORDER.forEach((name) => {
        const grp = group3D[name];
        if (grp) {
          grp.children.forEach((c) => {
            if (c.userData.isMoon) {
              const R = DATA[name].size + 3.8;
              c.position.x = Math.cos(t * 0.7) * R;
              c.position.z = Math.sin(t * 0.7) * R;
            } else if (c instanceof THREE.Mesh && c.geometry instanceof THREE.SphereGeometry) {
              c.rotation.y += 0.003 * speedFactor;
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

  const prevPlanetName = ORDER[(currentIdx - 1 + ORDER.length) % ORDER.length];
  const nextPlanetName = ORDER[(currentIdx + 1) % ORDER.length];

  const calculatedWeight = Math.round(userWeight * currentPlanet.gravityFactor * 10) / 10;
  const calculatedAge = Math.round((userAge * 365.25 / currentPlanet.orbitDays) * 10) / 10;

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
          <span className="brand-badge">STELLARIUM EDITION</span>
        </div>

        <div className="nav-links-wrap">
          <button
            className={`nav-link-btn ${viewMode === "orbit" && !drawerOpen ? "active" : ""}`}
            onClick={() => {
              playSfx("click");
              setDrawerOpen(false);
              switchViewModeRef.current("orbit");
            }}
          >
            Planets
          </button>
          <button
            className={`nav-link-btn ${drawerOpen && activeTab === "constellations" ? "active" : ""}`}
            onClick={() => {
              playSfx("click");
              setActiveTab("constellations");
              setDrawerOpen(true);
            }}
          >
            Constellations ({CONSTELLATIONS.length})
          </button>
          <button
            className={`nav-link-btn ${drawerOpen && activeTab === "lab" ? "active" : ""}`}
            onClick={() => {
              playSfx("click");
              setActiveTab("lab");
              setDrawerOpen(true);
            }}
          >
            Lab & Gravity
          </button>
          <button
            className={`nav-link-btn ${drawerOpen && activeTab === "science" ? "active" : ""}`}
            onClick={() => {
              playSfx("click");
              setActiveTab("science");
              setDrawerOpen(true);
            }}
          >
            Science Facts
          </button>
          <button
            className={`nav-link-btn ${drawerOpen && activeTab === "love" ? "active" : ""}`}
            onClick={() => {
              playSfx("click");
              setActiveTab("love");
              setDrawerOpen(true);
            }}
          >
            Notes for Nana
          </button>
        </div>

        <div className="nav-right-cluster">
          <button
            className={`view-mode-pill ${viewMode === "dome" ? "active" : ""}`}
            onClick={() => {
              switchViewModeRef.current(viewMode === "orbit" ? "dome" : "orbit");
            }}
            title="Ganti antara Mode Eksplorasi Planet & Mode Kubah Langit 360 Stellarium"
          >
            {viewMode === "orbit" ? "🔭 360° Sky Dome" : "🪐 Planet Orbit"}
          </button>

          <button
            className="nav-cta-btn"
            onClick={() => {
              playSfx("click");
              setShowCosmoModal(true);
            }}
          >
            Ask Cosmo AI
          </button>
        </div>
      </nav>

      {/* HERO SECTION (Shown in Orbit Mode) */}
      {viewMode === "orbit" && (
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
      )}

      {/* SIDE PEEK NAVIGATION (Shown in Orbit Mode) */}
      {viewMode === "orbit" && (
        <>
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
        </>
      )}

      {/* STELLARIUM DOCK (Floating Bottom Control Bar) */}
      <div className={`stellarium-dock ${drawerOpen ? "hidden-dock" : ""}`}>
        <button
          className={`dock-btn ${showConstellations ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setShowConstellations(!showConstellations);
          }}
          title="Toggle Garis Rasi Bintang"
        >
          ✨ Constellations
        </button>

        <button
          className={`dock-btn ${showMilkyWayDome ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setShowMilkyWayDome(!showMilkyWayDome);
          }}
          title="Toggle Panorama Galaksi Bimasakti"
        >
          🌌 Milky Way
        </button>

        <button
          className={`dock-btn ${showGrid ? "active" : ""}`}
          onClick={() => {
            playSfx("click");
            setShowGrid(!showGrid);
          }}
          title="Toggle Grid Koordinat Langit (RA/Dec)"
        >
          🌐 Celestial Grid
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

      {/* CELESTIAL RETICLE HUD (When an object is selected) */}
      {selectedCelestial && (
        <div className="celestial-hud-card">
          <div className="hud-title-row">
            <div>
              <div className="hud-object-name">{selectedCelestial.name}</div>
              <div className="hud-object-type">{selectedCelestial.type}</div>
            </div>
            <button
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "16px" }}
              onClick={() => setSelectedCelestial(null)}
            >
              ✕
            </button>
          </div>

          <div className="hud-data-table">
            <div>
              <div className="hud-data-label">MAGNITUDO</div>
              <div className="hud-data-val">{selectedCelestial.mag}</div>
            </div>
            <div>
              <div className="hud-data-label">JARAK</div>
              <div className="hud-data-val">{selectedCelestial.distance}</div>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <div className="hud-data-label">KOORDINAT (RA / DEC)</div>
              <div className="hud-data-val">{selectedCelestial.raDec}</div>
            </div>
          </div>

          <div className="hud-desc">{selectedCelestial.desc}</div>
        </div>
      )}

      {/* 3D WEBGL CANVAS */}
      <canvas id="webgl-canvas" ref={canvasRef}></canvas>

      {/* INTERACTIVE LEARNING DRAWER */}
      <div id="info-drawer" className={drawerOpen ? "open" : ""}>
        <div className="drawer-close-bar" onClick={() => setDrawerOpen(false)} title="Tutup Panel"></div>

        <div className="drawer-header">
          <h2 className="drawer-planet-name">{activePlanetName} — {currentPlanet.type}</h2>

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
              className={`drawer-tab-btn ${activeTab === "constellations" ? "active" : ""}`}
              onClick={() => {
                playSfx("click");
                setActiveTab("constellations");
              }}
            >
              ✨ Rasi Bintang
            </button>
            <button
              className={`drawer-tab-btn ${activeTab === "lab" ? "active" : ""}`}
              onClick={() => {
                playSfx("click");
                setActiveTab("lab");
              }}
            >
              Lab & Waktu
            </button>
            <button
              className={`drawer-tab-btn ${activeTab === "love" ? "active" : ""}`}
              onClick={() => {
                playSfx("click");
                setActiveTab("love");
              }}
            >
              Catatan Manis
            </button>
          </div>
        </div>

        {activeTab === "science" && (
          <div>
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-lbl">DIAMETER</div>
                <div className="metric-val">{currentPlanet.diameter}</div>
              </div>
              <div className="metric-item">
                <div className="metric-lbl">JARAK ORBIT</div>
                <div className="metric-val">{currentPlanet.distance}</div>
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

            <div className="drawer-desc-box">
              {currentPlanet.scienceFact}
            </div>
          </div>
        )}

        {activeTab === "constellations" && (
          <div>
            <p style={{ fontSize: "12.5px", color: "var(--accent-cyan)", marginBottom: "12px", fontWeight: 600 }}>
              🔭 Klik objek untuk mengarahkan bidikan teleskop (*Ocular Reticle Target*):
            </p>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px" }}>
                OBJEK LANGIT DALAM (MESSIER CATALOG):
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {DEEP_SKY_OBJECTS.map((dso) => (
                  <div
                    key={dso.id}
                    className="const-item-card"
                    onClick={() => {
                      focusCelestialRef.current(dso);
                      setDrawerOpen(false);
                    }}
                  >
                    <div className="const-item-title">🌌 {dso.name}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>{dso.type} • {dso.distance}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px" }}>
              RASI BINTANG RESMI (IAU SKY CULTURES):
            </div>
            <div className="constellation-list">
              {CONSTELLATIONS.map((c) => (
                <div
                  key={c.id}
                  className="const-item-card"
                  onClick={() => {
                    const dsoLike: CelestialObject = {
                      id: c.id,
                      name: `${c.name} (${c.indonesian})`,
                      type: `Rasi Bintang • ${c.english}`,
                      mag: "Bervariasi",
                      raDec: "Katalog Rasi IAU",
                      distance: "Puluhan s/d Ratusan Tahun Cahaya",
                      desc: `${c.meaning} ${c.lore}`,
                      pos: c.center,
                      color: 0x38bdf8,
                    };
                    focusCelestialRef.current(dsoLike);
                    setDrawerOpen(false);
                  }}
                >
                  <div className="const-item-title">✨ {c.name} ({c.indonesian})</div>
                  <div className="const-item-meaning">{c.meaning}</div>
                </div>
              ))}
            </div>
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
          <div className="drawer-desc-box" style={{ fontStyle: "italic", borderLeft: "3px solid #f6cd7c" }}>
            {currentPlanet.romanticNote}
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

      {/* AI COSMO MODAL */}
      <div id="cosmo-modal" className={showCosmoModal ? "show" : ""}>
        <div className="cosmo-dialog">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff" }}>
              Cosmo AI — Asisten Antariksa
            </h3>
            <button
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "16px" }}
              onClick={() => setShowCosmoModal(false)}
            >
              ✕
            </button>
          </div>

          <p style={{ fontSize: "12.5px", color: "#94a3b8" }}>
            Tanyakan apa saja seputar misteri astronomi, rasi bintang Stellarium, atau fakta planet {activePlanetName}!
          </p>

          <div className="cosmo-input-row">
            <input
              type="text"
              className="cosmo-input-field"
              placeholder="Tanyakan ke Cosmo..."
              value={cosmoInput}
              onChange={(e) => setCosmoInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askCosmo()}
            />
            <button
              className="cosmo-send-btn"
              onClick={() => askCosmo()}
              disabled={cosmoLoading}
            >
              {cosmoLoading ? "..." : "Tanya"}
            </button>
          </div>

          {cosmoReply && (
            <div className="cosmo-feed">
              {cosmoReply}
            </div>
          )}
        </div>
      </div>

      {/* LOADER */}
      <div id="loader">
        <div style={{ color: "#ffffff", fontSize: "12px", letterSpacing: "2px", fontWeight: 600 }}>
          COSMONANA // INITIALIZING STELLARIUM OBSERVATORY...
        </div>
        <div className="loader-bar">
          <div className="loader-fill" id="loader-fill"></div>
        </div>
      </div>
    </>
  );
}
