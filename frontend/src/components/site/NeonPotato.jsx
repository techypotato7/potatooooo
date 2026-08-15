import React, { useRef, useEffect } from "react";

// Cinematic blue "potato" circuit network — matches the Techy Potato logo reference.
// Sequence: particles fly in -> wireframe draws -> chip powers on -> energy pulses.
// Ambient: node pulse, flowing data particles, breathing chip, slow 3D rotation, cursor reactivity.
export default function NeonPotato() {
  const ref = useRef(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let seed = 20240607;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 4294967296;
    };
    const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

    // silhouette = union of two circles (big upper-right lobe, small lower-left lobe)
    const CIRCLES = [
      { cx: 0.16, cy: -0.16, r: 0.62 },
      { cx: -0.26, cy: 0.32, r: 0.46 },
    ];
    const inside = (x, y) => CIRCLES.some((c) => Math.hypot(x - c.cx, y - c.cy) < c.r);
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

    const CHIP = { x: 0.28, y: -0.04 };
    let nodes = [], edges = [], perim = [], parts = [];

    const build = () => {
      nodes = []; edges = []; perim = []; parts = [];
      const P = 56;
      for (let i = 0; i < P; i++) {
        const a = (i / P) * Math.PI * 2;
        const r = outline(a);
        nodes.push(makeNode(Math.cos(a) * r, Math.sin(a) * r, 1.7 + rnd() * 1.1, true));
        perim.push(i);
      }
      let tries = 0, got = 0;
      while (got < 50 && tries < 700) {
        tries++;
        const x = (rnd() * 2 - 1) * 0.88, y = (rnd() * 2 - 1) * 0.88;
        if (inside(x, y)) { nodes.push(makeNode(x, y, 1.2 + rnd() * 1.3, false)); got++; }
      }
      for (let i = 0; i < P; i++) edges.push({ a: perim[i], b: perim[(i + 1) % P] });
      const TH = 0.31;
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++) {
          if (i < P && j < P && Math.abs(i - j) === 1) continue;
          if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < TH)
            edges.push({ a: i, b: j });
        }
      // order edges by distance of midpoint to chip (draw outward from chip)
      edges.forEach((e) => {
        const mx = (nodes[e.a].x + nodes[e.b].x) / 2, my = (nodes[e.a].y + nodes[e.b].y) / 2;
        e.d = Math.hypot(mx - CHIP.x, my - CHIP.y);
      });
      edges.sort((a, b) => a.d - b.d);
      edges.forEach((e, i) => { e.order = i; });
      // flowing data particles (bias toward inner circuit edges)
      const pool = edges.slice(0, Math.floor(edges.length * 0.55));
      for (let i = 0; i < 24; i++) parts.push({ e: pool[Math.floor(rnd() * pool.length)], p: rnd(), sp: 0.15 + rnd() * 0.25 });
    };

    function makeNode(x, y, r0, per) {
      const ang = rnd() * Math.PI * 2;
      const dist = 1.6 + rnd() * 1.2;
      return {
        x, y, r0, per,
        sx: x + Math.cos(ang) * dist, sy: y + Math.sin(ang) * dist, // start pos (fly-in)
        delay: rnd() * 0.8,
        phase: rnd() * 6.283,
        jx: 0, jy: 0,
      };
    }

    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, S = 1, raf = null;
    const t0 = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2; cy = h / 2; S = Math.min(w, h) * 0.47;
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
      mouse.current.active = true;
    };
    const onLeave = () => { mouse.current.active = false; };

    const EDGE = "70,150,255", NODE = "150,210,255", CHIPC = "180,225,255", GLOW = "50,130,255";

    const frame = (now) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);

      // global slow rotation + subtle mouse tilt (3D feel)
      const mnx = mouse.current.active ? (mouse.current.x - cx) / w : 0;
      const mny = mouse.current.active ? (mouse.current.y - cy) / h : 0;
      const rot = (reduce ? 0 : Math.sin(t * 0.16) * 0.045) + mnx * 0.05;
      const breathe = reduce ? 1 : 1 + Math.sin(t * 0.8) * 0.015;
      const sc = S * breathe;

      ctx.save();
      ctx.translate(cx + mnx * 18, cy + mny * 12);
      ctx.rotate(rot);

      const nx = (n) => n._px, ny = (n) => n._py;
      // compute current positions (fly-in)
      for (const n of nodes) {
        const prog = reduce ? 1 : smooth((t - n.delay) / 0.85);
        const bx = n.sx + (n.x - n.sx) * prog;
        const by = n.sy + (n.y - n.sy) * prog;
        n._px = bx * sc + n.jx;
        n._py = by * sc + n.jy;
        n._app = prog;
      }

      // translucent glass silhouette fill (fades in during wireframe phase)
      const fillA = smooth((t - 1.4) / 1.2);
      if (fillA > 0.01) {
        ctx.save();
        ctx.beginPath();
        for (let k = 0; k < perim.length; k++) {
          const n = nodes[perim[k]];
          if (k === 0) ctx.moveTo(n._px, n._py); else ctx.lineTo(n._px, n._py);
        }
        ctx.closePath();
        ctx.clip();
        const g = ctx.createRadialGradient(CHIP.x * sc, CHIP.y * sc, 4, 0, 0, sc * 1.2);
        g.addColorStop(0, `rgba(60,140,255,${0.16 * fillA})`);
        g.addColorStop(1, `rgba(20,50,140,${0.02 * fillA})`);
        ctx.fillStyle = g;
        ctx.fillRect(-sc * 1.6, -sc * 1.6, sc * 3.2, sc * 3.2);
        ctx.restore();
      }

      // edges draw one-by-one, outward from chip
      ctx.lineWidth = 1;
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b];
        if (a._app < 0.99 || b._app < 0.99) continue;
        const start = 1.3 + e.order * 0.006;
        const dp = reduce ? 1 : smooth((t - start) / 0.35);
        if (dp <= 0) continue;
        const ex = a._px + (b._px - a._px) * dp;
        const ey = a._py + (b._py - a._py) * dp;
        const tw = reduce ? 0.6 : 0.4 + 0.35 * (Math.sin(t * 1.5 + a.phase) * 0.5 + 0.5);
        const bright = e.b < 56 && e.a < 56 ? 0.55 : 0.24;
        ctx.strokeStyle = `rgba(${EDGE},${bright * tw})`;
        ctx.beginPath(); ctx.moveTo(a._px, a._py); ctx.lineTo(ex, ey); ctx.stroke();
      }

      // flowing data particles along edges
      if (t > 2.2 && !reduce) {
        ctx.shadowColor = `rgba(${GLOW},0.9)`;
        for (const pt of parts) {
          pt.p += pt.sp * 0.016;
          if (pt.p > 1) { pt.p = 0; pt.e = edges[Math.floor(rnd() * Math.floor(edges.length * 0.55))]; }
          const a = nodes[pt.e.a], b = nodes[pt.e.b];
          const px = a._px + (b._px - a._px) * pt.p;
          const py = a._py + (b._py - a._py) * pt.p;
          ctx.shadowBlur = 8;
          ctx.fillStyle = `rgba(${CHIPC},0.9)`;
          ctx.beginPath(); ctx.arc(px, py, 1.6, 0, Math.PI * 2); ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // nodes with pulse + cursor reactivity
      const mx = mouse.current.active ? mouse.current.x - (cx + mnx * 18) : 1e9;
      const my = mouse.current.active ? mouse.current.y - (cy + mny * 12) : 1e9;
      ctx.shadowColor = `rgba(${GLOW},0.9)`;
      for (const n of nodes) {
        if (n._app < 0.05) continue;
        const tw = reduce ? 0.8 : 0.4 + 0.6 * (Math.sin(t * 1.8 + n.phase) * 0.5 + 0.5);
        // cursor proximity (positions are pre-rotation local coords; approx with rotated dist)
        const d = Math.hypot(n._px - mx, n._py - my);
        const near = mouse.current.active && d < 90 ? (1 - d / 90) : 0;
        n.jx += ((near ? (mx - n._px) * 0.06 : 0) - n.jx) * 0.1;
        n.jy += ((near ? (my - n._py) * 0.06 : 0) - n.jy) * 0.1;
        const r = n.r0 * (0.7 + 0.5 * tw + near * 0.8) * n._app;
        ctx.shadowBlur = 6 + near * 12;
        ctx.fillStyle = `rgba(${NODE},${(0.5 + 0.5 * tw) * n._app + near * 0.4})`;
        ctx.beginPath(); ctx.arc(n._px, n._py, r, 0, Math.PI * 2); ctx.fill();
      }

      // central microchip: power-on + breathing + circuit traces
      const chx = CHIP.x * sc, chy = CHIP.y * sc, cs = sc * 0.115;
      const power = smooth((t - 2.4) / 0.9);
      const breath = reduce ? 0.85 : 0.6 + 0.4 * (Math.sin(t * 2.2) * 0.5 + 0.5);
      const chipGlow = power * breath;
      // traces
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1.3;
      for (let k = 0; k < 10; k++) {
        const a = -0.5 + (k / 10) * Math.PI * 1.4; // bias to right hemisphere
        const len = cs * (1.7 + (k % 3) * 0.7);
        const tp = smooth((t - 2.5 - k * 0.03) / 0.4);
        if (tp <= 0) continue;
        ctx.strokeStyle = `rgba(${EDGE},${0.5 * chipGlow})`;
        const ex = chx + Math.cos(a) * (cs + (len - cs) * tp);
        const ey = chy + Math.sin(a) * (cs + (len - cs) * tp);
        ctx.beginPath(); ctx.moveTo(chx + Math.cos(a) * cs, chy + Math.sin(a) * cs); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.fillStyle = `rgba(${CHIPC},${0.8 * chipGlow * tp})`;
        ctx.beginPath(); ctx.arc(ex, ey, 1.3, 0, Math.PI * 2); ctx.fill();
      }
      // chip body
      if (power > 0.01) {
        ctx.shadowColor = `rgba(${GLOW},1)`;
        ctx.shadowBlur = 26 * chipGlow;
        ctx.fillStyle = `rgba(${CHIPC},${0.85 * chipGlow + 0.1})`;
        const rr = cs * 0.28, x0 = chx - cs, y0 = chy - cs, sz = cs * 2;
        ctx.beginPath();
        ctx.moveTo(x0 + rr, y0);
        ctx.arcTo(x0 + sz, y0, x0 + sz, y0 + sz, rr);
        ctx.arcTo(x0 + sz, y0 + sz, x0, y0 + sz, rr);
        ctx.arcTo(x0, y0 + sz, x0, y0, rr);
        ctx.arcTo(x0, y0, x0 + sz, y0, rr);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(6,12,26,0.55)";
        ctx.fillRect(chx - cs * 0.52, chy - cs * 0.52, cs * 1.04, cs * 1.04);
      }

      ctx.restore();
      raf = requestAnimationFrame(frame);
    };

    build();
    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" aria-hidden="true" />;
}
