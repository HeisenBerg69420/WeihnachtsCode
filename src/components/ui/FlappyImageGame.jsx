import React, { memo, useEffect, useMemo, useRef, useState } from "react";

/**
 * FlappyImageGame
 * Props:
 * - birdSrc: string (URL oder /public/... Pfad)
 * - width, height: number (Canvas Größe)
 */
const FlappyImageGame = ({ birdSrc, width = 420, height = 640 }) => {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);

    // Game state (for UI only)
    const [status, setStatus] = useState("ready"); // ready | running | gameover
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);

    // Asset
    const birdImgRef = useRef(null);

    // HiDPI scaling
    const dpr = useMemo(() => (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1), []);

    // Internal game state (mutable, no rerender each frame)
    const G = useRef({
        tPrev: 0,
        // physics
        gravity: 1800, // px/s^2
        flapV: -520, // px/s
        // bird
        bird: { x: 120, y: height * 0.45, vy: 0, r: 18 }, // r used for collision
        // pipes
        pipes: [],
        pipeW: 70,
        gap: 160,
        pipeSpeed: 220, // px/s
        spawnEvery: 1.25, // sec
        spawnAcc: 0,
        // scoring
        score: 0,
        passed: new Set(),
        // cosmetic
        shake: 0,
    });

    const reset = (mode = "ready") => {
        const g = G.current;
        g.tPrev = 0;
        g.bird.x = 120;
        g.bird.y = height * 0.45;
        g.bird.vy = 0;
        g.pipes = [];
        g.spawnAcc = 0;
        g.score = 0;
        g.passed = new Set();
        g.shake = 0;
        setScore(0);
        setStatus(mode);
    };

    const start = () => {
        if (status === "running") return;
        reset("running");
    };

    const gameOver = () => {
        setStatus((s) => {
            if (s !== "gameover") return "gameover";
            return s;
        });
        setBest((b) => Math.max(b, G.current.score));
    };

    const flap = () => {
        if (status === "ready") {
            start();
        }
        if (status !== "running") return;
        const g = G.current;
        g.bird.vy = g.flapV;
        g.shake = 1; // tiny feedback
    };

    // Load image
    useEffect(() => {
        const img = new Image();
        img.src = birdSrc;
        img.onload = () => {
            birdImgRef.current = img;
        };
        img.onerror = () => {
            // fallback: keep null; we draw a circle instead
            birdImgRef.current = null;
        };
    }, [birdSrc]);

    // Input handlers
    useEffect(() => {
        const onKey = (e) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                e.preventDefault();
                flap();
            }
            if (e.code === "Enter" && status === "gameover") {
                reset("ready");
            }
            if (e.code === "KeyR") {
                reset("ready");
            }
        };

        window.addEventListener("keydown", onKey, { passive: false });
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    // Click/touch on canvas
    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;

        const onPointer = (e) => {
            e.preventDefault();
            flap();
        };

        c.addEventListener("pointerdown", onPointer, { passive: false });
        return () => c.removeEventListener("pointerdown", onPointer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    // Game loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        // Setup HiDPI
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const spawnPipe = () => {
            const g = G.current;
            const margin = 70;
            const maxTop = height - margin - g.gap;
            const topH = Math.max(margin, Math.min(maxTop, margin + Math.random() * (maxTop - margin)));
            g.pipes.push({
                id: Math.random().toString(36).slice(2),
                x: width + 30,
                topH,
            });
        };

        const circleRectCollide = (cx, cy, cr, rx, ry, rw, rh) => {
            const closestX = Math.max(rx, Math.min(cx, rx + rw));
            const closestY = Math.max(ry, Math.min(cy, ry + rh));
            const dx = cx - closestX;
            const dy = cy - closestY;
            return dx * dx + dy * dy <= cr * cr;
        };

        const drawRoundedRect = (x, y, w, h, r) => {
            const rr = Math.min(r, w / 2, h / 2);
            ctx.beginPath();
            ctx.moveTo(x + rr, y);
            ctx.arcTo(x + w, y, x + w, y + h, rr);
            ctx.arcTo(x + w, y + h, x, y + h, rr);
            ctx.arcTo(x, y + h, x, y, rr);
            ctx.arcTo(x, y, x + w, y, rr);
            ctx.closePath();
        };

        const render = (t) => {
            const g = G.current;
            if (!g.tPrev) g.tPrev = t;
            const dt = Math.min(0.033, (t - g.tPrev) / 1000);
            g.tPrev = t;

            // Update
            if (status === "running") {
                // spawn
                g.spawnAcc += dt;
                if (g.spawnAcc >= g.spawnEvery) {
                    g.spawnAcc = 0;
                    spawnPipe();
                }

                // bird physics
                g.bird.vy += g.gravity * dt;
                g.bird.y += g.bird.vy * dt;

                // pipes move
                for (const p of g.pipes) p.x -= g.pipeSpeed * dt;
                // remove off-screen
                g.pipes = g.pipes.filter((p) => p.x + g.pipeW > -20);

                // scoring
                for (const p of g.pipes) {
                    const passX = p.x + g.pipeW;
                    if (passX < g.bird.x && !g.passed.has(p.id)) {
                        g.passed.add(p.id);
                        g.score += 1;
                        setScore(g.score);
                    }
                }

                // collisions: floor/ceiling
                if (g.bird.y - g.bird.r < 0 || g.bird.y + g.bird.r > height) {
                    gameOver();
                }

                // collisions: pipes
                for (const p of g.pipes) {
                    const topRect = { x: p.x, y: 0, w: g.pipeW, h: p.topH };
                    const bottomY = p.topH + g.gap;
                    const bottomRect = { x: p.x, y: bottomY, w: g.pipeW, h: height - bottomY };

                    const hitTop = circleRectCollide(g.bird.x, g.bird.y, g.bird.r, topRect.x, topRect.y, topRect.w, topRect.h);
                    const hitBot = circleRectCollide(g.bird.x, g.bird.y, g.bird.r, bottomRect.x, bottomRect.y, bottomRect.w, bottomRect.h);

                    if (hitTop || hitBot) {
                        gameOver();
                        break;
                    }
                }
            } else if (status === "ready") {
                // idle bob
                g.bird.y = height * 0.45 + Math.sin(t / 250) * 8;
                g.bird.vy = 0;
            }

            // tiny shake decay
            g.shake = Math.max(0, g.shake - dt * 4);

            // Draw background
            ctx.clearRect(0, 0, width, height);

            // gradient sky
            const grad = ctx.createLinearGradient(0, 0, 0, height);
            grad.addColorStop(0, "#fff8ee");
            grad.addColorStop(0.5, "#fde8e8");
            grad.addColorStop(1, "#eef7f1");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            // subtle dots texture
            ctx.globalAlpha = 0.04;
            ctx.fillStyle = "#000";
            for (let y = 10; y < height; y += 30) {
                for (let x = 10; x < width; x += 30) {
                    ctx.fillRect(x, y, 1, 1);
                }
            }
            ctx.globalAlpha = 1;

            // pipes
            const pipeFill = "#14532d"; // deep green
            const pipeHi = "rgba(255,255,255,0.18)";
            for (const p of g.pipes) {
                const x = p.x;
                const topH = p.topH;
                const bottomY = topH + g.gap;

                // top pipe
                ctx.fillStyle = pipeFill;
                drawRoundedRect(x, 0, g.pipeW, topH, 14);
                ctx.fill();
                // highlight
                ctx.fillStyle = pipeHi;
                ctx.fillRect(x + 10, 8, 6, Math.max(0, topH - 16));

                // bottom pipe
                ctx.fillStyle = pipeFill;
                drawRoundedRect(x, bottomY, g.pipeW, height - bottomY, 14);
                ctx.fill();
                ctx.fillStyle = pipeHi;
                ctx.fillRect(x + 10, bottomY + 8, 6, Math.max(0, height - bottomY - 16));

                // pipe caps
                ctx.globalAlpha = 0.12;
                ctx.fillStyle = "#000";
                ctx.fillRect(x, topH - 10, g.pipeW, 10);
                ctx.fillRect(x, bottomY, g.pipeW, 10);
                ctx.globalAlpha = 1;
            }

            // ground
            ctx.globalAlpha = 0.12;
            ctx.fillStyle = "#000";
            ctx.fillRect(0, height - 8, width, 8);
            ctx.globalAlpha = 1;

            // Bird draw (with tiny shake)
            const shakeX = (Math.random() - 0.5) * 4 * g.shake;
            const shakeY = (Math.random() - 0.5) * 4 * g.shake;

            const bx = g.bird.x + shakeX;
            const by = g.bird.y + shakeY;

            // bird rotation by velocity
            const rot = Math.max(-0.6, Math.min(1.1, g.bird.vy / 600));

            ctx.save();
            ctx.translate(bx, by);
            ctx.rotate(rot);

            const img = birdImgRef.current;
            if (img) {
                // draw clipped circle avatar
                const size = g.bird.r * 2.2;
                ctx.beginPath();
                ctx.arc(0, 0, g.bird.r, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();

                // cover-like draw
                const iw = img.naturalWidth || 1;
                const ih = img.naturalHeight || 1;
                const scale = Math.max(size / iw, size / ih);
                const dw = iw * scale;
                const dh = ih * scale;
                ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);

                // rim
                ctx.globalAlpha = 0.22;
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(0, 0, g.bird.r, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
            } else {
                // fallback circle
                ctx.fillStyle = "#fb7185";
                ctx.beginPath();
                ctx.arc(0, 0, g.bird.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "rgba(255,255,255,0.25)";
                ctx.lineWidth = 4;
                ctx.stroke();
            }

            ctx.restore();

            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, width, height, dpr]);

    // Keep best synced
    useEffect(() => {
        setBest((b) => Math.max(b, score));
    }, [score]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-[#fff8ee] via-[#fde8e8] to-[#eef7f1]">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6 items-start">
                {/* Game */}
                <div className="relative rounded-3xl border border-white/60 bg-white/45 backdrop-blur-xl shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-rose-300/35 blur-3xl" />
                        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-green-300/25 blur-3xl" />
                    </div>

                    <div className="relative p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1 rounded-full bg-white/70 border border-white/70 text-xs font-bold tracking-[0.2em] uppercase text-rose-700">
                                    Flappy Memory
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-800">
                                <span>Score: {score}</span>
                                <span className="opacity-60">Best: {best}</span>
                            </div>
                        </div>

                        <canvas
                            ref={canvasRef}
                            className="block rounded-2xl border border-white/60 bg-white/20"
                            aria-label="Flappy image game canvas"
                        />

                        {/* Overlay UI */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {status === "ready" && (
                                <div className="pointer-events-none text-center px-6">
                                    <div className="text-4xl font-serif-art text-gray-900 mb-2">Tap to start</div>
                                    <div className="text-sm font-bold tracking-[0.2em] uppercase text-gray-700/70">
                                        Space / Click / Tap to flap
                                    </div>
                                </div>
                            )}

                            {status === "gameover" && (
                                <div className="pointer-events-auto text-center px-6">
                                    <div className="text-4xl font-serif-art text-gray-900 mb-2">Game Over</div>
                                    <div className="text-sm font-bold tracking-[0.2em] uppercase text-gray-700/70 mb-5">
                                        Press Enter to restart • or click below
                                    </div>
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            className="px-5 py-3 rounded-full bg-gray-900 text-white font-bold shadow-xl hover:bg-gray-800 transition"
                                            onClick={() => reset("ready")}
                                        >
                                            Restart
                                        </button>
                                        <button
                                            className="px-5 py-3 rounded-full bg-white/70 border border-white/70 font-bold shadow hover:bg-white/85 transition"
                                            onClick={() => start()}
                                        >
                                            Play
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Invisible click catcher for ready/running */}
                        <div
                            className="absolute inset-0"
                            style={{ pointerEvents: status === "running" ? "none" : "auto" }}
                            onClick={() => flap()}
                        />
                    </div>
                </div>

                {/* Side Panel */}
                <div className="rounded-3xl border border-white/60 bg-white/45 backdrop-blur-xl shadow-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-full bg-white/70 border border-white/70 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">How to play</div>
                            <div className="text-xs text-gray-700/70">1 point per pipe</div>
                        </div>
                    </div>

                    <ul className="text-sm text-gray-800 space-y-2">
                        <li>• Space / ArrowUp / Click / Tap = flap</li>
                        <li>• Avoid the green pipes</li>
                        <li>• Press <b>R</b> to reset anytime</li>
                    </ul>

                    <div className="mt-5 p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
                        <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-rose-700 mb-2">
                            <StarsIcon />
                            Bird image
                        </div>
                        <div className="text-sm text-gray-800">
                            Set <code className="px-1 rounded bg-white/70 border border-white/70">birdSrc</code> to any image URL.
                        </div>
                    </div>

                    <div className="mt-5">
                        <button
                            className="w-full px-5 py-3 rounded-full bg-gray-900 text-white font-bold shadow-xl hover:bg-gray-800 transition"
                            onClick={() => (status === "running" ? reset("ready") : start())}
                        >
                            {status === "running" ? "Stop" : "Play"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Tiny icon helper (keeps imports simple)
const StarsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
        <path
            fill="currentColor"
            d="M12 2l1.8 5.6H20l-4.5 3.3L17.3 17 12 13.7 6.7 17l1.8-6.1L4 7.6h6.2L12 2z"
        />
    </svg>
);

export default memo(FlappyImageGame);
