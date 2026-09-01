"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

export default function Home() {
  const canvasRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // AUDIO
    const bgm = document.getElementById('bgm');
    const audioBtn = document.getElementById('audio-btn');
    let isPlaying = false;
    function setAudio(play){
      if(play){ bgm.play().catch(()=>{}); audioBtn.textContent = '🎵'; }
      else { bgm.pause(); audioBtn.textContent = '🔇'; }
      isPlaying = play;
    }
    audioBtn.addEventListener('click', () => setAudio(!isPlaying));

    // SCENE & RENDERER
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 3000);
    camera.position.set(0, 5, 160);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias:true, alpha:true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 15;
    controls.maxDistance = 60;
    controls.target.set(0, 5, 0);
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.5;

    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.8);
    keyLight.position.set(8, 10, 8);
    scene.add(keyLight);

    // LOADING MANAGER
    const loaderEl = document.getElementById('loader');
    const loaderFill = document.getElementById('loader-fill');
    const loaderPct = document.getElementById('loader-pct');
    const gateEl = document.getElementById('gate');
    let loadingDone = false;

    const manager = new THREE.LoadingManager();
    manager.onProgress = (url, loaded, total) => {
      const pct = total ? Math.min(100, Math.round((loaded/total)*100)) : 100;
      loaderFill.style.width = pct + '%';
      loaderPct.textContent = pct + '%';
    };
    manager.onLoad = () => revealGate();
    manager.onError = () => {}; 
    const texLoader = new THREE.TextureLoader(manager);

    function revealGate(){
      if(loadingDone) return;
      loadingDone = true;
      loaderFill.style.width = '100%';
      loaderPct.textContent = '100%';
      setTimeout(()=>{ loaderEl.classList.add('hide'); }, 300);
    }
    setTimeout(revealGate, 4500);

    // BKG & UFO
    const bgGeo = new THREE.SphereGeometry(1500, 64, 64);
    const bgMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide });
    texLoader.load('/textures/milky-way.jpg', (tex) => { bgMat.map = tex; bgMat.needsUpdate = true; });
    const bgSphere = new THREE.Mesh(bgGeo, bgMat);
    scene.add(bgSphere);

    const ufoGroup = new THREE.Group();
    const saucerGeo = new THREE.SphereGeometry(1.5, 32, 16);
    const saucerMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.2 });
    const saucer = new THREE.Mesh(saucerGeo, saucerMat);
    saucer.scale.set(1, 0.25, 1);
    const domeGeo = new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const domeMat = new THREE.MeshStandardMaterial({ color: 0x44aaff, transparent: true, opacity: 0.7 });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.15;
    ufoGroup.add(saucer, dome);
    scene.add(ufoGroup);

    function makeGlowTexture(){
      const size = 256;
      const c = document.createElement('canvas'); c.width = size; c.height = size;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
      grad.addColorStop(0, 'rgba(255,236,180,0.9)');
      grad.addColorStop(0.4, 'rgba(244,201,121,0.35)');
      grad.addColorStop(1, 'rgba(244,201,121,0)');
      ctx.fillStyle = grad; ctx.fillRect(0,0,size,size);
      return new THREE.CanvasTexture(c);
    }
    const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture(), transparent:true, blending:THREE.AdditiveBlending, depthWrite:false }));
    glowSprite.scale.set(26, 26, 1); glowSprite.position.set(0, 5.5, 0); scene.add(glowSprite);

    function makeSoftDot(){
      const size = 64;
      const c = document.createElement('canvas'); c.width = size; c.height = size;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad; ctx.fillRect(0,0,size,size);
      return new THREE.CanvasTexture(c);
    }
    const dustCount = reducedMotion ? 60 : 180;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for(let i=0;i<dustCount;i++){
      const r = 40 + Math.random()*90;
      const theta = Math.random()*Math.PI*2;
      const phi = Math.random()*Math.PI;
      dustPos[i*3] = r*Math.sin(phi)*Math.cos(theta);
      dustPos[i*3+1] = r*Math.cos(phi)*0.6 + 5;
      dustPos[i*3+2] = r*Math.sin(phi)*Math.sin(theta);
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ size: 0.6, map: makeSoftDot(), transparent:true, opacity:0.5, blending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // CONSTELLATION TEXTS
    const conMat = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.4 });
    const conStarMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.9, transparent:true, opacity:0.8 });
    function drawLetter(pointsArr, offsetX) {
        const pts = pointsArr.map(p => new THREE.Vector3(p[0] + offsetX, p[1] + 12, -100));
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        scene.add(new THREE.Line(geo, conMat), new THREE.Points(geo, conStarMat));
    }
    drawLetter([[-4,-5], [-4,5], [1,-5], [1,5]], -15);
    drawLetter([[-2,-5], [1,5], [4,-5]], -7);
    drawLetter([[-0.5,0], [2.5,0]], -7);
    drawLetter([[-4,-5], [-4,5], [1,-5], [1,5]], 2);
    drawLetter([[-2,-5], [1,5], [4,-5]], 10);
    drawLetter([[-0.5,0], [2.5,0]], 10);

    function createTextConstellation(text, x, y, z, scale) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.font = '300 48px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(212, 175, 55, 1)';
        ctx.shadowBlur = 12;
        const spacedText = text.split('').join(String.fromCharCode(8202));
        ctx.fillText(spacedText, canvas.width/2, canvas.height/2);

        for(let i=0; i<35; i++){
            ctx.beginPath();
            const starX = (canvas.width/2 - 350) + Math.random()*700;
            const starY = Math.random()*canvas.height;
            ctx.arc(starX, starY, Math.random()*2, 0, Math.PI*2);
            ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.8)' : 'rgba(212, 175, 55, 0.8)';
            ctx.shadowBlur = 5; ctx.fill();
        }
        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, opacity: 0.8 });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(scale * 8, scale * 1, 1);
        sprite.position.set(x, y, z);
        scene.add(sprite);
    }

    const phrases = [
      { text: 'I LOVE YOU', x: 0, y: 35, z: -180, s: 12 },
      { text: 'BABY', x: -60, y: 20, z: -150, s: 8 },
      { text: 'HONEYY', x: 60, y: 40, z: -160, s: 9 },
      { text: 'DARLING', x: -50, y: 50, z: -170, s: 10 },
      { text: 'MY BEAUTIFULL GIRL', x: 50, y: 15, z: -140, s: 15 }
    ];
    phrases.forEach(p => createTextConstellation(p.text, p.x, p.y, p.z, p.s));

    // PLANET DATA & KUIS (Stoic)
    const ORDER = ['Matahari','Merkurius','Venus','Bumi','Mars','Yupiter','Saturnus','Uranus','Neptunus'];
    const DATA = {
      Matahari: { size:5.5, tex:'sun.jpg', color:0xf4c979, emissive: 0xffa500, fact:'Pusat tata surya. Tempat semua planet berlabuh.', q:'Di tengah semua kebisingan ini, siapa yang tetap jadi pusat duniaku?', a1:'Nana', a2:'Orang lain', correct:1, msg:'Selalu kamu, Na.' },
      Merkurius: { size:1.6, tex:'mercury.jpg', color:0x9a938c, fact:'Planet terkecil dengan orbit tercepat mengitari matahari.', q:'Kapan waktu terasa bergerak terlalu cepat?', a1:'Pas lagi sibuk', a2:'Saat ngobrol sama kamu', correct:2, msg:'Satu hari nggak pernah kerasa cukup kalau lagi sama kamu.' },
      Venus: { size:2.2, tex:'venus.jpg', color:0xd8b98a, fact:'Objek paling terang di langit malam.', q:'Apa yang selalu berhasil bikin aku tenang?', a1:'Senyum Nana', a2:'Suasana malam', correct:1, msg:'Hadirmu itu cukup. Selalu.' },
      Bumi: { size:2.4, tex:'earth.jpg', color:0x3f6fae, moon:true, fact:'Satu-satunya tempat yang bisa kita tinggali.', q:'Ke mana aku selalu ingin pulang?', a1:'Ke rumah', a2:'Ke kamu', correct:2, msg:'Karena rumah bukan cuma tempat, tapi kamu.' },
      Mars: { size:1.8, tex:'mars.jpg', color:0xb1543a, fact:'Planet merah yang dingin dan sunyi.', q:'Kapan duniaku terasa paling sepi?', a1:'Pas lagi sendirian', a2:'Pas belum denger kabarmu', correct:2, msg:'Jangan lama-lama ngilangnya ya.' },
      Yupiter: { size:4.4, tex:'jupiter.jpg', color:0xcaa87a, fact:'Planet raksasa pelindung tata surya.', q:'Sebesar apa rasa syukurku bisa kenal kamu?', a1:'Biasa aja', a2:'Lebih dari cukup', correct:2, msg:'Aku selalu beruntung punya kamu.' },
      Saturnus: { size:3.8, tex:'saturn.jpg', color:0xd9c39a, ring:true, fact:'Punya cincin yang terus berputar menjaga keseimbangan.', q:'Apa yang paling sering berputar di kepalaku?', a1:'Masa depan kita', a2:'Kerjaan', correct:1, msg:'Semua rencanaku selalu ada namamu di dalamnya.' },
      Uranus: { size:3.0, tex:'uranus.jpg', color:0x9fd0d6, fact:'Unik dan berbeda karena berotasi dengan posisi miring.', q:'Siapa yang bikin hari-hariku jauh dari kata bosan?', a1:'Temen-temen', a2:'Nana', correct:2, msg:'Sama kamu, semuanya terasa jauh lebih hidup.' },
      Neptunus: { size:2.9, tex:'neptune.jpg', color:0x3d5ce0, fact:'Planet paling jauh, di ujung tata surya.', q:'Meski jarak kita jauh, apa yang bikin aku tetap merasa dekat?', a1:'Karena terbiasa', a2:'Perasaan yang selalu nyambung', correct:2, msg:'Jauh di mata, tapi hatiku selalu stay di kamu.' }
    };

    const group3D = {};
    const planetMeshes = [];
    let activeKey = null;
    const unlocked = new Set();

    for(const k of ORDER){
      const d = DATA[k];
      const grp = new THREE.Group();
      grp.position.set(0, 5.5, 0); grp.visible = false; scene.add(grp); group3D[k] = grp;
      const mat = new THREE.MeshStandardMaterial({ color:d.color, roughness:0.6 });
      if (d.emissive) { mat.emissive = new THREE.Color(d.emissive); mat.emissiveIntensity = 0.2; }
      texLoader.load(`/textures/${d.tex}`, (tex)=>{ mat.map = tex; mat.needsUpdate = true; });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.size, 64, 64), mat);
      mesh.userData = { id: k }; grp.add(mesh); planetMeshes.push(mesh);

      if(d.moon){
        const mMat = new THREE.MeshStandardMaterial({ color:0xb7b3ad });
        texLoader.load('/textures/moon.jpg', (tex)=>{ mMat.map = tex; mMat.needsUpdate = true; });
        const moon = new THREE.Mesh(new THREE.SphereGeometry(0.65, 32, 32), mMat);
        moon.position.set(d.size + 2.5, 0, 0); moon.userData.isMoon = true; grp.add(moon);
      }

      if(d.ring){
        function makeSaturnRingTexture(){
          const size = 512; const c = document.createElement('canvas'); c.width = size; c.height = size;
          const ctx = c.getContext('2d'); const cx = size/2, cy = size/2; const rInner = size*0.42; const rOuter = size*0.94;
          const grad = ctx.createRadialGradient(cx,cy,rInner,cx,cy,rOuter);
          grad.addColorStop(0.00, 'rgba(224,199,150,0.0)'); grad.addColorStop(0.06, 'rgba(224,199,150,0.55)');
          grad.addColorStop(0.20, 'rgba(198,172,120,0.75)'); grad.addColorStop(0.34, 'rgba(150,130,95,0.22)');
          grad.addColorStop(0.48, 'rgba(224,199,150,0.7)'); grad.addColorStop(0.68, 'rgba(206,182,134,0.5)');
          grad.addColorStop(0.86, 'rgba(190,168,120,0.32)'); grad.addColorStop(1.00, 'rgba(190,168,120,0.0)');
          ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, rOuter, 0, Math.PI*2); ctx.fill();
          ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(cx, cy, rInner, 0, Math.PI*2); ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
          const tex = new THREE.CanvasTexture(c); tex.needsUpdate = true; return tex;
        }
        const ringMat = new THREE.MeshBasicMaterial({ map: makeSaturnRingTexture(), transparent: true, side: THREE.DoubleSide, depthWrite: false, alphaTest: 0.02 });
        const ring = new THREE.Mesh(new THREE.PlaneGeometry(d.size*5, d.size*5), ringMat);
        ring.rotation.x = Math.PI / 2 + 0.15; grp.add(ring);
      }
    }

    // TOP PROGRESS DOTS
    const progressTrack = document.getElementById('progress-track');
    const journeyCaption = document.getElementById('journey-caption');
    const progDotMap = {};
    progressTrack.innerHTML = '';
    ORDER.forEach((k)=>{
      const b = document.createElement('button'); b.className = 'prog-dot'; b.setAttribute('aria-label', k);
      b.addEventListener('click', ()=>focusPlanet(k));
      progressTrack.appendChild(b); progDotMap[k] = b;
    });

    function updateProgressUI(){
      ORDER.forEach(k=>{ progDotMap[k].classList.toggle('opened', unlocked.has(k)); progDotMap[k].classList.toggle('current', k === activeKey); });
      journeyCaption.textContent = `${unlocked.size} / ${ORDER.length} pesan terbuka`;
    }

    // SVG MAP
    const svg = document.getElementById('orbit-map');
    svg.innerHTML = '';
    const cx = 30, cy = 85; const radii = [25, 48, 70, 92, 114, 136, 158, 180];
    ORDER.slice(1).forEach((k,i)=>{
      const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      ellipse.setAttribute('cx', cx); ellipse.setAttribute('cy', cy); ellipse.setAttribute('rx', radii[i]); ellipse.setAttribute('ry', radii[i]*0.4); ellipse.setAttribute('class', 'orbit-ring'); svg.appendChild(ellipse);
    });

    const flightPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    flightPath.setAttribute('class', 'flight-path'); flightPath.setAttribute('d', ''); svg.appendChild(flightPath);

    const dotPositions = {}; const orbitDotMap = {};
    const sunG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    sunG.setAttribute('class', 'orbit-dot'); sunG.setAttribute('tabindex', '0'); sunG.dataset.key = 'Matahari';
    const sunHit = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); sunHit.setAttribute('cx', cx); sunHit.setAttribute('cy', cy); sunHit.setAttribute('r', 15); sunHit.setAttribute('class', 'hit');
    const sunVis = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); sunVis.setAttribute('cx', cx); sunVis.setAttribute('cy', cy); sunVis.setAttribute('r', 6); sunVis.setAttribute('class', 'core'); sunVis.setAttribute('fill', 'var(--gold)');
    sunG.appendChild(sunHit); sunG.appendChild(sunVis); sunG.addEventListener('click', () => focusPlanet('Matahari')); svg.appendChild(sunG);
    orbitDotMap['Matahari'] = sunG; dotPositions['Matahari'] = {x: cx, y: cy};

    ORDER.slice(1).forEach((k,i)=>{
      const rx = radii[i]; const ry = rx*0.4; const angle = 0.05 + i*0.22;
      const x = cx + rx*Math.cos(angle); const y = cy - ry*Math.sin(angle)*1.4; dotPositions[k] = {x, y};
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'orbit-dot'); g.setAttribute('tabindex', '0'); g.dataset.key = k;
      const hit = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); hit.setAttribute('cx', x); hit.setAttribute('cy', y); hit.setAttribute('r', 14); hit.setAttribute('class', 'hit');
      const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); core.setAttribute('cx', x); core.setAttribute('cy', y); core.setAttribute('r', 3.5); core.setAttribute('class', 'core');
      const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text'); lbl.setAttribute('x', x); lbl.setAttribute('y', y-10); lbl.setAttribute('class', 'orbit-label'); lbl.textContent = k;
      g.appendChild(hit); g.appendChild(core); g.appendChild(lbl); g.addEventListener('click', ()=>focusPlanet(k)); svg.appendChild(g); orbitDotMap[k] = g;
    });

    const cardName = document.getElementById('planet-name'); const cardFact = document.getElementById('planet-fact');
    const planetIndexEl = document.getElementById('planet-index'); const openMsgBtn = document.getElementById('open-msg-btn');
    const prevBtn = document.getElementById('prev-btn'); const nextBtn = document.getElementById('next-btn');

    function focusPlanet(key){
      if(activeKey === key) return;
      activeKey = key;
      Object.entries(group3D).forEach(([k,g])=>{ g.visible = false; });
      const grp = group3D[key]; grp.visible = true;
      grp.scale.setScalar(0.001); gsap.to(grp.scale, { x:1,y:1,z:1, duration: reducedMotion ? 0.01 : 1, ease:'power3.out' });
      const d = DATA[key]; const dist = d.size * 3.5 + 13;
      gsap.to(camera.position, { x:0, y:5.5, z:dist, duration: reducedMotion ? 0.01 : 1.2, ease:'power2.inOut' });
      gsap.to(controls.target, { x:0, y:5.5, z:0, duration: reducedMotion ? 0.01 : 1.2, ease:'power2.inOut' });
      gsap.to(glowSprite.position, { x:0, y:5.5, z:0, duration: reducedMotion ? 0.01 : 1.2 });
      gsap.to(cardName, { opacity:0, duration:0.2, onComplete:()=>{
        cardName.textContent = key; cardFact.textContent = d.fact;
        const idx = ORDER.indexOf(key); planetIndexEl.textContent = `${idx+1} / ${ORDER.length}`;
        updateOpenMsgBtn(key); gsap.to(cardName, { opacity:1, duration:0.4 });
      }});
      document.querySelectorAll('.orbit-dot').forEach(el=>{ el.classList.toggle('active', el.dataset.key === key); el.classList.toggle('opened', unlocked.has(el.dataset.key)); });
      const p = dotPositions[key]; if(p) { flightPath.setAttribute('d', `M${cx},${cy} L${p.x},${p.y}`); }
      updateProgressUI();
    }

    function updateOpenMsgBtn(key){
      if(unlocked.has(key)){ openMsgBtn.classList.add('opened'); openMsgBtn.textContent = '✓ Sudah dibuka — baca lagi'; }
      else { openMsgBtn.classList.remove('opened'); openMsgBtn.textContent = '💌 Buka Pesan'; }
    }

    prevBtn.addEventListener('click', ()=>{ const idx = ORDER.indexOf(activeKey); focusPlanet(ORDER[(idx - 1 + ORDER.length) % ORDER.length]); });
    nextBtn.addEventListener('click', ()=>{ const idx = ORDER.indexOf(activeKey); focusPlanet(ORDER[(idx + 1) % ORDER.length]); });

    const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2();
    const qModal = document.getElementById('quiz-modal'); const qText = document.getElementById('q-text');
    const btn1 = document.getElementById('ans-1'); const btn2 = document.getElementById('ans-2');
    const btnContainer = document.getElementById('btn-container'); const resText = document.getElementById('quiz-result');
    const closeQuiz = document.getElementById('close-quiz');
    let rightBtn, wrongBtn;

    function openPlanetModal(key){
      const d = DATA[key];
      if(unlocked.has(key)){
        btnContainer.style.display = 'none'; resText.style.display = 'block'; closeQuiz.style.display = 'block';
        qText.textContent = d.q; resText.textContent = d.msg; qModal.classList.add('show'); return;
      }
      qText.textContent = d.q; btn1.textContent = d.a1; btn2.textContent = d.a2;
      btnContainer.style.display = 'flex'; btn1.style.transform = 'translate(0px, 0px)'; btn2.style.transform = 'translate(0px, 0px)';
      resText.style.display = 'none'; closeQuiz.style.display = 'none';
      if(d.correct === 1) { rightBtn = btn1; wrongBtn = btn2; } else { rightBtn = btn2; wrongBtn = btn1; }
      rightBtn.onclick = () => {
        btnContainer.style.display = 'none'; resText.style.display = 'block'; closeQuiz.style.display = 'block';
        resText.textContent = d.msg; unlocked.add(key); updateOpenMsgBtn(key); updateProgressUI();
        document.querySelectorAll('.orbit-dot').forEach(el=>{ if(el.dataset.key === key) el.classList.add('opened'); });
        burstSpark(rightBtn);
      };
      wrongBtn.onclick = null; qModal.classList.add('show');
    }

    openMsgBtn.addEventListener('click', ()=>openPlanetModal(activeKey));

    window.addEventListener('pointerup', (event) => {
        if(event.target.closest('#panel') || event.target.closest('#quiz-modal') || event.target.closest('#audio-btn') || event.target.closest('#hud')) return;
        if(!gateEl.classList.contains('hide')) return;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1; mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(planetMeshes).filter(hit => hit.object.parent.visible);
        if(intersects.length > 0) { const pKey = intersects[0].object.userData.id; openPlanetModal(pKey); }
    });

    function dodge(e) { e.preventDefault(); const x = (Math.random() - 0.5) * 120; const y = (Math.random() - 0.5) * 120; wrongBtn.style.transform = `translate(${x}px, ${y}px)`; }
    btn1.addEventListener('mouseenter', function(e) { if(wrongBtn === this) dodge(e); }); btn1.addEventListener('touchstart', function(e) { if(wrongBtn === this) dodge(e); }, {passive: false});
    btn2.addEventListener('mouseenter', function(e) { if(wrongBtn === this) dodge(e); }); btn2.addEventListener('touchstart', function(e) { if(wrongBtn === this) dodge(e); }, {passive: false});

    closeQuiz.onclick = () => { qModal.classList.remove('show'); if(unlocked.size === ORDER.length){ setTimeout(showFinale, 500); } };

    function burstSpark(originEl){
      if(reducedMotion) return;
      const rect = originEl.getBoundingClientRect(); const cx0 = rect.left + rect.width/2, cy0 = rect.top + rect.height/2;
      for(let i=0;i<14;i++){
        const s = document.createElement('div'); s.className = 'spark'; s.style.left = cx0 + 'px'; s.style.top = cy0 + 'px'; document.body.appendChild(s);
        const angle = Math.random()*Math.PI*2; const dist = 40 + Math.random()*70;
        gsap.to(s, { x: Math.cos(angle)*dist, y: Math.sin(angle)*dist, opacity:0, scale:0.3, duration: 0.7 + Math.random()*0.3, ease:'power2.out', onComplete: ()=> s.remove() });
      }
    }

    const finaleEl = document.getElementById('finale');
    const replayBtn = document.getElementById('replay-btn');
    function showFinale(){ finaleEl.classList.add('show'); }
    replayBtn.addEventListener('click', ()=>{
      unlocked.clear(); ORDER.forEach(k=>orbitDotMap[k].classList.remove('opened'));
      updateOpenMsgBtn(activeKey); updateProgressUI(); finaleEl.classList.remove('show'); focusPlanetForce('Matahari');
    });
    function focusPlanetForce(key){ activeKey = null; focusPlanet(key); }

    document.getElementById('gate-btn').addEventListener('click', ()=>{
      gateEl.classList.add('hide'); setAudio(true);
      gsap.to(camera.position, { x:0, y:5, z:45, duration: reducedMotion ? 0.01 : 2.2, ease:'power2.inOut' });
      focusPlanet('Matahari');
    });

    const clock = new THREE.Clock();
    function animate(){
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      bgSphere.rotation.y += 0.0003; dustPoints.rotation.y += reducedMotion ? 0.00005 : 0.0002; glowSprite.material.opacity = 0.85 + Math.sin(t*1.2)*0.1;
      ufoGroup.position.x = Math.cos(t * 0.4) * 22; ufoGroup.position.z = Math.sin(t * 0.4) * 22; ufoGroup.position.y = Math.sin(t * 1.5) * 2 + 8; ufoGroup.rotation.y = -t * 0.4;
      if(activeKey){
        const grp = group3D[activeKey];
        grp.children.forEach(c=>{
          if(c.userData.isMoon){ const R = DATA[activeKey].size + 2.8; c.position.x = Math.cos(t*0.5)*R; c.position.z = Math.sin(t*0.5)*R; }
          else if(c.geometry && c.geometry.type === 'SphereGeometry'){ c.rotation.y += 0.002; }
        });
      }
      controls.update(); renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => { camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
    window.addEventListener('resize', handleResize);
    updateProgressUI();

    return () => { window.removeEventListener('resize', handleResize); };

  }, []);

  return (
    <>
      <audio id="bgm" loop><source src="/backsound.mp3" type="audio/mpeg" /></audio>
      <div id="grain"></div>
      <div id="vignette"></div>

      <div id="loader">
        <div className="loader-title">Menyusun Semesta</div>
        <div className="loader-bar"><div className="loader-fill" id="loader-fill"></div></div>
        <div className="loader-pct" id="loader-pct">0%</div>
      </div>

      <div id="gate">
        <div className="gate-inner">
          <div className="gate-eyebrow">Untuk Nana</div>
          <h1 className="gate-title">Sembilan Planet,<br/><em>Satu Cerita Kita</em></h1>
          <p className="gate-sub">Aku menyusun tata surya kecil ini untukmu. Jelajahi tiap planetnya, ya.</p>
          <button className="gate-btn" id="gate-btn">Mulai Menjelajah</button>
          <div className="gate-hint">🎧 Nyalakan suara agar lebih terasa</div>
        </div>
      </div>

      <button id="audio-btn">🔇</button>
      <canvas id="webgl-canvas" ref={canvasRef}></canvas>

      <div id="hud">
        <div className="designation">Perjalanan Kecil untuk Nana</div>
        <div id="progress-track"></div>
        <div id="journey-caption">0 / 9 pesan terbuka</div>
        <div id="info-bar">
          <div className="info-top">
            <h1 id="planet-name">Menyalakan sistem...</h1>
            <span id="planet-index"></span>
          </div>
          <p id="planet-fact">Memuat koordinat.</p>
        </div>
      </div>

      <div id="panel">
        <div id="nav-row">
          <button className="nav-icon-btn" id="prev-btn" aria-label="Planet sebelumnya">‹</button>
          <button id="open-msg-btn" aria-label="Buka pesan planet ini">💌 Buka Pesan</button>
          <button className="nav-icon-btn" id="next-btn" aria-label="Planet selanjutnya">›</button>
        </div>
        <div id="orbit-wrap">
          <svg id="orbit-map" viewBox="0 0 340 100" preserveAspectRatio="xMidYMid meet"></svg>
        </div>
      </div>

      <div id="quiz-modal">
        <div className="quiz-box">
          <div className="quiz-title">Sebuah Pesan</div>
          <div className="quiz-q" id="q-text">Pertanyaan memuat...</div>
          <div className="btn-container" id="btn-container">
            <button className="quiz-btn" id="ans-1">Jawaban 1</button>
            <button className="quiz-btn" id="ans-2">Jawaban 2</button>
          </div>
          <div id="quiz-result"></div>
          <button id="close-quiz">Tutup</button>
        </div>
      </div>

      <div id="finale">
        <div className="finale-inner">
          <div className="finale-eyebrow">Perjalanan Selesai</div>
          <h2 className="finale-title">Sembilan pesan,<br/>satu untukmu.</h2>
          <p className="finale-text">Terima kasih sudah menjelajah sampai akhir, Na. Sejauh apa pun jarak kita, ini tidak berubah — kamu tetap yang paling berarti.</p>
          <button className="finale-btn" id="replay-btn">Jelajahi Lagi</button>
        </div>
      </div>
    </>
  );
}