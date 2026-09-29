/**
 * TERRA EARTH GAIA - TRANSCENDENTAL MEDITATION & 432HZ ENGINE
 * Desenvolvido para artesdosul.com
 * WebGL 3D Globe, Circumpolar Rainbow Bridge, Sincronário Maya, Solfeggio Synth, PWA
 */

(function () {
  'use strict';

  // --- CONFIGURAÇÃO & ESTADO ---
  const state = {
    isPlaying: false,
    volume: 0.75,
    isBreathingActive: false,
    currentBgIndex: 0,
    meditationTimeRemaining: 0,
    meditationTimerId: null,
    isZenMode: false,
    audioInitialized: false,
    isRainbowBridgeActive: false,
    currentFrequency: 432,
    synthOsc: null,
    synthGain: null,
    isSynthPlaying: false,
    meditatorsCount: 1440,
    visualCalibration: {
      temperature: 0,   // -50 (Frio/Azul) a +50 (Quente/Ouro)
      saturation: 100,  // 0% a 200%
      brightness: 100,  // 50% a 150%
      contrast: 100     // 50% a 160%
    },
    harmonicDynamics: {
      octaCount: 144,      // 72 a 576 (múltiplos harmônicos: 72, 144, 216, 288, 432, 576)
      octaScale: 100,      // 50% a 250% (escala áurea dos cristais)
      globeSpeed: 1.0,     // 0.0x a 5.0x (frequência de rotação do globo terrestre)
      syncHarmonic: true   // aumento harmônico sincronizado (quantidade + tamanho)
    }
  };

  const BACKGROUNDS = [
    { name: 'Rainbow Bridge', url: './img/earthrainbowbridge.jpg' },
    { name: 'Torus de Luz', url: './img/torus.png' },
    { name: 'Ponte Harmônica HD', url: './img/rainbow-bridge-1440.jpg' },
    { name: 'Irradiação Cósmica', url: './img/earthrainbow_00.jpg' }
  ];

  // --- DICIONÁRIO DO SINCRONÁRIO TZOLKIN (20 SELOS & 13 TONS) ---
  const SOLAR_SEALS = [
    { name: 'Dragão Vermelho', color: 'Vermelho', action: 'Nutre o Ser', power: 'Nascimento' },
    { name: 'Vento Branco', color: 'Branco', action: 'Comunica o Espírito', power: 'Respiração' },
    { name: 'Noite Azul', color: 'Azul', action: 'Sonha a Intuição', power: 'Abundância' },
    { name: 'Semente Amarela', color: 'Amarelo', action: 'Focaliza a Consciência', power: 'Florescimento' },
    { name: 'Serpente Vermelha', color: 'Vermelho', action: 'Sobrevive à Força Vital', power: 'Instinto' },
    { name: 'Enlaçador de Mundos Branco', color: 'Branco', action: 'Iguala a Morte', power: 'Oportunidade' },
    { name: 'Mão Azul', color: 'Azul', action: 'Conhece a Cura', power: 'Realização' },
    { name: 'Estrela Amarela', color: 'Amarelo', action: 'Embeleza a Arte', power: 'Elegância' },
    { name: 'Lua Vermelha', color: 'Vermelho', action: 'Purifica as Águas Universais', power: 'Fluxo' },
    { name: 'Cachorro Branco', color: 'Branco', action: 'Ama o Coração', power: 'Lealdade' },
    { name: 'Macaco Azul', color: 'Azul', action: 'Brinca a Ilusão', power: 'Magia' },
    { name: 'Humano Amarelo', color: 'Amarelo', action: 'Influencia a Livre Vontade', power: 'Sabedoria' },
    { name: 'Caminhante do Céu Vermelho', color: 'Vermelho', action: 'Explora o Espaço', power: 'Vigilância' },
    { name: 'Mago Branco', color: 'Branco', action: 'Encanta a Atemporalidade', power: 'Receptividade' },
    { name: 'Águia Azul', color: 'Azul', action: 'Cria a Mente', power: 'Visão' },
    { name: 'Guerreiro Amarelo', color: 'Amarelo', action: 'Questiona com Inteligência', power: 'Intrepidez' },
    { name: 'Terra Vermelha', color: 'Vermelho', action: 'Evolui a Navegação', power: 'Sincronicidade' },
    { name: 'Espelho Branco', color: 'Branco', action: 'Reflete a Ordem', power: 'Infinito' },
    { name: 'Tormenta Azul', color: 'Azul', action: 'Catalisa a Energia', power: 'Auto-geração' },
    { name: 'Sol Amarelo', color: 'Amarelo', action: 'Ilumina o Fogo Universal', power: 'Vida' }
  ];

  const GALACTIC_TONES = [
    'Magnético (Propósito)', 'Lunar (Desafio)', 'Elétrico (Serviço)', 'Autoexistente (Forma)',
    'Harmônico (Radiação)', 'Rítmico (Igualdade)', 'Ressonante (Sintonia)', 'Galáctico (Integridade)',
    'Solar (Intenção)', 'Planetário (Manifestação)', 'Espectral (Liberação)', 'Cristal (Cooperação)',
    'Cósmico (Presença)'
  ];

  // --- ELEMENTOS DOM ---
  const canvas = document.getElementById('webgl-canvas');
  const healingBg = document.querySelector('.healing-bg');
  const audioElement = document.getElementById('gaia-audio');
  const hudWrapper = document.querySelector('.hud-wrapper');
  const playBtn = document.getElementById('btn-play');
  const volumeBtn = document.getElementById('btn-volume');
  const volumeWrapper = document.querySelector('.volume-control-wrapper');
  const volumeSlider = document.getElementById('volume-slider');
  const breathBtn = document.getElementById('btn-breath');
  const breathGuide = document.querySelector('.breathing-guide');
  const breathCircle = document.querySelector('.breath-circle');
  const breathCaption = document.querySelector('.breath-caption');
  const bgCycleBtn = document.getElementById('btn-bg-cycle');
  const timerBtn = document.getElementById('btn-timer');
  const timerBadge = document.querySelector('.meditation-timer-badge');
  const zenBtn = document.getElementById('btn-zen');
  const prayerBtn = document.getElementById('btn-prayer');
  const shareBtn = document.getElementById('btn-share');
  const prayerModal = document.getElementById('prayer-modal');
  const closePrayerBtn = document.getElementById('btn-close-prayer');
  const welcomeSplash = document.getElementById('welcome-splash');
  const enterBtn = document.getElementById('btn-enter-experience');
  const toastEl = document.getElementById('zen-toast');
  const visualizerContainer = document.querySelector('.audio-visualizer-bar');
  const rainbowBtn = document.getElementById('btn-rainbow');
  const kinBtn = document.getElementById('btn-kin');
  const kinModal = document.getElementById('kin-modal');
  const closeKinBtn = document.getElementById('btn-close-kin');
  const birthdateInput = document.getElementById('birthdate-input');
  const calcKinBtn = document.getElementById('btn-calc-kin');
  const userKinResult = document.getElementById('user-kin-result');
  const userKinTitle = document.getElementById('user-kin-title');
  const userKinDesc = document.getElementById('user-kin-desc');
  const solfeggioBtn = document.getElementById('btn-solfeggio');
  const solfeggioModal = document.getElementById('solfeggio-modal');
  const closeSolfeggioBtn = document.getElementById('btn-close-solfeggio');
  const currentFreqDisplay = document.getElementById('current-freq-display');
  const globalPulseBtn = document.getElementById('btn-global-pulse');
  const meditatorsCountEl = document.getElementById('meditators-count');

  // Elementos do Modal de Calibração & Gauges
  const gaugeBtn = document.getElementById('btn-gauge');
  const gaugeModal = document.getElementById('gauge-modal');
  const closeGaugeBtn = document.getElementById('btn-close-gauge');
  const resetGaugeBtn = document.getElementById('btn-reset-gauge');
  const tempSlider = document.getElementById('gauge-temp-slider');
  const satSlider = document.getElementById('gauge-sat-slider');
  const briSlider = document.getElementById('gauge-bri-slider');
  const conSlider = document.getElementById('gauge-con-slider');
  const tempVal = document.getElementById('gauge-temp-val');
  const satVal = document.getElementById('gauge-sat-val');
  const briVal = document.getElementById('gauge-bri-val');
  const conVal = document.getElementById('gauge-con-val');
  const tempArc = document.getElementById('gauge-temp-arc');
  const satArc = document.getElementById('gauge-sat-arc');
  const briArc = document.getElementById('gauge-bri-arc');
  const conArc = document.getElementById('gauge-con-arc');
  const tempNeedle = document.getElementById('gauge-temp-needle');
  const satNeedle = document.getElementById('gauge-sat-needle');
  const briNeedle = document.getElementById('gauge-bri-needle');
  const conNeedle = document.getElementById('gauge-con-needle');
  const tempState = document.getElementById('gauge-temp-state');
  const satState = document.getElementById('gauge-sat-state');
  const briState = document.getElementById('gauge-bri-state');
  const conState = document.getElementById('gauge-con-state');
  const presetButtons = document.querySelectorAll('.gauge-preset-btn');

  // Elementos das Abas & Dinâmica Harmônica (Octaedros & Rotação)
  const tabBtnColor = document.getElementById('btn-tab-color');
  const tabBtnDynamics = document.getElementById('btn-tab-dynamics');
  const tabContentColor = document.getElementById('tab-content-color');
  const tabContentDynamics = document.getElementById('tab-content-dynamics');

  const octaSlider = document.getElementById('gauge-octa-slider');
  const octaVal = document.getElementById('gauge-octa-val');
  const octaArc = document.getElementById('gauge-octa-arc');
  const octaNeedle = document.getElementById('gauge-octa-needle');
  const octaState = document.getElementById('gauge-octa-state');

  const scaleSlider = document.getElementById('gauge-scale-slider');
  const scaleVal = document.getElementById('gauge-scale-val');
  const scaleArc = document.getElementById('gauge-scale-arc');
  const scaleNeedle = document.getElementById('gauge-scale-needle');
  const scaleState = document.getElementById('gauge-scale-state');

  const speedSlider = document.getElementById('gauge-speed-slider');
  const speedVal = document.getElementById('gauge-speed-val');
  const speedArc = document.getElementById('gauge-speed-arc');
  const speedNeedle = document.getElementById('gauge-speed-needle');
  const speedState = document.getElementById('gauge-speed-state');

  const syncHarmonicBtn = document.getElementById('btn-sync-harmonic');
  const dynamicsPresetButtons = document.querySelectorAll('.dynamics-preset-btn');

  // --- AUDIO API & ANALYSER ---
  let audioCtx = null;
  let analyser = null;
  let sourceNode = null;
  let dataArray = null;
  let visSticks = [];

  function initVisualizerSticks() {
    if (!visualizerContainer) return;
    visualizerContainer.innerHTML = '';
    const STICK_COUNT = 24;
    visSticks = [];
    for (let i = 0; i < STICK_COUNT; i++) {
      const stick = document.createElement('div');
      stick.className = 'vis-stick';
      visualizerContainer.appendChild(stick);
      visSticks.push(stick);
    }
  }

  function setupWebAudio() {
    if (state.audioInitialized) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      
      sourceNode = audioCtx.createMediaElementSource(audioElement);
      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
      
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      state.audioInitialized = true;
    } catch (e) {
      console.warn('Web Audio API não inicializada ou já roteada:', e);
    }
  }

  function playSolfeggioTone(freq) {
    setupWebAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (!audioCtx) return;

    if (state.synthOsc) {
      try {
        state.synthOsc.stop();
        state.synthOsc.disconnect();
      } catch (e) {}
    }

    state.currentFrequency = freq;
    if (currentFreqDisplay) {
      currentFreqDisplay.textContent = `${freq} Hz`;
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    if (freq === 7.83) {
      // Ressonância Schumann: Tom binaural com portadora suave em 108Hz + modulação 7.83Hz
      osc.type = 'sine';
      osc.frequency.setValueAtTime(108, audioCtx.currentTime);
      
      const lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(7.83, audioCtx.currentTime);
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      lfo.connect(gain.gain);
      lfo.start();
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    }

    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(analyser);
    osc.start();

    state.synthOsc = osc;
    state.synthGain = gain;
    state.isSynthPlaying = true;
    showToast(`Sintetizador Harmônico Sintonizado em ${freq} Hz`);
  }

  function updateVisualizer() {
    if (!analyser || !dataArray || (!state.isPlaying && !state.isSynthPlaying)) {
      if (visSticks.length) {
        visSticks.forEach(s => s.style.height = '3px');
      }
      return;
    }
    analyser.getByteFrequencyData(dataArray);
    for (let i = 0; i < visSticks.length; i++) {
      const val = dataArray[i % dataArray.length] || 0;
      const height = Math.max(3, (val / 255) * 22);
      visSticks[i].style.height = `${height}px`;
    }
  }

  // --- THREE.JS WEBGL 3D ENGINE & PONTE ARCO-ÍRIS CIRCUMPOLAR ---
  let scene, camera, renderer, globeMesh, atmosphereMesh, particlesMesh;
  let rainbowBridgeMesh, pulseRingMesh;
  let ambientLight, sunLight, cyanRimLight;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let rotationVelocity = { x: 0, y: 0.0015 };
  let targetRotation = { x: 0.2, y: 0 };

  function initThreeJS() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js não carregado.');
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (THREE.ACESFilmicToneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
    }

    // Iluminação Sagrada Cósmica
    ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    sunLight = new THREE.DirectionalLight(0xfff6e5, 1.4);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    cyanRimLight = new THREE.DirectionalLight(0x5ce1e6, 0.9);
    cyanRimLight.position.set(-5, -2, -3);
    scene.add(cyanRimLight);

    // Textura da Terra
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('./img/css_globe_diffuse.jpg', (texture) => {
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      
      const sphereGeo = new THREE.SphereGeometry(1.6, 64, 64);
      const sphereMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.65,
        metalness: 0.1,
      });

      globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(globeMesh);

      // Atmosfera Sagrada / Halo Luminoso (Aura de Gaia)
      const atmosGeo = new THREE.SphereGeometry(1.68, 64, 64);
      const atmosMat = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
            vec3 glowColor = mix(vec3(0.36, 0.88, 0.90), vec3(0.90, 0.75, 0.48), intensity * 0.5);
            gl_FragColor = vec4(glowColor, intensity * 0.85);
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
      });

      atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
      scene.add(atmosphereMesh);
    });

    // Ponte Arco-Íris Circumpolar 3D (Torus Duplo Polar)
    const rainbowTorusGeo = new THREE.TorusGeometry(2.35, 0.045, 16, 100);
    const rainbowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        vec3 rainbow(float t) {
          return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
        }
        void main() {
          vec3 col = rainbow(vUv.x * 2.0);
          gl_FragColor = vec4(col, 0.75);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    rainbowBridgeMesh = new THREE.Group();
    const torus1 = new THREE.Mesh(rainbowTorusGeo, rainbowMat);
    torus1.rotation.x = Math.PI / 2;
    const torus2 = new THREE.Mesh(rainbowTorusGeo, rainbowMat);
    torus2.rotation.y = Math.PI / 2;
    rainbowBridgeMesh.add(torus1);
    rainbowBridgeMesh.add(torus2);
    rainbowBridgeMesh.visible = false;
    scene.add(rainbowBridgeMesh);

    // Anel de Onda de Pulso Coletivo Global
    const ringGeo = new THREE.RingGeometry(1.65, 1.72, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x5ce1e6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    pulseRingMesh = new THREE.Mesh(ringGeo, ringMat);
    scene.add(pulseRingMesh);

    // Poeira Cósmica em Octaedros Sagrados (Capacidade máxima 576, Padrão 144)
    const MAX_OCTA = 576;
    const octaGeo = new THREE.OctahedronGeometry(0.015, 0).toNonIndexed();
    const pos = octaGeo.attributes.position;
    const vertexColors = [];

    const colorRed = new THREE.Color(0xff2a45);    // Vermelho Sagrado (Leste)
    const colorWhite = new THREE.Color(0xffffff);  // Branco Cristalino (Norte)
    const colorBlue = new THREE.Color(0x1e88e5);   // Azul Celestial (Oeste)
    const colorYellow = new THREE.Color(0xffd13b); // Amarelo Solar (Sul)

    for (let f = 0; f < 8; f++) {
      const idx = f * 3;
      const cy = (pos.getY(idx) + pos.getY(idx + 1) + pos.getY(idx + 2)) / 3;
      const cx = (pos.getX(idx) + pos.getX(idx + 1) + pos.getX(idx + 2)) / 3;

      let faceColor;
      if (cy >= 0) {
        faceColor = (cx >= 0) ? colorRed : colorWhite;
      } else {
        faceColor = (cx >= 0) ? colorBlue : colorYellow;
      }

      for (let v = 0; v < 3; v++) {
        vertexColors.push(faceColor.r, faceColor.g, faceColor.b);
      }
    }

    octaGeo.setAttribute('color', new THREE.Float32BufferAttribute(vertexColors, 3));

    const octaMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.18,
      metalness: 0.85,
      transparent: true,
      opacity: 0.95,
      emissive: 0x111122,
      emissiveIntensity: 0.25
    });

    const octaInstancedMesh = new THREE.InstancedMesh(octaGeo, octaMat, MAX_OCTA);
    octaInstancedMesh.count = state.harmonicDynamics.octaCount;
    const dummy = new THREE.Object3D();
    const octaData = [];

    for (let i = 0; i < MAX_OCTA; i++) {
      const radius = 2.1 + Math.random() * 2.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      let baseScale;
      const subIdx = i % 144;
      if (subIdx < 55) {
        baseScale = 0.24 + Math.random() * (0.38 - 0.24);
      } else if (subIdx < 110) {
        baseScale = 0.38 + Math.random() * (0.62 - 0.38);
      } else {
        baseScale = 0.62 + Math.random() * (1.00 - 0.62);
      }

      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.set(baseScale, baseScale, baseScale);
      dummy.updateMatrix();

      octaInstancedMesh.setMatrixAt(i, dummy.matrix);

      octaData.push({
        position: new THREE.Vector3(x, y, z),
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.025,
          y: (Math.random() - 0.5) * 0.025,
          z: (Math.random() - 0.5) * 0.025
        },
        orbitSpeed: 0.0002 + Math.random() * 0.0006,
        orbitRadius: radius,
        phi: phi,
        theta: theta,
        baseScale: baseScale,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseFreq: 0.015 + (i % 9) * 0.004
      });
    }

    octaInstancedMesh.instanceMatrix.needsUpdate = true;
    scene.add(octaInstancedMesh);
    particlesMesh = octaInstancedMesh;

    setupInteractions();

    let clock = 0;
    let pulseProgress = 1.0;

    function animate() {
      requestAnimationFrame(animate);
      clock += 0.016;

      if (globeMesh) {
        if (!isDragging) {
          const speedMult = state.harmonicDynamics.globeSpeed;
          globeMesh.rotation.y += rotationVelocity.y * speedMult;
          globeMesh.rotation.x += (targetRotation.x - globeMesh.rotation.x) * 0.05;
        }
        if (atmosphereMesh) {
          atmosphereMesh.rotation.y = globeMesh.rotation.y;
          atmosphereMesh.rotation.x = globeMesh.rotation.x;
        }
      }

      if (rainbowBridgeMesh && rainbowBridgeMesh.visible) {
        rainbowBridgeMesh.rotation.y += 0.003;
        rainbowBridgeMesh.rotation.z += 0.001;
      }

      // Animação de Onda de Pulso Coletivo
      if (pulseRingMesh && pulseProgress < 1.0) {
        pulseProgress += 0.015;
        const scale = 1.0 + pulseProgress * 2.5;
        pulseRingMesh.scale.set(scale, scale, scale);
        pulseRingMesh.material.opacity = (1.0 - pulseProgress) * 0.85;
      }

      let audioBoost = 0;
      if (analyser && dataArray && (state.isPlaying || state.isSynthPlaying)) {
        let sum = 0;
        for (let j = 0; j < 8; j++) sum += dataArray[j] || 0;
        audioBoost = (sum / 8 / 255) * 0.15;
      }

      if (octaInstancedMesh && octaData.length > 0) {
        const activeCount = Math.min(octaData.length, state.harmonicDynamics.octaCount);
        octaInstancedMesh.count = activeCount;
        const scaleMult = state.harmonicDynamics.octaScale / 100;

        for (let i = 0; i < activeCount; i++) {
          const item = octaData[i];
          item.theta += item.orbitSpeed;
          
          item.position.x = item.orbitRadius * Math.sin(item.phi) * Math.cos(item.theta);
          item.position.z = item.orbitRadius * Math.cos(item.phi);
          item.position.y = item.orbitRadius * Math.sin(item.phi) * Math.sin(item.theta);

          item.rotation.x += item.rotSpeed.x;
          item.rotation.y += item.rotSpeed.y;
          item.rotation.z += item.rotSpeed.z;

          const harmonicPulse = Math.sin(clock * 3.5 * item.pulseFreq + item.pulsePhase) * 0.08;
          const currentScale = Math.min(3.5, Math.max(0.12, item.baseScale * scaleMult * (1.0 + harmonicPulse + audioBoost)));

          dummy.position.copy(item.position);
          dummy.rotation.copy(item.rotation);
          dummy.scale.set(currentScale, currentScale, currentScale);
          dummy.updateMatrix();

          octaInstancedMesh.setMatrixAt(i, dummy.matrix);
        }
        octaInstancedMesh.instanceMatrix.needsUpdate = true;
      }

      updateVisualizer();
      renderer.render(scene, camera);
    }

    animate();

    window.triggerCollectivePulse = function () {
      pulseProgress = 0.0;
      pulseRingMesh.scale.set(1, 1, 1);
      pulseRingMesh.material.opacity = 0.85;
    };

    window.addEventListener('resize', onWindowResize, { passive: true });
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function setupInteractions() {
    const onPointerDown = (e) => {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
      wakeControls();
    };

    const onPointerMove = (e) => {
      wakeControls();
      if (!isDragging || !globeMesh) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      globeMesh.rotation.y += deltaX * 0.005;
      globeMesh.rotation.x += deltaY * 0.005;
      targetRotation.x = globeMesh.rotation.x;

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp, { passive: true });

    window.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });
  }

  // --- GESTÃO DE FOCO & AUTOHIDE DISCRETO ---
  let autohideTimer = null;

  function wakeControls() {
    if (!hudWrapper) return;
    hudWrapper.classList.add('awake');
    clearTimeout(autohideTimer);
    if (!state.isZenMode) {
      autohideTimer = setTimeout(() => {
        hudWrapper.classList.remove('awake');
      }, 3800);
    }
  }

  // --- CÁLCULO DO KIN MAIA (DREAMSPELL / TZOLKIN) ---
  function calculateKin(dateObj) {
    // Época de referência Dreamspell: 26 de Julho de 1987 = Kin 34 (Mago Galáctico Branco)
    const baseDate = new Date(Date.UTC(1987, 6, 26));
    const targetDate = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
    const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    
    let kin = ((34 + diffDays) % 260);
    if (kin <= 0) kin += 260;

    const sealIndex = (kin - 1) % 20;
    const toneIndex = (kin - 1) % 13;
    const seal = SOLAR_SEALS[sealIndex];
    const tone = GALACTIC_TONES[toneIndex];

    return {
      kin: kin,
      seal: seal,
      tone: tone,
      fullName: `${seal.name} ${tone.split(' ')[0]}`
    };
  }

  function initTodayKin() {
    const today = new Date();
    const todayKin = calculateKin(today);
    const todayNumberEl = document.getElementById('today-kin-number');
    const todayNameEl = document.getElementById('today-kin-name');
    const todayAffirmationEl = document.getElementById('today-kin-affirmation');

    if (todayNumberEl) todayNumberEl.textContent = `Kin ${todayKin.kin}`;
    if (todayNameEl) todayNameEl.textContent = todayKin.fullName;
    if (todayAffirmationEl) {
      todayAffirmationEl.textContent = `"Unifico o propósito de ${todayKin.seal.action}, selando a matriz da ${todayKin.seal.power} com o tom ${todayKin.tone}."`;
    }
  }

  // --- TOGGLE PONTE ARCO-ÍRIS CIRCUMPOLAR ---
  function toggleRainbowBridge() {
    state.isRainbowBridgeActive = !state.isRainbowBridgeActive;
    if (rainbowBridgeMesh) {
      rainbowBridgeMesh.visible = state.isRainbowBridgeActive;
    }
    if (rainbowBtn) {
      rainbowBtn.classList.toggle('active', state.isRainbowBridgeActive);
    }
    if (state.isRainbowBridgeActive) {
      showToast('Ponte Arco-Íris Circumpolar Ativada ✨');
      if (window.triggerCollectivePulse) window.triggerCollectivePulse();
    } else {
      showToast('Ponte Arco-Íris Desativada');
    }
  }

  // --- CONTROLE DE ÁUDIO 432HZ ---
  function toggleAudio() {
    setupWebAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (audioElement.paused) {
      audioElement.play().then(() => {
        state.isPlaying = true;
        updatePlayBtnIcon();
        showToast('Áudio Sagrado 432Hz Iniciado');
      }).catch((err) => {
        console.warn('Erro ao reproduzir áudio:', err);
      });
    } else {
      audioElement.pause();
      state.isPlaying = false;
      updatePlayBtnIcon();
      showToast('Áudio Pausado');
    }
  }

  function updatePlayBtnIcon() {
    if (!playBtn) return;
    const icon = playBtn.querySelector('i');
    if (state.isPlaying) {
      icon.className = 'fas fa-pause';
      playBtn.setAttribute('data-tooltip', 'Pausar Áudio');
      playBtn.classList.add('active');
    } else {
      icon.className = 'fas fa-play';
      playBtn.setAttribute('data-tooltip', 'Tocar Frequência 432Hz');
      playBtn.classList.remove('active');
    }
  }

  // --- GUIA DE RESPIRAÇÃO (PRANAYAMA) ---
  let breathInterval = null;

  function toggleBreathingGuide() {
    state.isBreathingActive = !state.isBreathingActive;
    if (breathBtn) {
      breathBtn.classList.toggle('active', state.isBreathingActive);
    }

    if (state.isBreathingActive) {
      breathGuide.classList.add('active');
      startBreathingCycle();
      showToast('Guia de Respiração Consciente Ativo');
    } else {
      breathGuide.classList.remove('active');
      clearTimeout(breathInterval);
      showToast('Guia de Respiração Desativado');
    }
  }

  function startBreathingCycle() {
    if (!state.isBreathingActive) return;

    breathCircle.className = 'breath-circle inhale';
    breathCaption.textContent = 'Inspire Amor';

    breathInterval = setTimeout(() => {
      if (!state.isBreathingActive) return;
      breathCircle.className = 'breath-circle hold';
      breathCaption.textContent = 'Retenha a Luz';

      breathInterval = setTimeout(() => {
        if (!state.isBreathingActive) return;
        breathCircle.className = 'breath-circle exhale';
        breathCaption.textContent = 'Solte e Cure';

        breathInterval = setTimeout(() => {
          if (!state.isBreathingActive) return;
          breathCircle.className = 'breath-circle rest';
          breathCaption.textContent = 'Paz em Gaia';

          breathInterval = setTimeout(startBreathingCycle, 4000);
        }, 4000);
      }, 4000);
    }, 4000);
  }

  // --- CICLAR FUNDOS ---
  function cycleBackground() {
    state.currentBgIndex = (state.currentBgIndex + 1) % BACKGROUNDS.length;
    const current = BACKGROUNDS[state.currentBgIndex];
    healingBg.style.opacity = '0.4';
    setTimeout(() => {
      healingBg.style.backgroundImage = `url('${current.url}')`;
      healingBg.style.opacity = '0.82';
    }, 300);
    showToast(`Vibração: ${current.name}`);
  }

  // --- TIMER DE MEDITAÇÃO ---
  const TIMER_OPTIONS = [0, 5, 10, 15, 20, 30];
  let currentTimerOptionIndex = 0;

  function cycleMeditationTimer() {
    currentTimerOptionIndex = (currentTimerOptionIndex + 1) % TIMER_OPTIONS.length;
    const minutes = TIMER_OPTIONS[currentTimerOptionIndex];
    clearInterval(state.meditationTimerId);

    if (minutes === 0) {
      state.meditationTimeRemaining = 0;
      timerBadge.classList.remove('active');
      timerBtn.classList.remove('active');
      showToast('Timer de Meditação Desativado');
    } else {
      state.meditationTimeRemaining = minutes * 60;
      timerBadge.classList.add('active');
      timerBtn.classList.add('active');
      updateTimerDisplay();
      showToast(`Timer Definido para ${minutes} minutos`);

      state.meditationTimerId = setInterval(() => {
        state.meditationTimeRemaining--;
        if (state.meditationTimeRemaining <= 0) {
          clearInterval(state.meditationTimerId);
          timerBadge.classList.remove('active');
          timerBtn.classList.remove('active');
          showToast('Sessão de Meditação Concluída ✨ Namastê');
        } else {
          updateTimerDisplay();
        }
      }, 1000);
    }
  }

  function updateTimerDisplay() {
    const mins = Math.floor(state.meditationTimeRemaining / 60);
    const secs = state.meditationTimeRemaining % 60;
    timerBadge.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // --- MODO PURO ZEN ---
  function toggleZenMode() {
    state.isZenMode = !state.isZenMode;
    if (state.isZenMode) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      hudWrapper.style.opacity = '0';
      hudWrapper.style.pointerEvents = 'none';
      showToast('Modo Zen Ativo. Toque para restaurar.');
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      hudWrapper.style.opacity = '';
      hudWrapper.style.pointerEvents = '';
      showToast('Modo Zen Desativado');
    }
  }

  // --- COMPARTILHAMENTO ---
  function handleShare() {
    const shareData = {
      title: 'Terra Earth Gaia | Meditação & Som Curativo 432Hz',
      text: 'Conecte-se com as frequências curativas de Gaia, som transcendental em 432Hz e o Sincronário da Paz.',
      url: 'https://gaia.artesdosul.com/'
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copiado para a área de transferência!');
      });
    } else {
      showToast('Compartilhe: ' + window.location.href);
    }
  }

  // --- TOAST NOTIFICAÇÃO ---
  let toastTimeout = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }

  // --- CALIBRAÇÃO VISUAL & GAUGES DE COR E LUZ ---
  const ARC_LENGTH = 141.4;

  function loadSavedCalibration() {
    try {
      const savedVisual = localStorage.getItem('gaia_visual_calibration');
      if (savedVisual) {
        const parsed = JSON.parse(savedVisual);
        if (typeof parsed.temperature === 'number') state.visualCalibration.temperature = parsed.temperature;
        if (typeof parsed.saturation === 'number') state.visualCalibration.saturation = parsed.saturation;
        if (typeof parsed.brightness === 'number') state.visualCalibration.brightness = parsed.brightness;
        if (typeof parsed.contrast === 'number') state.visualCalibration.contrast = parsed.contrast;
      }
      const savedDynamics = localStorage.getItem('gaia_dynamics_calibration');
      if (savedDynamics) {
        const parsedD = JSON.parse(savedDynamics);
        if (typeof parsedD.octaCount === 'number') state.harmonicDynamics.octaCount = parsedD.octaCount;
        if (typeof parsedD.octaScale === 'number') state.harmonicDynamics.octaScale = parsedD.octaScale;
        if (typeof parsedD.globeSpeed === 'number') state.harmonicDynamics.globeSpeed = parsedD.globeSpeed;
        if (typeof parsedD.syncHarmonic === 'boolean') state.harmonicDynamics.syncHarmonic = parsedD.syncHarmonic;
      }
    } catch (e) {
      console.warn('Erro ao carregar calibração visual/dinâmica:', e);
    }
  }

  function applyVisualCalibration(save = true) {
    const { temperature, saturation, brightness, contrast } = state.visualCalibration;

    // 1. Atualizar Canvas CSS Filter
    let sepiaVal = 0;
    let hueVal = 0;
    if (temperature > 0) {
      sepiaVal = (temperature / 50) * 0.35;
      hueVal = -(temperature / 50) * 8;
    } else if (temperature < 0) {
      hueVal = -(temperature / 50) * 14;
    }

    const sat = (saturation / 100).toFixed(2);
    const bri = (brightness / 100).toFixed(2);
    const con = (contrast / 100).toFixed(2);
    
    if (canvas) {
      canvas.style.filter = `saturate(${sat}) brightness(${bri}) contrast(${con}) sepia(${sepiaVal.toFixed(2)}) hue-rotate(${hueVal.toFixed(1)}deg)`;
    }

    // 2. Three.js Shaders e Luzes
    if (typeof THREE !== 'undefined') {
      if (renderer && renderer.toneMappingExposure !== undefined) {
        renderer.toneMappingExposure = parseFloat(bri);
      }
      if (sunLight) {
        sunLight.intensity = 1.4 * parseFloat(bri);
        if (temperature > 0) {
          const t = temperature / 50;
          sunLight.color.setRGB(1.0, 0.96 - t * 0.12, 0.90 - t * 0.28);
        } else {
          const t = -temperature / 50;
          sunLight.color.setRGB(1.0 - t * 0.22, 0.96 + t * 0.04, 1.0);
        }
      }
      if (ambientLight) {
        ambientLight.intensity = 1.25 * parseFloat(bri);
      }
    }

    // 3. Atualizar Indicadores dos Gauges
    const pTemp = Math.max(0, Math.min(1, (temperature + 50) / 100));
    if (tempArc) tempArc.style.strokeDashoffset = (ARC_LENGTH * (1 - pTemp)).toFixed(1);
    if (tempNeedle) tempNeedle.style.transform = `rotate(${((pTemp - 0.5) * 180).toFixed(1)}deg)`;
    if (tempSlider && document.activeElement !== tempSlider) tempSlider.value = temperature;
    if (tempVal) {
      const kelvin = Math.round(6500 + temperature * 50);
      tempVal.textContent = `${kelvin} K`;
    }
    if (tempState) {
      tempState.textContent = temperature < -15 ? '❄️ Fria (Azul)' : temperature > 15 ? '☀️ Quente (Ouro)' : '✨ Neutro Cósmico';
    }

    const pSat = Math.max(0, Math.min(1, saturation / 200));
    if (satArc) satArc.style.strokeDashoffset = (ARC_LENGTH * (1 - pSat)).toFixed(1);
    if (satNeedle) satNeedle.style.transform = `rotate(${((pSat - 0.5) * 180).toFixed(1)}deg)`;
    if (satSlider && document.activeElement !== satSlider) satSlider.value = saturation;
    if (satVal) satVal.textContent = `${Math.round(saturation)}%`;
    if (satState) {
      satState.textContent = saturation < 25 ? 'Monocromático' : saturation > 140 ? 'Hiper Cósmico' : 'Cores Vivas';
    }

    const pBri = Math.max(0, Math.min(1, (brightness - 50) / 100));
    if (briArc) briArc.style.strokeDashoffset = (ARC_LENGTH * (1 - pBri)).toFixed(1);
    if (briNeedle) briNeedle.style.transform = `rotate(${((pBri - 0.5) * 180).toFixed(1)}deg)`;
    if (briSlider && document.activeElement !== briSlider) briSlider.value = brightness;
    if (briVal) briVal.textContent = `${Math.round(brightness)}%`;
    if (briState) {
      briState.textContent = brightness < 80 ? 'Penumbra Cósmica' : brightness > 120 ? 'Radiação Solar' : 'Equilíbrio Óptico';
    }

    const pCon = Math.max(0, Math.min(1, (contrast - 50) / 110));
    if (conArc) conArc.style.strokeDashoffset = (ARC_LENGTH * (1 - pCon)).toFixed(1);
    if (conNeedle) conNeedle.style.transform = `rotate(${((pCon - 0.5) * 180).toFixed(1)}deg)`;
    if (conSlider && document.activeElement !== conSlider) conSlider.value = contrast;
    if (conVal) conVal.textContent = `${Math.round(contrast)}%`;
    if (conState) {
      conState.textContent = contrast < 80 ? 'Suave Etéreo' : contrast > 130 ? 'Nitidez Profunda' : 'Definição Suave';
    }

    // 4. Salvar Persistência
    if (save) {
      try {
        localStorage.setItem('gaia_visual_calibration', JSON.stringify(state.visualCalibration));
      } catch (e) {}
    }
  }

  function applyHarmonicDynamics(save = true) {
    const { octaCount, octaScale, globeSpeed, syncHarmonic } = state.harmonicDynamics;

    // 1. Atualizar contagem no Three.js
    if (particlesMesh) {
      particlesMesh.count = Math.min(576, octaCount);
    }

    // 2. Gauge Quantidade de Octaedros (72 a 576)
    const pOcta = Math.max(0, Math.min(1, (octaCount - 72) / (576 - 72)));
    if (octaArc) octaArc.style.strokeDashoffset = (ARC_LENGTH * (1 - pOcta)).toFixed(1);
    if (octaNeedle) octaNeedle.style.transform = `rotate(${((pOcta - 0.5) * 180).toFixed(1)}deg)`;
    if (octaSlider && document.activeElement !== octaSlider) octaSlider.value = octaCount;
    if (octaVal) octaVal.textContent = `${octaCount} Cristais`;
    if (octaState) {
      octaState.textContent = octaCount === 144 ? '✨ Padrão Sagrado 144'
        : octaCount === 432 ? '🎵 Frequência Cósmica 432'
        : octaCount === 288 ? '💎 Duplo Harmônico 288'
        : octaCount === 576 ? '🌌 Matriz Quântica 576'
        : octaCount < 100 ? '🌱 Sub-Harmônico 72'
        : 'Harmônico Ativo';
    }

    // 3. Gauge Escala / Tamanho (50 a 250)
    const pScale = Math.max(0, Math.min(1, (octaScale - 50) / (250 - 50)));
    if (scaleArc) scaleArc.style.strokeDashoffset = (ARC_LENGTH * (1 - pScale)).toFixed(1);
    if (scaleNeedle) scaleNeedle.style.transform = `rotate(${((pScale - 0.5) * 180).toFixed(1)}deg)`;
    if (scaleSlider && document.activeElement !== scaleSlider) scaleSlider.value = octaScale;
    if (scaleVal) scaleVal.textContent = `${Math.round(octaScale)}%`;
    if (scaleState) {
      scaleState.textContent = octaScale === 100 ? '📐 Proporção Áurea'
        : octaScale > 160 ? '💎 Macro Portais de Luz'
        : octaScale < 75 ? '✨ Poeira Estelar Fina'
        : 'Dimensão Harmônica';
    }

    // 4. Gauge Rotação do Globo (0.0 a 5.0)
    const pSpeed = Math.max(0, Math.min(1, globeSpeed / 5.0));
    if (speedArc) speedArc.style.strokeDashoffset = (ARC_LENGTH * (1 - pSpeed)).toFixed(1);
    if (speedNeedle) speedNeedle.style.transform = `rotate(${((pSpeed - 0.5) * 180).toFixed(1)}deg)`;
    if (speedSlider && document.activeElement !== speedSlider) speedSlider.value = globeSpeed;
    if (speedVal) speedVal.textContent = `${globeSpeed.toFixed(1)}x`;
    if (speedState) {
      speedState.textContent = globeSpeed === 0 ? '⏸️ Pausa Contemplativa'
        : globeSpeed === 1.0 ? '🪐 Órbita Natural (1.0x)'
        : globeSpeed > 2.5 ? '⚡ Vórtice Acelerado'
        : globeSpeed < 0.6 ? '🧘 Meditação Serena'
        : 'Rotação Harmônica';
    }

    // 5. Botão de Sincronização Harmônica
    if (syncHarmonicBtn) {
      syncHarmonicBtn.classList.toggle('active', syncHarmonic);
      const span = syncHarmonicBtn.querySelector('span');
      if (span) {
        span.textContent = syncHarmonic
          ? 'Aumento Harmônico Sincronizado Ativo (Quantidade + Tamanho)'
          : 'Aumento Harmônico Desvinculado (Ajuste Independente)';
      }
    }

    // 6. Salvar
    if (save) {
      try {
        localStorage.setItem('gaia_dynamics_calibration', JSON.stringify(state.harmonicDynamics));
      } catch (e) {}
    }
  }

  function setPreset(presetName) {
    if (presetName === 'warm') {
      state.visualCalibration = { temperature: 30, saturation: 125, brightness: 108, contrast: 110 };
      showToast('Predefinição: Aurora Dourada ☀️');
    } else if (presetName === 'cool') {
      state.visualCalibration = { temperature: -30, saturation: 115, brightness: 105, contrast: 120 };
      showToast('Predefinição: Pleiades Ciano ❄️');
    } else if (presetName === 'vivid') {
      state.visualCalibration = { temperature: 10, saturation: 160, brightness: 112, contrast: 125 };
      showToast('Predefinição: Noosfera Viva 🌈');
    } else {
      state.visualCalibration = { temperature: 0, saturation: 100, brightness: 100, contrast: 100 };
      showToast('Predefinição: Equilíbrio Cósmico 🌐');
    }

    if (presetButtons) {
      presetButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-preset') === presetName);
      });
    }

    applyVisualCalibration();
  }

  function setDynamicsPreset(presetName) {
    if (presetName === 'vortex432') {
      state.harmonicDynamics.octaCount = 432;
      state.harmonicDynamics.octaScale = 145;
      state.harmonicDynamics.globeSpeed = 2.2;
      showToast('Predefinição: Vórtice 432Hz 🌪️');
    } else if (presetName === 'matrix576') {
      state.harmonicDynamics.octaCount = 576;
      state.harmonicDynamics.octaScale = 180;
      state.harmonicDynamics.globeSpeed = 1.6;
      showToast('Predefinição: Constelação 576 🌌');
    } else if (presetName === 'zen') {
      state.harmonicDynamics.octaCount = 144;
      state.harmonicDynamics.octaScale = 110;
      state.harmonicDynamics.globeSpeed = 0.2;
      showToast('Predefinição: Contemplação Zen 🧘');
    } else {
      state.harmonicDynamics.octaCount = 144;
      state.harmonicDynamics.octaScale = 100;
      state.harmonicDynamics.globeSpeed = 1.0;
      showToast('Predefinição: Órbita Sagrada (144) 🪐');
    }

    if (dynamicsPresetButtons) {
      dynamicsPresetButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-dyn-preset') === presetName);
      });
    }

    applyHarmonicDynamics();
  }

  function switchGaugeTab(tabName) {
    const isColor = tabName === 'tab-color';
    if (tabBtnColor) {
      tabBtnColor.classList.toggle('active', isColor);
      tabBtnColor.setAttribute('aria-selected', isColor ? 'true' : 'false');
    }
    if (tabBtnDynamics) {
      tabBtnDynamics.classList.toggle('active', !isColor);
      tabBtnDynamics.setAttribute('aria-selected', !isColor ? 'true' : 'false');
    }
    if (tabContentColor) tabContentColor.classList.toggle('active', isColor);
    if (tabContentDynamics) tabContentDynamics.classList.toggle('active', !isColor);
  }

  function resetVisualCalibration() {
    state.visualCalibration = { temperature: 0, saturation: 100, brightness: 100, contrast: 100 };
    state.harmonicDynamics = { octaCount: 144, octaScale: 100, globeSpeed: 1.0, syncHarmonic: true };
    if (presetButtons) {
      presetButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-preset') === 'default');
      });
    }
    if (dynamicsPresetButtons) {
      dynamicsPresetButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-dyn-preset') === 'default');
      });
    }
    applyVisualCalibration();
    applyHarmonicDynamics();
    showToast('Calibração Restaurada ao Padrão Cósmico ✨');
  }

  // --- EVENT LISTENERS & INICIALIZAÇÃO ---
  function bindEvents() {
    if (playBtn) playBtn.addEventListener('click', toggleAudio);
    
    if (volumeBtn && volumeWrapper) {
      volumeBtn.addEventListener('click', () => {
        volumeWrapper.classList.toggle('open');
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        state.volume = parseFloat(e.target.value);
        audioElement.volume = state.volume;
        if (state.volume === 0) {
          volumeBtn.querySelector('i').className = 'fas fa-volume-mute';
        } else {
          volumeBtn.querySelector('i').className = 'fas fa-volume-up';
        }
      });
    }

    if (breathBtn) breathBtn.addEventListener('click', toggleBreathingGuide);
    if (bgCycleBtn) bgCycleBtn.addEventListener('click', cycleBackground);
    if (timerBtn) timerBtn.addEventListener('click', cycleMeditationTimer);
    if (zenBtn) zenBtn.addEventListener('click', toggleZenMode);
    if (shareBtn) shareBtn.addEventListener('click', handleShare);
    if (rainbowBtn) rainbowBtn.addEventListener('click', toggleRainbowBridge);

    // Modal Calibração & Gauges
    if (gaugeBtn && gaugeModal) {
      gaugeBtn.addEventListener('click', () => {
        gaugeModal.classList.add('open');
        applyVisualCalibration(false);
        applyHarmonicDynamics(false);
      });
    }
    if (closeGaugeBtn && gaugeModal) {
      closeGaugeBtn.addEventListener('click', () => {
        gaugeModal.classList.remove('open');
      });
    }
    if (resetGaugeBtn) {
      resetGaugeBtn.addEventListener('click', resetVisualCalibration);
    }

    // Abas de Navegação
    if (tabBtnColor) {
      tabBtnColor.addEventListener('click', () => switchGaugeTab('tab-color'));
    }
    if (tabBtnDynamics) {
      tabBtnDynamics.addEventListener('click', () => switchGaugeTab('tab-dynamics'));
    }

    // Sliders dos Gauges de Luz
    if (tempSlider) {
      tempSlider.addEventListener('input', (e) => {
        state.visualCalibration.temperature = parseFloat(e.target.value);
        applyVisualCalibration();
      });
    }
    if (satSlider) {
      satSlider.addEventListener('input', (e) => {
        state.visualCalibration.saturation = parseFloat(e.target.value);
        applyVisualCalibration();
      });
    }
    if (briSlider) {
      briSlider.addEventListener('input', (e) => {
        state.visualCalibration.brightness = parseFloat(e.target.value);
        applyVisualCalibration();
      });
    }
    if (conSlider) {
      conSlider.addEventListener('input', (e) => {
        state.visualCalibration.contrast = parseFloat(e.target.value);
        applyVisualCalibration();
      });
    }

    // Sliders dos Gauges de Geometria & Rotação
    if (octaSlider) {
      octaSlider.addEventListener('input', (e) => {
        const count = parseInt(e.target.value);
        state.harmonicDynamics.octaCount = count;
        if (state.harmonicDynamics.syncHarmonic) {
          // Aumento harmônico sincronizado (70% a 180%)
          const r = (count - 72) / (576 - 72);
          state.harmonicDynamics.octaScale = Math.round(75 + r * 115);
        }
        applyHarmonicDynamics();
      });
    }
    if (scaleSlider) {
      scaleSlider.addEventListener('input', (e) => {
        state.harmonicDynamics.octaScale = parseFloat(e.target.value);
        applyHarmonicDynamics();
      });
    }
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        state.harmonicDynamics.globeSpeed = parseFloat(e.target.value);
        applyHarmonicDynamics();
      });
    }

    // Botão Sincronização Harmônica
    if (syncHarmonicBtn) {
      syncHarmonicBtn.addEventListener('click', () => {
        state.harmonicDynamics.syncHarmonic = !state.harmonicDynamics.syncHarmonic;
        applyHarmonicDynamics();
        showToast(state.harmonicDynamics.syncHarmonic ? 'Sincronização Harmônica Ativada ✨' : 'Ajustes Desvinculados (Independente)');
      });
    }

    // Presets dos Gauges de Luz
    if (presetButtons) {
      presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const preset = btn.getAttribute('data-preset');
          setPreset(preset);
        });
      });
    }

    // Presets dos Gauges de Dinâmica
    if (dynamicsPresetButtons) {
      dynamicsPresetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const preset = btn.getAttribute('data-dyn-preset');
          setDynamicsPreset(preset);
        });
      });
    }

    // Modal Bênção
    if (prayerBtn && prayerModal) {
      prayerBtn.addEventListener('click', () => {
        prayerModal.classList.add('open');
      });
    }
    if (closePrayerBtn && prayerModal) {
      closePrayerBtn.addEventListener('click', () => {
        prayerModal.classList.remove('open');
      });
    }

    // Modal Kin
    if (kinBtn && kinModal) {
      kinBtn.addEventListener('click', () => {
        kinModal.classList.add('open');
      });
    }
    if (closeKinBtn && kinModal) {
      closeKinBtn.addEventListener('click', () => {
        kinModal.classList.remove('open');
      });
    }
    if (calcKinBtn && birthdateInput) {
      calcKinBtn.addEventListener('click', () => {
        const val = birthdateInput.value;
        if (!val) return;
        const parts = val.split('-');
        const bDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const result = calculateKin(bDate);
        if (userKinResult && userKinTitle && userKinDesc) {
          userKinTitle.textContent = `Kin ${result.kin} • ${result.fullName}`;
          userKinDesc.textContent = `Poder: ${result.seal.power} • Ação: ${result.seal.action}`;
          userKinResult.classList.remove('hidden');
        }
      });
    }

    // Modal Solfeggio
    if (solfeggioBtn && solfeggioModal) {
      solfeggioBtn.addEventListener('click', () => {
        solfeggioModal.classList.add('open');
      });
    }
    if (closeSolfeggioBtn && solfeggioModal) {
      closeSolfeggioBtn.addEventListener('click', () => {
        solfeggioModal.classList.remove('open');
      });
    }

    // Seleção de Frequências Solfeggio
    const solfeggioCards = document.querySelectorAll('.solfeggio-card');
    solfeggioCards.forEach(card => {
      card.addEventListener('click', () => {
        solfeggioCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const freq = parseFloat(card.getAttribute('data-freq'));
        playSolfeggioTone(freq);
      });
    });

    // Pulso Coletivo Global
    if (globalPulseBtn) {
      globalPulseBtn.addEventListener('click', () => {
        if (window.triggerCollectivePulse) window.triggerCollectivePulse();
        state.meditatorsCount += Math.floor(Math.random() * 5) + 1;
        if (meditatorsCountEl) meditatorsCountEl.textContent = state.meditatorsCount.toLocaleString('pt-BR');
        showToast('Pulso Coletivo de Luz Emitido para a Noosfera ✨');
      });
    }

    // Fechar modais ao clicar fora
    [prayerModal, kinModal, solfeggioModal, gaugeModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.classList.remove('open');
        });
      }
    });

    // Splash Screen
    if (enterBtn && welcomeSplash) {
      enterBtn.addEventListener('click', () => {
        welcomeSplash.classList.add('hidden');
        setupWebAudio();
        toggleAudio();
        wakeControls();
      });
    }

    // Sair do Modo Zen
    canvas.addEventListener('click', () => {
      if (state.isZenMode) toggleZenMode();
    });

    // Service Worker PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.warn('Registro do Service Worker falhou:', err);
      });
    }
  }

  // --- INICIALIZAÇÃO ---
  document.addEventListener('DOMContentLoaded', () => {
    loadSavedCalibration();
    initVisualizerSticks();
    initThreeJS();
    applyVisualCalibration(false);
    applyHarmonicDynamics(false);
    initTodayKin();
    bindEvents();
    wakeControls();
  });

})();
