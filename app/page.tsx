"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

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
    size: 22.0,
    tex: "sun.jpg",
    color: 0xffdd88,
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
      "Terima kasih sudah selalu menjadi sumber energi baik dan kehangatan dalam hari-hari mas. Di tengah segala rutinitas dan lelahnya beraktivitas, kabar dan senyumanmu selalu berhasil menghadirkan rasa tenang. Semoga harimu selalu dipenuhi kebaikan dan kelancaran yaa, cantikku sayang. ☀️🤍",
  },
  Merkurius: {
    size: 6.5,
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
      "Di tengah dunia yang sering bergerak serba cepat dan penuh tuntutan, mas harap kamu selalu ingat untuk mengambil jeda dan bernapas lega yaa sayang. Jangan terlalu keras pada dirimu sendiri, setiap proses dan usaha yang kamu jalani sangat berharga. Mas akan selalu ada di sini mendukungmu. ✨",
  },
  Venus: {
    size: 9.2,
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
      "Venus mungkin menjadi objek paling bercahaya di langit senja, tetapi ketulusan, kebaikan hati, dan caramu memperlakukan orang lain selalu punya tempat yang jauh lebih istimewa. Tetaplah menjadi dirimu yang apa adanya, dengan segala ketulusan yang kamu miliki, cintaku. 💖",
  },
  Bumi: {
    size: 10.0,
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
      "Dari luasnya semesta yang dingin dan tak terhingga, dipertemukan dan bisa saling menjaga denganmu adalah salah satu takdir terindah yang selalu mas syukuri setiap hari. Terima kasih sudah mau berproses, belajar, dan melangkah bersama, sayangku. 🌍🫶",
  },
  Mars: {
    size: 7.5,
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
      "Setiap perjalanan dan impian baik selalu membutuhkan ketabahan. Apa pun tantangan atau hal berat yang sedang kamu hadapi, percayalah bahwa kamu memiliki ketangguhan hati yang luar biasa, sayang. Mas selalu bangga padamu dan siap mendampingi setiap langkahmu. 🚀",
  },
  Yupiter: {
    size: 16.0,
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
      "Sebagaimana Yupiter yang hadir menjaga keseimbangan tata surya, mas ingin selalu menjadi ruang yang aman dan nyaman untukmu—tempat kamu bisa menceritakan apa saja, menaruh lelah, dan selalu merasa dimengerti tanpa perlu merasa sendirian, cintaku sayang. 🪐",
  },
  Saturnus: {
    size: 13.5,
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
      "Keindahan yang menawan lahir dari keselarasan dan kesabaran. Kehadiranmu membawa keteduhan dan harmoni tersendiri dalam hidup mas. Terima kasih atas setiap perhatian tulus dan kebaikan yang selalu kamu bawa ke dalam hari-hari kita, cantikku sayang. ✨🤍",
  },
  Uranus: {
    size: 11.0,
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
      "Uranus mengajarkan bahwa memiliki poros dan cara tersendiri bukanlah kekurangan, melainkan keistimewaan. Sudut pandangmu yang unik, kehangatanmu, dan caramu menyayangi adalah hal-hal yang membuatmu begitu istimewa di mata mas, sayangku. 💙",
  },
  Neptunus: {
    size: 10.5,
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
      "Bahkan di titik terjauh yang paling hening di tepian tata surya, rasa tenang dan teduh selalu hadir saat mengingatmu. Di mana pun kamu berada, semoga kamu selalu merasa dijaga dalam doa, dihargai, dan dicintai sepenuh hati, cintaku sayang. 🌌✨",
  },
};

