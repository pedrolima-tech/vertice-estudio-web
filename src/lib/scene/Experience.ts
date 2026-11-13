import * as THREE from "three";
import { sceneState } from "./state";
import { gemFragment, gemVertex, particlesFragment, particlesVertex } from "./shaders";

/* ==========================================================================
   EXPERIENCE — a cena 3D que acompanha a narrativa “do bruto ao lapidado”.
   Uma nuvem de partículas se reúne, vira estrutura, é construída como
   superfície sólida e termina como uma gema iridescente com um anel orbital.
   ========================================================================== */

type Options = { reducedMotion: boolean; mobile: boolean };

const damp = (a: number, b: number, lambda: number, dt: number) => THREE.MathUtils.lerp(a, b, 1 - Math.exp(-lambda * dt));
const smooth = (e0: number, e1: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

function cssColor(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(v || fallback);
}

export class Experience {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  private root = new THREE.Group();
  private spinner = new THREE.Group();
  private clock = new THREE.Clock();

  private particles!: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private wire!: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  private gem!: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;

  private view = { w: 1, h: 1, worldW: 1, worldH: 1 };
  private pointer = new THREE.Vector2(0, 0);
  private pointerSmooth = new THREE.Vector2(0, 0);
  private current = { ...sceneState };
  private time = 0;
  private raf = 0;
  private running = false;
  private disposed = false;
  private pixelRatio = 1;
  private frameSamples: number[] = [];
  private lastSig = "";

  constructor(private canvas: HTMLCanvasElement, private opts: Options) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !opts.mobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.pixelRatio = Math.min(window.devicePixelRatio, opts.mobile ? 1.5 : 1.75);
    this.renderer.setPixelRatio(this.pixelRatio);

    this.camera.position.set(0, 0, 10);
    this.scene.add(this.root);
    this.root.add(this.spinner);

    this.build();
    this.resize();

    window.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.onPointer, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  /* ------------------------------------------------------------------------ */
  /* Construção                                                               */
  /* ------------------------------------------------------------------------ */

  private build() {
    const primary = cssColor("--color-primary", "#4de8ff");
    const accent = cssColor("--color-accent", "#7c5cff");
    const glow = cssColor("--color-glow", "#c86bff");
    const deep = new THREE.Color("#070912");

    const count = this.opts.mobile ? 4200 : 11000;
    const R = 1.9;

    // Estado 2: amostras sobre as arestas de um icosaedro
    const ico = new THREE.IcosahedronGeometry(R, 1);
    const edges = new THREE.EdgesGeometry(ico, 1);
    const ep = edges.getAttribute("position") as THREE.BufferAttribute;
    const segCount = ep.count / 2;

    const p0 = new Float32Array(count * 3);
    const p1 = new Float32Array(count * 3);
    const p2 = new Float32Array(count * 3);
    const p3 = new Float32Array(count * 3);
    const p4 = new Float32Array(count * 3);
    const rnd = new Float32Array(count * 4);

    const golden = Math.PI * (3 - Math.sqrt(5));
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 0 · Nuvem ampla, mais densa no centro
      const r0 = 2.5 + Math.pow(Math.random(), 0.7) * 8;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      p0[i3] = r0 * Math.sin(ph) * Math.cos(th) * 1.4;
      p0[i3 + 1] = r0 * Math.sin(ph) * Math.sin(th) * 0.8;
      p0[i3 + 2] = r0 * Math.cos(ph) * 0.6 - 1.5;

      // 1 · Esfera de Fibonacci (núcleo)
      const y = 1 - (i / (count - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const ang = golden * i;
      const jitter = 1 + (Math.random() - 0.5) * 0.08;
      p1[i3] = Math.cos(ang) * rad * R * 0.85 * jitter;
      p1[i3 + 1] = y * R * 0.85 * jitter;
      p1[i3 + 2] = Math.sin(ang) * rad * R * 0.85 * jitter;

      // 2 · Arestas da estrutura
      const s = Math.floor(Math.random() * segCount);
      a.fromBufferAttribute(ep, s * 2);
      b.fromBufferAttribute(ep, s * 2 + 1);
      a.lerp(b, Math.random());
      p2[i3] = a.x + (Math.random() - 0.5) * 0.03;
      p2[i3 + 1] = a.y + (Math.random() - 0.5) * 0.03;
      p2[i3 + 2] = a.z + (Math.random() - 0.5) * 0.03;

      // 3 · Superfície da gema (brilhos sobre a pele)
      p3[i3] = Math.cos(ang) * rad * R * 1.03;
      p3[i3 + 1] = y * R * 1.03;
      p3[i3 + 2] = Math.sin(ang) * rad * R * 1.03;

      // 4 · Anéis orbitais inclinados
      const ring = Math.random() < 0.7 ? 0 : 1;
      const rr = ring === 0 ? 2.9 + Math.random() * 0.7 : 3.9 + Math.random() * 0.25;
      const ra = Math.random() * Math.PI * 2;
      const tilt = ring === 0 ? 0.32 : -0.5;
      const rx = Math.cos(ra) * rr;
      const rz = Math.sin(ra) * rr;
      const ry = (Math.random() - 0.5) * (ring === 0 ? 0.12 : 0.04);
      p4[i3] = rx;
      p4[i3 + 1] = ry * Math.cos(tilt) - rz * Math.sin(tilt);
      p4[i3 + 2] = ry * Math.sin(tilt) + rz * Math.cos(tilt);

      rnd[i * 4] = Math.random();
      rnd[i * 4 + 1] = Math.random();
      rnd[i * 4 + 2] = Math.random();
      rnd[i * 4 + 3] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(p0, 3));
    geo.setAttribute("aP1", new THREE.BufferAttribute(p1, 3));
    geo.setAttribute("aP2", new THREE.BufferAttribute(p2, 3));
    geo.setAttribute("aP3", new THREE.BufferAttribute(p3, 3));
    geo.setAttribute("aP4", new THREE.BufferAttribute(p4, 3));
    geo.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 4));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);

    const pMat = new THREE.ShaderMaterial({
      vertexShader: particlesVertex,
      fragmentShader: particlesFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uIntro: { value: 0 },
        uPixelRatio: { value: this.pixelRatio },
        uSize: { value: this.opts.mobile ? 4.2 : 3.6 },
        uMouse: { value: new THREE.Vector3(99, 99, 0) },
        uMouseForce: { value: this.opts.reducedMotion || this.opts.mobile ? 0 : 0.55 },
        uColorA: { value: primary },
        uColorB: { value: accent },
        uOpacity: { value: 1 },
      },
    });
    this.particles = new THREE.Points(geo, pMat);
    this.particles.renderOrder = 2;
    this.spinner.add(this.particles);

    // Estrutura em linhas
    const wMat = new THREE.LineBasicMaterial({
      color: primary,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.wire = new THREE.LineSegments(edges, wMat);
    this.wire.renderOrder = 1;
    this.spinner.add(this.wire);

    // Gema
    const gGeo = new THREE.IcosahedronGeometry(R * 0.97, this.opts.mobile ? 14 : 28);
    const gMat = new THREE.ShaderMaterial({
      vertexShader: gemVertex,
      fragmentShader: gemFragment,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uDistort: { value: 0.18 },
        uBuild: { value: 0 },
        uPolish: { value: 0 },
        uOpacity: { value: 0 },
        uLight: { value: new THREE.Vector3(1.5, 2, 3) },
        uColorA: { value: primary },
        uColorB: { value: accent },
        uColorC: { value: glow },
        uDeep: { value: deep },
      },
    });
    this.gem = new THREE.Mesh(gGeo, gMat);
    this.gem.renderOrder = 0;
    this.gem.visible = false;
    this.spinner.add(this.gem);

    ico.dispose();
  }

  /* ------------------------------------------------------------------------ */
  /* Eventos                                                                  */
  /* ------------------------------------------------------------------------ */

  private resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Ignora o “pulo” da barra de endereço no mobile
    if (this.opts.mobile && Math.abs(w - this.view.w) < 1 && Math.abs(h - this.view.h) < 140) return;
    this.view.w = w;
    this.view.h = h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const dist = this.camera.position.z;
    this.view.worldH = 2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * dist;
    this.view.worldW = this.view.worldH * this.camera.aspect;
    this.requestFrame();
  };

  private onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    this.pointer.set((e.clientX / this.view.w) * 2 - 1, -(e.clientY / this.view.h) * 2 + 1);
  };

  private onVisibility = () => {
    if (document.hidden) this.stop();
    else this.start();
  };

  /* ------------------------------------------------------------------------ */
  /* Loop                                                                     */
  /* ------------------------------------------------------------------------ */

  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.clock.getDelta();
    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private requestFrame() {
    this.lastSig = "";
  }

  private tick = () => {
    if (!this.running) return;
    // Amortecimento usa o tempo real (converge certo mesmo com fps baixo);
    // o relógio das animações é limitado para não “saltar” após travadas.
    const dt = Math.min(this.clock.getDelta(), 0.25);
    if (this.opts.reducedMotion) {
      // Sem animação contínua: só redesenha quando o estado-alvo muda
      const sig = `${sceneState.morph}|${sceneState.x}|${sceneState.y}|${sceneState.scale}|${sceneState.dim}|${this.view.w}|${this.view.h}`;
      if (sig === this.lastSig) {
        this.raf = requestAnimationFrame(this.tick);
        return;
      }
      this.lastSig = sig;
    }
    this.update(dt);
    this.renderer.render(this.scene, this.camera);
    this.adaptQuality(dt);
    this.raf = requestAnimationFrame(this.tick);
  };

  /** Se os primeiros segundos ficarem lentos, reduz a resolução interna. */
  private adaptQuality(dt: number) {
    if (this.frameSamples.length > 150 || document.hidden) return;
    this.frameSamples.push(dt);
    if (this.frameSamples.length === 150) {
      const avg = this.frameSamples.slice(30).reduce((s, v) => s + v, 0) / 120;
      if (avg > 1 / 40 && this.pixelRatio > 1) {
        this.pixelRatio = 1;
        this.renderer.setPixelRatio(1);
        this.particles.material.uniforms.uPixelRatio.value = 1;
        this.renderer.setSize(this.view.w, this.view.h, false);
      }
    }
  }

  private update(dt: number) {
    const reduce = this.opts.reducedMotion;
    if (!reduce) this.time += Math.min(dt, 1 / 20);

    // Persegue o estado-alvo com amortecimento
    const c = this.current;
    const k = reduce ? 1000 : 3.2;
    c.morph = damp(c.morph, sceneState.morph, k, dt);
    c.x = damp(c.x, sceneState.x, k * 0.8, dt);
    c.y = damp(c.y, sceneState.y, k * 0.8, dt);
    c.scale = damp(c.scale, sceneState.scale, k * 0.8, dt);
    c.dim = damp(c.dim, sceneState.dim, k, dt);
    c.intro = reduce ? 1 : damp(c.intro, sceneState.intro, 1.6, dt);

    this.pointerSmooth.lerp(this.pointer, reduce ? 1 : 1 - Math.exp(-4 * dt));

    // Posição e escala relativas à viewport
    const base = Math.min(this.view.worldW, this.view.worldH * 1.1) / 7.6;
    const s = base * c.scale * (1 - c.dim * 0.15);
    this.root.position.set(c.x * this.view.worldW, c.y * this.view.worldH, -c.dim * 2);
    this.root.scale.setScalar(s);

    // Rotação: lenta, mais o progresso da narrativa e a inclinação do cursor
    if (!reduce) this.spinner.rotation.y += Math.min(dt, 1 / 20) * (0.08 + c.morph * 0.02);
    this.root.rotation.y = c.morph * 0.5 + this.pointerSmooth.x * 0.25;
    this.root.rotation.x = -this.pointerSmooth.y * 0.18 + 0.1;

    const m = c.morph;
    const pu = this.particles.material.uniforms;
    pu.uTime.value = this.time;
    pu.uMorph.value = m;
    pu.uIntro.value = c.intro;
    pu.uOpacity.value = (1 - smooth(2.6, 3.2, m) * 0.25 + smooth(3.4, 4.0, m) * 0.25) * (1 - c.dim * 0.8);

    // Cursor no plano z = 0 (mundo)
    pu.uMouse.value.set(
      (this.pointerSmooth.x * this.view.worldW) / 2,
      (this.pointerSmooth.y * this.view.worldH) / 2,
      0,
    );

    this.wire.material.opacity = smooth(1.4, 2.0, m) * (1 - smooth(2.8, 3.6, m)) * 0.35 * (1 - c.dim * 0.7);
    this.wire.visible = this.wire.material.opacity > 0.002;

    const gu = this.gem.material.uniforms;
    const build = smooth(2.2, 3.2, m);
    const polish = smooth(3.1, 4.0, m);
    gu.uTime.value = this.time;
    gu.uBuild.value = build;
    gu.uPolish.value = polish;
    gu.uDistort.value = THREE.MathUtils.lerp(0.22, 0.09, polish);
    gu.uOpacity.value = (1 - c.dim * 0.85) * c.intro;
    gu.uLight.value.set(this.pointerSmooth.x * 4 + 1.5, this.pointerSmooth.y * 4 + 2, 3);
    this.gem.visible = build > 0.001;
  }

  dispose() {
    this.disposed = true;
    this.stop();
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onPointer);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.particles.geometry.dispose();
    this.particles.material.dispose();
    this.wire.geometry.dispose();
    this.wire.material.dispose();
    this.gem.geometry.dispose();
    this.gem.material.dispose();
    this.renderer.dispose();
  }
}
