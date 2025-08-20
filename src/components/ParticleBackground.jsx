import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/*
  IMPORTANT: uMouseRepulsion changed from bool -> float.
  This avoids platform/driver/ThreeJS inconsistencies with boolean uniforms.
  Use comparisons (uMouseRepulsion > 0.5) in the shader.
*/
const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
/* changed to float */
uniform float uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform float uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      
      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);
  
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0); // Center in UV space
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion > 0.5) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent > 0.5) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha); // Enhance contrast
    alpha = min(alpha, 1.0); // Clamp to maximum 1.0
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

function FallbackParticles({ mouseInteraction = true }) {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const parallax = useRef({ x: 0, y: 0 });
  const particles = useRef([]);
  const particleMeshes = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!window.WebGLRenderingContext) return; // fallback: nothing

    const PARTICLE_COUNT = 100;
    const PARTICLE_RADIUS = 2;
    const SPEED = 0.2;
    const COLORS = ['#2E4A46', '#282A36', '#1F2833'];
    const PARALLAX_MAX = 30;
    const LERP_FACTOR = 0.08;

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -1, 1);

    particles.current = [];
    particleMeshes.current = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const angle = Math.random() * Math.PI * 2;
      const speed = SPEED * (0.7 + Math.random() * 0.6);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.current.push({ x, y, angle, speed, color });

      const geometry = new THREE.CircleGeometry(PARTICLE_RADIUS, 16);
      const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, 0);
      scene.add(mesh);
      particleMeshes.current.push(mesh);
    }

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.right = window.innerWidth;
      camera.top = window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouse.current.x = x * PARALLAX_MAX;
      mouse.current.y = y * PARALLAX_MAX;
    };
    if (mouseInteraction) window.addEventListener('mousemove', handleMouseMove);

    let lastFrame = 0;
    const animate = (now) => {
      if (now - lastFrame < 16) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrame = now;

      parallax.current.x = lerp(parallax.current.x, mouse.current.x, LERP_FACTOR);
      parallax.current.y = lerp(parallax.current.y, mouse.current.y, LERP_FACTOR);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        let p = particles.current[i];
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        if (p.x < 0) p.x += window.innerWidth;
        if (p.x > window.innerWidth) p.x -= window.innerWidth;
        if (p.y < 0) p.y += window.innerHeight;
        if (p.y > window.innerHeight) p.y -= window.innerHeight;
        particleMeshes.current[i].position.set(p.x + parallax.current.x, p.y + parallax.current.y, 0);
      }
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mouseInteraction) window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
      particleMeshes.current.forEach(mesh => {
        mesh.geometry.dispose();
        mesh.material.dispose();
        scene.remove(mesh);
      });
      renderer.dispose();
    };
  }, [mouseInteraction]);

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100vh', zIndex: 0, pointerEvents: 'none' }} aria-hidden>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100vw', height: '100vh' }} />
    </div>
  );
}