const PLANET_COORDS: Record<PlanetName, [number, number, number]> = {
  Matahari: [0, 0, 0],
  Merkurius: [70, 0, 0],
  Venus: [140, 0, 0],
  Bumi: [220, 0, 0],
  Mars: [310, 0, 0],
  Yupiter: [430, 0, 0],
  Saturnus: [570, 0, 0],
  Uranus: [710, 0, 0],
  Neptunus: [850, 0, 0],
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialized = useRef(false);

  const [activePlanetName, setActivePlanetName] = useState<PlanetName>("Bumi");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"science" | "lab" | "map" | "love">("science");
  const [userWeight, setUserWeight] = useState<number>(45);
  const [userAge, setUserAge] = useState<number>(20);
  
  const [showMilkyWay, setShowMilkyWay] = useState<boolean>(true);
  const [timeMultiplier, setTimeMultiplier] = useState<number>(1);
  const [showPingToast, setShowPingToast] = useState<boolean>(false);

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
  const zoomInRef = useRef<() => void>(() => {});
  const zoomOutRef = useRef<() => void>(() => {});
  const resetViewRef = useRef<() => void>(() => {});
  const focusOnRouteRef = useRef<() => void>(() => {});

  const earthPulseRef = useRef<{
    mesh: THREE.Mesh;
    curve: THREE.QuadraticBezierCurve3;
    jogjaRing: THREE.Mesh;
    bogorRing: THREE.Mesh;
  } | null>(null);

  const timeMultiplierRef = useRef<number>(1);
  const skyDomeMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    timeMultiplierRef.current = timeMultiplier;
  }, [timeMultiplier]);

  useEffect(() => {
    if (skyDomeMeshRef.current) skyDomeMeshRef.current.visible = showMilkyWay;
  }, [showMilkyWay]);

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

  const askDhani = async (customPrompt?: string) => {
    const query = customPrompt || dhaniInput;
    if (!query.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    // Append user outgoing message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "nana",
      text: query,
      time: timeStr,
    };

    const nextHistory = [...chatMessages, userMsg];
    setChatMessages(nextHistory);
    setDhaniInput("");
    setDhaniLoading(true);
    playSfx("click");

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          planet: activePlanetName,
          topic: activeTab === "science" ? "Fakta Sains & Anatomi Planet" : "Refleksi Manis & Keajaiban Semesta",
          history: nextHistory.slice(-8).map((m) => ({
            role: m.sender === "nana" ? "user" : "model",
            sender: m.sender,
            text: m.text,
          })),
        }),
      });
      const data = await res.json();
      const replyText =
        data.reply ||
        "Halo cantikku sayang. Di antara miliaran bintang di langit malam, hal yang paling bikin Mas bersyukur adalah bisa berjalan beriringan dan berbagi cerita sama kamu. ✨🤍";

      const dhaniMsg: ChatMessage = {
        id: `dhani-${Date.now()}`,
        sender: "dhani",
        text: replyText,
        time: timeStr,
      };
      setChatMessages((prev) => [...prev, dhaniMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `dhani-${Date.now()}`,
        sender: "dhani",
        text: "Halo sayangku, Mas Dhani selalu ada di sini nemenin kamu. Sinyal observatorium sempat berkedip sebentar tadi, tapi tanyakan apa saja lagi yaa, Mas siap temani. ✨🪐",
        time: timeStr,
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setDhaniLoading(false);
    }
  };

  useEffect(() => {
    if (initialized.current || !canvasRef.current) return;
    initialized.current = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 9500);

    const earthPos = PLANET_COORDS["Bumi"];
    const earthR = DATA["Bumi"].size;
    
    camera.position.set(earthPos[0], earthPos[1] + earthR * 0.32, earthPos[2] + earthR * 1.52);

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
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.2;
    controls.rotateSpeed = 0.8;
    controls.minDistance = 2.0;
    controls.maxDistance = 2200;
    controls.target.set(earthPos[0], earthPos[1] - earthR * 0.72, earthPos[2]);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.25;

    const ambient = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(earthPos[0], earthPos[1] + 35, earthPos[2] + 40);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    rimLight.position.set(earthPos[0], earthPos[1] - 15, earthPos[2] - 30);
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

    // 1. AUTHENTIC 360° MILKY WAY & CELESTIAL SKY DOME (Using User's Uploaded Texture)
    const skyDomeGeo = new THREE.SphereGeometry(3600, 64, 64);
    const skyDomeMat = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.88,
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
    scene.add(skyDome);
    skyDomeMeshRef.current = skyDome;

    // HELPER: SOFT RADIAL GLOW PARTICLE SPRITE
    const createNebulaGlowTexture = () => {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext("2d");
      if (!ctx) return new THREE.Texture();
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
      grad.addColorStop(0.25, "rgba(147, 197, 253, 0.7)");
      grad.addColorStop(0.6, "rgba(56, 189, 248, 0.15)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    };

    // HELPER: LAT/LON TO 3D CARTESIAN ON SPHERE
    const getEarthVector3 = (lat: number, lon: number, radius: number) => {
      const phi = THREE.MathUtils.degToRad(lat);
      const theta = THREE.MathUtils.degToRad(lon);
      const x = radius * Math.cos(phi) * Math.sin(theta);
      const y = radius * Math.sin(phi);
      const z = radius * Math.cos(phi) * Math.cos(theta);
      return new THREE.Vector3(x, y, z);
    };

    // 4. FULL LIVING SOLAR SYSTEM (All planets present in 3D space!)
    const planetMeshes: Record<string, THREE.Group> = {};
    const clickablePlanetMeshes: THREE.Object3D[] = [];

    ORDER.forEach((name) => {
      const d = DATA[name];
      const pos = PLANET_COORDS[name];
      const grp = new THREE.Group();
      grp.position.set(pos[0], pos[1], pos[2]);

      const sphereGeo = new THREE.SphereGeometry(d.size, 64, 64);
      let sphereMat: THREE.Material;

      if (name === "Matahari") {
        sphereMat = new THREE.MeshStandardMaterial({
          color: 0xffeedd,
          emissive: 0xffaa22,
          emissiveIntensity: 1.5,
          roughness: 0.2,
        });
        texLoader.load(`/textures/${d.tex}`, (tex) => {
          (sphereMat as THREE.MeshStandardMaterial).map = tex;
          (sphereMat as THREE.MeshStandardMaterial).emissiveMap = tex;
          sphereMat.needsUpdate = true;
        });
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
      sphere.userData = { planetName: name };
      grp.add(sphere);
      clickablePlanetMeshes.push(sphere);

      // 3D PETA RUTE JOGJA ⇄ BOGOR PADA BUMI
      if (name === "Bumi") {
        const earthRouteGroup = new THREE.Group();
        const R = d.size;

        const pJogja = getEarthVector3(-7.797, 110.37, R + 0.05);
        const pBogor = getEarthVector3(-6.595, 106.816, R + 0.05);

        // Elevated arc midpoint
        const midPoint = new THREE.Vector3()
          .addVectors(pJogja, pBogor)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(R + 0.95);

        const arcCurve = new THREE.QuadraticBezierCurve3(pJogja, midPoint, pBogor);

        // Glowing Neon Tube
        const tubeGeo = new THREE.TubeGeometry(arcCurve, 40, 0.08, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
          color: 0xec4899,
          transparent: true,
          opacity: 0.9,
        });
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
        earthRouteGroup.add(tubeMesh);

        // Core cyan laser line
        const linePoints = arcCurve.getPoints(50);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          linewidth: 2,
        });
        const lineMesh = new THREE.Line(lineGeo, lineMat);
        earthRouteGroup.add(lineMesh);

        // Jogja Marker (Mas Dhani - Cyan)
        const jogjaPin = new THREE.Group();
        jogjaPin.position.copy(pJogja);
        const jogjaCore = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        const jogjaRing = new THREE.Mesh(
          new THREE.RingGeometry(0.18, 0.38, 16),
          new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
          })
        );
        jogjaRing.lookAt(pJogja.clone().multiplyScalar(2));
        jogjaPin.add(jogjaCore);
        jogjaPin.add(jogjaRing);
        earthRouteGroup.add(jogjaPin);

        // Bogor Marker (Sayangku - Rose/Gold)
        const bogorPin = new THREE.Group();
        bogorPin.position.copy(pBogor);
        const bogorCore = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xf472b6 })
        );
        const bogorRing = new THREE.Mesh(
          new THREE.RingGeometry(0.18, 0.38, 16),
          new THREE.MeshBasicMaterial({
            color: 0xf472b6,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
          })
        );
        bogorRing.lookAt(pBogor.clone().multiplyScalar(2));
        bogorPin.add(bogorCore);
        bogorPin.add(bogorRing);
        earthRouteGroup.add(bogorPin);

        // Animated traveling pulse orb
        const pulseMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.15, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        pulseMesh.position.copy(pJogja);
        earthRouteGroup.add(pulseMesh);

        earthPulseRef.current = {
          mesh: pulseMesh,
          curve: arcCurve,
          jogjaRing,
          bogorRing,
        };

        sphere.add(earthRouteGroup);
      }

      if (d.moon) {
        const moonGeo = new THREE.SphereGeometry(d.size * 0.25, 32, 32);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xc8c8c8, roughness: 0.85 });
        texLoader.load("/textures/moon.jpg", (tex) => {
          moonMat.map = tex;
          moonMat.needsUpdate = true;
        });
        const moon = new THREE.Mesh(moonGeo, moonMat);
        moon.position.set(d.size + 4.5, 2.0, 0);
        moon.userData = { planetName: name, isMoon: true };
        grp.add(moon);
        clickablePlanetMeshes.push(moon);
      }

      if (d.ring) {
        const innerR = d.size * 1.24;
        const outerR = d.size * 2.38;
        const ringGeo = new THREE.RingGeometry(innerR, outerR, 128, 16);

        // Map radial UV from [0, 1] across inner to outer radius
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
        grp.add(ringMesh);
        clickablePlanetMeshes.push(ringMesh);

        // Realistic Saturn axial tilt of ~26.7°
        grp.rotation.z = THREE.MathUtils.degToRad(-26.7);
        grp.rotation.x = THREE.MathUtils.degToRad(12.0);
      }

      scene.add(grp);
      planetMeshes[name] = grp;
    });

    // 5. ACTIVE SATELLITE ORBITERS
    const activeSatellites: THREE.Group[] = [];
    const launchSatellite = () => {
      const pData = DATA[activeKey];
      const pPos = PLANET_COORDS[activeKey];
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

      sat.position.set(pPos[0], pPos[1], pPos[2]);
      sat.userData = {
        center: new THREE.Vector3(pPos[0], pPos[1], pPos[2]),
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

      const pos = PLANET_COORDS[name];
      const R = DATA[name].size;

      keyLight.position.set(pos[0], pos[1] + 35, pos[2] + 40);
      rimLight.position.set(pos[0], pos[1] - 15, pos[2] - 30);

      gsap.to(controls.target, {
        x: pos[0],
        y: pos[1] - R * 0.72,
        z: pos[2],
        duration: 1.4,
        ease: "power3.inOut",
      });

      gsap.to(camera.position, {
        x: pos[0],
        y: pos[1] + R * 0.32,
        z: pos[2] + R * 1.52,
        duration: 1.4,
        ease: "power3.inOut",
      });

      setActivePlanetName(name);
    }
    navigateToPlanetRef.current = navigateToPlanet;

    zoomInRef.current = () => {
      playSfx("click");
      const dir = new THREE.Vector3().subVectors(controls.target, camera.position).normalize();
      gsap.to(camera.position, {
        x: camera.position.x + dir.x * 6,
        y: camera.position.y + dir.y * 6,
        z: camera.position.z + dir.z * 6,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    zoomOutRef.current = () => {
      playSfx("click");
      const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
      gsap.to(camera.position, {
        x: camera.position.x + dir.x * 12,
        y: camera.position.y + dir.y * 12,
        z: camera.position.z + dir.z * 12,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    resetViewRef.current = () => {
      playSfx("whoosh");
      const pos = PLANET_COORDS[activeKey];
      const R = DATA[activeKey].size;
      gsap.to(controls.target, {
        x: pos[0],
        y: pos[1] - R * 0.72,
        z: pos[2],
        duration: 1.0,
        ease: "power3.inOut",
      });
      gsap.to(camera.position, {
        x: pos[0],
        y: pos[1] + R * 0.32,
        z: pos[2] + R * 1.52,
        duration: 1.0,
        ease: "power3.inOut",
      });
    };

    focusOnRouteRef.current = () => {
      playSfx("whoosh");
      const earthPos = PLANET_COORDS["Bumi"];
      const R = DATA["Bumi"].size;
      gsap.to(controls.target, {
        x: earthPos[0],
        y: earthPos[1],
        z: earthPos[2],
        duration: 1.2,
        ease: "power3.inOut",
      });
      const pMid = getEarthVector3(-7.2, 108.6, R * 1.6);
      gsap.to(camera.position, {
        x: earthPos[0] + pMid.x,
        y: earthPos[1] + pMid.y + 1.5,
        z: earthPos[2] + pMid.z,
        duration: 1.2,
        ease: "power3.inOut",
      });
    };

    // 6. 3D RAYCASTER FOR INTERACTIVE PLANET CLICKS & HOVER
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

      if (skyDomeMeshRef.current) {
        skyDomeMeshRef.current.rotation.y = t * 0.0004;
      }

      // Route pulse and beacon rings animation on Earth
      if (earthPulseRef.current?.mesh && earthPulseRef.current.curve) {
        const progress = (Math.sin(clock.getElapsedTime() * 2.2) + 1) / 2;
        const pt = earthPulseRef.current.curve.getPoint(progress);
        earthPulseRef.current.mesh.position.copy(pt);

        const ringScale = 1 + Math.sin(clock.getElapsedTime() * 4) * 0.25;
        if (earthPulseRef.current.jogjaRing) {
          earthPulseRef.current.jogjaRing.scale.set(ringScale, ringScale, 1);
        }
        if (earthPulseRef.current.bogorRing) {
          earthPulseRef.current.bogorRing.scale.set(ringScale, ringScale, 1);
        }
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
        const grp = planetMeshes[name];
        if (grp) {
          grp.children.forEach((c) => {
            if (c.userData.isMoon) {
              const R = DATA[name].size + 4.5;
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
            Science Facts
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
          {/* SOLAR SYSTEM SCOPE LIVE ORRERY BUTTON */}
          <button
            className="view-mode-pill"
            onClick={() => {
              playSfx("click");
              setShowOrreryModal(true);
            }}
            title="Buka Simulasi Orbit Real-Time Solar System Scope"
          >
            🪐 Live Orrery 3D
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
                  askDhani(`Mas Dhani, ceritain hal paling menarik dan menakjubkan tentang planet ${activePlanetName} dong! ✨`)
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
                  askDhani(`Mas, apa pemandangan paling indah kalau kita mengamati ${activePlanetName} dari dekat? ✨`)
                }
              >
                🌌 Keindahan {activePlanetName}
              </button>
              <button
                className="chat-faq-chip"
                onClick={() =>
                  askDhani(`Mas Dhani, kalau kita menjelajah semesta ke ${activePlanetName}, apa hal pertama yang bakal kita pelajari? 🚀`)
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
              className={`drawer-tab-btn ${activeTab === "lab" ? "active" : ""}`}
              onClick={() => {
                playSfx("click");
                setActiveTab("lab");
              }}
            >
              Lab & Waktu
            </button>
            {activePlanetName === "Bumi" && (
              <button
                className={`drawer-tab-btn ${activeTab === "map" ? "active" : ""}`}
                onClick={() => {
                  playSfx("click");
                  setActiveTab("map");
                }}
              >
                🗺️ Rute Jogja ⇄ Bogor
              </button>
            )}
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

        {activeTab === "map" && activePlanetName === "Bumi" && (
          <div className="earth-route-container">
            <div className="earth-radar-map-card">
              <div className="radar-header">
                <div className="radar-title-badge">
                  <span>🗺️</span> Peta Rute: Jogja ⇄ Bogor
                </div>
                <div className="radar-live-indicator">
                  <div className="radar-live-dot"></div>
                  <span>TERHUBUNG LANGSUNG</span>
                </div>
              </div>

              {/* RADAR SVG MAP VISUALIZER */}
              <div className="radar-svg-wrapper">
                <svg
                  className="radar-svg"
                  viewBox="0 0 500 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Radar Circular Grids */}
                  <circle cx="250" cy="100" r="90" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="250" cy="100" r="60" stroke="rgba(56, 189, 248, 0.18)" strokeWidth="1" />
                  <circle cx="250" cy="100" r="30" stroke="rgba(56, 189, 248, 0.22)" strokeWidth="1" />
                  <line x1="250" y1="10" x2="250" y2="190" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />
                  <line x1="160" y1="100" x2="340" y2="100" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />

                  {/* Rotating Radar Sweep Line */}
                  <line
                    x1="250"
                    y1="100"
                    x2="340"
                    y2="100"
                    stroke="url(#radarGradient)"
                    strokeWidth="2"
                    className="radar-sweep-line"
                  />

                  <defs>
                    <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(56, 189, 248, 0.8)" />
                      <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                    </linearGradient>
                    <linearGradient id="routeLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f472b6" />
                      <stop offset="50%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>

                  {/* Stylized Java Island Coast Outline */}
                  <path
                    d="M 60,110 Q 110,85 160,95 Q 230,80 320,105 Q 400,115 440,110 Q 420,135 340,130 Q 220,135 120,130 Z"
                    fill="rgba(56, 189, 248, 0.06)"
                    stroke="rgba(56, 189, 248, 0.3)"
                    strokeWidth="1.5"
                  />

                  {/* Connection Arc Line (Bogor to Jogja) */}
                  <path
                    d="M 120,105 Q 240,45 360,115"
                    fill="none"
                    stroke="url(#routeLineGrad)"
                    strokeWidth="2.5"
                    className="radar-route-dash"
                  />

                  {/* Distance Pill Badge */}
                  <g transform="translate(205, 52)">
                    <rect width="90" height="22" rx="11" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1" />
                    <text x="45" y="15" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold" letterSpacing="0.5">
                      ~442.8 KM
                    </text>
                  </g>

                  {/* Bogor Marker */}
                  <g transform="translate(120, 105)">
                    <circle r="14" fill="rgba(244, 114, 182, 0.2)" />
                    <circle r="8" fill="rgba(244, 114, 182, 0.4)" />
                    <circle r="4" fill="#f472b6" />
                    <text x="-8" y="24" fill="#fbcfe8" fontSize="10.5" fontWeight="bold">
                      📍 Bogor (Sayangku 🌻)
                    </text>
                    <text x="-8" y="36" fill="#94a3b8" fontSize="8.5">
                      6.595° S, 106.816° E
                    </text>
                  </g>

                  {/* Jogja Marker */}
                  <g transform="translate(360, 115)">
                    <circle r="14" fill="rgba(56, 189, 248, 0.2)" />
                    <circle r="8" fill="rgba(56, 189, 248, 0.4)" />
                    <circle r="4" fill="#38bdf8" />
                    <text x="-25" y="24" fill="#bae6fd" fontSize="10.5" fontWeight="bold">
                      📍 Jogja (Mas Dhani 🪐)
                    </text>
                    <text x="-25" y="36" fill="#94a3b8" fontSize="8.5">
                      7.797° S, 110.370° E
                    </text>
                  </g>
                </svg>
              </div>

              {/* Action Buttons */}
              <div className="radar-actions-bar">
                <button
                  className="radar-action-btn radar-ping-btn"
                  onClick={() => {
                    playSfx("satellite");
                    setShowPingToast(true);
                    setTimeout(() => setShowPingToast(false), 4500);
                  }}
                >
                  <span>📡</span> Kirim Sinyal Rindu (Ping Radar)
                </button>
                <button
                  className="radar-action-btn radar-focus-btn"
                  onClick={() => {
                    focusOnRouteRef.current();
                  }}
                  title="Pusatkan Kamera 3D ke Jawa / Rute Jogja-Bogor"
                >
                  <span>🛰️</span> Fokus Kamera ke Rute 3D
                </button>
              </div>

              {/* Ping Toast Notification */}
              {showPingToast && (
                <div className="ping-toast">
                  <span>✨</span>
                  <span><strong>Sinyal Rindu Terkirim:</strong> Sinyal cinta dan doa tulus dari Mas Dhani di Jogja telah sampai ke Bogor dengan kecepatan cahaya! 💖🌻</span>
                </div>
              )}

              {/* Telemetry Grid */}
              <div className="telemetry-grid">
                <div className="telemetry-card">
                  <div className="telemetry-label">
                    <span>📍</span> TITIK JOGJA (MAS DHANI)
                  </div>
                  <div className="telemetry-val">D.I. Yogyakarta</div>
                  <div className="telemetry-sub">7° 47&apos; 49&quot; S, 110° 22&apos; 13&quot; E • Ruang Doa & Rindu</div>
                </div>

                <div className="telemetry-card">
                  <div className="telemetry-label">
                    <span>🌻</span> TITIK BOGOR (SAYANGKU)
                  </div>
                  <div className="telemetry-val">Kota Bogor, Jawa Barat</div>
                  <div className="telemetry-sub">6° 35&apos; 42&quot; S, 106° 47&apos; 59&quot; E • Kota Hujan & Rumah Terhangat</div>
                </div>

                <div className="telemetry-card">
                  <div className="telemetry-label">
                    <span>📏</span> JARAK UDARA LURUS
                  </div>
                  <div className="telemetry-val">442.8 Kilometer</div>
                  <div className="telemetry-sub">Jarak Great-Circle Sphere di Permukaan Bumi</div>
                </div>

                <div className="telemetry-card">
                  <div className="telemetry-label">
                    <span>🛣️</span> JARAK RUTE JALUR DARAT
                  </div>
                  <div className="telemetry-val">~560 Kilometer</div>
                  <div className="telemetry-sub">Melintasi Koridor Tol Trans-Jawa</div>
                </div>
              </div>

              {/* Travel Matrix Comparison */}
              <div className="travel-matrix">
                <div className="travel-matrix-title">⚡ Estimasi Waktu Tempuh Jogja ⇄ Bogor</div>
                <div className="travel-matrix-row">
                  <div className="travel-mode">
                    <span>✈️</span> Pesawat Udara (YIA ⇄ CGK/HLP)
                  </div>
                  <div className="travel-duration">~1 Jam 10 Menit</div>
                </div>
                <div className="travel-matrix-row">
                  <div className="travel-mode">
                    <span>🚄</span> Kereta Eksekutif (Taksaka / Argo Dwipangga)
                  </div>
                  <div className="travel-duration">~6 Jam 30 Menit</div>
                </div>
                <div className="travel-matrix-row">
                  <div className="travel-mode">
                    <span>🚗</span> Perjalanan Mobil / Tol Trans-Jawa
                  </div>
                  <div className="travel-duration">~7 Jam 45 Menit</div>
                </div>
                <div className="travel-matrix-row">
                  <div className="travel-mode">
                    <span>🤍</span> Sinyal Rindu & Doa Tulus Mas Dhani
                  </div>
                  <div className="travel-duration instant">0.000 Detik (Real-time) ✨</div>
                </div>
              </div>

              {/* Inside Joke & Romantic Note Card */}
              <div className="route-story-card">
                <div className="route-story-badge">
                  <span>💖</span> Catatan Khusus untuk Sayang
                </div>
                <div className="route-story-quote">
                  &ldquo;Jauh di peta hanyalah ilusi angka di atas kertas. Dari Jogja sampai ke Bogor, rasa sayang, perhatian, dan doa mas selalu sampai tanpa perlu jeda waktu. Masih ingat candaan manis kamu dulu: &apos;nanti aku pindahin Bogor biar deketan sama Jogja&apos; hehe 🌻🤍. Mau sejauh apa pun kilometernya, tempat pulang dan tujuan mas selalu kamu.&rdquo;
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
              <div className="nana-note-quote">
                &ldquo;{currentPlanet.romanticNote}&rdquo;
              </div>
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
