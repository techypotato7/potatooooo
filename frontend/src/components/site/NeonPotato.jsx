import React, { useRef, useEffect } from "react";

// Animated neon low-poly "potato" network with a glowing central chip.
export default function NeonPotato() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // deterministic RNG
    let seed = 1337;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 4294967296;
    };

    // two overlapping circles form the potato silhouette (screen coords, y down)
    const CIRCLES = [
      { cx: 0.14, cy: -0.14, r: 0.6 },  // big upper-right lobe
      { cx: -0.24, cy: 0.3, r: 0.46 },  // small lower-left lobe
    ];
    const inside = (x, y) => CIRCLES.some((c) => Math.hypot(x - c.cx, y - c.cy) < c.r);
    // union outline radius from origin along angle
    const outline = (a) => {
      const dx = Math.cos(a), dy = Math.sin(a);
      let best = 0;
      for (const c of CIRCLES) {
        const b = dx * c.cx + dy * c.cy;
        const disc = b * b - (c.cx * c.cx + c.cy * c.cy - c.r * c.r);
        if (disc >= 0) {
          const t = b + Math.sqrt(disc);
          if (t > best) best = t;
        }
      }
      return best;
    };

    let nodes = [];
    let edges = [];
    let perimIdx = [];
    let chip = { x: 0.05, y: 0.02 };

    const build = () => {
      nodes = [];
      edges = [];
      perimIdx = [];
      const P = 56;
      for (let i = 0; i < P; i++) {
        const a = (i / P) * Math.PI * 2;
        const r = outline(a);
        nodes.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, phase: rnd() * 6.283, r0: 1.6 + rnd() * 1.2, per: true });
        perimIdx.push(i);
      }
      // interior nodes
      let tries = 0, got = 0;
      while (got < 48 && tries < 600) {
        tries++;
        const x = (rnd() * 2 - 1) * 0.85;
        const y = (rnd() * 2 - 1) * 0.85;
        if (inside(x, y)) {
          nodes.push({ x, y, phase: rnd() * 6.283, r0: 1.2 + rnd() * 1.4, per: false });
          got++;
        }
      }
      // perimeter loop edges
      for (let i = 0; i < P; i++) edges.push([perimIdx[i], perimIdx[(i + 1) % P]]);
      // proximity edges
      const TH = 0.3;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (i < P && j < P && Math.abs(i - j) === 1) continue;
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < TH) edges.push([i, j]);
        }
      }
    };

    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, S = 1, raf = null, t0 = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      S = Math.min(w, h) * 0.46;
    };

    const LIME = "217,248,68";

    const frame = (now) => {
      const t = (now - t0) / 1000;
      const breathe = reduce ? 1 : 1 + Math.sin(t * 0.9) * 0.02;
      const sc = S * breathe;
      ctx.clearRect(0, 0, w, h);

      const px = (n) => cx + n.x * sc;
      const py = (n) => cy + n.y * sc;

      // edges
      ctx.lineWidth = 1;
      for (const [i, j] of edges) {
        const a = nodes[i], b = nodes[j];
        const tw = reduce ? 0.6 : 0.45 + 0.4 * (Math.sin(t * 1.6 + a.phase) * 0.5 + 0.5);
        const bright = a.per && b.per ? 0.5 : 0.22;
        ctx.strokeStyle = `rgba(${LIME},${bright * tw})`;
        ctx.beginPath();
        ctx.moveTo(px(a), py(a));
        ctx.lineTo(px(b), py(b));
        ctx.stroke();
      }

      // traveling perimeter pulse
      const pulsePos = reduce ? -1 : Math.floor(((t * 0.18) % 1) * perimIdx.length);

      // nodes
      ctx.shadowColor = `rgba(${LIME},0.9)`;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const tw = reduce ? 0.8 : 0.35 + 0.65 * (Math.sin(t * 2 + n.phase) * 0.5 + 0.5);
        const isPulse = i === pulsePos;
        const r = n.r0 * (0.7 + 0.6 * tw) * (isPulse ? 2.1 : 1);
        ctx.shadowBlur = isPulse ? 16 : 6;
        ctx.fillStyle = `rgba(${LIME},${isPulse ? 1 : 0.5 + 0.5 * tw})`;
        ctx.beginPath();
        ctx.arc(px(n), py(n), r, 0, Math.PI * 2);
        ctx.fill();
      }

      // central chip
      const chx = cx + chip.x * sc, chy = cy + chip.y * sc;
      const cs = sc * 0.14;
      const chipPulse = reduce ? 0.8 : 0.55 + 0.45 * (Math.sin(t * 2.4) * 0.5 + 0.5);
      // traces
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(${LIME},${0.5 * chipPulse})`;
      ctx.lineWidth = 1.4;
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2 + 0.3;
        const len = cs * (1.6 + (k % 2) * 0.8);
        ctx.beginPath();
        ctx.moveTo(chx + Math.cos(a) * cs, chy + Math.sin(a) * cs);
        ctx.lineTo(chx + Math.cos(a) * len, chy + Math.sin(a) * len);
        ctx.stroke();
      }
      ctx.shadowColor = `rgba(${LIME},1)`;
      ctx.shadowBlur = 24 * chipPulse;
      ctx.fillStyle = `rgba(${LIME},${0.85 * chipPulse + 0.1})`;
      ctx.beginPath();
      const rr = cs * 0.28;
      const x0 = chx - cs, y0 = chy - cs, sz = cs * 2;
      ctx.moveTo(x0 + rr, y0);
      ctx.arcTo(x0 + sz, y0, x0 + sz, y0 + sz, rr);
      ctx.arcTo(x0 + sz, y0 + sz, x0, y0 + sz, rr);
      ctx.arcTo(x0, y0 + sz, x0, y0, rr);
      ctx.arcTo(x0, y0, x0 + sz, y0, rr);
      ctx.fill();
      // chip inner
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(10,12,4,0.55)";
      ctx.fillRect(chx - cs * 0.55, chy - cs * 0.55, cs * 1.1, cs * 1.1);

      if (!reduce) raf = requestAnimationFrame(frame);
    };

    build();
    resize();
    window.addEventListener("resize", resize);
    if (reduce) frame(performance.now());
    else raf = requestAnimationFrame(frame);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" aria-hidden="true" />;
}