function ShaderBackground({
  mouseRepulsion = false,
  mouseInteraction = true,
  density = 1.0,
  glowIntensity = 0.3,
  saturation = 0.5,
  hueShift = 140.0,
  speed = 0.7,
  disableAnimation = false,
  transparent = true,
  ...rest
}) {
  const container = useRef(null);
  const uniformsRef = useRef(null);
  const targetMouse = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const targetActive = useRef(0.0);
  const smoothActive = useRef(0.0);

  useEffect(() => {
    if (!container.current) return;
    const el = container.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: transparent });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, transparent ? 0 : 1);

    // Make sure canvas fully covers the container and can receive events (if allowed).
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    // control whether canvas receives pointer events depending on prop
    renderer.domElement.style.pointerEvents = mouseInteraction ? 'auto' : 'none';

    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector3(1, 1, 1) },
      uFocal: { value: new THREE.Vector2(0.5, 0.5) },
      uRotation: { value: new THREE.Vector2(1.0, 0.0) },
      uStarSpeed: { value: 0.5 },
      uDensity: { value: density },
      uHueShift: { value: hueShift },
      uSpeed: { value: speed },
      uMouse: { value: new THREE.Vector2(smoothMouse.current.x, smoothMouse.current.y) },
      uGlowIntensity: { value: glowIntensity },
      uSaturation: { value: saturation },
      // use float (0 or 1) for repulsion toggle
      uMouseRepulsion: { value: mouseRepulsion ? 1.0 : 0.0 },
      uTwinkleIntensity: { value: 0.3 },
      uRotationSpeed: { value: 0.1 },
      uRepulsionStrength: { value: 2.0 },
      uMouseActiveFactor: { value: 0.0 },
      uAutoCenterRepulsion: { value: 0.0 },
      uTransparent: { value: transparent ? 1.0 : 0.0 },
    };

    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: Boolean(transparent),
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function resize() {
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h, w / h);
    }
    window.addEventListener('resize', resize);
    resize();

    let rafId;
    let start = performance.now();

    function animate(t) {
      rafId = requestAnimationFrame(animate);
      if (!disableAnimation) {
        uniforms.uTime.value = (t - start) * 0.001;
        uniforms.uStarSpeed.value = ((t - start) * 0.001 * 0.5) / 10.0;
      }

      // smooth mouse
      const lerp = 0.05;
      smoothMouse.current.x += (targetMouse.current.x - smoothMouse.current.x) * lerp;
      smoothMouse.current.y += (targetMouse.current.y - smoothMouse.current.y) * lerp;
      smoothActive.current += (targetActive.current - smoothActive.current) * lerp;

      // update uniforms with smoothed values
      uniforms.uMouse.value.set(smoothMouse.current.x, smoothMouse.current.y);
      uniforms.uMouseActiveFactor.value = smoothActive.current;

      renderer.render(scene, camera);
    }

    rafId = requestAnimationFrame(animate);

    // map pointer position inside the container to normalized [0,1] coords (y inverted to match shader)
    function handleCanvasMove(e) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse.current = { x: Math.min(Math.max(x, 0), 1), y: Math.min(Math.max(y, 0), 1) };
      targetActive.current = 1.0;
    }

    function handleLeave() {
      targetActive.current = 0.0;
    }

    // Global fallback: if canvas is not receiving events or you want to avoid enabling pointerEvents on the canvas,
    // listen to window and translate coords to the container rectangle. This keeps UI clickable above the canvas.
    function handleWindowMove(e) {
      const rect = el.getBoundingClientRect();
      // Ignore if pointer is outside container bounds to avoid accidental activation
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse.current = { x: Math.min(Math.max(x, 0), 1), y: Math.min(Math.max(y, 0), 1) };
      targetActive.current = 1.0;
    }

    // Attach listeners to renderer.domElement (canvas) and also window as a safe fallback.
    if (mouseInteraction) {
      renderer.domElement.addEventListener('mousemove', handleCanvasMove);
      renderer.domElement.addEventListener('pointermove', handleCanvasMove);
      renderer.domElement.addEventListener('mouseleave', handleLeave);
      renderer.domElement.addEventListener('pointerleave', handleLeave);

      // fallback global listeners (won't capture if pointer is outside container)
      window.addEventListener('mousemove', handleWindowMove);
      window.addEventListener('pointermove', handleWindowMove);
      window.addEventListener('mouseleave', handleLeave);
      window.addEventListener('pointerleave', handleLeave);
    }

    // Keep shader uniform in sync if props change (mouseRepulsion or transparent)
    // Note: this runs once here; outer effect deps also include those props to recreate if necessary.
    // But we also patch the uniform here to be safe if the prop is stable.
    uniforms.uMouseRepulsion.value = mouseRepulsion ? 1.0 : 0.0;
    uniforms.uTransparent.value = transparent ? 1.0 : 0.0;

    // cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      if (mouseInteraction) {
        renderer.domElement.removeEventListener('mousemove', handleCanvasMove);
        renderer.domElement.removeEventListener('pointermove', handleCanvasMove);
        renderer.domElement.removeEventListener('mouseleave', handleLeave);
        renderer.domElement.removeEventListener('pointerleave', handleLeave);

        window.removeEventListener('mousemove', handleWindowMove);
        window.removeEventListener('pointermove', handleWindowMove);
        window.removeEventListener('mouseleave', handleLeave);
        window.removeEventListener('pointerleave', handleLeave);
      }
      el.removeChild(renderer.domElement);
      material.dispose();
      geometry.dispose();
      renderer.dispose();
    };
  }, [mouseInteraction, mouseRepulsion, density, glowIntensity, saturation, hueShift, speed, disableAnimation, transparent]);

  return (
    <div
      ref={container}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100vh',
        zIndex: 0,
        // container itself should not block clicks; canvas controls whether it receives pointer events.
        pointerEvents: 'none',
      }}
      {...rest}
    />
  );
}

export default function ParticleBackground(props) {
  const [useFallback, setUseFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [measuredFps, setMeasuredFps] = useState(null);

  useEffect(() => {
    let raf = null;
    let startTime = null;
    let frames = 0;
    let lastTime = null;
    let finished = false;

    const maxFrames = 90; // run up to this many frames (safeguard)
    const maxTime = 2500; // or this many ms
    const thresholdFps = 30; // threshold from user

    const hasWebGL = (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        console.warn('Failed to create WebGL context:', e);
        return false;
      }
    })();

    if (!hasWebGL) {
      setUseFallback(true);
      setMeasuredFps(0);
      setLoading(false);
      try {
        window.dispatchEvent(new CustomEvent('app:loadingFinished', { detail: { measuredFps: 0, useFallback: true } }));
      } catch (e) {console.warn('Failed to dispatch loadingFinished event:', e);}
      return;
    }

    function step(ts) {
      if (!startTime) {
        startTime = ts;
        lastTime = ts;
        frames = 0;
      }
      frames++;
      lastTime = ts;

      const elapsed = ts - startTime;

      if (frames >= maxFrames || elapsed >= maxTime) {
        const seconds = elapsed / 1000 || 1 / 60;
        const fps = Math.round((frames / seconds) * 10) / 10;
        finished = true;
        setMeasuredFps(fps);
        const decideFallback = fps < thresholdFps;
        setUseFallback(decideFallback);
        setLoading(false);
        try {
          window.dispatchEvent(new CustomEvent('app:loadingFinished', { detail: { measuredFps: fps, useFallback: decideFallback } }));
        } catch (e) {
          console.warn('Failed to dispatch loadingFinished event:', e);
        }
        return;
      }

      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);

    const safetyTimer = setTimeout(() => {
      if (!finished) {
        const elapsed = lastTime ? (lastTime - startTime) : maxTime;
        const seconds = (elapsed / 1000) || 1 / 60;
        const fps = Math.round((frames / seconds) * 10) / 10;
        setMeasuredFps(fps);
        const decideFallback = fps < thresholdFps;
        setUseFallback(decideFallback);
        setLoading(false);
        finished = true;
        try {
          window.dispatchEvent(new CustomEvent('app:loadingFinished', { detail: { measuredFps: fps, useFallback: decideFallback } }));
        } catch (e) {
          console.warn('Failed to dispatch loadingFinished event:', e);
        }
      }
    }, maxTime + 500);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(safetyTimer);
    };
  }, []);

  if (loading) {
    return (
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050508',
          zIndex: 9999,
          color: '#fff',
          flexDirection: 'column',
          pointerEvents: 'auto',
        }}
      >
        <div style={{ marginBottom: 18, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Aguarde, testando desempenho...</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>Executando benchmark rápido para escolher o melhor background</div>
        </div>

        <div style={{ width: 160, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 6, overflow: 'hidden' }}>
          <div
            style={{
              width: '60%',
              height: '100%',
              background: 'linear-gradient(90deg,#7ce7ff,#6c8cff)',
              animation: 'pb-loading 1.4s linear infinite',
            }}
          />
        </div>

        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.9 }}>
          {measuredFps === null ? 'Medindo...' : `FPS médio: ${measuredFps}`}
        </div>

        <style>{`
          @keyframes pb-loading {
            0% { transform: translateX(-40%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(40%); }
          }
        `}</style>
      </div>
    );
  }

  if (useFallback) return <FallbackParticles {...props} />;
  return <ShaderBackground {...props} />;
}